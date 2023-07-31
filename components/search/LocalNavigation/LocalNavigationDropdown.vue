<template>
  <div>
    <ul v-show="isOpenDataset" class="dropdown_list" :class="{ isOpenDataset }">
      <li v-for="specie in species" :key="specie.species_id">
        <icon-base :icon-name="specie.species_id" />
        <div class="option_wrapper">
          <div class="specie_name">{{ specie.species }}</div>
          <div class="tag_wrapper">
            <span
              v-for="dataset in specie.datasets"
              :key="dataset.dataset"
              class="dataset_name"
              @click="updateSpecie(specie.species_id, dataset.dataset)"
              >{{ dataset.label }}</span
            >
          </div>
        </div>
      </li>
    </ul>
    <ul v-show="isOpenType" class="dropdown_list" :class="{ isOpenType }">
      <li
        class="active_type"
        @click="$store.commit('set_active_filter', 'gene')"
      >
        <font-awesome-icon icon="dna" />
        <p>Gene</p>
      </li>
      <li
        class="active_type"
        @click="$store.commit('set_active_filter', 'sample')"
      >
        <font-awesome-icon icon="flask" />
        <p>Sample</p>
      </li>
    </ul>
  </div>
</template>

<script>
  import datasets from '~/refex-sample/datasets.json';
  import IconBase from '~/components/icons/IconBase.vue';
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    components: {
      IconBase,
    },
    props: {
      getPageType: {
        type: String,
        default: '',
      },
      isOpenDataset: {
        type: Boolean,
        default: false,
      },
      isOpenType: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        species: datasets,
        // isOpenDataset: false,
        // isOpenType: false,
        selectedProject: datasets.reduce((acc, specie) => {
          acc[specie.species_id] = specie.datasets[0].dataset;
          return acc;
        }, {}),
      };
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
        activeSpecie: 'active_specie',
      }),
    },
    created() {
      this.setSpecie(this.activeSpecie.species_id);
    },
    mounted() {
      window.addEventListener('click', this.closeDropDown);
    },
    methods: {
      ...mapMutations({
        setSpecie: 'set_specie',
        setActiveDataset: 'set_active_dataset',
      }),
      updateSpecie(specieId, dataset) {
        this.setSpecie(specieId);
        this.updateActiveDataset(dataset);
      },
      updateActiveDataset(datasetId) {
        this.setActiveDataset(
          this.activeSpecie.datasets.find(
            dataset => dataset.dataset === datasetId
          )
        );
      },
    },
  };
</script>

<style lang="sass" scoped>
  .dropdown_list
    position: absolute
    top: 100%
    left: 0
    display: none
    list-style-type: none
    background-color: white
    z-index: 999
    padding: 10px
    box-shadow: 0px 5px 15px -5px $BLACK
    cursor: auto
    min-width: 200px
  .isOpenDataset, .isOpenType
    display: block
    > .active_type:hover
        color: white
        background-color: $MAIN_COLOR
        border-radius: 5px
        cursor: pointer
    > li
      color: black
      // min-width: 200px
      // max-width: 300px
      border-bottom: 1px solid #fff
      display: flex
      align-content: center
      > svg
        width: 30px
        font-size: 18px
        align-self: center
      .svg_wrapper
        margin-right: 10px
      .option_wrapper
        min-width: 200px
        max-width: 300px
      .tag_wrapper
        width: 100%
        display: flex
        flex-wrap: wrap
      .specie_name
        margin: 0
        padding-bottom: 2px
      .dataset_name
        background: $MAIN_COLOR
        color: white
        padding: 5px
        border-radius: 5px
        cursor: pointer
        margin: 0 3px 3px 0
        display: inline-block
        white-space: nowrap
        &:hover
          background: #095493
</style>
