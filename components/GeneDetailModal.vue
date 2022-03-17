<template>
  <div v-if="isShowing && geneId !== ''" class="modal_wrapper">
    <div v-if="!isLoading" class="gene_detail">
      <a
        class="gene_name"
        :href="`https://www.ncbi.nlm.nih.gov/gene/?term=${geneData._id}`"
        target="_blank"
        >{{ `${geneData.symbol}`
        }}<span>{{
          ` (${geneData.name}, NCBI_GeneID: ${geneData._id})`
        }}</span></a
      >
      <div class="detail_contents">
        <p class="title">Alias</p>
        <p
          v-if="geneData.alias && typeof geneData.alias === 'object'"
          class="contents"
        >
          <span v-for="(alias, index) in geneData.alias" :key="index">
            <span>{{ alias }}</span>
            <span v-if="index !== geneData.alias.length - 1" class="comma"
              >,</span
            >
          </span>
        </p>
        <p v-else class="contents">
          <span>{{ geneData.alias }}</span>
        </p>
        <p class="title">Type of gene</p>
        <p class="contents">{{ geneData.type_of_gene }}</p>
        <p class="title">Summary</p>
        <p class="contents">{{ geneData.summary }}</p>
        <p class="title">RefSeq</p>
        <p v-if="geneData.refseq" class="contents">
          <span v-if="typeof geneData.refseq.rna === 'object'">
            <span v-for="(rna, index) in geneData.refseq.rna" :key="index">
              <a
                :href="`https://www.ncbi.nlm.nih.gov/gene/?term=${rna}`"
                target="_blank"
                >{{ rna }}</a
              >
              <span
                v-if="index !== geneData.refseq.rna.length - 1"
                class="comma"
                >,</span
              >
            </span>
          </span>
          <span v-else>
            <a
              :href="`https://www.ncbi.nlm.nih.gov/gene/?term=${geneData.refseq.rna}`"
              target="_blank"
              >{{ geneData.refseq.rna }}</a
            >
          </span>
        </p>
        <p class="title">Ensembl</p>
        <p v-if="geneData.ensembl" class="contents">
          <span
            v-for="(transcript, index) in geneData.ensembl.transcript"
            :key="index"
          >
            <a
              :href="`http://asia.ensembl.org/Multi/Search/Results?q=${transcript};site=enssembl`"
              target="_blank"
              >{{ transcript }}</a
            >
            <span
              v-if="index !== geneData.ensembl.transcript.length - 1"
              class="comma"
              >,</span
            >
          </span>
        </p>
        <p class="title">GO</p>
        <p class="sub_title">BP</p>
        <p v-if="geneData.go" class="contents">
          <span v-for="(bp, index) in geneData.go['BP']" :key="index">
            <a
              :href="`http://amigo.geneontology.org/amigo/term/${bp.id}`"
              target="_blank"
              >{{ `${bp.id}: ${bp.term}` }}</a
            >
            <span v-if="index !== geneData.go['BP'].length - 1" class="comma"
              >,</span
            >
            <br />
          </span>
        </p>
        <p class="sub_title">CC</p>
        <p v-if="geneData.go" class="contents">
          <span v-for="(cc, index) in geneData.go['CC']" :key="index">
            <a
              :href="`http://amigo.geneontology.org/amigo/term/${cc.id}`"
              target="_blank"
              >{{ `${cc.id}: ${cc.term}` }}</a
            >
            <span v-if="index !== geneData.go['CC'].length - 1" class="comma"
              >,</span
            >
            <br />
          </span>
        </p>
        <p class="sub_title">MF</p>
        <p v-if="geneData.go" class="contents">
          <span v-for="(mf, index) in geneData.go['MF']" :key="index">
            <a
              :href="`http://amigo.geneontology.org/amigo/term/${mf.id}`"
              target="_blank"
              >{{ `${mf.id}: ${mf.term}` }}</a
            >
            <span v-if="index !== geneData.go['MF'].length - 1" class="comma"
              >,</span
            >
            <br />
          </span>
        </p>
      </div>
    </div>
    <p v-else class="loading">Loading...</p>
  </div>
</template>

<script>
  export default {
    props: {
      geneId: {
        type: String,
        default: '',
      },
      isShowing: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        geneData: {},
        isLoading: false,
      };
    },
    watch: {
      isShowing() {
        this.isLoading = true;
        this.$axios
          .$get(`https://mygene.info/v3/gene/${this.geneId}`)
          .then(data => {
            this.geneData = data;
          })
          .catch(function (error) {
            console.log(error);
          });

        this.isLoading = false;
      },
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
