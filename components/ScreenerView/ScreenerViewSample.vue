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
      <!-- params: {{ parameters }} -->
      <vue-simple-suggest
        v-for="(item, key, index) in parameters"
        :key="index"
        v-model="parameters[key]"
        :filter-by-query="true"
        :list="auto_complete[key]"
        :max-suggestions="100"
        class="text_search_sample_types"
        placeholder="cell lines"
        @input="updateAutoComplete(key)"
        @select="setTags($event, key)"
      >
        <div
          slot="suggestion-item"
          slot-scope="{ suggestion }"
          v-html="suggestion.replace(auto_complete[key], `<b>${auto_complete[key]}</b>`)"
        ></div>
      </vue-simple-suggest>
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
      <!--<h4>
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
      </vue-simple-suggest> --> 
    </div>
  </div>
</template>
<script>
  /* eslint-disable vue/prop-name-casing */
  import VueSimpleSuggest from 'vue-simple-suggest';

  export default {
    components: {
      // VueSimpleSuggest,
    },
    data() {
      return {
        // only used in this component
        temporaryParameters: {
          go_term: '',
        },
        // passed down to API
        parameters: {
          fantom5SampleId: '',
          CL: '',
          NCIT: '',
          UBERON: '',
        },
        auto_complete: {
          fantom5SampleId: [
            'cell lines',
            'stem cells',
            'primary cells',
            'tissues',
          ],
          CL: [],
          NCIT: [],
          UBERON: [],
        },
        debounce: null,
      };
    },
    watch: {
      parameters() {
        this.$emit('updateParameters', this.parameters);
      },
    },
    async created() {
      Object.keys(this.auto_complete).forEach(key => {
        if (this.auto_complete[key].length > 1) return;
        this.$axios
          .$get(`api/vocablary?annotation=${key.toUpperCase()}%20label`)
          .then(data => {
            this.$set(this.parameters, key, data);
          })
          .catch(error => {
            console.log('error', error);
          });
      });
      // this.update();
    },
    methods: {
      // TODO: set as global function
      getSuggestionURL(queryStr, optionalStr) {
        return `api/suggest?query=${queryStr}${optionalStr}`;
      },
      // TODO: check if multiple go terms can be set
      updateAutoComplete(key) {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          this.$axios
            .$get(this.getSuggestionURL(key))
            .then(response => {
              this.$set(
                this.auto_complete,
                key,
                response.results.map(a => {
                  return { text: a.term, id: a.id };
                })
              );
            })
            .catch(() => console.warn('Oh. Something went wrong'));
        }, 300);
      },
      // TODO: set as global function
      handleSingleTagUpdate(id, text, tiClasses = ['ti-valid'], key = 'go') {
        if (this.parameters[key].find(tag => tag.id === id)) {
          return;
        }
        this.setTags([...this.parameters[key], { id, text, tiClasses }], key);
      },
      // TODO: set as global function
      setTags(newTags, key) {
        this.parameters = { ...this.parameters, [key]: newTags };
      },
    },
  };
</script>
