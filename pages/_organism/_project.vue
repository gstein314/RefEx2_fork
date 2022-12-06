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
            <DownloadButton
              :download-data="projectResultsView"
              :file-name="tsvTitle"
              :fields-array="projectTableHead"
            />
            <ComparisonButton />
          </div>
          <div class="align_right">
            <button class="reset_btn" :class="isNoSort" @click="clearSortArray">
              <font-awesome-icon icon="xmark" />
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
      @updateProjectTableHead="updateProjectTableHead"
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
      :columns-array="columnsArray"
      :column-sorters-array="columnSortersArray"
      :orders-array="ordersArray"
      :detailed-stat-title="detailedStatTitle"
      @activeSort="setProjectSortColumn"
      @setProjectResultsView="setProjectResultsView"
      @updateProjectTableHead="updateProjectTableHead"
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
  import DownloadButton from '~/components/DownloadButton.vue';

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
            // create number type keys for "ncbiGeneId" and "chromosomePosition" before sorting
            const toNum = str => {
              const num = parseInt(str);
              return Number.isNaN(num) ? str : num;
            };
            result.ncbiGeneIdInt = toNum(result.ncbiGeneId);
            const chrToNum = str => {
              if (str === undefined) return;
              let chr = toNum(str);
              if (typeof chr === 'string') {
                chr.toUpperCase();
                switch (chr) {
                  case 'X':
                    chr = 23;
                    break;
                  case 'Y':
                    chr = 24;
                    break;
                  case 'MT':
                    chr = 25;
                    break;
                  case '-':
                    chr = 26;
                    break;
                }
              }
              return chr;
            };
            result.chromosomePositionInt = chrToNum(result.chromosomePosition);
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
        projectTableHead: [],
        projectResultsView: [],
        columnsArray: [],
        ordersArray: [],
        detailedStatTitle: {
          LogMin: 'Min',
          Log1stQu: '1stQu',
          LogMedian: 'Median (log2(TPM+1))',
          Log3rdQu: '3rdQu',
          LogMax: 'Max',
          LogSd: 'SD',
          NumberOfSamples: 'No. of samples',
        },
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
        return this.columnsArray.length === 0 ? 'disabled' : '';
      },
      tsvTitle() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        today = yyyy + mm + dd;
        return `RefEx2_${this.$store.state.active_specie.species}_${this.$store.state.active_dataset.dataset}_${this.$store.state.active_filter}_comparison_${today}.tsv`;
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
      this.heightChartWrapper = this.roundDownClientHeight;
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
      setProjectResultsView(arr) {
        this.projectResultsView = arr;
      },
      updateProjectTableHead() {
        // create an array of {oldHead: newHead} objs
        const arr = [];
        for (const filter of this.projectFilters) {
          if (
            !filter.is_displayed ||
            filter.column === 'gene expression patterns'
          )
            continue;
          const obj = {};
          if (filter.column === 'LogMedian') {
            const symbolOrDescription = info => info.symbol || info.Description;
            obj['LogMedian'] = `${symbolOrDescription(
              this.items[0].info
            )}_Median (log2(TPM+1))`;
            console.log(this.items[0].info);
            arr.push(obj);
            // for (const oldHead of Object.keys(this.projectResultsView[0])) {
            //   if (oldHead.includes('LogMedian_')) {
            //     const medianObj = {};
            //     const newHead = oldHead
            //       .replace('LogMedian_', '')
            //       .concat('_Median (log2(TPM+1))');
            //     medianObj[oldHead] = newHead;
            //     arr.push(medianObj);
            //   }
            // }
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
