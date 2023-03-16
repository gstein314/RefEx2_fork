<template>
  <span class="warning">
    <FontAwesomeIcon icon="exclamation-triangle" />
    <slot></slot>
    {{ text }}
  </span>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: '',
      },
    },
  };
</script>
<style lang="sass" scoped>
  .warning
    +warning
</style>
