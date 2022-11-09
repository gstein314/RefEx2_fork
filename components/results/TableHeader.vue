<template>
  <div class="table_header">
    <div class="inner" :class="{ '-column': note }" @click="activeSort">
      <div class="details">
        <div class="label">{{ label }}</div>
        <div v-if="note" class="tag">{{ note }}</div>
      </div>
      <font-awesome-icon
        :icon="sortIcon(convertedId(id))"
        :flip="sortOrder(convertedId(id))"
      />
      <font-awesome-icon
        v-if="isSort(convertedId(id))"
        :icon="orderNumber(convertedId(id))"
      />
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
      columnsArray() {
        return this.projectSortColumns[0];
      },
      ordersArray() {
        return this.projectSortColumns[1];
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
        return this.columnsArray.includes(id) ? 'fa-duotone fa-sort' : 'sort';
      },
      sortOrder(id) {
        const activeDesc =
          this.ordersArray[this.columnsArray.indexOf(id)] === 'desc';
        return activeDesc ? 'vertical' : undefined;
      },
      isSort(id) {
        return this.sortIcon(id) === 'sort' ? false : true;
      },
      orderNumber(id) {
        const position = this.projectSortColumns[0].indexOf(id);
        return position === -1 ? undefined : `circle-${position + 1}`;
      },
      convertedId(id) {
        if (id === 'ncbiGeneId' || id === 'chromosomePosition') {
          id += 'Int';
          return id;
        } else return id;
      },
    },
  };
</script>
<style lang="sass" scoped>
  .table_header
    display: flex
    align-items: center
    .inner
      padding: 5px
      margin-left: -5px
      transition: background-color 0.3s ease-in-out
      display: flex
      align-items: center
      gap: 0.5rem
      &:hover
        cursor: pointer
        background-color: rgba($MAIN_COLOR, .2)
        border-radius: 0.2rem
    .tag
      +ontology_tag
      width: fit-content
    svg
      font-size: 16px
      color: $MAIN_COLOR
      &[data-prefix="fas"].fa-sort
        color: $GRAY
        opacity: .3
      &[data-icon="magnifying-glass"]
        cursor: pointer
        font-size: 12px
        color: $GRAY
        margin-left: 0.5em
        transition: transform 0.2s ease-in-out
        opacity: .3
        &:hover
          cursor: pointer
          transform: scale(1.5)
        &.active
          opacity: unset
          color: $MAIN_COLOR
</style>
