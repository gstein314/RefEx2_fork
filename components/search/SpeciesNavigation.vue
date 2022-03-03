<template>
  <nav class="nav_wrapper">
    <ul class="species_navi">
      <li
        v-for="specie in species"
        :key="specie.name"
        :class="{ active: $store.state.active_taxon === specie.name }"
        @click="$store.commit('setTaxon', specie.name)"
      >
        <icon-base :icon-name="specie.name" />
        <div class="taxon_wrapper">
          <p>{{ MakeNameUpperCase(specie.name) }}</p>
          <form>
            <select v-model="selected_project[specie.name]">
              <option
                v-for="project in specie.projects"
                :key="specie.name + project"
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
        selected_project: species.reduce((acc, specie) => {
          acc[specie.name] = specie.projects[0];
          return acc;
        }, {}),
      };
    },
    computed: {
      active_taxon() {
        return this.$store.state.active_taxon;
      },
      selected_organization() {
        return this.selected_project[this.active_taxon];
      },
    },
    watch: {
      selected_organization(org) {
        this.$store.commit('setActiveOrganization', org);
      },
    },
    methods: {
      MakeNameUpperCase(name) {
        let adjusted_name = name.charAt(0).toUpperCase() + name.slice(1);
        return adjusted_name.replace('_', ' ');
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
