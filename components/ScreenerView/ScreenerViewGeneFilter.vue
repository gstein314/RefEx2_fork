<template>
  <div>
    <h3>Filter by {{ screenerFilter.description }}</h3>
    <client-only>
      <div :class="screenerFilter.className">
        <table>
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
              <template v-if="filter.className === 'sample' && !isSelected">
                <WarningMessage>Please select from suggestions</WarningMessage>
              </template>
              <a v-if="isEntropy(filter.className)" href="javascript:void(0)">
                <font-awesome-icon icon="info-circle" />
              </a>
            </td>
            <td
              colspan="2"
              class="delete_all"
              :class="{ disabled: isDisabled }"
              @click="dispatchAction('DEL_ALL')"
            >
              <font-awesome-icon icon="trash" />
              Delete All
            </td>
          </tr>
          <tr
            v-for="(item, itemIndex) in screenerFilter.list"
            :key="itemIndex"
            :class="{ unchecked: !item.check }"
          >
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
                @change="autoAddAndCheck(itemIndex, item[filter.className])"
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
                ref="sampleInput"
                v-model.trim="parameters.text"
                :display-attribute="'description'"
                :value-attribute="'id'"
                :list="autocompleteItems"
                :debounce="500"
                :min-length="0"
                :max-suggestions="10"
                class="text_search_name"
                :placeholder="filter.placeholder"
                @input="updateIsSelected"
              >
                <!-- plugin uses slot-scope as a prop variable. {suggestion} turns into an object at the plugin-->
                <!-- eslint-disable vue/no-unused-vars -->
                <!-- eslint-disable vue/no-v-html -->
                <div slot="suggestion-item" slot-scope="{ suggestion }">
                  <span
                    v-html="
                      $highlightedSuggestion(
                        suggestion.description,
                        parameters.text,
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
                @input="autoAddAndCheck(itemIndex, item[filter.className])"
              />
            </td>
            <td class="icon">
              <button
                class="delete_btn"
                :class="{ disabled: !item.delete }"
                :disabled="!item.delete"
                @click="dispatchAction('DEL', itemIndex)"
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
        isSelected: false,
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
      isDisabled() {
        const list = this.screenerFilter.list;
        const firstItem = list[0];
        const defaultItem = { ...this.screenerFilter.defaultItem };
        defaultItem.delete = false;
        if (_.isEqual(firstItem, defaultItem) && list.length === 1) {
          return true;
        }
        return false;
      },
      autocompleteItems() {
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
        return copy.filter(sample => {
          const wordAndSpace = /[^\w\s]/g;
          const wordsOnlyInput = sample.description.replaceAll(
            wordAndSpace,
            ' '
          );
          const oneSpaceInput = wordsOnlyInput.replace(/\s\s+/g, ' ');
          const result =
            oneSpaceInput
              .toLowerCase()
              .indexOf(this.parameters.text.toLowerCase()) !== -1;
          result ? console.log(oneSpaceInput) : '';
          return result;
        });
      },
    },
    mounted() {
      this.dispatchAction('INIT');
    },
    methods: {
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
            if (value.trim().length > 0) {
              if (!list[index + 1]) {
                list.push(defaultItem);
              }
            }
            break;
          case 'DEL':
            if (list.length === 1) {
              list.splice(0, list.length);
              defaultItem.delete = false;
              list.push(defaultItem);
            } else {
              list.splice(index, 1);
            }
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
      },
      autoAddAndCheck(index, value) {
        const targetItem = this.screenerFilter.list[index];
        targetItem.delete = true;
        this.dispatchAction('ADD', index, value);
        if (targetItem.check === false) {
          this.dispatchAction('CHECK', index);
        }
      },
      updateIsSelected() {
        this.isSelected =
          this.$refs.sampleInput[0].selected !== null ? true : false;
      },
    },
  };
</script>
