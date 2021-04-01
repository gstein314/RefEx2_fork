<template>
  <div class="chart_wrapper">
    <div class="header">
      <div class="header_title">
        <h1>
          <font-awesome-icon icon="info-circle" @click="showGeneDetail(results.ginf.id)"/>
          <span class="title">
            {{ `${results.ginf.symbol}` }}
            <span class="metadata">{{`(${results.ginf.name}, NCBI GeneID: ${results.ginf.id})`}}</span>
          </span>
        </h1>
        <button class="comparison_btn" @click="is_compare_on = true">
          <font-awesome-icon icon="chart-bar" />
          Comparison
        </button>
      </div>
      <ul class="gene_box_list">
        <li :class="['gene_box', 'gene_1', {active: sort.active === 'log2_Median'}]" @click="switchSort('log2_Median', 'down')">
          <font-awesome-icon class="info" icon="info-circle" @click="showGeneDetail(results.ginf.id)"/>
          {{ results.ginf.symbol }}
          <font-awesome-icon v-if="sort.active === 'log2_Median'" :icon="sort.order === 'down' ? 'sort-amount-down' : 'sort-amount-up-alt'" />
        </li>
        <li v-for="index in Number(gene_num) - 1" :key="index" :class="['gene_box', `gene_${index + 1}`, {active: sort.active === `log2_Median_compare_${index + 1}`}]" @click="switchSort(`log2_Median_compare_${index + 1}`, 'down')">
          <font-awesome-icon class="info" icon="info-circle" @click="showGeneDetail(compare_genes[index - 1].ginf.id)"/>
          {{ compare_genes[index - 1].ginf.symbol }}
          <font-awesome-icon v-if="sort.active === `log2_Median_compare_${index + 1}`" icon="sort-amount-down" />
        </li>
      </ul>
    </div>
    <div class="display_settings_wrapper">
      <a class="display_settings" @click="is_display_settings_on = true">
        <font-awesome-icon icon="eye" />
        Display settings
      </a>
    </div>
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
              :icon="sort.active.indexOf('log2_Median') !== -1 ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('log2_Median')"
            />
            <font-awesome-icon
              icon="search"
              :class="value.log2_Median[0] !== 0 || value.log2_Median[1] !== options.log2_Median.max ? 'active' : ''"
              @click="openFilterModal('MEDIAN [LOG2(TPM+1)]')"
            />
            <div class="median_scale">
              <ul>
                <li><span>2</span></li>
                <li><span>4</span></li>
                <li><span>6</span></li>
                <li><span>8</span></li>
                <li><span>10</span></li>
                <li><span>12</span></li>
                <li><span>14</span></li>
              </ul>
            </div>
          </th>
          <th class="sample_type" v-if="display.sample_type">
            <span>
              Sample type<br>
              <span class="small">(FANTOM5)</span>
            </span>
            <font-awesome-icon
              :icon="sort.active === 'Sample types category' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('Sample types category')"
            />
            <font-awesome-icon
              icon="search"
              :class="filter_modal_text['Sample types category'] ? 'active' : ''"
              @click="openFilterModal('Sample type', 'Sample type (FANTOM5)')"
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
            <span>
              Anatomical structures<br>
              <span class="small">(UBERON)</span>
            </span>
            <font-awesome-icon
              :icon="sort.active === 'UBERON label' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('UBERON label')"
            />
            <font-awesome-icon
              icon="search"
              :class="filter_modal_text['UBERON label'] ? 'active' : ''"
              @click="openFilterModal('UBERON', 'Anatomical structures (UBERON)')"
            />
          </th>
          <th class="cl" v-if="display.cl">
            <span>
              Cell types<br>
              <span class="small">(Cell Ontology)</span>
            </span>
            <font-awesome-icon
              :icon="sort.active === 'CL label' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('CL label')"
            />
            <font-awesome-icon
              icon="search"
              :class="filter_modal_text['CL label'] ? 'active' : ''"
              @click="openFilterModal('CL', 'Cell types (Cell Ontology)')"
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
              :class="value.Age[0] !== 0 || value.Age[1] !== options.Age.max ? 'active' : ''"
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
            Biomedical concepts<br>
            <span class="small">(NCI Thesaurus: NCIt)</span>
            <font-awesome-icon
              :icon="sort.active === 'NCIT label' ? `sort-${sort.order}` : 'sort'"
              @click="switchSort('NCIT label')"
            />
            <font-awesome-icon
              icon="search"
              :class="filter_modal_text['NCIT label'] ? 'active' : ''"
              @click="openFilterModal('NCIT', 'Biomedical concepts (NCI Thesaurus: NCIt)')"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in results.r_inf" :key="result.ncbiGeneId">
          <td v-if="display.sample_description" class="sample_description">{{ result["Description"] }}</td>
          <td v-if="display.median" class="median">
            <div v-if="gene_num === 1" class="bar_box">
              <div class="bar single_gene" :style="`width: ${result['log2_Median'] * 230 / 16}px;`"></div>
              <div class="tooltip">
                <span class="title">Expression(log2(TPM+1))</span>
                <span class="value single_gene gene_1 align_right">{{ result['log2_Median'].toFixed(2) }}</span>
              </div>
            </div>
            <div v-else>
              <div v-for="index in gene_num" :key="index" class="bar_box">
                <div v-if="index === 1" class="bar single_gene gene_1" :style="`width: ${result['log2_Median'] * 230 / 16}px;`"></div>
                <div v-else :class="['bar', 'single_gene', `gene_${index}`]" :style="`width: ${result[`log2_Median_compare_${index}`] * 230 / 16}px;`"></div>
                <div class="tooltip">
                  <span class="title">Expression(log2(TPM+1))</span>
                  <span v-for="index_2 in Number(gene_num)" :key="index_2" :class="['value', 'single_gene', `gene_${index_2}`]">
                    <template v-if="index_2 === 1">
                      <span class="symbol">{{ `${results.ginf.symbol}&nbsp;&nbsp;` }}</span>
                      <span class="align_right">{{ `${result['log2_Median'].toFixed(2)}` }}</span>
                    </template>
                    <template v-else>
                      <span class="symbol">{{ `${compare_genes[index_2 - 2].ginf.symbol}&nbsp;&nbsp;` }}</span>
                      <span class="align_right">{{ `${result[`log2_Median_compare_${index_2}`].toFixed(2)}` }}</span>
                    </template>
                  </span>
                </div>
              </div>
            </div>
          </td>
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
    <transition name="modal_bg">
      <div class="modal_bg" v-if="is_display_settings_on || is_filter_modal_on || is_gene_detail_modal_on || is_compare_on" @click="closeModal"></div>
    </transition>
    <transition name="modal">
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
            <label for="sample_type">Sample type (FANTOM5)</label>
          </div>
          <div>
            <input type="checkbox" v-model="display.experiment" name="experiment" id="experiment">
            <label for="experiment">Experiment</label>
          </div>
          <div>
            <input type="checkbox" v-model="display.uberon" name="uberon" id="uberon">
            <label for="uberon">Anatomical structures (UBERON)</label>
          </div>
          <div>
            <input type="checkbox" v-model="display.cl" name="cl" id="cl">
            <label for="cl">Cell types (Cell Ontology)</label>
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
            <label for="ncit">Biomedical concepts (NCI Thesaurus: NCIt)</label>
          </div>
        </div>
      </div>
    </transition>
    <transition name="modal">
      <div class="modal filter_modal" v-if="is_filter_modal_on">
        <p class="modal_title">
          <font-awesome-icon icon="search" />
          {{ filter_modal_label }}
        </p>
        <button v-if="filter_modal_title === 'MEDIAN [LOG2(TPM+1)]' || filter_modal_title === 'Age'" @click="resetSlider(filter_modal_title)">Reset</button>
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
    </transition>
    <transition name="modal">
      <GeneDetailModal v-if="is_gene_detail_modal_on" :props="{gene_id: gene_id_for_detail_modal}"/>
    </transition>
    <transition name="modal">
      <div class="modal compare_modal" v-if="is_compare_on">
        <p class="modal_title">
          <font-awesome-icon icon="search" />
          Compare with comma separated ID list
        </p>
        <div class="sample">
          <span class="ex">e.g.&nbsp;</span>
          <span
            class="sample_value"
            @click="gene_ids_to_compare = '5460,6657,9314,4609'; comparisonSearch()">Yamanaka Factors (OCT3/4, SOX2, KLF4 and C-MYC-OSKM)</span>
        </div>
        <div>
          <input type="text" v-model="gene_ids_to_compare" @keydown.enter="comparisonSearch"/>
          <button @click="comparisonSearch">
            <font-awesome-icon icon="search" />
            Search
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import 'vue-slider-component/dist-css/vue-slider-component.css'
import GeneDetailModal from "~/components/GeneDetailModal.vue"

export default {
  async asyncData({ error, payload, query }) {
    let gene_num = 1
    if(query.gid) {
      if(query.gid.match(/,/g)) {
        gene_num = query.gid.match(/,/g).length + 1
      }
      let gid = ''
      if(gene_num === 1) {
        gid = query.gid
      } else {
        gid = query.gid.split(',').splice(0, 1)[0]
      }
      let data = await axios.get(
        `http://refex2-api.bhx.jp/api/dist/${gid}`
      );

      let median_array = []
      let age_array = []
      let age_max
      let median_max
      let original_r_inf

      // default: Median sort
      data.data.r_inf.sort(function(a,b) {
        return b.log2_Median - a.log2_Median;
      });
      data.data.r_inf.forEach(datam => {
        median_array.push(datam.log2_Median)
        if(datam.Age.indexOf('-') !== -1) {
          datam.Age = datam.Age.replace(/[^0-9]/g, ',')
        }

        if(datam.Age.indexOf(',') !== -1) {
          age_array = age_array.concat(datam.Age.split(','))
        } else {
          age_array.push(Number(datam.Age))
        }
      })

      age_max = Math.max(...age_array)
      median_max = Math.max(...median_array)
      original_r_inf = [...data.data.r_inf]

      let compare_genes = []
      let gid_array = query.gid.split(',')
      gid_array.splice(0, 1)
      let compare_results = await Promise.all(gid_array.map(id => axios.get(`http://refex2-api.bhx.jp/api/dist/${id}`)))
      compare_results.forEach((gene, index) => {
        compare_genes.push(gene.data)
        gene.data.r_inf.forEach((datam, index_2) => {
          data.data.r_inf[index_2][`log2_Median_compare_${index + 2}`] = datam.log2_Median
        })
      })

      return {
        results: data.data,
        gene_num: gene_num,
        original_r_inf: original_r_inf,
        age_max: age_max,
        median_max: median_max,
        compare_genes: compare_genes
      };
    }
  },
  components: {
    GeneDetailModal
  },
  data() {
    return {
      sort: {
        active: 'log2_Median',
        order: 'down'
      },
      display: {
        'sample_description': true,
        'median': true,
        'sample_type': true,
        'experiment': false,
        'uberon': true,
        'cl': true,
        'sex': false,
        'age': false,
        'stage': false,
        'ncit': true,
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
      filter_modal_label: '',
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
        'MEDIAN [LOG2(TPM+1)]': 'log2_Median',
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
        log2_Median: [0, 0],
        Age: [0, 0]
      },
      options: {
        log2_Median: {
          min: 0,
          max: 0
        },
        Age: {
          min: 0,
          max: 0
        }
      },
      marks: {
        log2_Median: [],
        Age: []
      },
      gene_id_for_detail_modal: 0,
      is_gene_detail_modal_on: false,
      gene_ids_to_compare: "",
      is_compare_on: false
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.$forceUpdate()
  },
  watch: {
    value: {
      handler: function(val) {
        let filtered_results = []
        const filter_range = val[this.label_mapping[this.filter_modal_title]]
        switch (this.filter_modal_title) {
          case 'Age':
            filtered_results = this.original_r_inf.filter(result => {
              let flag = false
              let age = this.normalizeAge(result.Age)
              switch(typeof age) {
                case 'number':
                  if(filter_range[0] <= age && filter_range[1] >= age) {
                    flag = true
                  }
                  break;
                case 'object':
                  if(filter_range[0] <= age[0] && filter_range[1] >= age[age.length - 1]) {
                    flag = true
                  }
                  break;
              }
              return flag
            })
            break;
          case 'MEDIAN [LOG2(TPM+1)]':
            filtered_results = this.original_r_inf.filter(result => {
              let flag = false
              if(filter_range[0] <= result.log2_Median && filter_range[1] >= result.log2_Median) {
                flag = true
              }
              return flag;
            })
            break;
        }

        this.results.r_inf = filtered_results
      },
      deep: true
    }
  },
  // created() {
  //   if(this.$route.query.gid.match(/,/g)) {
  //     this.fetchCompareData()
  //   }
  // },
  mounted() {
    this.value.Age[1] = Math.ceil(this.age_max / 10) * 10
    this.options.Age.max = Math.ceil(this.age_max / 10) * 10
    this.value.log2_Median[1] = Math.ceil(this.median_max / 10) * 10
    this.options.log2_Median.max = Math.ceil(this.median_max / 10) * 10
    for(let i = 0; i < this.options.Age.max; i += 10) {
      this.marks.Age.push(i)
    }
    for(let i = 0; i < this.options.log2_Median.max; i += 200) {
      this.marks.log2_Median.push(i)
    }
  },
  methods: {
    async fetchCompareData() {
      let gid_array = this.$route.query.gid.split(',')
      gid_array.splice(0, 1)
      let compare_results = await Promise.all(gid_array.map(id => axios.get(`http://refex2-api.bhx.jp/api/dist/${id}`)))
      this.results.r_inf.forEach(result => {
        compare_results.forEach((gene, index) => {
          gene.data.r_inf.forEach(datam => {
            result[`log2_Median_compare_${index + 2}`] = datam.log2_Median
          })
        })
      })
    },
    showGeneDetail(id) {
      this.gene_id_for_detail_modal = id
      this.is_gene_detail_modal_on = true
    },
    resetSlider(type) {
      switch(type) {
        case 'MEDIAN [LOG2(TPM+1)]' :
          this.value.log2_Median = [0, this.options.log2_Median.max]
          break;
        case 'Age':
          this.value.Age = [0, this.options.Age.max]
          break;
      }
    },
    normalizeAge(age) {
      let normalized_age
      if(age.indexOf('-') !== -1) {
        age = age.replace(/[^0-9]/g, ',')
      }

      if(age.indexOf(',') !== -1) {
        normalized_age = []
        normalized_age = normalized_age.concat(age.split(','))
        normalized_age = normalized_age.map(num => Number(num))
      } else {
        normalized_age = Number(age)
      }
      return normalized_age
    },
    switchSort(col_name, order) {
      if(this.sort.active === col_name){
        this.sort.order = this.sort.order === 'up' ? 'down' : 'up';
      } else {
        this.sort.active = col_name;
        this.sort.order = 'up';
      }
      if(order) {this.sort.order = order}
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
    openFilterModal(col_name, label) {
      this.is_filter_modal_on = true
      this.filter_modal_label = label ? label : col_name
      this.filter_modal_title = col_name
    },
    closeModal() {
      this.is_display_settings_on = false,
      this.is_filter_modal_on = false,
      this.is_gene_detail_modal_on = false,
      this.is_compare_on = false
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
      // this.is_filter_modal_on = false
    },
    comparisonSearch() {
      if(this.comparisonSearch === "") return;
      location.href = `${location.origin}${location.pathname}?gid=${this.gene_ids_to_compare}`
    }
  }
};
</script>

<style lang="sass">
.chart_wrapper
  min-width: 600px
  padding: 0 90px
  > .header
    position: sticky
    top: 0
    background-color: #ffffff
    max-height: 122px
    overflow: hidden
    z-index: 1
    > .header_title
      margin: 15px 0
      display: flex
      align-items: flex-start
      > h1
        display: flex
        align-items: flex-start
        margin: 0
        > .fa-info-circle
          color: $MAIN_COLOR
          font-size: 24px
          margin-right: 6px
          margin-top: 4px
          &:hover
            cursor: pointer
        .metadata
          font-size: 20px
          display: block
          margin-top: -2px
          font-weight: normal
      > button.comparison_btn
        +button
        margin-left: 20px
    > .gene_box_list
      padding: 0
      margin: 0
      display: flex
      font-size: 16px
      > .gene_box
        width: 100px
        padding: 6px 0 0 0
        font-weight: 500
        margin-right: 10px
        border-top: 8px solid
        transition: width .3s
        &.active
          width: 200px
          font-weight: bold
        > svg
          font-size: 14px
          color: $MAIN_COLOR
        &:hover
          cursor: pointer
        &.gene_1
          border-color: $COLOR_1
        &.gene_2
          border-color: $COLOR_2
        &.gene_3
          border-color: $COLOR_3
        &.gene_4
          border-color: $COLOR_4
        &.gene_5
          border-color: $COLOR_5
        &.gene_6
          border-color: $COLOR_6
        &.gene_7
          border-color: $COLOR_7
        &.gene_8
          border-color: $COLOR_8
        &.gene_9
          border-color: $COLOR_9
        &.gene_10
          border-color: $COLOR_10
  > .display_settings_wrapper
    display: flex
    justify-content: flex-end
    position: sticky
    top: 119px
    background-color: #ffffff
    z-index: 1
    > .display_settings
      color: $MAIN_COLOR
      text-decoration: underline
      margin: 5px 0
      &:hover
        cursor: pointer
  > table
    +table
    > thead > tr > th:nth-of-type(1),
    > tbody > tr > td:nth-of-type(1)
      text-align: left
    > tbody
      > tr
        > td
          &.median
            width: 230px
            padding: 12px 20px 12px 10px
            .bar_box
              display: block
              height: 20px
              position: relative
              border-left: 1px solid $BLACK
              > .bar
                width: 100%
                height: 2px
                background-color: rgba(112, 112, 112, .4)
                position: relative
                transform: translateY(10px)
                &:after
                  content: ''
                  width: 10px
                  height: 10px
                  border-radius: 50%
                  position: absolute
                  top: 50%
                  right: -5px
                  transform: translateY(-50%)
                  background-color: $COLOR_1
              > .tooltip
                display: none
                background-color: #ffffff
                padding: 3px 8px
                border: 1px solid $MAIN_COLOR
                border-radius: 3px
                box-shadow: 0 1px 4px rgba(62, 70, 82, .22)
                position: absolute
                left: calc(100% + 10px)
                top: 0
                z-index: $TOOLTIP_LAYER
                > span
                  display: block
                  white-space: nowrap
                  &.title
                    font-size: 10px
                  &.value
                    font-weight: bold
                    position: relative
                    padding-left: 12px
                    line-height: 20px
                    display: flex
                    &:after
                      content: ''
                      width: 10px
                      height: 10px
                      border-radius: 100px
                      position: absolute
                      left: 0
                      top: 50%
                      transform: translateY(-50%)
                span.align_right
                  text-align: right
                  width: 100%
                  margin-left: 10px
              &:hover
                > .tooltip
                  display: block
                  z-index: 100
    > thead > tr > th
      white-space: nowrap
      top: 147px
      &.median
        padding-right: 20px
        > .median_scale
          width: 230px
          > ul
            display: flex
            margin: 12px 0 0 0
            padding: 0
            font-size: 10px
            font-weight: 500
            border-bottom: 1px solid $BLACK
            border-left: 1px solid $BLACK
            border-right: 1px solid $BLACK
            padding-bottom: 5px
            height: 5px
            box-sizing: border-box
            position: relative
            &:before,
            &:after
              position: absolute
            &:before
              content: '0'
              bottom: 100%
              left: -3px
            &:after
              content: '16'
              bottom: 100%
              right: -6px
            > li
              width: 1px
              height: 5px
              background-color: $BLACK
              position: absolute
              > span
                position: absolute
                bottom: 100%
                left: 50%
                transform: translateX(-50%)
            @for $i from 0 through 6
              li:nth-child(#{$i + 1})
                left: #{($i + 1) * 28.75}px
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
    +modal_bg
  .modal
    +modal
    > p.modal_title
      font-size: 18px
      display: inline-block
    > button
      +button
      display: inline-block
      margin-left: 10px
    &.display_settings_modal
      width: 400px
      > .display_checkboxes
        column-count: 2
        > div
          width: 100%
          display: inline-block
          line-height: 26px
          > label
            font-size: 14px
    &.compare_modal
      > div
        display: flex
        align-items: center
        &.sample
          margin-bottom: 8px
          > span
            @include sample_query
        > input
          +text_input
        > button
          +button
          margin-left: 10px
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
  .single_gene
    &.gene_1
      &:after
        background-color: $COLOR_1 !important
    &.gene_2
      &:after
        background-color: $COLOR_2 !important
    &.gene_3
      &:after
        background-color: $COLOR_3 !important
    &.gene_4
      &:after
        background-color: $COLOR_4 !important
    &.gene_5
      &:after
        background-color: $COLOR_5 !important
    &.gene_6
      &:after
        background-color: $COLOR_6 !important
    &.gene_7
      &:after
        background-color: $COLOR_7 !important
    &.gene_8
      &:after
        background-color: $COLOR_8 !important
    &.gene_9
      &:after
        background-color: $COLOR_9 !important
    &.gene_10
      &:after
        background-color: $COLOR_10 !important

// transition
.modal-enter,
.modal-leave-to
  opacity: 0
  margin-top: -20px

.modal-enter-active,
.modal-leave-active
  transition: opacity 0.4s, margin-top 0.4s

.modal_bg-enter,
.modal_bg-leave-to
  opacity: 0

.modal_bg-enter-active,
.modal_bg-leave-active
  transition: opacity 0.4s


</style>
