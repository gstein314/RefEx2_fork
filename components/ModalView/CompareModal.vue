<template>
  <transition name="modal">
    <div v-if="is_compare_on" class="modal compare_modal">
      <p class="modal_title">
        <font-awesome-icon icon="search" />
        Compare with comma separated ID list
      </p>
      <div class="sample">
        <span class="ex">e.g.&nbsp;</span>
        <span
          class="sample_value"
          @click="
            gene_ids_to_compare = '5460,6657,9314,4609';
            comparisonSearch();
          "
          >Yamanaka Factors (OCT3/4, SOX2, KLF4 and C-MYC-OSKM)</span
        >
      </div>
      <div>
        <input
          v-model="gene_ids_to_compare"
          type="text"
          @keydown.enter="comparisonSearch"
        />
        <button @click="comparisonSearch">
          <font-awesome-icon icon="search" />
          Search
        </button>
      </div>
    </div>
  </transition>
</template>
