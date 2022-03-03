<template>
  <div class="results_wrapper">
    <div class="results_title_wrapper">
      <h2>Matching Genes</h2>
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
          <th v-for="(column, index) of activeFilter.columns" :key="index">
            {{ column.header }}
          </th>
          <th class="annotation">Annotation</th>
          <th class="gene_expression_patterns">Gene expression patterns</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="result in results"
          :key="result.ncbiGeneId"
          @click="
            $router.push(
              `${$store.state.active_taxon}/FANTOM5?gid=${result.ncbiGeneId}`
            )
          "
        >
          <td class="checkbox" @click="e => e.stopPropagation()">
            <input
              v-model="checked_gene"
              type="checkbox"
              :value="result.ncbiGeneId"
            />
          </td>
          <td v-for="(column, index) of activeFilter.columns" :key="index">
            {{ result[column.key] }}
          </td>
          <!-- <td class="gene_symbol">{{ result.symbol }}</td>
          <td class="gene_name">{{ result.name }}</td>
          <td class="alias">
            <p
              v-if="
                result.alias &&
                typeof convertStringToArray(result.alias) === 'object'
              "
            >
              <span
                v-for="(alias, index) in convertStringToArray(result.alias)"
                :key="index"
              >
                <span>{{ alias }}</span>
                <span
                  v-if="index !== convertStringToArray(result.alias).length - 1"
                  class="comma"
                  >,</span
                >
              </span>
            </p>
            <p v-else class="contents">
              <span>{{ result.alias }}</span>
            </p>
          </td>
          <td class="NCBI_geneID">{{ result.ncbiGeneId }}</td> -->
          <td class="annotation">
            <font-awesome-icon
              icon="info-circle"
              @click.stop="$emit('showGeneDetail',result.ncbiGeneId)"
            />
          </td>
          <td class="gene_expression_patterns">
            <img
              :src="`http://penqe.com/refex_figs/human_fantom5_${result.ncbiGeneId}.png`"
              :alt="result.ncbiGeneId"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        checked_gene: [],
      };
    },
    computed: {
      ...mapGetters({
        activeFilter: 'activeFilter',
        resultObj: 'results',
        result_gene_id_list: 'resultsGeneIds',
      }),
      isAllChecked() {
        return (
          this.result_gene_id_list.length > 0 &&
          this.checked_gene.length === this.result_gene_id_list.length
        );
      },
      results() {
        return this.resultObj.results;
      },
    },
    methods: {
      convertStringToArray(str) {
        return typeof str === 'string' ? str.split(',') : str;
      },
      toggleAllCheckbox() {
        this.isAllChecked
          ? (this.checked_gene = [])
          : (this.checked_gene = this.result_gene_id_list);
      },
      comparisonSearch() {
        if (this.checked_gene.length === 0) return;
        let compare_genes = this.checked_gene;
        if (compare_genes.length > 10) {
          compare_genes = compare_genes.slice(0, 10);
        }
        this.$router.push(
          `${this.$store.state.active_taxon}/FANTOM5?gid=${compare_genes}`
        );
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
