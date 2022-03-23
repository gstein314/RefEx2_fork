<template>
  <modal-view v-if="isOn" @click.native="close">
    <div class="modal filter_modal" @click.stop="">
      <p class="modal_title">
        <font-awesome-icon icon="search" />
        {{
          filterObj.subLabel
            ? `${filterObj.label} ${filterObj.subLabel}`
            : filterObj.label
        }}
      </p>
      <template
        v-if="filterObj.innerKey === 'median' || filterObj.innerKey === 'age'"
      >
        <button @click="resetSlider(filterObj.filter_modal)">Reset</button>
        <div class="input_wrapper">
          <vue-slider
            ref="slider"
            v-bind="filterObj.numberValue"
            @change="updateSlider('numberValue')"
          ></vue-slider>
        </div>
      </template>
      <div v-else class="input_wrapper">
        <input
          v-model="searchValue"
          type="text"
          placeholder="filter by text"
          @keyup.enter="closeModal"
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
        searchValue: this.filterObj?.filterModal || '',
      };
    },
    computed: {
      ...mapGetters({
        filterObj: 'active_filter_modal',
      }),
      isOn() {
        return this.filterObj !== null;
      },
    },
    watch: {
      searchValue() {
        this.updateFilterModal('filterModal', this.searchValue);
      },
    },
    methods: {
      ...mapMutations({
        updateProjectFilters: 'update_project_filters',
        close: 'set_filter_modal',
      }),
      resetSlider(type) {
        const numberValue = this.filters[type]?.numberValue;
        if (!numberValue) return;
        numberValue.value = [0, numberValue.max];
        this.$set(this.filters[type], 'numberValue', numberValue);
      },
      normalizeAge(age) {
        let normalized_age;
        if (age.indexOf('-') !== -1) {
          age = age.replace(/[^0-9]/g, ',');
        }

        if (age.indexOf(',') !== -1) {
          normalized_age = [];
          normalized_age = normalized_age.concat(age.split(','));
          normalized_age = normalized_age.map(num => Number(num));
        } else {
          normalized_age = Number(age);
        }
        return normalized_age;
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
