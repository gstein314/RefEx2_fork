<template>
  <div>
    <h3>Filter by Tissue specificity ({{ specificityType }})</h3>
    <no-ssr>
      <div :class="`filter_specificity_${specificityType}`">
        <table>
          <tr>
            <td class="check">
              <input
                v-model="isAllChecked"
                type="checkbox"
                :checked="isAllChecked"
                @click="dispatchSpecificityAction('CHECK_ALL')"
              />
            </td>
            <td
              v-for="filter in filtersList"
              :key="filter.id"
              :class="filter.class"
            >
              {{ filter.name }}
            </td>
            <td
              colspan="2"
              class="delete_all"
              @click="dispatchSpecificityAction('DEL_ALL')"
            >
              <font-awesome-icon icon="trash" /> Delete All
            </td>
          </tr>
          <tr
            v-for="(item, index) in specificity.list"
            :key="item.id"
            :class="{ unchecked: !item.check }"
          >
            <td class="check">
              <input
                v-model="item.check"
                type="checkbox"
                @click="dispatchSpecificityAction('CHECK', index)"
              />
            </td>
            <td v-for="filter in filtersList" :key="filter.id">
              <input
                v-model="item[filter.class]"
                type="text"
                :placeholder="filter.placeholder"
                @input="
                  dispatchSpecificityAction('ADD', index, item[filter.class])
                "
              />
            </td>
            <td class="icon">
              <button
                class="delete_btn"
                :class="{ disabled: !item.delete }"
                :disabled="!item.delete"
                @click="dispatchSpecificityAction('DEL', index)"
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
  export default {
    props: {
      specificity: {
        type: Object,
        default: () => {},
      },
      filtersList: {
        type: Array,
        default: () => [],
      },
      specificityType: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        isAllChecked: true,
      };
    },
    methods: {
      dispatchSpecificityAction(action, index, value) {
        const specificity = this.specificity;
        const list = specificity.list;
        const targetItem = list[index];
        const defaultItem = specificity.defaultItem;
        switch (action) {
          case 'CHECK_ALL':
            this.isAllChecked = !this.isAllChecked;
            for (const item of list) {
              this.isAllChecked ? (item.check = true) : (item.check = false);
            }
            break;
          case 'CHECK':
            targetItem.check = !targetItem.check;
            this.isAllChecked = list.every(item => item.check);
            break;
          case 'ADD':
            if (value.trim().length > 0) {
              if (!list[index + 1]) {
                list.push({ ...defaultItem });
              }
              targetItem.check = true;
              targetItem.delete = true;
            }
            break;
          case 'DEL':
            list.splice(index, 1);
            break;
          case 'DEL_ALL':
            list.splice(0, list.length);
            list.push({ ...defaultItem });
            break;
        }
      },
    },
  };
</script>
