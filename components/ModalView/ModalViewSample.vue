<template>
  <modal-view v-if="id" @click.native="setSampleModal()">
    <div class="modal_wrapper" @click.stop="">
      <div v-if="!isLoading" class="sample_detail">
        <a
          class="sample_name"
          :href="`https://www.ncbi.nlm.nih.gov/gene/?term=${id}`"
          target="_blank"
          ><span>{{ `Sample ID: ${id}` }}</span></a
        >
        <div class="detail_contents">
          <p class="title">Description</p>
          <p class="contents"></p>
          <p class="title">Sample type</p>
          <p class="title">Experiment</p>
          <p class="contents"></p>
          <p class="title">Tissue</p>
          <p class="contents"></p>
          <p class="title">Cell type</p>
          <p class="contents"></p>
          <p class="title">Disease</p>
          <p class="contents"></p>
          <p class="title">Developmental stage</p>
          <p class="contents"></p>
          <p class="title">Sex</p>
          <p class="contents"></p>
          <p class="title">Bio Sample</p>
          <p class="contents">
            <span
              v-for="(alias, index) in JSON.parse(data.BioSampleId)"
              :key="index"
            >
              <span>{{ alias }}</span>
              <span
                v-if="index !== JSON.parse(data.BioSampleId).length - 1"
                class="comma"
                >,</span
              >
            </span>
          </p>
        </div>
      </div>
      <p v-else class="loading">Loading...</p>
    </div>
  </modal-view>
</template>

<script>
  import ModalView from '~/components/ModalView/ModalView.vue';
  import { mapGetters, mapMutations } from 'vuex';

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
      isArrayExpression(type) {
        return `${type.id}: ${type.term}: ${type.evidence}: ${type.qualifier}`;
      },
      notArrayExpression(type) {
        return `${this.data.go[type].id}: ${this.data.go[type].term}: ${this.data.go[type].evidence}: ${this.data.go[type].qualifier}`;
      },
    },
  };
</script>

<style lang="sass">
  a
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
