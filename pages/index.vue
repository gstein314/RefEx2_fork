<template>
  <div class="index_wrapper">
    <SpeciesNavigation />
    <FilterNavigation />
    <main>
      <search-bar />
      <div class="results_num_wrapper">
        <div class="results_num_inner">
          <h2>Estimated Results</h2>
          <p class="results_num">{{ results_num }}</p>
        </div>
      </div>
    </main>
    <ResultsWrapper @showGeneDetail="showGeneDetail"/>
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
  import SearchBar from '~/components/search/SearchBar.vue';

  export default {
    components: {
      SpeciesNavigation,
      SearchBar,
      FilterNavigation,
    },
    data() {
      return {
        gene_id_for_detail_modal: 0,
        is_gene_detail_modal_shown: false,
      };
    },
    computed: {
      results_num() {
        return this.$store.getters.results.results_num;
      },
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
    > main
      min-width: 600px
      padding: 0 90px
      display: flex
      > .results_num_wrapper
        margin-left: 15px
        width: 15%
        > .results_num_inner
          position: sticky
          top: 0
          display: flex
          flex-direction: column
          align-items: center
          > .results_num
            font-size: 48px
            font-weight: bold
            margin: 18px 0 14px
          > button
            +button
            opacity: .3
            pointer-events: none
            transition: opacity .3s
            &.active
              opacity: 1
              pointer-events: initial
    > .modal_bg
      +modal_bg
</style>
