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
                v-if="column.className === 'sample' && !isAllSampleSelected"
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
              :class="{ disabled: resetAllDisabled }"
              @click="dispatchAction('RESET')"
            >
              <font-awesome-icon icon="rotate-right" />
              Reset
            </td>
          </tr>
          <tr
            v-for="(item, itemIndex) in list"
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
                :styles="autoCompleteStyle(item)"
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
                :disabled="!item.isChecked"
                class="text_search_name"
                @select="setSelectedObject(itemIndex)"
                @input="
                  () => {
                    dispatchAction('ADD', itemIndex, item[column.className]);
                    clearSelectedObject(itemIndex);
                  }
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
                :class="{ disabled: isDisable(item) }"
                :disabled="isDisable(item)"
                @click="dispatchAction('DELETE', itemIndex)"
              >
                <font-awesome-icon icon="trash" />
                Delete
              </button>
            </td>
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
        screenerFilter: this.filter,
        list: this.filter.list,
        defaultItem: this.filter.defaultItem,
      };
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
      }),
      isCheckedSelectedArray() {
        const filteredList = this.list.filter(({ isChecked }) => isChecked);
        const isDefaultItem = item => _.isEqual(item, this.defaultItem);
        const isCheckedSelectedArray = this.list
          .filter(({ isChecked }) => isChecked)
          .map(({ isSampleSelected }) => isSampleSelected);
        for (const [i, item] of filteredList.entries()) {
          if (isDefaultItem(item) || !item.isChecked) {
            isCheckedSelectedArray[i] = true;
          }
        }
        return isCheckedSelectedArray;
      },
      isAllSampleSelected() {
        return this.isCheckedSelectedArray.every(Boolean);
      },
      groupOptions() {
        const target = this.activeDataset.dataset;
        switch (target) {
          case 'humanFantom5':
            return this.datasets[0].datasets[0].specificity;
          case 'gtexV8':
            return this.datasets[0].datasets[1].specificity;
          case 'mouseFantom5':
            return this.datasets[1].datasets[0].specificity;
          default:
            return [{ label: 'No useable option found' }];
        }
      },
      resetAllDisabled() {
        const firstItem = this.list[0];
        if (_.isEqual(firstItem, this.defaultItem) && this.list.length === 1) {
          return true;
        }
        return false;
      },
      getIsAllChecked() {
        return this.list.every(({ isChecked }) => isChecked);
      },
    },
    watch: {
      getIsAllChecked(newState) {
        this.isAllChecked = newState;
      },
    },
    mounted() {
      this.dispatchAction('INIT');
    },
    methods: {
      autoCompleteStyle(item) {
        const { isChecked, isSampleSelected } = item;
        const isDefaultItem = _.isEqual(item, this.defaultItem);
        if (isChecked && !isSampleSelected && !isDefaultItem)
          return { defaultInput: 'warning' };
      },
      isDisable(item) {
        return this.list.length <= 1;
      },
      isEntropy(className) {
        return ['emin', 'emax'].includes(className);
      },
      dispatchAction(action, index, value) {
        const targetItem = this.list[index];
        const defaultItemCopy = { ...this.defaultItem };
        switch (action) {
          case 'INIT':
            this.list.push(defaultItemCopy);
            break;
          case 'CHECK_ALL':
            this.isAllChecked = !this.isAllChecked;
            for (const item of this.list) {
              item.isChecked = this.isAllChecked ? true : false;
            }
            break;
          case 'CHECK':
            targetItem.isChecked = !targetItem.isChecked;
            break;
          case 'ADD':
            if (value.trim().length > 0) {
              if (!this.list[index + 1]) {
                this.list.push(defaultItemCopy);
              }
            }
            break;
          case 'DELETE':
            if (this.list.length === 1) {
              this.list.splice(0, this.list.length);
              this.list.push(defaultItemCopy);
            } else {
              this.$delete(this.list, index);
            }
            break;
          case 'RESET':
            this.list.splice(0, this.list.length);
            this.list.push(defaultItemCopy);
            break;
        }
      },
      autocompleteItems(userInput, targetGroup) {
        const targetDataset = this.activeDataset.dataset;
        const humanFantom5Dataset = this.datasets[0].datasets[0];
        const gtexV8Dataset = this.datasets[0].datasets[1];
        const samplesArray = targetDataset => {
          switch (targetDataset) {
            case 'humanFantom5':
              return targetGroup === 'Adult tissues'
                ? humanFantom5Dataset.specificity[0].samples
                : targetGroup === 'Epithelial cells'
                ? humanFantom5Dataset.specificity[1].samples
                : humanFantom5Dataset.specificity[0].samples;
            case 'gtexV8':
              return targetGroup === 'All tissues'
                ? gtexV8Dataset.specificity[0].samples
                : targetGroup === 'Brain sub-regions'
                ? gtexV8Dataset.specificity[1].samples
                : gtexV8Dataset.specificity[0].samples;
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
            return alphaNumInput.toLowerCase().includes(input.toLowerCase());
          }
        });
      },
      setSelectedObject(index) {
        const sampleInputCopy = { ...this.$refs.sampleInputs[index] };
        const id = sampleInputCopy.selected.id;
        const description = sampleInputCopy.selected.description;
        const targetItem = this.list[index];
        targetItem.sampleId = id;
        targetItem.sampleDescription = description;
        targetItem.isSampleSelected = true;
      },
      clearSelectedObject(index) {
        const targetItem = this.list[index];
        if (targetItem.sampleDescription !== targetItem.sample) {
          targetItem.sampleId = '';
          targetItem.sampleDescription = '';
          targetItem.isSampleSelected = false;
        }
      },
    },
  };
</script>
