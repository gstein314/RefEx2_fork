<template>
  <nav class="nav_wrapper">
    <ul class="species_navi">
      <li
        v-for="specie in species"
        :key="specie.species"
        :class="{
          active: activeSpecie.species === specie.species,
        }"
        @click="updateSpecie(specie.species)"
      >
        <icon-base :icon-name="specie.species" />
        <div class="specie_wrapper">
          <p>{{ specie.species }}</p>
          <form>
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
          </form>
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
    margin: -10px 0 0px
    .species_navi
      padding: 0 90px
      margin: 0
      gap: 3rem
      display: flex
      > li
        display: grid
        grid-template-columns: auto 1fr
        opacity: .3
        > .specie_wrapper
          > form
            > .specie_select
              color: $BLACK
        &.active
          color: $MAIN_COLOR
          opacity: 1
          > .specie_wrapper
            > form
              > .specie_select
                color: $MAIN_COLOR
        &:hover
          opacity: 1
          cursor: pointer
          color: $MAIN_COLOR
          transition: 0.6s
          > .specie_wrapper
            > form
              > .specie_select
                color: $MAIN_COLOR
        > svg
          align-self: flex-end
        > .specie_wrapper
          display: flex
          flex-direction: column
          align-self: flex-end
          margin: 6px 15px 6px 10px
          font-size: 18px
          > p
            margin: 0
          > form
            margin-left: -4px
            > .specie_select
              +select
              background: none
              font-size: inherit
              width: auto
</style>
