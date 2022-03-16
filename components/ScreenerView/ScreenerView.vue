<template>
  <div class="screener_wrapper" :class="{ open: is_screener_open }">
    <p class="screener_title" @click="toggleScreener">
      <font-awesome-icon icon="filter" class="filter" />
      Screener
      <font-awesome-icon
        icon="chevron-right"
        :class="is_screener_open ? 'open' : 'close'"
      />
    </p>
    <slot></slot>
  </div>
</template>
<script>
  /* eslint-disable vue/prop-name-casing */

  export default {
    data() {
      return {
        is_screener_open: false,
      };
    },
    methods: {
      toggleScreener() {
        this.is_screener_open = !this.is_screener_open;
      },
    },
  };
</script>
<style lang="sass" scoped>
  .screener_wrapper
    padding: 10px 34px
    box-shadow: 0 1px 4px rgba(62, 70, 82, .22)
    border-radius: 3px
    margin-top: 27px
    height: 42px
    overflow: hidden
    box-sizing: border-box
    &.open
      height: auto
      overflow: visible
  ::v-deep
    .vue-tags-input
      max-width: initial !important
      .ti-input
        +text_input
        padding: 10px
        border: none
        width: 100%
        .ti-tags
          height: 25px
          input
            padding: 10px 10px
          .ti-tag
            height: 24px
            background-color: $MAIN_COLOR
            padding: 3px 10px
            border-radius: 100px
            &.ti-deletion-mark
              background-color: #F24B56
          .ti-new-tag-input-wrapper
            height: 24px
            padding: 0
      .ti-item.ti-selected-item
        color: #ffffff
        background-color: $MAIN_COLOR
    p
      margin: 0
      &.screener_title
        margin-top: 3px
        display: flex
        align-items: center
        > svg
          font-size: 12px
          transition: .3s
          &.filter
            margin-right: 3px
          &.close,
          &.open
            margin-left: 10px
          &.open
            transform: rotate(90deg)
        &:hover
          cursor: pointer
    h3,h4
      display: flex
      gap: .5rem
      > span
        +sample_query
    input
      +text_input
      font-size: 22px
      &.text_search_go_term
        margin-bottom: 10px
    > .classification_wrapper
      border: 1px dashed $GRAY
      border-radius: 3px
      padding: 10px 30px
      margin-top: -7px
    .tag
      +ontology_tag
</style>
