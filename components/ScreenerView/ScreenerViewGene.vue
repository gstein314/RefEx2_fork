<template>
  <div>
    <h3>
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
    <no-ssr>
      <vue-tags-input
        v-model="temporaryParameters.go_term"
        :tags="parameters.go"
        :autocomplete-items="auto_complete.go"
        :add-only-from-autocomplete="true"
        :placeholder="placeholderGOTerm"
        @input="updateAutoComplete"
        @tags-changed="setTags($event, 'go')"
      >
        <div
          slot="autocomplete-item"
          slot-scope="props"
          class="my-item"
          @click="props.performAdd(props.item)"
          v-html="
            props.item.text.replace(
              temporaryParameters.go_term,
              `<b>${temporaryParameters.go_term}</b>`
            )
          "
        ></div>
      </vue-tags-input>
    </no-ssr>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        // only used in this component
        temporaryParameters: {
          go_term: '',
        },
        // passed down to API
        parameters: {
          go: [],
        },
        auto_complete: {
          go: [],
        },
        debounce: null,
      };
    },
    computed: {
      go_term_string() {
        return this.parameters.go.map(tag => tag.id).join(', ');
      },
      placeholderGOTerm() {
        return this.temporaryParameters.go_term === '' &&
          this.parameters.go.length < 1
          ? 'transcription factor binding'
          : '';
      },
    },
    watch: {
      parameters() {
        this.$emit('updateParameters', { go: this.go_term_string });
      },
    },
    methods: {
      // TODO: set as global function
      getSuggestionURL(queryStr, optionalStr) {
        return `api/suggest?query=${queryStr}${optionalStr}`;
      },
      // TODO: check if multiple go terms can be set
      updateAutoComplete() {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          this.$axios
            .$get(
              this.getSuggestionURL(
                this.temporaryParameters.go_term,
                '&go=True'
              )
            )
            .then(response => {
              this.$set(
                this.auto_complete,
                'go',
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
      setTags(newTags, key = 'go') {
        this.parameters = { ...this.parameters, [key]: newTags };
      },
    },
  };
</script>
