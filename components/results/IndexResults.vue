<template>
  <div class="results_wrapper">
    <div class="results_title_wrapper">
      <h2>Matching {{ filterType }}s</h2>
      <div class="button_wrapper">
        <ComparisonButton />
        <DownloadButton
          ref="downloadButton"
          :data-cy="`${$vnode.key}_download_button`"
          :download-data="resultsDisplayed"
          :file-name="tsvTitle"
          :fields-array="indexTableHead"
          :disabled="resultsDisplayed.length === 0"
        />
        <CopyButton
          v-if="filterType === 'gene'"
          icon="copy"
          text="Copy Gene ID(s)"
          :content="geneIdListForCopy"
          :disabled="
            !filtersDisplayed.includes('geneid') ||
            resultsDisplayed.length === 0
          "
        />
      </div>
      <div class="display_settings_wrapper">
        <button class="show_all_btn" @click="$emit('toggleDisplaySettings')">
          <font-awesome-icon icon="eye" />
          Show/hide columns
        </button>
      </div>
    </div>
    <table :data-cy="`${$vnode.key}_index_table`">
      <thead :data-cy="`${$vnode.key}_index_thead`">
        <tr>
          <th class="checkbox">
            <input
              type="checkbox"
              :checked="isAllChecked"
              @click="toggleAllCheckbox"
            />
          </th>
          <th v-if="filterType === 'sample'">Description</th>
          <th
            v-for="(filter, index) of filters"
            v-show="filter.is_displayed"
            :key="index"
          >
            {{ filter.label }}
          </th>
        </tr>
      </thead>
      <tbody :data-cy="`${$vnode.key}_index_tbody`">
        <td
          v-if="resultsCached.length === 0"
          class="warning"
          :colspan="filters.filter(x => x.is_displayed).length + 2"
        >
          <font-awesome-icon icon="exclamation-triangle" />
          <template v-if="resultsNum === 0"
            >No results found. Please check the spelling or try other
            keywords.</template
          >
          <template v-else>
            Please press the 'Find {{ filterType }}s' button to update the
            results to the current screener settings.
          </template>
        </td>
        <tr
          v-for="(result, resultIndex) in pageItems"
          v-else
          :key="`result_${resultIndex}`"
          :data-cy="`${$vnode.key}_index_result_${resultIndex}`"
        >
          <td class="checkbox" @click="e => e.stopPropagation()">
            <input
              v-model="checkedResults[activeFilter.name]"
              type="checkbox"
              :value="result[keyForID]"
              @change="handleChange"
            />
          </td>
          <td v-if="filterType === 'sample'">
            <a
              class="text_with_icon"
              @click="moveToProjectPage(result['refexSampleId'])"
            >
              <font-awesome-icon icon="flask" />
              {{ result.Description }}
              <font-awesome-icon
                icon="info-circle"
                @click.stop="setSampleModal(result['refexSampleId'])"
              />
            </a>
          </td>
          <td
            v-for="(filter, index) of filters"
            v-show="filter.is_displayed"
            :key="index"
            :class="filter.column.replaceAll(' ', '_')"
          >
            <img
              v-if="filter.column === 'gene expression patterns'"
              :src="geneSummarySource(result.geneid)"
              :alt="result.geneid"
            />
            <a
              v-else-if="filter.column === 'symbol'"
              class="text_with_icon"
              @click="moveToProjectPage(result['geneid'])"
              ><font-awesome-icon class="left_icon" icon="dna" />
              {{ result[filter.column] }}
              <font-awesome-icon
                icon="info-circle"
                @click.stop="setGeneModal(result.geneid)"
              />
            </a>
            <a
              v-else-if="filter.column === 'geneid'"
              class="text_with_icon"
              target="_blank"
              :href="datasetInfo.url_prefix + result.geneid"
            >
              {{ result[filter.column] }}
              <font-awesome-icon icon="external-link-alt" />
            </a>
            <span
              v-else-if="isArrayLikeString(result[filter.column])"
              :key="index"
            >
              {{ JSON.parse(result[filter.column]).join(', ') }}
            </span>
            <template v-else-if="hasStringQuotes(result[filter.column])">
              {{ result[filter.column].replaceAll('"', '') }}
            </template>
            <template v-else> {{ result[filter.column] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
    <ResultsPagination :pages-number="pagesNumber" table-type="index" />
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';
  import ResultsPagination from '~/components/results/ResultsPagination.vue';
  import DownloadButton from '../DownloadButton.vue';
  import filters from '~/static/filters.json';

  const initialState = () => {
    return {
      checkedResults: { gene: [], sample: [] },
      resultsCached: [],
    };
  };

  export default {
    components: {
      ResultsPagination,
      DownloadButton,
    },
    props: {
      filters: {
        type: Array,
        default: () => [],
      },
      tableDataIsSameAsScreener: {
        type: Boolean,
        default: true,
      },
      resultsNum: {
        type: Number,
        default: 0,
      },
      filterKey: {
        type: String,
        default: 'gene',
      },
    },
    data() {
      return {
        ...initialState(),
      };
    },
    computed: {
      ...mapGetters({
        paginationObject: 'index_pagination',
        resultsByName: 'results_by_name',
        filterByName: 'filter_by_name',
        activeSpecie: 'active_specie',
        activeDataset: 'active_dataset',
        routeToProjectPage: 'route_to_project_page',
        geneSummarySource: 'gene_summary_source',
        getCheckedResults: 'get_checked_results',
        isOn: 'compare_modal',
        activeFilter: 'active_filter',
      }),
      examples() {
        return this.activeDataset[this.filterType].item_comparison_example;
      },
      resultsUniqueKeys() {
        return this.resultsCached.map(item => item[this.keyForID]);
      },
      keyForID() {
        return this.filterType === 'gene' ? 'geneid' : 'refexSampleId';
      },
      filterType() {
        return this.$vnode.key.split('_')[0];
      },
      datasetInfo() {
        return this.activeDataset[this.filterType];
      },
      isAllChecked() {
        return (
          this.resultsUniqueKeys.length > 0 &&
          this.checkedResults[this.activeFilter.name].length ===
            this.resultsUniqueKeys.length
        );
      },
      results() {
        return this.resultsByName(this.filterType).results;
      },
      pageItems() {
        return this.resultsCached.slice(
          this.paginationObject.offset,
          this.paginationObject.offset + this.paginationObject.limit
        );
      },
      pagesNumber() {
        return Math.ceil(
          this.resultsCached.length / this.paginationObject.limit
        );
      },
      filtersDisplayed() {
        return this.filters
          .filter(({ is_displayed }) => is_displayed)
          .map(({ column }) => column);
      },
      resultsDisplayed() {
        return this.results.map(result => {
          const updatedResult = { ...result };
          const keyToReplace = 'alias';

          if (this.filtersDisplayed.includes(keyToReplace)) {
            updatedResult[keyToReplace] = this.$composeAlias(
              result[keyToReplace]
            );
          }

          return updatedResult;
        });
      },
      indexTableHead() {
        if (this.results.length === 0) return [];
        const arr = Object.keys(this.results?.[0])
          .map(oldTitle => {
            const obj = {};
            this.filters.forEach(({ column, label, is_displayed }) => {
              const newTitle = label;
              if (oldTitle === column && is_displayed) {
                obj[oldTitle] = newTitle;
              }
            });
            return obj;
          })
          .filter(obj => {
            const isNotEmpty = Object.keys(obj).length !== 0;
            return isNotEmpty;
          });
        // hardcode to add Description column to download data
        if (this.filterType === 'sample') {
          arr.unshift({ Description: 'Description' });
        }
        return arr;
      },
      tsvTitle() {
        const today = this.$getToday();
        return `RefEx2_${this.activeSpecie.species_id}_${this.activeDataset.dataset}_${this.filterType}_search_results_${today}.tsv`;
      },
      geneIdListForCopy() {
        const geneIdList = this.resultsCached?.map(({ geneid }) => geneid);
        return geneIdList.join('\r\n');
      },
    },
    watch: {
      activeDataset() {
        this.checkedResults = { gene: [], sample: [] };
        this.handleChange();
      },
      isOn() {
        if (!this.isOn) {
          this.checkedResults[this.activeFilter.name] = this.getCheckedResults;
        }
      },
      resultsDisplayed: {
        handler(newVal) {
          if (newVal.length > 0) {
            this.resultsCached = JSON.parse(JSON.stringify(newVal));
          }
        },
        deep: true,
      },
    },
    created() {
      this.setPageType('index');
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
        setSampleModal: 'set_sample_modal',
        setPageType: 'set_page_type',
        setCheckedResults: 'set_checked_results',
      }),
      copyToClipboard(target) {
        navigator.clipboard.writeText(target);
      },
      moveToProjectPage(route) {
        this.$nuxt.$loading.start();
        this.$router.push(this.routeToProjectPage(route));
      },
      isArrayLikeString(str) {
        return str?.startsWith('[');
      },
      hasStringQuotes(str) {
        return str?.startsWith('"') && str?.endsWith('"');
      },
      toggleAllCheckbox() {
        if (this.isAllChecked) {
          this.checkedResults[this.activeFilter.name] = [];
        } else {
          this.checkedResults[this.activeFilter.name] = this.resultsUniqueKeys;
        }
        this.handleChange();
      },
      handleChange() {
        const type = this.filterKey;
        this.setCheckedResults({
          checked_results: this.checkedResults[type],
          type,
        });
      },
      resetComponent() {
        Object.assign(this.$data, initialState());
      },
    },
  };
</script>
<style lang="sass" scoped>
  .results_wrapper
    min-width: 600px
    padding: $PADDING_WRAPPER
    margin-bottom: 60px
    > .results_title_wrapper
      display: flex
      width: 100%
      align-items: center
      +sample_query
      > h2
        min-width: 190px
      > .button_wrapper
        display: flex
        gap: 15px
      > .display_settings_wrapper
        +display_settings_wrapper
        > .show_all_btn
          +button
          +sub_button
          white-space: nowrap
    > table
      +table
      .copy_button
        cursor: pointer
        > svg
          margin-left: 5px
      > tbody
        > .warning
          +warning
          padding: 40px
        > tr
          > td
            > a
              +link_with_icon
</style>
