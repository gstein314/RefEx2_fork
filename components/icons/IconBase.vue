<template>
  <div
    class="svg_wrapper"
    :style="{
      'min-width': `${wrapperSize}px`,
      height: `${wrapperSize}px`,
    }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="size[0]"
      :height="size[1]"
      :viewBox="`0 0 ${size[0]} ${size[1]}`"
      :aria-labelledby="iconName"
      role="presentation"
    >
      <title :id="iconName" lang="en">{{ iconName }} icon</title>
      <g :fill="iconColor">
        <component :is="iconComponent" :stroke-color="iconColor" />
      </g>
    </svg>
  </div>
</template>
<script>
  // svg size will be maintained at the same ratio and limit under svg_wrapper size
  const sizeMap = new Map([
    ['Human', [24, 62]],
    ['Mouse', [63, 24]],
    ['drosophilidae', [36, 18]],
    ['oryza_sativa', [42, 71]],
    ['bombyx_mori', [43, 10]],
  ]);

  // wrapper is set to be square (1:1)
  const wrapperSize = 60;

  export default {
    props: {
      iconName: {
        type: String,
        default: 'box',
      },
      iconColor: {
        type: String,
        default: 'currentColor',
      },
    },
    computed: {
      size() {
        const originalSize = sizeMap.get(this.iconName) ?? [
          wrapperSize,
          wrapperSize,
        ];
        const [x, y] = originalSize;
        const ratio = x / y;
        const isOversized = x > wrapperSize || y > wrapperSize;
        const isUndersized = x < wrapperSize || y < wrapperSize;
        const xIsLonger = x > y;

        if (isOversized) {
          if (xIsLonger) {
            return [wrapperSize, wrapperSize / ratio];
          } else {
            return [wrapperSize * ratio, wrapperSize];
          }
        }
        if (isUndersized) {
          if (xIsLonger) {
            return [wrapperSize, wrapperSize / ratio];
          } else {
            return [wrapperSize * ratio, wrapperSize];
          }
        }
        return [wrapperSize, wrapperSize];
      },
      parsedName() {
        return this.iconName
          .split('_')
          .map(word => this.$firstLetterUppercase(word))
          .join('');
      },
      iconComponent() {
        import(`~/components/icons/Icon${this.parsedName}.vue`);
        return () => import(`~/components/icons/Icon${this.parsedName}.vue`);
      },
    },
  };
</script>
<style lang="sass" scoped>
  .svg_wrapper
    display: inline-block
    text-align: center
    // line-height: 1
    width: 60px
    height: 60px
</style>
