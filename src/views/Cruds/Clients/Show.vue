<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.showClient") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #814686">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <!-- ==== Start:: Status Badges ==== -->
      <div class="badges_wrapper d-flex justify-content-between">
        <div class="wrapper">
          <v-chip color="amber darken-2" text-color="white">
            {{ $t("TITLES.numberOfVisits", { number: data.numberOfVisits }) }}
          </v-chip>
          <v-chip color="amber darken-2 mx-2" text-color="white" v-if="data.lastVisit">
            {{ $t("TITLES.lastVisit", { date: data.lastVisit }) }}
          </v-chip>
        </div>

        <v-chip :color="data.is_active ? 'green' : 'red'" text-color="white">
          {{ data.is_active ? $t("STATUS.active") : $t("STATUS.notActive") }}
        </v-chip>
      </div>
      <!-- ==== End:: Status Badges ==== -->
      <form>
        <div class="row">
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.client_name')"
            v-model.trim="data.client_name"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.user_name')"
            v-model.trim="data.user_name"
            disabled
          />
          <base-input
            v-if="data.mobile"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.phone')"
            v-model.trim="data.mobile"
            disabled
          />
          <base-input
            v-if="data.email"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
            disabled
          />
          <base-input
            v-if="data.gender"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.gender')"
            v-model.trim="data.gender"
            disabled
          />
          <base-input
            v-if="data.city"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.city')"
            v-model.trim="data.city"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.joiningDate')"
            v-model.trim="data.created_at"
            disabled
          />
          </div>
        </form>
      </div>
    </div>
    <!-- END:: Single Step Form Content -->
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import BasePhoneInput from "@/components/formInputs/BasePhoneInput.vue";

export default {
  name: "ShowClients",
  components: {
    BasePhoneInput,
  },
  data() {
    return {
      key: null,
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data
      isWhatsappSame: false,
      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        mobile: null,
        client_name: null,
        user_name: null,
        email: null,
        gender: null,
        city: null,
        is_active: true,
        created_at: null,
      },
      // End:: Data Collection To Send
    };
  },

  methods: {
    // start show data
    async showClient() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `users/${this.$route.params?.id}`,
        });
        this.data.client_name = res.data.data.User?.user?.name;
        this.data.user_name = res.data.data.User?.user?.username;
        this.data.mobile = res.data.data.User?.user?.mobile;
        this.data.email = res.data.data.User?.user?.email;
        this.data.gender = res.data.data.User?.user?.gender;
        this.data.city = res.data.data.User?.user?.city?.name || res.data.data.User?.user?.city;
        this.data.created_at = res.data.data.User?.user?.created_at;
        this.data.is_active = res.data.data.User?.user?.is_active;
        this.data.numberOfVisits = res.data.data.User?.user?.login_numbers;
        this.data.lastVisit = res.data.data.User?.user?.last_login_date;
      } catch (error) {
        this.loading = false;
        console.log(error?.response?.data?.message);
      }
    },
    // end show data
    dialCode(dialCode) {
      this.data.dial_code = dialCode;
    },

    dialCodeWhatsapp(dialCode) {
      this.data.dial_code_whatsapp = dialCode;
    },
  },
  
  async created() {
    // Start:: Fire Methods
    this.showClient();
    // End:: Fire Methods;
  },
};
</script>
