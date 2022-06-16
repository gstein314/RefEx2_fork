<template>
  <modal-view v-if="error.isOn" @click.native="close({ bool: false })">
    <div class="modal" @click.stop>
      <div class="title">
        <p><font-awesome-icon icon="exclamation-triangle" />Error</p>
      </div>
      <div class="content">
        <p>An error has occured {{ error.msg }} Please try again later.</p>
        <button @click="close({ bool: false })">OK</button>
      </div>
    </div>
  </modal-view>
</template>
<script>
  import ModalView from '~/components/ModalView/ModalView.vue';
  import { mapMutations, mapGetters } from 'vuex';

  export default {
    components: {
      ModalView,
    },
    computed: {
      ...mapGetters({
        error: 'alert_modal',
      }),
    },
    methods: {
      ...mapMutations({
        close: 'set_alert_modal',
      }),
    },
  };
</script>

<style lang="sass" scoped>
  .modal
    color: $BLACK
    > .title
      font-weight: bold
      > p
        font-size: 18px
        color: $ERROR_COLOR
        margin: 0
        > .fa-exclamation-triangle
            font-size: 18px
            margin-right: 6px
            margin-top: 4px
    > .content
      > p
        padding: $PADDING_LARGE
        border-radius: $BORDER_RADIUS_DEFAULT
        font-size: 14px
      > button
        margin-left: auto
        +button
</style>
