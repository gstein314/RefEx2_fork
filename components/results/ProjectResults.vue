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
              :columns-array="columnsArray"
              :orders-array="ordersArray"
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
                class="text_with_icon"
                @click="
                  moveToProjectPage(result.ncbiGeneId || result.ensemblGeneId)
                "
              >
                <font-awesome-icon class="left_icon" icon="dna" />
                {{ result.symbol }}
                <font-awesome-icon
                  class="right_icon info"
                  icon="info-circle"
                  @click.stop="setGeneModal(result[geneIdKey])"
                />
              </a>
              <a
                v-else-if="filter.column === 'Description'"
                class="text_with_icon"
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
              <img
                v-else-if="filter.column === 'gene expression patterns'"
                :src="geneSummarySource(result[geneIdKey])"
                :alt="result[geneIdKey]"
              />
              <template v-else-if="hasStringQuotes(result[filter.column])">
                {{ result[filter.column].replaceAll('"', '') }}
              </template>
              <a
                v-else-if="filter.column === 'ncbiGeneId'"
                class="text_with_icon"
                target="_blank"
                :href="datasetInfo.url_prefix + result.ncbiGeneId"
              >
                {{ result[filter.column] }}
                <font-awesome-icon icon="external-link-alt" />
              </a>
              <a
                v-else-if="filter.column === 'ensemblGeneId'"
                class="text_with_icon"
                target="_blank"
                :href="datasetInfo.url_prefix + result.ensemblGeneId"
              >
                {{ result[filter.column] }}
                <font-awesome-icon icon="external-link-alt" />
              </a>
              <template v-else>
                {{ result[filter.column] }}
                <span
                  v-if="filter.column !== 'alias'"
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
      columnsArray: {
        type: Array,
        default: () => [],
      },
      columnSortersArray: {
        type: Array,
        default: () => [],
      },
      ordersArray: {
        type: Array,
        default: () => [],
      },
      filteredSortedData: {
        type: Array,
        default: () => [],
      },
      currentPageId: {
        type: String,
        default: '',
      },
    },

    computed: {
      ...mapGetters({
        projectResults: 'get_project_results',
        projectItems: 'get_project_items',
        paginationObject: 'get_project_pagination',
        filters: 'project_filters',
        geneSummarySource: 'gene_summary_source',
        routeToOtherProjectPage: 'route_to_other_project_page',
        getFilterSearchValue: 'get_filter_search_value',
        filterObj: 'active_filter_modal',
        activeDataset: 'active_dataset',
        activeSpecie: 'active_specie',
        activeFilter: 'active_filter',
      }),
      pageItems() {
        return this.filteredSortedData.slice(
          this.paginationObject.offset,
          this.paginationObject.offset + this.paginationObject.limit
        );
      },

      pagesNumber() {
        let pagesNumber = Math.ceil(
          this.filteredSortedData.length / this.paginationObject.limit
        );
        return pagesNumber;
      },
      datasetInfo() {
        return this.activeDataset['gene'];
      },
    },
    created() {
      this.setPageType('project');
      if (location.search.match(/=(.*)&/)[1] === 'gene') {
        this.$store.commit('set_active_filter', 'gene');
      } else {
        this.$store.commit('set_active_filter', 'sample');
      }
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
      }),
      setQuery() {
        this.query = this.$route.query;
      },
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
        let ids = [];
        items.forEach(item => ids.push(item.id));
        if (this.currentPageId) ids = [this.currentPageId];
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
        this.$router.push(this.routeToOtherProjectPage(route));
      },
      activeSort(col_name) {
        this.$emit('activeSort', {
          column: col_name,
          selectedItem: this.selectedItem,
        });
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
