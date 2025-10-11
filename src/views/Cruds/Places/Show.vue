<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.show_place") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #814686">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Loading State -->
    <div v-if="isLoadingData" class="text-center my-5">
      <v-progress-circular indeterminate color="#814686"></v-progress-circular>
    </div>
    <!-- End:: Loading State -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper" v-else>
      <form>
        <div class="row">
          <!-- Start:: Multi Image Upload Input -->
          <div class="d-flex flex-wrap justify-center items-center gap-5">
            <div
              v-for="(img, index) in imgUrls"
              :key="index"
              class="mb-5"
            >
              <img :src="img" style="max-width: 150px; border-radius: 20px" />
            </div>
          </div>
          <!-- End:: Multi Image Upload Input -->

          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.place_name_ar')"
            v-model.trim="data.nameAr"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.place_name_en')"
            v-model.trim="data.nameEn"
            disabled
          />
          <!-- End:: Name Input -->

          <!-- Start:: City Select -->
          <base-select-input
            col="6"
            :optionsList="cities"
            :placeholder="$t('PLACEHOLDERS.city')"
            v-model="data.cityId"
            disabled
          />
          <!-- End:: City Select -->

          <!-- Start:: Type Select -->
          <base-select-input
            col="6"
            :optionsList="placeTypes"
            :placeholder="$t('PLACEHOLDERS.type')"
            v-model="data.type"
            disabled
          />
          <!-- End:: Type Select -->

          <!-- Start:: Description Input -->
          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.description_ar')"
            v-model.trim="data.descriptionAr"
            disabled
          />
          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.description_en')"
            v-model.trim="data.descriptionEn"
            disabled
          />
          <!-- End:: Description Input -->

          <!-- Start:: Activities Checkboxes -->
          <div class="col-12 my-4">
            <h5 style="color: #814686">
              {{ $t("PLACEHOLDERS.activities") }}
            </h5>
            <div class="row mt-3">
              <div
                class="col-4"
                v-for="activity in activities"
                :key="activity.id"
              >
                <input
                  type="checkbox"
                  :id="activity.id"
                  class="activityCheckbox"
                  v-model="data.selectedActivities"
                  :value="activity.id"
                  style="
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    margin-top: 3px;
                  "
                  disabled
                />
                <label
                  style="font-size: 16px; color: #814686"
                  :for="activity.id"
                  class="mx-3"
                  >{{ activity.name }}</label
                >
              </div>
            </div>
          </div>
          <!-- End:: Activities Checkboxes -->

          <!-- Start:: Sports Section (Only for sport type) -->
          <div class="col-12" v-if="data.type?.id == 'sport'">
            <hr class="my-5" style="width: 97%" />
            <h5 style="color: #814686">
              {{ $t("PLACEHOLDERS.available_sports") }}
            </h5>
            <div
              class="col-12"
              v-for="(sport, index) in data.sports"
              :key="'sport' + index"
            >
              <label
                style="font-size: 16px; color: #814686"
                class="font-weight-bold mb-4"
                >{{ $t("PLACEHOLDERS.sport1") }} #{{ index + 1 }}</label
              >
              <div class="row">
                <base-input
                  col="6"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.sport_name_ar')"
                  v-model.trim="sport.nameAr"
                  disabled
                />
                <base-input
                  col="6"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.sport_name_en')"
                  v-model.trim="sport.nameEn"
                  disabled
                />
              </div>

              <hr class="my-5" style="width: 97%" />
            </div>
          </div>
          <!-- End:: Sports Section -->

          <!-- Start:: Services Section -->
          <div class="col-12">
            <h5 style="color: #814686">
              {{ $t("PLACEHOLDERS.available_services") }}
            </h5>
            <div
              class="col-12"
              v-for="(service, index) in data.services"
              :key="'service' + index"
            >
              <label
                style="font-size: 16px; color: #814686"
                class="font-weight-bold mb-4"
                >{{ $t("PLACEHOLDERS.service") }} #{{ index + 1 }}</label
              >
              <div class="row">
                <base-input
                  col="6"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.service_name_ar')"
                  v-model.trim="service.nameAr"
                  disabled
                />
                <base-input
                  col="6"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.service_name_en')"
                  v-model.trim="service.nameEn"
                  disabled
                />
              </div>
              <hr class="my-5" style="width: 97%" />
            </div>
          </div>
          <!-- End:: Services Section -->

          <!-- Start:: Working Hours Section -->
          <div class="col-12">
            <h5 style="color: #814686">
              {{ $t("PLACEHOLDERS.working_hours") }}
            </h5>
            <div
              class="row my-3"
              v-for="(workingHour, index) in data.workingHours"
              :key="'hour' + index"
            >
              <div class="col-12 mb-2">
                <label
                  style="font-size: 16px; color: #814686"
                  class="font-weight-bold mb-2"
                  >{{ $t("PLACEHOLDERS.day") }} #{{ index + 1 }}</label
                >
              </div>
              <base-select-input
                col="4"
                :optionsList="getAvailableDays(index)"
                :placeholder="$t('PLACEHOLDERS.day')"
                v-model="workingHour.day"
                disabled
              />
              <div class="col-4">
                <base-input
                  type="time"
                  :placeholder="$t('PLACEHOLDERS.from')"
                  v-model="workingHour.from"
                  disabled
                />
              </div>
              <div class="col-4">
                <base-input
                  type="time"
                  :placeholder="$t('PLACEHOLDERS.to')"
                  v-model="workingHour.to"
                  disabled
                />
              </div>
              <hr
                class="my-3"
                style="width: 97%"
                v-if="index < data.workingHours.length - 1"
              />
            </div>
          </div>
          <!-- End:: Working Hours Section -->

          <!-- Start:: Notes Input (Optional) -->
          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.notes_ar')"
            v-model.trim="data.notesAr"
            disabled
            v-if="data.notesAr"
          />
          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.notes_en')"
            v-model.trim="data.notesEn"
            disabled
            v-if="data.notesEn"
          />
          <!-- End:: Notes Input -->

          <hr class="my-5" style="width: 97%" />
          <!-- Start:: Address Input -->
          <base-input
            col="12"
            type="text"
            :placeholder="$t('PLACEHOLDERS.address')"
            v-model.trim="data.address"
            disabled
          />
          <!-- End:: Address Input -->
          <ChangableMapComponent
            :initialPoints="data.points"
            @update:points="data.points = $event"
            :disabledMap="true"
          />
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import ChangableMapComponent from "@/components/general/ChangableMapComponent";

export default {
  name: "ShowPlace",
  components: {
    ChangableMapComponent,
  },
  data() {
    return {
      isLoadingData: false,
      isWaitingRequest: false,
      additionalImages: [],
      imgUrls: [],
      existingImages: [],
      placeId: null,

      data: {
        nameAr: null,
        nameEn: null,
        cityId: null,
        type: null,
        descriptionAr: null,
        descriptionEn: null,
        address: null,
        notesAr: null,
        notesEn: null,
        selectedActivities: [],
        sports: [
          {
            nameAr: null,
            nameEn: null,
          },
        ],
        services: [
          {
            nameAr: null,
            nameEn: null,
          },
        ],
        workingHours: [{ day: null, from: null, to: null }],
        points: [],
      },

      cities: [],
      activities: [
        { id: 1, name: this.$t("ACTIVITIES.walking_running") },
        { id: 2, name: this.$t("ACTIVITIES.cycling") },
        { id: 3, name: this.$t("ACTIVITIES.horse_riding") },
      ],

      allDays: [
        { id: "saturday", name: this.$t("days.Saturday") },
        { id: "sunday", name: this.$t("days.Sunday") },
        { id: "monday", name: this.$t("days.Monday") },
        { id: "tuesday", name: this.$t("days.Tuesday") },
        { id: "wednesday", name: this.$t("days.Wednesday") },
        { id: "thursday", name: this.$t("days.Thursday") },
        { id: "friday", name: this.$t("days.Friday") },
      ],
    };
  },

  computed: {
    placeTypes() {
      return [
        {
          id: "sport",
          name: this.$t("PLACEHOLDERS.sport"),
        },
        {
          id: "entertainment",
          name: this.$t("PLACEHOLDERS.entertainment"),
        },
      ];
    },
  },

  mounted() {
    this.placeId = this.$route.params.id;
    this.fetchPlaceData();
  },

  methods: {
    async fetchPlaceData() {
      this.isLoadingData = true;
      try {
        const response = await this.$axios.get(`places/${this.placeId}`);
        const place = response.data.data.Place;

        // Basic Information
        this.data.nameAr = place.trans.name.ar;
        this.data.nameEn = place.trans.name.en;
        this.data.descriptionAr = place.trans.description.ar;
        this.data.descriptionEn = place.trans.description.en;
        this.data.notesAr = place.trans.notes?.ar || null;
        this.data.notesEn = place.trans.notes?.en || null;
        this.data.address = place.address;

        // City
        this.data.cityId = {
          id: place.city.id,
          name: place.city.name,
        };

        // Type
        this.data.type = this.placeTypes.find((type) => type.id === place.type);

        // Activities
        this.data.selectedActivities = place.activities.map(
          (activity) => activity.id
        );

        // Images
        this.existingImages = place.images || [];
        this.imgUrls = place.images?.map((img) => img.url) || [];

        // Sports
        if (place.sports && place.sports.length > 0) {
          this.data.sports = place.sports.map((sport) => ({
            nameAr: sport.trans.name.ar,
            nameEn: sport.trans.name.en,
          }));
        }

        // Services
        if (place.services && place.services.length > 0) {
          this.data.services = place.services.map((service) => ({
            nameAr: service.trans.name.ar,
            nameEn: service.trans.name.en,
          }));
        }

        // Working Hours
        if (place.working_hours && place.working_hours.length > 0) {
          this.data.workingHours = place.working_hours.map((wh) => ({
            day: this.allDays.find((day) => day.id === wh.day),
            from: wh.from,
            to: wh.to,
          }));
        }

        // Points
        if (place.points && place.points.length > 0) {
          this.data.points = place.points.map((point) => ({
            lat: parseFloat(point.lat),
            lng: parseFloat(point.long),
          }));
        }

        this.isLoadingData = false;
      } catch (error) {
        this.isLoadingData = false;
        this.$message.error(
          error.response?.data?.message || "Error fetching place data"
        );
        this.$router.push({ path: "/places/all" });
      }
    },

    getAvailableDays(currentIndex) {
      const selectedDayIds = this.data.workingHours
        .map((wh, index) => (index !== currentIndex ? wh.day?.id : null))
        .filter((dayId) => dayId !== null);

      return this.allDays.filter((day) => !selectedDayIds.includes(day.id));
    },

    addWorkingHour() {
      this.data.workingHours.push({
        day: null,
        from: null,
        to: null,
      });
    },

    removeWorkingHour(index) {
      this.data.workingHours.splice(index, 1);
    },

    addSport() {
      this.data.sports.push({
        nameAr: null,
        nameEn: null,
      });
    },

    removeSport(index) {
      this.data.sports.splice(index, 1);
    },

    addService() {
      this.data.services.push({
        nameAr: null,
        nameEn: null,
      });
    },

    removeService(index) {
      this.data.services.splice(index, 1);
    },

    onFileSelect(files) {
      if (files.length > 5) {
        this.$message.warning(this.$t("VALIDATION.max_5_images"));
        this.additionalImages = Array.from(files).slice(0, 5);
      } else {
        this.additionalImages = files;
      }
    },

    onFileRemove(index) {
      // Check if removing an existing image or a new one
      if (index < this.existingImages.length) {
        // Remove from existing images
        this.existingImages.splice(index, 1);
      } else {
        // Remove from new images
        const newImageIndex = index - this.existingImages.length;
        this.additionalImages.splice(newImageIndex, 1);
      }
      this.$delete(this.imgUrls, index);
    },
  },
};
</script>

<style lang="scss" scoped>
.add_another {
  border: none;
  padding: 8px;
  width: 40px;
  height: 40px;
  border: 1px solid #814686;
  border-radius: 50%;
  font-size: 18px;
  color: #814686;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: auto !important;
}
</style>
