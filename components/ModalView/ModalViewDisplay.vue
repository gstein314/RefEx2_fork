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
      <div class="display_pagination">
        <label for="pagination">Items per page</label>
        <select id="pagination" name="pagination" @change="setLimit">
          <option
            v-for="n in [10, 20, 50, 100]"
            :key="`pagination-limit-${n}`"
            :value="n"
            :selected="n === currentLimit"
          >
            {{ n }}
          </option>
        </select>
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
        paginationObject: 'get_project_pagination',
      }),
      currentLimit() {
        return this.paginationObject.limit;
      },
    },
    methods: {
      ...mapMutations({
        updateProjectFilters: 'update_project_filters',
        updatePagination: 'set_project_pagination',
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
      setLimit(e) {
        const newLimit = +e.target.value;
        const newPage = Math.max(
          Math.ceil(this.paginationObject.offset / newLimit),
          1
        );
        const newOffset = (newPage - 1) * newLimit;

        this.updatePagination({ limit: newLimit, offset: newOffset });
      },
    },
  };
</script>
<style lang="sass" scoped>
  .display_settings_modal
    width: 400px
    > .display_checkboxes
      column-count: 2
      > div
        width: 100%
        display: inline-block
        line-height: 26px
        > label
          font-size: 14px
    > .display_pagination
      margin-top: 1rem
</style>
