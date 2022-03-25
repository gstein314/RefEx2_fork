<template>
  <button class="comparison_btn" @click="toggleCompareModal">
    <font-awesome-icon icon="chart-bar" />
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
      margin-left: 20px
</style>
