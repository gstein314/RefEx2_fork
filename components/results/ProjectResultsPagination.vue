<template>
  <ul class="pagination-container">
    <li class="first-page" @click="handleChangePage(1)">&#60;&#60;</li>
    <li class="previous-page" @click="handleChangePage(currentPage - 1)">
      &#60;
    </li>
    <li
      v-for="(pageNumber, i) in pagesNumbersShown"
      :key="i"
      :class="{ 'pagination-item': true, active: pageNumber === currentPage }"
      @click="handleChangePage(pageNumber)"
    >
      {{ pageNumber }}
    </li>
    <li class="next-page" @click="handleChangePage(currentPage + 1)">&#62;</li>
    <li class="last-page" @click="handleChangePage(pagesNumber)">&#62;&#62;</li>
  </ul>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  export default {
    props: {
      pagesNumber: {
        type: Number,
        default: 1,
      },
    },

    computed: {
      ...mapGetters({
        paginationObject: 'get_project_pagination',
      }),

      pagesList() {
        const list = [];
        console.log('this.pagesNumber', this.pagesNumber);
        for (let i = 1; i <= this.pagesNumber; i++) {
          list.push(i);
        }

        return list;
      },
      currentPage() {
        return (
          Math.floor(
            this.paginationObject.offset / this.paginationObject.limit
          ) + 1
        );
      },
      pagesNumbersShown() {
        const PAGES_LEFT = 2;
        const PAGES_RIGHT = 2;

        if (this.currentPage <= PAGES_LEFT + 1) {
          return this.pagesList.slice(0, PAGES_RIGHT + PAGES_LEFT + 1);
        }
        if (this.currentPage > this.pagesNumber - PAGES_RIGHT - 1) {
          return this.pagesList.slice(-(PAGES_RIGHT + PAGES_LEFT + 1));
        }

        const minPage =
          this.currentPage - PAGES_LEFT - 1 < 1
            ? 1
            : this.currentPage - PAGES_LEFT - 1;

        const maxPage =
          this.currentPage + PAGES_RIGHT > this.pagesNumber
            ? this.pagesNumber
            : this.currentPage + PAGES_RIGHT;
        return this.pagesList.slice(minPage, maxPage);
      },
    },

    methods: {
      ...mapMutations({
        updatePagination: 'set_project_pagination',
      }),
      setOffset(offset) {
        this.updatePagination({ ...this.paginationObject, offset });
      },
      handleChangePage(page) {
        if (page < 1 || page > this.pagesNumber) {
          return;
        }
        this.setOffset((page - 1) * this.paginationObject.limit);
      },
    },
  };
</script>

<style lang="sass" scoped>

  ul.pagination-container
      margin-top: 20px
      display: flex
      justify-content: center
      flex-direction: row
      align-items: baseline
      list-style: none
      .pagination-item
          height: 1.2rem
          text-align: center
          margin: 0 10px
          cursor: pointer
          position: relative
          &.active
              color: $MAIN_COLOR
              font-weight: bold
              &::after
                  position: absolute
                  content: ''
                  display: block
                  width: 100%
                  height: 0.1rem
                  background-color: $COLOR_1
          &:hover
              color: $MAIN_COLOR
              font-weight: bold
          &:first-child
              margin-left: 0

          &:last-child
              margin-right: 0
</style>
