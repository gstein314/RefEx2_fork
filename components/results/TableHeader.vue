<template>
  <div class="table_header">
    <div v-if="columnNoFunction.includes(id)" :class="{ '-column': note }">
      <div>
        <div class="label">{{ label }}</div>
        <div v-if="note" class="tag">{{ note }}</div>
      </div>
    </div>
    <div v-else-if="true" class="inner" :class="{ '-column': note }">
      <div v-if="columnNoSort.includes(id)">
        <div class="header_text">
          <div class="label">{{ label }}</div>
          <div v-if="note" class="tag">{{ note }}</div>
        </div>
      </div>
      <div v-else class="header_btn sort" @click="activeSort">
        <div>
          <div class="label">{{ label }}</div>
          <div v-if="note" class="tag">{{ note }}</div>
        </div>
        <div class="sort_icon">
          <font-awesome-icon :icon="sortIcon" :flip="sortOrder" />
        </div>
      </div>
      <div class="header_btn search" @click="setFilterModal(id)">
        <font-awesome-icon icon="search" :class="{ active: isActiveSearch }" />
      </div>
    </div>
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
      note: {
        type: String,
        default: '',
      },
      filterModal: {
        type: [String, Array],
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
      numberValue: {
        type: Object,
        default: () => {},
      },
      columnsArray: {
        type: Array,
        default: () => [],
      },
      ordersArray: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        columnNoFunction: ['gene expression patterns', 'annotation'],
        columnNoSort: ['alias'],
      };
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
      idForSort() {
        if (['chromosomePosition'].includes(this.id)) {
          return this.id + 'Int';
        } else return this.id;
      },
      sortIcon() {
        return this.columnsArray.includes(this.idForSort)
          ? 'fa-duotone fa-sort'
          : 'sort';
      },
      sortOrder() {
        const activeDesc =
          this.ordersArray[this.columnsArray.indexOf(this.idForSort)] ===
          'desc';
        return activeDesc ? 'vertical' : undefined;
      },
    },
    methods: {
      activeSort() {
        this.$emit('activeSort', this.id);
      },
      ...mapMutations({
        setFilterModal: 'set_filter_modal',
      }),
    },
  };
</script>
<style lang="sass" scoped>
  .table_header
    display: flex
    align-items: center
    justify-content: flex-start
    min-width: 150px
    &.Description
      min-width: 450px
    &.symbol
      min-width: 150px
    &.name
      min-width: 300px
    .header_text
      padding: 5px 8px
    .inner
      display: flex
      margin-left: -10px
      .header_btn
        border-radius: 0.2rem
        transition: background-color 0.3s ease-in-out
        &:hover
          cursor: pointer
          background-color: rgba($MAIN_COLOR, .2)
        &.sort, &.search
          display: flex
          align-items: center
        &.sort
          padding: 5px 8px
          gap: 5px
        .sort_icon
          box-sizing: border-box
          padding: 0 5px
          position: relative
        &.search
          padding: 5px
          > [data-icon="magnifying-glass"]
            display: inline-block
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
        opacity: .3
        &.active
          opacity: unset
          color: $MAIN_COLOR
</style>
