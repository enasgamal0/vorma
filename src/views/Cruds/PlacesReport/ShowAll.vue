<template>
  <div class="show_all_content_wrapper service_class">
    <!-- Start:: Main Section -->
    <main>
      <!--  =========== Start:: Filter Form =========== -->
      <div
        class="filter_content_wrapper"
        :class="{ active: filterFormIsActive }"
      >
        <button
          class="filter_toggler"
          @click="filterFormIsActive = !filterFormIsActive"
        >
          <i class="fal fa-times"></i>
        </button>
        <div class="filter_title_wrapper">
          <h5>{{ $t("TITLES.searchBy") }}</h5>
        </div>

        <div class="filter_form_wrapper">
          <form @submit.prevent="submitFilterForm">
            <div class="row justify-content-center align-items-center w-100">
              <base-select-input
                col="4"
                :optionsList="placeTypes"
                :placeholder="$t('PLACEHOLDERS.type')"
                v-model="filterOptions.type"
              />
              <base-picker-input
                col="4"
                type="date"
                :placeholder="$t('PLACEHOLDERS.from')"
                v-model.trim="filterOptions.from"
              />

              <base-picker-input
                col="4"
                type="date"
                :placeholder="$t('PLACEHOLDERS.to')"
                v-model.trim="filterOptions.to"
              />
            </div>

            <div class="btns_wrapper">
              <button class="submit_btn" :disabled="isWaitingRequest">
                <i class="fal fa-search"></i>
              </button>
              <button
                class="reset_btn"
                type="button"
                :disabled="isWaitingRequest"
                @click="resetFilter"
              >
                <i class="fal fa-redo"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!--  =========== Start:: Table Title =========== -->
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>{{ $t("PLACEHOLDERS.places_report") }}</h5>
          <button
            v-if="!filterFormIsActive"
            class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive"
          >
            <i class="fal fa-search"></i>
          </button>
        </div>
        <div class="title_route_wrapper">
          <base-button
            class="mt-0 pdf_btn"
            styleType="solid_btn"
            :btnText="$t('BUTTONS.downloadPdf')"
            @fireClick="downloadPdf"
          >
            <template v-slot:btn_icon>
              <i class="fal fa-file-pdf"></i>
            </template>
          </base-button>
          <base-button
            class="mt-0 excel_btn"
            styleType="solid_btn"
            :btnText="$t('BUTTONS.downloadExcel')"
            @fireClick="downloadExcelAllData"
          />
        </div>
      </div>
      <!--  =========== End:: Table Title =========== -->

      <!--  =========== Start:: Data Table =========== -->
      <v-data-table
        class="thumb"
        :loading="loading"
        :loading-text="$t('TABLES.loadingData')"
        :search="searchValue"
        :headers="tableHeaders"
        :items="tableRows"
        item-class="ltr"
        :items-per-page="paginations.items_per_page"
        hide-default-footer
      >
        <template v-slot:[`item.id`]="{ index }">
          {{
            (paginations.current_page - 1) * paginations.items_per_page +
            index +
            1
          }}
        </template>
        <!-- Start:: No Data State -->
        <template v-slot:no-data>
          {{ $t("TABLES.noData") }}
        </template>
        <!-- Start:: No Data State -->

        <template v-slot:[`item.people_number`]="{ item }">
          <a :href="`/places_users/all/${item.id}?place_ar=${item?.trans?.name?.ar}&place_en=${item?.trans?.name?.en}`" class="text-decoration-underline">{{ item.people_number }}</a>
        </template>

        <!-- Start:: Activation -->
        <template v-slot:[`item.is_active`]="{ item }">
          <!-- v-if="permissions.activate" -->
          <div
            class="activation"
            dir="ltr"
            style="z-index: 1"
            v-if="$can('places activate', 'places')"
          >
            <v-switch
              class="mt-2"
              color="success"
              v-model="item.is_active"
              hide-details
              @change="changeActivationStatus(item)"
            ></v-switch>
          </div>
        </template>
        <!-- End:: Activation -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip placement="bottom" v-if="$can('places show', 'places')">
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>
            <a-tooltip placement="bottom" v-if="$can('places edit', 'places')">
              <template slot="title">
                <span>{{ $t("BUTTONS.edit") }}</span>
              </template>
              <button class="btn_edit" @click="editItem(item)">
                <i class="fal fa-edit"></i>
              </button>
            </a-tooltip>
            <a-tooltip
              placement="bottom"
              v-if="$can('places delete', 'places')"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.delete") }}</span>
              </template>
              <button class="btn_delete" @click="selectDeleteItem(item)">
                <i class="fal fa-trash-alt"></i>
              </button>
            </a-tooltip>
            <template v-else>
              <i
                class="fal fa-lock-alt fs-5 blue-grey--text text--darken-1"
              ></i>
            </template>
          </div>
        </template>
        <!-- End:: Actions -->

        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>
          <!-- Start:: Image Modal -->
          <image-modal
            v-if="dialogImage"
            :modalIsOpen="dialogImage"
            :modalImage="selectedItemImage"
            @toggleModal="dialogImage = !dialogImage"
          />
          <!-- End:: Image Modal -->

          <!-- Start:: Description Modal -->
          <description-modal
            v-if="dialogDescription"
            :modalIsOpen="dialogDescription"
            :modalDesc="selectedDescriptionTextToShow"
            @toggleModal="dialogDescription = !dialogDescription"
          />
          <!-- End:: Description Modal -->

          <!-- Start:: Delete Modal -->
          <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToDelete">
                {{
                  $t("TITLES.DeleteConfirmingMessage", {
                    name: itemToDelete.name,
                  })
                }}
              </v-card-title>
              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="confirmDeleteItem">{{
                  $t("BUTTONS.ok")
                }}</v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogDelete = false">{{
                  $t("BUTTONS.cancel")
                }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Delete Modal -->
        </template>
        <!-- ======================== End:: Dialogs ======================== -->
      </v-data-table>
      <!--  =========== End:: Data Table =========== -->
    </main>
    <!-- End:: Main Section -->

    <!-- Start:: Pagination -->
    <template>
      <div class="pagination_container text-center mt-3 mb-0">
        <v-pagination
          class="py-0"
          square
          v-model="paginations.current_page"
          :length="paginations.last_page"
          :total-visible="6"
          @input="updateRouterQueryParam($event)"
          :prev-icon="
            getAppLocale == 'ar' ? 'fal fa-angle-right' : 'fal fa-angle-left'
          "
          :next-icon="
            getAppLocale == 'ar' ? 'fal fa-angle-left' : 'fal fa-angle-right'
          "
        />
      </div>
    </template>
    <!-- End:: Pagination -->
     <!-- Start:: Generate PDF Template Content -->
  <vue-html2pdf
    :show-layout="false"
    :float-layout="true"
    :enable-download="true"
    :preview-modal="true"
    :filename="$t('PLACEHOLDERS.auctions_report')"
    :pdf-quality="2"
    pdf-format="a4"
    :manual-pagination="false"
    :paginate-elements-by-height="1400"
    pdf-content-width="100%"
    @hasGenerated="$message.success($t('MESSAGES.generatedSuccessfully'))"
    ref="html2Pdf"
  >
    <section slot="pdf-content">
      <div class="pdf_file_content">
        <h3 class="file_title">
          {{ $t("PLACEHOLDERS.auctions_report") }}
        </h3>
        <!-- ==== Start:: Overall_statistics Addresses ==== -->
        <div class="table_content mt-5">
          <v-simple-table class="pdf-table">
            <thead>
              <tr>
                <th
                  v-for="header in tableHeaders"
                  :key="header.value"
                  style="text-align: center"
                >
                  {{ header.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in allRowsForPdf" :key="row.id">
                <td>{{ index + 1 }}</td>
                <td>{{ row.name }}</td>
                <td>{{ row.city?.name }}</td>
                <td>{{ row.type_trans }}</td>
                <td>{{ row.people_number }}</td>
                <td>{{ row.people_with_activity }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </div>
        <!-- ==== End:: Overall_statistics Addresses ==== -->
      </div>
    </section>
  </vue-html2pdf>
  <!-- End:: Generate PDF Template Content -->
  </div>
  
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VueHtml2pdf from "vue-html2pdf";

export default {
  name: "AllPlaces",

  components: {
    VueHtml2pdf,
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),

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

    activeStatuses() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.active"),
          value: 1,
        },
        {
          id: 2,
          name: this.$t("STATUS.notActive"),
          value: 0,
        },
      ];
    },
  },

  data() {
    return {
      cities: [],
      allRowsForPdf: [],
      // Start:: Loading Data
      loading: false,
      isWaitingRequest: false,
      // End:: Loading Data

      // Start:: Filter Data
      filterFormIsActive: false,
      filterOptions: {
        from: null,
        to: null,
        type: null,
      },
      // End:: Filter Data

      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.Admins.serialNumber"),
          value: "id",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.name"),
          value: "name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.city"),
          value: "city.name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.type"),
          value: "type_trans",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.people_number"),
          value: "people_number",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.people_with_activity"),
          value: "people_with_activity",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      // End:: Table Data

      // Start:: Dialogs Control Data
      dialogImage: false,
      selectedItemImage: null,
      dialogDescription: false,
      selectedDescriptionTextToShow: "",
      dialogDelete: false,
      itemToDelete: null,
      dialogPrices: false,
      // End:: Dialogs Control Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data

      regions: [],
      cites: [],
      dialogPrices: false,
    };
  },

  watch: {
    // Start:: Page Query Param Watcher To Get Page Data Based On It's Change
    ["$route.query.page"]() {
      this.paginations.current_page = +this.$route.query.page;
      this.setTableRows();
    },
    // End:: Page Query Param Watcher To Get Page Data Based On It's Change
  },

  methods: {
    // Start:: Handel Filter
    async submitFilterForm() {
      if (this.$route.query.page !== "1") {
        await this.$router.push({
          path: "/places_report/all",
          query: { page: 1 },
        });
      }
      this.setTableRows();
    },
    async resetFilter() {
      this.filterOptions.from = null;
      this.filterOptions.to = null;
      this.filterOptions.type = null;

      if (this.$route.query.page !== "1") {
        await this.$router.push({
          path: "/places_report/all",
          query: { page: 1 },
        });
      }
      this.setTableRows();
    },
    // End:: Handel Filter
    // Start:: Set Table Rows
    updateRouterQueryParam(pagenationValue) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: pagenationValue,
        },
      });

      // Scroll To Screen's Top After Get places
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    async setTableRows() {
      this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: "places",
          params: {
            page: this.paginations.current_page,
            from: this.filterOptions.from,
            to: this.filterOptions.to,
            type: this.filterOptions.type?.id,
          },
        });
        this.loading = false;
        console.log(res.data.data);
        this.tableRows = res.data.data.data;
        this.paginations.last_page = res.data.data.meta.last_page;
        this.paginations.items_per_page = res.data.data.meta.per_page;
      } catch (error) {
        this.loading = false;
      }
    },
    // End:: Set Table Rows
    showReplayModal(replay) {
      this.dialogDescription = true;
      this.selectedDescriptionTextToShow = replay;
    },
    // Start:: Control Modals
    showImageModal(image) {
      this.dialogImage = true;
      this.selectedItemImage = image;
    },
    // End:: Control Modals
    // Start:: Change Activation Status
    async changeActivationStatus(item) {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      // REQUEST_DATA.append("_method", "PUT");
      try {
        await this.$axios({
          method: "POST",
          url: `places/activate/${item?.id}`,
          data: REQUEST_DATA,
        });
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.changeActivation"));
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Change Activation Status

    // ==================== Start:: Crud ====================
    // ===== Start:: End
    editItem(item) {
      this.$router.push({ path: `/places_report/edit/${item?.id}` });
    },
    showItem(item) {
      this.$router.push({ path: `/places_report/show/${item?.id}` });
    },
    showPrices(item) {
      this.dialogPrices = true;
      this.pricesItem = item;
      this.setTableRows();
    },
    // ===== End:: End

    // ===== Start:: Delete
    selectDeleteItem(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },

    async confirmDeleteItem() {
      try {
        await this.$axios({
          method: "DELETE",
          url: `places/${this.itemToDelete?.id}`,
        });
        this.dialogDelete = false;
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // ===== End:: Delete
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
    // ==================== End:: Crud ====================
    async downloadPdf() {
      try {
        this.$message.loading(this.$t("MESSAGES.generatingNow"));

        const res = await this.$axios({
          method: "GET",
          url: "places",
          params: {
            page: 0,
            limit: 0,
            from: this.filterOptions.from,
            to: this.filterOptions.to,
            type: this.filterOptions.type?.id,
          },
        });

        this.allRowsForPdf = res.data.data.data;

        await this.$nextTick();
        await this.$refs.html2Pdf.generatePdf();
      } catch (err) {
        console.error(err);
        this.$message.error(this.$t("MESSAGES.errorHappened"));
      }
    },
    downloadExcelAllData() {
      window.open(
        "https://backend.vorma.moltaqadev.com/export-places",
        "_blank"
      );
    },
  },

  created() {
    // Start:: Fire Methods
    window.addEventListener("click", () => {
      this.filterFormIsActive = false;
    });
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    this.fetchCities();
    this.setTableRows();
    // End:: Fire Methods
  },
};
</script>
<style lang="scss">
.service_row.mb-5.d-flex:empty {
  display: none !important;
}
.service_select.my-5 {
  margin: 0 !important;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
  background-color: transparent;
  color: #a1a1a1;
}
.pdf_file_content {
  padding: 20px;
  font-family: "Cairo", sans-serif;

  .pdf-table {
    width: 100%;
    border-collapse: collapse;
    th,
    td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: center;
      font-size: 12px;
    }
    th {
      background: #814686;
      color: #fff;
    }
  }

  .file_title {
    text-align: center;
    margin-bottom: 20px;
    color: #814686;
  }
}
</style>
