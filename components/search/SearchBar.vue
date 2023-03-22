<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div class="text_search_area">
    <div class="search_condition_title">
      <h2>Search Conditions</h2>
      <button
        class="reset_all_btn"
        :class="{ disabled: isInitialState }"
        :disabled="isInitialState"
        @click="resetAllSearchConditions"
      >
        <font-awesome-icon icon="rotate-right" />
        Reset all
      </button>
    </div>
    <h3>
      <span class="example"
        >e.g.
        <dl v-for="(condition, index) of currentSearchCondition" :key="index">
          <dt>{{ condition.label }}:</dt>
          <dd
            v-for="(example, example_index) of condition.examples"
            :key="example_index"
            class="sample_value"
            @click="
              updateParams({
                ...parameters,
                text: example,
              })
            "
          >
            {{ example }}
          </dd>
        </dl>
      </span>
    </h3>
    <vue-simple-suggest
      ref="searchInput"
      v-model.trim="parameters.text"
      :debounce="500"
      :min-length="0"
      :display-attribute="paramsForSuggestions[1]"
      :value-attribute="paramsForSuggestions[0]"
      :list="updateSuggestions"
      :max-suggestions="20"
      class="text_search_name"
      :placeholder="filterPlaceholder(filterType)"
      @select="moveDetailpage"
    >
      <!-- plugin uses slot-scope as a prop variable. {suggestion} turns into an object at the plugin-->
      <!-- eslint-disable vue/no-unused-vars -->
      <div slot="suggestion-item" slot-scope="{ suggestion }">
        <strong
          class="title"
          v-html="
            $highlightedSuggestion(
              suggestion[paramsForSuggestions[0]],
              parameters.text
            )
          "
        >
        </strong
        >&nbsp; -&nbsp;
        <span
          v-html="
            $highlightedSuggestion(
              suggestion[paramsForSuggestions[1]],
              parameters.text
            )
          "
        ></span>
      </div>
      <div
        v-if="isLoading"
        slot="misc-item-below"
        slot-scope="{ suggestion }"
        class="misc-item"
      >
        <span>Loading...</span>
      </div>
    </vue-simple-suggest>
    <template v-if="filterType === 'gene'">
      <div
        :class="['summary_check_wrapper', { hide: !Boolean(parameters.text) }]"
      >
        <input
          id="summary_check"
          v-model="isSummaryIncluded"
          type="checkbox"
          name="summary_check"
        />
        <label for="summary_check">Include gene summaries in search</label>
      </div>
    </template>
    <template v-else-if="filterType === 'sample'">
      <div class="summary_check_wrapper"></div>
    </template>
    <ScreenerView ref="screenerView">
      <component
        :is="`screener-view-${filterType}`"
        @updateParameters="updateParams"
        @storeInitialParameters="storeInitialParameters"
        @setChildIsInitialState="setChildIsInitialState"
        @resetAll="resetAllSearchConditions"
      ></component>
    </ScreenerView>
  </div>
</template>
<script>
  import _ from 'lodash';
  import VueSimpleSuggest from 'vue-simple-suggest';
  import { mapGetters, mapMutations } from 'vuex';
  import ScreenerView from '~/components/ScreenerView/ScreenerView.vue';

  export default {
    components: {
      VueSimpleSuggest,
      ScreenerView,
    },
    data() {
      return {
        isLoading: false,
        currentSearchCondition: '',
        childIsInitialState: true,
        onEvent: false,
        isSummaryIncluded: false,
        isReloadActive: false,
        validSearch: false,
        // either 'all' or 'numfound'
        typeOfQuery: 'numfound',
        parameters: { text: '', summary: false },
        initialParameters: {},
      };
    },
    computed: {
      ...mapGetters({
        activeFilter: 'active_filter',
        filterByName: 'filter_by_name',
        routeToProjectPage: 'route_to_project_page',
        activeDataset: 'active_dataset',
        activeSpecie: 'active_specie',
        searchCondition: 'search_condition_by_specie',
        searchConditions: 'get_search_conditions',
      }),
      // returns either gene or sample
      filterType() {
        return this.$vnode.key.split('_')[0];
      },
      filterObj() {
        return this.activeDataset[this.filterType];
      },
      isNum() {
        return this.typeOfQuery.includes('numfound');
      },
      queryPrefix() {
        return `${this.activeDataset.dataset}${this.$firstLetterUppercase(
          this.filterType
        )}`;
      },
      // only gene has suggestions atm but it can be extended to sample
      paramsForSuggestions() {
        return this.filterType === 'gene'
          ? ['symbol', 'name', 'geneid', 'chromosomePosition', 'typeOfGene']
          : ['refexSampleId', 'Description'];
      },
      extraVariablesToBeDsiplayedInResults() {
        return this.filterType === 'gene'
          ? 'symbol name alias geneid chromosomePosition typeOfGene'
          : 'refexSampleId Description';
      },
      suggestQuery() {
        let params = Object.entries(this.parameters)
          .filter(([_key, value]) => value.length > 0)
          .map(
            ([key, value], index) =>
              `${key}:"${value}"${
                index === Object.entries(this.parameters).length - 1 ? '' : ', '
              }`
          )
          .join('');
        if (params !== '')
          params = `(${params} ${
            this.isSummaryIncluded ? 'summary: "true"' : ''
          })`;
        const resultParams = this.isNum
          ? ''
          : `{${Object.keys(this.parameters)
              .filter(
                param =>
                  ![
                    'text',
                    'go',
                    'chromosomePosition',
                    'typeOfGene',
                    'filter',
                    'summary',
                  ].includes(param)
              )
              .join(' ')} ${this.extraVariablesToBeDsiplayedInResults}}`;
        const suffix = this.isNum ? '' : ` ${this.queryPrefix}Numfound`;
        return `{${this.queryPrefix}${
          this.isNum ? 'Numfound' : ''
        }${params}${resultParams}${suffix}}`;
      },
      isInitialState() {
        if (!this.childIsInitialState) return false;
        return _.isEqual(this.parameters, this.initialParameters);
      },
    },
    watch: {
      parameters: {
        handler: function () {
          this.validSearch = !Object.values(this.parameters).every(
            value => !Boolean(value)
          );
          this.$emit('updateValiditySearch', this.validSearch);
          this.showResults('numfound');
        },
        deep: true,
      },
      activeDataset() {
        this.$set(this.parameters, 'text', '');
        this.typeOfQuery = 'reset numfound';
      },
      isSummaryIncluded() {
        this.updateSuggestions();
      },
    },
    created() {
      this.updateSearchCondition();
    },
    mounted() {
      if (this.searchConditions[this.filterType].text)
        this.parameters = { ...this.searchConditions[this.filterType] };
      if (this.filterType === 'gene' && this.searchConditions.gene.summary) {
        this.isSummaryIncluded = this.searchConditions[this.filterType].summary;
      }
      setTimeout(() => {
        const mainInputField = this.$refs.searchInput.inputElement;
        if (!Boolean(mainInputField.value)) {
          mainInputField.focus(), 10;
        }
      });
    },
    methods: {
      ...mapMutations({
        setAlertModal: 'set_alert_modal',
        updatePagination: 'set_pagination',
        setSearchConditions: 'set_search_conditions',
      }),
      updateSearchCondition() {
        if (this.filterType === 'gene') {
          this.currentSearchCondition = this.searchCondition;
        } else {
          this.currentSearchCondition =
            this.activeDataset.sample.search_conditions;
        }
      },
      updateParams(params) {
        this.$emit('updateScreener');
        this.parameters = {
          text: this.parameters.text,
          summary: this.parameters.summary,
          ...params,
        };
      },
      storeInitialParameters(params) {
        this.initialParameters = { text: '', summary: false, ...params };
      },
      moveDetailpage(suggestion) {
        this.$nuxt.$loading.start();
        if (this.filterType === 'gene') {
          this.$router.push(
            this.routeToProjectPage(suggestion[this.paramsForSuggestions[2]])
          );
        } else if (this.filterType === 'sample') {
          this.$router.push(
            this.routeToProjectPage(suggestion[this.paramsForSuggestions[0]])
          );
        }
      },
      updateSuggestions() {
        return this.getSuggestions();
      },
      getSuggestions() {
        this.isLoading = true;
        const suggestion = this.parameters.text;
        const searchText = {
          type: this.filterType,
          item: 'text',
          value: suggestion,
        };
        this.setSearchConditions(searchText);
        const query = `{${this.queryPrefix}(text: "${suggestion}" ${
          this.isSummaryIncluded ? 'summary: "true"' : ''
        }) {${this.paramsForSuggestions.join(' ')}}}`;
        const searchSummary = {
          type: this.filterType,
          item: 'summary',
          value: this.isSummaryIncluded,
        };
        this.setSearchConditions(searchSummary);
        return this.$axios
          .$post('gql', {
            query,
          })
          .then(results => {
            this.isLoading = false;
            return results.data[this.queryPrefix];
          });
      },
      showResults(type = 'all') {
        if (typeof type !== 'string') return;
        this.typeOfQuery = type;
        let results;
        let results_num = 0;

        if (this.isSummaryIncluded && this.parameters.text.length === 0)
          this.isSummaryIncluded = false;
        this.$axios
          .$post('gql', {
            // TODO:
            query: this.suggestQuery,
          })
          .then(result => {
            const prefix = this.queryPrefix.replace('Numfound', '');
            if (`${prefix}Numfound` in result.data) {
              results_num = result.data[prefix + 'Numfound'];
            }
            if (prefix in result.data) results = result.data[prefix] || [];
          })
          .catch(_err => {
            this.setAlertModal({ msg: 'Failed to get data in Search Bar' });
          })
          .finally(() => {
            if (type === 'all') this.$emit('updateResults');
            this.updatePagination({ offset: 0, type: 'index' });

            this.onEvent = false;
            this.isReloadActive = false;
            this.$store.commit('set_results', {
              results,
              results_num,
              filterType: this.filterType,
            });
          });
      },
      filterPlaceholder(type) {
        switch (type) {
          case 'gene':
            return 'transcription factor';
          case 'sample':
            return 'liver';
        }
      },
      resetComponent() {
        Object.assign(this.parameters, this.initialParameters);
      },
      async resetAllSearchConditions() {
        const screenerViewChild = this.$refs.screenerView.$children[0];
        await screenerViewChild.resetComponent();

        this.resetComponent();
      },
      setChildIsInitialState(bool) {
        this.childIsInitialState = bool;
      },
    },
  };
</script>
<style lang="sass">
  .vue-simple-suggest
      position: relative
</style>
<style lang="sass" scoped>
  .text_search_area
      > .search_condition_title
          display: flex
          align-items: center
          justify-content: space-between
          > .reset_all_btn
              +button
              +sub_button
      width: 100%
      > h3
          display: flex
          gap: 0.5rem
          align-items: center
          margin: 6px 0
          > span
              +sample_query
              font-size: 12px
              display: flex
              align-items: center
              color: $GRAY
              font-weight: 100
              margin-left: 10px
              > dl
                  display: flex
                  align-items: center
                  padding: $PADDING_SLIM
                  margin: 0
                  > dt
                      font-size: 12px
                      color: $GRAY
                      font-weight: 100
                  > dd
                      font-size: 14px
                      font-weight: 300
                      padding: 2px 0
                      margin: 0
                      &::after
                          color: $MAIN_COLOR
                          position: absolute
                          content: ','
                          margin-left: 5px
                      &:last-child
                          &::after
                            content: none
  ::v-deep
      .text_search_name
          input
              +text_input
              font-size: 34px
          .show_all_btn
              +button
              margin-bottom: 15px
      .vue-simple-suggest.designed .suggestions
          +suggestions
      > .summary_check_wrapper
          min-height: 30px
          font-size: 14px
          font-weight: 100
          display: flex
          align-items: center
          margin: 3px 0
          opacity: 1
          transition: .3s
          > label
              margin-left: 5px
          &.hide
              opacity: .5
              pointer-events: none
      > .find_results_btn
          +button
          margin-top: 26px
          margin-bottom: 50px
</style>
