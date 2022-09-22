<template>
  <button
    class="comparison_btn"
    :style="[isProjectSample ? { visibility: 'hidden' } : '']"
    @click="toggleCompareModal"
  >
    <font-awesome-icon icon="chart-bar" />
    Comparison
  </button>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    data() {
      return {
        isProjectSample: false,
      };
    },
    computed: {
      ...mapGetters({
        getPageType: 'get_page_type',
        activeFilter: 'active_filter',
      }),
    },
    mounted() {
      this.checkProjectSample();
    },
    methods: {
      ...mapMutations({
        toggleCompareModal: 'set_compare_modal',
      }),
      checkProjectSample() {
        if (
          this.getPageType === 'project' &&
          this.activeFilter.name === 'sample'
        ) {
          this.isProjectSample = true;
        }
      },
    },
  };
</script>
<style lang="sass" scoped>
  .comparison_btn
      +button
</style>
