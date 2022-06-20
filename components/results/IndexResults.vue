<template>
  <div class="results_wrapper">
    <div class="results_title_wrapper">
      <h2>Matching {{ filterType }}s</h2>
      <ComparisonButton />
      <span class="example">e.g.</span>
      <span
        class="sample_value"
        @click="moveToProjectPage(examples[0].route)"
        >{{ examples[0].label }}</span
      >
      <div class="display_settings_wrapper">
        <a class="display_settings" @click="$emit('toggleDisplaySettings')">
          <font-awesome-icon icon="eye" />
          Display settings
        </a>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th class="checkbox">
            <input
              type="checkbox"
              :checked="isAllChecked"
              @click="toggleAllCheckbox"
            />
          </th>
          <th v-if="filterType === 'sample'">Description</th>
          <th
            v-for="(filter, index) of filters"
            v-show="filter.is_displayed"
            :key="index"
          >
            {{ filter.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <td
          v-if="!tableDataIsSameAsScreener"
          class="warning"
          :colspan="filters.filter(x => x.is_displayed).length"
        >
          <font-awesome-icon icon="exclamation-triangle" />
          Please press the 'Find {{ filterType }}s' button to update the results
          to the current screener settings.
        </td>
        <tr
          v-for="(result, resultIndex) in pageItems"
          v-else
          :key="`result_${resultIndex}`"
          @click="moveToProjectPage(result[keyForID])"
        >
          <td class="checkbox" @click="e => e.stopPropagation()">
            <input
              v-model="checkedResults"
              type="checkbox"
              :value="result[keyForID]"
            />
          </td>
          <td v-if="filterType === 'sample'">
            {{ result.Description }}
          </td>
          <td
            v-for="(filter, index) of filters"
            v-show="filter.is_displayed"
            :key="index"
            :class="filter.column.replaceAll(' ', '_')"
          >
            <font-awesome-icon
              v-if="filter.column === 'annotation'"
              icon="info-circle"
              @click.stop="setGeneModal(result.geneid)"
            />
            <img
              v-else-if="filter.column === 'gene expression patterns'"
              :src="geneSummarySource(result.geneid)"
              :alt="result.geneid"
            />
            <span
              v-for="(value, value_index) of JSON.parse(result[filter.column])"
              v-else-if="isArray(result[filter.column])"
              :key="value_index"
            >
              {{ value }}
              <span
                v-if="
                  value_index < JSON.parse(result[filter.column]).length - 1
                "
                >,</span
              >
            </span>
            <template v-else-if="hasStringQuotes(result[filter.column])">
              {{ result[filter.column].replaceAll('"', '') }}
            </template>
            <template v-else> {{ result[filter.column] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
    <ResultsPagination :pages-number="pagesNumber" table-type="index" />
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';
  import ResultsPagination from '~/components/results/ResultsPagination.vue';

  export default {
    components: {
      ResultsPagination,
    },
    props: {
      filters: {
        type: Array,
        default: () => [],
      },
      tableDataIsSameAsScreener: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        checkedResults: [],
      };
    },
    computed: {
      ...mapGetters({
        paginationObject: 'index_pagination',
        resultsByName: 'results_by_name',
        filterByName: 'filter_by_name',
        activeSpecie: 'active_specie',
        activeDataset: 'active_dataset',
        routeToProjectPage: 'route_to_project_page',
        geneSummarySource: 'gene_summary_source',
      }),
      examples() {
        return this.activeDataset[this.filterType].item_comparison_example;
      },
      resultsUniqueKeys() {
        return this.results.map(item => item[this.keyForID]);
      },
      keyForID() {
        return this.filterType === 'gene' ? 'geneid' : 'refexSampleId';
      },
      filterType() {
        return this.$vnode.key.split('_')[0];
      },
      datasetInfo() {
        return this.activeDataset[this.filterType];
      },
      isAllChecked() {
        return (
          this.resultsUniqueKeys.length > 0 &&
          this.checkedResults.length === this.resultsUniqueKeys.length
        );
      },
      results() {
        return this.resultsByName(this.filterType).results;
      },
      pageItems() {
        return this.results.slice(
          this.paginationObject.offset,
          this.paginationObject.offset + this.paginationObject.limit
        );
      },
      pagesNumber() {
        return Math.ceil(this.results.length / this.paginationObject.limit);
      },
    },
    watch: {
      activeDataset() {
        this.checkedResults = [];
      },
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
      }),
      moveToProjectPage(route) {
        this.$nuxt.$loading.start();
        this.$router.push(this.routeToProjectPage(route));
      },
      isArray(str) {
        return str?.startsWith('[');
      },
      hasStringQuotes(str) {
        return str?.startsWith('"') && str?.endsWith('"');
      },
      toggleAllCheckbox() {
        this.isAllChecked
          ? (this.checkedResults = [])
          : (this.checkedResults = this.resultsUniqueKeys);
      },
    },
  };
</script>
<style lang="sass" scoped>
  .results_wrapper
    min-width: 600px
    padding: 0 90px
    margin-bottom: 60px
    > .results_title_wrapper
      display: flex
      width: 100%
      align-items: center
      +sample_query
      > .display_settings_wrapper
        +display_settings_wrapper
      > button.show_all_btn
        +button
        margin-left: 18px
    > table
      +table
      > tbody
        > .warning
          +warning
          padding: 40px
        > tr
          &:hover
            cursor: pointer
</style>
