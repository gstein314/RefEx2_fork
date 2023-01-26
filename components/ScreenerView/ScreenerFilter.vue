<template>
  <div>
    <h3>Filter by {{ condition.description }}</h3>
    <no-ssr>
      <div :class="condition.class">
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
              :class="filter.class"
            >
              {{ filter.name }}
              <a href="javascript:void(0)">
                <font-awesome-icon
                  v-if="['emin', 'emax'].includes(filter.class)"
                  icon="info-circle"
                />
              </a>
            </td>
            <td
              colspan="2"
              class="delete_all"
              @click="dispatchAction('DEL_ALL')"
            >
              <font-awesome-icon icon="trash" /> Delete All
            </td>
          </tr>
          <tr
            v-for="(item, index) in condition.list"
            :key="index"
            :class="{ unchecked: !item.check }"
          >
            <td class="check">
              <input
                v-model="item.check"
                type="checkbox"
                @click="dispatchAction('CHECK', index)"
              />
            </td>
            <td v-for="filter in filters" :key="filter.id">
              <select
                v-if="filter.class === 'group'"
                v-model="item[filter.class]"
                required
                @change="autoCheckAfterInput(index, item[filter.class])"
              >
                <option value="" disabled selected hidden>
                  select a group
                </option>
                <option
                  v-for="option in groupOptions"
                  :key="option.id"
                  :value="option.label"
                >
                  {{ option.label }}
                </option>
              </select>
              <select
                v-else-if="filter.class === 'horl'"
                v-model="item[filter.class]"
                required
                @change="autoCheckAfterInput(index, item[filter.class])"
              >
                <option value="" disabled selected hidden>High</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
              <select
                v-else-if="filter.class === 'condition'"
                v-model="item[filter.class]"
                required
                @change="autoCheckAfterInput(index, item[filter.class])"
              >
                <option value="" disabled selected hidden>≧</option>
                <option value="less than">&#60;</option>
                <option value="less than or equal to">&#8804;</option>
                <option value="equal to">&#61;</option>
                <option value="not equal to">&#8800;</option>
                <option value="greater than or equal to">&#8805;</option>
                <option value="greater than">&#62;</option>
              </select>
              <input
                v-else
                v-model="item[filter.class]"
                :type="filter.inputType"
                :placeholder="filter.placeholder"
                :min="filter.min"
                :max="filter.max"
                @input="autoCheckAfterInput(index, item[filter.class])"
              />
            </td>
            <td class="icon">
              <button
                class="delete_btn"
                :class="{ disabled: !item.delete }"
                :disabled="!item.delete"
                @click="dispatchAction('DEL', index)"
              >
                <font-awesome-icon icon="trash" />
                Delete
              </button>
            </td>
          </tr>
        </table>
      </div>
    </no-ssr>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    props: {
      condition: {
        type: Object,
        default: () => {},
      },
      filters: {
        type: Array,
        default: () => [],
      },
      datasets: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        isAllChecked: true,
      };
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
      }),
      groupOptions() {
        const target = this.activeDataset.dataset;
        if (target === 'humanFantom5') {
          return this.datasets[0].datasets[0].condition;
        } else if (target === 'gtexV8') {
          return this.datasets[0].datasets[1].condition;
        } else if (target === 'mouseFantom5') {
          return [{ label: 'Group 1' }, { label: 'Group 2' }];
          // お客さんの指定があり次第ハードコートから下記のコートに変更
          // return this.datasets[1].datasets[0].condition;
        } else return [{ label: 'No useable option found' }];
      },
    },
    mounted() {
      this.dispatchAction('INIT');
    },
    methods: {
      dispatchAction(action, index, value) {
        const list = this.condition.list;
        const targetItem = list[index];
        const defaultItem = { ...this.condition.defaultItem };
        switch (action) {
          case 'INIT':
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
              list.push(defaultItem);
            } else {
              list.splice(index, 1);
            }
            break;
          case 'DEL_ALL':
            list.splice(0, list.length);
            list.push(defaultItem);
            break;
        }
        this.isAllChecked = list.every(item => item.check);
      },
      autoCheckAfterInput(index, value) {
        const targetItem = this.condition.list[index];
        this.dispatchAction('ADD', index, value);
        if (targetItem.check === false) {
          this.dispatchAction('CHECK', index);
        }
      },
    },
  };
</script>
