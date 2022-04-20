<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
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
            @click="updateParameter('project', 'cell lines')"
            >cell lines</span
          >,
          <span
            class="sample_value"
            @click="updateParameter('project', 'stem cells')"
            >stem cells</span
          >,
          <span
            class="sample_value"
            @click="updateParameter('project', 'primary cells')"
            >primary cells</span
          >,
          <span
            class="sample_value"
            @click="updateParameter('project', 'tissues')"
            >tissues</span
          >
        </span>
      </h4>
      <vue-simple-suggest
        v-model="parameters.project"
        :filter-by-query="true"
        :list="autoComplete.project"
        :max-suggestions="100"
        class="text_search_sample_types"
        placeholder="cell lines"
        @input="updateParameter"
      >
        <div
          slot="suggestion-item"
          slot-scope="{ suggestion }"
          v-html="$boldenSuggestion(suggestion, parameters.project)"
        ></div>
      </vue-simple-suggest>
      <h4>
        Cell types <span class="tag">Cell Ontology</span>
        <span class="example"
          >e.g.
          <span
            class="sample_value"
            @click="updateParameter('CL', 'hepatocyte')"
            >hepatocyte</span
          >
        </span>
      </h4>
      <vue-simple-suggest
        v-model="parameters.CL"
        :filter-by-query="true"
        :list="autoComplete.CL"
        :max-suggestions="100"
        class="text_search_cell_types"
        placeholder="CD14"
        @input="$emit('updateParameters', parameters)"
      >
        <div
          slot="suggestion-item"
          slot-scope="{ suggestion }"
          v-html="$boldenSuggestion(suggestion, parameters.CL)"
        ></div>
      </vue-simple-suggest>
      <h4>
        Anatomical structures <span class="tag">UBERON</span>
        <span class="example"
          >e.g.
          <span class="sample_value" @click="updateParameter('UBERON', 'liver')"
            >liver</span
          >
        </span>
      </h4>
      <vue-simple-suggest
        v-model="parameters.UBERON"
        :filter-by-query="true"
        :list="autoComplete.UBERON"
        :max-suggestions="100"
        class="text_search_anatomical_structures"
        placeholder="skin"
        @input="$emit('updateParameters', parameters)"
      >
        <div
          slot="suggestion-item"
          slot-scope="{ suggestion }"
          v-html="$boldenSuggestion(suggestion, parameters.UBERON)"
        ></div>
      </vue-simple-suggest>
      <h4>
        Biomedical concepts <span class="tag"> NCI Thesaurus (NCIt)</span>
        <span class="example"
          >e.g.
          <span
            class="sample_value"
            @click="updateParameter('NCIT', 'Osteosarcoma')"
            >Osteosarcoma</span
          >,
          <span
            class="sample_value"
            @click="updateParameter('NCIT', 'Ovarian Carcinoma')"
            >Ovarian Carcinoma</span
          >
        </span>
      </h4>
      <vue-simple-suggest
        v-model="parameters.NCIT"
        :filter-by-query="true"
        :list="autoComplete.NCIT"
        :max-suggestions="100"
        class="text_search_biomedical_concepts"
        placeholder="leukemia"
        @input="$emit('updateParameters', parameters)"
      >
        <div
          slot="suggestion-item"
          slot-scope="{ suggestion }"
          v-html="$boldenSuggestion(suggestion, parameters.NCIT)"
        ></div>
      </vue-simple-suggest>
    </div>
  </div>
</template>
<script>
  /* eslint-disable vue/prop-name-casing */
  import VueSimpleSuggest from 'vue-simple-suggest';

  export default {
    components: {
      VueSimpleSuggest,
    },
    data() {
      return {
        // passed down to API
        parameters: {
          project: '',
          CL: '',
          NCIT: '',
          UBERON: '',
        },
        autoComplete: {
          project: ['cell lines', 'stem cells', 'primary cells', 'tissues'],
          CL: [],
          NCIT: [],
          UBERON: [],
        },
        debounce: null,
      };
    },
    created() {
      Object.keys(this.autoComplete).forEach(key => {
        if (this.autoComplete[key].length > 1) return;
        this.$axios
          .$get(`api/vocablary?annotation=${key.toUpperCase()}%20label`)
          .then(data => {
            this.$set(this.autoComplete, key, data);
          })
          .catch(error => {
            console.log('error', error);
            $store.commit('set_alert_modal', {
              msg: 'Failed to get data in Screener View Sample',
            });
          });
      });
    },
    methods: {
      updateParameter(key, value) {
        if (key && value) this.$set(this.parameters, key, value);
        this.$emit('updateParameters', this.parameters);
      },
    },
  };
</script>
