<template>
  <modal-view v-if="loading">
    <div class="modal">
      <font-awesome-icon
        class="spinner fa-spin"
        :icon="['fad', 'spinner-third']"
      />
    </div>
  </modal-view>
</template>
<script>
  import ModalView from '~/components/ModalView/ModalView.vue';

  export default {
    components: {
      ModalView,
    },
    data: () => ({
      loading: false,
    }),
    methods: {
      start() {
        this.loading = true;
      },
      finish() {
        this.loading = false;
      },
    },
  };
</script>

<style lang="sass" scoped>
  .modal
    background: none !important
    > .spinner
        --fa-secondary-opacity: 0.6
        --fa-primary-color: #488EC4
        --fa-secondary-color: #F5F7F9
        --fa-animation-duration: 1.2s
        font-size: 100px
</style>
