<template>
  <modal-view @click.native="$emit('close')">
    <div class="modal compare_modal" @click.stop="">
      <p class="modal_title">
        <font-awesome-icon icon="search" />
        Compare with comma separated ID list
      </p>
      <div class="sample">
        <span class="ex">e.g.&nbsp;</span>
        <span class="sample_value" @click="setExample">{{
          example.label
        }}</span>
      </div>
      <div>
        <input
          v-model="itemIdsForComparisonStr"
          type="text"
          @keydown.enter="comparisonSearch"
        />
        <button @click="comparisonSearch">
          <font-awesome-icon icon="search" />
          Search
        </button>
      </div>
    </div>
  </modal-view>
</template>
<script>
  import ModalView from '~/components/ModalView/ModalView.vue';
  import { mapGetters } from 'vuex';

  export default {
    components: {
      ModalView,
    },
    data() {
      return {
        itemIdsForComparisonStr: '',
      };
    },
    computed: {
      ...mapGetters({
        filter: 'active_filter',
        routeToProjectPage: 'route_to_project_page',
      }),
      example() {
        return this.filter.item_comparison_example;
      },
    },
    methods: {
      setExample() {
        this.itemIdsForComparisonStr = this.example.route;
      },
      comparisonSearch() {
        if (this.itemIdsForComparisonStr === '') return;
        this.$router.go(this.routeToProjectPage(this.itemIdsForComparisonStr));
      },
    },
  };
</script>
<style lang="sass" scoped>
  .compare_modal
    > div
      display: flex
      align-items: center
      &.sample
        margin-bottom: 8px
        > span
          @include sample_query
      > input
        +text_input
      > button
        +button
        margin-left: 10px
</style>
