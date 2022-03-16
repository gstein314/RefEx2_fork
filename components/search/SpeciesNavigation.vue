<template>
  <nav class="nav_wrapper">
    <ul class="species_navi">
      <li
        v-for="specie in species"
        :key="specie.name"
        :class="{ active: activeTaxon.name === specie.name }"
        @click="$store.commit('set_taxon', specie.name)"
      >
        <icon-base :icon-name="specie.name" />
        <div class="taxon_wrapper">
          <p>{{ MakeNameUpperCase(specie.name) }}</p>
          <form>
            <select
              v-model="selectedProject[specie.name]"
              @change="
                $store.commit(
                  'set_active_organization',
                  selectedProject[specie.name]
                )
              "
            >
              <option
                v-for="project in specie.projects"
                :key="`${specie.name}_${project}`"
                :value="project"
              >
                {{ project }}
              </option>
            </select>
          </form>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
  import species from '~/static/species.json';
  import IconBase from '~/components/icons/IconBase.vue';

  export default {
    components: {
      IconBase,
    },
    data() {
      return {
        species,
        selectedProject: species.reduce((acc, specie) => {
          acc[specie.name] = specie.projects[0];
          return acc;
        }, {}),
      };
    },
    computed: {
      ...mapGetters({
        activeTaxon: 'active_taxon',
      }),
    },
    methods: {
      MakeNameUpperCase(name) {
        return this.$firstLetterUppercase(name).replace('_', ' ');
      },
      GetSpecieImage(specie_name) {
        return require(`~/assets/img/icon_${specie_name}.svg`);
      },
    },
  };
</script>

<style lang="sass" scoped>
  .nav_wrapper
    width: 100vw
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
        &.active
          color: $MAIN_COLOR
          opacity: 1
          *
            opacity: 1
            color: $MAIN_COLOR
        &:hover
          cursor: pointer
        > svg
          align-self: flex-end
        > .taxon_wrapper
          display: flex
          flex-direction: column
          align-self: flex-end
          margin: 6px 15px 6px 10px
          font-size: 18px
          > p
            margin: 0
          > form
            margin-left: -4px
            > select
              border: none
              &:focus
                outline: none
</style>
