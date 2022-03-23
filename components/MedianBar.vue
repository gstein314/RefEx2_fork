<template>
  <div>{{ result }}</div>
  <!-- <div v-if="geneNum === 1" class="bar_box">
    <div
      class="bar single_gene"
      :style="`width: ${(result[prefix] * 230) / 16}px;`"
    ></div>
    <div class="tooltip">
      <span class="title">Expression(log2(TPM+1))</span>
      <span class="value single_gene gene_1 align_right">{{
        result[prefix].toFixed(2)
      }}</span>
    </div>
  </div>
  <div v-else>
    <div v-for="index in geneNum" :key="index" class="bar_box">
      <div
        v-if="index === 1"
        class="bar single_gene gene_1"
        :style="`width: ${(result[prefix] * 230) / 16}px;`"
      ></div>
      <div
        v-else
        :class="['bar', 'single_gene', `gene_${index}`]"
        :style="`width: ${
          (result[`${prefix}_compare_${index}`] * 230) / 16
        }px;`"
      ></div>
      <div class="tooltip">
        <span class="title">Expression(log2(TPM+1))</span>
        <span
          v-for="index_2 in Number(geneNum)"
          :key="index_2"
          :class="['value', 'single_gene', `gene_${index_2}`]"
        >
          <template v-if="index_2 === 1">
            <span class="symbol">{{ `${symbol}&nbsp;&nbsp;` }}</span>
            <span class="align_right">{{
              `${result[prefix].toFixed(2)}`
            }}</span>
          </template>
          <template v-else>
            <span class="symbol">{{
              `${compareGenes[index_2 - 2].ginf.symbol}&nbsp;&nbsp;`
            }}</span>
            <span class="align_right">{{
              `${result[`${prefix}_compare_${index_2}`].toFixed(2)}`
            }}</span>
          </template>
        </span>
      </div>
    </div>
  </div> -->
</template>

<script>
  export default {
    props: {
      result: {
        type: Number,
        required: true,
      },
      // geneNum: {
      //   type: Number,
      //   required: true,
      // },
      // compareGenes: {
      //   type: Array,
      //   required: true,
      // },
      // symbol: {
      //   type: String,
      //   required: true,
      // },
      // prefix: {
      //   type: String,
      //   default: 'log2_Median',
      // },
    },
  };
</script>

<style lang="sass" scoped>
  .bar_box
      display: block
      height: 20px
      position: relative
      border-left: 1px solid $BLACK
      > .bar
          width: 100%
          height: 2px
          background-color: rgba(112, 112, 112, .4)
          position: relative
          transform: translateY(10px)
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
          left: calc(100% + 10px)
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
</style>
>
