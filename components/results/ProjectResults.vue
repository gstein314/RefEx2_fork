<template>
  <section class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th
            v-for="(filter, filterIndex) of filters"
            v-show="filter.is_displayed"
            :key="`filterIndex-${filterIndex}`"
            :style="{ top: heightChartWrapper + 'px' }"
          >
            <table-header
              :id="filter.column"
              v-bind="filter"
              :class="filter.column"
              :project-sort-columns="projectSortColumns"
              @activeSort="activeSort"
            >
            </table-header>
            <median-scale v-if="filter.column === 'LogMedian'" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, resultIndex) in pageItems" :key="resultIndex">
          <template v-for="(filter, filterIndex) of filters">
            <td
              v-if="filter.is_displayed"
              :key="`result-${filterIndex}`"
              :class="filter.column.replaceAll(' ', '_')"
            >
              <a
                v-if="filter.column === 'symbol'"
                class="icon_on_left"
                @click="
                  moveToProjectPage(result['ncbiGeneId' || 'ensemblGeneId'])
                "
              >
                <font-awesome-icon icon="dna" />
                {{ result.symbol }}
              </a>
              <a
                v-else-if="filter.column === 'Description'"
                class="icon_on_left"
                @click="moveToProjectPage(result['RefexSampleId'])"
              >
                <font-awesome-icon icon="flask" />
                {{ result.Description }}
              </a>
              <MedianBar
                v-else-if="filter.column === 'LogMedian'"
                :items="items"
                :stat-info="tooltipData(items, result.itemNum)"
              />
              <font-awesome-icon
                v-else-if="filter.column === 'annotation'"
                icon="info-circle"
                @click.stop="setGeneModal(result[geneIdKey])"
              />
              <img
                v-else-if="filter.column === 'gene expression patterns'"
                :src="geneSummarySource(result[geneIdKey])"
                :alt="result[geneIdKey]"
              />
              <template v-else-if="isAliasArray(result, filter)">
                <span
                  v-for="(alias, alias_index) in JSON.parse(
                    result[filter.column]
                  )"
                  :key="alias_index"
                >
                  <span>{{ alias }}</span>
                  <span
                    v-if="
                      alias_index < JSON.parse(result[filter.column]).length - 1
                    "
                    class="comma"
                    >,
                  </span>
                </span>
              </template>

              <template v-else-if="hasStringQuotes(result[filter.column])">
                {{ result[filter.column].replaceAll('"', '') }}
              </template>
              <a
                v-else-if="filter.column === 'ncbiGeneId'"
                class="icon_on_right"
                target="_blank"
                :href="datasetInfo.url_prefix + result.ncbiGeneId"
                ><font-awesome-icon icon="external-link-alt" />
                {{ result[filter.column] }}
              </a>
              <a
                v-else-if="filter.column === 'ensemblGeneId'"
                class="icon_on_right"
                target="_blank"
                :href="datasetInfo.url_prefix + result.ensemblGeneId"
                ><font-awesome-icon icon="external-link-alt" />
                {{ result[filter.column] }}
              </a>
              <template v-else>
                {{ result[filter.column] }}
                <span
                  @click="
                    setFilterSearchValue(result[filter.column]);
                    setFilterModal(filter.column);
                  "
                  ><font-awesome-icon icon="plus-circle"
                /></span>
              </template>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
  import TableHeader from '~/components/results/TableHeader.vue';
  import { mapGetters, mapMutations } from 'vuex';
  import specieSets from '~/refex-sample/datasets.json';
  import _ from 'lodash';
  const inRange = (x, [min, max]) => {
    return typeof x !== 'number' || (x - min) * (x - max) <= 0;
  };

  const createNumberList = str =>
    str
      .replace('-', ',')
      .split(',')
      .map(x => parseInt(x) || 'out of filter bounds');

  export default {
    components: {
      TableHeader,
    },
    props: {
      selectedItem: {
        type: String,
        default: '',
      },
      geneIdKey: {
        type: String,
        default: 'geneid',
      },
      dataset: {
        type: String,
        default: '',
      },
      items: {
        type: Array,
        default: () => [],
      },
      heightChartWrapper: {
        type: Number,
        default: 200,
      },
      projectSortColumns: {
        type: Array,
        default: () => [],
      },
      csvTableStatTitle: {
        type: Object,
        default: () => {},
      },
    },

    computed: {
      ...mapGetters({
        results: 'get_project_results',
        projectItems: 'get_project_items',
        paginationObject: 'get_project_pagination',
        filters: 'project_filters',
        geneSummarySource: 'gene_summary_source',
        routeToOtherProjectPage: 'route_to_other_project_page',
        getFilterSearchValue: 'get_filter_search_value',
        filterObj: 'active_filter_modal',
        activeDataset: 'active_dataset',
        activeSpecie: 'active_specie',
      }),

      filteredData() {
        const copy = [...this.results];
        const filtered = copy.filter(result => {
          let isFiltered = false;
          for (const filter of this.filters) {
            const key = filter.column;

            if (!filter.is_displayed) continue;
            // options filter
            else if (filter.options) {
              if (!filter.filterModal.includes(result[key])) isFiltered = true;
            }
            // number filter
            else if (
              typeof filter.filterModal === 'number' ||
              Array.isArray(filter.filterModal)
            ) {
              // checks if all values are in range. Creates a list in case of Age due to multiple values in string form
              const n =
                key === 'Age' ? createNumberList(result[key]) : [result[key]];
              if (n.find(x => inRange(x, filter.filterModal)) === undefined)
                isFiltered = true;
            }
            // text filter
            else if (filter.filterModal !== '' && !isFiltered) {
              // excact match if filter is based on API options
              const isMatch = this.textFilter(result[key], filter.filterModal);
              isFiltered = filter.filterModal !== '' && !isMatch;
            }
          }
          return !isFiltered;
        });
        const withSort = _.orderBy(filtered, ...this.projectSortColumns);
        const displayed = [];
        for (const filter of this.filters) {
          if (filter.is_displayed) displayed.push(filter.column);
        }
        const resultsOnScreen = [];

        for (const item of withSort) {
          const filtered = Object.keys(item)
            .filter(key => displayed.includes(key))
            .reduce((obj, key) => {
              // add other statistic data if LogMedian is displayed
              if (key === 'LogMedian') {
                for (const key of Object.keys(this.csvTableStatTitle)) {
                  obj[key] = item[key];
                }
              } else if (key === 'alias') {
                // format alias data to avoid csv data conflict ("," problem)
                try {
                  obj[key] = JSON.parse(item[key]).join(' , ');
                } catch {
                  obj[key] = item[key].replaceAll('"', '');
                }
              } else obj[key] = item[key];
              // add png url option in exported csv
              // if (obj['gene expression patterns'])
              //   delete obj['gene expression patterns'];
              return obj;
            }, {});
          resultsOnScreen.push(filtered);
        }
        this.$emit('setProjectResultsView', resultsOnScreen);
        return withSort;
      },
      pageItems() {
        return this.filteredData.slice(
          this.paginationObject.offset,
          this.paginationObject.offset + this.paginationObject.limit
        );
      },
      pagesNumber() {
        let pagesNumber = Math.ceil(
          this.filteredData.length / this.paginationObject.limit
        );
        return pagesNumber;
      },
      datasetInfo() {
        return this.activeDataset['gene'];
      },
    },
    created() {
      this.setPageType('project');
    },
    mounted() {
      this.setDataset();
    },
    updated() {
      this.setProjectPagesNumber(this.pagesNumber);
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
        updatePagination: 'set_project_pagination',
        setPageType: 'set_page_type',
        setFilterSearchValue: 'set_filter_search_value',
        setFilterModal: 'set_filter_modal',
        setActiveDataset: 'set_active_dataset',
        setProjectPagesNumber: 'set_project_pages_number',
        setProjectResultsView: 'set_project_results_view',
      }),
      tooltipData(items, itemNum) {
        const statData = {};
        let tmp = {
          firstQuartileData: {},
          minData: {},
          maxData: {},
          medianData: {},
          thirdQuartileData: {},
          sdData: {},
          numberOfSamplesData: {},
        };
        const ids = [];
        items.forEach(item => ids.push(item.id));
        for (let i = 0; i < ids.length; i++) {
          for (const statName in tmp) {
            tmp[statName][ids[i]] =
              this.projectItems.items[i][statName][itemNum];
            if (i === ids.length - 1) statData[statName] = tmp[statName];
          }
        }
        return statData;
      },
      moveToProjectPage(route) {
        this.$nuxt.$loading.start();
        window.location.href = this.routeToOtherProjectPage(route);
      },
      activeSort(col_name) {
        this.$emit('activeSort', {
          column: col_name,
          selectedItem: this.selectedItem,
        });
      },
      textFilter(fullText, inputText) {
        const reg = new RegExp(inputText, 'gi');
        const isMatch = reg.test(fullText);
        if (inputText.length > 0 && isMatch) return fullText.replaceAll(reg);
      },
      setDataset() {
        if (this.dataset === 'humanFantom5') {
          this.setActiveDataset(specieSets[0].datasets[0]);
        } else if (this.dataset === 'gtexV8') {
          this.setActiveDataset(specieSets[0].datasets[1]);
        }
      },
      hasStringQuotes(str) {
        return str?.startsWith('"') && str?.endsWith('"');
      },
      isAliasArray(result, filter) {
        if (filter.column !== 'alias') return;
        try {
          return Array.isArray(JSON.parse(result[filter.column]));
        } catch {
          return false;
        }
      },
    },
  };
</script>
<style lang="sass" scoped>
  .table-wrapper
    margin: 0 20px
    table
      white-space: nowrap
      +table
      > thead
        > tr
          > th:last-child
            width: 100%
      > tbody
        > tr
          > td
            > a
              +link_with_icon
            > .filter_column
              cursor: pointer
            > span
              position: relative
              > svg
                padding-left: 4px
                font-size: 11px
                color: $MAIN_COLOR
                cursor: pointer
          > td:last-child
            width: 100%
</style>
