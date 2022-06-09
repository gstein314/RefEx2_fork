<template>
  <div class="median_scale">
    <ul>
      <li v-for="interval of intervals" :key="interval">
        <span>{{ interval }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      intervals: {
        type: Array,
        default: () => [2, 4, 6, 8, 10, 12, 14, 16],
      },
    },
  };
</script>

<style lang="sass">
  .median_scale
      width: 260px
      > ul
          display: flex
          margin: 12px 0 0 0
          padding: 0
          font-size: 10px
          font-weight: 500
          border-bottom: 1px solid $BLACK
          border-left: 1px solid $BLACK
          border-right: 1px solid $BLACK
          padding-bottom: 5px
          height: 5px
          box-sizing: border-box
          position: relative
          &:before,
          &:after
              position: absolute
          &:before
              content: '0'
              bottom: 100%
              left: -3px
          &:after
              content: '18'
              bottom: 100%
              right: -6px
          > li
            width: 1px
            height: 5px
            background-color: $BLACK
            position: absolute
            > span
              position: absolute
              bottom: 100%
              left: 50%
              transform: translateX(-50%)
          @for $i from 0 through 7
            li:nth-child(#{$i + 1})
              left: #{($i + 1) * 28.75}px
</style>
