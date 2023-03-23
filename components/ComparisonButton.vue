<template>
  <button class="comparison_btn" @click="toggleCompareModal">
    <font-awesome-icon icon="chart-column" />
    Comparison
    <span class="badge">3</span>
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
    position: relative
    +button
    .badge
      position: absolute
      top: -10px
      right: -10px
      padding: 3px 8px
      border-radius: 50%
      background: $WARNING_BUTTON_COLOR
      color: white
</style>
