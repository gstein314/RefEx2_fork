<template>
  <nav class="nav_wrapper">
    <ul class="species_navi">
      <li
        v-for="specie in species"
        :key="specie.name"
        :class="{ active: activeSpecie.name === specie.name }"
        @click="$store.commit('set_specie', specie.name)"
      >
        <icon-base :icon-name="specie.name" />
        <div class="specie_wrapper">
          <p>{{ capitalizeAndTidy(specie.name) }}</p>
          <form>
            <select
              v-model="selectedProject[specie.name]"
              @change="
                $store.commit(
                  'set_active_project',
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
  import { mapGetters } from 'vuex';
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
        activeSpecie: 'active_specie',
      }),
    },
    methods: {
      capitalizeAndTidy(name) {
        return this.$firstLetterUppercase(name).replace('_', ' ');
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
          > .specie_wrapper
            > form
              > select
                color: $MAIN_COLOR
        &:hover
          opacity: 1
          cursor: pointer
          color: $MAIN_COLOR
          transition: 0.6s
          > .specie_wrapper
            > form
              > select
                cursor: pointer
                color: $MAIN_COLOR
                transition: 0.6s
                &:hover
                  background-color: $MAIN_COLOR
                  color: #fff
                  border-radius: $BORDER_RADIUS_DEFAULT
                  transition: 0.6s
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
            > select
              border: none
              color: $BLACK
              &:focus
                outline: none
</style>
