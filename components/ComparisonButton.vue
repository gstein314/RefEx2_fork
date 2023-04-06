<template>
  <button class="comparison_btn" @click="toggleCompareModal">
    <font-awesome-icon icon="chart-column" />
    Comparison
    <span v-if="getCheckedResults.length > 0" class="badge">{{
      getCheckedResults.length
    }}</span>
  </button>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    computed: {
      ...mapGetters({
        getCheckedResults: 'get_checked_results',
      }),
    },
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
      padding: .1rem .4rem
      border-radius: 50%
      background: $WARNING_BUTTON_COLOR
      color: $WHITE
</style>
