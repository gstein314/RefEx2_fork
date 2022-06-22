<template>
  <div v-show="isActive" class="filter_tab">
    <main>
      <SearchBar
        :key="`${$vnode.key}_search`"
        :ref="`${$vnode.key}_search`"
        @updateValiditySearch="validSearch = $event"
        @updateScreener="setTableDataIsSameAsScreener(false)"
        @updateResults="setTableDataIsSameAsScreener(true)"
      />
      <div class="results_num_wrapper">
        <div class="results_num_inner">
          <h2>Estimated Results</h2>
          <p class="results_num">{{ resultsNum.toLocaleString() }}</p>
          <button
            class="find_results_btn"
            :class="{ disabled: !validSearch }"
            :disabled="!validSearch"
            @click="$refs[`${$vnode.key}_search`].showResults('all')"
          >
            <font-awesome-icon icon="search" />
            Find {{ $vnode.key }}s
          </button>
          <p v-show="!validSearch" class="warning">
            <font-awesome-icon icon="exclamation-triangle" />
            Please set search condition(s)
          </p>
        </div>
      </div>
    </main>
    <ModalViewDisplay
      v-if="isDisplaySettings"
      :index-filters="filters"
      @updateDisplaySettings="toggleDisplayFilter"
      @click.native="toggleDisplaySettings"
      @toggleDisplayOfFilter="toggleDisplayOfFilter"
    />
    <index-results
      :key="`${$vnode.key}_results`"
      :table-data-is-same-as-screener="tableDataIsSameAsScreener"
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
        tableDataIsSameAsScreener: false,
        isDisplaySettings: false,
        validSearch: false,
        filters: [
          ...(this.$store.getters.active_dataset[this.$vnode.key].filter ??
            this.$store.getters.active_filter.filter ??
            []),
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
      resultTableLength() {
        return this.resultsByName(this.$vnode.key).results.length;
      },
    },
    watch: {
      activeDataset() {
        if (this.$vnode.key === 'gene') return;
        this.filters = this.activeDataset[this.$vnode.key]?.filter;
      },
    },
    methods: {
      toggleDisplayFilter(key) {
        const index = this.filters.findIndex(filter => filter.column === key);
        if (index < 0) return;
        this.$set(this.filters, index, {
          ...this.filters[index],
          is_displayed: !this.filters[index].is_displayed,
        });
      },
      setTableDataIsSameAsScreener(bool = false) {
        this.tableDataIsSameAsScreener = bool;
      },
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
          > .warning
             +warning
          > button
            +button
</style>
