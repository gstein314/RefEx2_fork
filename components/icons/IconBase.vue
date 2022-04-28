<template>
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
</template>
<script>
  const sizeMap = new Map([
    ['Human', [24, 62]],
    ['Mouse', [63, 24]],
    ['drosophilidae', [36, 18]],
    ['oryza_sativa', [42, 71]],
    ['bombyx_mori', [43, 10]],
  ]);

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
        return sizeMap.get(this.iconName) ?? [24, 62];
      },
      parsedName() {
        return this.iconName
          .split('_')
          .map(word => this.$firstLetterUppercase(word))
          .join('');
      },
      iconComponent() {
        return () => import(`~/components/icons/Icon${this.parsedName}.vue`);
      },
    },
  };
</script>
