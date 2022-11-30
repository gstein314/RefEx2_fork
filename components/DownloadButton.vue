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
        var csv = Papa.unparse(
          [
            {
              B: 'foo',
              A: 'bar',
            },
            {
              A: 'abc',
              B: 'def',
            },
          ],
          {
            delimiter: '\t',
          }
        );

        var blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, 'hello world.txt');
      },
    },
  };
</script>
<style lang="sass" scoped>
  .comparison_btn
      +button
</style>
