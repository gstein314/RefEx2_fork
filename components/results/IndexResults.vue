<template>
  <div class="results_wrapper">
    <div class="results_title_wrapper">
      <h2>Matching {{ filterType }}s</h2>
      <ComparisonButton />
      <span class="example">e.g.</span>
      <span
        v-for="(
          comparisonExample, comparisonExampleIndex
        ) in datasetInfo.item_comparison_example"
        :key="comparisonExampleIndex"
        class="sample_value"
        @click="$router.push(routeToProjectPage(comparisonExample.route))"
        >{{ comparisonExample.label }}</span
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
        <tr
          v-for="(result, resultIndex) in results"
          :key="`result_${resultIndex}`"
          @click="$router.push(routeToProjectPage(result[keyForID]))"
        >
          <td class="checkbox" @click="e => e.stopPropagation()">
            <input
              v-model="checkedResults"
              type="checkbox"
              :value="result[keyForID]"
            />
          </td>
          <td
            v-for="(filter, index) of filters"
            v-show="filter.is_displayed"
            :key="index"
            :class="filter.special_class"
          >
            <font-awesome-icon
              v-if="filter.special_class === 'annotation'"
              icon="info-circle"
              @click.stop="setGeneModal(result.geneid)"
            />
            <img
              v-else-if="filter.special_class === 'gene_expression_patterns'"
              :src="geneDescriptionSource(result.geneid)"
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
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    props: {
      filters: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        checkedResults: [],
      };
    },
    computed: {
      ...mapGetters({
        resultsByName: 'results_by_name',
        filterByName: 'filter_by_name',
        activeSpecie: 'active_specie',
        activeDataset: 'active_dataset',
        routeToProjectPage: 'route_to_project_page',
      }),
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
      geneDescriptionSource(resultItem) {
        return `http://penqe.com/refex_figs/geneid_${this.activeDataset.dataset.toLowerCase()}_${resultItem}.png`;
      },
    },
  };
</script>
<style lang="sass" scoped>
  .results_wrapper
    min-width: 600px
    padding: 0 90px
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
        > tr
          &:hover
            cursor: pointer
            background-color: $ACTIVE_COLOR_HOVER
          > td.gene_expression_patterns
            > img
              width: 292px
</style>
