<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div class="text_search_area">
    <h2>Search searchCondition</h2>
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
    <vue-simple-suggest
      v-model="parameters.text"
      :debounce="500"
      display-attribute="name"
      value-attribute="name"
      :list="getSuggestionList"
      :max-suggestions="100"
      class="text_search_gene_name"
      :placeholder="filterType === 'gene' ? 'transcription factor' : 'liver'"
      @input="showResults('numfound')"
      @select="moveDetailpage"
    >
      <template slot="misc-item-above">
        <button class="show_all_btn" @click="showResults()">
          <font-awesome-icon icon="list" />
          Show all genes that match your query
        </button>
      </template>
      <!-- plugin uses slot-scope as a prop variable. {suggestion} turns into an object at the plugin-->
      <!-- eslint-disable vue/no-unused-vars -->
      <div
        slot="suggestion-item"
        slot-scope="{ suggestion }"
        v-html="
          `<b>${suggestion.symbol}</b>&nbsp;
          (${$boldenSuggestion(suggestion.name, parameters.text)}
          ${$boldenSuggestion(suggestion.alias, parameters.text)}
          , GeneID: ${$boldenSuggestion(
            suggestion.entrezgene,
            parameters.text
          )})`
        "
      >
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
        @click="showResults('numfound')"
      />
      <label for="summary_check">Include this field in search</label>
    </div>
    <ScreenerView>
      <component
        :is="`screener-view-${filterType}`"
        @updateParameters="updateParams"
      ></component>
    </ScreenerView>
    <button class="find_results_btn" @click="showResults()">
      <font-awesome-icon icon="search" />
      Find {{ filterType }}s
    </button>
  </div>
</template>
<script>
  import VueSimpleSuggest from 'vue-simple-suggest';
  import ScreenerView from '~/components/ScreenerView/ScreenerView.vue';
  import { mapGetters } from 'vuex';

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
      // TODO: turn into qql query
      filterObj() {
        return this.activeDataset[this.filterType];
      },
      title() {
        return this.searchCondition
          .map((condition, index) => {
            return index < this.searchCondition.length - 1
              ? index === this.searchCondition.length - 2
                ? condition.label + ' or '
                : condition.label + ', '
              : condition.label;
          })
          .join('');
      },
      isNum() {
        return this.typeOfQuery.includes('numfound');
      },
      queryPrefix() {
        return `${this.activeDataset.dataset}${this.$firstLetterUppercase(
          this.filterType
        )}${this.isNum ? 'Numfound' : ''}`;
      },
      keyForID() {
        const fixedResultParamsForGene = 'symbol name alias geneid';
        return this.filterType === 'gene'
          ? fixedResultParamsForGene
          : 'refexSampleId';
      },
      suggest_query() {
        let params = Object.entries(this.parameters)
          .filter(([_key, value]) => value !== '')
          .map(
            ([key, value], index) =>
              `${key}:"${value}"${
                index === Object.entries(this.parameters).length - 1 ? '' : ', '
              }`
          )
          .join('');
        if (params !== '') params = `(${params})`;
        const resultParams = this.isNum
          ? ''
          : `{${Object.keys(this.parameters)
              .filter(param => !['text', 'go'].includes(param))
              .join(' ')} ${this.keyForID}}`;
        const suffix = this.isNum ? '' : ` ${this.queryPrefix}Numfound`;
        return `{${this.queryPrefix}${params}${resultParams}${suffix}}`;
      },
    },
    watch: {
      activeDataset() {
        this.$set(this.parameters, 'text', '');
        this.typeOfQuery = 'reset numfound';
        // if (this.activeFilter.name !== this.filterType) return;
        this.showResults('reset numfound');
      },
      activeSpecie() {
        this.showResults('numfound');
      },
    },
    methods: {
      updateParams(params) {
        this.parameters = { text: this.parameters.text, ...params };

        this.showResults('numfound');
      },
      // TODO: check if suggestions needs to be changed for sample
      getSuggestionList(suggest) {
        let url = `http://refex2-api.bhx.jp/api/suggest?query=${suggest}`;
        this.isLoading = true;
        return this.$axios.$get(url).then(results => {
          this.isLoading = false;
          return results.results;
        });
      },
      moveDetailpage(suggestion) {
        this.$router.push(this.routeToProjectPage(suggestion.entrezgene));
      },
      showResults(type = 'all') {
        console.log(type);
        this.typeOfQuery = type;
        let results = [],
          results_num = 0;
        this.$axios
          .$post('gql', {
            query: this.suggest_query,
          })
          .then(result => {
            const prefix = this.queryPrefix.replace('Numfound', '');
            if (`${prefix}Numfound` in result.data) {
              results_num = result.data[prefix + 'Numfound'];
            }
            if (prefix in result.data) results = result.data[prefix] || [];
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
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
      .text_search_gene_name
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
