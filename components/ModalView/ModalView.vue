<template>
  <transition name="modal_bg">
    <div class="modal_bg">
      <transition name="modal">
        <slot></slot>
      </transition>
    </div>
  </transition>
</template>
<style lang="sass" scoped>
  .modal_bg
    +modal_bg
    ::v-deep
      .modal
        +modal
        > p.modal_title
          font-size: 18px
          display: inline-block
        > button
          +button
          display: inline-block
          margin-left: 10px
  // transition
  .modal-enter,
  .modal-leave-to
    opacity: 0
    margin-top: -20px
  .modal-enter-active,
  .modal-leave-active
    transition: opacity 0.4s, margin-top 0.4s
  .modal_bg-enter,
  .modal_bg-leave-to
    opacity: 0
  .modal_bg-enter-active,
  .modal_bg-leave-active
    transition: opacity 0.4s
</style>
