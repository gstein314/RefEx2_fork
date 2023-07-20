<template>
  <div class="wrapper">
    <p v-if="isError" class="error">
      <font-awesome-icon icon="exclamation-triangle" />
      An error has occured while fetching the data. Please check wheter the URL
      contains the correct information.
    </p>
    <div v-else ref="chartWrapper" class="chart_wrapper">
      <LocalNavigation :symbol="infoForMainItem" />
      <div class="content">
        <h1 class="header_title">
          <div class="title">
            <span>
              {{
                infoForMainItem.symbol ||
                infoForMainItem.Description ||
                infoForMainItem.name
              }}
            </span>
            <font-awesome-icon
              v-if="filterType === 'gene'"
              icon="info-circle"
              @click="setGeneModal(items[0].id)"
            />
            <font-awesome-icon
              v-else-if="filterType === 'sample'"
              icon="info-circle"
              @click="setSampleModal(items[0].id)"
            />
          </div>
          <span v-if="filterType === 'gene'" class="metadata">{{
            `(${infoForMainItem.name}, Gene ID: ${infoForMainItem.id})`
          }}</span>
          <span v-else-if="filterType === 'sample'" class="metadata">{{
            `(Sample ID: ${infoForMainItem.RefexSampleId})`
          }}</span>
        </h1>
        <item-comparison
          v-if="filterType === 'gene'"
          :items="items"
          :active-id="selectedId"
          :display-info-button="filterType === 'gene'"
          :project-sort-columns="projectSortColumns"
          @select="updateSelectedItem"
          @showModal="setGeneModal"
        >
        </item-comparison>
        <item-comparison
          v-else-if="filterType === 'sample'"
          :items="items"
          :active-id="selectedId"
          :display-info-button="filterType === 'sample'"
          :project-sort-columns="projectSortColumns"
          @select="updateSelectedItem"
          @showModal="setSampleModal"
        >
        </item-comparison>
        <div class="results_title_wrapper">
          <div class="align_left">
            <DownloadButton
              ref="downloadButton"
              :download-data="resultsDisplayed"
              :file-name="tsvTitle"
              :fields-array="projectTableHead"
            />
            <CopyButton icon="link" text="Share" :content="currentUrl" />
          </div>
          <div class="align_right">
            <button class="reset_btn" :class="isNoSort" @click="clearSortArray">
              <font-awesome-icon icon="rotate-right" />
              Reset sorting column(s)
            </button>
            <button class="show_all_btn" @click="toggleDisplaySettings">
              <font-awesome-icon icon="eye" />
              Show/hide columns
            </button>
          </div>
        </div>
      </div>
    </div>
    <ModalViewDisplay
      v-if="isDisplaySettingsOn"
      @click.native="toggleDisplaySettings"
    />
    <ModalViewFilter />
    <ModalViewGene />
    <ModalViewSample />
    <ModalViewCompare />
    <project-results
      ref="results"
      :height-chart-wrapper="heightChartWrapper"
      :items="items"
      :current-page-id="currentPageId"
      :gene-id-key="geneIdKey"
      :dataset="dataset"
      :selected-item="selectedId"
      :columns-array="columnsArray"
      :column-sorters-array="columnSortersArray"
      :orders-array="ordersArray"
      :filtered-sorted-data="filteredSortedData"
      @activeSort="setProjectSortColumn"
    />
    <ResultsPagination
      ref="resultsPagination"
      :pages-number="$store.state.project_pages_number"
      :results-displayed="resultsDisplayed"
      table-type="project"
      class="pagination"
    />
  </div>
</template>

<script>
  import LocalNavigation from '../../components/search/LocalNavigation/LocalNavigation.vue';
  import 'vue-slider-component/dist-css/vue-slider-component.css';
  import { mapGetters, mapMutations } from 'vuex';
  import ItemComparison from '~/components/results/ItemComparison.vue';
  import ModalViewGene from '~/components/ModalView/ModalViewGene.vue';
  import ModalViewSample from '~/components/ModalView/ModalViewSample.vue';
  import ModalViewCompare from '~/components/ModalView/ModalViewCompare.vue';
  import ModalViewDisplay from '~/components/ModalView/ModalViewDisplay.vue';
  import ModalViewFilter from '~/components/ModalView/ModalViewFilter.vue';
  import ProjectResults from '~/components/results/ProjectResults.vue';
  import ResultsPagination from '~/components/results/ResultsPagination.vue';
  import _ from 'lodash';

  const logMedianFilter = {
    column: 'LogMedian',
    label: 'log2(TPM+1)',
    is_displayed: true,
    filterModal: '',
  };

  const description = {
    column: 'Description',
    label: 'Description',
    is_displayed: true,
    filterModal: '',
  };

  export default {
    components: {
      LocalNavigation,
      ItemComparison,
      ModalViewGene,
      ModalViewCompare,
      ModalViewDisplay,
      ModalViewFilter,
      ProjectResults,
      ResultsPagination,
    },
    async beforeRouteUpdate(to, from, next) {
      this.$nuxt.$loading.start();
      this.currentPageId = to.query.id;
      await this.$nuxt.refresh();
      next();
      this.$forceUpdate();
    },
    async asyncData({ $axios, query, store, route }) {
      let results;
      let resultsAll = {};
      let isError = false;
      const { project, organism } = route.params;
      store.commit('set_specie', organism);
      const { id, type } = query;
      const items = await Promise.all(
        id.split(',').map(async (id, index) => {
          const data = await $axios.$get(
            `api/${type}/${id}?dataset=${project.toLowerCase()}`
          );
          if (data[`${type}_info`]?.error) {
            isError = true;
          }
          resultsAll[id] = data.refex_info.map((result, index) => {
            const createNumberSorter = str => {
              if (str === undefined) return;
              const toNum = str => {
                const numOrStr = parseInt(str);
                return Number.isNaN(numOrStr) ? str : numOrStr;
              };
              let order = toNum(str);
              if (typeof order === 'string') {
                order.toUpperCase();
                switch (order) {
                  case 'X':
                    order = 23;
                    break;
                  case 'Y':
                    order = 24;
                    break;
                  case 'MT':
                    order = 25;
                    break;
                  case '-':
                    order = 26;
                    break;
                }
              }
              return order;
            };
            result.chromosomePositionInt = createNumberSorter(
              result.chromosomePosition
            );
            if (
              result.alias &&
              result.alias.startsWith('"') &&
              result.alias.endsWith('"')
            ) {
              result.alias = result.alias.replaceAll('"', '');
            } else if (result.alias && result.alias.startsWith('[')) {
              result.alias = JSON.parse(result.alias).join(', ');
            }
            return {
              ...result,
              itemNum: index,
            };
          });
          store.commit('set_project_results_all', resultsAll);
          store.commit('set_active_filter', type);
          const mapStatData = (data, stat) =>
            data.refex_info?.map(x => {
              x = parseFloat(x[stat]);
              return x;
            });
          return {
            id,
            info: data[`${type}_info`],
            minData: mapStatData(data, 'LogMin'),
            firstQuartileData: mapStatData(data, 'Log1stQu'),
            medianData: mapStatData(data, 'LogMedian'),
            thirdQuartileData: mapStatData(data, 'Log3rdQu'),
            maxData: mapStatData(data, 'LogMax'),
            sdData: mapStatData(data, 'LogSd'),
            numberOfSamplesData: mapStatData(data, 'NumberOfSamples'),
          };
        })
      );
      if (isError) return { isError };
      // set filters
      // In case of Gene, use dataset filters (sample values)
      // In case of Sample, use fixed gene filters with exception of geneDataFromGeneInfo (gene values)
      const infoFromCurrentDataset = store.getters.dataset_by_name(project);
      let filters = [
        ...(type === 'gene'
          ? infoFromCurrentDataset['sample']['filter']
          : store.getters.filter_by_name('gene')?.filter || []),
      ];

      // get fixed options for search
      const optionsStaticData = await $axios.$get(`api/cv`);
      if (project in optionsStaticData) {
        for (const [key, value] of Object.entries(optionsStaticData[project])) {
          const filterIndex = filters.findIndex(x => x.column === key);
          if (filterIndex > -1) {
            filters[filterIndex].options = value;
          }
        }
      }

      let geneIdIndex = filters.findIndex(x => x.column === 'geneid');

      if (geneIdIndex)
        filters[geneIdIndex] = {
          ...filters[geneIdIndex],
          column: infoFromCurrentDataset.gene.key,
          label: infoFromCurrentDataset.gene.header,
        };
      if (type === 'gene') {
        filters = [description, logMedianFilter, ...filters];
        store.commit('set_project_filters', filters);
      } else {
        filters.splice(1, 0, logMedianFilter);
        store.commit('set_project_filters', filters);
      }
      store.commit('set_project_items', {
        items: items,
      });

      return {
        filterType: type,
        items,
        isError,
        geneIdKey: infoFromCurrentDataset.gene.key,
        filters,
        results,
        dataset: project,
        selectedId: items[0].id,
      };
    },
    data() {
      return {
        optionsStaticData: {},
        isDisplaySettingsOn: false,
        heightChartWrapper: 200,
        projectTableHead: [],
        columnsArray: [],
        ordersArray: [],
        currentPageId: '',
      };
    },
    computed: {
      ...mapGetters({
        projectResults: 'get_project_results',
        projectResultsAll: 'get_project_results_all',
        projectFilters: 'project_filters',
        activeSpecie: 'active_specie',
        activeDataset: 'active_dataset',
        activeFilter: 'active_filter',
      }),
      projectItems() {
        return {
          items: this.items,
        };
      },
      sampleIdKey() {
        return this.filterType === 'gene' ? 'sample_id' : 'id';
      },
      mainItem() {
        return this.items[0] || {};
      },
      infoForMainItem() {
        return this.mainItem?.info;
      },
      selectedItem() {
        return this.items.find(item => item.id === this.selectedId);
      },
      isNoSort() {
        return this.columnsArray.length === 0 ? 'disabled' : '';
      },
      tsvTitle() {
        const today = this.$getToday();
        return `RefEx2_${this.activeSpecie.species}_${this.activeDataset.dataset}_${this.filterType}_comparison_${today}.tsv`;
      },
      roundDownClientHeight() {
        return Math.floor(
          this.$refs.chartWrapper.getBoundingClientRect().height
        );
      },
      projectSortColumns() {
        return [this.columnsArray, this.ordersArray];
      },
      columnSortersArray() {
        const arr = [];
        for (const column of this.columnsArray) {
          const sorter = data =>
            column === 'ncbiGeneId'
              ? parseInt(data[column], 10)
              : typeof data[column] === 'string'
              ? data[column].toLowerCase()
              : data[column];
          arr.push(sorter);
        }
        return arr;
      },
      resultsWithCombinedMedians() {
        const medianArraysObj = {};
        const projectResults =
          this.projectResultsAll[this.selectedItem.id] ||
          this.projectResultsAll[this.currentPageId];
        for (const item of Object.values(this.items)) {
          const symbolOrDescription = info => info.symbol || info.Description;
          medianArraysObj[`LogMedian_${symbolOrDescription(item.info)}`] =
            item.medianData;
        }

        const combinedLogMediansArray = _.zip(
          ...Object.values(medianArraysObj)
        ).map(arr => _.zipObject(Object.keys(medianArraysObj), arr));

        const resultsWithCombinedMedians = projectResults.map((result, i) => {
          const combinedLogMediansObj = combinedLogMediansArray[i];
          return Object.assign({}, result, combinedLogMediansObj);
        });
        return resultsWithCombinedMedians;
      },
      filteredSortedData() {
        const copy = [...this.resultsWithCombinedMedians];
        const inRange = (x, [min, max]) => {
          return typeof x !== 'number' || (x - min) * (x - max) <= 0;
        };
        const textFilter = (fullText, inputText) => {
          const reg = new RegExp(inputText, 'gi');
          const isMatch = reg.test(fullText);
          if (inputText.length > 0 && isMatch) return fullText.replaceAll(reg);
        };
        const createNumberList = str =>
          str
            .replace('-', ',')
            .split(',')
            .map(x => parseInt(x) || 'out of filter bounds');
        const filtered = copy.filter(result => {
          let isFiltered = false;
          for (const filter of this.projectFilters) {
            const key = filter.column;
            if (!filter.is_displayed) continue;
            // options filter
            else if (filter.options) {
              if (typeof filter.filterModal === 'string') {
                this.$store.commit('update_project_filters', {
                  filter: [filter.filterModal],
                });
              }
              if (!filter.filterModal.includes(result[key])) isFiltered = true;
            }
            // number filter
            else if (
              typeof filter.filterModal === 'number' ||
              Array.isArray(filter.filterModal)
            ) {
              // checks if all values are in range. Creates a list in case of Age due to multiple values in string form
              const n =
                key === 'Age' ? createNumberList(result[key]) : [result[key]];
              if (n.find(x => inRange(x, filter.filterModal)) === undefined)
                isFiltered = true;
            }
            // text filter
            else if (filter.filterModal !== '' && !isFiltered) {
              // exact match if filter is based on API options
              const isMatch = textFilter(result[key], filter.filterModal);
              isFiltered = filter.filterModal !== '' && !isMatch;
            }
          }
          return !isFiltered;
        });
        this.updateProjectTableHead();
        const multisortData = data =>
          _.orderBy(data, this.columnSortersArray, this.ordersArray);
        const filteredSortedData = multisortData(filtered);
        return filteredSortedData;
      },
      resultsDisplayed() {
        const displayed = [];
        for (const filter of this.projectFilters) {
          if (filter.is_displayed) displayed.push(filter.column);
        }
        const logMedianKeys = [];
        for (const key of Object.keys(this.resultsWithCombinedMedians[0])) {
          if (key.startsWith('LogMedian_')) {
            logMedianKeys.push(key);
          }
        }
        const resultsDisplayed = [];
        for (const item of this.filteredSortedData) {
          const filtered = Object.keys(item)
            .filter(itemKey => displayed.includes(itemKey))
            .reduce((resultDisplayed, itemKey) => {
              if (itemKey === 'LogMedian') {
                for (const logMediankey of logMedianKeys) {
                  resultDisplayed[logMediankey] = item[logMediankey];
                }
              } else if (itemKey === 'alias') {
                resultDisplayed[itemKey] = this.$composeAlias(item[itemKey]);
              } else resultDisplayed[itemKey] = item[itemKey];
              return resultDisplayed;
            }, {});
          resultsDisplayed.push(filtered);
        }
        return resultsDisplayed;
      },
      currentUrl() {
        return window.location.href;
      },
    },
    created() {
      this.$store.commit('set_project_items', this.projectItems);
    },
    mounted() {
      if (this.isError) return;
      this.checkSampleAlias();
      this.$store.commit('set_project_filters', this.filters);
      this.$store.commit(
        'set_project_results',
        this.projectResultsAll[this.selectedId]
      );
      this.setProjectSortColumn({
        column: 'LogMedian',
        selectedItem: this.selectedId,
      });
    },
    updated() {
      this.heightChartWrapper = Math.floor(
        this.$refs.chartWrapper.getBoundingClientRect().height
      );
    },
    destroyed() {
      this.setSampleAlias();
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
        setSampleModal: 'set_sample_modal',
      }),
      toggleDisplaySettings() {
        this.isDisplaySettingsOn = !this.isDisplaySettingsOn;
      },
      toggleDisplayOfFilter(arr) {
        this.filters = arr;
      },
      updateSelectedItem(id) {
        this.setProjectSortColumn({
          column: 'LogMedian',
          selectedItem: id,
        });
        this.selectedId = id;
        requestAnimationFrame(
          () => (this.heightChartWrapper = this.roundDownClientHeight)
        );
      },
      checkSampleAlias() {
        if (this.filterType === 'sample') {
          this.filters.forEach(function (filter) {
            if (filter.column === 'alias') {
              filter.is_displayed = false;
            }
          });
        }
      },
      setSampleAlias() {
        if (this.filterType === 'sample') {
          this.filters.forEach(function (filter) {
            if (filter.column === 'alias') {
              filter.is_displayed = true;
            }
          });
        }
      },
      setProjectSortColumn({ column, selectedItem }) {
        if (column === 'chromosomePosition') {
          column += 'Int';
        }
        const columnIndex = this.columnsArray.indexOf(column);
        if (columnIndex === -1) {
          this.columnsArray.unshift(column);
          this.ordersArray.unshift('desc');
        } else if (column === 'LogMedian' && this.selectedId !== selectedItem) {
          this.ordersArray.splice(columnIndex, 1, 'desc');
        } else if (this.ordersArray[columnIndex] === 'desc') {
          this.ordersArray.splice(columnIndex, 1, 'asc');
        } else {
          this.columnsArray.splice(columnIndex, 1);
          this.ordersArray.splice(columnIndex, 1);
        }
      },
      clearSortArray() {
        this.columnsArray = [];
        this.ordersArray = [];
      },
      updateProjectTableHead() {
        const arr = [];
        for (const filter of this.projectFilters) {
          if (
            !filter.is_displayed ||
            filter.column === 'gene expression patterns'
          )
            continue;
          const obj = {};
          if (filter.column === 'LogMedian') {
            for (const oldHead of Object.keys(
              this.resultsWithCombinedMedians[0]
            )) {
              if (oldHead.includes('LogMedian_')) {
                const medianObj = {};
                const newHead = oldHead
                  .replace('LogMedian_', '')
                  .concat('_Median (log2(TPM+1))');
                medianObj[oldHead] = newHead;
                arr.push(medianObj);
              }
            }
            continue;
          }
          obj[filter.column] = filter.note
            ? `${filter.label} (${filter.note})`
            : filter.label;
          arr.push(obj);
        }
        this.projectTableHead = arr;
      },
    },
  };
</script>

<style lang="sass">
  .wrapper
    display: flex
    min-width: fit-content
    flex-direction: column
    margin-bottom: 50px
    > .error
      display: flex
      color: $ERROR_COLOR
      justify-content: center
      align-items: center
      height: 100%
      width: 100%
      font-size: 20px
      margin: 40px
      > .fa-triangle-exclamation
        margin-right: 6px
    .chart_wrapper
      display: flex
      flex-direction: column
      position: sticky
      left: 0
      min-width: calc(100vw - 15px)
      max-width: fit-content
      position: sticky
      background-color: white
      top: 0
      z-index: 2
      > .content
        gap: 20px
        padding: 10px 20px
        display: flex
        flex-direction: column
        min-width: fit-content
        > .header_title
          align-items: flex-start
          margin: 0
          .fa-circle-info
            color: $MAIN_COLOR
            font-size: 24px
            &:hover
              cursor: pointer
          > .title
            display: flex
            align-items: center
            gap: 5px
          .metadata
            font-size: 20px
            display: block
            margin-top: -2px
            font-weight: normal
        > .results_title_wrapper
          display: grid
          grid-template-columns: 1fr 1fr
          width: 100%
          align-items: center
          > .align_left
            display: flex
            position: relative
            justify-content: flex-start
            gap: 10px
          > .align_right
            display: flex
            justify-content: flex-end
            align-self: end
            gap: 10px
            > .reset_btn, .show_all_btn
              +button
              +sub_button
    .pagination
      display: flex
      position: sticky
      left: 0
      min-width: calc(100vw - 55px)
      max-width: fit-content
      position: sticky
      background-color: white
      top: 0
      padding: $PADDING_WRAPPER
</style>
