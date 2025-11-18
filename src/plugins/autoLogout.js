import store from "../store";
import router from "../router";

/**
 * Auto Logout Plugin
 * Handles automatic logout when:
 * - User closes tab/window (not on navigation/reload)
 * - Internet connection is lost
 */

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
function handlePageHide(event) {
  if (!isAuthenticated()) {
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

  // This is likely a tab/window close, clear auth data
  clearAuthData();
}

// Handle beforeunload event (less reliable, but good fallback)
function handleBeforeUnload(event) {
  if (!isAuthenticated()) {
    return;
  }

  // If this is a legitimate navigation, don't logout
  if (isNavigation()) {
    return;
  }

  // Clear authentication data on actual close
  // Note: We can't reliably make async API calls in beforeunload
  clearAuthData();
}

// Handle internet connection loss
function handleOffline() {
  if (!isAuthenticated()) {
    return;
  }

  // Perform logout when internet goes offline
  performLogout();
}

// Track if handlers are already initialized
let handlersInitialized = false;

// Export function to mark navigation (call this before navigation/reload)
export function markNavigation() {
  setNavigationFlag();
}

// Initialize the auto logout handlers
export default function initAutoLogout() {
  // Only set up handlers if user is authenticated
  if (!isAuthenticated()) {
    handlersInitialized = false;
    return;
  }

  // Prevent duplicate event listeners
  if (handlersInitialized) {
    return;
  }

  // Handle tab/window close (pagehide is more reliable)
  window.addEventListener("pagehide", handlePageHide);

  // Handle tab/window close (fallback)
  window.addEventListener("beforeunload", handleBeforeUnload);

  // Handle internet connection loss
  window.addEventListener("offline", handleOffline);

  handlersInitialized = true;
}

