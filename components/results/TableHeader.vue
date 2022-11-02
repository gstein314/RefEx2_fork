<template>
  <div>
    <div class="inner" :class="{ '-column': note }" @click="activeSort">
      <div class="details">
        <div class="label">{{ label }}</div>
        <div v-if="note" class="tag">{{ note }}</div>
      </div>
      <font-awesome-icon :icon="sortIcon(id)" />
      <font-awesome-icon v-if="sortOrder(id)" :icon="orderNumber(id)" />
    </div>
    <font-awesome-icon
      icon="search"
      :class="{ active: isActiveSearch }"
      @click="setFilterModal(id)"
    />
  </div>
</template>

<script>
  /* eslint-disable vue/prop-name-casing */
  import { mapMutations } from 'vuex';

  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        default: '',
      },
      // eslint-disable-next-line vue/require-default-prop
      note: {
        type: String,
        required: false,
      },
      is_ontology: {
        type: Boolean,
        default: false,
      },
      // eslint-disable-next-line vue/require-default-prop
      is_displayed: {
        type: Boolean,
        default: true,
      },
      filterModal: {
        type: [String, Array],
        default: '',
      },
      // eslint-disable-next-line vue/require-default-prop
      options: {
        type: [Array],
        required: false,
      },
      // eslint-disable-next-line vue/require-default-prop
      numberValue: {
        type: Object,
        required: false,
      },
      projectSortColumns: {
        type: Array,
        default: () => [],
      },
      projectSortColumnsWithLogMedian: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      height() {
        return this.heightChartWrapper + 'px';
      },
      isActiveSearch() {
        // if number, returns true when number within min max range is set
        //　if fixed options (is_checkbox), return true if 1 or more options are unset
        // else check if not empty string
        return this.numberValue
          ? this.filterModal[0] !== this.numberValue.min ||
              this.filterModal[1] !== this.numberValue.max
          : this.options
          ? this.options.some(item => !this.filterModal.includes(item))
          : this.filterModal !== '';
      },
    },
    methods: {
      activeSort() {
        this.$emit('activeSort', this.id);
      },
      ...mapMutations({
        setFilterModal: 'set_filter_modal',
      }),
      sortIcon(id) {
        const sortArray = this.projectSortColumnsWithLogMedian;
        const columnsArray = sortArray[0];
        const ordersArray = sortArray[1];
        const activeColumn = columnsArray.includes(id);
        const columnIndex = columnsArray.indexOf(id);
        const activeDesc = ordersArray[columnIndex] === 'desc';
        const activeAsc = ordersArray[columnIndex] === 'asc';
        return activeColumn && activeDesc
          ? 'fa-duotone fa-sort-down'
          : activeColumn && activeAsc
          ? 'fa-duotone fa-sort-up'
          : 'sort';
      },
      sortOrder(id) {
        return this.sortIcon(id) === 'sort' ? false : true;
      },
      orderNumber(id) {
        console.log(this.projectSortColumnsWithLogMedian);
        const position = this.projectSortColumnsWithLogMedian[0].indexOf(id);
        return position === -1 ? undefined : `circle-${position + 1}`;
      },
    },
  };
</script>
<style lang="sass" scoped>
  .inner
    &:hover
      cursor: pointer
    display: grid
    gap: 0.5rem
    grid-template-columns: auto 1fr
    grid-template-rows: auto 1fr
    &.-column
      grid-template-columns: 1fr
    > .details
      // display: flex
      // gap: 0.5rem
      // align-items: center
      svg
        &:hover
          cursor: pointer
        &[data-icon="sort"]
          color: $GRAY
          opacity: .3
        &[data-icon="magnifying-glass"]
          font-size: 12px
          color: $MAIN_COLOR
          &.active
            color: $ACTIVE_COLOR
    .tag
      +ontology_tag
      width: fit-content
</style>
