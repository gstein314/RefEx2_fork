<template>
  <div class="bar_box" :style="`height: ${height}px`">
    <div
      v-for="(item, itemIndex) of items"
      :key="itemIndex"
      class="bar single_item value"
      :class="`item_${itemIndex + 1}`"
      :style="`width: ${(statInfo.medianData[item.id] * 230) / 16}px;`"
    ></div>
    <div class="tooltip" :style="`left: ${maxWidth + 30}px`">
      <div class="title">Expression (log2(TPM+1))</div>
      <div class="header"></div>
      <div class="header">Min</div>
      <div class="header">1<sup>st</sup>Qu</div>
      <div class="header">Median</div>
      <div class="header">3<sup>rd</sup>Qu</div>
      <div class="header">Max</div>
      <div class="header">SD</div>
      <div class="header">No. of Samples</div>
      <div class="dot">
        <p
          v-for="(item, itemIndex) of items"
          :key="itemIndex"
          class="single_item"
          :class="`item_${itemIndex + 1}`"
        ></p>
      </div>
      <div class="data">
        <p v-for="(item, itemIndex) of items" :key="itemIndex">
          {{ tooltipNumberDisplay(statInfo.minData[item.id]) }}
        </p>
      </div>
      <div class="data">
        <p v-for="(item, itemIndex) of items" :key="itemIndex">
          {{ tooltipNumberDisplay(statInfo.firstQuartileData[item.id]) }}
        </p>
      </div>
      <div class="data bold">
        <p v-for="(item, itemIndex) of items" :key="itemIndex">
          {{ tooltipNumberDisplay(statInfo.medianData[item.id]) }}
        </p>
      </div>
      <div class="data">
        <p v-for="(item, itemIndex) of items" :key="itemIndex">
          {{ tooltipNumberDisplay(statInfo.thirdQuartileData[item.id]) }}
        </p>
      </div>
      <div class="data">
        <p v-for="(item, itemIndex) of items" :key="itemIndex">
          {{ tooltipNumberDisplay(statInfo.maxData[item.id]) }}
        </p>
      </div>
      <div class="data">
        <p v-for="(item, itemIndex) of items" :key="itemIndex">
          {{ tooltipNumberDisplay(statInfo.sdData[item.id]) }}
        </p>
      </div>
      <div class="data">
        <p v-for="(item, itemIndex) of items" :key="itemIndex">
          {{ statInfo.numberOfSamplesData[item.id] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      statInfo: {
        type: Object,
        default: () => {},
      },
      resultsStat: {
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
        return (
          (Math.max(...Object.values(this.statInfo.medianData)) * 230) / 16
        );
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
      +tooltip
      display: none
      background-color: $WHITE
      padding: 3px 8px
      border: 1px solid $MAIN_COLOR
      border-radius: 3px
      box-shadow: 0 1px 4px rgba(62, 70, 82, .22)
      position: absolute
      min-width:300px
    &:hover
      > .tooltip
        display: grid
        grid-template-areas: 'top top top top top top top top' 'header header header header header header header header''dot data data data data data data data'
        grid-auto-columns: 15px 50px 50px 50px 50px 50px 50px 100px
        grid-row-gap: 1px
        grid-column-gap: 0.2rem
        padding: 10px
        z-index: 100
        > .title
          grid-area: top
          text-align: left
          margin-bottom: 5px
        & p
          margin: 0.2rem 0
        & .single_item:after
          content: ''
          width: 10px
          height: 10px
          border-radius: 50%
          background-color: #00ff00
          display: inline-block
          margin: 0 5px
        > .header, .bold
          font-weight: bold
        > div
          text-align: center

    @for $i from 0 through 10
      .single_item
        &.item_#{12 * $i + 1}
          &:after
            background-color: $COLOR_1 !important
        &.item_#{12 * $i + 2}
          &:after
            background-color: $COLOR_2 !important
        &.item_#{12 * $i + 3}
          &:after
            background-color: $COLOR_3 !important
        &.item_#{12 * $i + 4}
          &:after
            background-color: $COLOR_4 !important
        &.item_#{12 * $i + 5}
          &:after
            background-color: $COLOR_5 !important
        &.item_#{12 * $i + 6}
          &:after
            background-color: $COLOR_6 !important
        &.item_#{12 * $i + 7}
          &:after
            background-color: $COLOR_7 !important
        &.item_#{12 * $i + 8}
          &:after
            background-color: $COLOR_8 !important
        &.item_#{12 * $i + 9}
          &:after
            background-color: $COLOR_9 !important
        &.item_#{12 * $i + 10}
          &:after
            background-color: $COLOR_10 !important
        &.item_#{12 * $i + 11}
          &:after
            background-color: $COLOR_11 !important
        &.item_#{12 * $i + 12}
          &:after
            background-color: $COLOR_12 !important
</style>
>
