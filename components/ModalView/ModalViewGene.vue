<template>
  <modal-view v-if="id" @click.native="setGeneModal()">
    <div class="modal_wrapper" @click.stop="">
      <div v-if="!isLoading" class="gene_detail">
        <a
          class="gene_name"
          :href="`https://www.ncbi.nlm.nih.gov/gene/?term=${data._id}`"
          target="_blank"
          >{{ `${data.symbol}`
          }}<span>{{ ` (${data.name}, GeneID: ${data._id})` }}</span></a
        >
        <div class="detail_contents">
          <p class="title">Alias</p>
          <p
            v-if="data.alias && typeof data.alias === 'object'"
            class="contents"
          >
            <span v-for="(alias, index) in data.alias" :key="index">
              <span>{{ alias }}</span>
              <span v-if="index !== data.alias.length - 1" class="comma"
                >,</span
              >
            </span>
          </p>
          <p v-else class="contents">
            <span>{{ data.alias }}</span>
          </p>
          <p class="title">Type of gene</p>
          <p class="contents">{{ data.type_of_gene }}</p>
          <p class="title">Summary</p>
          <p class="contents">{{ data.summary }}</p>
          <p class="title">RefSeq</p>
          <p v-if="data.refseq" class="contents">
            <span v-if="typeof data.refseq.rna === 'object'">
              <span v-for="(rna, index) in data.refseq.rna" :key="index">
                <a
                  :href="`https://www.ncbi.nlm.nih.gov/gene/?term=${rna}`"
                  target="_blank"
                  >{{ rna }}</a
                >
                <span v-if="index !== data.refseq.rna.length - 1" class="comma"
                  >,</span
                >
              </span>
            </span>
            <span v-else>
              <a
                :href="`https://www.ncbi.nlm.nih.gov/gene/?term=${data.refseq.rna}`"
                target="_blank"
                >{{ data.refseq.rna }}</a
              >
            </span>
          </p>
          <p class="title">Ensembl</p>
          <p v-if="data.ensembl" class="contents">
            <span
              v-for="(transcript, index) in data.ensembl.transcript"
              :key="index"
            >
              <a
                :href="`http://asia.ensembl.org/Multi/Search/Results?q=${transcript};site=enssembl`"
                target="_blank"
                >{{ transcript }}</a
              >
              <span
                v-if="index !== data.ensembl.transcript.length - 1"
                class="comma"
                >,</span
              >
            </span>
          </p>
          <p class="title">GO</p>
          <p class="sub_title">BP</p>
          <p v-if="data.go" class="contents">
            <span v-for="(bp, index) in data.go['BP']" :key="index">
              <a
                :href="`http://amigo.geneontology.org/amigo/term/${bp.id}`"
                target="_blank"
                >{{ `${bp.id}: ${bp.term}` }}</a
              >
              <span v-if="index !== data.go['BP'].length - 1" class="comma"
                >,</span
              >
              <br />
            </span>
          </p>
          <p class="sub_title">CC</p>
          <p v-if="data.go" class="contents">
            <span v-for="(cc, index) in data.go['CC']" :key="index">
              <a
                :href="`http://amigo.geneontology.org/amigo/term/${cc.id}`"
                target="_blank"
                >{{ `${cc.id}: ${cc.term}` }}</a
              >
              <span v-if="index !== data.go['CC'].length - 1" class="comma"
                >,</span
              >
              <br />
            </span>
          </p>
          <p class="sub_title">MF</p>
          <p v-if="data.go" class="contents">
            <span v-for="(mf, index) in data.go['MF']" :key="index">
              <a
                :href="`http://amigo.geneontology.org/amigo/term/${mf.id}`"
                target="_blank"
                >{{ `${mf.id}: ${mf.term}` }}</a
              >
              <span v-if="index !== data.go['MF'].length - 1" class="comma"
                >,</span
              >
              <br />
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
        id: 'gene_modal',
      }),
    },
    watch: {
      async id() {
        if (this.id === null) return;
        this.isLoading = true;
        await this.$axios
          .$get(`https://mygene.info/v3/gene/${this.id}`)
          .then(data => {
            this.data = data;
          })
          .catch(_error => {
            this.setAlertModal({
              msg: 'Failed to get data in Modal View Gene',
            });
          });

        this.isLoading = false;
      },
    },
    methods: {
      ...mapMutations({
        setGeneModal: 'set_gene_modal',
        setAlertModal: 'set_alert_modal',
      }),
    },
  };
</script>

<style lang="sass">
  .modal_wrapper
    +modal
    padding: 60px 0
    width: 60vw
    max-width: 800px
    min-width: 610px
    > .gene_detail
      > .gene_name
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
        > .contents
          font-size: 14px
          margin: 0
          line-height: 20px
          .comma
            margin: 0 2px 0 -2px
    > .loading
      text-align: center
</style>
