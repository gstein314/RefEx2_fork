<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div class="screener_wrapper" :class="{ open: isOpen }">
    <p class="screener_title" @click="toggleScreener">
      <font-awesome-icon icon="filter" class="filter" />
      Screener
      {{ parameters }}
      <font-awesome-icon
        icon="chevron-right"
        :class="isOpen ? 'open' : 'close'"
      />
    </p>
    <div>
      <h3 v-if="type === 'gene'">
        Genes with GO Term
        <span class="example"
          >e.g.
          <span
            class="sample_value"
            @click="
              handleSingleTagUpdate(
                'GO:0008134',
                'transcription factor binding'
              )
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
          ></div>
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
          <input
            v-if="filter.is_checkbox"
            v-model="parameters[$variableName(filter.label)]"
            type="checkbox"
          />
          <vue-simple-suggest
            v-else
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
        isOpen: false,
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
    // watch: {
    //   parameters() {
    //     this.$emit('updateParameters', { go: this.goTermString });
    //   },
    // },
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
      toggleScreener() {
        this.isOpen = !this.isOpen;
      },
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
  .screener_wrapper
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
  ::v-deep
    .vue-tags-input
      max-width: initial !important
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
      display: flex
      gap: .5rem
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
    .tag
      +ontology_tag
</style>
