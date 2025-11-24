import store from "../store";
import router from "../router";

/**
 * Auto Logout Plugin
 * Handles automatic logout when internet connection is lost
 */

// Helper function to clear all authentication data from sessionStorage
function clearAuthData() {
  sessionStorage.removeItem("vorma_admin_dashboard_user_id");
  sessionStorage.removeItem("vorma_admin_dashboard_user_token");
  sessionStorage.removeItem("vorma_admin_dashboard_userName");
  sessionStorage.removeItem("vorma_admin_dashboard_user_type");
  sessionStorage.removeItem("vorma_admin_dashboard_email");
  sessionStorage.removeItem("vorma_admin_dashboard_user_avatar");
  sessionStorage.removeItem("vorma_admin_dashboard_user_ability");
  sessionStorage.removeItem("vorma_admin_roles");
}

// Helper function to check if user is authenticated
function isAuthenticated() {
  const token = sessionStorage.getItem("vorma_admin_dashboard_user_token");
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

// Mark navigation to prevent false logout triggers during route changes
export function markNavigation() {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("vorma_admin_navigation_flag", "true");
    // Clear the flag after a short delay
    setTimeout(() => {
      sessionStorage.removeItem("vorma_admin_navigation_flag");
    }, 1000);
  }
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

  // Handle internet connection loss
  window.addEventListener("offline", handleOffline);

  handlersInitialized = true;
}

// Auto-initialize when module loads (for authenticated users)
if (typeof window !== 'undefined') {
  // Initialize if user is authenticated
  if (isAuthenticated()) {
    initAutoLogout();
  }

  // Listen for page load event to check authentication status
  window.addEventListener('load', () => {
    if (isAuthenticated() && !handlersInitialized) {
      initAutoLogout();
    }
  });
}
