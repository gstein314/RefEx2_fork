<template>
  <div class="wrapper">
    <div ref="chartWrapper" class="chart_wrapper">
      <div class="content">
        <h1 class="header_title">
          <font-awesome-icon
            v-if="filterType === 'gene'"
            icon="info-circle"
            @click="setGeneModal(items[0].id)"
          />
          <span class="title">
            {{ infoForMainItem.Description || infoForMainItem.name }}
            <span v-if="filterType === 'gene'" class="metadata">{{
              `(${infoForMainItem.name}, Gene ID: ${infoForMainItem.id})`
            }}</span>
          </span>
        </h1>
        <ComparisonButton />
        <item-comparison
          :items="items"
          :active-id="selectedId"
          :active-sort="resultsSort"
          :display-info-button="filterType === 'gene'"
          @select="updateSelectedItem"
          @showModal="setGeneModal"
        >
        </item-comparison>
        <a class="display_settings" @click="toggleDisplaySettings">
          <font-awesome-icon icon="eye" />
          Display settings
        </a>
      </div>
    </div>
    <ModalViewDisplay
      v-if="isDisplaySettingsOn"
      @click.native="toggleDisplaySettings"
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
      @updateSort="updateResultSort"
    />
  </div>
</template>

<script>
  import 'vue-slider-component/dist-css/vue-slider-component.css';
  import { mapMutations } from 'vuex';
  import ItemComparison from '~/components/results/ItemComparison.vue';
  import ModalViewGene from '~/components/ModalView/ModalViewGene.vue';
  import ModalViewCompare from '~/components/ModalView/ModalViewCompare.vue';
  import ModalViewDisplay from '~/components/ModalView/ModalViewDisplay.vue';
  import ModalViewFilter from '~/components/ModalView/ModalViewFilter.vue';
  import ProjectResults from '~/components/results/ProjectResults.vue';

  const logMedianFilter = {
    column: 'LogMedian',
    label: 'MEDIAN [LOG2(TPM+1)]',
    is_displayed: true,
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
    },
    beforeRouteUpdate(to, from, next) {
      this.$forceUpdate();
    },
    // TODO: refactor
    // TODO: add sample option
    async asyncData({ $axios, query, store, route }) {
      let results;
      const { project, organism } = route.params;
      store.commit('set_specie', organism);
      const { id, type } = query;
      const items = await Promise.all(
        id.split(',').map(async (id, index) => {
          const data = await $axios.$get(
            `api/${type}/${id}?dataset=${project.toLowerCase()}`
          );
          if (index === 0) results = data.refex_info;
          return {
            id,
            info: data[`${type}_info`],
            medianData: data.refex_info?.map(x => x.LogMedian),
          };
        })
      );
      // set filters
      // In case of Gene, use dataset filters (sample values)
      // In case of Sample, use fixed gene filters with exception of geneDataFromGeneInfo (gene values)
      const infoFromCurrentDataset = store.getters.dataset_by_name(project);
      const filters = [
        ...(type === 'gene'
          ? infoFromCurrentDataset['sample']['filter']
          : store.getters.filter_by_name('gene')?.filter || []),
      ];

      // get fixed options for search
      const optionsStaticData = await $axios.$get(`api/cv`);
      if (project in optionsStaticData) {
        for (const [key, value] of Object.entries(optionsStaticData[project])) {
          console.log(optionsStaticData[project]);
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
      filters.splice(1, 0, logMedianFilter);

      return {
        filterType: type,
        items,
        geneIdKey: infoFromCurrentDataset.gene.key,
        filters,
        results,
        dataset: project,
        selectedId: items[0].id,
      };
    },
    data() {
      return {
        resultsSort: {
          key: '',
          order: 'down',
        },
        optionsStaticData: {},
        isDisplaySettingsOn: false,
        heightChartWrapper: 200,
      };
    },
    computed: {
      // TODO: see if needs refactoring
      resultsWithMedianData() {
        return this.results.map((result, index) => {
          return {
            ...result,
            combinedMedianData: this.medianDataBySymbol[index],
          };
        });
      },
      sampleIdKey() {
        return this.filterType === 'gene' ? 'sample_id' : 'id';
      },
      medianDataBySymbol() {
        return this.results
          .map(x => x.LogMedian)
          .reduce((acc, _curr, resultIndex) => {
            const itemToPush = this.items.reduce((obj, item) => {
              obj[item.id] = +item.medianData[resultIndex];
              return obj;
            }, {});
            acc.push(itemToPush);
            return acc;
          }, []);
      },
      mainItem() {
        return this.items[0];
      },
      infoForMainItem() {
        return this.mainItem?.info;
      },
      selectedItem() {
        return this.items.find(item => item.id === this.selectedId);
      },
    },
    mounted() {
      this.heightChartWrapper = this.$refs.chartWrapper.clientHeight;
      this.$store.commit('set_project_filters', this.filters);
      this.$store.commit('set_project_results', this.resultsWithMedianData);
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
      updateResultSort(sort) {
        // reset selectedItem if sort other then median is changed
        if (sort.key !== 'LogMedian')
          this.selectedId = this.mainItem[this.sampleIdKey];
        this.resultsSort = sort;
      },
      updateSelectedItem({ id, sortOrder = 'down' }) {
        this.selectedId = id;
        this.$refs.results.switchSort('LogMedian', sortOrder);
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
    .chart_wrapper
      display: flex
      position: sticky
      left: 0
      min-width: 100vw
      max-width: fit-content
      position: sticky
      background-color: white
      top: 0
      z-index: 1
      > .content
        gap: 20px
        padding: 10px 15px 10px 60px
        display: grid
        min-width: fit-content
        grid-template-columns: 1fr auto
        grid-template-rows: auto auto
        width: calc(100vw - 130px)
        > .comparison_btn
          margin-left: 0
          height: fit-content
          place-self: flex-end
        > .header_title
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
        > .display_settings
          +display_settings
          place-self: flex-end
</style>
