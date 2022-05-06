<template>
  <div class="chart_wrapper">
    <div class="header">
      <div class="header_title">
        <h1>
          <font-awesome-icon
            icon="info-circle"
            @click="setGeneModal(items[0].id)"
          />
          <span class="title">
            {{ `${infoForMainItem.Description}` }}
            <span v-if="filterType === 'gene'" class="metadata">{{
              `(${infoForMainItem.name}, ID: ${
                infoForMainItem[filterType + '_id']
              })`
            }}</span>
          </span>
        </h1>
        <ComparisonButton />
      </div>
      <item-comparison
        :items="items"
        :active-id="selectedId"
        :active-sort="resultsSort"
        @select="updateSelectedItem"
        @showModal="setGeneModal"
      />
    </div>
    <div class="display_settings_wrapper">
      <a class="display_settings" @click="toggleDisplaySettings">
        <font-awesome-icon icon="eye" />
        Display settings
      </a>
    </div>

    <project-results
      ref="results"
      :results="resultsWithMedianData"
      :selected-item="selectedItem.info.symbol"
      @updateSort="updateResultSort"
    />
    <ModalViewDisplay
      v-if="isDisplaySettingsOn"
      :filters="filters"
      @click.native="toggleDisplaySettings"
      @toggleDisplayOfFilter="toggleDisplayOfFilter"
    />
    <ModalViewFilter />
    <ModalViewGene />
    <ModalViewCompare />
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

  const inRange = (x, [min, max]) => {
    return typeof x !== 'number' || (x - min) * (x - max) <= 0;
  };
  const createNumberList = str =>
    str
      .replace('-', ',')
      .split(',')
      .map(x => parseInt(x) || 'out of filter bounds')
      .sort();

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
      let results, ageRange, medianRange;
      const filterType = route.params?.project;
      // const filter = query.id.split(/(?<=\/)\w*?(?=\?)/);
      const items = await Promise.all(
        query.id.split(',').map(async (id, index) => {
          const data = await $axios.$get(
            `api/${filterType}/${id}?dataset=${store.state.active_dataset.toLowerCase()}&offset=0&limit=10`
          );
          if (index === 0) results = data.refex_info;
          return {
            id,
            info: data[`${filterType}_info`],
            medianData: data.refex_info?.map(x => x.LogMedian),
          };
        })
      );
      // set ranges based on the results. Results are gained from the first ID item
      medianRange = [0, 0];
      ageRange = [0, 0];
      for (const [resultIndex, result] of results.entries()) {
        for (const item of items) {
          if (item.medianData[resultIndex] > medianRange[1]) {
            medianRange[1] = item.medianData[resultIndex];
          }
        }

        // set age range
        if ('age' in result) {
          const n = createNumberList(result.Age);
          if (n.find(x => inRange(x, ageRange))) continue;
          ageRange[1] = n.pop();
        }
      }
      return {
        filterType,
        items,
        filters: [...store.getters.active_dataset[filterType]?.filter] || [
          ...store.getters.active_filter?.filter,
        ],
        results,
        ageRange,
        medianRange,
        selectedId: items[0].id,
      };
    },
    data() {
      return {
        resultsSort: {
          key: '',
          order: 'down',
        },
        isDisplaySettingsOn: false,
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
      medianDataBySymbol() {
        return this.results
          .map(x => x.LogMedian)
          .reduce((acc, _curr, resultIndex) => {
            const itemToPush = this.items.reduce((obj, item) => {
              obj[item.id] = item.medianData[resultIndex];
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
        return this.mainItem.info;
      },
      selectedItem() {
        return this.items.find(item => item.id === this.selectedId);
      },
    },
    mounted() {
      this.$store.commit('set_project_filters', {
        ageRange: this.ageRange,
        medianRange: this.medianRange,
      });
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
      }),
      toggleDisplaySettings() {
        this.isDisplaySettingsOn = !this.isDisplaySettingsOn;
      },
      toggleDisplayOfFilter(arr) {
        console.log(arr);
        this.filters = arr;
      },
      updateResultSort(sort) {
        // reset selectedItem if sort other then median is changed
        if (sort.key !== 'LogMedian') this.selectedId = this.mainItem.id;
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
  .chart_wrapper
    min-width: 600px
    padding: 0 90px
    > .header
      position: sticky
      top: 0
      background-color: #ffffff
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
    > .display_settings_wrapper
      +display_settings_wrapper
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
</style>
