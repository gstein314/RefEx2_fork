<template>
  <modal-view v-if="id" @click.native="setSampleModal()">
    <div class="modal_wrapper" @click.stop="">
      <div v-if="!isLoading" class="sample_detail">
        <p class="sample_name">
          {{ ` ${data.Description} (Sample ID: ${id})` }}
        </p>
        <div v-for="(value, key) in data" :key="key" class="detail_contents">
          <template
            v-if="key === 'RefexSampleId' || key === 'Description'"
          ></template>
          <template v-else-if="key === 'NumberOfSamples'"
            ><p class="title">Number of Samples</p>
            <p class="contents">{{ value }}</p></template
          >
          <template v-else-if="key === 'BioSampleId'">
            <p class="title">BioSample ID</p>
            <p class="contents">
              <span
                v-for="(biosample, index) in JSON.parse(value)"
                :key="index"
              >
                <span>{{ biosample }}</span>
                <span
                  v-if="index !== JSON.parse(value).length - 1"
                  class="comma"
                  >,</span
                >
              </span>
            </p>
          </template>
          <template v-else>
            <p class="title">{{ getColumnLabel(key) }}</p>
            <p class="contents">{{ value }}</p>
          </template>
        </div>
      </div>
      <p v-else class="loading">Loading...</p>
    </div>
  </modal-view>
</template>

<script>
  import ModalView from '~/components/ModalView/ModalView.vue';
  import { mapGetters, mapMutations } from 'vuex';
  import datasets from '~/refex-sample/datasets.json';

  export default {
    components: {
      ModalView,
    },
    data() {
      return {
        data: {},
        isLoading: false,
      };
    },
    computed: {
      ...mapGetters({
        id: 'sample_modal',
        activeDataset: 'active_dataset',
      }),
    },
    watch: {
      async id() {
        if (this.id === null) return;
        this.isLoading = true;
        await this.$axios
          .$get(
            `https://refex2-api.dbcls.jp/api/sample/${
              this.id
            }?dataset=${this.activeDataset.dataset.toLowerCase()}`
          )
          .then(data => {
            this.data = data.sample_info;
          })
          .catch(_error => {
            this.setAlertModal({
              msg: 'Failed to get data in Modal View Sample',
            });
          });
        this.isLoading = false;
      },
    },
    methods: {
      ...mapMutations({
        setSampleModal: 'set_sample_modal',
        setAlertModal: 'set_alert_modal',
      }),
      getColumnLabel(column) {
        const sampleFilter =
          datasets
            .flatMap(data => data.datasets)
            .find(index => index.dataset === this.activeDataset.dataset)?.sample
            .filter || [];
        const data = Object.values(sampleFilter);
        const match = data.find(item => item.column === column);
        return match ? match.label : column;
      },
    },
  };
</script>

<style lang="sass">
  a
    color: $MAIN_COLOR
  .sample_name
    color: $MAIN_COLOR
  .modal_wrapper
    +modal
    padding: 60px 0
    width: 60vw
    max-width: 1000px
    min-width: 610px
    > .sample_detail
      > .sample_name
        font-size: 22px
        font-weight: bold
        border-left: 7px solid $MAIN_COLOR
        padding: 8px 60px
        display: block
      > .detail_contents
        margin: 0 67px
        margin-top: 30px
        > .title
          font-size: 18px
          font-weight: bold
          margin: 20px 0 2px
        > .sub_title
          font-size: 16px
          font-weight: bold
          margin: 10px 0 0px
        .contents
          font-size: 14px
          margin: 0
          line-height: 20px
          .comma
            margin: 0 2px 0 -2px
    > .loading
      text-align: center
</style>
