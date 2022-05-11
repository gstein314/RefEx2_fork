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
      toggleDisplayOfFilter(key) {
        this.updateProjectFilters({
          key: 'is_displayed',
          filter:
            !this.filters.find(x => x.column === key)?.is_displayed || false,
          filterKey: key,
        });
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
