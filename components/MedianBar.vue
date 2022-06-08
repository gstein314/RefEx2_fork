<template>
  <div class="bar_box" :style="`height: ${height}px`">
    <div
      v-for="(item, itemIndex) of items"
      :key="itemIndex"
      class="bar single_item value"
      :class="`item_${itemIndex + 1}`"
      :style="`width: ${(medianInfo[item.id] * 230) / 16}px;`"
    ></div>
    <div class="tooltip" :style="`left: ${maxWidth + 30}px`">
      <span class="title">Expression(log2(TPM+1))</span>
      <span
        v-for="(item, itemIndex) of items"
        :key="itemIndex"
        class="value single_item align_right"
        :class="`item_${itemIndex + 1}`"
      >
        <span v-if="numberOfItems > 1" class="symbol">{{
          `${item.info.symbol || item.info.sample_id}&nbsp;&nbsp;`
        }}</span>
        {{ tooltipNumberDisplay(medianInfo[item.id]) }}
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      medianInfo: {
        type: Object,
        default: () => {},
      },
      items: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      numberOfItems() {
        return this.items.length;
      },
      maxWidth() {
        return (Math.max(...Object.values(this.medianInfo)) * 230) / 16;
      },
      height() {
        return this.numberOfItems * 15;
      },
    },
    methods: {
      tooltipNumberDisplay(val) {
        return val >= 0 ? val?.toFixed(2) : 'NA';
      },
    },
  };
</script>

<style lang="sass" scoped>
  .bar_box
    display: grid
    align-items: center
    border-left: 1px solid $BLACK
    position: relative
    > .bar
      width: 100%
      height: 2px
      background-color: rgba(112, 112, 112, .4)
      position: relative
      &:after
        content: ''
        width: 10px
        height: 10px
        border-radius: 50%
        position: absolute
        top: 50%
        right: -5px
        transform: translateY(-50%)
        background-color: $COLOR_1
    > .tooltip
      display: none
      background-color: #ffffff
      padding: 3px 8px
      border: 1px solid $MAIN_COLOR
      border-radius: 3px
      box-shadow: 0 1px 4px rgba(62, 70, 82, .22)
      position: absolute
      top: 0
      z-index: $TOOLTIP_LAYER
      > span
        display: block
        white-space: nowrap
        &.title
          font-size: 10px
        &.value
          font-weight: bold
          position: relative
          padding-left: 12px
          line-height: 20px
          display: flex
          &:after
            content: ''
            width: 10px
            height: 10px
            border-radius: 100px
            position: absolute
            left: 0
            top: 50%
            transform: translateY(-50%)
      span.align_right
        text-align: right
        width: 100%
        margin-left: 10px
    &:hover
      > .tooltip
        display: block
        z-index: 100
    .single_item
      &.item_1
        &:after
          background-color: $COLOR_1 !important
      &.item_2
        &:after
          background-color: $COLOR_2 !important
      &.item_3
        &:after
          background-color: $COLOR_3 !important
      &.item_4
        &:after
          background-color: $COLOR_4 !important
      &.item_5
        &:after
          background-color: $COLOR_5 !important
      &.item_6
        &:after
          background-color: $COLOR_6 !important
      &.item_7
        &:after
          background-color: $COLOR_7 !important
      &.item_8
        &:after
          background-color: $COLOR_8 !important
      &.item_9
        &:after
          background-color: $COLOR_9 !important
      &.item_10
        &:after
          background-color: $COLOR_10 !important
</style>
>
