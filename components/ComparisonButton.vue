<template>
  <button class="comparison_btn" @click="toggleCompareModal">
    <FontAwesomeIcon icon="chart-column" />
    Comparison
  </button>
</template>

<script>
  import { mapMutations } from 'vuex';

  export default {
    methods: {
      ...mapMutations({
        toggleCompareModal: 'set_compare_modal',
      }),
    },
  };
</script>
<style lang="sass" scoped>
  .comparison_btn
      +button
</style>
