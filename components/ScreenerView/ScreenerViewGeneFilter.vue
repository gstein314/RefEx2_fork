<template>
  <div class="filter">
    <div class="filter_title">
      <div>
        Filter by {{ filter.name }}
        <font-awesome-icon
          v-tooltip="'This is Filter by ' + filter.name"
          icon="info-circle"
        />
      </div>
      <button
        class="reset_btn"
        :class="{ disabled: resetIsDisabled }"
        @click="dispatchAction('INIT')"
      >
        <font-awesome-icon icon="rotate-right" />
        Reset
      </button>
    </div>
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
                <WarningMessage
                  v-else-if="column.isRequired && !isValidColumn(column.id)"
                >
                </WarningMessage>
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
                  warning:
                    column.isRequired && !isValidInput(column.id, itemIndex),
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
                        setSelectedSample(itemIndex, 'CLEAR', e);
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
                    v-model.trim="item[column.id].input"
                    display-attribute="description"
                    value-attribute="id"
                    :styles="autoCompleteStyle(item)"
                    :max-suggestions="0"
                    :list="
                      autocompleteItems(
                        itemIndex,
                        item[column.id].input,
                        item.group
                      )
                    "
                    :debounce="500"
                    :min-length="0"
                    :placeholder="column.placeholder"
                    class="text_search_name"
                    :class="{ disabled: item.group === '' }"
                    :disabled="item.group === ''"
                    @select="setSelectedSample(itemIndex, 'ADD')"
                    @input="dispatchAction('ADD', itemIndex, column.id)"
                    @focus="e => setSelectedSample(itemIndex, 'CLEAR', e)"
                  >
                    <!-- plugin uses slot-scope as a prop variable. {suggestion} turns into an object at the plugin-->
                    <!-- eslint-disable vue/no-unused-vars -->
                    <!-- eslint-disable vue/no-v-html -->
                    <div slot="suggestion-item" slot-scope="{ suggestion }">
                      <span
                        v-html="
                          $highlightedSuggestion(
                            suggestion.description,
                            item[column.id].input,
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
                  step="0.1"
                  @input="
                    e => {
                      validateNumInput(itemIndex, column, e);
                      dispatchAction('ADD', itemIndex, column.id);
                    }
                  "
                />
              </td>
              <!-- // hide trash can button until multi-search
              <td class="icon">
                <a
                  class="delete_btn"
                  :class="{ disabled: list.length <= 1 }"
                  :disabled="list.length <= 1"
                  @click="dispatchAction('DELETE', itemIndex)"
                >
                  <font-awesome-icon icon="trash-xmark" />
                </a>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </client-only>
  </div>
</template>

<script>
  import 'floating-vue/dist/style.css';
  import _ from 'lodash';
  import VueSimpleSuggest from 'vue-simple-suggest';
  import { mapGetters } from 'vuex';
  import WarningMessage from '../WarningMessage.vue';

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
      activeFilterObj: {
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
        return this.list.map(({ sample }) => sample.isSelected);
      },
      eachSampleIsSelected() {
        return this.list
          .filter(item => !this.isDefaultItem(item))
          .map(({ sample }) => sample.isSelected)
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
              // spec.samples.forEach(sample => (sample.group = spec.id));
              subDatasetSamples[subDataset.dataset][spec.id] = spec;
              defaultSamples[subDataset.dataset].push(...spec.samples);
            }
          }
        }
        return { bySubDataset: subDatasetSamples, byDefault: defaultSamples };
      },
    },
    watch: {
      list: {
        handler(newVal, oldVal) {
          this.$emit('addFilterValue', this.filter.type, this.list);
        },
        deep: true,
      },
    },
    methods: {
      validateNumInput(index, column, e) {
        const numInput = parseFloat(e.target.value);
        const targetItem = this.getTargetItem(index);
        const { id, min, max } = column;
        const isWithinRange =
          numInput >= parseInt(min) && numInput <= parseInt(max);
        const toOneDecimal = () => {
          let text = numInput.toString();
          const tenthsIndex = text.indexOf('.') + 1;
          return text.substring(0, tenthsIndex + 1);
        };
        targetItem[id] = isWithinRange
          ? toOneDecimal()
          : targetItem[id].substring(0, targetItem[id].length - 1);
      },
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
        const { isSelected } = item.sample;
        if (!this.isDefaultItem(item) && !isSelected) {
          return { defaultInput: 'warning' };
        }
      },
      dispatchAction(action, index, column) {
        const numOfItems = this.list.length;
        const defaultItemCopy = JSON.parse(JSON.stringify(this.defaultItem));
        const targetItem = this.getTargetItem(index);
        const setNewList = () =>
          this.list.splice(0, numOfItems, defaultItemCopy);
        const shouldAddNewItem = () => {
          const isObject = typeof defaultItemCopy[column] === 'object';
          const inputField = isObject
            ? targetItem[column].input
            : targetItem[column];
          const hasNonSpaceInput = inputField.trim().length > 0;
          const hasNextItem = this.getTargetItem(index + 1) ? true : false;
          return hasNonSpaceInput && !hasNextItem;
        };

        switch (action) {
          case 'INIT':
            setNewList();
            this.$emit('resetUpdateParameters');
            // TODO: del when multi is enabled
            if (this.activeFilterObj.method === this.filter.type) {
              this.$emit('resetActiveFilterObj');
            }
            break;
          // TODO: Comment out until gql is multi
          // case 'ADD':
          //   if (shouldAddNewItem()) {
          //     this.list.push(defaultItemCopy);
          //   }
          //   break;
          case 'DELETE':
            numOfItems === 1 ? setNewList() : this.$delete(this.list, index);
            // TODO:
            if (this.activeFilterObj.method === this.filter.type) {
              this.$emit('resetActiveFilterObj');
            }
            break;
        }
      },
      autocompleteItems(index, userInput, selectedGroup) {
        const activeDateset = this.activeDataset.dataset;
        const getUnsortedSamples = () => {
          try {
            return JSON.parse(
              JSON.stringify(
                this.datasetSamples.bySubDataset[activeDateset][selectedGroup]
                  .samples
              )
            );
          } catch (error) {
            const rawDefaultList = JSON.parse(
              JSON.stringify(this.datasetSamples.byDefault[activeDateset])
            );
            return _.uniqWith(rawDefaultList, _.isEqual);
          }
        };
        const sortSamplesByDescription = (a, b) =>
          a.description.localeCompare(b.description);
        const sortedSamples = getUnsortedSamples().sort(
          sortSamplesByDescription
        );
        const filterSamples = (samples, input) => {
          const nonWordDigitSpace = /[^\w\d\s]/g;
          const toAlphaNum = input.replace(nonWordDigitSpace, '');
          const twoSpacesOrMore = /\s\s+/g;
          const wordArray = toAlphaNum.replace(twoSpacesOrMore, ' ').split(' ');

          return samples.filter(sample => {
            const description = sample.description.replace(
              nonWordDigitSpace,
              ''
            );
            return wordArray.every(input =>
              description.toLowerCase().includes(input.toLowerCase())
            );
          });
        };
        const filteredSamples = userInput
          ? filterSamples(sortedSamples, userInput)
          : undefined;
        const suggestions = filteredSamples ?? sortedSamples;
        // manually update vue-simple-suggest suggestions after "Group" option changed
        const inputRef = this.$refs.sampleInputs?.[index];
        if (inputRef) {
          inputRef.suggestions = suggestions;
        }
        return suggestions;
      },
      setSelectedSample(index, action, e) {
        const targetItem = this.getTargetItem(index);
        const sampleInput = this.$refs.sampleInputs?.[index];
        const { id, description } = sampleInput?.selected || {};
        const isSampleField = e?.target.localName === 'input';

        if (action === 'ADD' && sampleInput) {
          Object.assign(targetItem.sample, {
            id: id,
            description: description,
            isSelected: true,
          });
          setTimeout(() => sampleInput.inputElement.blur(), 10);
        }

        if (action === 'CLEAR' && sampleInput?.selected) {
          sampleInput.setText('');
          sampleInput.selected = null;
          Object.assign(targetItem.sample, {
            input: '',
            id: '',
            description: '',
            isSelected: false,
          });
          if (isSampleField && targetItem.group) {
            targetItem.group = '';
          }
        }
      },
    },
  };
</script>

<style lang="sass">
  .item-list
    width: 100%
  svg[data-icon="circle-info"], .delete_all
    color: $MAIN_COLOR
    cursor: pointer
  svg[data-icon="trash-xmark"]
    color: $ERROR_COLOR
    cursor: pointer
  select:required:invalid
    color: $PLACEHOLDER_COLOR
  tbody
    td
      &.warning
        input, select
          +warning_field
    .text_search_name
      &.disabled
        input
          background-color: $DISABLE_INPUT_COLOR
          cursor: not-allowed
        input::placeholder
          color: $DISABLE_PLACEHOLDER_COLOR
    .text_search_name input
      &.warning
        +warning_field
  .filter_title
    display: flex
    align-items: center
    justify-content: space-between
    .reset_btn
      +button
      +sub_button
      cursor: pointer
      &.disabled
        cursor: not-allowed
  .delete_btn
    align-items: initial
    padding: 10px
    cursor: pointer
    opacity: 0.7
    transition: opacity 0.3s ease-in-out
    &:hover
      opacity: 1
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
