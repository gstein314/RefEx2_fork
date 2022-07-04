<template>
  <ul class="item_comparison">
    <li
      v-for="(item, index) of items"
      :key="index"
      class="item_box"
      :class="[
        `item_${index + 1}`,
        { active: activeId === item.id && isMedianSort },
      ]"
      @click="select(item.id)"
    >
      <font-awesome-icon
        v-if="displayInfoButton"
        class="info"
        icon="info-circle"
        @click="$emit('showModal', item.id)"
      />
      <span>{{ item.info.Description || item.info.symbol }}</span>
      <font-awesome-icon
        v-if="activeId === item.id && isMedianSort"
        :icon="`sort-amount-${activeSort.order}`"
      />
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
      activeSort: {
        type: Object,
        default: () => ({
          key: '',
          order: 'down',
        }),
      },
      displayInfoButton: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      isMedianSort() {
        return this.activeSort.key === 'LogMedian';
      },
      filterType() {
        return window.location.pathname.split('/')[1];
      },
    },
    methods: {
      // only switch to 'up' order if the same item is selected and it was already a median sort
      select(id) {
        this.$emit('select', {
          id,
          sortOrder:
            this.activeId === id &&
            this.isMedianSort &&
            this.activeSort.order === 'down'
              ? 'up'
              : 'down',
        });
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
      &.item_1
        border-color: $COLOR_1
      &.item_2
        border-color: $COLOR_2
      &.item_3
        border-color: $COLOR_3
      &.item_4
        border-color: $COLOR_4
      &.item_5
        border-color: $COLOR_5
      &.item_6
        border-color: $COLOR_6
      &.item_7
        border-color: $COLOR_7
      &.item_8
        border-color: $COLOR_8
      &.item_9
        border-color: $COLOR_9
      &.item_10
        border-color: $COLOR_10
</style>
