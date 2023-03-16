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
      @addFilterValue="addFilterValue"
    />
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import MultiSelect from 'vue-multiselect';
  import ScreenerViewGeneFilter from './ScreenerViewGeneFilter.vue';
  import geneFilters from '~/refex-sample/gene_filters.json';
  import datasets from '~/refex-sample/datasets.json';
  import _ from 'lodash';

  const stringifiedGeneFilters = JSON.stringify(geneFilters);
  const stringifiedDatasets = JSON.stringify(datasets);

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
      hideCaret: false,
      geneFilters: JSON.parse(stringifiedGeneFilters),
      datasets: JSON.parse(stringifiedDatasets),
    };
  };

  export default {
    components: { MultiSelect, ScreenerViewGeneFilter },
    data() {
      return {
        filterValue: [],
        TPMValue: [],
        ROKUValue: [],
        tauValue: [],
        autocompleteStaticData: {},
        chrValue: [],
        TOGValue: [],
        chrCheckedValue: [],
        chrOptions: [],
        TOGOptions: [],
        // only used in this component
        temporaryParameters: {
          goTerm: '',
        },
        // passed down to API
        parameters: {
          go: [],
          chromosomePosition: [],
          typeOfGene: [],
          filter: [],
        },
        // will contain same keys as parameters. Autocompletion that does not come from the API should be hardcoded here in advance
        autoComplete: {
          go: [],
          chromosomePosition: [],
          typeOfGene: [],
          filter: [],
        },
        debounce: null,
        ...initialState(),
      };
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
        activeFilter: 'active_filter',
        searchConditions: 'get_search_conditions',
      }),
      goTermString() {
        if (this.parameters.go.length === 0) return '';
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
        const defaultState = initialState();
        return Object.keys(defaultState).every(key =>
          _.isEqual(this.$data[key], defaultState[key])
        );
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
        this.$emit('setChildIsInitialState', newVal);
      },
      parameters() {
        this.$emit('updateParameters', {
          go: this.goTermString,
          chromosomePosition: this.chrValue.join(),
          typeOfGene: this.TOGValue.join(),
          filter: this.filterValue,
        });
      },
      chrValue() {
        const chrCondition = {
          type: 'gene',
          item: 'chr',
          value: this.chrValue,
        };
        this.setSearchConditions(chrCondition);
        this.handleChrTagsUpdate(this.chrValue);
      },
      TOGValue() {
        const TOGCondition = {
          type: 'gene',
          item: 'tog',
          value: this.TOGValue,
        };
        this.setSearchConditions(TOGCondition);
        this.handleTOGTagsUpdate(this.TOGValue);
      },
      filterValue(list) {
        const filterCondition = {
          type: 'gene',
          item: JSON.parse(list.replace(/\\/g, '')).method,
          value: list,
        };
        this.setSearchConditions(filterCondition);
        this.handleFilterValueUpdate(this.filterValue);
      },
    },
    async created() {
      this.getAutoCompleteData().then(() => {});
      this.$emit('updateParameters', { go: this.goTermString });
      this.$emit('storeInitialParameters', { go: this.goTermString });
    },
    mounted() {
      if (this.searchConditions.gene.chr)
        this.chrValue = this.searchConditions.gene.chr;
      if (this.searchConditions.gene.tog)
        this.TOGValue = this.searchConditions.gene.tog;
      if (this.searchConditions.gene.go)
        this.setTags(this.searchConditions.gene.go, 'go');
      if (this.searchConditions.gene.temporaryParameters)
        this.filterValue = this.searchConditions.gene.tpm;
      if (this.searchConditions.gene.roku)
        this.filterValue = this.searchConditions.gene.roku;
      if (this.searchConditions.gene.tau)
        this.filterValue = this.searchConditions.gene.tau;
    },
    methods: {
      ...mapMutations({
        setSearchConditions: 'set_search_conditions',
      }),
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
      handleChrTagsUpdate(tags) {
        this.parameters = {
          ...this.parameters,
          ['chromosomePosition']: tags.join(),
        };
      },
      handleTOGTagsUpdate(tags) {
        this.parameters = {
          ...this.parameters,
          ['typeOfGene']: tags.join(),
        };
      },
      handleFilterValueUpdate(list) {
        this.parameters = {
          ...this.parameters,
          ['filter']: this.filterValue,
        };
      },
      setTags(newTags, key) {
        this.parameters = { ...this.parameters, [key]: newTags };
        this.hideCaret = newTags.length === 0 ? false : true;
        const goCondition = { type: 'gene', item: 'go', value: newTags };
        this.setSearchConditions(goCondition);
      },
      // TODO:
      // Multiple support is not yet available
      addFilterValue(type, list) {
        switch (type) {
          case 'TPM':
            if (
              list[0].sample.id &&
              list[0].cutoff &&
              list[0].condition &&
              list[0].statistic
            ) {
              const filter = {
                method: 'tpm',
                sample: list[0].sample.id,
                value: list[0].cutoff,
                logic: list[0].condition,
                statistic: list[0].statistic,
              };
              const filterString = JSON.stringify(filter).replace(/"/g, '\\"');
              this.TPMValue = list;
              this.filterValue = filterString;
            }
            break;
          case 'ROKU':
            if (list[0].group && list[0].sample.id && list[0].horl) {
              const filter = {
                method: 'roku',
                group: list[0].group,
                sample: list[0].sample.id,
                highlow: list[0].horl,
                entropy_min: list[0].emin,
                entropy_max: list[0].emax,
              };
              const filterString = JSON.stringify(filter).replace(/"/g, '\\"');
              this.ROKUValue = list;
              this.filterValue = filterString;
            }
            break;
          case 'tau':
            if (list[0].group && list[0].condition && list[0].cutoff) {
              const filter = {
                method: 'tau',
                group: list[0].group,
                logic: list[0].condition,
                value: list[0].cutoff,
              };
              const filterString = JSON.stringify(filter).replace(/"/g, '\\"');
              this.tauValue = list;
              this.filterValue = filterString;
            }
            break;
        }
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
