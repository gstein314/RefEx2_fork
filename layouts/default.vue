<template>
  <div class="root">
    <script
      id="common-header-and-footer__script"
      type="text/javascript"
      src="https://dbcls.rois.ac.jp/DBCLS-common-header-footer/v2/script/common-header-and-footer.js"
      style="display: block"
      data-header-menu-type="deployed"
      data-width="auto"
      data-color="mono"
    ></script>
    <header>
      <div class="nav_wrapper">
        <div class="title">
          <p><em>Ref</em>erence <em>Ex</em>pression Dataset 2</p>
        </div>
        <h1
          alt="Reference Expression Dataset 2"
          @click="$store.commit('set_active_filter', 'gene')"
        >
          <nuxt-link to="/">
            <img
              class="logotype"
              src="~/assets/img/refex-logotype.svg"
              alt="Refex"
            />
          </nuxt-link>
        </h1>
        <nav>
          <ul>
            <li>
              <nuxt-link to="/about" class="category">About</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/help" class="category">Help</nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <Nuxt />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isAbout: true,
        isHelp: false,
      };
    },
    mounted() {
      Typekit.load({ async: true });
    },
  };
</script>

<style lang="sass">
  html
    font-family: Helvetica,sans-serif
    font-weight: 400
    color: $BLACK
    box-sizing: border-box
    *
      &::-webkit-scrollbar-thumb
        box-shadow: inset 0 0 8px 8px rgb(188, 188, 188, 0.8)
        border-radius: 15px
        border: solid 5px transparent
      &::-webkit-scrollbar
        width: 15px
    .root
      height: calc(100vh - 24px)
      overflow: auto
    ul
      list-style: none
    header
      border-top: 8px solid $MAIN_COLOR
      left: 0
      position: sticky
      width: 100%
      text-align: center
      > .nav_wrapper
        padding: $PADDING_WRAPPER
        display: flex
        justify-content: space-between
        > h1
          margin-bottom: 0
          width: 100%
          text-align: center
          > a
            > img.logotype
              width: 60px
        > .title
          margin: auto 0
          width: 100%
          text-align: left
          > p
            margin: 0
            font-weight: bold
            font-family: "Futura"
            font-weight: normal
            font-size: 21px
            color: $GRAY
            > em
              color: $BLACK
              font-style: normal
        > nav
          margin: auto 0
          width: 100%
          > ul
            display: flex
            gap: 1rem
            padding: 0
            flex-direction: row-reverse
            > li
              > a
                text-decoration: none
                font-weight: bold
                font-size: 18px
                color: #C5C7CBs
                &.nuxt-link-exact-active.nuxt-link-active
                  color: $MAIN_COLOR
    h2
      font-size: 20px
      font-weight:600
    h3
      font-size: 16px
      font-weight:500
    h4
      font-size: 14px
      font-weight:500
    .category
      color: gray
</style>
