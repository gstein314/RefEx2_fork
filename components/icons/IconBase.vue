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
    ['Arabidopsis thaliana', [82.29, 164.57]],
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
        const [originalWidth, originalHeight] = sizeMap.get(this.iconName) || [
          wrapperSize,
          wrapperSize,
        ];
        const ratio = originalWidth / originalHeight;
        const isPerfectSized =
          originalWidth === wrapperSize || originalHeight === wrapperSize;
        const isOversized =
          originalWidth > wrapperSize || originalHeight > wrapperSize;
        const isUndersized =
          originalWidth < wrapperSize && originalHeight < wrapperSize;
        const [width, height] = isPerfectSized
          ? [originalWidth, originalHeight]
          : isOversized
          ? originalWidth > originalHeight
            ? [wrapperSize, wrapperSize / ratio]
            : [wrapperSize * ratio, wrapperSize]
          : isUndersized
          ? originalWidth > originalHeight
            ? [wrapperSize, wrapperSize / ratio]
            : [wrapperSize * ratio, wrapperSize]
          : [wrapperSize, wrapperSize];
        return [width, height];
      },

      parsedName() {
        return this.iconName
          .split(' ')
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
    display: flex
    align-items: center
    justify-content: center
    width: 60px
    height: 60px
</style>
