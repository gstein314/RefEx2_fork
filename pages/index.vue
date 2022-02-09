<template>
  <!-- TODO: ask about v-html -->
  <!-- eslint-disable vue/no-v-html -->
  <div class="index_wrapper">
    <SpeciesNavigation />
    <main>
      <div class="text_search_area">
        <h2>Search Conditions</h2>
        <h3>
          Gene Name, Symbol or Summary
          <span>e.g.&nbsp;</span>
          <dl @click="setSampleQuery('gene_name', 'transcription factor')">
            <dt>Gene Name:&nbsp;</dt>
            <dd>transcription factor</dd>
          </dl>
          <dl @click="setSampleQuery('gene_name', 'ITG')">
            <dt>Symbol:&nbsp;</dt>
            <dd>ITG</dd>
          </dl>
          <dl @click="setSampleQuery('gene_name', 'Breast cancer')">
            <dt>Summary:&nbsp;</dt>
            <dd>Breast cancer</dd>
          </dl>
        </h3>
        <vue-simple-suggest
          v-model="input_gene_name"
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
          <!-- TODO: ask about suggestion -->
          <div
            slot="suggestion-item"
            slot-scope="{ suggestion }"
            v-html="
              `<b>${suggestion.symbol}</b>&nbsp;(${suggestion.name.replace(
                input_gene_name,
                '<b>' + input_gene_name + '</b>'
              )}${suggestion.alias.replace(
                input_gene_name,
                '<b>' + input_gene_name + '</b>'
              )}, NCBI_GeneID: ${suggestion.entrezgene.replace(
                input_gene_name,
                '<b>' + input_gene_name + '</b>'
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
          :class="['summary_check_wrapper', { hide: input_gene_name === '' }]"
        >
          <input
            id="summary_check"
            v-model="is_summary_included"
            type="checkbox"
            name="summary_check"
            @click="showAllResult('num')"
          />
          <label for="summary_check"
            >Include gene summaries in your search.</label
          >
        </div>
        <div :class="['screener_wrapper', { open: is_screener_open }]">
          <p
            class="screener_title"
            @click="is_screener_open = !is_screener_open"
          >
            <font-awesome-icon icon="filter" class="filter" />
            Screener
            <font-awesome-icon
              icon="chevron-right"
              :class="is_screener_open ? 'open' : 'close'"
            />
          </p>

          <h3>
            Genes with GO Term
            <span class="ex">e.g.&nbsp;</span>
            <span
              class="sample_value"
              @click="
                setSampleQuery(
                  'go',
                  'transcription factor binding',
                  'GO:0008134'
                )
              "
              >transcription factor binding</span
            >,
            <span
              class="sample_value"
              @click="
                setSampleQuery('go', 'cell differentiation', 'GO:0030154')
              "
              >cell differentiation</span
            >
          </h3>
          <no-ssr>
            <vue-tags-input
              v-model="input_go_term"
              :tags="input_go_terms"
              :autocomplete-items="autocomplete_go_term_items"
              :add-only-from-autocomplete="true"
              placeholder="transcription factor binding"
              @tags-changed="update"
            >
              <div
                slot="autocomplete-item"
                slot-scope="props"
                class="my-item"
                @click="props.performAdd(props.item)"
                v-html="
                  props.item.text.replace(
                    input_go_term,
                    `<b>${input_go_term}</b>`
                  )
                "
              ></div>
            </vue-tags-input>
          </no-ssr>
          <!-- <vue-simple-suggest
            :debounce="500"
            display-attribute="term"
            value-attribute="id"
            :list="getSuggestionList"
            :max-suggestions=100
            class="text_search_go_term"
            @input="is_reload_active = true"
            placeholder="transcription factor binding"
          >
            <div slot="suggestion-item" slot-scope="{ suggestion }">
              {{ `${suggestion.term},${suggestion.gocategory} ${suggestion.id}` }}
            </div>
            <div slot="misc-item-below" slot-scope="{ suggestion }" v-if="isLoading" class="misc-item">
              <span>Loading...</span>
            </div>
          </vue-simple-suggest> -->
          <h3>
            Genes that are specifically expressed in a given sample by
            classification
          </h3>
          <div class="classification_wrapper">
            <h4>
              Sample types by FANTOM5
              <span class="ex">e.g.&nbsp;</span>
              <span
                class="sample_value"
                @click="setSampleQuery('sample_types', 'cell lines')"
                >cell lines</span
              >,
              <span
                class="sample_value"
                @click="setSampleQuery('sample_types', 'stem cells')"
                >stem cells</span
              >,
              <span
                class="sample_value"
                @click="setSampleQuery('sample_types', 'primary cells')"
                >primary cells</span
              >,
              <span
                class="sample_value"
                @click="setSampleQuery('sample_types', 'tissues')"
                >tissues</span
              >
            </h4>
            <!-- <input type="text" @input="is_reload_active = true" class="text_search_sample_types" v-model="input_sample_types" placeholder="cell lines"> -->
            <vue-simple-suggest
              v-model="input_sample_types"
              :filter-by-query="true"
              :list="sample_types_list"
              :max-suggestions="100"
              class="text_search_sample_types"
              placeholder="cell lines"
              @input="showAllResult('num')"
            >
              <div
                slot="suggestion-item"
                slot-scope="{ suggestion }"
                v-html="
                  suggestion.replace(
                    input_sample_types,
                    `<b>${input_sample_types}</b>`
                  )
                "
              ></div>
            </vue-simple-suggest>
            <h4>
              Cell types by Cell Ontology
              <span class="ex">e.g.&nbsp;</span>
              <span
                class="sample_value"
                @click="setSampleQuery('cell_types', 'hepatocyte')"
                >hepatocyte</span
              >
            </h4>
            <!-- <input type="text" @input="is_reload_active = true" class="text_search_cell_types" v-model="input_cell_types" placeholder="CD14"> -->
            <vue-simple-suggest
              v-model="input_cell_types"
              :filter-by-query="true"
              :list="cell_types_list"
              :max-suggestions="100"
              class="text_search_cell_types"
              placeholder="CD14"
              @input="showAllResult('num')"
            >
              <div
                slot="suggestion-item"
                slot-scope="{ suggestion }"
                v-html="
                  suggestion.replace(
                    input_cell_types,
                    `<b>${input_cell_types}</b>`
                  )
                "
              ></div>
            </vue-simple-suggest>
            <h4>
              Anatomical structures by UBERON
              <span class="ex">e.g.&nbsp;</span>
              <span
                class="sample_value"
                @click="setSampleQuery('anatomical_structures', 'liver')"
                >liver</span
              >
            </h4>
            <!-- <input type="text" @input="is_reload_active = true" class="text_search_anatomical_structures" v-model="input_anatomical_structures" placeholder="skin"> -->
            <vue-simple-suggest
              v-model="input_anatomical_structures"
              :filter-by-query="true"
              :list="anatomical_structures_list"
              :max-suggestions="100"
              class="text_search_anatomical_structures"
              placeholder="skin"
              @input="showAllResult('num')"
            >
              <div
                slot="suggestion-item"
                slot-scope="{ suggestion }"
                v-html="
                  suggestion.replace(
                    input_anatomical_structures,
                    `<b>${input_anatomical_structures}</b>`
                  )
                "
              ></div>
            </vue-simple-suggest>
            <h4>
              Biomedical concepts by NCI Thesaurus (NCIt)
              <span class="ex">e.g.&nbsp;</span>
              <span
                class="sample_value"
                @click="setSampleQuery('biomedical_concepts', 'Osteosarcoma')"
                >Osteosarcoma</span
              >,
              <span
                class="sample_value"
                @click="
                  setSampleQuery('biomedical_concepts', 'Ovarian Carcinoma')
                "
                >Ovarian Carcinoma</span
              >
            </h4>
            <!-- <input type="text" @input="is_reload_active = true" class="text_search_biomedical_concepts" v-model="input_biomedical_concepts" placeholder="leukemia"> -->
            <vue-simple-suggest
              v-model="input_biomedical_concepts"
              :filter-by-query="true"
              :list="biomedical_concepts_list"
              :max-suggestions="100"
              class="text_search_biomedical_concepts"
              placeholder="leukemia"
              @input="showAllResult('num')"
            >
              <div
                slot="suggestion-item"
                slot-scope="{ suggestion }"
                v-html="
                  suggestion.replace(
                    input_biomedical_concepts,
                    `<b>${input_biomedical_concepts}</b>`
                  )
                "
              ></div>
            </vue-simple-suggest>
          </div>
        </div>
        <button class="find_genes_btn" @click="showAllResult('all')">
          <font-awesome-icon icon="search" />
          Find Genes
        </button>
      </div>
      <div class="results_num_wrapper">
        <div class="results_num_inner">
          <h2>Estimated Results</h2>
          <p class="results_num">{{ results_num }}</p>
          <!-- <button :class="['reload', { active: is_reload_active && !is_all_clear}]" @click="showAllResult('num')">
            <font-awesome-icon icon="sync-alt" />
            Reload
          </button> -->
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
        <span class="ex">e.g.&nbsp;</span>
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
  import axios from 'axios';
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
        input_gene_name: '',
        input_go_term: '',
        input_go_terms: [],
        input_sample_types: '',
        input_cell_types: '',
        input_anatomical_structures: '',
        input_biomedical_concepts: '',
        onEvent: false,
        is_summary_included: false,
        is_reload_active: false,
        is_screener_open: false,
        isLoading: false,
        sample_types_list: [
          'cell lines',
          'stem cells',
          'primary cells',
          'tissues',
        ],
        cell_types_list: [],
        anatomical_structures_list: [],
        biomedical_concepts_list: [],
        autocomplete_go_term_items: [],
        debounce: null,
        gene_id_for_detail_modal: 0,
        is_gene_detail_modal_shown: false,
        checked_gene: [],
        result_gene_id_list: [],
      };
    },
    computed: {
      is_all_clear: function () {
        if (
          this.input_gene_name === '' &&
          this.input_go_terms.length === 0 &&
          this.input_sample_types === '' &&
          this.input_cell_types === '' &&
          this.input_anatomical_structures === '' &&
          this.input_biomedical_concepts === ''
        ) {
          return true;
        } else {
          return false;
        }
      },
    },
    watch: {
      input_go_term: 'initItems',
    },
    created() {
      axios
        .get(`http://refex2-api.bhx.jp/api/vocablary?annotation=CL%20label`)
        .then(data => {
          this.cell_types_list = data.data;
        })
        .catch(error => {
          console.log('error', error);
        });

      axios
        .get(`http://refex2-api.bhx.jp/api/vocablary?annotation=UBERON%20label`)
        .then(data => {
          this.anatomical_structures_list = data.data;
        })
        .catch(error => {
          console.log('error', error);
        });

      axios
        .get(`http://refex2-api.bhx.jp/api/vocablary?annotation=NCIT%20label`)
        .then(data => {
          this.biomedical_concepts_list = data.data;
        })
        .catch(error => {
          console.log('error', error);
        });

      this.showAllResult('num');
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
      setSampleQuery(type, query, id) {
        this.is_reload_active = true;
        if (type === 'gene_name') {
          this.input_gene_name = query;
        } else if (type === 'go') {
          this.input_go_terms = [];
          this.input_go_terms.push({
            text: query,
            id,
            tiClasses: ['ti-valid'],
          });
        } else if (type === 'sample_types') {
          this.input_sample_types = query;
        } else if (type === 'cell_types') {
          this.input_cell_types = query;
        } else if (type === 'anatomical_structures') {
          this.input_anatomical_structures = query;
        } else if (type === 'biomedical_concepts') {
          this.input_biomedical_concepts = query;
        }
        this.showAllResult('num');
      },
      showAllResult(type) {
        setTimeout(() => {
          let query = {};
          query.text = this.input_gene_name;
          if (this.is_summary_included) {
            query.summary = 'True';
          }
          if (this.input_go_terms.length !== 0) {
            query.go = this.input_go_terms[0].id;
          }
          if (this.input_sample_types !== '') {
            query.celltype = this.input_sample_types;
          }
          if (this.input_cell_types !== '') {
            query.cl = this.input_cell_types;
          }
          if (this.input_anatomical_structures !== '') {
            query.uberon = this.input_anatomical_structures;
          }
          if (this.input_biomedical_concepts !== '') {
            query.ncit = this.input_biomedical_concepts;
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
          axios({
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
      getSuggestionList(suggest) {
        let url = `http://refex2-api.bhx.jp/api/suggest?query=${suggest}`;
        this.isLoading = true;
        return fetch(url, { method: 'GET' })
          .then(response => response.json())
          .then(json => {
            this.isLoading = false;
            return json.results;
          });
      },
      moveDetailpage(suggestion) {
        this.$router.push(
          `${this.$store.state.active_taxon}/FANTOM5?gid=${suggestion.entrezgene}`
        );
        // this.$router.push({ path: '/gene/chart', query: { gid: suggestion.entrezgene, project: 'fantom5', organism: this.$store.state.active_taxon} })
      },
      update(newTags) {
        this.autocomplete_go_term_items = [];
        this.input_go_terms = [];
        if (newTags.length !== 0) {
          this.input_go_terms[0] = newTags[newTags.length - 1];
          this.is_reload_active = true;
        }
        this.showAllResult('num');
      },
      initItems() {
        const url = `http://refex2-api.bhx.jp/api/suggest?query=${this.input_go_term}&go=True`;
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          axios
            .get(url)
            .then(response => {
              this.autocomplete_go_term_items = response.data.results.map(a => {
                return { text: a.term, id: a.id };
              });
            })
            .catch(() => console.warn('Oh. Something went wrong'));
        }, 300);
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
          align-items: center
          margin: 6px 0
          > span
            font-size: 12px
            color: $GRAY
            font-weight: 100
            margin-left: 10px
          > dl
            display: flex
            align-items: center
            padding: 0 10px
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
            &:hover
              +hover
              > dt
                color: #ffffff
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
        > .screener_wrapper
          padding: 10px 34px
          box-shadow: 0 1px 4px rgba(62, 70, 82, .22)
          border-radius: 3px
          margin-top: 27px
          height: 42px
          overflow: hidden
          box-sizing: border-box
          &.open
            height: auto
            overflow: visible
          .vue-tags-input
            max-width: initial
            .ti-input
              +text_input
              padding: 10px
              border: none
              width: 100%
              .ti-tags
                height: 25px
                input
                  padding: 10px 10px
                .ti-tag
                  height: 24px
                  background-color: $MAIN_COLOR
                  padding: 3px 10px
                  border-radius: 100px
                  &.ti-deletion-mark
                    background-color: #F24B56
                .ti-new-tag-input-wrapper
                  height: 24px
                  padding: 0
            .ti-item.ti-selected-item
              color: #ffffff
              background-color: $MAIN_COLOR
          p
            margin: 0
            &.screener_title
              margin-top: 3px
              display: flex
              align-items: center
              > svg
                font-size: 12px
                transition: .3s
                &.filter
                  margin-right: 3px
                &.close,
                &.open
                  margin-left: 10px
                &.open
                  transform: rotate(90deg)
              &:hover
                cursor: pointer
          h3,h4
            > span
              +sample_query
          input
            +text_input
            font-size: 22px
            &.text_search_go_term
              margin-bottom: 10px
          > .classification_wrapper
            border: 1px dashed $GRAY
            border-radius: 3px
            padding: 10px 30px
            margin-top: -7px
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
