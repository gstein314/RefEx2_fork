<template>
  <div>
    <h3>Filter by {{ screenerFilter.description }}</h3>
    <client-only>
      <div :class="screenerFilter.class">
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
            v-for="(item, index) in screenerFilter.list"
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
              <ScreenerFilterDropdown
                v-if="filter.inputType === 'dropdown'"
                :item="item"
                :filter="filter"
                :datasets="datasets"
              />
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
    </client-only>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import ScreenerFilterDropdown from './ScreenerFilterDropdown.vue';
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
      datasets: {
        type: Array,
        default: () => [],
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
    },
    mounted() {
      this.dispatchAction('INIT');
    },
    methods: {
      dispatchAction(action, index, value) {
        const list = this.screenerFilter.list;
        const targetItem = list[index];
        const defaultItem = { ...this.screenerFilter.defaultItem };
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
        const targetItem = this.screenerFilter.list[index];
        this.dispatchAction('ADD', index, value);
        if (targetItem.check === false) {
          this.dispatchAction('CHECK', index);
        }
      },
    },
  };
</script>
