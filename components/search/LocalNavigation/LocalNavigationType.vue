<template>
  <li :class="{ isOpenType }" @click.stop="$emit('eventUpdateIsOpenType')">
    <div class="nav_item">
      <font-awesome-icon v-if="activeFilterName === 'gene'" icon="dna" />
      <font-awesome-icon v-if="activeFilterName === 'sample'" icon="flask" />
      <div class="specie_wrapper">
        <p>
          {{ $firstLetterUppercase(activeFilterName)
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
    <local-navigation-dropdown :is-open-type="isOpenType" />
  </li>
</template>

<script>
  import LocalNavigationDropdown from './LocalNavigationDropdown.vue';

  export default {
    components: {
      LocalNavigationDropdown,
    },
    props: {
      activeFilterName: {
        type: String,
        default: '',
      },
      getPageType: {
        type: String,
        default: '',
      },
      isOpenType: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {};
    },
    computed: {},
    mounted() {},
    methods: {},
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
</style>
