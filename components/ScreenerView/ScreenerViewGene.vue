<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <h3>Genes with Chr</h3>
    <no-ssr>
      <multi-select
        v-model="chrValue"
        :allow-empty="true"
        :close-on-select="false"
        placeholder=""
        :options="chrOptions"
        :multiple="true"
        :taggable="true"
        ><template slot="option" slot-scope="props">
          <div class="option">
            <input
              :checked="chrValue.includes(props.option)"
              type="checkbox"
              :value="props.option.name"
            />
            <span class="option__small">{{ props.option }}</span>
            <!-- <font-awesome-icon icon="exclamation-triangle" /> -->
          </div>
        </template>
        <!-- <template slot="selection" slot-scope="{ values }">
          <span
            v-if="values.length &amp;&amp; values.length > 3"
            class="multiselect__single"
          >
            {{
              values.length === filterObj.options1.length
                ? 'all'
                : values.length
            }}
            options selected
          </span>
        </template> -->
      </multi-select>
    </no-ssr>

    <h3>Genes with Type of Gene</h3>
    <no-ssr>
      <multi-select
        v-model="TOGValue"
        :allow-empty="true"
        :close-on-select="false"
        placeholder=""
        :options="TOGOptions"
        :multiple="true"
        :taggable="true"
        ><template slot="option" slot-scope="props">
          <div class="option">
            <input
              type="checkbox"
              :checked="TOGValue.includes(props.option)"
              :value="props.option.name"
            />
            <span class="option__small">{{ props.option }}</span>
            <!-- <font-awesome-icon icon="exclamation-triangle" /> -->
          </div>
        </template>
        <!-- <template slot="selection" slot-scope="{ values }">
          <span
            v-if="values.length &amp;&amp; values.length > 3"
            class="multiselect__single"
          >
            {{
              values.length === filterObj.options2.length
                ? 'all'
                : values.length
            }}
            options selected
          </span>
        </template> -->
      </multi-select>
    </no-ssr>

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
          >cell differentiation
        </span>
      </span>
    </h3>
    <no-ssr>
      <vue-tags-input
        v-model="temporaryParameters.goTerm"
        :tags="parameters.go"
        :autocomplete-items="autoComplete.go"
        add-only-from-autocomplete
        :placeholder="placeholderGOTerm"
        @input="updateAutoComplete"
        @tags-changed="setTags($event, 'go')"
      >
        <div
          slot="autocomplete-item"
          slot-scope="{ item }"
          class="my-item"
          @click="handleSingleTagUpdate(item.id, item.text)"
          v-html="$highlightedSuggestion(item.text, temporaryParameters.goTerm)"
        ></div>
      </vue-tags-input>
    </no-ssr>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import MultiSelect from 'vue-multiselect';

  export default {
    components: { MultiSelect },
    data() {
      return {
        chrValue: [],
        TOGValue: [],
        chrCheckedValue: [],
        chrOptions: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          'X',
          'Y',
          'MT',
          '-',
        ],
        TOGOptions: [
          'biological-region',
          'ncRNA',
          'other',
          'protein-coding',
          'pseudo',
          'rRNA',
          'scRNA',
          'snoRNA',
          'snRNA',
          'tRNA',
          'unknown',
        ],
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
        activeDataset: 'active_dataset',
      }),
      goTermString() {
        return this.parameters.go.map(tag => tag.id).join(', ');
      },
      placeholderGOTerm() {
        return this.temporaryParameters.goTerm === '' &&
          this.parameters.go.length < 1
          ? 'transcription factor binding'
          : '';
      },
      selection() {
        return this.chrValue.join();
      },
    },
    watch: {
      activeDataset() {
        // reset all keys of this.parameters to ''
        this.parameters = {
          go: [],
        };
      },
      parameters() {
        this.$emit('updateParameters', { go: this.goTermString });
      },
    },
    methods: {
      updateAutoComplete() {
        clearTimeout(this.debounce);
        const query = `{ goSuggest (text: "${this.temporaryParameters.goTerm}", dataset: "${this.activeDataset.dataset}") { goId, goTerm }}`;
        this.debounce = setTimeout(() => {
          this.$axios
            .$post('gql', {
              query,
            })
            .then(response => {
              this.$set(
                this.autoComplete,
                'go',
                response.data?.goSuggest?.map(a => {
                  return { text: a.goTerm, id: a.goId };
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
        this.$set(this.temporaryParameters, 'goTerm', '');
        this.setTags([{ id, text, tiClasses }], key);
      },
      setTags(newTags, key) {
        this.parameters = { ...this.parameters, [key]: newTags };
      },
    },
  };
</script>

<style lang="sass" scoped>
  ::v-deep
    .multiselect
      input
        width: auto
      input[type="text"]
        +text_input
      .multiselect__tag
        background: $MAIN_COLOR
        > .multiselect__tag-icon
          background: none
          &:after
            color: white
      .multiselect__tags
        border: none
        background: $MAIN_COLOR_PALE
      .multiselect__option
        background: none
        > .option
          display: flex
          align-items: center
          gap: 10px
          > input[type="checkbox"]
            cursor: pointer
      .multiselect__element
        display: block
      .multiselect__option--highlight
        background: $MAIN_COLOR
      *[class^="multiselect__option"]
        &:after
          content: none
</style>
