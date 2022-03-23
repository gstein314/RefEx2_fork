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
      <tr v-for="result in filteredData" :key="result.ncbiGeneId">
        <template v-for="(value, key) of filters">
          <td v-if="value.isDisplayed" :key="key" :class="value.innerKey">
            <!-- <median-bar
              v-if="key === 'log2_Median'"
              :result="result[key]"
              :gene-num="gene_num"
              :compare-genes="compare_genes"
              :symbol="info.symbol"
            >
            </median-bar> -->
            <template>
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
  const maxInTenth = x => {
    return Math.ceil(x / 10) * 10;
  };
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
      info: {
        type: Object,
        default: () => {},
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
              if (col.isDisplayed) {
                // number filter
                if (col.numberValue) {
                  if (
                    col.numberValue.value[0] > result[key] ||
                    col.numberValue.value[1] < result[key]
                  ) {
                    isFiltered = true;
                  }
                }
                // text filter
                else if (
                  col.filterModal !== '' &&
                  result[key].indexOf(col.filterModal) === -1
                ) {
                  isFiltered = true;
                }
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
    mounted() {
      // const ageFilter = this.filters.Age.numberValue;
      // const medianFilter = this.filters.log2_Median.numberValue;
      // ageFilter.max = maxInTenth(this.age_max);
      // ageFilter.value[1] = ageFilter.max;
      // medianFilter.max = maxInTenth(this.median_max);
      // medianFilter.value[1] = medianFilter.max;
      // for (let i = 0; i < this.filters.Age.numberValue.max; i += 10) {
      //   ageFilter.marks.push(i);
      // }
      // for (let i = 0; i < this.filters.log2_Median.numberValue.max; i += 1) {
      //   medianFilter.marks.push(i);
      // }
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
