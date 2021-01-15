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
    <a class="display_settings" @click="is_display_settings_on = true">
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
              :class="filter_modal_text['Description'] ? 'active' : ''"
              @click="openFilterModal('Sample Description')"
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
              :class="filter_modal_text['Median'] ? 'active' : ''"
              @click="openFilterModal('MEDIAN [LOG2(TPM+1)]')"
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
              :class="filter_modal_text['Sample types category'] ? 'active' : ''"
              @click="openFilterModal('Sample type')"
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
              :class="filter_modal_text['Experiments category'] ? 'active' : ''"
              @click="openFilterModal('Experiment')"
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
              :class="filter_modal_text['UBERON label'] ? 'active' : ''"
              @click="openFilterModal('UBERON')"
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
              :class="filter_modal_text['CL label'] ? 'active' : ''"
              @click="openFilterModal('CL')"
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
              :class="filter_modal_text['Sex'] ? 'active' : ''"
              @click="openFilterModal('Sex')"
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
              :class="filter_modal_text['Age'] ? 'active' : ''"
              @click="openFilterModal('Age')"
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
              :class="filter_modal_text['Developmental stage'] ? 'active' : ''"
              @click="openFilterModal('Stage')"
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
              :class="filter_modal_text['NCIT label'] ? 'active' : ''"
              @click="openFilterModal('NCIT')"
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
    <div class="modal_bg" v-if="is_display_settings_on || is_filter_modal_on" @click="closeModal"></div>
    <div class="modal display_settings_modal" v-if="is_display_settings_on">
      <p class="modal_title">
        <font-awesome-icon icon="eye" />
        Display settings
      </p>
      <div class="display_checkboxes">
        <div>
          <input type="checkbox" v-model="display.sample_description" name="sample_description" id="sample_description">
          <label for="sample_description">Sample Description</label>
        </div>
        <div>
          <input type="checkbox" v-model="display.median" name="median" id="median">
          <label for="median">MEDIAN [LOG2(TPM+1)]</label>
        </div>
        <div>
          <input type="checkbox" v-model="display.sample_type" name="sample_type" id="sample_type">
          <label for="sample_type">Sample type</label>
        </div>
        <div>
          <input type="checkbox" v-model="display.experiment" name="experiment" id="experiment">
          <label for="experiment">Experiment</label>
        </div>
        <div>
          <input type="checkbox" v-model="display.uberon" name="uberon" id="uberon">
          <label for="uberon">UBERON</label>
        </div>
        <div>
          <input type="checkbox" v-model="display.cl" name="cl" id="cl">
          <label for="cl">CL</label>
        </div>
        <div>
          <input type="checkbox" v-model="display.sex" name="sex" id="sex">
          <label for="sex">Sex</label>
        </div>
        <div>
          <input type="checkbox" v-model="display.age" name="age" id="age">
          <label for="age">Age</label>
        </div>
        <div>
          <input type="checkbox" v-model="display.stage" name="stage" id="stage">
          <label for="stage">Stage</label>
        </div>
        <div>
          <input type="checkbox" v-model="display.ncit" name="ncit" id="ncit">
          <label for="ncit">NCIT</label>
        </div>
      </div>
    </div>
    <div class="modal filter_modal" v-if="is_filter_modal_on">
      <p class="modal_title">
        <font-awesome-icon icon="search" />
        {{ filter_modal_title }}
      </p>
      <div class="input_wrapper" v-if="filter_modal_title === 'MEDIAN [LOG2(TPM+1)]' || filter_modal_title === 'Age'">
        <vue-slider ref="slider" v-model="value[label_mapping[filter_modal_title]]" v-bind="options[label_mapping[filter_modal_title]]" :marks="marks[label_mapping[filter_modal_title]]"></vue-slider>
      </div>
      <div class="input_wrapper" v-else>
        <input type="text" v-model="filter_modal_text[label_mapping[filter_modal_title]]" placeholder="filter by text" @keyup.enter="filterByText">
        <button class="search" @click="filterByText">
          <font-awesome-icon icon="search" />
          Search
        </button>
      </div>
    </div>
  </div>

</template>

<script>
import $ from "jquery";
import * as d3 from "d3";
import axios from "axios";
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'

export default {
  async asyncData({ params, error, payload }) {
    let data = await axios.get(
      `http://refex2-api.bhx.jp/api/dist/${params.gid}`
    );
    // default: Median sort
    data.data.r_inf.sort(function(a,b) {
      return b.Median - a.Median;
    });
    let median_array = []
    let age_array = []
    data.data.r_inf.forEach(datam => {
      median_array.push(datam.Median)
      if(datam.Age.indexOf('-') !== -1) {
        datam.Age = datam.Age.replace(/[^0-9]/g, ',')
      }

      if(datam.Age.indexOf(',') !== -1) {
        age_array = age_array.concat(datam.Age.split(','))
      } else {
        age_array.push(Number(datam.Age))
      }
    })
    let age_max = Math.max(...age_array)
    let median_max = Math.max(...median_array)

    let original_r_inf = [...data.data.r_inf]
    return {
      results: data.data,
      original_r_inf: original_r_inf,
      age_max: age_max,
      median_max: median_max
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
      is_display_settings_on: false,
      is_filter_modal_on: false,
      filter_state: {
        'sample_description': '',
        'median': '',
        'sample_type': '',
        'experiment': '',
        'uberon': '',
        'cl': '',
        'sex': '',
        'age': '',
        'stage': '',
        'ncit': '',
      },
      filter_modal_title: '',
      filter_modal_text: {
        'Sample Description': '',
        'MEDIAN [LOG2(TPM+1)]': '',
        'Sample type': '',
        'Experiment': '',
        'UBERON': '',
        'CL': '',
        'Sex': '',
        'Age': '',
        'Stage': '',
        'NCIT': ''
      },
      label_mapping: {
        'Sample Description': 'Description',
        'MEDIAN [LOG2(TPM+1)]': 'Median',
        'Sample type': 'Sample types category',
        'Experiment': 'Experiments category',
        'UBERON': 'UBERON label',
        'CL': 'CL label',
        'Sex': 'Sex',
        'Age': 'Age',
        'Stage': 'Developmental stage',
        'NCIT': 'NCIT label'
      },
      value: {
        Median: [0, 0],
        Age: [0, 0]
      },
      options: {
        Median: {
          min: 0,
          max: 0
        },
        Age: {
          min: 0,
          max: 0
        }
      },
      marks: {
        Median: [],
        Age: []
      },
    }
  },
  watch: {
    value: {
      handler: function(val) {
        console.log(val[this.label_mapping[this.filter_modal_title]])
      },
      deep: true
    }
  },
  mounted() {
    this.value.Age[1] = Math.ceil(this.age_max / 10) * 10
    this.options.Age.max = Math.ceil(this.age_max / 10) * 10
    this.value.Median[1] = Math.ceil(this.median_max / 10) * 10
    this.options.Median.max = Math.ceil(this.median_max / 10) * 10
    for(let i = 0; i < this.options.Age.max; i += 10) {
      this.marks.Age.push(i)
    }
    for(let i = 0; i < this.options.Median.max; i += 200) {
      this.marks.Median.push(i)
    }
  },
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
    openFilterModal(col_name) {
      this.is_filter_modal_on = true
      this.filter_modal_title = col_name
    },
    closeModal() {
      this.is_display_settings_on = false,
      this.is_filter_modal_on = false
    },
    filterByText() {
      let is_all_filter_clear = true
      let filtered_results = []
      filtered_results = this.original_r_inf.filter(result => {
        let flag = true
        Object.keys(this.filter_modal_text).forEach(col => {
          if(this.filter_modal_text[col] !== "") {
            is_all_filter_clear = false
            if(result[col].indexOf(this.filter_modal_text[col]) === -1) {
              flag = false
            }
          }
        })
        return flag
      })
      this.results.r_inf = filtered_results
      if(is_all_filter_clear) {
        this.results.r_inf = this.original_r_inf
      }
      this.is_filter_modal_on = false
    }
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
    margin-bottom: 5px
    &:hover
      cursor: pointer
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
        &.active
          color: $ACTIVE_COLOR
      > .fa-sort
        color: $GRAY
        opacity: .3
      > .fa-sort-up,
      > .fa-sort-down
        color: $MAIN_COLOR
  > .modal_bg
    width: 100vw
    height: 100vh
    background-color: $BLACK
    opacity: .2
    position: fixed
    top: 0
    left: 0
  > .modal
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    background-color: #ffffff
    padding: 55px 67px
    > p.modal_title
      font-size: 18px
    &.display_settings_modal
      width: 400px
      > .display_checkboxes
        width: 100%
        > div
          width: 49%
          display: inline-block
          line-height: 26px
          > label
            font-size: 14px
    &.filter_modal
      width: 500px
      > .input_wrapper
        display: flex
        align-items: center
        > input[type="text"]
          +text_input
        > button
          +button
          margin-left: 15px
        > .vue-slider
          width: 100% !important
          margin-top: 25px
          > .vue-slider-rail
            background-color: $MAIN_COLOR_PALE
            > .vue-slider-process
              background-color: $MAIN_COLOR
</style>
