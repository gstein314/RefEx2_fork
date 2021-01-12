<template>
  <div class="chart_wrapper">
    <!-- <p>{{ `${$route.params.organism} ${$route.params.project} ${$route.params.gid}` }}</p> -->
    <table>
      <thead>
        <tr>
          <th class="sample_description">
            Sample Description
            <font-awesome-icon 
              :icon="sort.active === 'sample_description' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('sample_description')"
            />
          </th>
          <th class="median">
            MEDIAN [LOG2(TPM+1)]
            <font-awesome-icon 
              :icon="sort.active === 'median' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('median')"
            />
          </th>
          <th class="sample_type">
            Sample type
            <font-awesome-icon 
              :icon="sort.active === 'sample_type' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('sample_type')"
            />
          </th>
          <th class="experiment">
            Experiment
            <font-awesome-icon 
              :icon="sort.active === 'experiment' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('experiment')"
            />
          </th>
          <th class="cl">
            CL
            <font-awesome-icon 
              :icon="sort.active === 'cl' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('cl')"
            />
          </th>
          <th class="sex">
            Sex
            <font-awesome-icon 
              :icon="sort.active === 'sex' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('sex')"
            />
          </th>
          <th class="age">
            Age
            <font-awesome-icon 
              :icon="sort.active === 'age' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('age')"
            />
          </th>
          <th class="stage">
            Stage
            <font-awesome-icon 
              :icon="sort.active === 'stage' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('stage')"
            />
          </th>
          <th class="ncit">
            NCIT
            <font-awesome-icon 
              :icon="sort.active === 'ncit' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('ncit')"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in results.r_inf" :key="result.ncbiGeneId">
          <td class="sample_description">{{ result["Description"] }}</td>
          <td class="median">{{ result["Median"] }}</td>
          <td class="sample_type">{{ result["Sample types category"] }}</td>
          <td class="experiment">{{ result["Experiments category"] }}</td>
          <td class="cl">{{ result["CL label"] }}</td>
          <td class="sex">{{ result["Sex"] }}</td>
          <td class="age">{{ result["Age"] }}</td>
          <td class="stage">{{ result["Developmental stage"] }}</td>
          <td class="ncit">{{ result["NCIT label"] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import $ from "jquery";
import * as d3 from "d3";
import axios from "axios";

export default {
  async asyncData({ params, error, payload }) {
    let data = await axios.get(
      `http://refex2-api.bhx.jp/api/dist/${params.gid}`
    );
    // default: Median sort
    data.data.r_inf.sort(function(a,b) {
      return b.Median - a.Median;
    });
    return {
      results: data.data,
    };
  },
  data() {
    return {
      sort: {
        active: 'median',
        order: 'up'
      }
    }
  },
  mounted() {},
  methods: {
    switchSort(col_name) {
      if(this.sort.active === col_name){
        this.sort.order = this.sort.order === 'up' ? 'down' : 'up'
      } else {
        this.sort.active = col_name
        this.order = 'up'
      }
      console.log('現在activeのソート', this.sort)
      console.log('ソートしたいデータ', this.results)
    }
  }
};
</script>

<style lang="sass">
.chart_wrapper
  width: 1000px
  margin: 0 auto
  > table
    +table
    > thead > tr > th:nth-of-type(1),
    > tbody > tr > td:nth-of-type(1)
      text-align: left
    > thead > tr > th
      > svg
        &:hover
          cursor: pointer
      > .fa-sort
        color: $GRAY
        opacity: .3
      > .fa-sort-up,
      > .fa-sort-down
        color: $MAIN_COLOR
</style>
