<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div>
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
                @click="updateParameter(filter.column, example)"
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
        <select
          v-if="filter.is_checkbox"
          v-model="parameters[filter.column]"
          class="fixed_select"
          @change="updateParameter(filter.column, $event.target.value)"
        >
          <option value="" label=""></option>
          <option
            v-for="(option, optionIndex) of autoComplete[filter.column]"
            :key="optionIndex"
            :value="option"
            :label="option"
          ></option>
        </select>
        <input
          v-else
          :key="`${filterIndex + 1}_gene_tags`"
          v-model="parameters[filter.column]"
          class="text_search_sample_types"
          :placeholder="filter.examples ? filter.examples[0] : ''"
          @input="updateParameter(filter.column, parameters[filter.column])"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash';
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    data() {
      return {
        // passed down to API
        parameters: {},
        // used for comparing and activating reset all
        initialParameters: {},
        // will contain same keys as parameters. Autocompletion that does not come from the API should be hardcoded here in advance
        autoComplete: {},
        autocompleteStaticData: {},
        debounce: null,
      };
    },
    computed: {
      ...mapGetters({
        filterByName: 'filter_by_name',
        activeDataset: 'active_dataset',
        searchConditions: 'get_search_conditions',
      }),
      description() {
        return this.filterByName('sample').description;
      },
      dataSetSpecificParameters() {
        return this.activeDataset.sample;
      },
      filters() {
        return this.dataSetSpecificParameters?.filter ?? [];
      },
      isInitialState() {
        return _.isEqual(this.parameters, this.initialParameters);
      },
    },
    watch: {
      activeDataset() {
        this.parameters = {};
        this.initialParameters = {};
        this.setAutoComplete();
        this.initiateParametersDataset();
      },
      isInitialState(newVal) {
        this.$emit('setChildIsInitialState', newVal);
      },
    },
    async created() {
      this.getAutoCompleteData().then(() => {
        this.initiateParametersDataset();
        this.setAutoComplete();
        const sample_conditions = this.searchConditions.sample;
        this.parameters = {
          SampleTypeCategory: sample_conditions.SampleTypeCategory,
          ExperimentCategory: sample_conditions.ExperimentCategory,
          UberonLabel: sample_conditions.UberonLabel,
          ClLabel: sample_conditions.ClLabel,
          NcitLabel: sample_conditions.NcitLabel,
          DevelopmentalStage: sample_conditions.DevelopmentalStage,
          Sex: sample_conditions.Sex,
        };
        this.emitUpdateParameters();
      });
    },
    methods: {
      ...mapMutations({
        setAlertModal: 'set_alert_modal',
        setSearchConditions: 'set_search_conditions',
      }),
      resetComponent() {
        Object.assign(this.parameters, { ...this.initialParameters });
      },
      initiateParametersDataset() {
        const parametersObj = {};
        for (const filter of this.filters) {
          const key = filter.column;
          parametersObj[key] = '';
          if (!this.autoComplete[key]) this.$set(this.autoComplete, key, []);
        }
        this.parameters = { ...parametersObj };
        this.initialParameters = { ...parametersObj };
        this.emitUpdateParameters();
        this.emitStoreInitialParameters();
      },
      storeInitialParameters(obj) {
        this.initialParameters = obj;
      },
      getAutoCompleteData() {
        return this.$axios
          .$get(`api/cv`)
          .then(data => {
            this.autocompleteStaticData = data;
          })
          .catch(_error => {
            this.setAlertModal({
              msg: 'Failed to get data in Screener View Sample',
            });
          });
      },
      setAutoComplete() {
        this.filters.forEach(filter => {
          this.$set(
            this.autoComplete,
            filter.column,
            filter.is_checkbox &&
              this.autocompleteStaticData[this.activeDataset.dataset]
              ? this.autocompleteStaticData[this.activeDataset.dataset][
                  filter.column
                ]
              : []
          );
        });
      },
      toggleScreener() {
        this.isOpen = !this.isOpen;
      },
      updateParameter(key, value) {
        if (key && value) {
          this.$set(this.parameters, key, value);
        }
        this.emitUpdateParameters();
        const sampleSearchCondition = {
          type: 'sample',
          item: key,
          value: value,
        };
        this.setSearchConditions(sampleSearchCondition);
      },
      emitUpdateParameters() {
        this.$emit('updateParameters', this.parameters);
      },
      emitStoreInitialParameters() {
        this.$emit('storeInitialParameters', { ...this.initialParameters });
      },
    },
  };
</script>
<style lang="sass" scoped>
  .classification_wrapper
    .fixed_select
      +select
</style>
