<template>
  <modal-view v-if="isOn" @click.native="closeModalView">
    <div class="modal compare_modal" @click.stop="">
      <p class="modal_title">
        <font-awesome-icon icon="search" />
        {{ `Compare with comma separated ${getActiveDatasetHeader()} list` }}
      </p>
      {{ setSearchField }}
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
        inputItemIds: [],
      };
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
        activeSpecie: 'active_specie',
        activeFilter: 'active_filter',
        routeToProjectPage: 'route_to_project_page',
        isOn: 'compare_modal',
        getCheckedResults: 'get_checked_results',
      }),
      examples() {
        return this.activeDataset[this.$store.state.active_filter]
          .item_comparison_example;
      },
      setSearchField() {
        return this.setExample(this.getCheckedResults.join(','));
      },
    },
    methods: {
      ...mapMutations({
        toggleCompareModal: 'set_compare_modal',
        setCheckedResults: 'set_checked_results',
      }),
      setExample(route) {
        this.itemIdsForComparisonStr = route;
      },
      comparisonSearch() {
        if (!Boolean(this.itemIdsForComparisonStr)) return;
        this.$nuxt.$loading.start();
        this.$router.push(
          this.routeToProjectPage(
            this.itemIdsForComparisonStr.replace(/^,/, '').replace(/ /g, '')
          )
        );
        this.toggleCompareModal();
      },
      closeModalView() {
        const type = this.activeFilter.name;
        this.inputItemIds = this.itemIdsForComparisonStr
          .replace(/ /g, '')
          .split(',');
        if (this.inputItemIds[0] === '') {
          this.setCheckedResults({ checked_results: [], type });
        } else {
          this.setCheckedResults({ checked_results: this.inputItemIds, type });
        }
        this.toggleCompareModal();
      },
      getActiveDatasetHeader() {
        if (this.activeSpecie.species_id === 'human') {
          switch (this.activeFilter.name) {
            case 'gene':
              return this.activeDataset.gene.header;
            case 'sample':
              return 'RES ID';
          }
        } else if (this.activeSpecie.species_id === 'mouse') {
          switch (this.activeFilter.name) {
            case 'gene':
              return this.activeDataset.gene.header;
            case 'sample':
              return 'RES ID';
          }
        }
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
