<template>
  <div class="nav_wrapper">
    <ul class="species_navi">
      <li v-for="specie in species" :key="specie.name" :class="{ active: $store.state.active_taxon === specie.name}" @click="$store.commit('setTaxon', specie.name)">
        <img :src="GetSpecieImage(specie.name)" :alt="specie.name">
        <div class="taxon_wrapper">
          <p>{{ MakeNameUpperCase(specie.name) }}</p>
          <form>
            <select v-model="selected_project[specie.name]">
              <option v-for="project in specie.projects" :key="specie.name + project" :value="project"
              >{{ project }}</option>
            </select>
          </form>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      species: [
        {
          name: "homo_sapiens",
          projects: ["FANTOM5"]
        },
        {
          name: "mus_musculus",
          projects: ["FANTOM5"]
        }
      ],
      selected_project: {
        "homo_sapiens": "FANTOM5",
        "mus_musculus": "FANTOM5"
      }
    }
  },
  methods: {
    MakeNameUpperCase (name) {
      let adjusted_name = name.charAt(0).toUpperCase() + name.slice(1)
      return adjusted_name.replace('_', ' ')
    },
    GetSpecieImage(specie_name) {
      return require(`~/assets/img/icon_${specie_name}.svg`);
    },
  }
}
</script>

<style lang="sass">
.nav_wrapper
  width: 100vw
  border-bottom: 1px solid $BLACK
  margin: -10px 0 0px
  .species_navi
    max-width: 1000px
    display: flex
    margin: 0 auto
    > li
      display: flex
      align-self: flex-end
      margin-right: 36px
      opacity: .3
      &.active
        opacity: 1
      &:hover
        cursor: pointer
      > img
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
