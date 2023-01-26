<template>
  <select v-model="listItem[filter.class]" required>
    <option value="" disabled selected hidden>
      {{ filter.placeholder }}
    </option>
    <template v-if="filter.class === 'group'">
      <option
        v-for="option in groupOptions"
        :key="option.id"
        :value="option.label"
      >
        {{ option.label }}
      </option>
    </template>
    <template
      v-else-if="['horl', 'condition', 'statistic'].includes(filter.class)"
    >
      <option
        v-for="(option, index) of filter.options"
        :key="index"
        :value="option.value"
      >
        {{ option.description }}
      </option>
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
