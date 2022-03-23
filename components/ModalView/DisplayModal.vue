<template>
  <modal-view @click.native="$emit('close')">
    <div class="modal display_settings_modal" @click.stop="">
      <p class="modal_title">
        <font-awesome-icon icon="eye" />
        Display settings
      </p>
      <div class="display_checkboxes">
        <div v-for="(value, key) of filters" :key="key">
          <input
            :checked="value.isDisplayed"
            type="checkbox"
            @click="updateFilterModal(key, value.isDisplayed)"
          />
          <label :for="value.innerKey"> {{ value.label }} </label>
        </div>
      </div>
    </div>
  </modal-view>
</template>
<script>
  import ModalView from '~/components/ModalView/ModalView.vue';
  import { mapGetters, mapMutations } from 'vuex';
  export default {
    components: {
      ModalView,
    },
    computed: {
      ...mapGetters({
        filters: 'project_filters',
      }),
    },
    methods: {
      ...mapMutations({
        updateProjectFilters: 'update_project_filters',
      }),
      updateFilterModal(filterKey, value) {
        this.updateProjectFilters({
          key: 'isDisplayed',
          filter: !value,
          filterKey,
        });
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
