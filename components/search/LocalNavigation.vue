<template>
  <nav class="nav_wrapper">
    <ul class="nav_area">
      <li :class="{ isOpenDataset }" @click.stop="updateIsOpenDataset">
        <div class="nav_item">
          <icon-base :icon-name="activeSpecie.species" />
          <div class="specie_wrapper">
            <p class="title">Dataset</p>
            <p>{{ activeSpecie.species }}</p>
            <p>
              {{ activeDataset.label
              }}<font-awesome-icon
                v-if="getPageType === 'index' && isOpenDataset"
                icon="fa-angle-down"
              /><font-awesome-icon
                v-else-if="getPageType === 'index' && !isOpenDataset"
                icon="fa-angle-up"
              />
            </p>
          </div>
        </div>
        <div class="nav_frame -before"></div>
        <div class="nav_frame -after"></div>
        <div class="dropdown_list" :class="{ isOpenDataset }">
          <li>
            <icon-base :icon-name="'Human'" />
            <div>
              <p>Human</p>
              <span class="dataset_name" @click="updateSpecie('Human')"
                >FANTOM5</span
              >
              <span class="dataset_name" @click="test()">GTEx</span>
            </div>
          </li>
          <li>
            <icon-base :icon-name="'Mouse'" />
            <div>
              <p>Mouse</p>
              <span class="dataset_name" @click="updateSpecie('Mouse')"
                >FANTOM5</span
              >
            </div>
          </li>
        </div>
      </li>
      <li
        v-if="activeFilter.name === 'gene'"
        :class="{ isOpenType }"
        @click.stop="updateIsOpenType"
      >
        <div class="nav_item">
          <font-awesome-icon icon="dna" />
          <div class="specie_wrapper">
            <p>
              {{ $firstLetterUppercase(activeFilter.name)
              }}<font-awesome-icon
                v-if="getPageType === 'index' && isOpenType"
                icon="fa-angle-down"
              /><font-awesome-icon
                v-else-if="getPageType === 'index' && !isOpenType"
                icon="fa-angle-up"
              />
            </p>
          </div>
        </div>
        <div class="nav_frame -before"></div>
        <div class="nav_frame -after"></div>
        <div class="dropdown_list" :class="{ isOpenType }">
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
        </div>
      </li>
      <li
        v-if="activeFilter.name === 'sample'"
        :class="{ isOpenType }"
        @click.stop="updateIsOpenType"
      >
        <div class="nav_item">
          <font-awesome-icon icon="flask" />
          <div class="specie_wrapper">
            <p>
              {{ $firstLetterUppercase(activeFilter.name)
              }}<font-awesome-icon
                v-if="getPageType === 'index' && isOpenType"
                icon="fa-angle-down"
              /><font-awesome-icon
                v-else-if="getPageType === 'index' && !isOpenType"
                icon="fa-angle-up"
              />
            </p>
          </div>
        </div>
        <div class="nav_frame -before"></div>
        <div class="nav_frame -after"></div>
        <div class="dropdown_list" :class="{ isOpenType }">
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
        </div>
      </li>
      <li v-if="getPageType === 'project'">
        <div class="nav_item">
          <div class="specie_wrapper">
            <p>{{ symbol.symbol || symbol.Description }}</p>
          </div>
        </div>
        <div class="nav_frame -before"></div>
        <div class="nav_frame -after"></div>
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
        isOpenDataset: false,
        isOpenType: false,
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
    created() {
      this.setSpecie(this.activeSpecie.species);
      // this.setActiveDataset(this.activeDataset);
      this.setActiveFilter(this.activeFilter.name);
    },
    mounted() {
      window.addEventListener('click', this.closeDropDown);
    },
    beforeDestroy() {
      window.removeEventListener('click', this._onBlurHandler);
    },
    methods: {
      ...mapMutations({
        setSpecie: 'set_specie',
        setActiveDataset: 'set_active_dataset',
        setActiveFilter: 'set_active_filter',
      }),
      closeDropDown(event) {
        if (!this.$el.querySelector('.dropdown_list').contains(event.target)) {
          this.isOpenDataset = false;
          this.isOpenType = false;
        }
      },
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
      updateIsOpenDataset() {
        if (this.getPageType === 'project') {
          window.location.href = '/';
          window.open('/');
        } else {
          this.isOpenType = false;
          this.isOpenDataset = !this.isOpenDataset;
        }
      },
      updateIsOpenType() {
        if (this.getPageType === 'project') {
          window.location.href = '/';
          window.open('/');
        } else {
          this.isOpenDataset = false;
          this.isOpenType = !this.isOpenType;
        }
      },
    },
  };
</script>

<style lang="sass" scoped>
  .nav_wrapper
    margin: 0
    position: sticky
    z-index: 2
    top: 0
    .nav_area
      padding: $PADDING_WRAPPER
      margin: 0
      display: flex
      background-color: $MAIN_COLOR
      height: 70px
      list-style-type: none
      width: 100%
      margin: 0
      > li
        cursor: pointer
        position: relative
        color: #fff
        display: flex
        padding-left: 10px
        &.isOpenDataset, &.isOpenType
          background-color: #095493
          .nav_frame.-after
            background-color: #095493
        &:hover
          background-color: #095493
          .nav_frame.-after
            background-color: #095493
        &:nth-child(n + 2)
          padding-left: 30px
        &:nth-child(3)
          cursor: auto
        > .nav_frame.-before
          position: absolute
          right: -20px
          height: 100%
          z-index: 1
          width: 50px
          background: white
          clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0 50%, 0% 0%)
        > .nav_frame.-after
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
        > .nav_item
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
            font-size: 24px
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
  .dropdown_list
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
    cursor: auto
    > .active_type:hover
        color: white
        background-color: $MAIN_COLOR
        border-radius: 5px
        cursor: pointer
    > li
      color: black
      min-width: 200px
      border-bottom: 1px solid #fff
      display: grid
      grid-template-columns: 30px 1fr
      align-content: center
      > svg
        width: 30px
        font-size: 18px
        align-self: center
      > div
        padding: 0 10px
        > p
          margin: 0
          padding-bottom: 10px
        > .dataset_name
          background: $MAIN_COLOR
          color: white
          padding: 5px
          border-radius: 5px
          cursor: pointer
          margin-bottom: 3px
          display: inline-block
          &:hover
            background: #095493
  .isOpenDataset
    display: block
  .isOpenType
    display: block
</style>
