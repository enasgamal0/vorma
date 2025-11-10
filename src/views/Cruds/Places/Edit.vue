<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.editPlace") }}</h4>
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
          <div class="col-12 my-4" v-if="data.type?.id === 'sport'">
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
            <div class="form-check form-switch mb-3 toggle_switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="edit-all-day-all-week"
                v-model="isAllDayAllWeek"
              />
              <label
                class="form-check-label mx-5 px-3"
                style="color: #814686"
                for="edit-all-day-all-week"
              >
                {{ $t("PLACEHOLDERS.open_24_hours") }}
              </label>
            </div>
            <div
              v-if="isAllDayAllWeek"
              class="mb-3"
              style="color: #814686; font-weight: 500"
            >
              {{ $t("PLACEHOLDERS.open_24_hours_note") }}
            </div>
            <template v-else>
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
              <div class="col-6 col-md-3">
                <base-input
                  type="time"
                  :placeholder="$t('PLACEHOLDERS.from')"
                  v-model="workingHour.from"
                  required
                />
              </div>
              <div class="col-6 col-md-3">
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
            </template>
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
  name: "EditPlace",
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

      isAllDayAllWeek: false,
      loadedWithAllWeek: false,

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

  watch: {
    isAllDayAllWeek(newVal, oldVal) {
      if (oldVal && !newVal && this.loadedWithAllWeek) {
        this.data.workingHours = [
          {
            day: null,
            from: null,
            to: null,
          },
        ];
        this.loadedWithAllWeek = false;
      }
    },
  },

  mounted() {
    this.placeId = this.$route.params.id;
    this.fetchCities();
    this.fetchPlaceData();
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
          this.isAllDayAllWeek = this.isAllWeekSchedule(place.working_hours);
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

        this.loadedWithAllWeek = this.isAllDayAllWeek;

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
      if (this.isAllDayAllWeek) return;
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

    isAllWeekSchedule(workingHours = []) {
      if (!workingHours.length || workingHours.length !== this.allDays.length) {
        return false;
      }

      return this.allDays.every((day) => {
        const dayEntry = workingHours.find((wh) => wh.day === day.id);
        if (!dayEntry) {
          return false;
        }
        const from = this.normalizeTime(dayEntry.from);
        const to = this.normalizeTime(dayEntry.to);
        return from === "00:00" && (to === "23:59" || to === "24:00");
      });
    },

    normalizeTime(time) {
      if (!time) return null;
      return time.slice(0, 5);
    },

    onFileSelect(files) {
      // Calculate total after adding new files
      const totalImagesCount = this.existingImages.length + this.additionalImages.length + files.length;

      if (totalImagesCount > 5) {
        this.$message.warning(this.$t("VALIDATION.max_5_images"));
        
        const allowedToAdd = 5 - (this.existingImages.length + this.additionalImages.length);
        
        if (allowedToAdd > 0) {
          const filesToAdd = files.slice(0, allowedToAdd);
          this.additionalImages.push(...filesToAdd);
          this.imgUrls = [
            ...this.existingImages.map(img => img.url),
            ...this.additionalImages.map(f => URL.createObjectURL(f))
          ];
        }
      } else {
        // Add to existing additionalImages
        this.additionalImages.push(...files);
        this.imgUrls = [
          ...this.existingImages.map(img => img.url),
          ...this.additionalImages.map(f => URL.createObjectURL(f))
        ];
      }
    },

    async onFileRemove(index) {
      try {
        if (index < this.existingImages.length) {
          const imageToDelete = this.existingImages[index];

          if (
            this.existingImages?.length == 1 &&
            this.additionalImages?.length == 0
          ) {
            this.$message.warning(this.$t("VALIDATION.min_1_image"));
            return;
          }

          await this.$axios.delete(`media/${imageToDelete.id}`);

          this.existingImages.splice(index, 1);
          this.imgUrls.splice(index, 1);

          this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
        }
        else {
          const newImageIndex = index - this.existingImages.length;
          this.additionalImages.splice(newImageIndex, 1);
          this.imgUrls.splice(index, 1);
        }
      } catch (error) {
        console.error(error);
        this.$message.error(
          error.response?.data?.message || this.$t("MESSAGES.deleteFailed")
        );
      }
    },

    validateFormInputs() {
      this.isWaitingRequest = true;
      this.submitForm();
    },

    async submitForm() {
      const REQUEST_DATA = new FormData();

      REQUEST_DATA.append("_method", "PUT");

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

      // Activities (Only for sport type)
      if (this.data.type?.id == "sport") {
        this.data.selectedActivities.forEach((activityId) => {
          REQUEST_DATA.append("activities[]", activityId);
        });
      }

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

      // Working Hours
      if (this.isAllDayAllWeek) {
        this.allDays.forEach((day, index) => {
          REQUEST_DATA.append(
            `working_hours[${index}][day]`,
            day.id
          );
          REQUEST_DATA.append(
            `working_hours[${index}][from]`,
            "00:00"
          );
          REQUEST_DATA.append(
            `working_hours[${index}][to]`,
            "23:59"
          );
        });
      } else {
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
      }

      // Location Points
      this.data.points?.forEach((point, index) => {
        if (point.lat && point.lng) {
          REQUEST_DATA.append(`points[${index}][lat]`, point.lat);
          REQUEST_DATA.append(`points[${index}][long]`, point.lng);
        }
      });

      // Images - Send new images if any
      if (this.additionalImages.length) {
        const imagesToSend = this.additionalImages.slice(0, 5);
        imagesToSend.forEach((file) => {
          REQUEST_DATA.append("images[]", file);
        });
      }

      try {
        await this.$axios({
          method: "POST",
          url: `places/${this.placeId}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
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

.toggle_switch {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.toggle_switch .form-check-input) {
  width: 3.2rem;
  height: 1.6rem;
  cursor: pointer;
  border: 1px solid #814686;
  background-color: #f6f0fa;
  transition: all 0.2s ease-in-out;
}

:deep(.toggle_switch .form-check-input:focus) {
  box-shadow: 0 0 0 0.15rem rgba(129, 70, 134, 0.3);
}

:deep(.toggle_switch .form-check-input:checked) {
  background-color: #814686;
  border-color: #814686;
}

:deep(.toggle_switch .form-check-input::before) {
  background-color: #fff;
}

:deep(.toggle_switch .form-check-label) {
  margin: 0;
  color: #814686;
  font-weight: 500;
}

</style>
