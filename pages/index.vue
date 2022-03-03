<template>
  <div class="index_wrapper">
    <SpeciesNavigation />
    <FilterNavigation />
    <FilterTab v-for="filter of filters" :key="filter.name" />
    <GeneDetailModal
      v-if="is_gene_detail_modal_shown"
      :gene-id="gene_id_for_detail_modal"
    />
    <div
      v-if="is_gene_detail_modal_shown"
      class="modal_bg"
      @click="is_gene_detail_modal_shown = false"
    ></div>
  </div>
</template>

<script>
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
        gene_id_for_detail_modal: 0,
        is_gene_detail_modal_shown: false,
      };
    },
    methods: {
      showGeneDetail(id) {
        this.gene_id_for_detail_modal = id;
        this.is_gene_detail_modal_shown = true;
      },
    },
  };
</script>

<style lang="sass">
  .index_wrapper
    > .modal_bg
      +modal_bg
</style>
