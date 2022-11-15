<template>
  <div class="wrapper">
    <p v-if="isError" class="error">
      <font-awesome-icon icon="exclamation-triangle" />
      An error has occured while fecthing the data. Please check wheter the URL
      contains the correct information.
    </p>
    <div v-else ref="chartWrapper" class="chart_wrapper">
      <div class="content">
        <h1 class="header_title">
          <font-awesome-icon
            v-if="filterType === 'gene'"
            icon="info-circle"
            @click="setGeneModal(items[0].id)"
          />
          <span class="title">
            {{
              infoForMainItem.symbol ||
              infoForMainItem.Description ||
              infoForMainItem.name
            }}
            <span v-if="filterType === 'gene'" class="metadata">{{
              `(${infoForMainItem.name}, Gene ID: ${infoForMainItem.id})`
            }}</span>
          </span>
        </h1>
        <item-comparison
          :items="items"
          :active-id="selectedId"
          :display-info-button="filterType === 'gene'"
          :project-sort-columns="projectSortColumns"
          @select="updateSelectedItem"
          @showModal="setGeneModal"
        >
        </item-comparison>
        <div class="results_title_wrapper">
          <div class="align_left">
            <vue-json-to-csv
              :json-data="projectResultsView"
              :csv-title="csvTitle"
              :labels="projectTableHeading"
            >
              <button class="icon_on_left">
                <font-awesome-icon icon="arrow-down-to-line" />Download .csv
              </button>
            </vue-json-to-csv>
            <ComparisonButton />
          </div>
          <div class="align_right">
            <a
              v-if="isNoSort"
              class="icon_on_left reset_sort"
              @click="clearSortArray"
            >
              <font-awesome-icon icon="xmark" />
              Reset sorting column(s)
            </a>
            <a class="icon_on_left" @click="toggleDisplaySettings">
              <font-awesome-icon icon="eye" />
              Show/hide columns
            </a>
          </div>
        </div>
      </div>
    </div>
    <ModalViewDisplay
      v-if="isDisplaySettingsOn"
      @click.native="toggleDisplaySettings"
      @updateProjectTableHeading="updateProjectTableHeading"
    />
    <ModalViewFilter />
    <ModalViewGene />
    <ModalViewCompare />
    <project-results
      ref="results"
      :height-chart-wrapper="heightChartWrapper"
      :items="items"
      :gene-id-key="geneIdKey"
      :dataset="dataset"
      :selected-item="selectedId"
      :project-sort-columns="projectSortColumns"
      @activeSort="setProjectSortColumn"
      @setProjectResultsView="setProjectResultsView"
    />
    <ResultsPagination
      :pages-number="$store.state.project_pages_number"
      table-type="project"
      class="pagination"
    />
  </div>
</template>

<script>
  import 'vue-slider-component/dist-css/vue-slider-component.css';
  import { mapGetters, mapMutations } from 'vuex';
  import ItemComparison from '~/components/results/ItemComparison.vue';
  import ModalViewGene from '~/components/ModalView/ModalViewGene.vue';
  import ModalViewCompare from '~/components/ModalView/ModalViewCompare.vue';
  import ModalViewDisplay from '~/components/ModalView/ModalViewDisplay.vue';
  import ModalViewFilter from '~/components/ModalView/ModalViewFilter.vue';
  import ProjectResults from '~/components/results/ProjectResults.vue';
  import ResultsPagination from '~/components/results/ResultsPagination.vue';

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
      ItemComparison,
      ModalViewGene,
      ModalViewCompare,
      ModalViewDisplay,
      ModalViewFilter,
      ProjectResults,
      ResultsPagination,
    },
    beforeRouteUpdate(to, from, next) {
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
            return {
              ...result,
              itemNum: index,
            };
          });
          store.commit('set_project_results_all', resultsAll);
          return {
            id,
            info: data[`${type}_info`],
            minData: data.refex_info?.map(x => x.LogMin),
            firstQuartileData: data.refex_info?.map(x => x.Log1stQu),
            medianData: data.refex_info?.map(x => x.LogMedian),
            thirdQuartileData: data.refex_info?.map(x => x.Log3rdQu),
            maxData: data.refex_info?.map(x => x.LogMax),
            sdData: data.refex_info?.map(x => x.LogSd),
            numberOfSamplesData: data.refex_info?.map(x => x.NumberOfSamples),
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
      if (type === 'gene') filters = [description, logMedianFilter, ...filters];
      else filters.splice(1, 0, logMedianFilter);

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
        projectSortColumns: [[], []],
        projectTableHeading: {},
        projectResultsView: [],
      };
    },
    computed: {
      ...mapGetters({
        projectResultsAll: 'get_project_results_all',
        projectFilters: 'project_filters',
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
        return this.projectSortColumns[0].length === 0 ? false : true;
      },
      csvTitle() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yy = today.getFullYear() % 100;
        today = yy + mm + dd;

        if (this.selectedItem.info.symbol !== undefined) {
          return `${this.selectedItem.info.symbol}_${today}`;
        } else return `${this.selectedItem.info.sample_id}_${today}`;
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
      this.updateProjectTableHeading();
    },
    updated() {
      this.heightChartWrapper = this.$refs.chartWrapper.clientHeight;
    },
    destroyed() {
      this.setSampleAlias();
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
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
          () => (this.heightChartWrapper = this.$refs.chartWrapper.clientHeight)
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
        if (column === 'ncbiGeneId' || column === 'chromosomePosition') {
          column += 'Int';
        }
        const columnsArray = this.projectSortColumns[0];
        const ordersArray = this.projectSortColumns[1];
        const columnIndex = columnsArray.indexOf(column);
        if (columnIndex === -1) {
          columnsArray.push(column);
          ordersArray.push('desc');
        } else if (column === 'LogMedian' && this.selectedId !== selectedItem) {
          ordersArray.splice(columnIndex, 1, 'desc');
        } else if (ordersArray[columnIndex] === 'desc') {
          ordersArray.splice(columnIndex, 1, 'asc');
        } else {
          columnsArray.splice(columnIndex, 1);
          ordersArray.splice(columnIndex, 1);
        }
      },
      clearSortArray() {
        this.projectSortColumns = [[], []];
      },
      updateProjectTableHeading() {
        const obj = {};
        for (const filter of this.projectFilters) {
          if (!filter.is_displayed) continue;
          if (filter.column === 'LogMedian') {
            const addStatData = (objKey, csvTableTitle) => {
              const subObj = {};
              subObj.title = csvTableTitle;
              obj[objKey] = subObj;
            };
            addStatData('LogMin', 'Min');
            addStatData('Log1stQu', '1stQu');
            addStatData('LogMedian', 'Median (log2(TPM+1))');
            addStatData('Log3rdQu', '3rdQu');
            addStatData('LogMax', 'Max');
            addStatData('LogSd', 'SD');
            addStatData('NumberOfSamples', 'No. of samples');
          } else {
            const subObj = {};
            const setTitle = filter => {
              if (filter.note) {
                return (subObj.title = `${filter.label} (${filter.note})`);
              } else return (subObj.title = filter.label);
            };
            setTitle(filter);
            obj[filter.column] = subObj;
          }
        }
        this.projectTableHeading = obj;
      },
      setProjectResultsView(arr) {
        this.projectResultsView = arr;
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
      position: sticky
      left: 0
      min-width: calc(100vw - 15px)
      max-width: fit-content
      position: sticky
      background-color: white
      top: 0
      z-index: 1
      > .content
        gap: 20px
        padding: 10px 20px
        display: flex
        flex-direction: column
        min-width: fit-content
        width: 100%
        > .header_title
          display: flex
          align-items: flex-start
          margin: 0
          > .fa-circle-info
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
        > .results_title_wrapper
          display: grid
          grid-template-columns: 1fr 1fr
          width: 100%
          align-items: center
          > .align_left
            display: flex
            position: relative
            justify-content: flex-start
            > [id^=json-to-csv]
              display: flex
              justify-content: flex-end
              > button
                +link_with_icon
                padding: 0
                border: none
                background: none
                margin-right: 20px
                &.icon_on_left
                  padding-left: 18px
                  > svg
                    font-size: 1.2rem
                    top: 5px
                    margin-right: 5px
          > .align_right
            display: flex
            justify-content: flex-end
            > a
              +link_with_icon
              place-self: none
              > svg
                &[data-icon="xmark"]
                  font-size: 20px
                  top: -1px
                  left: -2px
                &[data-icon="eye"]
                  left: -6px
            > a + a
              margin-left: 20px
            > .reset_sort
              color: $ERROR_COLOR
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
