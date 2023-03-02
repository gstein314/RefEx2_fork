<template>
  <div>
    <h3>
      Filter by {{ screenerFilter.description }}
      <font-awesome-icon
        v-tooltip="'This is Filter by ' + screenerFilter.description"
        icon="info-circle"
      />
    </h3>
    <client-only>
      <div :class="screenerFilter.className">
        <table ref="itemList" class="item-list">
          <thead>
            <tr>
              <th class="check">
                <input
                  v-model="isAllChecked"
                  type="checkbox"
                  :checked="isAllChecked"
                  @click="dispatchAction('CHECK_ALL')"
                />
              </th>
              <th
                v-for="column in columns"
                :key="column.id"
                :class="column.className"
              >
                {{ column.name }}
                <WarningMessage
                  v-if="column.className === 'sample' && !isAllSampleSelected"
                  >Please select from suggestion(s)
                </WarningMessage>
                <font-awesome-icon
                  v-if="isEntropy(column.className)"
                  v-tooltip="'Range: 1-5'"
                  icon="info-circle"
                />
              </th>
              <th
                colspan="2"
                class="reset"
                :class="{ disabled: resetAllDisabled }"
                @click="dispatchAction('INIT')"
              >
                <font-awesome-icon icon="rotate-right" />
                Reset
              </th>
            </tr>
          </thead>
          <tbody>
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
                    e => {
                      dispatchAction('ADD', itemIndex, item[column.className]);
                      if (column.className === 'group') {
                        setSelectedSample(itemIndex, false, item.sample, e);
                      }
                    }
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
                <div
                  v-else-if="column.className === 'sample'"
                  class="sample-input"
                  :class="{ valid: isSelectedArray[itemIndex] }"
                >
                  <vue-simple-suggest
                    ref="sampleInputs"
                    v-model.trim="item[column.className]"
                    display-attribute="description"
                    value-attribute="id"
                    :styles="autoCompleteStyle(item)"
                    :max-suggestions="0"
                    :list="
                      autocompleteItems(
                        itemIndex,
                        item[column.className],
                        filter.list[itemIndex].group
                      )
                    "
                    :debounce="500"
                    :min-length="0"
                    :placeholder="column.placeholder"
                    :disabled="!item.isChecked"
                    class="text_search_name"
                    @select="setSelectedSample(itemIndex, true)"
                    @input="
                      () => {
                        dispatchAction(
                          'ADD',
                          itemIndex,
                          item[column.className]
                        );
                      }
                    "
                    @focus="setSelectedSample(itemIndex, false)"
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
                  <font-awesome-icon
                    icon="circle-check"
                    :class="{ valid: isSelectedArray[itemIndex] }"
                  />
                </div>
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
                  :class="{ disabled: list.length <= 1 }"
                  :disabled="list.length <= 1"
                  @click="dispatchAction('DELETE', itemIndex)"
                >
                  <font-awesome-icon icon="trash" />
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
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
  import 'floating-vue/dist/style.css';
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
      isSelectedArray() {
        return this.list.map(({ isSampleSelected }) => isSampleSelected);
      },
      isCheckedSelectedArray() {
        return this.list
          .filter(item => item.isChecked && !_.isEqual(item, this.defaultItem))
          .map(({ isSampleSelected }) => isSampleSelected);
      },
      isAllSampleSelected() {
        return this.isCheckedSelectedArray.every(Boolean);
      },
      groupOptions() {
        const optionsMap = {
          humanFantom5: this.datasets[0].datasets[0].specificity,
          gtexV8: this.datasets[0].datasets[1].specificity,
          mouseFantom5: this.datasets[1].datasets[0].specificity,
        };
        return (
          optionsMap[this.activeDataset.dataset] || [
            { label: 'No useable option found' },
          ]
        );
      },
      resetAllDisabled() {
        return (
          this.list.length === 1 && _.isEqual(this.list[0], this.defaultItem)
        );
      },
      isAllChecked: {
        get() {
          return this.list.every(({ isChecked }) => isChecked);
        },
        set(newValue) {
          this.list.forEach(item => (item.isChecked = newValue));
        },
      },
      humanSampleMap() {
        return {
          adultTissues: this.datasets[0].datasets[0].specificity[0].samples,
          epithelialCells: this.datasets[0].datasets[0].specificity[1].samples,
          allTissues: this.datasets[0].datasets[1].specificity[0].samples,
          brainSubRegions: this.datasets[0].datasets[1].specificity[1].samples,
        };
      },
      allHumanSamples() {
        const { adultTissues, epithelialCells, allTissues, brainSubRegions } =
          this.humanSampleMap;
        return [
          ...adultTissues,
          ...epithelialCells,
          ...allTissues,
          ...brainSubRegions,
          ,
        ];
      },
    },
    mounted() {
      if (this.list.length === 0) this.dispatchAction('INIT');
    },
    methods: {
      autoCompleteStyle(item) {
        const { isChecked, isSampleSelected } = item;
        const isDefaultItem = _.isEqual(item, this.defaultItem);
        if (isChecked && !isSampleSelected && !isDefaultItem) {
          return { defaultInput: 'warning' };
        }
      },
      isEntropy(className) {
        return ['emin', 'emax'].includes(className);
      },
      dispatchAction(action, index, value) {
        const targetItem = this.list[index];
        const defaultItemCopy = { ...this.defaultItem };
        switch (action) {
          case 'INIT':
            this.list.splice(0, this.list.length, defaultItemCopy);
            break;
          case 'CHECK_ALL':
            this.isAllChecked = !this.isAllChecked;
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
              this.list.splice(0, this.list.length, defaultItemCopy);
            } else {
              this.$delete(this.list, index);
            }
            break;
        }
      },
      autocompleteItems(index, userInput, selectedGroup) {
        const selectedDataset = this.activeDataset.dataset;
        const allFantom5Samples = [
          ...this.humanSampleMap.adultTissues,
          ...this.humanSampleMap.epithelialCells,
        ];
        const allGtexSamples = [
          ...this.humanSampleMap.allTissues,
          ...this.humanSampleMap.brainSubRegions,
        ];
        const allSamples = [...allFantom5Samples, ...allGtexSamples];
        const sortSamplesByDescription = (a, b) =>
          a.description.localeCompare(b.description);
        const getSamplesArray = () => {
          let unsortedSamples;
          switch (selectedDataset) {
            case 'humanFantom5':
              unsortedSamples =
                selectedGroup === 'Adult tissues'
                  ? this.humanSampleMap.adultTissues
                  : selectedGroup === 'Epithelial cells'
                  ? this.humanSampleMap.epithelialCells
                  : allFantom5Samples;
              break;
            case 'gtexV8':
              unsortedSamples =
                selectedGroup === 'All tissues'
                  ? this.humanSampleMap.allTissues
                  : selectedGroup === 'Brain sub-regions'
                  ? this.humanSampleMap.brainSubRegions
                  : allGtexSamples;
              break;
            default:
              return allSamples.sort(sortSamplesByDescription);
          }
          return [...unsortedSamples].sort(sortSamplesByDescription);
        };
        const nonWordAndSpace = /[^\w\s]/g;
        const toAlphaNum = userInput.replace(nonWordAndSpace, '');
        const wordArray = toAlphaNum.replace(/\s\s+/g, ' ').split(' ');
        const filteredSamples = getSamplesArray().filter(sample => {
          const toAlphaNum = sample.description.replace(nonWordAndSpace, '');
          return wordArray.every(input =>
            toAlphaNum.toLowerCase().includes(input.toLowerCase())
          );
        });
        // manually update vue-simple-suggest suggestions after "Group" option changed
        if (this.$refs.sampleInputs?.[index]) {
          this.$refs.sampleInputs[index].suggestions = filteredSamples;
        }
        return filteredSamples;
      },
      setSelectedSample(index, bool, sample, e) {
        const targetItem = this.list[index];
        const sampleInput = this.$refs.sampleInputs[index];
        if (bool) {
          const { id, description } = sampleInput.selected;
          Object.assign(targetItem, {
            sampleId: id,
            sampleDescription: description,
            isSampleSelected: true,
          });
          setTimeout(() => sampleInput.inputElement.blur(), 10);
          return;
        }
        const isSampleInTargetGroup = () => {
          if (e) {
            const selectedGroup = _.camelCase(e.target.value);
            const groupSamples = this.humanSampleMap[selectedGroup];
            if (groupSamples) {
              return groupSamples
                .map(sample => sample.description)
                .includes(sample);
            }
          }
          return false;
        };
        if (isSampleInTargetGroup()) return;
        if (sampleInput.selected) {
          sampleInput.setText('');
          sampleInput.selected = null;
          Object.assign(targetItem, {
            sample: '',
            sampleId: '',
            sampleDescription: '',
            isSampleSelected: false,
          });
        }
      },
    },
  };
</script>

<style lang="sass">
  .sample-input
    position: relative
    &.valid
      svg[data-icon="circle-check"]
        color: $MAIN_COLOR
      input
        cursor: pointer
    svg[data-icon="circle-check"]
      position: absolute
      right: 1em
      top: 1em
      color: $PLACEHOLDER_COLOR
  .suggestions
    +scrollable-suggestions
  .v-popper--theme-tooltip
    .v-popper__inner
      background: $WHITE
      border: 1px solid $MAIN_COLOR
      color: $BLACK
      padding: 3px 8px
      border-radius: 3px
      box-shadow: 0 1px 4px rgba(62, 70, 82, .22)
      z-index: $TOOLTIP_LAYER
    .v-popper__arrow-inner
      z-index: 10
      visibility: visible
      border-color: $WHITE
    .v-popper__arrow-outer
      border-color: $MAIN_COLOR
    .v-popper__arrow-container
      height: 0
</style>
