<template>
  <button class="comparison_btn" @click="toggleCompareModal()">
    <FontAwesomeIcon icon="chart-column" />
    Comparison
  </button>
</template>

<script>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { mapActions } from 'vuex';

  export default {
    components: {
      FontAwesomeIcon,
    },
    methods: {
      ...mapActions(['toggleCompareModal']),
    },
  };
</script>
<style lang="sass" scoped>
  .comparison_btn
      +button
</style>
