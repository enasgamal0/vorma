<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.addPlace") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #814686">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Multi Image Upload Input -->
          <base-multi-image-upload-input
            :urls="imgUrls"
            multiple
            @onFileSelect="onFileSelect"
            @onFileRemove="onFileRemove"
          >
            {{ $t("PLACEHOLDERS.place_images") }} ({{
              $t("PLACEHOLDERS.max_5_images")
            }}) <span style="color: #e63757">*</span>
          </base-multi-image-upload-input>
          <!-- End:: Multi Image Upload Input -->
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.place_name_ar')"
            v-model.trim="data.nameAr"
            required
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.place_name_en')"
            v-model.trim="data.nameEn"
            required
          />
          <!-- End:: Name Input -->

          <!-- Start:: City Select -->
          <base-select-input
            col="6"
            :optionsList="cities"
            :placeholder="$t('PLACEHOLDERS.city')"
            v-model="data.cityId"
            required
          />
          <!-- End:: City Select -->

          <!-- Start:: Type Select -->
          <base-select-input
            col="6"
            :optionsList="placeTypes"
            :placeholder="$t('PLACEHOLDERS.type')"
            v-model="data.type"
            required
          />
          <!-- End:: Type Select -->

          <!-- Start:: Description Input -->
          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.description_ar')"
            v-model.trim="data.descriptionAr"
            required
          />
          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.description_en')"
            v-model.trim="data.descriptionEn"
            required
          />
          <!-- End:: Description Input -->

          <!-- Start:: Activities Checkboxes -->
          <div class="col-12 my-4">
            <h5 style="color: #814686">
              {{ $t("PLACEHOLDERS.activities") }}
              <span style="color: #e63757">*</span>
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
              <span style="color: #e63757">*</span>
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
                  col="5"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.sport_name_ar')"
                  v-model.trim="sport.nameAr"
                  required
                />
                <base-input
                  col="5"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.sport_name_en')"
                  v-model.trim="sport.nameEn"
                  required
                />
                <div
                  class="item d-flex flex-wrap align-items-center col-2 gap-2"
                >
                  <div class="all_actions" v-if="data.sports?.length > 1">
                    <span class="add_another" @click="removeSport(index)">
                      <i class="fas fa-minus"></i>
                    </span>
                  </div>
                  <div>
                    <div class="add_another mx-2" @click="addSport">
                      <i class="fas fa-plus"></i>
                    </div>
                  </div>
                </div>
              </div>

              <hr class="my-5" style="width: 97%" />
            </div>
          </div>
          <!-- End:: Sports Section -->

          <!-- Start:: Services Section -->
          <div class="col-12">
            <h5 style="color: #814686">
              {{ $t("PLACEHOLDERS.available_services") }}
              <span style="color: #e63757">*</span>
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
                  col="5"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.service_name_ar')"
                  v-model.trim="service.nameAr"
                  required
                />
                <base-input
                  col="5"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.service_name_en')"
                  v-model.trim="service.nameEn"
                  required
                />
                <div
                  class="item d-flex flex-wrap align-items-center col-2 gap-2"
                >
                  <div class="all_actions" v-if="data.services?.length > 1">
                    <span class="add_another" @click="removeService(index)">
                      <i class="fas fa-minus"></i>
                    </span>
                  </div>
                  <div class="col-l2">
                    <div class="add_another mx-2" @click="addService">
                      <i class="fas fa-plus"></i>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="my-5" style="width: 97%" />
            </div>
          </div>
          <!-- End:: Services Section -->

          <!-- Start:: Working Hours Section -->
          <div class="col-12">
            <h5 style="color: #814686">
              {{ $t("PLACEHOLDERS.working_hours") }}
              <span style="color: #e63757">*</span>
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
                required
              />
              <div class="col-3">
                <base-input
                  type="time"
                  :placeholder="$t('PLACEHOLDERS.from')"
                  v-model="workingHour.from"
                  required
                />
              </div>
              <div class="col-3">
                <base-input
                  type="time"
                  :placeholder="$t('PLACEHOLDERS.to')"
                  v-model="workingHour.to"
                  required
                />
              </div>
              <div
                class="item d-flex flex-wrap align-items-center mt-2 col-2 gap-2"
              >
                <div class="all_actions" v-if="data.workingHours?.length > 1">
                  <span class="add_another" @click="removeWorkingHour(index)">
                    <i class="fas fa-minus"></i>
                  </span>
                </div>
                <div class="col-l2">
                  <div class="add_another mx-2" @click="addWorkingHour">
                    <i class="fas fa-plus"></i>
                  </div>
                </div>
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
          />
          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.notes_en')"
            v-model.trim="data.notesEn"
          />
          <!-- End:: Notes Input -->

          <hr class="my-5" style="width: 97%" />
          <!-- Start:: Address Input -->
          <base-input
            col="12"
            type="text"
            :placeholder="$t('PLACEHOLDERS.address')"
            v-model.trim="data.address"
            required
          />
          <!-- End:: Address Input -->
          <ChangableMapComponent
            :initialPoints="data.points"
  @update:points="data.points = $event"
          />

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper mt-5">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('BUTTONS.save')"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
          </div>
          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import ChangableMapComponent from "@/components/general/ChangableMapComponent";

export default {
  name: "CreatePlace",
  components: {
    ChangableMapComponent,
  },
  data() {
    return {
      isWaitingRequest: false,
      additionalImages: [],
      imgUrls: [],

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
        points: []

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
    this.fetchCities();
  },

  methods: {
    async fetchCities() {
      try {
        const response = await this.$axios.get(
          "cities?is_active=1&page=0&limit=0"
        );
        this.cities = response.data.data.data?.map((city) => ({
          id: city.id,
          name: city.name,
        }));
      } catch (error) {
        console.log(error.response?.data?.message || "Error fetching cities");
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

    addPoint() {
      this.data.points.push({
        lat: null,
        long: null,
      });
    },

    removePoint(index) {
      this.data.points.splice(index, 1);
    },

    onFileSelect(files) {
  const newFiles = Array.from(files);

  // دمج الصور الجديدة مع القديمة
  const allFiles = [...this.additionalImages, ...newFiles];

  if (allFiles.length > 5) {
    this.$message.warning(this.$t("VALIDATION.max_5_images"));
    // ناخد أول 5 بس
    this.additionalImages = allFiles.slice(0, 5);
  } else {
    this.additionalImages = allFiles;
  }

  // نحدّث الـ preview URLs كمان
  this.imgUrls = this.additionalImages.map(file => URL.createObjectURL(file));
},



    onFileRemove(index) {
      this.additionalImages.splice(index, 1);
      this.$delete(this.imgUrls, index);
    },

    validateFormInputs() {
      // if (this.additionalImages.length === 0) {
      //   this.$message.error(this.$t("VALIDATION.images_required"));
      //   return;
      // }

      // if (this.data.selectedActivities.length === 0) {
      //   this.$message.error(this.$t("VALIDATION.activities_required"));
      //   return;
      // }

      this.isWaitingRequest = true;
      this.submitForm();
    },

    async submitForm() {
      const REQUEST_DATA = new FormData();

      // Basic Information
      if (this.data.nameAr) {
        REQUEST_DATA.append("name[ar]", this.data.nameAr);
      }
      if (this.data.nameEn) {
        REQUEST_DATA.append("name[en]", this.data.nameEn);
      }
      if (this.data.address) {
        REQUEST_DATA.append("address", this.data.address);
      }
      if (this.data.type) {
        REQUEST_DATA.append("type", this.data.type?.id);
      }
      if (this.data.descriptionAr) {
        REQUEST_DATA.append("description[ar]", this.data.descriptionAr);
      }
      if (this.data.descriptionEn) {
        REQUEST_DATA.append("description[en]", this.data.descriptionEn);
      }
      if (this.data.notesAr) {
        REQUEST_DATA.append("notes[ar]", this.data.notesAr);
      }
      if (this.data.notesEn) {
        REQUEST_DATA.append("notes[en]", this.data.notesEn);
      }
      if (this.data.cityId) {
        REQUEST_DATA.append("city_id", this.data.cityId?.id);
      }

      // Activities
      this.data.selectedActivities.forEach((activityId) => {
        REQUEST_DATA.append("activities[]", activityId);
      });

      // Sports (Only for sport type)
      if (this.data.type?.id == "sport") {
        this.data.sports.forEach((sport, index) => {
          if (sport.nameAr) {
            REQUEST_DATA.append(`sports[${index}][name][ar]`, sport.nameAr);
          }
          if (sport.nameEn) {
            REQUEST_DATA.append(`sports[${index}][name][en]`, sport.nameEn);
          }
        });
      }

      // Services
      this.data.services.forEach((service, index) => {
        if (service.nameAr) {
          REQUEST_DATA.append(`services[${index}][name][ar]`, service.nameAr);
        }
        if (service.nameEn) {
          REQUEST_DATA.append(`services[${index}][name][en]`, service.nameEn);
        }
      });

      // Working Hours (Only rows with selected day)
      let workingHourIndex = 0;
      this.data.workingHours.forEach((workingHour) => {
        if (workingHour.day && workingHour.from && workingHour.to) {
          REQUEST_DATA.append(
            `working_hours[${workingHourIndex}][day]`,
            workingHour.day.id
          );
          REQUEST_DATA.append(
            `working_hours[${workingHourIndex}][from]`,
            workingHour.from
          );
          REQUEST_DATA.append(
            `working_hours[${workingHourIndex}][to]`,
            workingHour.to
          );
          workingHourIndex++;
        }
      });

      // Location Points
      this.data.points?.forEach((point, index) => {
        if (point.lat && point.lng) {
          REQUEST_DATA.append(`points[${index}][lat]`, point.lat);
          REQUEST_DATA.append(`points[${index}][long]`, point.lng);
        }
      });

      // Images - Send only first 5
      const imagesToSend = this.additionalImages.slice(0, 5);
      if (imagesToSend.length) {
        imagesToSend.forEach((file) => {
          REQUEST_DATA.append("images[]", file);
        });
      }

      try {
        await this.$axios({
          method: "POST",
          url: `places`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/places/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response?.data?.message || "Error occurred");
      }
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
