<template>
  <div class="container">
    <h2 class="category_title">Datasets</h2>
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
    padding: 90px
  .category_title
    color: $MAIN_COLOR
    padding-right: 150px
    font-size: 34px
    margin: 0
</style>
