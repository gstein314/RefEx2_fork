<template>
  <modal-view v-if="isOn" @click.native="toggleCompareModal">
    <div class="modal compare_modal" @click.stop="">
      <p class="modal_title">
        <font-awesome-icon icon="search" />
        Compare with comma separated ID list
      </p>
      <div
        v-for="(example, exampleIndex) of examples"
        :key="exampleIndex"
        class="sample"
      >
        <span class="ex">e.g.&nbsp;</span>
        <span class="sample_value" @click="setExample(example.route)">{{
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
  import { mapGetters, mapMutations } from 'vuex';

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
        activeDataset: 'active_dataset',
        routeToProjectPage: 'route_to_project_page',
        isOn: 'compare_modal',
      }),
      examples() {
        return this.activeDataset[this.$store.state.active_filter]
          .item_comparison_example;
      },
    },
    methods: {
      ...mapMutations({
        toggleCompareModal: 'set_compare_modal',
      }),
      setExample(route) {
        this.itemIdsForComparisonStr = route;
      },
      comparisonSearch() {
        // TODO: add error handling for invalid comparison input
        if (this.itemIdsForComparisonStr === '') return;
        this.$nuxt.$loading.start();
        location.href = this.routeToProjectPage(this.itemIdsForComparisonStr);
        this.toggleCompareModal();
      },
    },
  };
</script>
<style lang="sass" scoped>
  .compare_modal
    width: 600px
    > div
      display: flex
      align-items: center
      &.sample
        margin-bottom: 8px
        +sample_query
        > .ex
          margin-left: 20px
      > input
        +text_input
      > button
        +button
        margin-left: 10px
</style>
