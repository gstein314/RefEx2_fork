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
          <p class="title">Ensembl gene</p>
          <div v-if="data.ensembl">
            <p v-if="Array.isArray(data.ensembl)" class="contents">
              <span v-for="index in data.ensembl.length" :key="index">
                <a
                  :href="`http://asia.ensembl.org/Multi/Search/Results?q=${
                    data.ensembl[index - 1].gene
                  };site=enssembl`"
                  target="_blank"
                  >{{ data.ensembl[index - 1].gene }}</a
                >
                <span v-if="index !== data.ensembl.length" class="comma"
                  >,</span
                >
              </span>
            </p>
            <p v-else class="contents">
              <span>
                <a
                  :href="`http://asia.ensembl.org/Multi/Search/Results?q=${data.ensembl.gene};site=enssembl`"
                  target="_blank"
                  >{{ data.ensembl.gene }}</a
                >
              </span>
            </p>
          </div>
          <p class="title">Gene Ontology</p>
          <p class="sub_title">Biological Process</p>
          <TableGeneOntology
            :data-source="data.go"
            :type-upper="'BP'"
            :type-lower="'bp'"
          ></TableGeneOntology>
          <p class="sub_title">Cellular Component</p>
          <TableGeneOntology
            :data-source="data.go"
            :type-upper="'CC'"
            :type-lower="'cc'"
          ></TableGeneOntology>
          <p class="sub_title">Molecular Function</p>
          <TableGeneOntology
            :data-source="data.go"
            :type-upper="'MF'"
            :type-lower="'mf'"
          ></TableGeneOntology>
        </div>
      </div>
      <p v-else class="loading">Loading...</p>
    </div>
  </modal-view>
</template>

<script>
  import ModalView from '~/components/ModalView/ModalView.vue';
  import TableGeneOntology from '~/components/results/TableGeneOntology.vue';
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    components: {
      ModalView,
      TableGeneOntology,
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
        .contents
          font-size: 14px
          margin: 0
          line-height: 20px
          .comma
            margin: 0 2px 0 -2px
    > .loading
      text-align: center
</style>
