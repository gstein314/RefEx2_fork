<template>
  <div class="chart_wrapper">
    <div class="header">
      <div class="header_title">
        <h1>
          <font-awesome-icon
            icon="info-circle"
            @click="showGeneDetail(results.ginf.id)"
          />
          <span class="title">
            {{ `${results.ginf.symbol}` }}
            <span class="metadata">{{
              `(${results.ginf.name}, NCBI GeneID: ${results.ginf.id})`
            }}</span>
          </span>
        </h1>

        <button class="comparison_btn" @click="is_compare_on = true">
          <font-awesome-icon icon="chart-bar" />
          Comparison
        </button>
      </div>
      <ul class="gene_box_list">
        <li
          :class="[
            'gene_box',
            'gene_1',
            { active: sort.active === 'log2_Median' },
          ]"
          @click="switchSort('log2_Median', 'down')"
        >
          <font-awesome-icon
            class="info"
            icon="info-circle"
            @click="showGeneDetail(results.ginf.id)"
          />
          {{ results.ginf.symbol }}
          <font-awesome-icon
            v-if="sort.active === 'log2_Median'"
            :icon="
              sort.order === 'down' ? 'sort-amount-down' : 'sort-amount-up-alt'
            "
          />
        </li>
        <li
          v-for="index in Number(gene_num) - 1"
          :key="index"
          :class="[
            'gene_box',
            `gene_${index + 1}`,
            { active: sort.active === `log2_Median_compare_${index + 1}` },
          ]"
          @click="switchSort(`log2_Median_compare_${index + 1}`, 'down')"
        >
          <font-awesome-icon
            class="info"
            icon="info-circle"
            @click="showGeneDetail(compare_genes[index - 1].ginf.id)"
          />
          {{ compare_genes[index - 1].ginf.symbol }}
          <font-awesome-icon
            v-if="sort.active === `log2_Median_compare_${index + 1}`"
            icon="sort-amount-down"
          />
        </li>
      </ul>
    </div>
    <div class="display_settings_wrapper">
      <a class="display_settings" @click="is_display_settings_on = true">
        <font-awesome-icon icon="eye" />
        Display settings
      </a>
    </div>
    <table>
      <thead>
        <tr>
          <table-header
            v-for="(item, key) of filters"
            :id="key"
            :key="key"
            :current-sort="sort"
            v-bind="item"
            :class="key"
            @switchSort="switchSort"
            @openFilterModal="openFilterModal"
          >
            <template v-if="key === 'log2_Median'">
              <median-scale />
            </template>
          </table-header>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in filteredData" :key="result.ncbiGeneId">
          <template v-for="(value, key) of filters">
            <td v-if="value.isDisplayed" :key="key" :class="value.innerKey">
              <median-bar
                v-if="key === 'log2_Median'"
                :result="result"
                :gene-num="gene_num"
                :compare-genes="compare_genes"
                :symbol="results.ginf.symbol"
              >
              </median-bar>
              <template v-else>
                {{ result[key] }}
              </template>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <transition name="modal_bg">
      <div
        v-if="
          is_display_settings_on ||
          is_filter_modal_on ||
          is_gene_detail_modal_on ||
          is_compare_on
        "
        class="modal_bg"
        @click="closeModal"
      ></div>
    </transition>
    <transition name="modal">
      <div v-if="is_display_settings_on" class="modal display_settings_modal">
        <p class="modal_title">
          <font-awesome-icon icon="eye" />
          Display settings
        </p>
        <div class="display_checkboxes">
          <div v-for="(value, key) of filters" :key="key">
            <input
              :id="value.innerKey"
              v-model="value.isDisplayed"
              type="checkbox"
              :name="value.innerKey"
            />
            <label :for="value.innerKey"> {{ value.label }} </label>
          </div>
        </div>
      </div>
    </transition>
    <transition name="modal">
      <div v-if="is_filter_modal_on" class="modal filter_modal">
        <p class="modal_title">
          <font-awesome-icon icon="search" />
          {{
            filterModalObj.subLabel
              ? `${filterModalObj.label} ${filterModalObj.subLabel}`
              : filterModalObj.label
          }}
        </p>
        <template
          v-if="filter_modal === 'log2_Median' || filter_modal === 'Age'"
        >
          <button @click="resetSlider(filter_modal)">Reset</button>
          <div class="input_wrapper">
            <vue-slider
              ref="slider"
              v-model="filters[filter_modal].numberValue.value"
              v-bind="filters[filter_modal].numberValue"
            ></vue-slider>
          </div>
        </template>
        <div v-else class="input_wrapper">
          <input
            v-model="filters[filter_modal].filterModal"
            type="text"
            placeholder="filter by text"
            @keyup.enter="closeModal"
          />
          <font-awesome-icon
            v-show="filters[filter_modal].filterModal !== ''"
            class="reset-btn"
            :icon="['fad', 'circle-xmark']"
            @click="filters[filter_modal].filterModal = ''"
          />
        </div>
      </div>
    </transition>
    <transition name="modal">
      <GeneDetailModal
        v-if="is_gene_detail_modal_on"
        :gene-id="gene_id_for_detail_modal"
      />
    </transition>
    <transition name="modal">
      <div v-if="is_compare_on" class="modal compare_modal">
        <p class="modal_title">
          <font-awesome-icon icon="search" />
          Compare with comma separated ID list
        </p>
        <div class="sample">
          <span class="ex">e.g.&nbsp;</span>
          <span
            class="sample_value"
            @click="
              gene_ids_to_compare = '5460,6657,9314,4609';
              comparisonSearch();
            "
            >Yamanaka Factors (OCT3/4, SOX2, KLF4 and C-MYC-OSKM)</span
          >
        </div>
        <div>
          <input
            v-model="gene_ids_to_compare"
            type="text"
            @keydown.enter="comparisonSearch"
          />
          <button @click="comparisonSearch">
            <font-awesome-icon icon="search" />
            Search
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import 'vue-slider-component/dist-css/vue-slider-component.css';
  import GeneDetailModal from '~/components/GeneDetailModal.vue';
  import MedianBar from '~/components/MedianBar.vue';
  import TableHeader from '~/components/TableHeader.vue';
  import MedianScale from '~/components/MedianScale.vue';

  const maxInTenth = x => {
    return Math.ceil(x / 10) * 10;
  };
  export default {
    components: {
      GeneDetailModal,
      TableHeader,
      MedianScale,
      MedianBar,
    },
    beforeRouteUpdate(to, from, next) {
      this.$forceUpdate();
    },
    // TODO: refactor
    // TODO: add sample option
    async asyncData({ $axios, query, store }) {
      console.log(query);
      if (query.id) {
        let gene_num = 1;
        if (query.id) {
          if (query.id.match(/,/g)) {
            gene_num = query.id.match(/,/g).length + 1;
          }
          let id = '';
          if (gene_num === 1) {
            id = query.id;
          } else {
            id = query.id.split(',').splice(0, 1)[0];
          }
          let data = await $axios.$get(
            `api/${store.state.active_filter}/${id}`
          );
          console.log(data);
          let median_array = [];
          let age_array = [];
          let age_max;
          let median_max;
          let original_r_inf;

          // default: Median sort
          data?.r_inf.sort(function (a, b) {
            return b.log2_Median - a.log2_Median;
          });
          data?.r_inf.forEach(datam => {
            median_array.push(datam.log2_Median);
            if (datam.Age.indexOf('-') !== -1) {
              datam.Age = datam.Age.replace(/[^0-9]/g, ',');
            }

            if (datam.Age.indexOf(',') !== -1) {
              age_array = age_array.concat(datam.Age.split(','));
            } else {
              age_array.push(Number(datam.Age));
            }
          });

          age_max = Math.max(...age_array);
          median_max = Math.max(...median_array);
          original_r_inf = [...data.r_inf];

          let compare_genes = [];
          let id_array = query.id.split(',');
          id_array.splice(0, 1);
          let compare_results = await Promise.all(
            id_array.map(id =>
              $axios.$get(`api/${store.state.active_filter}/${id}`)
            )
          );
          compare_results.forEach((gene, index) => {
            compare_genes.push(gene);
            gene.r_inf.forEach((datam, index_2) => {
              data.r_inf[index_2][`log2_Median_compare_${index + 2}`] =
                datam.log2_Median;
            });
          });
          return {
            results: data,
            gene_num: gene_num,
            original_r_inf: original_r_inf,
            age_max: age_max,
            median_max: median_max,
            compare_genes: compare_genes,
          };
        }
      }
    },
    data() {
      return {
        sort: {
          active: 'log2_Median',
          order: 'down',
        },
        filters: {
          Description: {
            label: 'Sample Description',
            innerKey: 'sample_description',
            isDisplayed: true,
            filterState: '',
            filterModal: '',
          },
          log2_Median: {
            label: 'MEDIAN [LOG2(TPM+1)]',
            innerKey: 'median',
            isDisplayed: true,
            filterState: '',
            filterModal: '',
            numberValue: {
              value: [0, 0],
              min: 0,
              max: 0,
              marks: [],
            },
          },
          'Sample types category': {
            label: 'Sample Type',
            subLabel: '(FANTOM5)',
            innerKey: 'sample_type',
            isDisplayed: true,
            filterModal: '',
            filterState: '',
          },
          'Experiments category': {
            label: 'Experiment',
            innerKey: 'expirement',
            isDisplayed: false,
            filterModal: '',
            filterState: '',
          },
          'UBERON label': {
            label: 'Anatomical structures',
            subLabel: '(UBERON)',
            innerKey: 'uberon',
            isDisplayed: true,
            filterModal: '',
            filterState: '',
          },
          'CL label': {
            label: 'Cell types',
            subLabel: '(Cell Ontology)',
            innerKey: 'cl',
            isDisplayed: true,
            filterModal: '',
            filterState: '',
          },
          Sex: {
            label: 'Sex',
            innerKey: 'sex',
            isDisplayed: false,
            filterModal: '',
            filterState: '',
          },
          Age: {
            label: 'Age',
            innerKey: 'age',
            isDisplayed: false,
            filterModal: '',
            filterState: '',
            numberValue: {
              value: [0, 0],
              min: 0,
              max: 0,
              marks: [],
            },
          },
          'Developmental stage': {
            label: 'Stage',
            innerKey: 'stage',
            isDisplayed: false,
            filterModal: '',
            filterState: '',
          },
          'NCIT label': {
            label: 'Biomedical concepts',
            subLabel: '(NCI Thesaurus: NCIt)',
            innerKey: 'ncit',
            isDisplayed: true,
            filterModal: '',
            filterState: '',
          },
        },
        is_display_settings_on: false,
        is_filter_modal_on: false,
        filter_modal: '',
        gene_id_for_detail_modal: 0,
        is_gene_detail_modal_on: false,
        gene_ids_to_compare: '',
        is_compare_on: false,
      };
    },
    computed: {
      filterModalObj() {
        if (!this.filter_modal) return {};
        return this.filters[this.filter_modal];
      },
      filteredData() {
        return this.original_r_inf
          .filter(result => {
            let is_filtered = false;
            for (const [key, col] of Object.entries(this.filters)) {
              if (col.isDisplayed) {
                // number filter
                if (col.numberValue) {
                  if (
                    col.numberValue.value[0] > result[key] ||
                    col.numberValue.value[1] < result[key]
                  ) {
                    is_filtered = true;
                  }
                }
                // text filter
                else if (
                  col.filterModal !== '' &&
                  result[key].indexOf(col.filterModal) === -1
                ) {
                  is_filtered = true;
                }
              }
            }
            return !is_filtered;
          })
          ?.sort((a, b) => {
            switch (this.sort?.order) {
              case 'up':
                if (a[this.sort?.active] < b[this.sort?.active]) {
                  return -1;
                } else if (a[this.sort?.active] > b[this.sort?.active]) {
                  return 1;
                } else {
                  return 0;
                }
              case 'down':
                if (a[this.sort?.active] > b[this.sort?.active]) {
                  return -1;
                } else if (a[this.sort?.active] < b[this.sort?.active]) {
                  return 1;
                } else {
                  return 0;
                }
            }
          });
      },
    },
    mounted() {
      const ageFilter = this.filters.Age.numberValue;
      const medianFilter = this.filters.log2_Median.numberValue;
      ageFilter.max = maxInTenth(this.age_max);
      ageFilter.value[1] = ageFilter.max;

      medianFilter.max = maxInTenth(this.median_max);
      medianFilter.value[1] = medianFilter.max;
      for (let i = 0; i < this.filters.Age.numberValue.max; i += 10) {
        ageFilter.marks.push(i);
      }
      for (let i = 0; i < this.filters.log2_Median.numberValue.max; i += 1) {
        medianFilter.marks.push(i);
      }
    },
    methods: {
      async fetchCompareData() {
        let id_array = this.$route.query.id.split(',');
        id_array.splice(0, 1);
        let compare_results = await Promise.all(
          id_array.map(id => this.$axios.$get(`${this.activeFilter}/${id}`))
        );
        this.results.r_inf.forEach(result => {
          compare_results.forEach((gene, index) => {
            gene.data.r_inf.forEach(datam => {
              result[`log2_Median_compare_${index + 2}`] = datam.log2_Median;
            });
          });
        });
      },
      showGeneDetail(id) {
        this.gene_id_for_detail_modal = id;
        this.is_gene_detail_modal_on = true;
      },
      resetSlider(type) {
        const numberValue = this.filters[type]?.numberValue;
        if (!numberValue) return;
        numberValue.value = [0, numberValue.max];
        this.$set(this.filters[type], 'numberValue', numberValue);
      },
      normalizeAge(age) {
        let normalized_age;
        if (age.indexOf('-') !== -1) {
          age = age.replace(/[^0-9]/g, ',');
        }

        if (age.indexOf(',') !== -1) {
          normalized_age = [];
          normalized_age = normalized_age.concat(age.split(','));
          normalized_age = normalized_age.map(num => Number(num));
        } else {
          normalized_age = Number(age);
        }
        return normalized_age;
      },
      switchSort(col_name, order) {
        if (this.sort.active === col_name) {
          this.sort.order = this.sort.order === 'up' ? 'down' : 'up';
        } else {
          this.sort.active = col_name;
          this.sort.order = 'up';
        }
        if (order) {
          this.sort.order = order;
        }
      },
      openFilterModal(key) {
        this.is_filter_modal_on = true;
        this.filter_modal = key;
      },
      closeModal() {
        (this.is_display_settings_on = false),
          (this.is_filter_modal_on = false),
          (this.is_gene_detail_modal_on = false),
          (this.is_compare_on = false);
      },
      comparisonSearch() {
        if (this.comparisonSearch === '') return;
        location.href = `${location.origin}${location.pathname}?id=${this.gene_ids_to_compare}`;
      },
    },
  };
</script>

<style lang="sass">
  .chart_wrapper
    min-width: 600px
    padding: 0 90px
    > .header
      position: sticky
      top: 0
      background-color: #ffffff
      max-height: 122px
      overflow: hidden
      z-index: 1
      > .header_title
        margin: 15px 0
        display: flex
        align-items: flex-start
        > h1
          display: flex
          align-items: flex-start
          margin: 0
          > .fa-info-circle
            color: $MAIN_COLOR
            font-size: 24px
            margin-right: 6px
            margin-top: 4px
            &:hover
              cursor: pointer
          .metadata
            font-size: 20px
            display: block
            margin-top: -2px
            font-weight: normal
        > button.comparison_btn
          +button
          margin-left: 20px
      > .gene_box_list
        padding: 0
        margin: 0
        display: flex
        font-size: 16px
        > .gene_box
          width: 100px
          padding: 6px 0 0 0
          font-weight: 500
          margin-right: 10px
          border-top: 8px solid
          transition: width .3s
          &.active
            width: 200px
            font-weight: bold
          > svg
            font-size: 14px
            color: $MAIN_COLOR
          &:hover
            cursor: pointer
          &.gene_1
            border-color: $COLOR_1
          &.gene_2
            border-color: $COLOR_2
          &.gene_3
            border-color: $COLOR_3
          &.gene_4
            border-color: $COLOR_4
          &.gene_5
            border-color: $COLOR_5
          &.gene_6
            border-color: $COLOR_6
          &.gene_7
            border-color: $COLOR_7
          &.gene_8
            border-color: $COLOR_8
          &.gene_9
            border-color: $COLOR_9
          &.gene_10
            border-color: $COLOR_10
    > .display_settings_wrapper
      display: flex
      justify-content: flex-end
      position: sticky
      top: 119px
      background-color: #ffffff
      z-index: 1
      > .display_settings
        color: $MAIN_COLOR
        text-decoration: underline
        margin: 5px 0
        &:hover
          cursor: pointer
    > table
      +table
      > thead > tr > th:nth-of-type(1),
      > tbody > tr > td:nth-of-type(1)
        text-align: left
      > tbody
        > tr
          > td
            &.median
              width: 230px
              padding: 12px 20px 12px 10px
      > thead > tr > th
        white-space: nowrap
        top: 147px
        &.median
          padding-right: 20px
        > svg
          &:hover
            cursor: pointer
        > .fa-search
          color: $MAIN_COLOR
          font-size: 12px
          &.active
            color: $ACTIVE_COLOR
        > .fa-sort
          color: $GRAY
          opacity: .3
        > .fa-sort-up,
        > .fa-sort-down
          color: $MAIN_COLOR
    > .modal_bg
      +modal_bg
    .modal
      +modal
      > p.modal_title
        font-size: 18px
        display: inline-block
      > button
        +button
        display: inline-block
        margin-left: 10px
      &.display_settings_modal
        width: 400px
        > .display_checkboxes
          column-count: 2
          > div
            width: 100%
            display: inline-block
            line-height: 26px
            > label
              font-size: 14px
      &.compare_modal
        > div
          display: flex
          align-items: center
          &.sample
            margin-bottom: 8px
            > span
              @include sample_query
          > input
            +text_input
          > button
            +button
            margin-left: 10px
      &.filter_modal
        width: 500px
        > .input_wrapper
          display: flex
          align-items: center
          position: relative
          > input[type="text"]
            +text_input
          > .reset-btn
            position: absolute
            right: 1rem
            --fa-secondary-opacity: 0.3
            cursor: pointer
            &:hover
              --fa-secondary-opacity: 1
              --fa-primary-color: white
              --fa-secondary-color: #488EC4
          > .vue-slider
            width: 100% !important
            margin-top: 25px
            > .vue-slider-rail
              background-color: $MAIN_COLOR_PALE
              > .vue-slider-process
                background-color: $MAIN_COLOR
    .single_gene
      &.gene_1
        &:after
          background-color: $COLOR_1 !important
      &.gene_2
        &:after
          background-color: $COLOR_2 !important
      &.gene_3
        &:after
          background-color: $COLOR_3 !important
      &.gene_4
        &:after
          background-color: $COLOR_4 !important
      &.gene_5
        &:after
          background-color: $COLOR_5 !important
      &.gene_6
        &:after
          background-color: $COLOR_6 !important
      &.gene_7
        &:after
          background-color: $COLOR_7 !important
      &.gene_8
        &:after
          background-color: $COLOR_8 !important
      &.gene_9
        &:after
          background-color: $COLOR_9 !important
      &.gene_10
        &:after
          background-color: $COLOR_10 !important
  // transition
  .modal-enter,
  .modal-leave-to
    opacity: 0
    margin-top: -20px
  .modal-enter-active,
  .modal-leave-active
    transition: opacity 0.4s, margin-top 0.4s
  .modal_bg-enter,
  .modal_bg-leave-to
    opacity: 0
  .modal_bg-enter-active,
  .modal_bg-leave-active
    transition: opacity 0.4s
</style>
