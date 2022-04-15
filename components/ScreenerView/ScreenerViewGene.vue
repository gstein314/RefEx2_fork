<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <h3 v-if="type === 'gene'">
      Genes with GO Term
      <span class="example"
        >e.g.
        <span
          class="sample_value"
          @click="
            handleSingleTagUpdate('GO:0008134', 'transcription factor binding')
          "
          >transcription factor binding</span
        >,
        <span
          class="sample_value"
          @click="handleSingleTagUpdate('GO:0030154', 'cell differentiation')"
          >cell differentiation</span
        >
      </span>
    </h3>
    <no-ssr v-if="type === 'gene'">
      <vue-tags-input
        v-model="temporaryParameters.goTerm"
        class="go_terms"
        :tags="parameters.go"
        :autocomplete-items="autoComplete.go"
        :add-only-from-autocomplete="true"
        :placeholder="placeholderGOTerm"
        @input="updateAutoComplete"
        @tags-changed="setTags($event, 'go')"
      >
        <div
          slot="autocomplete-item"
          slot-scope="{ item }"
          class="my-item"
          @click="props.performAdd(props.item)"
          v-html="$boldenSuggestion(item.text, temporaryParameters.goTerm)"
        >
          " >
        </div>
      </vue-tags-input>
    </no-ssr>
    <h3 v-if="description !== ''">
      {{ description }}
    </h3>
    <div v-if="filters && filters.length > 0" class="classification_wrapper">
      <div
        v-for="(filter, filterIndex) of filters"
        :key="`${filterIndex + 1}_test`"
      >
        <h4 :key="`${filterIndex + 1}_gene_h3`">
          {{ filter.label }}
          <span v-if="filter.note" class="tag">{{ filter.note }}</span>
          <span v-if="filter.examples" class="example">
            e.g.
            <template v-for="(example, exampleIndex) of filter.examples">
              <span
                :key="`${exampleIndex}_example`"
                class="sample_value"
                @click="updateParameter($variableName(filter.label), example)"
              >
                {{ example }}
              </span>
              <span
                v-if="exampleIndex < filter.examples.length - 1"
                :key="`${exampleIndex}_separator`"
                >,</span
              >
            </template>
          </span>
        </h4>
        <vue-simple-suggest
          :key="`${filterIndex + 1}_gene_tags`"
          v-model="parameters[$variableName(filter.label)]"
          :filter-by-query="true"
          :list="autoComplete[$variableName(filter.label)]"
          :max-suggestions="100"
          class="text_search_sample_types"
          :placeholder="filter.examples ? filter.examples[0] : ''"
          @input="updateParameter"
        >
          <div
            slot="suggestion-item"
            slot-scope="{ suggestion }"
            v-html="$boldenSuggestion(suggestion, parameters[item.column])"
          ></div>
        </vue-simple-suggest>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import VueSimpleSuggest from 'vue-simple-suggest';

  export default {
    components: {
      VueSimpleSuggest,
    },
    props: {
      type: {
        type: String,
        required: true,
        default: 'gene',
      },
    },
    data() {
      return {
        // only used in this component
        temporaryParameters: {
          goTerm: '',
        },
        // passed down to API
        parameters: {
          go: [],
        },
        // will contain same keys as parameters. Autocompletion that does not come from the API should be hardcoded here in advance
        autoComplete: {
          go: [],
        },
        debounce: null,
      };
    },
    computed: {
      ...mapGetters({
        filterByName: 'filter_by_name',
        activeDataset: 'active_dataset',
      }),
      description() {
        return this.filterByName(this.type).description;
      },
      dataSetSpecificParameters() {
        return this.activeDataset[this.type];
      },
      filters() {
        return this.dataSetSpecificParameters.filter ?? [];
      },
      searchConditions() {
        return this.dataSetSpecificParameters.search_conditions;
      },
      goTermString() {
        return this.parameters.go.map(tag => tag.id).join(', ');
      },
      placeholderGOTerm() {
        return this.temporaryParameters.goTerm === '' &&
          this.parameters.go.length < 1
          ? 'transcription factor binding'
          : '';
      },
    },
    watch: {
      parameters() {
        this.$emit('updateParameters', { go: this.goTermString });
      },
    },
    async created() {
      this.filters.forEach(filter => {
        const key = this.$variableName(filter.label);
        if (key in this.autoComplete) return;
        this.$set(this.parameters, key, '');
        this.$axios
          .$get(`api/vocablary?annotation=${key.toUpperCase()}%20label`)
          .then(data => {
            this.$set(this.autoComplete, key, data);
          })
          .catch(error => {
            console.log('error', error);
          });
      });
    },
    methods: {
      // TODO: check if multiple go terms can be set
      updateAutoComplete() {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          this.$axios
            .$get(
              this.$getSuggestionURL(
                this.temporaryParameters.goTerm,
                '&go=True'
              )
            )
            .then(response => {
              this.$set(
                this.autoComplete,
                'go',
                response.results.map(a => {
                  return { text: a.term, id: a.id };
                })
              );
            })
            .catch(() => console.warn('Oh. Something went wrong'));
        }, 300);
      },
      handleSingleTagUpdate(id, text, tiClasses = ['ti-valid'], key = 'go') {
        if (this.parameters[key].find(tag => tag.id === id)) {
          return;
        }
        this.setTags([{ id, text, tiClasses }], key);
      },
      updateParameter(key, value) {
        if (key && value) this.$set(this.parameters, key, value);
        this.$emit('updateParameters', this.parameters);
      },
      setTags(newTags, key) {
        this.parameters = { ...this.parameters, [key]: newTags };
      },
    },
  };
</script>
<style lang="sass" scoped>
  .go_terms
    margin-bottom: 20px
</style>
