<template>
  <div class="chart_wrapper">
    <!-- <p>{{ `${$route.params.organism} ${$route.params.project} ${$route.params.gid}` }}</p> -->
    <table>
      <thead>
        <tr>
          <th class="sample_description">Sample Description</th>
          <th class="median">MEDIAN [LOG2(TPM+1)]</th>
          <th class="sample_type">Sample type</th>
          <th class="experiment">Experiment</th>
          <th class="cl">CL</th>
          <th class="sex">Sex</th>
          <th class="age">Age</th>
          <th class="stage">Stage</th>
          <th class="ncit">NCIT</th>
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
    console.log(data);
    // ここにソート機能を実装する！
    console.log(data.data);
    console.log(data.data.r_inf);

    data.data.r_inf.sort(function(a,b) {
      return b.Median - a.Median;
    });

    // sort練習用
    // var items = [
    //   { name: "Edward", value: 21 },
    //   { name: "Sharpe", value: 37 },
    //   { name: "And", value: 45 },
    //   { name: "The", value: -12 },
    //   { name: "Magnetic", value: 13 },
    //   { name: "Zeros", value: 37 },
    // ];
    // items.sort(function (a, b) {
    //   return a.value - b.value;
    // });
    // console.log(items);

    // ここまでソート機能を実装する
    return {
      results: data.data,
    };
  },
  mounted() {},
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
</style>
