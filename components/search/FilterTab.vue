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
    <ResultsWrapper :key="`${$vnode.key}_results`" />
  </div>
</template>
<script>
  import SearchBar from '~/components/search/SearchBar.vue';

  export default {
    components: {
      SearchBar,
    },
    computed: {
      activeFilter() {
        return this.$store.state.active_filter;
      },
      results_num() {
        return this.$store.getters.resultsByName(this.$vnode.key).results_num;
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
