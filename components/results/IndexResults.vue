<template>
  <div class="results_wrapper">
    <div class="results_title_wrapper">
      <h2>Matching {{ filterType }}s</h2>
      <ComparisonButton />
      <div class="display_settings_wrapper">
        <button class="show_all_btn" @click="$emit('toggleDisplaySettings')">
          <font-awesome-icon icon="eye" />
          Show/hide columns
        </button>
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
          v-if="resultsCached.length === 0"
          class="warning"
          :colspan="filters.filter(x => x.is_displayed).length + 2"
        >
          <font-awesome-icon icon="exclamation-triangle" />
          <template v-if="resultsNum === 0"
            >No results found. Please check the spelling or try other
            keywords.</template
          >
          <template v-else>
            Please press the 'Find {{ filterType }}s' button to update the
            results to the current screener settings.
          </template>
        </td>
        <td
          v-else-if="tableDataIsSameAsScreener && resultsNum === 0"
          class="warning"
          :colspan="filters.filter(x => x.is_displayed).length + 2"
        >
          <font-awesome-icon icon="exclamation-triangle" />
          No results found. Please check the spelling or try other keywords.
        </td>
        <tr
          v-for="(result, resultIndex) in pageItems"
          v-else
          :key="`result_${resultIndex}`"
        >
          <td class="checkbox" @click="e => e.stopPropagation()">
            <input
              v-model="checkedResults[activeFilter.name]"
              type="checkbox"
              :value="result[keyForID]"
              @change="handleChange"
            />
          </td>
          <td v-if="filterType === 'sample'">
            <a
              class="text_with_icon"
              @click="moveToProjectPage(result['refexSampleId'])"
            >
              <font-awesome-icon icon="flask" />
              {{ result.Description }}
            </a>
          </td>
          <td
            v-for="(filter, index) of filters"
            v-show="filter.is_displayed"
            :key="index"
            :class="filter.column.replaceAll(' ', '_')"
          >
            <img
              v-if="filter.column === 'gene expression patterns'"
              :src="geneSummarySource(result.geneid)"
              :alt="result.geneid"
            />
            <a
              v-else-if="filter.column === 'symbol'"
              class="text_with_icon"
              @click="moveToProjectPage(result['geneid'])"
              ><font-awesome-icon class="left_icon" icon="dna" />
              {{ result[filter.column] }}
              <font-awesome-icon
                icon="info-circle"
                @click.stop="setGeneModal(result.geneid)"
              />
            </a>
            <a
              v-else-if="filter.column === 'geneid'"
              class="text_with_icon"
              target="_blank"
              :href="datasetInfo.url_prefix + result.geneid"
            >
              {{ result[filter.column] }}
              <font-awesome-icon icon="external-link-alt" />
            </a>
            <span
              v-else-if="isArrayLikeString(result[filter.column])"
              :key="index"
            >
              {{ JSON.parse(result[filter.column]).join(', ') }}
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
      resultsNum: {
        type: Number,
        default: 0,
      },
      filterKey: {
        type: String,
        default: 'gene',
      },
    },
    data() {
      return {
        checkedResults: { gene: [], sample: [] },
        resultsCached: [],
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
        getCheckedResults: 'get_checked_results',
        isOn: 'compare_modal',
        activeFilter: 'active_filter',
      }),
      examples() {
        return this.activeDataset[this.filterType].item_comparison_example;
      },
      resultsUniqueKeys() {
        return this.resultsCached.map(item => item[this.keyForID]);
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
          this.checkedResults[this.activeFilter.name].length ===
            this.resultsUniqueKeys.length
        );
      },
      results() {
        return this.resultsByName(this.filterType).results;
      },
      pageItems() {
        return this.resultsCached.slice(
          this.paginationObject.offset,
          this.paginationObject.offset + this.paginationObject.limit
        );
      },
      pagesNumber() {
        return Math.ceil(
          this.resultsCached.length / this.paginationObject.limit
        );
      },
    },
    watch: {
      activeDataset() {
        this.checkedResults = { gene: [], sample: [] };
        this.handleChange();
      },
      isOn() {
        if (!this.isOn) {
          this.checkedResults[this.activeFilter.name] = this.getCheckedResults;
        }
      },
      results: {
        handler(newVal) {
          if (newVal.length > 0) {
            this.resultsCached = JSON.parse(JSON.stringify(newVal));
          }
        },
        deep: true,
      },
    },
    created() {
      this.setPageType('index');
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
        setPageType: 'set_page_type',
        setCheckedResults: 'set_checked_results',
      }),
      moveToProjectPage(route) {
        this.$nuxt.$loading.start();
        this.$router.push(this.routeToProjectPage(route));
      },
      isArrayLikeString(str) {
        return str?.startsWith('[');
      },
      hasStringQuotes(str) {
        return str?.startsWith('"') && str?.endsWith('"');
      },
      toggleAllCheckbox() {
        if (this.isAllChecked) {
          this.checkedResults[this.activeFilter.name] = [];
        } else {
          this.checkedResults[this.activeFilter.name] = this.resultsUniqueKeys;
        }
        this.handleChange();
      },
      handleChange() {
        const type = this.filterKey;
        this.setCheckedResults({
          checked_results: this.checkedResults[type],
          type,
        });
      },
    },
  };
</script>
<style lang="sass" scoped>
  .results_wrapper
    min-width: 600px
    padding: $PADDING_WRAPPER
    margin-bottom: 60px
    > .results_title_wrapper
      display: flex
      width: 100%
      align-items: center
      +sample_query
      > h2
        min-width: 190px
      > .display_settings_wrapper
        +display_settings_wrapper
        > .show_all_btn
          +button
          +sub_button
          white-space: nowrap
    > table
      +table
      > tbody
        > .warning
          +warning
          padding: 40px
        > tr
          > td
            > a
              +link_with_icon
</style>
