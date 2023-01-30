<template>
  <li v-if="getPageType === 'project'">
    <div class="nav_item">
      <div class="specie_wrapper">
        <p>{{ symbol.symbol || symbol.Description }}</p>
      </div>
    </div>
    <div class="nav_frame -before"></div>
    <div class="nav_frame -after"></div>
  </li>
</template>

<script>
  export default {
    components: {},
    props: {
      getPageType: {
        type: String,
        default: '',
      },
      symbol: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {};
    },
    computed: {},
    methods: {},
  };
</script>

<style lang="sass" scoped>
  .nav_area
    > li
      &:hover
        background-color: #095493
        .nav_frame.-after
          background-color: #095493
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
    > li
      > div
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
</style>
