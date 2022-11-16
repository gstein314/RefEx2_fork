<template>
  <div class="table_header">
    <template>
      <div
        v-if="['gene expression patterns', 'annotation', 'alias'].includes(id)"
        :class="{ '-column': note }"
      >
        <div class="details">
          <div class="label">{{ label }}</div>
          <div v-if="note" class="tag">{{ note }}</div>
        </div>
      </div>
      <div
        v-else-if="true"
        class="inner"
        :class="{ '-column': note }"
        @click="activeSort"
      >
        <div class="details">
          <div class="label">{{ label }}</div>
          <div v-if="note" class="tag">{{ note }}</div>
        </div>
        <font-awesome-icon
          :style="{ visibility: isSort }"
          :icon="orderNumber"
        />
        <font-awesome-icon :icon="sortIcon" :flip="sortOrder" />
      </div>
      <font-awesome-icon
        v-if="!(id === 'gene expression patterns' || id === 'annotation')"
        icon="search"
        :class="{ active: isActiveSearch }"
        @click="setFilterModal(id)"
      />
    </template>
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
      idForSort() {
        if (['ncbiGeneId', 'chromosomePosition'].includes(this.id)) {
          return this.id + 'Int';
        } else return this.id;
      },
      sortIcon() {
        return this.columnsArray.includes(this.idForSort)
          ? 'fa-duotone fa-sort'
          : 'sort';
      },
      isSort() {
        return this.sortIcon === 'sort' ? 'hidden' : 'visible';
      },
      sortOrder() {
        const activeDesc =
          this.ordersArray[this.columnsArray.indexOf(this.idForSort)] ===
          'desc';
        return activeDesc ? 'vertical' : undefined;
      },
      orderNumber() {
        const position = this.projectSortColumns[0].indexOf(this.idForSort);
        return position === -1 ? 'circle' : `circle-${position + 1}`;
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
    min-width: 150px
    &.Description
      min-width: 450px
    &.symbol
      min-width: 150px
    &.name
      min-width: 300px
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
