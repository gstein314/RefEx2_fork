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
      fieldsArray: {
        type: Array,
        default: () => [],
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
      oldFields() {
        return this.fieldsArray.map(item => Object.keys(item)[0]);
      },
      newFields() {
        return this.fieldsArray.map(item => Object.values(item)[0]);
      },
      dataArray() {
        const arr = [];
        for (const item of this.downloadData) {
          const subArr = [];
          for (const oldField of this.oldFields) {
            subArr.push(item[oldField]);
          }
          arr.push(subArr);
        }
        return arr;
      },
    },
    methods: {
      ...mapMutations({}),
      downloadTsv() {
        let tsv = Papa.unparse(
          {
            fields: this.newFields,
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
  .download_btn
      +button
</style>
