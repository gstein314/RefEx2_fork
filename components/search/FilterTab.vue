<template>
  <div v-show="isActive" class="filter_tab">
    <main>
      <SearchBar :key="`${$vnode.key}_search`" />
      <div class="results_num_wrapper">
        <div class="results_num_inner">
          <h2>Estimated Results</h2>
          <p class="results_num">{{ resultsNum }}</p>
        </div>
      </div>
    </main>
    <ModalViewDisplay
      v-if="isDisplaySettings"
      :filters="filters"
      @click.native="toggleDisplaySettings"
      @toggleDisplayOfFilter="toggleDisplayOfFilter"
    />
    <index-results
      :key="`${$vnode.key}_results`"
      :filters="filters"
      @toggleDisplaySettings="toggleDisplaySettings"
    />
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import IndexResults from '~/components/results/IndexResults.vue';

  export default {
    components: {
      IndexResults,
    },
    data() {
      return {
        isDisplaySettings: false,
        filters: this.$store.getters.active_dataset[this.$vnode.key].filter || [
          ...this.$store.getters.active_filter.filter,
        ],
      };
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
        resultsByName: 'results_by_name',
        filterByName: 'filter_by_name',
      }),
      isActive() {
        return this.$vnode.key === this.$store.state.active_filter;
      },
      resultsNum() {
        return this.resultsByName(this.$vnode.key).results_num;
      },
    },
    watch: {
      activeDataset() {
        this.filters = this.activeDataset[this.$vnode.key]?.filter || [
          ...this.filterByName('gene').filter,
        ];
      },
    },
    methods: {
      toggleDisplayOfFilter(arr) {
        this.filters = arr;
      },
      toggleDisplaySettings() {
        this.isDisplaySettings = !this.isDisplaySettings;
      },
    },
  };
</script>
<style lang="sass">
  .filter_tab
    > main
      min-width: 600px
      padding: 0 90px
      display: flex
      > .results_num_wrapper
        margin-left: 15px
        width: 15%
        > .results_num_inner
          position: sticky
          top: 0
          display: flex
          flex-direction: column
          align-items: center
          > .results_num
            font-size: 48px
            font-weight: bold
            margin: 18px 0 14px
          > button
            +button
            opacity: .3
            pointer-events: none
            transition: opacity .3s
            &.active
              opacity: 1
              pointer-events: initial
</style>
