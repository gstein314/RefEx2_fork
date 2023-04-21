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
        return 60;
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
