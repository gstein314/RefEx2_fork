<template>
  <div class="modal_wrapper">
    <div v-if="!is_loading" class="gene_detail">
      <a
        class="gene_name"
        :href="`https://www.ncbi.nlm.nih.gov/gene/?term=${gene_data._id}`"
        target="_blank"
        >{{ `${gene_data.symbol}`
        }}<span>{{
          ` (${gene_data.name}, NCBI_GeneID: ${gene_data._id})`
        }}</span></a
      >
      <div class="detail_contents">
        <p class="title">Alias</p>
        <p
          v-if="gene_data.alias && typeof gene_data.alias === 'object'"
          class="contents"
        >
          <span v-for="(alias, index) in gene_data.alias" :key="index">
            <span>{{ alias }}</span>
            <span v-if="index !== gene_data.alias.length - 1" class="comma"
              >,</span
            >
          </span>
        </p>
        <p v-else class="contents">
          <span>{{ gene_data.alias }}</span>
        </p>
        <p class="title">Type of gene</p>
        <p class="contents">{{ gene_data.type_of_gene }}</p>
        <p class="title">Summary</p>
        <p class="contents">{{ gene_data.summary }}</p>
        <p class="title">RefSeq</p>
        <p v-if="gene_data.refseq" class="contents">
          <span v-if="typeof gene_data.refseq.rna === 'object'">
            <span v-for="(rna, index) in gene_data.refseq.rna" :key="index">
              <a
                :href="`https://www.ncbi.nlm.nih.gov/gene/?term=${rna}`"
                target="_blank"
                >{{ rna }}</a
              >
              <span
                v-if="index !== gene_data.refseq.rna.length - 1"
                class="comma"
                >,</span
              >
            </span>
          </span>
          <span v-else>
            <a
              :href="`https://www.ncbi.nlm.nih.gov/gene/?term=${gene_data.refseq.rna}`"
              target="_blank"
              >{{ gene_data.refseq.rna }}</a
            >
          </span>
        </p>
        <p class="title">Ensembl</p>
        <p v-if="gene_data.ensembl" class="contents">
          <span
            v-for="(transcript, index) in gene_data.ensembl.transcript"
            :key="index"
          >
            <a
              :href="`http://asia.ensembl.org/Multi/Search/Results?q=${transcript};site=enssembl`"
              target="_blank"
              >{{ transcript }}</a
            >
            <span
              v-if="index !== gene_data.ensembl.transcript.length - 1"
              class="comma"
              >,</span
            >
          </span>
        </p>
        <p class="title">GO</p>
        <p class="sub_title">BP</p>
        <p v-if="gene_data.go" class="contents">
          <span v-for="(bp, index) in gene_data.go['BP']" :key="index">
            <a
              :href="`http://amigo.geneontology.org/amigo/term/${bp.id}`"
              target="_blank"
              >{{ `${bp.id}: ${bp.term}` }}</a
            >
            <span v-if="index !== gene_data.go['BP'].length - 1" class="comma"
              >,</span
            >
            <br />
          </span>
        </p>
        <p class="sub_title">CC</p>
        <p v-if="gene_data.go" class="contents">
          <span v-for="(cc, index) in gene_data.go['CC']" :key="index">
            <a
              :href="`http://amigo.geneontology.org/amigo/term/${cc.id}`"
              target="_blank"
              >{{ `${cc.id}: ${cc.term}` }}</a
            >
            <span v-if="index !== gene_data.go['CC'].length - 1" class="comma"
              >,</span
            >
            <br />
          </span>
        </p>
        <p class="sub_title">MF</p>
        <p v-if="gene_data.go" class="contents">
          <span v-for="(mf, index) in gene_data.go['MF']" :key="index">
            <a
              :href="`http://amigo.geneontology.org/amigo/term/${mf.id}`"
              target="_blank"
              >{{ `${mf.id}: ${mf.term}` }}</a
            >
            <span v-if="index !== gene_data.go['MF'].length - 1" class="comma"
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
  import axios from 'axios';

  export default {
    props: {
      props: {
        type: Object,
      },
    },
    data() {
      return {
        gene_data: {},
        is_loading: false,
      };
    },
    created() {
      this.is_loading = true;
      axios
        .get(`https://mygene.info/v3/gene/${this.props.gene_id}`)
        .then(data => {
          this.gene_data = data.data;
          this.is_loading = false;
          console.log(data.data);
        });
    },
    methods: {},
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
