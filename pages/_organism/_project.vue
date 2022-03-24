<template>
  <div class="chart_wrapper">
    <div class="header">
      <div class="header_title">
        <h1>
          <font-awesome-icon
            icon="info-circle"
            @click="setGeneModal(selectedItem.id)"
          />
          <span class="title">
            {{ `${selectedItem.info.symbol}` }}
            <span class="metadata">{{
              `(${selectedItem.info.name}, NCBI GeneID: ${selectedItem.info.id})`
            }}</span>
          </span>
        </h1>

        <button class="comparison_btn" @click="is_compare_on = true">
          <font-awesome-icon icon="chart-bar" />
          Comparison
        </button>
      </div>
      <item-comparison
        :items="items"
        :active-id="selectedItem.id"
        active-sort="down"
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
      v-for="(item, index) of items"
      v-show="item.id === selectedItem.id"
      :key="`${index}_${item.id}`"
      v-bind="item"
    />
    <ModalViewDisplay
      v-if="isDisplaySettingsOn"
      @close="toggleDisplaySettings"
    />
    <ModalViewFilter />
    <ModalViewGene />
    <!-- <ModalViewCompare :id="idForCompareModal" /> -->
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

  export default {
    components: {
      ItemComparison,
      ModalViewGene,
      // ModalViewCompare,
      ModalViewDisplay,
      ModalViewFilter,
      ProjectResults,
    },
    beforeRouteUpdate(to, from, next) {
      this.$forceUpdate();
    },
    // TODO: refactor
    // TODO: add sample option
    async asyncData({ $axios, query, store }) {
      const items = await Promise.all(
        query.id.split(',').map(async id => {
          const data = await $axios.$get(
            `api/${store.state.active_filter}/${id}`
          );
          const results = data.r_inf;

          const medianRange = [0, null];
          // set ageRange for id
          const ageRange = [null, null];
          // set ageRange for single result
          for (const result of results) {
            if (result.log2_Median > medianRange[1]) {
              medianRange[1] = result.log2_Median;
            }

            const n = result.Age.replace('-', ',')
              .split(',')
              .map(x => parseInt(x) || 'not a number')
              .sort();
            if (n.length <= 0) return;
            result.ageNumberList = n;
            const [min, max] = [n[0], n.pop()];

            if (typeof min === 'number' && typeof max === 'number') {
              if (min < ageRange[0] || ageRange[0] === null) ageRange[0] = min;
              if (max > ageRange[1]) ageRange[1] = max;
            }
            result.ageRange = [min, max];
          }
          return {
            id,
            results,
            info: data.ginf,
            ageRange,
            medianRange,
          };
        })
      );
      return {
        items,
        selectedId: items[0].id,
      };
    },
    data() {
      return {
        isDisplaySettingsOn: false,
        gene_ids_to_compare: '',
        is_compare_on: false,
      };
    },
    computed: {
      selectedItem() {
        return this.items.find(item => item.id === this.selectedId);
      },
    },
    mounted() {
      this.$store.commit('set_project_filters', {
        ...this.selectedItem,
      });
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
      }),
      toggleDisplaySettings() {
        this.isDisplaySettingsOn = !this.isDisplaySettingsOn;
      },
      updateSelectedItem(id) {
        this.selectedId = id;
      },
      // comparisonSearch() {
      //   if (this.comparisonSearch === '') return;
      //   location.href = `${location.origin}${location.pathname}?id=${this.gene_ids_to_compare}`;
      // },
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
</style>
