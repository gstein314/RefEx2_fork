<template>
  <div class="index_wrapper">
    <SpeciesNavigation />
    <FilterNavigation />
    <FilterTab v-for="filter of filters" :key="filter.name" />
    <ModalViewGene />
  </div>
</template>

<script>
  import ModalViewGene from '~/components/ModalView/ModalViewGene.vue';
  import SpeciesNavigation from '~/components/search/SpeciesNavigation.vue';
  import FilterNavigation from '~/components/search/FilterNavigation.vue';
  import FilterTab from '~/components/search/FilterTab.vue';
  import filters from '~/static/filters.json';

  export default {
    components: {
      ModalViewGene,
      SpeciesNavigation,
      FilterNavigation,
      FilterTab,
    },
    data() {
      return {
        filters,
      };
    },
  };
</script>

<style lang="sass">
  .index_wrapper
    > .modal_bg
      +modal_bg
</style>
