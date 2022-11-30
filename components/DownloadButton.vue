<template>
  <button
    class="download_btn"
    :style="[isProjectSample ? { visibility: 'hidden' } : '']"
    @click="downloadTsv()"
  >
    <font-awesome-icon icon="arrow-down-to-line" />
    Download .tsv
  </button>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import Papa from 'papaparse';
  import FileSaver from 'file-saver';

  export default {
    props: {
      jsonData: {
        type: Object,
        default: () => {},
      },
      requiredColumns: {
        type: Array,
        default: () => [],
      },
      headerLabels: {
        type: Object,
        default: () => {},
      },
      fileName: {
        type: String,
        default: 'Refex.tsv',
      },
      delimiter: {
        type: String,
        default: '\t',
      },
    },
    data() {
      return {};
    },
    computed: {
      ...mapGetters({}),
    },
    mounted() {},
    methods: {
      ...mapMutations({}),
      downloadTsv() {
        let tsv = Papa.unparse(this.jsonData, {
          delimiter: this.delimiter,
        });

        let blob = new Blob([tsv], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, this.fileName);
      },
    },
  };
</script>
<style lang="sass" scoped>
  .comparison_btn
      +button
</style>
