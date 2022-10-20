<template>
  <section class="table-wrapper">
    <label for="cars">Primary Sort:</label>
    <select v-model="primarySort" id="columns" name="columns">
      <option value="Description">Description</option>
      <option value="LogMedian">LogMedian</option>
      <option value="NumberOfSamples">NumberOfSamples</option>
    </select>
    <select v-model="primaryOrder" id="columns" name="columns">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
    <label for="cars">Secondary Sort:</label>
    <select v-model="secondarySort" id="columns" name="columns">
      <option value="Description">Description</option>
      <option value="LogMedian">LogMedian</option>
      <option value="NumberOfSamples">NumberOfSamples</option>
    </select>
    <select v-model="secondaryOrder" id="columns" name="columns">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
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
                :stat-info="combinedData(items, result.itemNum)"
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
              <template v-else-if="hasStringQuotes(result[filter.column])">
                {{ result[filter.column].replaceAll('"', '') }}
              </template>
              <a
                v-else-if="filter.column === 'ncbiGeneId'"
                class="icon_on_right"
                target="_blank"
                :href="datasetInfo.url_prefix + result.ncbiGeneId"
                ><font-awesome-icon icon="external-link-alt" class="smaller" />
                {{ result[filter.column] }}
              </a>
              <a
                v-else-if="filter.column === 'ensemblGeneId'"
                class="icon_on_right"
                target="_blank"
                :href="datasetInfo.url_prefix + result.ensemblGeneId"
                ><font-awesome-icon icon="external-link-alt" class="smaller" />
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
    },
    data() {
      return {
        sort: {
          key: 'LogMedian',
          order: 'down',
        },
        primarySort: '',
        secondarySort: '',
        primaryOrder: '',
        secondaryOrder: '',
      };
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
        return _.orderBy(copy, [this.primarySort, this.secondarySort], [this.primaryOrder, this.secondaryOrder]
        );
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
      // test() {
      //   const copy = [...this.results];
      //   let secondSort = _.orderBy(this.filteredData, [this.primarySort, this.secondarySort], ['desc', 'desc']);
      //   return console.log(secondSort);
      // },
    },
    created() {
      this.setPageType('project');
    },
    mounted() {
      this.$emit('updateSort', this.sort);
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
      combinedData(items, itemNum) {
        const combinedStatData = {};
        let tmp = {
          firstQuartileData: {},
          minData: {},
          maxData: {},
          medianData: {},
          thirdQuartileData: {},
          sdData: {},
          numberOfSamplesData: {},
        };
        const projectItems = this.projectItems.items;
        const ids = [];
        items.forEach(item => ids.push(item.id));
        for (let i = 0; i < items.length; i++) {
          tmp['firstQuartileData'][ids[i]] =
            projectItems[i].firstQuartileData[itemNum];
          tmp['minData'][ids[i]] = projectItems[i].minData[itemNum];
          tmp['maxData'][ids[i]] = projectItems[i].maxData[itemNum];
          tmp['medianData'][ids[i]] = projectItems[i].medianData[itemNum];
          tmp['thirdQuartileData'][ids[i]] =
            projectItems[i].thirdQuartileData[itemNum];
          tmp['sdData'][ids[i]] = projectItems[i].sdData[itemNum];
          tmp['numberOfSamplesData'][ids[i]] =
            projectItems[i].numberOfSamplesData[itemNum];
          if (i === items.length - 1) {
            combinedStatData['firstQuartileData'] = tmp['firstQuartileData'];
            combinedStatData['minData'] = tmp['minData'];
            combinedStatData['maxData'] = tmp['maxData'];
            combinedStatData['medianData'] = tmp['medianData'];
            combinedStatData['thirdQuartileData'] = tmp['thirdQuartileData'];
            combinedStatData['sdData'] = tmp['sdData'];
            combinedStatData['numberOfSamplesData'] =
              tmp['numberOfSamplesData'];
          }
        }
        return combinedStatData;
      },
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
                top: 3px
                position: absolute
                padding-left: 4px
                font-size: 11px
                color: $MAIN_COLOR
                cursor: pointer
</style>
