<template>
  <th v-if="is_displayed" class="label">
    <div class="inner">
      <span class="label"> {{ label }} </span>

      <slot></slot>
      <div class="banner">
        <span v-if="note" class="tag">{{ note }}</span>
        <font-awesome-icon
          :icon="currentSort.key === id ? `sort-${currentSort.order}` : 'sort'"
          @click="switchSort"
        />
        <font-awesome-icon
          icon="search"
          :class="{ active: isActiveSearch }"
          @click="setFilterModal($vnode.key)"
        />
      </div>
    </div>
  </th>
</template>

<script>
  /* eslint-disable vue/prop-name-casing */
  import { mapMutations } from 'vuex';

  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        default: '',
      },
      // eslint-disable-next-line vue/require-default-prop
      note: {
        type: String,
        required: false,
      },
      is_ontology: {
        type: Boolean,
        default: false,
      },
      // eslint-disable-next-line vue/require-default-prop
      is_displayed: {
        type: Boolean,
        default: true,
      },
      filterModal: {
        type: [String, Array],
        default: '',
      },
      // eslint-disable-next-line vue/require-default-prop
      numberValue: {
        type: Object,
        required: false,
      },
      currentSort: {
        type: Object,
        required: true,
      },
    },
    computed: {
      isActiveSearch() {
        return this.numberValue
          ? this.filterModal[0] !== this.numberValue.min ||
              this.filterModal[1] !== this.numberValue.max
          : this.filterModal !== '';
      },
    },
    methods: {
      switchSort() {
        this.$emit('switchSort', this.id);
      },
      ...mapMutations({
        setFilterModal: 'set_filter_modal',
      }),
    },
  };
</script>
<style lang="sass" scoped>
  th > .inner
    display: grid
    gap: 0.5rem
    > .banner
      display: flex
      gap: 0.5rem
      align-items: center
      svg
        &[data-icon="sort"]
          color: $COLOR_10
        &[data-icon="search"]
          color: $MAIN_COLOR
    .tag
      +ontology_tag
</style>
