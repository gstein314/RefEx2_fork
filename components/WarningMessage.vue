<template>
  <span class="warning">
    <font-awesome-icon icon="exclamation-triangle" />
    <slot></slot>
  </span>
</template>

<script>
  export default {
    props: {
      message: {
        type: String,
        required: true,
      },
    },
  };
</script>
<style lang="sass" scoped>
  .warning
      +warning
</style>
