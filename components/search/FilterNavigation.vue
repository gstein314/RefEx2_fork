<template>
  <div class="nav_wrapper">
    <ul>
      <li
        v-for="(filter, index) of filters"
        :key="index"
        :class="{ active: activeFilter === filter }"
        @click="$store.commit('set_active_filter', filter)"
      >
        {{ filter }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        filters: ['gene', 'sample'],
      };
    },
    computed: {
      activeFilter() {
        return this.$store.state.active_filter;
      },
    },
  };
</script>
<style lang="sass" scoped>
  .nav_wrapper
      background-color: $MAIN_COLOR
      display: flex
      justify-content: center
      align-items: center
      padding-top: 0.4rem
      ul
          display: flex
          margin: 0
          padding: 0
          gap: 0.1rem
          > li
              text-transform: capitalize
              font-weight: bold
              min-width: 10rem
              max-width: min-content
              text-align: center
              padding: $PADDING_LARGE
              padding-top: 0.6rem
              border-top-left-radius: $BORDER_RADIUS_DEFAULT
              border-top-right-radius: $BORDER_RADIUS_DEFAULT
              background-color: rgba(255, 255, 255, 0.5)
              &.active
                  background-color: white
              &:hover:not(.active)
                  cursor: pointer
                  color: $MAIN_COLOR
                  background: rgba(255, 255, 255, 0.8)
                  transition: 0.6s
</style>
