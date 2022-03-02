<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title :id="iconName" lang="en">{{ iconName }} icon</title>
    <g :fill="iconColor">
      <component :is="iconComponent" />
    </g>
  </svg>
</template>
<script>
  import IconBomby from '~/components/icons/IconBomby.vue';

  export default {
    components: {
      IconBomby,
    },
    props: {
      iconName: {
        type: String,
        default: 'box',
      },
      width: {
        type: [Number, String],
        default: 24,
      },
      height: {
        type: [Number, String],
        default: 62,
      },
      iconColor: {
        type: String,
        default: 'currentColor',
      },
    },
    computed: {
      parsedName() {
        return this.iconName
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
      },
      iconComponent() {
        return () => import(`~/components/icons/Icon${this.parsedName}.vue`);
      },
    },
  };
</script>
