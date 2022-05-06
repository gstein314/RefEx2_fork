<template>
  <table>
    <thead>
      <tr>
        <table-header
          id="LogMedian"
          :current-sort="sort"
          v-bind="logMedianFilter"
          @switchSort="switchSort"
        >
          <median-scale />
        </table-header>
        <table-header
          v-for="(filter, filterIndex) of filters"
          :id="filter.column"
          :key="`filterIndex-${filterIndex}`"
          :current-sort="sort"
          v-bind="filter"
          :class="filter.column"
          @switchSort="switchSort"
        >
        </table-header>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(result, resultIndex) in filteredData" :key="resultIndex">
        <MedianBar :median-info="result.combinedMedianData" />
        <template v-for="(filter, filterIndex) of filters">
          <td
            v-if="filter.is_displayed"
            :key="`result-${filterIndex}`"
            :class="filter.column"
          >
            <MedianBar
              v-if="filter.column === 'LogMedian'"
              :median-info="result.combinedMedianData"
            />
            <template v-else>
              {{ result }}
            </template>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import { mapGetters } from 'vuex';
  import TableHeader from '~/components/results/TableHeader.vue';

  const inRange = (x, [min, max]) => {
    return typeof x !== 'number' || (x - min) * (x - max) <= 0;
  };

  const logMedianFilter = {
    column: 'LogMedian',
    label: 'Log Median',
    is_displayed: true,
    is_displayed: true,
    filterModal: '',
  };

  const createNumberList = str =>
    str
      .replace('-', ',')
      .split(',')
      .map(x => parseInt(x) || 'out of filter bounds');

  export default {
    components: {
      // MedianBar,
      TableHeader,
    },
    props: {
      results: {
        type: Array,
        default: () => [],
      },
      selectedItem: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        logMedianFilter,
        sort: {
          key: 'LogMedian',
          order: 'down',
        },
      };
    },

    computed: {
      ...mapGetters({
        filters: 'project_filters',
      }),
      filteredData() {
        return this.results
          .filter(result => {
            let isFiltered = false;
            for (const [key, col] of Object.entries(this.filters)) {
              if (!col.isDisplayed) continue;
              // number filter
              else if (
                typeof col.filterModal === 'number' ||
                Array.isArray(col.filterModal)
              ) {
                // checks if all values are in range. Creates a list in case of Age due to multiple values in string form
                const n =
                  key === 'Age'
                    ? createNumberList(result[key])
                    : key === 'LogMedian'
                    ? Object.values(result.combinedMedianData)
                    : [result[key]];
                isFiltered =
                  n.find(x => inRange(x, col.filterModal)) === undefined;
              }
              // text filter
              else if (
                col.filterModal !== '' &&
                !result[key].includes(col.filterModal)
              ) {
                isFiltered =
                  col.filterModal !== '' &&
                  !result[key].includes(col.filterModal);
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
    },
    mounted() {
      this.$emit('updateSort', this.sort);
    },
    methods: {
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
    },
  };
</script>
<style lang="sass" scoped>
  table
    +table
</style>
