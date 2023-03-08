<template>
  <div>
    <h3>
      Filter by {{ filter.name }}
      <font-awesome-icon
        v-tooltip="'This is Filter by ' + filter.name"
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
                  v-if="column.id === 'sample' && !eachSampleIsSelected"
                >
                  Please select from suggestion(s)
                </WarningMessage>
                <WarningMessage v-else-if="!isValidColumn(column.id)">
                </WarningMessage>
              </th>
              <th
                colspan="2"
                class="reset"
                :class="{ disabled: resetIsDisabled }"
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
              class="list-item"
            >
              <td
                v-for="column in columns"
                :key="column.id"
                :class="{
                  warning: !isValidInput(column.id, itemIndex),
                }"
              >
                <select
                  v-if="column.inputType === 'dropdown'"
                  v-model="item[column.id]"
                  required
                  @change="
                    e => {
                      dispatchAction('ADD', itemIndex, column.id);
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
                      v-for="option of Object.values(availableGroups)"
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
                      autocompleteItems(itemIndex, item[column.id], item.group)
                    "
                    :debounce="500"
                    :min-length="0"
                    :placeholder="column.placeholder"
                    class="text_search_name"
                    @select="
                      e => {
                        setSelectedSample(itemIndex, true, null, e);
                        setGroupOption(itemIndex);
                      }
                    "
                    @input="dispatchAction('ADD', itemIndex, column.id)"
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
                  @input="dispatchAction('ADD', itemIndex, column.id)"
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
      list() {
        return this.filter.list;
      },
      defaultItem() {
        return this.filter.defaultItem;
      },
      columnValidity() {
        const obj = {};
        for (const column of this.filter.columns) {
          obj[column.id] = [];
          for (const item of this.list) {
            if (this.isDefaultItem(item)) {
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
      eachSampleIsSelected() {
        return this.list
          .filter(item => !this.isDefaultItem(item))
          .map(({ isSampleSelected }) => isSampleSelected)
          .every(Boolean);
      },
      availableGroups() {
        const activeDataset = this.activeDataset.dataset;
        return this.datasetSamples.bySubDataset[activeDataset];
      },
      resetIsDisabled() {
        return this.list.length === 1 && this.isDefaultItem(this.list[0]);
      },
      datasetSamples() {
        const subDatasetSamples = {};
        const defaultSamples = {};
        const speciesDatasets = this.datasets;
        for (const speciesDataset of speciesDatasets) {
          for (const subDataset of speciesDataset.datasets) {
            subDatasetSamples[subDataset.dataset] = {};
            defaultSamples[subDataset.dataset] = [];
            for (const spec of subDataset.specificity) {
              spec.samples.forEach(sample => (sample.group = spec.id));
              subDatasetSamples[subDataset.dataset][spec.id] = spec;
              defaultSamples[subDataset.dataset].push(...spec.samples);
            }
          }
        }
        return { bySubDataset: subDatasetSamples, byDefault: defaultSamples };
      },
    },
    mounted() {
      if (this.list.length === 0) this.dispatchAction('INIT');
    },
    methods: {
      getTargetItem(index) {
        return this.list[index];
      },
      isEntropy(id) {
        return ['emin', 'emax'].includes(id);
      },
      isDefaultItem(item) {
        return _.isEqual(this.defaultItem, item);
      },
      isValidColumn(column) {
        return Object.values(this.columnValidity[column]).every(Boolean);
      },
      isValidInput(column, index) {
        const targetItem = this.getTargetItem(index);
        return this.isDefaultItem(targetItem) || targetItem[column] !== '';
      },
      autoCompleteStyle(item) {
        const { isSampleSelected } = item;
        if (!isSampleSelected && !this.isDefaultItem(item)) {
          return { defaultInput: 'warning' };
        }
      },
      dispatchAction(action, index, column) {
        const numOfItems = this.list.length;
        const defaultItemCopy = { ...this.defaultItem };
        const targetItem = this.getTargetItem(index);
        const setNewList = () =>
          this.list.splice(0, numOfItems, defaultItemCopy);
        const shouldAddNewItem = () => {
          const inputField = targetItem[column];
          const hasNonSpaceInput = inputField.trim().length > 0;
          const hasNextItem = this.getTargetItem(index + 1) ? true : false;
          return hasNonSpaceInput && !hasNextItem;
        };
        switch (action) {
          case 'INIT':
            setNewList();
            break;
          case 'ADD':
            if (shouldAddNewItem()) {
              this.list.push(defaultItemCopy);
            }
            break;
          case 'DELETE':
            numOfItems === 1 ? setNewList() : this.$delete(this.list, index);
            break;
        }
      },
      autocompleteItems(index, userInput, selectedGroup) {
        const activeDateset = this.activeDataset.dataset;
        const unsortedSamples = () => {
          try {
            return JSON.parse(
              JSON.stringify(
                this.datasetSamples.bySubDataset[activeDateset][selectedGroup]
                  .samples
              )
            );
          } catch (error) {
            const defaultList = JSON.parse(
              JSON.stringify(this.datasetSamples.byDefault[activeDateset])
            );
            return defaultList;
          }
        };
        const sortSamplesByDescription = (a, b) =>
          a.description.localeCompare(b.description);
        const sortedSamples = unsortedSamples()?.sort(sortSamplesByDescription);
        const nonWordAndSpace = /[^\w\s]/g;
        const toAlphaNum = userInput?.replace(nonWordAndSpace, '');
        const wordArray = toAlphaNum.replace(/\s\s+/g, ' ').split(' ');
        const filteredSamples = sortedSamples.filter(sample => {
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
      setSelectedSample(index, addSelected, sample, e) {
        const targetItem = this.getTargetItem(index);
        const activeDateset = this.activeDataset.dataset;
        if (!this.$refs.sampleInputs) return;
        const sampleInput = this.$refs.sampleInputs[index];
        if (addSelected) {
          const { id, description } = sampleInput.selected;
          Object.assign(targetItem, {
            sampleId: id,
            sampleDescription: description,
            isSampleSelected: true,
          });
          setTimeout(() => sampleInput.inputElement.blur(), 10);
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
      setGroupOption(index) {
        const targetItem = this.getTargetItem(index);
        console.log(targetItem);
        if (targetItem.group !== undefined) {
          const sampleInput = this.$refs.sampleInputs[index];
          const { group } = sampleInput.selected;
          targetItem.group = group;
          return targetItem;
        }
      },
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
