<template>
  <div>
    <h3>
      Genes with GO Term
      <span class="example"
        >e.g.
        <span
          class="sample_value"
          @click="
            setSampleQuery('go', 'transcription factor binding', 'GO:0008134')
          "
          >transcription factor binding</span
        >,
        <span
          class="sample_value"
          @click="setSampleQuery('go', 'cell differentiation', 'GO:0030154')"
          >cell differentiation</span
        >
      </span>
    </h3>
    <no-ssr>
      <vue-tags-input
        :value="go_term"
        :tags="termsGO"
        :autocomplete-items="autocomplete_go_term_items"
        :add-only-from-autocomplete="true"
        :placeholder="placeholderGOTerm"
        @input="setSampleQuery('go_term', $event)"
        @tags-changed="setTags"
      >
        <div
          slot="autocomplete-item"
          slot-scope="props"
          class="my-item"
          @click="props.performAdd(props.item)"
          v-html="props.item.text.replace(go_term, `<b>${go_term}</b>`)"
        ></div>
      </vue-tags-input>
    </no-ssr>
  </div>
</template>