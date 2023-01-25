<template>
  <div>
    <h3>Filter by Tissue specificity ({{ specificityType }})</h3>
    <no-ssr>
      <div :class="`filter_specificity_${specificityType}`">
        <table>
          <tr>
            <td class="check">
              <input
                type="checkbox"
                :checked="specificity.isAllChecked"
                @click="dispatchSpecificityAction(specificityType, 'CHECK_ALL')"
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
              @click="dispatchSpecificityAction(specificityType, 'DEL_ALL')"
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
                @click="dispatchSpecificityAction(item.type, 'CHECK', index)"
              />
            </td>
            <td v-for="filter in filtersList" :key="filter.id">
              <input
                v-model="filter.group"
                type="text"
                :placeholder="filter.placeholder"
                @input="
                  dispatchSpecificityAction(item.type, 'ADD', index, item.group)
                "
              />
            </td>
            <td class="icon">
              <button
                class="delete_btn"
                :class="{ disabled: !item.delete }"
                :disabled="!item.delete"
                @click="dispatchSpecificityAction(item.type, 'DEL', index)"
              >
                <font-awesome-icon icon="trash" />
                Delete
              </button>
            </td>
          </tr>
          <tr></tr>
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
  };
</script>
