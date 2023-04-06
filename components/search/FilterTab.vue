<template>
  <div v-show="isActive" class="filter_tab">
    <main @keyup.enter="enterKeySearch($vnode.key)">
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
            :class="{
              disabled: !validSearch,
              update: !tableDataIsSameAsScreener,
            }"
            :disabled="!validSearch"
            @click="showSearchResult($vnode.key)"
          >
            <font-awesome-icon icon="search" />
            Find {{ $vnode.key }}s
          </button>
          <p v-show="!validSearch" class="warning small">
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
      :results-num="resultsNum"
      :filters="filters"
      :filter-key="`${$vnode.key}`"
      @toggleDisplaySettings="toggleDisplaySettings"
    />
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';
  import IndexResults from '~/components/results/IndexResults.vue';
  import filters from '../../static/filters.json';

  export default {
    components: {
      IndexResults,
    },
    data() {
      return {
        tableDataIsSameAsScreener: false,
        isDisplaySettings: false,
        validSearch: false,
        // TODO: When returning from the sample project page to the index page, the filters on the gene side are empty. This is handled by loading filters.json, but it needs to be rewritten if the contents of the filters on the gene side are no longer fixed.
        filters: [
          ...(this.$store.getters.active_dataset[this.$vnode.key].filter ??
            this.$store.getters.active_filter.filter ??
            filters[0].filter ??
            []),
        ],
      };
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
        resultsByName: 'results_by_name',
        filterByName: 'filter_by_name',
        searchConditions: 'get_search_conditions',
      }),
      isActive() {
        return this.$vnode.key === this.$store.state.active_filter;
      },
      resultsNum() {
        return this.resultsByName(this.$vnode.key).results_num ?? 0;
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
      ...mapMutations({
        setSearchConditions: 'set_search_conditions',
      }),
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
      showSearchResult(vnodeKey) {
        this.$refs[`${vnodeKey}_search`].showResults('all');
        this.validSearch = false;
      },
      enterKeySearch(vnodeKey) {
        if (this.validSearch) {
          this.showSearchResult(vnodeKey);
          this.$refs[
            `${vnodeKey}_search`
          ].$refs.searchInput.inputElement.blur();
        }
      },
    },
  };
</script>
<style lang="sass">
  .filter_tab
    > main
      min-width: 600px
      padding: $PADDING_WRAPPER
      display: flex
      justify-content: space-between
      > .results_num_wrapper
        min-width: 175px
        margin-left: 15px
        > .results_title_inner
          display: flex
          justify-content: flex-end
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
          > .small
            font-size: 0.7rem
          > button
            +button
            background-color: $WARNING_BUTTON_COLOR
            &:hover
              background: $WARNING_BUTTON_COLOR_HOVER
</style>
