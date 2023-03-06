<template>
  <div>
    <h3>
      Filter by {{ filter.description }}
      <font-awesome-icon
        v-tooltip="'This is Filter by ' + filter.description"
        icon="info-circle"
      />
    </h3>
    <client-only>
      <div :class="filter.id">
        <table ref="itemList" class="item-list">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.id" :class="column.id">
                {{ column.name }}
                <font-awesome-icon
                  v-if="isEntropy(column.id)"
                  v-tooltip="'Range: 1-5'"
                  icon="info-circle"
                />
                <WarningMessage
                  v-if="column.id === 'sample' && !isAllSampleSelected"
                >
                  Please select from suggestion(s)
                </WarningMessage>
                <WarningMessage v-else-if="!isValidColumn[column.id]">
                </WarningMessage>
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
            >
              <td
                v-for="column in columns"
                :key="column.id"
                :class="{
                  warning: !validColumnBoolArray[column.id][itemIndex],
                }"
              >
                <select
                  v-if="column.inputType === 'dropdown'"
                  v-model="item[column.id]"
                  required
                  @change="
                    e => {
                      dispatchAction('ADD', itemIndex, item[column.id]);
                      if (column.id === 'group') {
                        setSelectedSample(itemIndex, false, item.sample, e);
                      }
                    }
                  "
                >
                  <option value="" disabled selected hidden>
                    {{ column.placeholder }}
                  </option>
                  <template v-if="column.id === 'group'">
                    <option
                      v-for="option in groupOptions"
                      :key="option.id"
                      :value="option.id"
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
                  v-else-if="column.id === 'sample'"
                  class="sample-input"
                  :class="{ valid: isSelectedArray[itemIndex] }"
                >
                  <vue-simple-suggest
                    ref="sampleInputs"
                    v-model.trim="item[column.id]"
                    display-attribute="description"
                    value-attribute="id"
                    :styles="autoCompleteStyle(item)"
                    :max-suggestions="0"
                    :list="
                      autocompleteItems(
                        itemIndex,
                        item[column.id],
                        filter.list[itemIndex]?.group
                      )
                    "
                    :debounce="500"
                    :min-length="0"
                    :placeholder="column.placeholder"
                    class="text_search_name"
                    @select="setSelectedSample(itemIndex, true)"
                    @input="
                      () => {
                        dispatchAction('ADD', itemIndex, item[column.id]);
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
                            item[column.id],
                            2
                          )
                        "
                      ></span>
                    </div>
                  </vue-simple-suggest>
                </div>
                <input
                  v-else
                  v-model.trim="item[column.id]"
                  :type="column.inputType"
                  :placeholder="column.placeholder"
                  :min="column.min"
                  :max="column.max"
                  @input="dispatchAction('ADD', itemIndex, item[column.id])"
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
      datasets: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
      }),
      // TODO: extract isEqualDefaultItem to methods
      // TODO: pass item to method as arg instead of (index)
      list() {
        return this.filter.list;
      },
      defaultItem() {
        return this.filter.defaultItem;
      },
      isValidColumn() {
        const obj = {};
        for (const [column, array] of Object.entries(
          this.validColumnBoolArray
        )) {
          obj[column] = array.every(Boolean);
        }
        return obj;
      },
      validColumnBoolArray() {
        const obj = {};
        for (const column of this.filter.columns) {
          obj[column.id] = [];
          for (const item of this.list) {
            if (_.isEqual(this.defaultItem, item)) {
              obj[column.id].push(true);
              continue;
            }
            obj[column.id].push(item[column.id] !== '');
          }
        }
        return obj;
      },
      isSelectedArray() {
        return this.list.map(({ isSampleSelected }) => isSampleSelected);
      },
      isAllSampleSelected() {
        return this.list
          .filter(item => !_.isEqual(item, this.defaultItem))
          .map(({ isSampleSelected }) => isSampleSelected)
          .every(Boolean);
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
        const { isSampleSelected } = item;
        const isDefaultItem = _.isEqual(item, this.defaultItem);
        if (!isSampleSelected && !isDefaultItem) {
          return { defaultInput: 'warning' };
        }
      },
      isEntropy(id) {
        return ['emin', 'emax'].includes(id);
      },
      dispatchAction(action, index, value) {
        const defaultItemCopy = { ...this.defaultItem };
        switch (action) {
          case 'INIT':
            this.list.splice(0, this.list.length, defaultItemCopy);
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
            const groupSamples = this.humanSampleMap?.[selectedGroup];
            if (groupSamples) {
              return groupSamples
                .map(sample => sample.description)
                .includes(sample);
            }
          }
          return false;
        };
        if (isSampleInTargetGroup()) {
          targetItem.group = e.target.value;
          return;
        }
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
      // isDefaultItem(index) {
      //   const targetItem = this.list[index];
      //   return _.isEqual(targetItem, this.defaultItem);
      // },
      // isValidInput(index, column) {
      //   const targetItem = this.list[index];
      //   return !targetItem[column] === '';
      // },
    },
  };
</script>

<style lang="sass">
  .sample-input
    position: relative
    &.valid
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
