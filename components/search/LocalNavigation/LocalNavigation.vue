<template>
  <nav class="nav_wrapper">
    <ul class="nav_area">
      <local-navigation-dataset
        :active-dataset="activeDataset"
        :get-page-type="getPageType"
        :is-open-dataset="isOpenDataset"
        @eventUpdateIsOpenDataset="updateIsOpenDataset"
      />
      <local-navigation-type
        :active-filter-name="activeFilter.name"
        :get-page-type="getPageType"
        :is-open-type="isOpenType"
        @eventUpdateIsOpenType="updateIsOpenType"
      />
      <local-navigation-name :get-page-type="getPageType" :symbol="symbol" />
    </ul>
  </nav>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import LocalNavigationDataset from './LocalNavigationDataset.vue';
  import LocalNavigationType from './LocalNavigationType.vue';
  import LocalNavigationName from './LocalNavigationName.vue';

  export default {
    components: {
      LocalNavigationDataset,
      LocalNavigationType,
      LocalNavigationName,
    },
    props: {
      symbol: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        isOpenDataset: false,
        isOpenType: false,
      };
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
        activeFilter: 'active_filter',
        getPageType: 'get_page_type',
      }),
    },
    mounted() {
      window.addEventListener('click', this.closeDropDown);
      // this.setActiveDataset(this.activeDataset);
      this.setActiveFilter(this.activeFilter.name);
    },
    beforeDestroy() {
      window.removeEventListener('click', this._onBlurHandler);
    },
    methods: {
      ...mapMutations({
        setActiveFilter: 'set_active_filter',
      }),
      updateIsOpenDataset() {
        if (this.getPageType === 'project') {
          this.$router.push('/');
        } else {
          this.isOpenType = false;
          this.isOpenDataset = !this.isOpenDataset;
        }
      },
      updateIsOpenType() {
        if (this.getPageType === 'project') {
          this.$router.push('/');
        } else {
          this.isOpenDataset = false;
          this.isOpenType = !this.isOpenType;
        }
      },
      closeDropDown(event) {
        if (!this.$el.querySelector('.dropdown_list').contains(event.target)) {
          this.isOpenDataset = false;
          this.isOpenType = false;
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
</style>
