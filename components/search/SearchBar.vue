<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div class="text_search_area">
    <h2>Search Conditions</h2>
    <h3>
      <span class="example"
        >e.g.
        <dl v-for="(condition, index) of searchCondition" :key="index">
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
    <template v-if="filterType === 'gene'">
      <vue-simple-suggest
        v-model="parameters.text"
        :debounce="500"
        :min-length="0"
        :display-attribute="paramsForSuggestions[1]"
        :value-attribute="paramsForSuggestions[0]"
        :list="updateSuggestions"
        :max-suggestions="20"
        class="text_search_name"
        placeholder="transcription factor"
        @select="moveDetailpage"
      >
        <!-- plugin uses slot-scope as a prop variable. {suggestion} turns into an object at the plugin-->
        <!-- eslint-disable vue/no-unused-vars -->
        <div slot="suggestion-item" slot-scope="{ suggestion }">
          <strong class="title">
            {{ suggestion[paramsForSuggestions[0]] }}</strong
          >&nbsp; -&nbsp;
          <span
            v-html="
              $boldenSuggestion(
                suggestion[paramsForSuggestions[1]],
                parameters.text
              )
            "
          ></span>
          <font-awesome-icon
            icon="external-link-alt"
            class="external-link-alt"
            style="font-size: 12px"
          />
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
      <div :class="['summary_check_wrapper', { hide: parameters.text === '' }]">
        <input
          id="summary_check"
          v-model="isSummaryIncluded"
          type="checkbox"
          name="summary_check"
        />
        <label for="summary_check">Include gene summaries in search</label>
      </div>
    </template>
    <div v-else class="text_search_name">
      <input
        v-model="parameters.text"
        placeholder="liver"
        class="text_search_name"
        @input="showResults('numfound')"
      />
    </div>
    <ScreenerView>
      <component
        :is="`screener-view-${filterType}`"
        @updateParameters="updateParams"
      ></component>
    </ScreenerView>
  </div>
</template>
<script>
  import VueSimpleSuggest from 'vue-simple-suggest';
  import ScreenerView from '~/components/ScreenerView/ScreenerView.vue';
  import { mapGetters } from 'vuex';
  import { mapMutations } from 'vuex';

  export default {
    components: {
      VueSimpleSuggest,
      ScreenerView,
    },
    data() {
      return {
        parameters: {
          text: '',
        },
        onEvent: false,
        isSummaryIncluded: false,
        isReloadActive: false,
        isLoading: false,
        validSearch: false,
        // either 'all' or 'numfound'
        typeOfQuery: 'numfound',
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
          ? ['symbol', 'name', 'geneid']
          : ['refexSampleId', 'Description'];
      },
      extraVariablesToBeDsiplayedInResults() {
        return this.filterType === 'gene'
          ? 'symbol name alias geneid'
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
              .filter(param => !['text', 'go'].includes(param))
              .join(' ')} ${this.extraVariablesToBeDsiplayedInResults}}`;
        const suffix = this.isNum ? '' : ` ${this.queryPrefix}Numfound`;
        return `{${this.queryPrefix}${
          this.isNum ? 'Numfound' : ''
        }${params}${resultParams}${suffix}}`;
      },
    },
    watch: {
      parameters: {
        handler: function () {
          this.validSearch = !Object.values(this.parameters).every(
            value => value === ''
          );
          this.$emit('updateValiditySearch', this.validSearch);
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
      this.showResults('numfound');
    },
    methods: {
      ...mapMutations({
        setAlertModal: 'set_alert_modal',
        updatePagination: 'set_pagination',
      }),
      updateParams(params) {
        this.$emit('updateScreener');
        this.parameters = { text: this.parameters.text, ...params };

        this.showResults('numfound');
      },
      moveDetailpage(suggestion) {
        this.$nuxt.$loading.start();
        this.$router.push(
          this.routeToProjectPage(suggestion[this.paramsForSuggestions[2]])
        );
      },
      updateSuggestions() {
        this.showResults('numfound');
        return this.getSuggestions();
      },
      getSuggestions() {
        this.isLoading = true;
        const suggestion = this.parameters.text;
        const query = `{${this.queryPrefix}(text: "${suggestion}" ${
          this.isSummaryIncluded ? 'summary: "true"' : ''
        }) {${this.paramsForSuggestions.join(' ')}}}`;
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
    },
  };
</script>
<style lang="sass" scoped>
  .vue-simple-suggest
      position: relative
  .text_search_area
      width: 85%
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
          font-size: 14px
          font-weight: 100
          display: flex
          align-items: center
          margin-top: 6px
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
