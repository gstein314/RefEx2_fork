<template>
  <button
    :class="{ copy_btn_complete: isTextCopied }"
    class="copy_btn"
    @click="copyLink"
  >
    <font-awesome-icon :icon="icon" />
    {{ text }}
  </button>
</template>

<script>
  export default {
    props: {
      icon: {
        type: String,
        default: 'copy',
      },
      text: {
        type: String,
        default: 'Copy',
      },
    },
    data() {
      return {
        isTextCopied: false,
      };
    },
    methods: {
      copyLink() {
        navigator.clipboard.writeText(window.location.href);
        this.isTextCopied = true;
        setTimeout(() => {
          this.isTextCopied = !this.isTextCopied;
        }, '1000');
      },
    },
  };
</script>
<style lang="sass" scoped>
  .copy_btn
    +button
    position: relative
  .copy_btn_complete::before
    content: 'Copied'
    position: absolute
    background-color: $WARNING_BUTTON_COLOR
    color: $WHITE
    width: max-content
    padding: 10px
    top: 30px
    left: 0
    right: 0
    border-radius: 5px
    margin: auto
    z-index: $TOOLTIP_LAYER
  .copy_btn_complete::after
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
    z-index: $TOOLTIP_LAYER
</style>
