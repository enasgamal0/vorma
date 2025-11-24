<template>
  <v-app>
    <transition name="fadeInUp" mode="out-in">
      <router-view />
    </transition>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import initAutoLogout from "./plugins/autoLogout";

export default {
  name: "App",

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      getAuthenticatedUserData: "AuthenticationModule/getAuthenticatedUserData",
      notificationsData: "NotificationsModule/notificationsData",
    }),
    // End:: Vuex Getters
  },

  data() {
    return {
      receivedMessages: [],
      notificationCount: 0,
      // Start:: Notifications Menu Control Data
      notificationsMenuIsOpen: false,
      // End:: Notifications Menu Control Data

      // Start:: User Profile Modal Controlling Data
      userProfileModalIsOpen: false,
      // End:: User Profile Modal Controlling Data
    };
  },

  methods: {
    // Start:: Vuex Actions
    ...mapActions({
      readAllNotifications: "NotificationsModule/readAllNotifications",
    }),
    // End:: Vuex Actions
  },

  watch: {
    // Re-initialize auto logout when authentication state changes
    getAuthenticatedUserData: {
      handler() {
        // Re-initialize auto logout when user logs in/out
        initAutoLogout();
      },
      immediate: false,
    },
  },

  created() {
    // this.getData();
    this.readAllNotifications();

    navigator.serviceWorker.addEventListener("message", (event) => {
      console.log("message", event);
      this.readAllNotifications();
    });

    // Initialize auto logout on app creation
    initAutoLogout();
  },
};
</script>
