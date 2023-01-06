<template>
  <nav class="nav_wrapper">
    <ul class="species_navi">
      <li @click="updateSpecie(specie.species)">
        <icon-base :icon-name="species[0].species" />
        <div class="specie_wrapper">
          <p class="title">Dataset</p>
          <p>{{ species[0].species }}</p>
          <p>
            {{ species[0].datasets[0].label
            }}<font-awesome-icon icon="fa-angle-down" />
          </p>

          <!-- <form>
            <select
              v-model="selectedProject[specie.species]"
              class="specie_select"
              @change="updateActiveDataset(selectedProject[specie.species])"
            >
              <option
                v-for="(project, index) of specie.datasets"
                :key="index"
                :value="project.dataset"
              >
                {{ project.label }}
              </option>
            </select>
          </form> -->
        </div>
      </li>
      <li>
        <font-awesome-icon icon="flask" />
        <div class="specie_wrapper">
          <p>Sample<font-awesome-icon icon="fa-angle-down" /></p>
        </div>
      </li>
      <li>
        <div class="specie_wrapper">
          <p class="title">Gene symbol</p>
          <p>testicular germ cell embryonal carcinoma cell line: NEC8</p>
        </div>
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
    data() {
      return {
        species: datasets,
        selectedProject: datasets.reduce((acc, specie) => {
          acc[specie.species] = specie.datasets[0].dataset;
          return acc;
        }, {}),
      };
    },
    computed: {
      ...mapGetters({
        activeSpecie: 'active_specie',
      }),
    },
    methods: {
      ...mapMutations({
        setSpecie: 'set_specie',
        setActiveDataset: 'set_active_dataset',
      }),
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
    },
  };
</script>

<style lang="sass" scoped>
  .nav_wrapper
    margin: -0px 0 0px
    .species_navi
      padding: $PADDING_WRAPPER
      margin: 0
      display: flex
      background-color: $MAIN_COLOR
      height: 85px
      list-style-type: none
      width: 100%
      margin: 0
      overflow: hidden
      > li
        position: relative
        color: #fff
        display: grid
        grid-template-columns: auto 1fr
        align-content: center
        padding: 10px 0px 10px 30px
        &:hover
          background-color: #095493
          &:after
            border-color: transparent transparent transparent #095493
        &:before,
        &:after
          content: ""
          position: absolute
          width: 0
          height: 0
          margin: auto
        &:before
          top: -12px
          right: -1em
          border-style: solid
          border-color: transparent transparent transparent #fff
          border-width: 55px 0 55px 1em
          z-index: 1
        &:after
          top: -12px
          right: -.9em
          border-style: solid
          border-color: transparent transparent transparent $MAIN_COLOR
          border-width: 55px 0 55px 1em
          z-index: 1
        > svg
          font-size: 24px
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
          align-self: flex-end
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
</style>
