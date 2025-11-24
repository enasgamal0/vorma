import AuthenticationMutations from "./mutations.js";
import AuthenticationActions from "./actions.js";
import AuthenticationGetters from "./getters.js";

export default {
  namespaced: true,

  state: {
    // START:: AUTHENTICATED USER DATA
    userId: sessionStorage.getItem("vorma_admin_dashboard_user_id"),
    userToken: sessionStorage.getItem("vorma_admin_dashboard_user_token"),
    userType: sessionStorage.getItem("vorma_admin_dashboard_user_type"),
    userName: sessionStorage.getItem("vorma_admin_dashboard_userName"),
    email: sessionStorage.getItem("vorma_admin_dashboard_email"),
    userAvatar: sessionStorage.getItem("vorma_admin_dashboard_user_avatar"),
    ability: sessionStorage.getItem("vorma_admin_dashboard_user_ability"),
    // END:: AUTHENTICATED USER DATA
  },

  mutations: AuthenticationMutations,
  actions: AuthenticationActions,
  getters: AuthenticationGetters,
};
