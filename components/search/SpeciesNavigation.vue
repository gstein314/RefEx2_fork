<template>
  <nav class="nav_wrapper">
    <ul class="species_navi">
      <li @click="updateIsOpenA">
        <div class="box">
          <icon-base :icon-name="activeSpecie.species" />
          <div class="specie_wrapper">
            <p class="title">Dataset</p>
            <p>{{ activeSpecie.species }}</p>
            <p>
              {{ activeDataset.label
              }}<font-awesome-icon
                v-if="isOpenA"
                icon="fa-angle-down"
              /><font-awesome-icon v-else icon="fa-angle-up" />
            </p>
          </div>
        </div>
        <div class="test -a"></div>
        <div class="test -b"></div>
        <div class="dropdown" :class="{ isOpenA }">
          <li @click="updateSpecie('Human')">Human FANTOM5</li>
          <li @click="test()">Human GTEx</li>
          <li @click="updateSpecie('Mouse')">Mouse</li>
        </div>
      </li>
      <li v-if="activeFilter.name === 'gene'" @click="updateIsOpenB">
        <div class="box">
          <font-awesome-icon icon="dna" />
          <div class="specie_wrapper">
            <p>
              {{ $firstLetterUppercase(activeFilter.name)
              }}<font-awesome-icon
                v-if="isOpenB"
                icon="fa-angle-down"
              /><font-awesome-icon v-else icon="fa-angle-up" />
            </p>
          </div>
        </div>
        <div class="test -a"></div>
        <div class="test -b"></div>
        <div class="dropdown" :class="{ isOpenB }">
          <li @click="$store.commit('set_active_filter', 'gene')">Gene</li>
          <li @click="$store.commit('set_active_filter', 'sample')">Sample</li>
        </div>
      </li>
      <li v-if="activeFilter.name === 'sample'" @click="updateIsOpenB">
        <div class="box">
          <font-awesome-icon icon="flask" />
          <div class="specie_wrapper">
            <p>
              {{ $firstLetterUppercase(activeFilter.name)
              }}<font-awesome-icon
                v-if="isOpenB"
                icon="fa-angle-down"
              /><font-awesome-icon v-else icon="fa-angle-up" />
            </p>
          </div>
        </div>
        <div class="test -a"></div>
        <div class="test -b"></div>
        <div class="dropdown" :class="{ isOpenB }">
          <li @click="$store.commit('set_active_filter', 'gene')">Gene</li>
          <li @click="$store.commit('set_active_filter', 'sample')">Sample</li>
        </div>
      </li>
      <li v-if="getPageType === 'project'">
        <div class="box">
          <div class="specie_wrapper">
            <p class="title">
              {{ activeFilter.name === 'gene' ? 'Sample' : 'Gene' }}
              Symbol
            </p>
            <p>{{ symbol.name || symbol.symbol || symbol.Description }}</p>
          </div>
        </div>
        <div class="test -a"></div>
        <div class="test -b"></div>
      </li>
    </ul>
  </nav>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import datasets from '~/refex-sample/datasets.json';
  import IconBase from '~/components/icons/IconBase.vue';

  export default {
    components: {
      IconBase,
    },
    props: {
      symbol: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        species: datasets,
        isOpenA: false,
        isOpenB: false,
        selectedProject: datasets.reduce((acc, specie) => {
          acc[specie.species] = specie.datasets[0].dataset;
          return acc;
        }, {}),
      };
    },
    computed: {
      ...mapGetters({
        activeSpecie: 'active_specie',
        activeDataset: 'active_dataset',
        activeFilter: 'active_filter',
        getPageType: 'get_page_type',
      }),
    },
    methods: {
      ...mapMutations({
        setSpecie: 'set_specie',
        setActiveDataset: 'set_active_dataset',
      }),
      test() {
        this.selectedProject = { Human: 'gtexV8' };
        this.updateSpecie('Human');
        this.selectedProject = datasets.reduce((acc, specie) => {
          acc[specie.species] = specie.datasets[0].dataset;
          return acc;
        }, {});
      },
      updateActiveDataset(datasetId) {
        this.setActiveDataset(
          this.activeSpecie.datasets.find(
            dataset => dataset.dataset === datasetId
          )
        );
      },
      updateSpecie(specieId) {
        this.setSpecie(specieId);
        this.updateActiveDataset(this.selectedProject[specieId]);
      },
      updateIsOpenA() {
        this.isOpenB = false;
        this.isOpenA = !this.isOpenA;
      },
      updateIsOpenB() {
        this.isOpenA = false;
        this.isOpenB = !this.isOpenB;
      },
    },
  };
</script>

<style lang="sass" scoped>
  .nav_wrapper
    margin: 0
    position: sticky
    z-index: 1
    .species_navi
      padding: $PADDING_WRAPPER
      margin: 0
      display: flex
      background-color: $MAIN_COLOR
      height: 85px
      list-style-type: none
      width: 100%
      margin: 0
      > li
        cursor: pointer
        position: relative
        color: #fff
        display: flex
        padding-left: 10px
        &:hover
          background-color: #095493
          .test.-b
            background-color: #095493
        &:nth-child(n + 2)
          padding-left: 30px
        &:nth-child(3)
          cursor: auto
        > .test.-a
          position: absolute
          right: -20px
          height: 100%
          z-index: 1
          width: 50px
          background: white
          clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0 50%, 0% 0%)
        > .test.-b
          right: -18px
          height: 100%
          z-index: 1
          width: 20px
          position: absolute
          width: 50px
          height: 100%
          background-color: $MAIN_COLOR
          clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0 50%, 0% 0%)
        > svg
          font-size: 24px
        > .box
          display: grid
          grid-template-columns: auto 1fr
          align-content: center
          z-index: 2
          > .specie_wrapper
            overflow: hidden
            display: -webkit-box
            -webkit-box-orient: vertical
            -webkit-line-clamp: 3
            > .title
              font-size: 12px
              font-weight: bold
            > form
              > .specie_select
                color: $BLACK
            > p
              position: relative
              font-weight: bold
              > svg
                font-size: 12px
                padding-left: 4px
          > svg
            align-self: center
          > .specie_wrapper
            flex-direction: column
            align-self: flex-end
            margin: 0 5px
            font-size: 18px
            > p
              margin: 0
            > form
              margin-left: -4px
              > .specie_select
                +select
                padding: 0
                background: none
                font-size: inherit
                width: auto
  .dropdown
    position: absolute
    top: 100%
    left: 0
    display: none
    padding: 0
    list-style-type: none
    background-color: white
    z-index: 999
    padding: 20px
    box-shadow: 0px 5px 15px -5px $BLACK
  .dropdown li
    color: black
    min-width: 200px
    border-bottom: 1px solid #fff
  .isOpenA
    display: block
  .isOpenB
    display: block
</style>
