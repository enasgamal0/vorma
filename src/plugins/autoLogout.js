import store from "../store";
import router from "../router";

/**
 * Auto Logout Plugin
 * Handles automatic logout when:
 * - User closes ALL tabs/windows (not just one)
 * - Internet connection is lost
 */

// Constants for tab tracking
const TAB_TRACKING_KEY = "vorma_admin_active_tabs";
const HEARTBEAT_INTERVAL = 2000; // 2 seconds
const TAB_TIMEOUT = 4000; // Consider tab inactive if no heartbeat for 4 seconds (2x heartbeat interval)
const CHECK_DELAY = 500; // Delay before checking if other tabs are active (allows time for storage events)

// Generate unique tab ID
function generateTabId() {
  return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get current tab ID (stored in sessionStorage)
function getTabId() {
  let tabId = sessionStorage.getItem("vorma_admin_tab_id");
  if (!tabId) {
    tabId = generateTabId();
    sessionStorage.setItem("vorma_admin_tab_id", tabId);
  }
  return tabId;
}

// Get all active tabs from localStorage
function getActiveTabs() {
  try {
    const tabs = localStorage.getItem(TAB_TRACKING_KEY);
    return tabs ? JSON.parse(tabs) : {};
  } catch (error) {
    return {};
  }
}

// Save active tabs to localStorage
function saveActiveTabs(tabs) {
  try {
    localStorage.setItem(TAB_TRACKING_KEY, JSON.stringify(tabs));
  } catch (error) {
    console.error("Failed to save active tabs:", error);
  }
}

// Register this tab as active
function registerTab() {
  const tabId = getTabId();
  const tabs = getActiveTabs();
  tabs[tabId] = Date.now();
  saveActiveTabs(tabs);
}

// Update this tab's heartbeat
function updateHeartbeat() {
  const tabId = getTabId();
  const tabs = getActiveTabs();
  
  // Clean up stale tabs (tabs that haven't updated in TAB_TIMEOUT ms)
  const now = Date.now();
  Object.keys(tabs).forEach(id => {
    if (now - tabs[id] > TAB_TIMEOUT) {
      delete tabs[id];
    }
  });
  
  // Update this tab's heartbeat
  tabs[tabId] = now;
  saveActiveTabs(tabs);
}

// Unregister this tab
function unregisterTab() {
  const tabId = getTabId();
  const tabs = getActiveTabs();
  delete tabs[tabId];
  saveActiveTabs(tabs);
}

// Check if any other tabs are still active (with cleanup of stale tabs)
function hasOtherActiveTabs() {
  const tabId = getTabId();
  const tabs = getActiveTabs();
  const now = Date.now();
  
  // Clean up stale tabs first (tabs that haven't updated in TAB_TIMEOUT ms)
  let hasStaleTabs = false;
  Object.keys(tabs).forEach(id => {
    if (now - tabs[id] > TAB_TIMEOUT) {
      delete tabs[id];
      hasStaleTabs = true;
    }
  });
  
  // Save cleaned up tabs if we removed any
  if (hasStaleTabs) {
    saveActiveTabs(tabs);
  }
  
  // Remove this tab from consideration
  const otherTabs = { ...tabs };
  delete otherTabs[tabId];
  
  // Check if any other tab has a recent heartbeat
  // Use a more aggressive check - tabs should update every 2 seconds (HEARTBEAT_INTERVAL)
  // So if a heartbeat is older than HEARTBEAT_INTERVAL + small buffer, consider it stale
  const activeThreshold = HEARTBEAT_INTERVAL + 1000; // 3 seconds (more aggressive)
  
  const hasActiveTabs = Object.keys(otherTabs).some(id => {
    const lastHeartbeat = otherTabs[id];
    const age = now - lastHeartbeat;
    return age < activeThreshold;
  });
  
  return hasActiveTabs;
}

// Check if this tab is the last remaining tab (after accounting for tabs that might be closing)
// This helps when multiple tabs in the same window close simultaneously
function isLastRemainingTab() {
  const tabId = getTabId();
  const tabs = getActiveTabs();
  const now = Date.now();
  const activeThreshold = HEARTBEAT_INTERVAL + 1000; // 3 seconds
  
  // Count active tabs (excluding this one)
  const activeOtherTabs = Object.keys(tabs).filter(id => {
    if (id === tabId) return false;
    const lastHeartbeat = tabs[id];
    const age = now - lastHeartbeat;
    return age < activeThreshold;
  });
  
  return activeOtherTabs.length === 0;
}

// Helper function to clear all authentication data from localStorage
function clearAuthData() {
  localStorage.removeItem("vorma_admin_dashboard_user_id");
  localStorage.removeItem("vorma_admin_dashboard_user_token");
  localStorage.removeItem("vorma_admin_dashboard_userName");
  localStorage.removeItem("vorma_admin_dashboard_user_type");
  localStorage.removeItem("vorma_admin_dashboard_email");
  localStorage.removeItem("vorma_admin_dashboard_user_avatar");
  localStorage.removeItem("vorma_admin_dashboard_user_ability");
  localStorage.removeItem("vorma_admin_roles");
  localStorage.removeItem(TAB_TRACKING_KEY);
}

// Helper function to check if user is authenticated
function isAuthenticated() {
  const token = localStorage.getItem("vorma_admin_dashboard_user_token");
  return !!token;
}

// Handle logout action
async function performLogout() {
  if (!isAuthenticated()) {
    return;
  }

  try {
    // Try to call the logout API
    await store.dispatch("AuthenticationModule/logout");
  } catch (error) {
    // If API call fails (e.g., no internet), still clear local data
    clearAuthData();
    router.replace("/");
    if (window.location) {
      window.location.reload();
    }
  }
}

// Track if this is a legitimate navigation (not a close)
// Use sessionStorage so it persists across page reloads but not tab closes
function setNavigationFlag() {
  sessionStorage.setItem("vorma_navigation_in_progress", "true");
  // Clear the flag after a short delay to allow pagehide to check it
  setTimeout(() => {
    sessionStorage.removeItem("vorma_navigation_in_progress");
  }, 100);
}

// Check if this is a legitimate navigation
function isNavigation() {
  return sessionStorage.getItem("vorma_navigation_in_progress") === "true";
}

// Handle pagehide event (more reliable than beforeunload)
// This fires when tab/window is closing or being hidden
function handlePageHide(event) {
  if (!isAuthenticated()) {
    unregisterTab();
    return;
  }

  // If the page is being persisted (cached by browser), don't logout
  if (event.persisted) {
    return;
  }

  // If this is a legitimate navigation, don't logout
  if (isNavigation()) {
    return;
  }

  // Clean up stale tabs and check synchronously if there are other active tabs/windows
  // This check happens BEFORE unregistering so we can see all active tabs
  let hasOtherTabs = hasOtherActiveTabs();
  
  // Unregister this tab immediately (this will trigger storage events in other tabs/windows)
  unregisterTab();
  
  // After unregistering, check again if we're the last remaining tab
  // This handles the case where multiple tabs in the same window close simultaneously
  // (e.g., closing a window with multiple tabs)
  if (!hasOtherTabs) {
    // Double-check after unregistering (tabs closing simultaneously might all see each other initially)
    hasOtherTabs = hasOtherActiveTabs();
  }
  
  // If this was the last tab/window, logout
  // This handles both single tab close and window close scenarios
  if (!hasOtherTabs) {
    // This is the last tab/window closing, perform logout immediately
    // Clear auth data synchronously to ensure it happens (critical for window close)
    clearAuthData();
    
    // Try to call logout API (may not complete if page is closing, but auth data is cleared)
    try {
      // Try async logout (may not complete, but auth data is already cleared)
      performLogout().catch(() => {
        // Ignore errors - auth data is already cleared
      });
    } catch (error) {
      // Ignore errors - auth data is already cleared
    }
  }
  // Otherwise, other tabs/windows will detect the change via storage event
  // and check if they're the last remaining tab/window
}

// Handle beforeunload event (less reliable, but good fallback)
// This fires when window/tab is closing
function handleBeforeUnload(event) {
  if (!isAuthenticated()) {
    unregisterTab();
    return;
  }

  // If this is a legitimate navigation, don't logout
  if (isNavigation()) {
    return;
  }

  // Clean up stale tabs and check if there are other active tabs/windows
  let hasOtherTabs = hasOtherActiveTabs();
  
  // Unregister this tab immediately (so other tabs can detect it)
  unregisterTab();

  // After unregistering, check again if we're the last remaining tab
  // This handles the case where multiple tabs in the same window close simultaneously
  if (!hasOtherTabs) {
    // Double-check after unregistering
    hasOtherTabs = hasOtherActiveTabs();
  }

  // If this was the last tab/window, clear auth data synchronously
  // This handles both tab close and window close scenarios
  if (!hasOtherTabs) {
    // This is the last tab/window closing, clear auth data immediately
    // This ensures logout happens on window close
    clearAuthData();
  }
  
  // Note: We can't reliably make async API calls in beforeunload
  // The pagehide handler will also handle the logout, but this ensures data is cleared
  // For window close, this synchronous clearing is critical
}

// Handle internet connection loss
function handleOffline() {
  if (!isAuthenticated()) {
    return;
  }

  // Perform logout when internet goes offline
  performLogout();
}

// Handle storage events (when other tabs update/close)
function handleStorageChange(event) {
  // Only react to changes in the tab tracking key
  if (event.key !== TAB_TRACKING_KEY) {
    return;
  }

  if (!isAuthenticated()) {
    return;
  }

  // A tab was closed or updated
  // Wait a bit to ensure the update is complete, then check if we're the last tab
  setTimeout(() => {
    // Double check authentication (another tab might have logged out)
    if (!isAuthenticated()) {
      return;
    }

    // Check if any other tabs are still active
    if (!hasOtherActiveTabs()) {
      // No other active tabs, perform logout
      performLogout();
    }
  }, CHECK_DELAY);
}

// Track if handlers are already initialized
let handlersInitialized = false;
let heartbeatInterval = null;

// Export function to mark navigation (call this before navigation/reload)
export function markNavigation() {
  setNavigationFlag();
}

// Initialize the auto logout handlers
export default function initAutoLogout() {
  // Only set up handlers if user is authenticated
  if (!isAuthenticated()) {
    handlersInitialized = false;
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }
    unregisterTab();
    return;
  }

  // Register this tab as active
  registerTab();

  // Prevent duplicate event listeners
  if (handlersInitialized) {
    // Update heartbeat even if already initialized (page might have been refreshed)
    updateHeartbeat();
    return;
  }

  // Start heartbeat interval to keep this tab marked as active
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  heartbeatInterval = setInterval(() => {
    if (isAuthenticated()) {
      updateHeartbeat();
    } else {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
      unregisterTab();
    }
  }, HEARTBEAT_INTERVAL);

  // Handle tab/window close (pagehide is more reliable)
  window.addEventListener("pagehide", handlePageHide);

  // Handle tab/window close (fallback)
  window.addEventListener("beforeunload", handleBeforeUnload);

  // Handle internet connection loss
  window.addEventListener("offline", handleOffline);

  // Handle storage changes (when other tabs close/update)
  window.addEventListener("storage", handleStorageChange);

  // Handle page visibility change (when tab becomes hidden/visible)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Tab is hidden, but still keep it active
      updateHeartbeat();
    } else {
      // Tab is visible again, update heartbeat
      if (isAuthenticated()) {
        updateHeartbeat();
      }
    }
  });

  handlersInitialized = true;
}

