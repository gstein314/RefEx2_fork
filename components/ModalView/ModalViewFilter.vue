<template>
  <modal-view v-if="isOn" @click.native="close(null)">
    <div
      class="modal filter_modal"
      :class="{ '-flex': filterObj.options }"
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
      <div v-else-if="filterObj.options" class="select">
        <multi-select
          v-model="searchValue"
          multiple
          :allow-empty="false"
          :close-on-select="false"
          placeholder="Search"
          :options="filterObj.options"
        >
          <template slot="option" slot-scope="props">
            <div class="option">
              <input
                type="checkbox"
                :checked="searchValue.includes(props.option)"
              />
              <span class="option__small">{{ props.option }}</span>
              <!-- <font-awesome-icon icon="exclamation-triangle" /> -->
            </div>
          </template>
          <template slot="selection" slot-scope="{ values }">
            <span
              v-if="values.length &amp;&amp; values.length > 3"
              class="multiselect__single"
            >
              {{
                values.length === filterObj.options.length
                  ? 'all'
                  : values.length
              }}
              options selected
            </span>
          </template>
        </multi-select>
        <font-awesome-icon
          class="reset-btn"
          :icon="['fad', 'circle-xmark']"
          @click="searchValue = [...filterObj.options]"
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
  import MultiSelect from 'vue-multiselect';
  import { mapMutations, mapGetters } from 'vuex';

  export default {
    components: {
      ModalView,
      MultiSelect,
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
        if (this.isOn) this.updateStore();
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
      updateStore(filter = this.searchValue) {
        this.updateFilterModal('filterModal', filter);
      },
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
      min-height: 150px
      ::v-deep
        .multiselect
          input[type="text"]
            +text_input
          .multiselect__tag
            background: $MAIN_COLOR
            > .multiselect__tag-icon
              background: none
              &:after
                color: white
          .multiselect__option
            background: none
            > .option
              display: flex
              align-items: center
              gap: 10px
              > input[type="checkbox"]
                cursor: pointer

          .multiselect__option--highlight
            background: $MAIN_COLOR
          *[class^="multiselect__option"]
            &:after
              content: none
      > .select
        display: flex
        gap: 10px
    .reset-btn
        --fa-secondary-opacity: 0.3
        margin-top: 10px
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
