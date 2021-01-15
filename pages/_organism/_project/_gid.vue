<template>
  <div class="chart_wrapper">
    <div class="header">
      <h1>
        <font-awesome-icon icon="info-circle" />
        {{ `${results.ginf.symbol}(${results.ginf.name}, NCBI GeneID: ${results.ginf.id}` }}</h1>
      <button class="comparison_btn">
        <font-awesome-icon icon="chart-bar" />
        Comparison
      </button>
    </div>
    <a class="display_settings" :click="is_display_settings_on = true">
      <font-awesome-icon icon="eye" />
      Display settings
    </a>
    <table>
      <thead>
        <tr>
          <th class="sample_description" v-if="display.sample_description">
            Sample Description
            <font-awesome-icon
              :icon="sort.active === 'Description' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('Description')"
            />
            <font-awesome-icon
              icon="search"
              @click="SearchByText('sample_description')"
            />
          </th>
          <th class="median" v-if="display.median">
            MEDIAN [LOG2(TPM+1)]
            <font-awesome-icon
              :icon="sort.active === 'Median' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('Median')"
            />
            <font-awesome-icon
              icon="search"
              @click="SearchByText('median')"
            />
          </th>
          <th class="sample_type" v-if="display.sample_type">
            Sample type
            <font-awesome-icon
              :icon="sort.active === 'Sample types category' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('Sample types category')"
            />
            <font-awesome-icon
              icon="search"
              @click="SearchByText('sample_type')"
            />
          </th>
          <th class="experiment" v-if="display.experiment">
            Experiment
            <font-awesome-icon
              :icon="sort.active === 'Experiments category' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('Experiments category')"
            />
            <font-awesome-icon
              icon="search"
              @click="SearchByText('experiment')"
            />
          </th>
          <th class="uberon" v-if="display.uberon">
            UBERON
            <font-awesome-icon
              :icon="sort.active === 'UBERON label' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('UBERON label')"
            />
            <font-awesome-icon
              icon="search"
              @click="SearchByText('uberon')"
            />
          </th>
          <th class="cl" v-if="display.cl">
            CL
            <font-awesome-icon
              :icon="sort.active === 'CL label' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('CL label')"
            />
            <font-awesome-icon
              icon="search"
              @click="SearchByText('cl')"
            />
          </th>
          <th class="sex" v-if="display.sex">
            Sex
            <font-awesome-icon
              :icon="sort.active === 'Sex' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('Sex')"
            />
            <font-awesome-icon
              icon="search"
              @click="SearchByText('sex')"
            />
          </th>
          <th class="age" v-if="display.age">
            Age
            <font-awesome-icon
              :icon="sort.active === 'Age' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('Age')"
            />
            <font-awesome-icon
              icon="search"
              @click="SearchByText('age')"
            />
          </th>
          <th class="stage" v-if="display.stage">
            Stage
            <font-awesome-icon
              :icon="sort.active === 'Developmental stage' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('Developmental stage')"
            />
            <font-awesome-icon
              icon="search"
              @click="SearchByText('stage')"
            />
          </th>
          <th class="ncit" v-if="display.ncit">
            NCIT
            <font-awesome-icon
              :icon="sort.active === 'NCIT label' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('NCIT label')"
            />
            <font-awesome-icon
              icon="search"
              @click="SearchByText('ncit')"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in results.r_inf" :key="result.ncbiGeneId">
          <td v-if="display.sample_description" class="sample_description">{{ result["Description"] }}</td>
          <td v-if="display.median" class="median">{{ result["Median"] }}</td>
          <td v-if="display.sample_type" class="sample_type">{{ result["Sample types category"] }}</td>
          <td v-if="display.experiment" class="experiment">{{ result["Experiments category"] }}</td>
          <td v-if="display.uberon" class="uberon">{{ result["UBERON label"] }}</td>
          <td v-if="display.cl" class="cl">{{ result["CL label"] }}</td>
          <td v-if="display.sex" class="sex">{{ result["Sex"] }}</td>
          <td v-if="display.age" class="age">{{ result["Age"] }}</td>
          <td v-if="display.stage" class="stage">{{ result["Developmental stage"] }}</td>
          <td v-if="display.ncit" class="ncit">{{ result["NCIT label"] }}</td>
        </tr>
      </tbody>
    </table>
    <div class="modal_bg" @click="closeModal">
      <div class="display_settings_modal" v-if="is_display_settings_on">
        <p class="modal_title">
          <font-awesome-icon icon="eye" />
          Display settings
        </p>
        <div class="display_checkboxes">
          <input type="checkbox" v-model="display.sample_description" name="sample_description" id="sample_description">
          <label for="sample_description">sample_description</label>
          <input type="checkbox" v-model="display.median" name="median" id="median">
          <label for="median">median</label>
          <input type="checkbox" v-model="display.sample_type" name="sample_type" id="sample_type">
          <label for="sample_type">sample_type</label>
          <input type="checkbox" v-model="display.experiment" name="experiment" id="experiment">
          <label for="experiment">experiment</label>
          <input type="checkbox" v-model="display.uberon" name="uberon" id="uberon">
          <label for="uberon">uberon</label>
          <input type="checkbox" v-model="display.cl" name="cl" id="cl">
          <label for="cl">cl</label>
          <input type="checkbox" v-model="display.sex" name="sex" id="sex">
          <label for="sex">sex</label>
          <input type="checkbox" v-model="display.age" name="age" id="age">
          <label for="age">age</label>
          <input type="checkbox" v-model="display.stage" name="stage" id="stage">
          <label for="stage">stage</label>
          <input type="checkbox" v-model="display.ncit" name="ncit" id="ncit">
          <label for="ncit">ncit</label>
        </div>
      </div>
    </div>
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
      },
      display: {
        'sample_description': true,
        'median': true,
        'sample_type': true,
        'experiment': false,
        'uberon': true,
        'cl': false,
        'sex': false,
        'age': false,
        'stage': false,
        'ncit': false,
      },
      is_display_settings_on: false
    }
  },
  mounted() {},
  methods: {
    switchSort(col_name) {
      if(this.sort.active === col_name){
        this.sort.order = this.sort.order === 'up' ? 'down' : 'up';
      } else {
        this.sort.active = col_name;
        this.sort.order = 'up';
      }
      const that = this;
      this.results.r_inf = this.results.r_inf.sort(function (a, b) {
        switch (that.sort.order) {
          case 'up':
            if (a[that.sort.active] < b[that.sort.active]) {
              return -1;
            } else if (a[that.sort.active] > b[that.sort.active]){
              return 1;
            } else {
              return 0;
            }
            break;
          case 'down':
            if (a[that.sort.active] > b[that.sort.active]) {
              return -1;
            } else if (a[that.sort.active] < b[that.sort.active]){
              return 1;
            } else {
              return 0;
            }
            break;
        }
      });
    },
    SearchByText(col_name) {

    },
    closeModal() {}
  }
};
</script>

<style lang="sass">
.chart_wrapper
  max-width: 1200px
  margin: 0 auto
  > .header
    display: flex
    align-items: center
    > h1
      display: flex
      align-items: center
      > .fa-info-circle
        color: $MAIN_COLOR
        font-size: 24px
        margin-right: 6px
        margin-top: -3px
    > button.comparison_btn
      +button
      margin-left: 20px
  > .display_settings
    color: $MAIN_COLOR
    text-decoration: underline
    display: block
    text-align: right
  > table
    +table
    > thead > tr > th:nth-of-type(1),
    > tbody > tr > td:nth-of-type(1)
      text-align: left
    > thead > tr > th
      white-space: nowrap
      > svg
        &:hover
          cursor: pointer
      > .fa-search
        color: $MAIN_COLOR
        font-size: 12px
      > .fa-sort
        color: $GRAY
        opacity: .3
      > .fa-sort-up,
      > .fa-sort-down
        color: $MAIN_COLOR
  > .modal_bg
    display: flex
    align-items: center
    justify-content: center
    width: 100vw
    height: 100vh
    background-color: $BLACK
    opacity: .2
    > .display_settings_modal
      padding: 55px 67px
</style>
