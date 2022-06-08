<template>
  <div class="index_wrapper">
    <SpeciesNavigation />
    <FilterNavigation />
    <FilterTab v-for="filter of filters" :key="filter.name" />
    <ModalViewGene />
    <ModalViewCompare />
    <ModalViewAlert />
  </div>
</template>

<script>
  import ModalViewGene from '~/components/ModalView/ModalViewGene.vue';
  import ModalViewCompare from '~/components/ModalView/ModalViewCompare.vue';
  import SpeciesNavigation from '~/components/search/SpeciesNavigation.vue';
  import FilterNavigation from '~/components/search/FilterNavigation.vue';
  import FilterTab from '~/components/search/FilterTab.vue';
  import filters from '~/static/filters.json';
  import ModalViewAlert from '~/components/ModalView/ModalViewAlert.vue';

  export default {
    components: {
      ModalViewGene,
      ModalViewCompare,
      SpeciesNavigation,
      FilterNavigation,
      FilterTab,
      ModalViewAlert,
    },
    data() {
      return {
        filters,
      };
    },
  };
</script>
