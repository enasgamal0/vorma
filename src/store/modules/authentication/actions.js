import router from "../../../router/index.js";
import axios from "axios";

export default {
  // Start:: Set Authenticated User Data
  setAuthenticatedUserData(context, payload) {
    context.commit("setAuthenticatedUserData", payload);
  },
  // End:: Set Authenticated User Data

  // Start:: Logout
  async logout() {
    try {
      await axios({
        method: "POST",
        url: `auth/logout`,
      });
      
      // Clear session storage
      sessionStorage.removeItem("vorma_admin_dashboard_user_id");
      sessionStorage.removeItem("vorma_admin_dashboard_user_token");
      sessionStorage.removeItem("vorma_admin_dashboard_userName");
      sessionStorage.removeItem("vorma_admin_roles");
      sessionStorage.removeItem("vorma_admin_dashboard_user_type");
      sessionStorage.removeItem("vorma_admin_dashboard_email");
      sessionStorage.removeItem("vorma_admin_dashboard_user_avatar");
      sessionStorage.removeItem("vorma_admin_dashboard_user_ability");
      
      // Broadcast logout event to all tabs using localStorage
      // This will trigger the storage event in other tabs
      localStorage.setItem("vorma_admin_logout_event", Date.now().toString());
      // Remove it immediately to allow future logout events
      setTimeout(() => {
        localStorage.removeItem("vorma_admin_logout_event");
      }, 100);
      
      router.replace("/");
      location.reload();
    } catch (error) {
      console.log(error.response.data.message);
      // Even if API fails, still clear local data and broadcast logout
      sessionStorage.removeItem("vorma_admin_dashboard_user_id");
      sessionStorage.removeItem("vorma_admin_dashboard_user_token");
      sessionStorage.removeItem("vorma_admin_dashboard_userName");
      sessionStorage.removeItem("vorma_admin_roles");
      sessionStorage.removeItem("vorma_admin_dashboard_user_type");
      sessionStorage.removeItem("vorma_admin_dashboard_email");
      sessionStorage.removeItem("vorma_admin_dashboard_user_avatar");
      sessionStorage.removeItem("vorma_admin_dashboard_user_ability");
      
      // Broadcast logout event to all tabs
      localStorage.setItem("vorma_admin_logout_event", Date.now().toString());
      setTimeout(() => {
        localStorage.removeItem("vorma_admin_logout_event");
      }, 100);
      
      router.replace("/");
      location.reload();
    }
  },
  // END:: Logout
};
