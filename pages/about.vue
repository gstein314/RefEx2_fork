<template>
  <div class="container">
    <h2 class="category_title">About</h2>
    <div>
      <p>
        DNAマイクロアレイの開発によりゲノム規模での遺伝子の発現量の測定が可能となって以来、遺伝子発現データはさまざまな研究グループにより異なる測定手法を用いて産生され、公共データベースに蓄積しつづけています。
        これらのデータは、仮説の構築、研究計画の立案、実験データの解釈など、さまざまな状況において幅広い分野の研究者に利用される汎用的なデータですが、その膨大さや多様さのため、それらを自らの研究に利用することは困難な場合があります。
      </p>

      <p>
        RefEx(Reference Expression
        dataset)は、遺伝子発現解析の基準となる正常な組織や細胞などの大規模測定データを集め、並列に比較できるよう整理し、それらを快適に閲覧できるウェブツールです。
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    head() {
      return {
        script: [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(this.jsonld, null, 2),
          },
        ],
      };
    },
    computed: {
      jsonld() {
        return {
          '@context': 'http://schema.org',
          '@type': 'Dataset',
          name: 'title',
          description: 'description',
          creator: [
            {
              '@type': 'Organization',
              url: 'http://dbcls.rois.ac.jp/',
              name: 'Database Center for Life Science',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                telephone: '81-4-7135-5508',
              },
            },
          ],
        };
      },
    },
  };
</script>

<style lang="sass">
  .container
    margin-top: 15px
    border-top: 3px solid $MAIN_COLOR
    display: flex
    padding: 60px 160px 0
  .category_title
    color: $MAIN_COLOR
    padding-right: 150px
    font-size: 34px
    margin: 0
    > p
      padding-bottom: 20px
      font-size: 18px
      line-height: 2em
      margin: 0
</style>
