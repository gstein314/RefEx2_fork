<template>
  <table>
    <thead>
      <tr>
        <table-header
          v-for="(filter, key) of filters"
          :id="key"
          :key="key"
          :current-sort="sort"
          v-bind="filter"
          :class="key"
          @switchSort="switchSort"
        >
          <template v-if="key === 'log2_Median'">
            <median-scale />
          </template>
        </table-header>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(result, resultIndex) in filteredData" :key="resultIndex">
        <template v-for="(value, key) of filters">
          <td v-if="value.isDisplayed" :key="key" :class="value.innerKey">
            <median-bar
              v-if="key === 'log2_Median'"
              :median-info="medianInfo[resultIndex]"
            >
            </median-bar>
            <template v-else>
              {{ result[key] }}
            </template>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script>
  // import MedianBar from '@/components/MedianBar.vue';
  import { mapGetters } from 'vuex';
  import TableHeader from '~/components/results/TableHeader.vue';

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
      // MedianBar,
      TableHeader,
    },
    props: {
      results: {
        type: Array,
        default: () => [],
      },
      medianInfo: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        sort: {
          active: 'log2_Median',
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
              if (
                typeof col.filterModal === 'number' ||
                Array.isArray(col.filterModal)
              ) {
                // checks if all values are in range. Creates a list in case of Age due to multiple values in string form
                const n =
                  key === 'Age' ? createNumberList(result[key]) : [result[key]];
                if (n.find(x => inRange(x, col.filterModal))) continue;
                isFiltered = true;
              }
              // text filter
              else if (
                col.filterModal !== '' &&
                result[key].indexOf(col.filterModal) === -1
              ) {
                isFiltered = true;
              }
            }
            return !isFiltered;
          })
          ?.sort((a, b) => {
            switch (this.sort?.order) {
              case 'up':
                if (a[this.sort?.active] < b[this.sort?.active]) {
                  return -1;
                } else if (a[this.sort?.active] > b[this.sort?.active]) {
                  return 1;
                } else {
                  return 0;
                }
              case 'down':
                if (a[this.sort?.active] > b[this.sort?.active]) {
                  return -1;
                } else if (a[this.sort?.active] < b[this.sort?.active]) {
                  return 1;
                } else {
                  return 0;
                }
            }
          });
      },
    },
    methods: {
      switchSort(col_name, order) {
        if (this.sort.active === col_name) {
          this.sort.order = this.sort.order === 'up' ? 'down' : 'up';
        } else {
          this.sort.active = col_name;
          this.sort.order = 'up';
        }
        if (order) {
          this.sort.order = order;
        }
      },
    },
  };
</script>
