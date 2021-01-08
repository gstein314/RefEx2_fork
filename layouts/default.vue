<template>
  <div>
    <header>
      <h1>
        <nuxt-link to="/">
          <img class="logotype" src="~/assets/img/refex-logotype.png" alt="Refex">
        </nuxt-link>
      </h1>
    </header>
    <Nuxt />
  </div>
</template>

<script>
export default {
  mounted() {
    Typekit.load({async: true})
  }
}
</script>

<style lang="sass">
html
  border-top: 8px solid $MAIN_COLOR
  font-family: futura-pt,sans-serif
  font-weight: 400
  color: $BLACK
  box-sizing: border-box
  ul
    list-style: none
  header
    width: 100%
    text-align: center
    > h1
      margin-bottom: 0
      > a
        > img.logotype
          width: 60px
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
