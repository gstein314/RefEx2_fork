<template>
  <div class="inner" :class="{ '-column': note }">
    <span class="label"> {{ label }} </span>
    <div class="details">
      <span v-if="note" class="tag">{{ note }}</span>

      <font-awesome-icon
        :icon="currentSort.key === id ? `sort-${currentSort.order}` : 'sort'"
        @click="switchSort"
      />
      <font-awesome-icon
        icon="search"
        :class="{ active: isActiveSearch }"
        @click="setFilterModal(id)"
      />
    </div>
    <slot></slot>
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
      currentSort: {
        type: Object,
        required: true,
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
      switchSort() {
        this.$emit('switchSort', this.id);
      },
      ...mapMutations({
        setFilterModal: 'set_filter_modal',
      }),
    },
  };
</script>
<style lang="sass" scoped>
  .inner
    display: grid
    gap: 0.5rem
    grid-template-columns: auto 1fr
    grid-template-rows: auto 1fr
    &.-column
      grid-template-columns: 1fr
    > .details
      display: flex
      gap: 0.5rem
      align-items: center
      svg
        &:hover
          cursor: pointer
        &[data-icon="sort"]
          color: $GRAY
          opacity: .3
        &[data-icon="search"]
          font-size: 12px
          color: $MAIN_COLOR
          &.active
            color: $ACTIVE_COLOR
    .tag
      +ontology_tag
      width: fit-content
</style>
