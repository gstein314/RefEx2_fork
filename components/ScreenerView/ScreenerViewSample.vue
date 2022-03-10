<template>
  <div>
    <h3>
      Genes that are specifically expressed in a given sample by classification
    </h3>
    <div class="classification_wrapper">
      <h4>
        Sample types <span class="tag">FANTOM5</span>
        <span class="example"
          >e.g.
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
        </span>
      </h4>
      <vue-simple-suggest
        :value="sample_types"
        :filter-by-query="true"
        :list="sample_types_list"
        :max-suggestions="100"
        class="text_search_sample_types"
        placeholder="cell lines"
        @input="setSampleQuery('sample_types', $event)"
        @select="setSampleQuery('sample_types', $event)"
      >
        <div
          slot="suggestion-item"
          slot-scope="{ suggestion }"
          v-html="suggestion.replace(sample_types, `<b>${sample_types}</b>`)"
        ></div>
      </vue-simple-suggest>
      <h4>
        Cell types <span class="tag">Cell Ontology</span>
        <span class="example"
          >e.g.
          <span
            class="sample_value"
            @click="setSampleQuery('cell_types', 'hepatocyte')"
            >hepatocyte</span
          >
        </span>
      </h4>
      <vue-simple-suggest
        :value="cell_types"
        :filter-by-query="true"
        :list="cell_types_list"
        :max-suggestions="100"
        class="text_search_cell_types"
        placeholder="CD14"
        @input="setSampleQuery('cell_types', $event)"
        @select="setSampleQuery('cell_types', $event)"
      >
        <div
          slot="suggestion-item"
          slot-scope="{ suggestion }"
          v-html="suggestion.replace(cell_types, `<b>${cell_types}</b>`)"
        ></div>
      </vue-simple-suggest>
      <h4>
        Anatomical structures <span class="tag">UBERON</span>
        <span class="example"
          >e.g.
          <span
            class="sample_value"
            @click="setSampleQuery('anatomical_structures', 'liver')"
            >liver</span
          >
        </span>
      </h4>
      <vue-simple-suggest
        :value="anatomical_structures"
        :filter-by-query="true"
        :list="anatomical_structures_list"
        :max-suggestions="100"
        class="text_search_anatomical_structures"
        placeholder="skin"
        @input="setSampleQuery('anatomical_structures', $event)"
        @select="setSampleQuery('anatomical_structures', $event)"
      >
        <div
          slot="suggestion-item"
          slot-scope="{ suggestion }"
          v-html="
            suggestion.replace(
              anatomical_structures,
              `<b>${anatomical_structures}</b>`
            )
          "
        ></div>
      </vue-simple-suggest>
      <h4>
        Biomedical concepts <span class="tag"> NCI Thesaurus (NCIt)</span>
        <span class="example"
          >e.g.
          <span
            class="sample_value"
            @click="setSampleQuery('biomedical_concepts', 'Osteosarcoma')"
            >Osteosarcoma</span
          >,
          <span
            class="sample_value"
            @click="setSampleQuery('biomedical_concepts', 'Ovarian Carcinoma')"
            >Ovarian Carcinoma</span
          >
        </span>
      </h4>
      <vue-simple-suggest
        :value="biomedical_concepts"
        :filter-by-query="true"
        :list="biomedical_concepts_list"
        :max-suggestions="100"
        class="text_search_biomedical_concepts"
        placeholder="leukemia"
        @input="setSampleQuery('biomedical_concepts', $event)"
        @select="setSampleQuery('biomedical_concepts', $event)"
      >
        <div
          slot="suggestion-item"
          slot-scope="{ suggestion }"
          v-html="
            suggestion.replace(
              biomedical_concepts,
              `<b>${biomedical_concepts}</b>`
            )
          "
        ></div>
      </vue-simple-suggest>
    </div>
  </div>
</template>
<script>
  /* eslint-disable vue/prop-name-casing */
  import VueSimpleSuggest from 'vue-simple-suggest';

const map = new Map([
    ['']
])
  export default {
    components: {
      VueSimpleSuggest,
    },
    props: {
      cell_types: {
        type: String,
        default: '',
      },
      sample_types: {
        type: String,
        default: '',
      },
      anatomical_structures: {
        type: String,
        default: '',
      },
      biomedical_concepts: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        params: {
            fantom5SampleId : '',
            CL: '',
            NCIT: '',
            UBERON: '',
          },
        suggestions: {
            fantom5SampleId : '',
            CL: '',
            NCIT: '',
            UBERON: '',
            },
        
        debounce: null,
        autocomplete_go_term_items: [],
        sample_classification_list: {
          sample_type: ['cell lines', 'stem cells', 'primary cells', 'tissues'],
          cl: [],
          uberon: [],
          ncit: [],
        },
        is_screener_open: false,
        cell_types_list: [],
        anatomical_structures_list: [],
        biomedical_concepts_list: [],
        sample_types_list: [
          'cell lines',
          'stem cells',
          'primary cells',
          'tissues',
        ],
      };
    },
    computed: {
      filterObj() {
        return this.$store.getters.filterByName(this.filter);
      },
      activeScreener() {
        return this.filterObj.screener;
      },
      placeholderGOTerm() {
        return this.go_term === '' && this.termsGO.length < 1
          ? 'transcription factor binding'
          : '';
      },
    },
    watch: {
      go_term() {
        if(this.node.key === 'gene') this.initItems();
      },
    },
    async created() {
      if (this.activeScreener === 'sample_classification') {
        Object.keys(this.sample_classification_list).forEach(key => {
          if (this.sample_classification_list[key].length > 1) return;
          this.$axios
            .$get(`api/vocablary?annotation=${key.toUpperCase()}%20label`)
            .then(data => {
              this.$set(this.sample_classification_list, key, data);
            })
            .catch(error => {
              console.log('error', error);
            });
        });
        this.update();
      }
    },
    methods: {
      toggleScreener() {
        this.is_screener_open = !this.is_screener_open;
      },
      update() {
        this.$emit('update', 'num');
      },
      setTags(tags) {
        this.autocomplete_go_term_items = [];
        this.$emit('setTags', tags);
        this.update();
      },
      initItems() {
        const url = `api/suggest?query=${this.go_term}&go=True`;
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          this.$axios
            .$get(url)
            .then(response => {
              this.autocomplete_go_term_items = response.results.map(a => {
                return { text: a.term, id: a.id };
              });
            })
            .catch(() => console.warn('Oh. Something went wrong'));
        }, 300);
      },
      setSampleQuery(type, query, id) {
        this.$emit('setSampleQuery', {
          type,
          query,
          id,
          resultType: type === 'go_term' ? 'all' : 'num',
        });
      },
    },
  };