<template>
  <ul class="item_comparison">
    <li
      v-for="(item, index) of items"
      :key="index"
      class="item_box"
      :class="[`item_${index + 1}`, { active: isMedianSort(item.id) }]"
      @click="select(item.id)"
    >
      <font-awesome-icon
        v-if="displayInfoButton"
        class="info"
        icon="info-circle"
        @click="$emit('showModal', item.id)"
      />
      <span>{{ item.info.symbol || item.info.Description }}</span>
      <font-awesome-icon v-if="isMedianSort(item.id)" :icon="sortOrder()" />
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      items: {
        type: Array,
        default: () => [],
      },
      activeId: {
        type: String,
        default: '',
      },
      displayInfoButton: {
        type: Boolean,
        default: false,
      },
      projectSortColumns: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      filterType() {
        return window.location.pathname.split('/')[1];
      },
    },
    methods: {
      // only switch to 'up' order if the same item is selected and it was already a median sort
      select(id) {
        this.$emit('select', id);
      },
      isMedianSort(id) {
        return this.activeId === id;
      },
      sortOrder() {
        const sortArray = this.projectSortColumns;
        const columnsArray = sortArray[0];
        const ordersArray = sortArray[1];
        const copy = [...columnsArray].map(x => {
          if (x.substring(0, x.indexOf('[')) === 'combinedMedianData') {
            return 'combinedMedianData';
          } else return x;
        });
        const medianIndex = copy.indexOf('combinedMedianData');
        return ordersArray[medianIndex] === 'desc'
          ? 'fa-duotone fa-sort-down'
          : ordersArray[medianIndex] === 'asc'
          ? 'fa-duotone fa-sort-up'
          : 'check';
      },
    },
  };
</script>

<style lang="sass" scoped>
  .item_comparison
    padding: 0
    margin: 0
    display: flex
    font-size: 16px
    > .item_box
      word-break: break-word
      width: 100px
      padding: 6px 0 0 0
      font-weight: 500
      margin-right: 10px
      border-top: 8px solid
      &.active
        width: 200px
        font-weight: bold
      > svg
        font-size: 14px
        color: $MAIN_COLOR
      &:hover
        cursor: pointer
      @for $i from 0 through 10
        &.item_#{12 * $i + 1}
          border-color: $COLOR_1
        &.item_#{12 * $i + 2}
          border-color: $COLOR_2
        &.item_#{12 * $i + 3}
          border-color: $COLOR_3
        &.item_#{12 * $i + 4}
          border-color: $COLOR_4
        &.item_#{12 * $i + 5}
          border-color: $COLOR_5
        &.item_#{12 * $i + 6}
          border-color: $COLOR_6
        &.item_#{12 * $i + 7}
          border-color: $COLOR_7
        &.item_#{12 * $i + 8}
          border-color: $COLOR_8
        &.item_#{12 * $i + 9}
          border-color: $COLOR_9
        &.item_#{12 * $i + 10}
          border-color: $COLOR_10
        &.item_#{12 * $i + 11}
          border-color: $COLOR_11
        &.item_#{12 * $i + 12}
          border-color: $COLOR_12
</style>
