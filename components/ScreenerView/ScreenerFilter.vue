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
              <a href="javascript:void(0)">
                <font-awesome-icon
                  v-if="isEntropy(filter.className)"
                  icon="info-circle"
                />
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
                    :value="option.id"
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
              <input
                v-else
                v-model="item[filter.className]"
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
  import datasets from '~/refex-sample/datasets.json';
  import _ from 'lodash';
  export default {
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
        screenerFilterList: this.screenerFilter.list,
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
    },
    watch: {
      screenerFilterList: {
        handler(newVal, oldVal) {
          this.$emit(
            'addFilterValue',
            this.screenerFilter.type,
            this.screenerFilter.list
          );
        },
        deep: true,
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
    },
  };
</script>
