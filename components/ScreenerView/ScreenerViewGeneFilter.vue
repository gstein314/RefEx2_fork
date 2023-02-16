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
              v-for="filter in filters"
              :key="filter.id"
              :class="filter.className"
            >
              {{ filter.name }}
              <template
                v-if="filter.className === 'sample' && !allSampleIsSelected"
              >
                <WarningMessage>Please select from suggestions</WarningMessage>
              </template>
              <a v-if="isEntropy(filter.className)" href="javascript:void(0)">
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
            :class="{ unchecked: !item.check }"
          >
            <template v-if="item.isShow">
              <td class="check">
                <input
                  v-model="item.check"
                  type="checkbox"
                  @click="dispatchAction('CHECK', itemIndex)"
                />
              </td>
              <td v-for="filter in filters" :key="filter.id">
                <select
                  v-if="filter.inputType === 'dropdown'"
                  v-model="item[filter.className]"
                  required
                  :disabled="!item.check"
                  @change="
                    dispatchAction('ADD', itemIndex, item[filter.className])
                  "
                >
                  <option value="" disabled selected hidden>
                    {{ filter.placeholder }}
                  </option>
                  <template v-if="filter.className === 'group'">
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
                      v-for="(option, optionIndex) of filter.options"
                      :key="optionIndex"
                      :value="option.value"
                    >
                      {{ option.description }}
                    </option>
                  </template>
                </select>
                <vue-simple-suggest
                  v-else-if="filter.className === 'sample'"
                  ref="sampleInputs"
                  v-model.trim="item[filter.className]"
                  display-attribute="id"
                  value-attribute="description"
                  :list="autocompleteItems(item[filter.className])"
                  :debounce="500"
                  :min-length="0"
                  :max-suggestions="10"
                  class="text_search_name"
                  @input="
                    dispatchAction('ADD', itemIndex, item[filter.className])
                  "
                >
                  <!-- plugin uses slot-scope as a prop variable. {suggestion} turns into an object at the plugin-->
                  <!-- eslint-disable vue/no-unused-vars -->
                  <!-- eslint-disable vue/no-v-html -->
                  <div slot="suggestion-item" slot-scope="{ suggestion }">
                    <span
                      v-html="
                        $highlightedSuggestion(
                          suggestion.description,
                          item[filter.className],
                          2
                        )
                      "
                    ></span>
                  </div>
                </vue-simple-suggest>
                <input
                  v-else
                  v-model.trim="item[filter.className]"
                  :type="filter.inputType"
                  :placeholder="filter.placeholder"
                  :min="filter.min"
                  :max="filter.max"
                  :disabled="!item.check"
                  @input="
                    dispatchAction('ADD', itemIndex, item[filter.className])
                  "
                />
              </td>
              <td class="icon">
                <button
                  class="delete_btn"
                  :class="{ disabled: !item.delete }"
                  :disabled="isDisable(item)"
                  @click="
                    e => {
                      dispatchAction('DEL', itemIndex);
                      tempFunction(e, itemIndex);
                    }
                  "
                >
                  <font-awesome-icon icon="trash" />
                  Delete
                </button>
              </td>
            </template>
          </tr>
        </table>
      </div>
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
      screenerFilter: {
        type: Object,
        default: () => {},
      },
      filters: {
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
        defaultItem.delete = false;
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
          console.log('watch changed');
        },
        deep: true,
      },
    },
    mounted() {
      this.dispatchAction('INIT');
    },
    updated() {
      // console.log('input changed');
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
      console.log(isSelectedUpToDate);
      if (isSelectedUpToDate)
        this.sampleSelectedArray = [...isSelectedUpToDate];
      // if (falseIndexArray.length === 1 && falseIndexArray[0] === 0) {
      //   const deleteToFalseForComparison = () => {
      //     const copy = { ...this.screenerFilter.list[0] };
      //     copy.delete = true;
      //     return copy;
      //   };
      //   // console.log(deleteToFalseForComparison);
      //   this.allSampleIsSelected = _.isEqual(
      //     deleteToFalseForComparison(),
      //     this.screenerFilter.defaultItem
      //   );
      // } else {
      //   for (const i of falseIndexArray) {
      //     const isDefaultItem = _.isEqual(
      //       this.screenerFilter.list[i],
      //       this.screenerFilter.defaultItem
      //     );
      //     if (!isDefaultItem) this.allSampleIsSelected = false;
      //   }
      // }
    },
    methods: {
      isDisable(item) {
        return !item.delete;
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
            defaultItem.delete = false;
            list.push(defaultItem);
            break;
          case 'CHECK_ALL':
            this.isAllChecked = !this.isAllChecked;
            for (const item of list) {
              this.isAllChecked ? (item.check = true) : (item.check = false);
            }
            break;
          case 'CHECK':
            targetItem.check = !targetItem.check;
            break;
          case 'ADD':
            targetItem.delete = true;
            if (value.trim().length > 0) {
              if (!list[index + 1]) {
                list.push(defaultItem);
              }
            }
            break;
          case 'DEL':
            const countOfShow = () => {
              let count = 0;
              for (const item of list) {
                if (item.isShow) {
                  count++;
                }
              }
              return count;
            };
            if (countOfShow() === 1) {
              list.splice(0, list.length);
              defaultItem.delete = false;
              list.push(defaultItem);
            } else {
              // list.splice(index, 1);
              targetItem.isShow = false;
            }
            console.log(this.$refs.sampleInputs);
            // this.$refs.sampleInputs[index].$destroy();
            break;
          case 'DEL_ALL':
            list.splice(0, list.length);
            defaultItem.delete = false;
            list.push(defaultItem);
            break;
        }
        const firstItem = list[0];
        if (_.isEqual(firstItem, defaultItem) && list.length === 1) {
          firstItem.delete = false;
        }
        this.isAllChecked = list.every(item => item.check);
        // console.log(this.screenerFilter.list);
        // console.log(this.$refs.sampleInputs?.map(input => input.selected));
      },
      autocompleteItems(userInput) {
        const target = this.activeDataset.dataset;
        const samplesArray = target => {
          switch (target) {
            case 'humanFantom5':
              return this.datasets[0].datasets[0].specificity[0].samples;
            case 'gtexV8':
              return this.datasets[0].datasets[1].specificity[0].samples;
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
        const copy = [...samplesArray(target)];
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
      tempFunction(e, index) {
        // this.$refs.sampleInputs[index].$destroy();
        // const targetVueSimpleSuggestEl = this.$refs.sampleInputs[index];
        // targetVueSimpleSuggestEl.$parent.$children.splice(index, 1);
        // console.dir(targetVueSimpleSuggestEl);
        // this.$refs.sampleInputs[index].$destroy();
        // console.dir(index);
        // console.dir(this.$refs.itemList);
        // console.dir(this.$refs.listItem[0]);
        // this.$refs.itemList.removeChild(this.$refs.itemList.children[2]);
        // console.log(this.$refs.itemList.removeChild(this.$refs.listItem));
        // console.log(e.target.parentNode.parentNode.parentNode);
        // this.$destroy();
        // this.$el.parentNode.removeChild(this.$el);
      },
    },
  };
</script>
