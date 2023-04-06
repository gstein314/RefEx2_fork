<template>
  <button
    :class="{ share_btn_complete: copyText }"
    class="share_btn"
    @click="copyLink"
  >
    <font-awesome-icon icon="link" />
    Share
  </button>
</template>

<script>
  export default {
    data() {
      return {
        copyText: false,
      };
    },
    methods: {
      copyLink() {
        navigator.clipboard.writeText(window.location.href);
        this.copyText = true;
        setTimeout(() => {
          this.copyText = !this.copyText;
        }, '1000');
      },
    },
  };
</script>
<style lang="sass" scoped>
  .share_btn
    +button
    position: relative
  .share_btn_complete::before
    content: 'Copied'
    position: absolute
    background-color: $WARNING_BUTTON_COLOR
    color: $WHITE
    width: max-content
    padding: 5px
    top: 30px
    left: 0
    right: 0
    border-radius: 5px
    margin: auto
  .share_btn_complete::after
    content: ''
    position: absolute
    background-color: $WARNING_BUTTON_COLOR
    width: 10px
    height: 10px
    left: 0
    right: 0
    margin: auto
    top: 27px
    clip-path: polygon(50% 0,100% 50%,0% 50%)
</style>
