<template>
  <modal-view>
    <div class="modal display_settings_modal" @click.stop="">
      <p class="modal_title">
        <font-awesome-icon icon="eye" />
        Display settings
      </p>
      <div class="display_checkboxes">
        <div v-for="value of filters" :key="value.column">
          <input
            :checked="value.is_displayed"
            type="checkbox"
            @click="toggleDisplayOfFilter(value.column)"
          />
          <label :for="value.innerKey"> {{ value.label }} </label>
        </div>
      </div>
    </div>
  </modal-view>
</template>
<script>
  import ModalView from '~/components/ModalView/ModalView.vue';
  export default {
    components: {
      ModalView,
    },
    props: {
      filters: {
        type: Array,
        default: () => [],
      },
    },
    methods: {
      toggleDisplayOfFilter(key) {
        const copy = JSON.parse(JSON.stringify(this.filters));
        const itemIndex = this.filters.findIndex(item => item.column === key);
        copy[itemIndex].is_displayed = !copy[itemIndex].is_displayed;
        this.$emit('toggleDisplayOfFilter', copy);
      },
      toggleDisplaySettings() {
        this.isDisplaySettings = !this.isDisplaySettings;
      },
    },
  };
</script>
<style lang="sass" scoped>
  .display_settigs_modal
    width: 400px
    > .display_checkboxes
      column-count: 2
      > div
        width: 100%
        display: inline-block
        line-height: 26px
        > label
          font-size: 14px
</style>
