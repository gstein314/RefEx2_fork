<template>
  <span class="warning">
    <FontAwesomeIcon icon="exclamation-triangle" />
    <slot></slot>
    {{ text }}
  </span>
</template>

<script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

  export default {
    components: {
      FontAwesomeIcon,
    },
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
