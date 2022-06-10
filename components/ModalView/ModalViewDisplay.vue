<template>
  <modal-view>
    <div class="modal display_settings_modal" @click.stop="">
      <p class="modal_title">
        <font-awesome-icon icon="eye" />
        Display settings
      </p>
      <div class="display_checkboxes">
        <div v-for="(value, filterIndex) of filters" :key="filterIndex">
          <input
            :checked="value.is_displayed"
            type="checkbox"
            @click="toggleDisplayOfFilter(value.column)"
          />
          <label :for="value.innerKey"> {{ value.label }} </label>
        </div>
      </div>
      <div v-if="!indexFilters" class="display_pagination">
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
    props: {
      // eslint-disable-next-line vue/require-default-prop
      indexFilters: {
        type: Array,
        required: false,
      },
    },
    computed: {
      ...mapGetters({
        projectFilters: 'project_filters',
        paginationObject: 'get_project_pagination',
      }),
      filters() {
        return this.indexFilters ?? this.projectFilters;
      },
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
        // in case of indexFilters , call parent element
        // in case of project filters, call upon store mutation
        if (this.indexFilters) {
          this.$emit('updateDisplaySettings', key);
        } else {
          this.updateProjectFilters({
            key: 'is_displayed',
            filter:
              !this.filters.find(x => x.column === key)?.is_displayed || false,
            filterKey: key,
          });
        }
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
