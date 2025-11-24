<template>
  <div class="show_all_content_wrapper">
    <!-- Start:: Main Section -->
    <main>
      <!--  =========== Start:: Table Title =========== -->
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>{{ $t("PLACEHOLDERS.Overall_statistics") }}</h5>
        </div>
      </div>
      <!--  =========== End:: Table Title =========== -->

      <!--  =========== Start:: Data Table =========== -->
      <div class="statics mt-4" v-if="statics && Object.keys(statics).length > 0">
        <div class="row">
          <div
            class="col-lg-6 col-md-6 col-12"
            v-for="(value, key) in statics"
            :key="'i' + key"
          >
            <div class="box">
              <div class="icon">
                <i
                  v-if="key === 'users'"
                  class="fas fa-users"
                ></i>

                <i
                  v-else-if="key === 'sport_places'"
                  class="fas fa-dumbbell"
                ></i>

                <i
                  v-else-if="key === 'entertainment_places'"
                  class="fas fa-theater-masks"
                ></i>

                <i
                  v-else-if="key === 'sessions'"
                  class="fas fa-calendar-check"
                ></i>

              </div>

              <div class="info_box">
                <span v-if="key === 'users'">{{
                  $t("PLACEHOLDERS.total_users")
                }}</span>

                <span v-else-if="key === 'sport_places'">{{
                  $t("PLACEHOLDERS.sport_places_count")
                }}</span>

                <span v-else-if="key === 'entertainment_places'">{{
                  $t("PLACEHOLDERS.entertainment_places_count")
                }}</span>

                <span v-else-if="key === 'sessions'">{{
                  $t("PLACEHOLDERS.sessions_count")
                }}</span>
                <p class="number_box">{{ value }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  =========== End:: Data Table =========== -->
      <coming-soon v-else/>
    </main>
    <!-- End:: Main Section -->
  </div>
</template>

<script>
import ComingSoon from "@/components/ui/ComingSoon.vue";

export default {
  name: "HomePage",

  components: {
    ComingSoon,
  },

  data() {
    return {
      statics: null,
    };
  },

  methods: {
    async getStatics() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: "statistic",
        });
        console.log(res.data.data);
        this.statics = {
          users: res.data.data.users,
          sport_places: res.data.data.sport_places,
          entertainment_places: res.data.data.entertainment_places,
          sessions: res.data.data.sessions,
        };
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
  },

  mounted() {
    this.getStatics();
  },
};
</script>

<style lang="scss" scoped>
.show_all_content_wrapper {
  .statics {
    .box {
      background: #814686;
      padding: 25px;
      margin-bottom: 10px;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      justify-content: space-between;

      transition: all 0.5s;

      &:hover {
        background: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

        .icon {
          i {
            color: #814686;
          }
        }
        .info_box {
          span,
          p.number_box {
            color: #000;
          }
        }
      }

      .icon {
        height: 60px;
        min-width: 60px;
        width: 60px;
        border-radius: 60px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 25px;
          color: #000;
        }
      }

      .info_box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;

        span {
          font-size: 19px;
          color: #fff;
        }

        p.number_box {
          font-size: 30px;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }
}
.show_all_content_wrapper .statics .box .info_box{
  align-items: flex-start !important;
  width: 100% !important;
  padding-inline-start: 5% !important;
}
</style>
