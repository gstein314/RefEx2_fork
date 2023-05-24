<template>
  <div class="index_wrapper">
    <LocalNavigation />
    <FilterTab v-for="filter of filters" :key="filter.name" />
    <ModalViewGene />
    <ModalViewSample />
    <ModalViewCompare ref="ModalViewCompare" />
    <ModalViewAlert />
  </div>
</template>

<script>
  import ModalViewGene from '~/components/ModalView/ModalViewGene.vue';
  import ModalViewSample from '~/components/ModalView/ModalViewSample.vue';
  import ModalViewCompare from '~/components/ModalView/ModalViewCompare.vue';
  import LocalNavigation from '~/components/search/LocalNavigation/LocalNavigation.vue';
  import FilterTab from '~/components/search/FilterTab.vue';
  import filters from '~/static/filters.json';
  import ModalViewAlert from '~/components/ModalView/ModalViewAlert.vue';

  export default {
    components: {
      ModalViewGene,
      ModalViewSample,
      ModalViewCompare,
      LocalNavigation,
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

<style lang="sass">
  +popper
</style>
