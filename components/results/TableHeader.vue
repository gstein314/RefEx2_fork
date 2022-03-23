import { mapMutations } from 'vuex';
<template>
  <th v-if="isDisplayed" class="age">
    <span v-if="subLabel">
      {{ label }}<br />
      <span class="small">{{ subLabel }}</span>
    </span>
    <template v-else> {{ label }}</template>
    <slot></slot>
    <font-awesome-icon
      :icon="currentSort.active === id ? `sort-${currentSort.order}` : 'sort'"
      @click="switchSort"
    />
    <font-awesome-icon
      icon="search"
      :class="{ active: isActiveSearch }"
      @click="setFilterModal($vnode.key)"
    />
  </th>
</template>

<script>
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
      subLabel: {
        type: String,
        required: false,
      },
      innerKey: {
        type: String,
        default: '',
      },
      // eslint-disable-next-line vue/require-default-prop
      isDisplayed: {
        type: Boolean,
        default: true,
      },
      filterModal: {
        type: String,
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
          ? this.numberValue.value[0] !== 0 ||
              this.numberValue.value[1] !== this.numberValue.max
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
