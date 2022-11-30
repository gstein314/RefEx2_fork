<template>
  <button class="download_btn" @click="downloadTsv()">
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
      downloadData: {
        type: Array,
        default: () => [],
      },
      requiredColumns: {
        type: Array,
        default: () => [],
      },
      fieldArray: {
        type: Array,
        default: () => [],
      },
      fields: {
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
      jsonDataWithLabels() {
        return {};
      },
      // fieldArray() {
      //   return Object.keys(this.downloadData[0]);
      // },
      dataArray() {
        const arr = [];
        for (const item of this.downloadData) {
          arr.push(Object.values(item));
        }
        return arr;
      },
    },
    mounted() {
      console.log(this.dataArray);
    },
    methods: {
      ...mapMutations({}),
      downloadTsv() {
        let tsv = Papa.unparse(
          {
            fields: this.fieldArray,
            data: this.dataArray,
          },
          {
            delimiter: this.delimiter,
          }
        );

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
