<template>
  <span class="warning">
    <font-awesome-icon icon="exclamation-triangle" />
    <slot></slot>
  </span>
</template>

<script>
  export default {};
</script>
<style lang="sass" scoped>
  .warning
      +warning
</style>
