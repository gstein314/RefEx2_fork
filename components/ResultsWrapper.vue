<template>
  <div class="results_wrapper">
    <div class="results_title_wrapper">
      <h2>Matching {{ filterObj.name }}s</h2>
      <button class="show_all_btn" @click="comparisonSearch">
        <font-awesome-icon icon="chart-bar" />
        Comparison
      </button>
      <span class="example">e.g.</span>
      <span
        class="sample_value"
        @click="$router.push(`${routerPrefix}?id=5460,6657,9314,4609`)"
        >Yamanaka Factors (OCT3/4, SOX2, KLF4 and C-MYC-OSKM)</span
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
          <th v-for="(column, index) of filterObj.columns" :key="index">
            {{ column.header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="result in results"
          :key="result[filterObj.unique_key]"
          @click="
            $router.push(`${routerPrefix}?id=${result[filterObj.unique_key]}`)
          "
        >
          <td class="checkbox" @click="e => e.stopPropagation()">
            <input
              v-model="checkedResults"
              type="checkbox"
              :value="result[filterObj.unique_key]"
            />
          </td>
          <td
            v-for="(column, index) of filterObj.columns"
            :key="index"
            :class="column.specialClass || ''"
          >
            <font-awesome-icon
              v-if="column.specialClass === 'annotation'"
              icon="info-circle"
              @click.stop="
                setGeneModal({
                  isShowing: true,
                  geneId: result[filterObj.unique_key],
                })
              "
            />
            <img
              v-else-if="column.specialClass === 'gene_expression_patterns'"
              :src="geneDescriptionSource(result[filterObj.unique_key])"
              :alt="result[filterObj.unique_key]"
            />
            <span
              v-for="(value, value_index) of JSON.parse(result[column.key])"
              v-else-if="result[column.key].startsWith('[')"
              :key="value_index"
            >
              {{ value }}
              <span
                v-if="value_index < JSON.parse(result[column.key]).length - 1"
                >,</span
              >
            </span>
            <template v-else-if="hasStringQuotes(result[column.key])">
              {{ result[column.key].replaceAll('"', '') }}
            </template>
            <template v-else> {{ result[column.key] }}</template>
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
        activeProject: 'active_project',
      }),
      routerPrefix() {
        return `${this.activeSpecie.suggestions_key}/${this.activeProject}`;
      },
      filterObj() {
        return this.filterByName(this.$vnode.key.split('_')[0]);
      },
      isAllChecked() {
        return (
          this.resultsUniqueKeys.length > 0 &&
          this.checkedResults.length === this.resultsUniqueKeys.length
        );
      },
      results() {
        return this.resultsByName(this.filterObj.name).results;
      },
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
      }),
      hasStringQuotes(str) {
        return str.startsWith('"') && str.endsWith('"');
      },
      convertStringToArray(str) {
        return typeof str === 'string' ? str.split(',') : str;
      },
      toggleAllCheckbox() {
        this.isAllChecked
          ? (this.checkedResults = [])
          : (this.checkedResults = this.resultsUniqueKeys);
      },
      comparisonSearch() {
        if (this.checkedResults.length === 0) return;
        const compareItems = [
          ...(this.checked_results.length > 10
            ? this.checked_results.slice(0, 10)
            : this.checked_results),
        ];
        this.$router.push(`${this.routerPrefix}?id=${compareItems}`);
      },
      geneDescriptionSource(resultItem) {
        return `http://penqe.com/refex_figs/${this.activeSpecie?.suggestions_key.toLowerCase()}_${this.activeProject.toLowerCase()}_${resultItem}.png`;
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
      > button.show_all_btn
        +button
        margin-left: 18px
      > span
        +sample_query
        &.ex
          margin-left: 20px
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
