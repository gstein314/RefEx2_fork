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
        <span :class="{ tag: filterObj.is_ontology }"
          >&nbsp;{{ filterObj.note }}</span
        >
        <span v-if="filterObj.options" class="modal_btns">
          <button
            class="sub all_btn"
            @click="searchValue = [...filterObj.options]"
          >
            Select all
          </button>
          <button class="sub clear_btn" @click="setFilterSearchValue([])">
            Unselect all
          </button></span
        >
        <span v-else-if="filterObj.column === 'LogMedian'" class="modal_btns">
          <button
            class="sub reset_btn"
            @click="resetSlider(filterObj.filter_modal)"
          >
            Reset
          </button>
        </span>
        <span v-else class="modal_btns">
          <button class="sub clear_btn" @click="searchValue = ''">
            Clear
          </button></span
        >
      </p>
      <template v-if="filterObj.column === 'LogMedian'">
        <div class="input_wrapper">
          <vue-slider
            ref="slider"
            v-model.lazy="searchValue"
            v-debounce="delay"
            v-bind="filterObj.numberValue"
          ></vue-slider>
        </div>
      </template>
      <div v-else-if="filterObj.options" class="select">
        <multi-select
          v-model.lazy="searchValue"
          v-debounce="delay"
          :multiple="true"
          :allow-empty="true"
          :close-on-select="false"
          placeholder="Please select option(s)"
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
                  ? 'All'
                  : values.length
              }}
              options selected
            </span>
          </template>
        </multi-select>
      </div>

      <div v-else class="input_wrapper">
        <input
          v-model.lazy="searchValue"
          v-debounce="delay"
          type="text"
          placeholder="filter by text"
          @keyup.enter="close(null)"
        />
      </div>
    </div>
  </modal-view>
</template>
<script>
  import ModalView from '~/components/ModalView/ModalView.vue';
  import MultiSelect from 'vue-multiselect';
  import { mapMutations, mapGetters } from 'vuex';
  import { directive } from 'v-debounce';

  export default {
    directives: {
      debounce: directive,
    },
    components: {
      ModalView,
      MultiSelect,
    },
    data() {
      return {
        searchValue: '',
        delay: 1000,
      };
    },
    computed: {
      ...mapGetters({
        filters: 'project_filters',
        filterObj: 'active_filter_modal',
        getFilterSearchValue: 'get_filter_search_value',
      }),
      isOn() {
        return this.filterObj !== null;
      },
    },
    watch: {
      getFilterSearchValue() {
        this.searchValue = this.getFilterSearchValue;
      },
      searchValue() {
        if (this.isOn) {
          this.updateStore();
          this.setFilterSearchValue(this.searchValue);
        }
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
        setFilterSearchValue: 'set_filter_search_value',
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
    .modal_btns
      display: flex
      gap: 10px
      position: absolute
      right: 0
    .reset_btn
        --fa-secondary-opacity: 0.3
        margin-left: 10px
        cursor: pointer !important
        &:hover
          --fa-secondary-opacity: 1
          --fa-primary-color: white
          --fa-secondary-color: #488EC4
    .all_btn, .clear_btn, .reset_btn
      +button
      +sub_button

    > .input_wrapper
      display: flex
      align-items: center
      position: relative
      > input[type="text"]
        +text_input
        > .reset_btn
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
