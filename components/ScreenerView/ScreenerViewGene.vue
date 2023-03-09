<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <h3>Genes with Chr</h3>
    <client-only>
      <multi-select
        v-model="chrValue"
        :allow-empty="true"
        :close-on-select="false"
        placeholder=""
        :options="chrOptions"
        :multiple="true"
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
    </client-only>

    <h3>Genes with Type of Gene</h3>
    <client-only>
      <multi-select
        v-model="TOGValue"
        :allow-empty="true"
        :close-on-select="false"
        placeholder=""
        :options="TOGOptions"
        :multiple="true"
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
    </client-only>

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
    <client-only>
      <vue-tags-input
        v-model="temporaryParameters.goTerm"
        :tags="parameters.go"
        :autocomplete-items="autoComplete.go"
        :max-tags="1"
        add-only-from-autocomplete
        :placeholder="placeholderGOTerm"
        :class="{ hide_caret: hideCaret }"
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
    </client-only>
    <ScreenerViewGeneFilter
      v-for="(filter, index) of geneFilters"
      :key="index"
      :filter.sync="geneFilters[index]"
      :columns="filter.columns"
      :datasets="datasets"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import MultiSelect from 'vue-multiselect';
  import ScreenerViewGeneFilter from './ScreenerViewGeneFilter.vue';
  import geneFilters from '~/refex-sample/gene_filters.json';
  import datasets from '~/refex-sample/datasets.json';
  import _ from 'lodash';

  const initialState = () => {
    return {
      chrValue: [],
      TOGValue: [],
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
      hideCaret: false,
      geneFilters: JSON.parse(JSON.stringify(geneFilters)),
      datasets: JSON.parse(JSON.stringify(datasets)),
    };
  };

  export default {
    components: { MultiSelect, ScreenerViewGeneFilter },
    data() {
      return {
        autocompleteStaticData: {},

        chrCheckedValue: [],
        chrOptions: [],
        TOGOptions: [],
        debounce: null,
        ...initialState(),
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
          : 'Only one tag is allowed';
      },
      selection() {
        return this.chrValue.join();
      },
      isInitialState() {
        for (const [key, value] of Object.entries(initialState())) {
          if (!_.isEqual(this.$data[key], value)) {
            return false;
          }
        }
        return true;
      },
    },
    watch: {
      activeDataset() {
        // reset all keys of this.parameters to ''
        this.parameters = {
          go: [],
        };
      },
      isInitialState(newVal) {
        console.log('change');
        console.log('isInitialState', newVal);
        this.$emit('setIsInitialState', newVal);
      },
      parameters() {
        this.$emit('updateParameters', { go: this.goTermString });
      },
    },
    async created() {
      this.getAutoCompleteData().then(() => {});
    },
    methods: {
      resetComponent() {
        Object.assign(this.$data, initialState());
      },
      getAutoCompleteData() {
        return this.$axios
          .$get(`api/cv`)
          .then(data => {
            this.autocompleteStaticData = data;
            this.chrOptions = data[
              this.activeDataset.dataset
            ].chromosomePosition
              .map(x => (!Number.isNaN(parseInt(x)) ? parseInt(x) : x))
              .sort(function (a, b) {
                const a1 = typeof a,
                  b1 = typeof b;
                return a1 < b1 ? -1 : a1 > b1 ? 1 : a < b ? -1 : a > b ? 1 : 0;
              });
            this.TOGOptions = data[this.activeDataset.dataset].typeOfGene;
          })
          .catch(_error => {
            this.setAlertModal({
              msg: 'Failed to get data in Screener View Sample',
            });
          });
      },
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
        this.hideCaret = newTags.length === 0 ? false : true;
      },
    },
  };
</script>

<style lang="sass" scoped>
  ::v-deep
    svg[data-icon="circle-info"], .delete_all
      color: $MAIN_COLOR
      cursor: pointer
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
    .filter + .filter
      margin-top: 30px
    .filter_TPM, .filter_specificity_ROKU, .filter_specificity_tau
      table
        thead
          height: 30px
          th
            font-size: 12px
            font-weight: initial
            text-align: initial
        tbody
          input, select
            height: 2.25em
          .text_search_name input
            font-size: 20px
          select:required:invalid
            color: $PLACEHOLDER_COLOR
          .delete_btn
            +button
            align-items: initial
            padding: 13.5px 22px
            cursor: pointer
          svg[data-icon="circle-info"]
            color: $MAIN_COLOR
    .filter_TPM
      table
        th, tr
          .icon
            text-align: center
          .sample
            width: 60%
          .cutoff, .condition
            width: 10%
          .statistic
            width: 20%
    .filter_specificity_ROKU
      table
        th, tr
          .icon
            text-align: center
          .group
            width: 25%
          .sample
            width: 40%
          .horl
            width: 15%
          .emin, .emax
            width: 10%
    .filter_specificity_tau
      table
        th, tr
          .icon
            text-align: center
          .group
            width: 80%
          .cutoff, .condition
            width: 10%
</style>
