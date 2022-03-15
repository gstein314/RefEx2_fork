<template>
  <div v-show="$vnode.key === activeFilter" class="filter_tab">
    <main>
      <search-bar :key="`${$vnode.key}_search`" />
      <div class="results_num_wrapper">
        <div class="results_num_inner">
          <h2>Estimated Results</h2>
          <p class="results_num">{{ results_num }}</p>
        </div>
      </div>
    </main>
    <ResultsWrapper
      :key="`${$vnode.key}_results`"
      @showGeneDetail="showGeneDetail"
    />
  </div>
</template>
<script>
  import SearchBar from '~/components/search/SearchBar.vue';

  export default {
    components: {
      SearchBar,
    },
    data() {
      return {
        gene_id_for_detail_modal: 0,
        is_gene_detail_modal_shown: false,
      };
    },
    computed: {
      activeFilter() {
        return this.$store.state.active_filter;
      },
      results_num() {
        return this.$store.getters.resultsByName(this.$vnode.key).results_num;
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
  .filter_tab
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
</style>
