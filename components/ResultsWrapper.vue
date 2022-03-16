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
        @click="
          $router.push(
            `${$store.state.active_taxon}/FANTOM5?gid=5460,6657,9314,4609`
          )
        "
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
          :key="result[filterObj.uniqueKey]"
          @click="
            $router.push(
              `${$store.state.active_taxon}/FANTOM5?gid=${
                result[filterObj.uniqueKey]
              }`
            )
          "
        >
          <td class="checkbox" @click="e => e.stopPropagation()">
            <input
              v-model="checked_results"
              type="checkbox"
              :value="result[filterObj.uniqueKey]"
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
                  geneId: result[filterObj.uniqueKey],
                })
              "
            />
            <img
              v-else-if="column.specialClass === 'gene_expression_patterns'"
              :src="geneDescriptionSource(result[filterObj.uniqueKey])"
              :alt="result[filterObj.uniqueKey]"
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
  import { geneDetailModal } from '@/components/GeneDetailModal.vue';

  export default {
    components: geneDetailModal,
    data() {
      return {
        checked_results: [],
      };
    },
    computed: {
      ...mapGetters({
        resultsByName: 'resultsByName',
        filterByName: 'filterByName',
        resultsUniqueKeys: 'resultsUniqueKeys',
        active_taxon: 'activeTaxon',
        active_organization: 'active_organization',
      }),
      filterObj() {
        return this.filterByName(this.$vnode.key.split('_')[0]);
      },
      isAllChecked() {
        return (
          this.resultsUniqueKeys.length > 0 &&
          this.checked_results.length === this.resultsUniqueKeys.length
        );
      },
      results() {
        return this.resultsByName(this.filterObj.name).results;
      },
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'setGeneModal',
      }),
      hasStringQuotes(str) {
        return str.startsWith('"') && str.endsWith('"');
      },
      convertStringToArray(str) {
        return typeof str === 'string' ? str.split(',') : str;
      },
      toggleAllCheckbox() {
        this.isAllChecked
          ? (this.checked_results = [])
          : (this.checked_results = this.resultsUniqueKeys);
      },
      comparisonSearch() {
        if (this.checked_results.length === 0) return;
        let compare_genes = this.checked_results;
        if (compare_genes.length > 10) {
          compare_genes = compare_genes.slice(0, 10);
        }
        this.$router.push(
          `${this.$store.state.active_taxon}/FANTOM5?gid=${compare_genes}`
        );
      },
      geneDescriptionSource(resultItem) {
        return `http://penqe.com/refex_figs/${this.active_taxon?.suggestions_key.toLowerCase()}_${this.active_organization.toLowerCase()}_${resultItem}.png`;
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
