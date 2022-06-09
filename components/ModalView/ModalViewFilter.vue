<template>
  <modal-view v-if="isOn" @click.native="close(null)">
    <div
      class="modal filter_modal"
      :class="{ '-flex': options.length > 1 }"
      @click.stop=""
    >
      <p class="modal_title">
        <font-awesome-icon icon="search" />
        {{ filterObj.label }}
        <span :class="{ tag: filterObj.is_ontology }">{{
          filterObj.note
        }}</span>
      </p>
      <template v-if="filterObj.column === 'LogMedian'">
        <button @click="resetSlider(filterObj.filter_modal)">Reset</button>
        <div class="input_wrapper">
          <vue-slider
            ref="slider"
            v-model="searchValue"
            v-bind="filterObj.numberValue"
          ></vue-slider>
        </div>
      </template>
      <div v-else-if="options.length > 1" class="select">
        <model-select
          v-model="selectedOption"
          placeholder="Select an option"
          :options="options"
        ></model-select>
        <font-awesome-icon
          class="reset-btn"
          :icon="['fad', 'circle-xmark']"
          @click="selectedOption = options[0]"
        />
      </div>

      <div v-else class="input_wrapper">
        <input
          v-model="searchValue"
          type="text"
          placeholder="filter by text"
          @keyup.enter="close(null)"
        />
        <font-awesome-icon
          v-show="filterObj.filterModal !== ''"
          class="reset-btn"
          :icon="['fad', 'circle-xmark']"
          @click="searchValue = ''"
        />
      </div>
    </div>
  </modal-view>
</template>
<script>
  import ModalView from '~/components/ModalView/ModalView.vue';
  import { ModelSelect } from 'vue-search-select';
  import { mapMutations, mapGetters } from 'vuex';

  export default {
    components: {
      ModalView,
      ModelSelect,
    },
    data() {
      return {
        searchValue: '',
        selectedOption: {},
      };
    },
    computed: {
      ...mapGetters({
        filters: 'project_filters',
        filterObj: 'active_filter_modal',
      }),
      isOn() {
        return this.filterObj !== null;
      },
      options() {
        return [
          { value: '', text: 'all' },
          ...(this.filterObj?.options?.map(x => ({
            value: x,
            text: x,
          })) || []),
        ];
      },
    },
    watch: {
      selectedOption() {
        this.searchValue = this.selectedOption.value;
      },

      searchValue() {
        if (this.isOn) this.updateFilterModal('filterModal', this.searchValue);
      },
      filterObj() {
        this.searchValue = this.filterObj?.filterModal || '';
      },
    },
    created() {
      this.searchValue = this.filterObj?.filterModal ?? '';
      this.selectedOption = this.options[0];
    },
    methods: {
      ...mapMutations({
        updateProjectFilters: 'update_project_filters',
        close: 'set_filter_modal',
      }),
      resetSlider() {
        const numberValue = this.filterObj?.numberValue;
        if (!numberValue) return;
        this.searchValue = [numberValue.min, numberValue.max];
      },
      updateFilterModal(type, value) {
        this.updateProjectFilters({
          key: type,
          filter: value,
        });
      },
    },
  };
</script>

<style lang="sass" scoped>
  .filter_modal
    width: 500px
    &.-flex
      overflow-y: visible
      display: flex
      flex-direction: column
      overflow: visible
      > .select
        display: flex
        align-items: center
        gap: 50px
    .reset-btn
        --fa-secondary-opacity: 0.3
        cursor: pointer !important
        &:hover
          --fa-secondary-opacity: 1
          --fa-primary-color: white
          --fa-secondary-color: #488EC4
    > .input_wrapper
      display: flex
      align-items: center
      position: relative
      > input[type="text"]
        +text_input
        > .reset-btn
          position: absolute
          right: 1rem
      > .vue-slider
        width: 100% !important
        margin-top: 25px
        > .vue-slider-rail
          background-color: $MAIN_COLOR_PALE
          > .vue-slider-process
            background-color: $MAIN_COLOR
</style>
