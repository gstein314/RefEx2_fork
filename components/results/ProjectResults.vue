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
              :current-sort="sort"
              v-bind="filter"
              :class="filter.column"
              @switchSort="switchSort"
            >
              <median-scale v-if="filter.column === 'LogMedian'" />
            </table-header>
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
                :median-info="result.combinedMedianData"
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
              <template
                v-else-if="
                  filter.column === 'alias' &&
                  Array.isArray(JSON.parse(result[filter.column]))
                "
              >
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
              <template v-else>
                <span
                  class="filter_column"
                  @click="
                    setFilterSearchValue(result[filter.column]);
                    setFilterModal(filter.column);
                  "
                  >{{ result[filter.column]
                  }}<font-awesome-icon icon="plus-circle"
                /></span>
              </template>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <ResultsPagination :pages-number="pagesNumber" />
  </section>
</template>

<script>
  import TableHeader from '~/components/results/TableHeader.vue';
  import { mapGetters, mapMutations } from 'vuex';
  import ResultsPagination from '~/components/results/ResultsPagination.vue';

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
      ResultsPagination,
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
    },
    data() {
      return {
        sort: {
          key: 'LogMedian',
          order: 'down',
        },
      };
    },

    computed: {
      ...mapGetters({
        results: 'get_project_results',
        paginationObject: 'get_project_pagination',
        filters: 'project_filters',
        geneSummarySource: 'gene_summary_source',
        routeToOtherProjectPage: 'route_to_other_project_page',
        getFilterSearchValue: 'get_filter_search_value',
        filterObj: 'active_filter_modal',
      }),

      filteredData() {
        const copy = [...this.results];
        return copy
          .filter(result => {
            let isFiltered = false;
            for (const filter of this.filters) {
              const key = filter.column;

              if (!filter.is_displayed) continue;
              // options filter
              else if (filter.options) {
                if (!filter.filterModal.includes(result[key]))
                  isFiltered = true;
              }
              // number filter
              else if (
                typeof filter.filterModal === 'number' ||
                Array.isArray(filter.filterModal)
              ) {
                // checks if all values are in range. Creates a list in case of Age due to multiple values in string form
                const n =
                  key === 'Age'
                    ? createNumberList(result[key])
                    : key === 'LogMedian'
                    ? Object.values(result.combinedMedianData)
                    : [result[key]];
                if (n.find(x => inRange(x, filter.filterModal)) === undefined)
                  isFiltered = true;
              }
              // text filter
              else if (filter.filterModal !== '' && !isFiltered) {
                // excact match if filter is based on API options
                const isMatch = this.textFilter(
                  result[key],
                  filter.filterModal
                );
                isFiltered = filter.filterModal !== '' && !isMatch;
              }
            }
            return !isFiltered;
          })
          ?.sort((a, b) => {
            const aVal =
              this.sort.key === 'LogMedian'
                ? a.combinedMedianData[this.selectedItem]
                : a[this.sort.key];
            const bVal =
              this.sort.key === 'LogMedian'
                ? b.combinedMedianData[this.selectedItem]
                : b[this.sort.key];
            switch (this.sort?.order) {
              case 'up':
                if (aVal < bVal) {
                  return -1;
                } else if (aVal > bVal) {
                  return 1;
                } else {
                  return 0;
                }
              case 'down':
                if (aVal > bVal) {
                  return -1;
                } else if (aVal < bVal) {
                  return 1;
                } else {
                  return 0;
                }
            }
          });
      },
      pageItems() {
        return this.filteredData.slice(
          this.paginationObject.offset,
          this.paginationObject.offset + this.paginationObject.limit
        );
      },
      pagesNumber() {
        return Math.ceil(
          this.filteredData.length / this.paginationObject.limit
        );
      },
    },
    created() {
      this.setPageType('project');
    },
    mounted() {
      this.$emit('updateSort', this.sort);
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
        updatePagination: 'set_project_pagination',
        setPageType: 'set_page_type',
        setFilterSearchValue: 'set_filter_search_value',
        setFilterModal: 'set_filter_modal',
      }),
      moveToProjectPage(route) {
        this.$nuxt.$loading.start();
        window.location.href = this.routeToOtherProjectPage(route);
      },
      sortUpOrDown(a, b) {
        switch (this.sort?.order) {
          case 'up':
            if (a < b) {
              return -1;
            } else if (a > b) {
              return 1;
            } else {
              return 0;
            }
          case 'down':
            if (a > b) {
              return -1;
            } else if (a < b) {
              return 1;
            } else {
              return 0;
            }
        }
      },
      switchSort(col_name, order) {
        if (this.sort.key === col_name) {
          this.sort.order = this.sort.order === 'up' ? 'down' : 'up';
        } else {
          this.sort.key = col_name;
          this.sort.order = 'up';
        }
        if (order) {
          this.sort.order = order;
        }
        this.$emit('updateSort', this.sort);
      },
      textFilter(fullText, inputText) {
        const reg = new RegExp(inputText, 'gi');
        const isMatch = reg.test(fullText);
        if (inputText.length > 0 && isMatch) return fullText.replaceAll(reg);
      },
    },
  };
</script>
<style lang="sass" scoped>
  .table-wrapper
    margin: 0 45px
    table
      white-space: nowrap
      +table
      > tbody
        > tr
          > td
            > a
              +link_with_icon
            > .filter_column
              cursor: pointer
            > span
              > svg
                padding-left: 4px
                font-size: 11px
                vertical-align: middle
</style>
