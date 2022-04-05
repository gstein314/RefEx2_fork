<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <h3 v-if="screenerInfo.description !== ''">
      {{ screenerInfo.description }}
    </h3>
    <div :class="{ classification_wrapper: classificationItems.length > 1 }">
      <div
        v-for="item of classificationItems"
        :key="item.column"
        class="classification_item"
      >
        <h4>
          {{ item.label }}
          <span v-if="item.note" class="tag">{{ item.note }}</span>
          <span class="example">
            e.g.
            <template v-for="(sample, sampleIndex) of item.examples">
              <span
                :key="`${sampleIndex}_sample`"
                class="sample_value"
                @click="updateParameter(item.column, sample.route)"
              >
                {{ sample.label }}
              </span>
              <span
                v-if="sampleIndex < item.examples.length - 1"
                :key="`${sampleIndex}_separator`"
                >,</span
              >
            </template>
          </span>
        </h4>
        <vue-simple-suggest
          v-model="parameters[item.column]"
          :filter-by-query="true"
          :list="autoComplete[item.column]"
          :max-suggestions="100"
          class="text_search_sample_types"
          :placeholder="item.placeholder"
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
  /* eslint-disable vue/prop-name-casing */
  import VueSimpleSuggest from 'vue-simple-suggest';
  import { mapGetters } from 'vuex';

  export default {
    components: {
      VueSimpleSuggest,
    },
    data() {
      return {
        // passed down to API. will hold keys of the column parameter of screener > classification_items > column of filters.json
        parameters: {},
        // will contain same keys as parameters. Autocompletion that does not come from the API should be hardcoded here in advance
        autoComplete: {
          Description: ['cell lines', 'stem cells', 'primary cells', 'tissues'],
        },
      };
    },
    computed: {
      ...mapGetters({
        activeFilter: 'active_filter',
      }),
      screenerInfo() {
        return this.activeFilter.screener;
      },
      classificationItems() {
        return this.screenerInfo.classification_items;
      },
    },
    async created() {
      this.classificationItems.forEach(item => {
        const key = item.column;
        this.$set(this.parameters, key, '');
        if (key in this.autoComplete) return;
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
      updateParameter(key, value) {
        if (key && value) this.$set(this.parameters, key, value);
        this.$emit('updateParameters', this.parameters);
      },
    },
  };
</script>
