<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <h3 v-if="description !== ''">
      {{ description }}
    </h3>
    <div v-if="filters && filters.length > 0" class="classification_wrapper">
      <div
        v-for="(filter, filterIndex) of filters"
        :key="`${filterIndex + 1}_test`"
      >
        <h4 :key="`${filterIndex + 1}_gene_h3`">
          {{ filter.label }}
          <span v-if="filter.note" class="tag">{{ filter.note }}</span>
          <span v-if="filter.examples" class="example">
            e.g.
            <template v-for="(example, exampleIndex) of filter.examples">
              <span
                :key="`${exampleIndex}_example`"
                class="sample_value"
                @click="updateParameter(filter.column, example)"
              >
                {{ example }}
              </span>
              <span
                v-if="exampleIndex < filter.examples.length - 1"
                :key="`${exampleIndex}_separator`"
                >,</span
              >
            </template>
          </span>
        </h4>
        <input
          v-if="filter.is_checkbox"
          v-model="parameters[filter.column]"
          type="checkbox"
        />
        <vue-simple-suggest
          v-else
          :key="`${filterIndex + 1}_gene_tags`"
          v-model="parameters[filter.column]"
          :filter-by-query="true"
          :list="autoComplete[filter.column]"
          :max-suggestions="100"
          class="text_search_sample_types"
          :placeholder="filter.examples ? filter.examples[0] : ''"
          @input="updateParameter"
        >
          <div
            slot="suggestion-item"
            slot-scope="{ suggestion }"
            v-html="$boldenSuggestion(suggestion, parameters[item.column])"
          ></div>
        </vue-simple-suggest>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import VueSimpleSuggest from 'vue-simple-suggest';

  export default {
    components: {
      VueSimpleSuggest,
    },
    data() {
      return {
        // passed down to API
        parameters: {},
        // will contain same keys as parameters. Autocompletion that does not come from the API should be hardcoded here in advance
        autoComplete: {},
        debounce: null,
      };
    },
    computed: {
      ...mapGetters({
        filterByName: 'filter_by_name',
        activeDataset: 'active_dataset',
      }),
      description() {
        return this.filterByName('sample').description;
      },
      dataSetSpecificParameters() {
        return this.activeDataset.sample;
      },
      filters() {
        return this.dataSetSpecificParameters.filter ?? [];
      },
    },
    async created() {
      this.filters.forEach(filter => {
        const key = filter.column;
        if (key in this.autoComplete) return;
        this.$set(this.parameters, key, '');
        this.$axios
          .$get(`api/vocablary?annotation=${key.toUpperCase()}%20label`)
          .then(data => {
            this.$set(this.autoComplete, key, data);
          })
          .catch(error => {
            console.log('error', error);
          });
      });
    },
    methods: {
      toggleScreener() {
        this.isOpen = !this.isOpen;
      },
      updateParameter(key, value) {
        if (key && value) this.$set(this.parameters, key, value);
        this.$emit('updateParameters', this.parameters);
      },
    },
  };
</script>
