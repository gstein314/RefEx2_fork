<template>
  <div class="svg_wrapper">
    <img
      :src="require(`~/assets/img/${iconName}.svg`)"
      :style="{
        width: `${wrapperSize}px`,
        height: `${wrapperSize}px`,
      }"
      :alt="iconName"
    />
  </div>
</template>
<script>
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
      wrapperSize() {
        const sizeMap = {
          XS: 15,
          S: 30,
          default: 60,
        };
        const resizeMap = {
          mouse: 'S',
          'drosophila-melanogaster': 'S',
        };
        if (resizeMap[this.iconName]) return sizeMap[resizeMap[this.iconName]];
        return sizeMap.default;
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
