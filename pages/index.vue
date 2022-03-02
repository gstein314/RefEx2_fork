<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div class="index_wrapper">
    <SpeciesNavigation />
    <FilterNavigation />
    <main>
      <div class="text_search_area">
        <h2>Search Conditions</h2>
        <h3>
          Gene Name, Symbol or Summary
          <span class="example"
            >e.g.
            <dl
              @click="
                setSampleQuery({
                  type: 'gene_name',
                  query: 'transcription factor',
                })
              "
            >
              <dt>Gene Name:</dt>
              <dd class="sample_value">transcription factor</dd>
            </dl>
            ,
            <dl @click="setSampleQuery({ type: 'gene_name', query: 'ITG' })">
              <dt>Symbol:&nbsp;</dt>
              <dd class="sample_value">ITG</dd>
            </dl>
            ,
            <dl
              @click="
                setSampleQuery({ type: 'gene_name', query: 'Breast cancer' })
              "
            >
              <dt>Summary:&nbsp;</dt>
              <dd class="sample_value">Breast cancer</dd>
            </dl>
          </span>
        </h3>
        <vue-simple-suggest
          v-model="inputs.gene_name"
          :debounce="500"
          display-attribute="name"
          value-attribute="name"
          :list="getSuggestionList"
          :max-suggestions="100"
          class="text_search_gene_name"
          placeholder="transcription factor"
          @input="showAllResult('num')"
          @select="moveDetailpage"
        >
          <template slot="misc-item-above">
            <button class="show_all_btn" @click="showAllResult('all')">
              <font-awesome-icon icon="list" />
              Show all genes that match your query
            </button>
          </template>
          <!-- eslint-disable vue/no-unused-vars -->
          <!-- plugin uses slot-scope as a prop variable. {suggestion} turns into an object at the plugin-->
          <div
            slot="suggestion-item"
            slot-scope="{ suggestion }"
            v-html="
              `<b>${suggestion.symbol}</b>&nbsp;(${suggestion.name.replace(
                inputs.gene_name,
                '<b>' + inputs.gene_name + '</b>'
              )}${suggestion.alias.replace(
                inputs.gene_name,
                '<b>' + inputs.gene_name + '</b>'
              )}, NCBI_GeneID: ${suggestion.entrezgene.replace(
                inputs.gene_name,
                '<b>' + inputs.gene_name + '</b>'
              )})`
            "
          >
            <font-awesome-icon
              icon="external-link-alt"
              class="external-link-alt"
              style="font-size: 12px"
            />
          </div>
          <div
            v-if="isLoading"
            slot="misc-item-below"
            slot-scope="{ suggestion }"
            class="misc-item"
          >
            <span>Loading...</span>
          </div>
        </vue-simple-suggest>
        <div
          :class="['summary_check_wrapper', { hide: inputs.gene_name === '' }]"
        >
          <input
            id="summary_check"
            v-model="is_summary_included"
            type="checkbox"
            name="summary_check"
            @click="showAllResult('num')"
          />
          <label for="summary_check">Include this field in search</label>
        </div>
        <screener-view
          v-bind="inputs"
          :terms-g-o="input_go_terms"
          @setSampleQuery="setSampleQuery"
          @update="showAllResult"
          @updateInputs="setInputs"
          @setTags="setTags"
        />
        <button class="find_genes_btn" @click="showAllResult('all')">
          <font-awesome-icon icon="search" />
          Find Genes
        </button>
      </div>
      <div class="results_num_wrapper">
        <div class="results_num_inner">
          <h2>Estimated Results</h2>
          <p class="results_num">{{ results_num }}</p>
        </div>
      </div>
    </main>
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
              <input type="checkbox" @click="toggleAllCheckbox" />
            </th>
            <th class="gene_symbol">GeneSymbol</th>
            <th class="gene_name">GeneName</th>
            <th class="alias">Alias</th>
            <th class="NCBI_geneID">NCBI GeneID</th>
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
            <td class="gene_symbol">{{ result.symbol }}</td>
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
                    v-if="
                      index !== convertStringToArray(result.alias).length - 1
                    "
                    class="comma"
                    >,</span
                  >
                </span>
              </p>
              <p v-else class="contents">
                <span>{{ result.alias }}</span>
              </p>
            </td>
            <td class="NCBI_geneID">{{ result.ncbiGeneId }}</td>
            <td class="annotation">
              <font-awesome-icon
                icon="info-circle"
                @click.stop="showGeneDetail(result.ncbiGeneId)"
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
    <GeneDetailModal
      v-if="is_gene_detail_modal_shown"
      :gene-id="gene_id_for_detail_modal"
    />
    <div
      v-if="is_gene_detail_modal_shown"
      class="modal_bg"
      @click="is_gene_detail_modal_shown = false"
    ></div>
  </div>
</template>

<script>
  import SpeciesNavigation from '~/components/SpeciesNavigation.vue';
  import GeneDetailModal from '~/components/GeneDetailModal.vue';
  import VueSimpleSuggest from 'vue-simple-suggest';

  export default {
    components: {
      SpeciesNavigation,
      GeneDetailModal,
      VueSimpleSuggest,
    },
    data() {
      return {
        results_num: 0,
        results: [],
        inputs: {
          gene_name: '',
          go_term: '',
          sample_types: '',
          cell_types: '',
          anatomical_structures: '',
          biomedical_concepts: '',
        },
        input_go_terms: [],
        onEvent: false,
        is_summary_included: false,
        is_reload_active: false,
        isLoading: false,
        gene_id_for_detail_modal: 0,
        is_gene_detail_modal_shown: false,
        checked_gene: [],
        result_gene_id_list: [],
      };
    },
    methods: {
      toggleAllCheckbox() {
        if (this.checked_gene.length !== this.result_gene_id_list.length) {
          this.checked_gene = this.result_gene_id_list;
        } else {
          this.checked_gene = [];
        }
      },
      convertStringToArray(str) {
        if (str.indexOf('[') !== -1) {
          return str.replace(/(\[|\]|"|\s)/g, '').split(',');
        } else {
          return str;
        }
      },
      showGeneDetail(id) {
        this.gene_id_for_detail_modal = id;
        this.is_gene_detail_modal_shown = true;
      },
      setTags(newTags) {
        this.input_go_terms = [];
        if (newTags.length !== 0) {
          this.input_go_terms[0] = newTags[newTags.length - 1];
          this.is_reload_active = true;
        }
      },
      setInputs(inputs) {
        this.inputs = inputs;
      },
      setSampleQuery({ type, query, id }) {
        this.is_reload_active = true;
        if (id) {
          this.input_go_terms = [];
          this.input_go_terms.push({
            text: query,
            id,
            tiClasses: ['ti-valid'],
          });
        } else {
          this.$set(this.inputs, type, query);
        }
        this.showAllResult('num');
      },
      showAllResult(type) {
        setTimeout(() => {
          let query = {};
          query.text = this.inputs.gene_name;
          if (this.is_summary_included) {
            query.summary = 'True';
          }
          if (this.input_go_terms.length !== 0) {
            query.go = this.input_go_terms[0].id;
          }
          if (this.inputs.sample_types !== '') {
            query.celltype = this.inputs.sample_types;
          }
          if (this.inputs.cell_types !== '') {
            query.cl = this.inputs.cell_types;
          }
          if (this.inputs.anatomical_structures !== '') {
            query.uberon = this.inputs.anatomical_structures;
          }
          if (this.inputs.biomedical_concepts !== '') {
            query.ncit = this.inputs.biomedical_concepts;
          }
          let adjusted_query = '';
          if (type === 'num') {
            adjusted_query += `{numfound(`;
          } else if (type === 'all') {
            adjusted_query += `{humangene(`;
          }
          if (Object.keys(query).length > 1 && query.text === '') {
            delete query.text;
          }
          Object.keys(query).forEach((key, index) => {
            adjusted_query += `${key}:"${query[key]}"`;
            if (index !== Object.keys(query).length - 1) {
              adjusted_query += ',';
            }
          });
          if (type === 'num') {
            adjusted_query += `)}`;
          } else if (type === 'all') {
            adjusted_query += `){ncbiGeneId symbol name alias} numfound }`;
          }
          this.$axios({
            url: 'http://refex2-api.bhx.jp/gql',
            method: 'post',
            data: {
              query: adjusted_query,
            },
          }).then(result => {
            if (result.data.data.humangene) {
              this.result_gene_id_list = result.data.data.humangene.map(
                gene => gene.ncbiGeneId
              );
              this.results = result.data.data.humangene;
            }
            this.results_num = result.data.data.numfound;
            this.onEvent = false;
            this.is_reload_active = false;
          });
        }, 0);
      },
      async getSuggestionList(suggest) {
        let url = `http://refex2-api.bhx.jp/api/suggest?query=${suggest}`;
        this.isLoading = true;
        return this.$axios.$get(url).then(results => {
          this.isLoading = false;
          return results.results;
        });
      },
      moveDetailpage(suggestion) {
        this.$router.push(
          `${this.$store.state.active_taxon}/FANTOM5?gid=${suggestion.entrezgene}`
        );
        // this.$router.push({ path: '/gene/chart', query: { gid: suggestion.entrezgene, project: 'fantom5', organism: this.$store.state.active_taxon} })
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

<style lang="sass">
  .index_wrapper
    > main
      min-width: 600px
      padding: 0 90px
      display: flex
      .vue-simple-suggest
        position: relative
      > .text_search_area
        width: 85%
        > h3
          display: flex
          gap: 0.5rem
          align-items: center
          margin: 6px 0
          > span
            +sample_query
            font-size: 12px
            display: flex
            align-items: center
            color: $GRAY
            font-weight: 100
            margin-left: 10px
            > dl
              display: flex
              align-items: center
              padding: $PADDING_SLIM
              margin: 0
              > dt
                font-size: 12px
                color: $GRAY
                font-weight: 100
              > dd
                font-size: 14px
                font-weight: 300
                padding: 2px 0
                margin: 0
        .text_search_gene_name
          input
            +text_input
            font-size: 34px
          .show_all_btn
            +button
            margin-bottom: 15px
        .vue-simple-suggest.designed .suggestions
          +suggestions
        > .summary_check_wrapper
          font-size: 14px
          font-weight: 100
          display: flex
          align-items: center
          margin-top: 6px
          opacity: 1
          transition: .3s
          > label
            margin-left: 5px
          &.hide
            opacity: .5
            pointer-events: none
        > .find_genes_btn
          +button
          margin-top: 26px
          margin-bottom: 50px
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
    > .results_wrapper
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
    > .modal_bg
      +modal_bg
</style>
