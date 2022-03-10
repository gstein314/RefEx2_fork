<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div class="screener_wrapper" :class="{ open: is_screener_open }">
    <p class="screener_title" @click="toggleScreener">
      <font-awesome-icon icon="filter" class="filter" />
      Screener
      <font-awesome-icon
        icon="chevron-right"
        :class="is_screener_open ? 'open' : 'close'"
      />
    </p>
    <slot></slot>
    <component
      :is="`screener-view-gene`"
      @updateParameters="updateScreenerParams"
    ></component>

    <!-- <template v-if="activeScreener === 'go_termss'">
      <h3>
        Genes with GO Term
        <span class="example"
          >e.g.
          <span
            class="sample_value"
            @click="
              setSampleQuery('go', 'transcription factor binding', 'GO:0008134')
            "
            >transcription factor binding</span
          >,
          <span
            class="sample_value"
            @click="setSampleQuery('go', 'cell differentiation', 'GO:0030154')"
            >cell differentiation</span
          >
        </span>
      </h3>
      <no-ssr>
        <vue-tags-input
          :value="go_term"
          :tags="termsGO"
          :autocomplete-items="autocomplete_go_term_items"
          :add-only-from-autocomplete="true"
          :placeholder="placeholderGOTerm"
          @input="setSampleQuery('go_term', $event)"
          @tags-changed="setTags"
        >
          <div
            slot="autocomplete-item"
            slot-scope="props"
            class="my-item"
            @click="props.performAdd(props.item)"
            v-html="props.item.text.replace(go_term, `<b>${go_term}</b>`)"
          ></div>
        </vue-tags-input>
      </no-ssr>
    </template> -->
    <template v-if="activeScreener === 'sample_classification'">
      <h3>
        Genes that are specifically expressed in a given sample by
        classification
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
              @click="
                setSampleQuery('biomedical_concepts', 'Ovarian Carcinoma')
              "
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
    </template>
  </div>
</template>
<script>
  /* eslint-disable vue/prop-name-casing */
  import VueSimpleSuggest from 'vue-simple-suggest';

  export default {
    components: {
      VueSimpleSuggest,
    },
    props: {
      filter: {
        type: String,
        required: true,
      },
      termsGO: {
        type: Array,
        default: () => [],
      },
      go_term: {
        type: String,
        default: '',
      },
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
      // placeholderGOTerm() {
      //   return this.go_term === '' && this.termsGO.length < 1
      //     ? 'transcription factor binding'
      //     : '';
      // },
    },
    // watch: {
    //   go_term() {
    //     if(this.node.key === 'gene') this.initItems();
    //   },
    // },
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
      updateScreenerParams(params){
        console.log(params);
      },
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
