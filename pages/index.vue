<template>
  <div class="index_wrapper">
    <SpeciesNavigation />
    <FilterNavigation />
    <FilterTab v-for="filter of filters" :key="filter.name" />
    <GeneDetailModal v-bind="geneModal" />
    <div
      v-if="geneModal.isShowing"
      class="modal_bg"
      @click="$store.commit('setGeneModal', {})"
    ></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import SpeciesNavigation from '~/components/search/SpeciesNavigation.vue';
  import FilterNavigation from '~/components/search/FilterNavigation.vue';
  import FilterTab from '~/components/search/FilterTab.vue';
  import filters from '~/static/filters.json';

  export default {
    components: {
      SpeciesNavigation,
      FilterNavigation,
      FilterTab,
    },
    data() {
      return {
        filters,
      };
    },
    computed: {
      ...mapGetters({
        geneModal: 'geneModal',
      }),
    },
  };
</script>

<style lang="sass">
  .index_wrapper
    > .modal_bg
      +modal_bg
</style>
