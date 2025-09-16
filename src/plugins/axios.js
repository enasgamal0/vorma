import axios from "axios";
import router from "../router";
import store from "../store";

// **** CONSTS
const USER_TOKEN =
  store.getters["AuthenticationModule/getAuthenticatedUserData"].token;
const CURRENT_LANG = store.getters["AppLangModule/getAppLocale"] || 'ar';

// Global headers
// https://backend.vorma.net
axios.defaults.baseURL =
  "https://backend.vorma.moltaqadev.com/dashboard-api/v1/";

axios.defaults.headers.common["cache-control"] = "no-cache";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Accept-Language"] = CURRENT_LANG;
axios.defaults.headers.common["Api-Version"] = "v1";
axios.defaults.headers.common["Api-Key"] =
  "QVER63S8aTEhjdMTr5av8Y6EPBhEd6";

// Set Token If Exists
if (USER_TOKEN) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + USER_TOKEN;
}

// Add Request Interceptors
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    if (error.response.status === 403) {
      router.replace("/forbidden");
    }
    if (error.response.status === 401) {
      localStorage.removeItem("vorma_admin_dashboard_user_id");
      localStorage.removeItem("vorma_admin_dashboard_user_token");
      localStorage.removeItem("vorma_admin_dashboard_userName");
      router.replace("/");
    }
    return Promise.reject(error);
  }
);

// Add Response Interceptors
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 403) {
      router.replace("/forbidden");
    }
    if (error.response.status === 401) {
      localStorage.removeItem("vorma_admin_dashboard_user_id");
      localStorage.removeItem("vorma_admin_dashboard_user_token");
      localStorage.removeItem("vorma_admin_dashboard_userName");
      router.replace("/");
    }
    return Promise.reject(error);
  }
);

export default axios;
