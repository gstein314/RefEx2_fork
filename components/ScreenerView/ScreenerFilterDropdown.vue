<template>
  <select v-model="listItem[filter.class]" required>
    <template v-if="filter.class === 'group'">
      <option value="" disabled selected hidden>select a group</option>
      <option
        v-for="option in groupOptions"
        :key="option.id"
        :value="option.label"
      >
        {{ option.label }}
      </option>
    </template>
    <template v-else-if="filter.class === 'horl'">
      <option value="" disabled selected hidden>High</option>
      <option value="high">High</option>
      <option value="low">Low</option>
    </template>
    <template v-else-if="filter.class === 'condition'">
      <option value="" disabled selected hidden>≧</option>
      <option value="less than">&#60;</option>
      <option value="less than or equal to">&#8804;</option>
      <option value="equal to">&#61;</option>
      <option value="not equal to">&#8800;</option>
      <option value="greater than or equal to">&#8805;</option>
      <option value="greater than">&#62;</option>
    </template>
  </select>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    props: {
      item: {
        type: Object,
        default: () => {},
      },
      filter: {
        type: Object,
        default: () => {},
      },
      datasets: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        listItem: this.item,
      };
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
      }),
      groupOptions() {
        const target = this.activeDataset.dataset;
        if (target === 'humanFantom5') {
          return this.datasets[0].datasets[0].specificity;
        } else if (target === 'gtexV8') {
          return this.datasets[0].datasets[1].specificity;
        } else if (target === 'mouseFantom5') {
          return [{ label: 'Group 1' }, { label: 'Group 2' }];
          // お客さんの指定があり次第ハードコートから下記のコートに変更
          // return this.datasets[1].datasets[0].specificity;
        } else return [{ label: 'No useable option found' }];
      },
    },
    methods: {},
  };
</script>
