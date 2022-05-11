<template>
  <modal-view v-if="isOn" @click.native="close(null)">
    <div class="modal filter_modal" @click.stop="">
      obj : {{ filterObj }}
      <p class="modal_title">
        <font-awesome-icon icon="search" />
        {{ filterObj.label }}
        <span :class="{ tag: filterObj.is_ontology }">{{
          filterObj.note
        }}</span>
      </p>
      <template
        v-if="filterObj.column === 'LogMedian' || filterObj.column === 'age'"
      >
        <button @click="resetSlider(filterObj.filter_modal)">Reset</button>
        <div class="input_wrapper">
          <vue-slider
            ref="slider"
            v-model="searchValue"
            v-bind="filterObj.numberValue"
          ></vue-slider>
        </div>
      </template>
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
  import { mapMutations, mapGetters } from 'vuex';

  export default {
    components: {
      ModalView,
    },
    data() {
      return {
        searchValue: '',
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
    },
    watch: {
      searchValue() {
        if (this.isOn) this.updateFilterModal('filterModal', this.searchValue);
      },
      filterObj() {
        this.searchValue = this.filterObj?.filterModal || '';
      },
    },
    created() {
      this.searchValue = this.filterObj?.filterModal ?? '';
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
    > .input_wrapper
      display: flex
      align-items: center
      position: relative
      > input[type="text"]
        +text_input
      > .reset-btn
        position: absolute
        right: 1rem
        --fa-secondary-opacity: 0.3
        cursor: pointer
        &:hover
          --fa-secondary-opacity: 1
          --fa-primary-color: white
          --fa-secondary-color: #488EC4
      > .vue-slider
        width: 100% !important
        margin-top: 25px
        > .vue-slider-rail
          background-color: $MAIN_COLOR_PALE
          > .vue-slider-process
            background-color: $MAIN_COLOR
</style>
