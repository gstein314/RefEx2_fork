<template>
  <div>
    <h3>Filter by {{ screenerFilter.description }}</h3>
    <client-only>
      <div :class="screenerFilter.className">
        <table ref="itemList" class="item-list">
          <tr>
            <td class="check">
              <input
                v-model="isAllChecked"
                type="checkbox"
                :checked="isAllChecked"
                @click="dispatchAction('CHECK_ALL')"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.id"
              :class="column.className"
            >
              {{ column.name }}
              <template
                v-if="column.className === 'sample' && !allSampleIsSelected"
              >
                <WarningMessage>Please select from suggestions</WarningMessage>
              </template>
              <a v-if="isEntropy(column.className)" href="javascript:void(0)">
                <font-awesome-icon icon="info-circle" />
              </a>
            </td>
            <td
              colspan="2"
              class="delete_all"
              :class="{ disabled: deleteDisabled }"
              @click="dispatchAction('DEL_ALL')"
            >
              <font-awesome-icon icon="trash" />
              Delete All
            </td>
          </tr>
          <tr
            v-for="(item, itemIndex) in screenerFilter.list"
            :key="itemIndex"
            ref="listItem"
            class="list-item"
            :class="{ unchecked: !item.isChecked }"
          >
            <td class="check">
              <input
                v-model="item.isChecked"
                type="checkbox"
                @click="dispatchAction('CHECK', itemIndex)"
              />
            </td>
            <td v-for="column in columns" :key="column.id">
              <select
                v-if="column.inputType === 'dropdown'"
                v-model="item[column.className]"
                required
                :disabled="!item.isChecked"
                @change="
                  dispatchAction('ADD', itemIndex, item[column.className])
                "
              >
                <option value="" disabled selected hidden>
                  {{ column.placeholder }}
                </option>
                <template v-if="column.className === 'group'">
                  <option
                    v-for="option in groupOptions"
                    :key="option.id"
                    :value="option.label"
                  >
                    {{ option.label }}
                  </option>
                </template>
                <template v-else>
                  <option
                    v-for="(option, optionIndex) of column.options"
                    :key="optionIndex"
                    :value="option.value"
                  >
                    {{ option.description }}
                  </option>
                </template>
              </select>
              <vue-simple-suggest
                v-else-if="column.className === 'sample'"
                ref="sampleInputs"
                v-model.trim="item[column.className]"
                display-attribute="description"
                value-attribute="id"
                :list="
                  autocompleteItems(
                    item[column.className],
                    filter.list[itemIndex].group
                  )
                "
                :debounce="500"
                :min-length="0"
                :max-suggestions="10"
                :placeholder="column.placeholder"
                class="text_search_name"
                @input="
                  () => {
                    dispatchAction('ADD', itemIndex, item[column.className]);
                    tempFunction();
                    setSelectedTrue(itemIndex);
                  }
                "
                @focus="refreshSuggestions"
                @blur="refreshSuggestions2"
                @request-start="refreshSuggestions3"
              >
                <!-- plugin uses slot-scope as a prop variable. {suggestion} turns into an object at the plugin-->
                <!-- eslint-disable vue/no-unused-vars -->
                <!-- eslint-disable vue/no-v-html -->
                <div slot="suggestion-item" slot-scope="{ suggestion }">
                  <span
                    v-html="
                      $highlightedSuggestion(
                        suggestion.description,
                        item[column.className],
                        2
                      )
                    "
                  ></span>
                </div>
              </vue-simple-suggest>
              <input
                v-else
                v-model.trim="item[column.className]"
                :type="column.inputType"
                :placeholder="column.placeholder"
                :min="column.min"
                :max="column.max"
                :disabled="!item.isChecked"
                @input="
                  dispatchAction('ADD', itemIndex, item[column.className])
                "
              />
            </td>
            <td class="icon">
              <button
                class="delete_btn"
                :class="{ disabled: !item.canDelete }"
                :disabled="isDisable(item)"
                @click="dispatchAction('DEL', itemIndex)"
              >
                <font-awesome-icon icon="trash" />
                Delete
              </button>
            </td>
          </tr>
        </table>
      </div>
      <!-- <vue-simple-suggest
        ref="testElement1"
        v-model.trim="testField1"
        display-attribute="id"
        value-attribute="id"
        :list="[{ id: 'a' }, { id: 'b' }, { id: 'c' }]"
        :debounce="500"
        :min-length="0"
        :max-suggestions="10"
        class="text_search_name"
      >
      </vue-simple-suggest>
      <button @click="clearField(1)">clear</button>
      <vue-simple-suggest
        ref="testElement2"
        v-model.trim="testField2"
        display-attribute="id"
        value-attribute="id"
        :list="[{ id: 'a' }, { id: 'b' }, { id: 'c' }]"
        :debounce="500"
        :min-length="0"
        :max-suggestions="10"
        class="text_search_name"
        @click="clearField"
      >
      </vue-simple-suggest>
      <button @click="clearField(2)">clear</button>
      <vue-simple-suggest
        ref="testElement3"
        v-model.trim="testField3"
        display-attribute="id"
        value-attribute="id"
        :list="[{ id: 'a' }, { id: 'b' }, { id: 'c' }]"
        :debounce="500"
        :min-length="0"
        :max-suggestions="10"
        class="text_search_name"
      >
      </vue-simple-suggest>
      <button @click="clearField(3)">clear</button> -->
    </client-only>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import VueSimpleSuggest from 'vue-simple-suggest';
  import datasets from '~/refex-sample/datasets.json';
  import WarningMessage from '../WarningMessage.vue';
  import _ from 'lodash';
  export default {
    components: {
      VueSimpleSuggest,
      WarningMessage,
    },
    props: {
      filter: {
        type: Object,
        default: () => {},
      },
      columns: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        isAllChecked: true,
        datasets,
        parameters: {
          text: '',
        },
        allSampleIsSelected: true,
        sampleSelectedArray: [],
        screenerFilter: this.filter,
        testField1: '',
        testField2: '',
        testField3: '',
        testList: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      };
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
      }),
      groupOptions() {
        const target = this.activeDataset.dataset;
        if (target === 'humanFantom5') {
          return this.datasets[0].datasets[0].specificity;
        } else if (target === 'gtexV8') {
          return this.datasets[0].datasets[1].specificity;
        } else if (target === 'mouseFantom5') {
          return [{ label: 'Group 1' }, { label: 'Group 2' }];
          // お客さんの指定があり次第ハードコートから下記のコートに変更
          // return this.datasets[1].datasets[0].specificity;
        } else return [{ label: 'No useable option found' }];
      },
      deleteDisabled() {
        const list = this.screenerFilter.list;
        const firstItem = list[0];
        const defaultItem = { ...this.screenerFilter.defaultItem };
        defaultItem.canDelete = false;
        if (_.isEqual(firstItem, defaultItem) && list.length === 1) {
          return true;
        }
        return false;
      },
      // selectedSample() {
      //   return this.$refs.sampleInputs?.map(input => input.selected);
      // },
      // isSelected() {
      //   let status = false;
      //   const sampleInputs = this.$refs.sampleInput;
      //   if (sampleInputs) {
      //     for (let [i, input] of sampleInputs.entries()) {
      //       if (i === sampleInputs.length - 1) {
      //         continue;
      //       }
      //       console.log(input.selected);
      //       status = input.selected !== null ? true : false;
      //     }
      //   }
      //   return status;
      // },
    },
    watch: {
      screenerFilter: {
        handler(newVal, oldVal) {
          // console.log('watch changed');
        },
        deep: true,
      },
    },
    mounted() {
      this.dispatchAction('INIT');
    },
    // updated() {
    //   // console.log('input changed');
    //   const isSelectedUpToDate = this.$refs.sampleInputs?.map(
    //     sampleInput => sampleInput.isSelectedUpToDate
    //   );
    //   const falseIndexArray = [];
    //   if (isSelectedUpToDate !== undefined) {
    //     for (const [i, item] of isSelectedUpToDate.entries()) {
    //       if (item === false) {
    //         falseIndexArray.push(i);
    //       }
    //     }
    //   }
    //   console.log(isSelectedUpToDate);
    //   if (
    //     isSelectedUpToDate !== undefined &&
    //     isSelectedUpToDate.includes(false)
    //   ) {
    //     const indexArray = [];
    //     for (const [i, bool] of isSelectedUpToDate.entries()) {
    //       if (bool === false) indexArray.push(i);
    //     }
    //     const defaultItem = { ...this.screenerFilter.defaultItem };
    //     delete defaultItem.canDelete;
    //     for (const index of indexArray) {
    //       delete this.screenerFilter.list[index].canDelete;
    //       if (!_.isEqual(this.screenerFilter.list[index], defaultItem)) {
    //         this.allSampleIsSelected = false;
    //       }
    //     }
    //     this.allSampleIsSelected = true;
    //   } else this.allSampleIsSelected = true;
    // },
    methods: {
      refreshSuggestions() {
        console.log('focused');
        // this.$refs.sampleInputs[0].clearSuggestions();
        this.$refs.sampleInputs[0].getSuggestions('request-start');
        // this.$refs.sampleInputs[0].showSuggestions();
      },
      refreshSuggestions2() {
        console.log('blurred');
        // this.$refs.sampleInputs[0].clearSuggestions();
      },
      refreshSuggestions3() {
        console.log('refresh started');
        // this.$refs.sampleInputs[0].clearSuggestions();
      },
      isDisable(item) {
        return !item.canDelete;
      },
      isEntropy(className) {
        return ['emin', 'emax'].includes(className);
      },
      dispatchAction(action, index, value) {
        const list = this.screenerFilter.list;
        const targetItem = list[index];
        const defaultItem = { ...this.screenerFilter.defaultItem };
        switch (action) {
          case 'INIT':
            defaultItem.canDelete = false;
            list.push(defaultItem);
            break;
          case 'CHECK_ALL':
            this.isAllChecked = !this.isAllChecked;
            for (const item of list) {
              this.isAllChecked
                ? (item.isChecked = true)
                : (item.isChecked = false);
            }
            break;
          case 'CHECK':
            targetItem.isChecked = !targetItem.isChecked;
            break;
          case 'ADD':
            targetItem.canDelete = true;
            if (value.trim().length > 0) {
              if (!list[index + 1]) {
                list.push(defaultItem);
              }
            }
            break;
          case 'DEL':
            // list[index].sample = '';
            // this.$refs.listItem[index].$destroy();
            // console.log(
            //   this.$refs.listItem[index].parentNode.children[index + 1]
            // );
            // this.$refs.listItem[index].parentNode.removeChild(
            //   this.$refs.listItem[index].parentNode.children[index + 1]
            // );
            // this.$refs.sampleInputs[
            //   index
            // ].$el.parentNode.parentNode.parentNode.removeChild(
            //   this.$refs.sampleInputs[index].$el.parentNode.parentNode
            // );
            // this.$refs.sampleInputs[
            //   index
            // ].$el.parentNode.parentNode.removeChild(
            //   this.$refs.sampleInputs[index].$el.parentNode.children[index]
            // );
            const countOfShow = () => {
              let count = 0;
              for (const item of list) {
                if (item.isShow) {
                  count++;
                }
              }
              return count;
            };
            if (list.length === 1) {
              list.splice(0, list.length);
              defaultItem.canDelete = false;
              list.push(defaultItem);
            } else {
              list.splice(index, 1);
              // targetItem.isShow = false;
            }
            // console.log(this.$refs.sampleInputs);
            // this.$refs.sampleInputs[index].$destroy();
            break;
          case 'DEL_ALL':
            list.splice(0, list.length);
            defaultItem.canDelete = false;
            list.push(defaultItem);
            break;
        }
        const firstItem = list[0];
        if (_.isEqual(firstItem, defaultItem) && list.length === 1) {
          firstItem.canDelete = false;
        }
        this.isAllChecked = list.every(item => item.isChecked);
        // console.log(this.screenerFilter.list);
        // console.log(this.$refs.sampleInputs?.map(input => input.selected));
      },
      autocompleteItems(userInput, targetGroup) {
        const targetDataset = this.activeDataset.dataset;
        const samplesArray = targetDataset => {
          switch (targetDataset) {
            case 'humanFantom5':
              return targetGroup === 'Adult tissues'
                ? this.datasets[0].datasets[0].specificity[0].samples
                : targetGroup === 'Epithelial cells'
                ? this.datasets[0].datasets[0].specificity[1].samples
                : this.datasets[0].datasets[0].specificity[0].samples;
            case 'gtexV8':
              return targetGroup === 'All tissues'
                ? this.datasets[0].datasets[1].specificity[0].samples
                : targetGroup === 'Brain sub-regions'
                ? this.datasets[0].datasets[1].specificity[1].samples
                : this.datasets[0].datasets[1].specificity[0].samples;
            default:
              return [
                {
                  id: 'testId1',
                  description: 'Sample description 1',
                },
                {
                  id: 'testId2',
                  description: 'Sample description 2',
                },
              ];
          }
        };
        const copy = [...samplesArray(targetDataset)];
        const wordAndSpace = /[^\w\s]/g;
        const alphaNumInput = userInput.replace(wordAndSpace, '');
        const inputsArray = alphaNumInput.replace(/\s\s+/g, ' ').split(' ');

        return copy.filter(sample => {
          const alphaNumInput = sample.description.replace(wordAndSpace, '');

          for (const input of inputsArray) {
            return alphaNumInput.toLowerCase().indexOf(input.toLowerCase()) ===
              -1
              ? false
              : true;
          }
        });
      },
      tempFunction() {
        const isSelectedUpToDate = this.$refs.sampleInputs?.map(
          sampleInput => sampleInput.isSelectedUpToDate
        );
        const falseIndexArray = [];
        if (isSelectedUpToDate !== undefined) {
          for (const [i, item] of isSelectedUpToDate.entries()) {
            if (item === false) {
              falseIndexArray.push(i);
            }
          }
        }
        // console.log(isSelectedUpToDate);
        // if (
        //   isSelectedUpToDate !== undefined &&
        //   isSelectedUpToDate.includes(false)
        // ) {
        //   const indexArray = [];
        //   for (const [i, bool] of isSelectedUpToDate.entries()) {
        //     if (bool === false) indexArray.push(i);
        //   }
        //   const defaultItem = { ...this.screenerFilter.defaultItem };
        //   delete defaultItem.canDelete;
        //   const copy = [...this.screenerFilter.list];
        //   for (const index of indexArray) {
        //     delete copy[index].canDelete;
        //     if (!_.isEqual(copy[index], defaultItem)) {
        //       this.allSampleIsSelected = false;
        //     }
        //   }
        //   this.allSampleIsSelected = true;
        // } else this.allSampleIsSelected = true;
      },
      setSelectedTrue(index) {
        const list = this.screenerFilter.list;
        list[index].isSelected = true;
      },
      setSelectedFalse(index) {
        const list = this.screenerFilter.list;
        list[index].isSelected = false;
      },
      clearField(index) {
        this.$refs[`testElement${index}`].$destroy();
        this.$refs[`testElement${index}`].$el.parentNode.removeChild(
          this.$refs[`testElement${index}`].$el
        );
      },
    },
  };
</script>
