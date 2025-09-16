export default {
  // Start:: Set Authenticated User Data
  setAuthenticatedUserData(state, payload) {
    if (payload.id) {
      state.userId = payload.id;
      localStorage.setItem("vorma_admin_dashboard_user_id", payload.id);
    }
    if (payload.token) {
      state.userToken = payload.token;
      localStorage.setItem("vorma_admin_dashboard_user_token", payload.token);
    }
    if (payload.type) {
      state.userType = payload.type;
      localStorage.setItem("vorma_admin_dashboard_user_type", payload.type);
    }
    if (payload.name) {
      state.userName = payload.name;
      localStorage.setItem("vorma_admin_dashboard_userName", payload.name);
    }
    if (payload.email) {
      state.email = payload.email;
      localStorage.setItem("vorma_admin_dashboard_email", payload.email);
    }
    if (payload.image) {
      state.userAvatar = payload.image;
      localStorage.setItem(
        "vorma_admin_dashboard_user_avatar",
        payload.image
      );
    }
    if (payload.ability) {
      state.ability = payload.ability;
      localStorage.setItem(
        "vorma_admin_dashboard_user_ability",
        payload.ability
      );
    }
  },
  // End:: Set Authenticated User Data
};
