<template>
  <ul class="item_comparison">
    <li
      v-for="(item, index) of items"
      :key="index"
      class="item_box"
      :class="[`item_${index + 1}`, { active: isMedianSort(item.id) }]"
      @click="select(item.id)"
    >
      <span>{{ item.info.symbol || item.info.Description }}</span>
      <font-awesome-icon
        v-if="displayInfoButton"
        class="info"
        icon="info-circle"
        @click="$emit('showModal', item.id)"
      />
      <font-awesome-icon
        v-if="isMedianSort(item.id)"
        :icon="sortIcon"
        :flip="sortOrder"
      />
    </li>
  </ul>
</template>
<script>
  import { mapGetters } from 'vuex';
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
      ...mapGetters({
        projectResultsAll: 'get_project_results_all',
      }),
      filterType() {
        return window.location.pathname.split('/')[1];
      },
      columnsArray() {
        return this.projectSortColumns[0];
      },
      ordersArray() {
        return this.projectSortColumns[1];
      },
      sortIcon() {
        return this.columnsArray.includes('LogMedian')
          ? 'fa-duotone fa-sort'
          : undefined;
      },
      sortOrder() {
        const activeDesc =
          this.ordersArray[this.columnsArray.indexOf('LogMedian')] === 'desc';
        return activeDesc ? 'vertical' : undefined;
      },
    },
    methods: {
      // only switch to 'up' order if the same item is selected and it was already a median sort
      select(id) {
        this.$emit('select', id);
        if (this.activeId !== id)
          this.$store.commit('set_project_results', this.projectResultsAll[id]);
      },
      isMedianSort(id) {
        return this.activeId === id && this.columnsArray.includes('LogMedian');
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
        &[data-prefix="fas"].fa-sort
          color: $GRAY
          opacity: .3
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
