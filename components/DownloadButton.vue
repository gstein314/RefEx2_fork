<template>
  <button class="download_btn" :disabled="disabled" @click="downloadTsv">
    <font-awesome-icon icon="arrow-down-to-line" />
    Download as table
  </button>
</template>

<script>
  import Papa from 'papaparse';
  import FileSaver from 'file-saver';

  export default {
    props: {
      downloadData: {
        type: Array,
        default: () => [],
      },
      fieldsArray: {
        type: Array,
        default: () => [],
        // An array of object [{oldField: newField}, ...]
      },
      fileName: {
        type: String,
        default: 'download.tsv',
      },
      delimiter: {
        type: String,
        default: '\t',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      oldFields() {
        return this.fieldsArray.map(item => Object.keys(item)[0]);
      },
      newFields() {
        return this.fieldsArray.map(item => Object.values(item)[0]);
      },
      dataArray() {
        return this.downloadData.map(item =>
          this.oldFields.map(field => item[field])
        );
      },
    },
    methods: {
      downloadTsv() {
        const tsv = Papa.unparse(
          {
            fields: this.newFields,
            data: this.dataArray,
          },
          {
            delimiter: this.delimiter,
          }
        );
        const blob = new Blob([tsv], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, this.fileName);
      },
    },
  };
</script>
<style lang="sass" scoped>
  .download_btn
    +button
</style>
