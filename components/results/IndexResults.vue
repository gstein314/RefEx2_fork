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
          <th v-for="(filter, index) of datasetInfo.filter" :key="index">
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
            v-for="(filter, index) of datasetInfo.filter"
            :key="index"
            :class="filter.specialClass || ''"
          >
            <font-awesome-icon
              v-if="filter.specialClass === 'annotation'"
              icon="info-circle"
              @click.stop="setGeneModal(result[geneKey])"
            />
            <img
              v-else-if="filter.specialClass === 'gene_expression_patterns'"
              :src="geneDescriptionSource(result[geneKey])"
              :alt="result[geneKey]"
            />
            <span
              v-for="(value, value_index) of JSON.parse(result[filter.column])"
              v-else-if="result[filter.column].startsWith('[')"
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
    data() {
      return {
        checkedResults: [],
      };
    },
    computed: {
      ...mapGetters({
        resultsByName: 'results_by_name',
        filterByName: 'filter_by_name',
        resultsUniqueKeys: 'results_unique_keys',
        activeSpecie: 'active_specie',
        activeDataset: 'active_dataset',
        routeToProjectPage: 'route_to_project_page',
      }),
      geneKey() {
        return this.activeDataset.gene.key;
      },
      keyForID() {
        return this.filterType === 'gene' ? this.geneKey : 'refexSampleId';
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
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
      }),
      hasStringQuotes(str) {
        return str.startsWith('"') && str.endsWith('"');
      },
      toggleAllCheckbox() {
        this.isAllChecked
          ? (this.checkedResults = [])
          : (this.checkedResults = this.resultsUniqueKeys);
      },
      geneDescriptionSource(resultItem) {
        return `http://penqe.com/refex_figs/${this.geneKey.toLowerCase()}_${this.activeDataset.toLowerCase()}_${resultItem}.png`;
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
      align-items: center
      +sample_query
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
