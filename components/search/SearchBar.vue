<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div class="text_search_area">
    <h2>Search Conditions</h2>
    <h3>
      {{ title }}
      <span class="example"
        >e.g.
        <dl v-for="(condition, index) of conditions" :key="index">
          <dt v-if="conditions.length > 1">{{ condition.label }}:</dt>
          <dd
            v-for="(example, example_index) of condition.examples"
            :key="example_index"
            class="sample_value"
            @click="
              setSampleQuery({
                type: filterKey,
                query: example,
              })
            "
          >
            {{ example }}
          </dd>
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
      <!-- plugin uses slot-scope as a prop variable. {suggestion} turns into an object at the plugin-->
      <!-- eslint-disable vue/no-unused-vars -->
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
    <div :class="['summary_check_wrapper', { hide: inputs.gene_name === '' }]">
      <input
        id="summary_check"
        v-model="is_summary_included"
        type="checkbox"
        name="summary_check"
        @click="showAllResult('num')"
      />
      <label for="summary_check">Include this field in search</label>
    </div>
    <ScreenerView
      v-bind="inputs"
      :terms-g-o="input_go_terms"
      @setSampleQuery="setSampleQuery"
      @update="showAllResult"
      @updateInputs="setInputs"
      @setTags="setTags"
    />
    <button class="find_results_btn" @click="showAllResult('all')">
      <font-awesome-icon icon="search" />
      Find {{ filterObj.name }}s
    </button>
  </div>
</template>
<script>
  import VueSimpleSuggest from 'vue-simple-suggest';
  import ScreenerView from '~/components/search/ScreenerView.vue';
  import { mapGetters } from 'vuex';

  export default {
    components: {
      VueSimpleSuggest,
      ScreenerView,
    },
    props: {
      filter: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
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
      };
    },
    computed: {
      ...mapGetters({
        getFilterByName: 'filterByName',
      }),
      filterObj() {
        return this.getFilterByName(this.filter);
      },
      filterKey() {
        return this.filterObj.search_key;
      },
      conditions() {
        return this.filterObj.search_conditions;
      },
      title() {
        return this.conditions
          .map((condition, index) => {
            return index < this.conditions.length - 1
              ? index === this.conditions.length - 2
                ? condition.label + ' or '
                : condition.label + ', '
              : condition.label;
          })
          .join('');
      },
    },
    methods: {
      setTags(newTags) {
        this.input_go_terms = [];
        if (newTags.length !== 0) {
          this.input_go_terms[0] = newTags[newTags.length - 1];
          this.is_reload_active = true;
        }
      },
      async getSuggestionList(suggest) {
        let url = `http://refex2-api.bhx.jp/api/suggest?query=${suggest}`;
        this.isLoading = true;
        return this.$axios.$get(url).then(results => {
          this.isLoading = false;
          return results.results;
        });
      },
      setInputs(inputs) {
        this.inputs = inputs;
      },
      moveDetailpage(suggestion) {
        this.$router.push(
          `${this.$store.state.active_taxon}/FANTOM5?gid=${suggestion.entrezgene}`
        );
        // this.$router.push({ path: '/gene/chart', query: { gid: suggestion.entrezgene, project: 'fantom5', organism: this.$store.state.active_taxon} })
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
            this.$store.commit('setResults', {
              results: result.data?.data?.humangene ?? [],
              results_num: result.data.data.numfound ?? 0,
            });
            this.onEvent = false;
            this.is_reload_active = false;
          });
        }, 0);
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
    },
  };
</script>
<style lang="sass" scoped>
  .vue-simple-suggest
      position: relative
  .text_search_area
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
                      &::after
                          color: $MAIN_COLOR
                          position: absolute
                          content: ','
                          margin-left: 5px
                      &:last-child
                          &::after
                            content: none
  ::v-deep
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
      > .find_results_btn
          +button
          margin-top: 26px
          margin-bottom: 50px
</style>
