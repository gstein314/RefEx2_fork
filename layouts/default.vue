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
          <h3><em>Ref</em>erence <em>Ex</em>pression Dataset</h3>
        </div>
        <h1>
          <nuxt-link to="/">
            <img
              class="logotype"
              src="~/assets/img/refex-logotype.png"
              alt="Refex"
            />
          </nuxt-link>
        </h1>
        <nav>
          <ul>
            <li><nuxt-link to="/about">About</nuxt-link></li>
            <li><nuxt-link to="/help">Help</nuxt-link></li>
          </ul>
        </nav>
      </div>
    </header>
    <Nuxt />
  </div>
</template>

<script>
  export default {
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
      height: 100vh
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
        padding: 0 90px
        display: flex
        justify-content: space-between
        > h1
          margin-bottom: 0
          > a
            > img.logotype
              width: 60px
        > .title
          margin: auto 0
          > h3
            margin: 0
            font-weight: bold
            font-family: "Times New Roman"
            font-weight: normal
            font-size: 24px
            color: $GRAY
            > em
              color: $BLACK
              font-style: normal
        > nav
          margin: auto 0
          > ul
            display: flex
            gap: 1rem
            padding: 0
            > li
              > a
                text-decoration: none
                font-weight: bold
                font-size: 18px
                color: $BLACK
    h2
      font-size: 20px
      font-weight:600
    h3
      font-size: 16px
      font-weight:500
    h4
      font-size: 14px
      font-weight:500
</style>
