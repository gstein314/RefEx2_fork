<template>
  <ul class="pagination-container">
    <li class="first-page" @click="changePage(1)">&#60;&#60;</li>
    <li class="previous-page" @click="changePage(currentPage - 1)">&#60;</li>
    <li
      v-for="(pageNumber, i) in pagesNumbersShown"
      :key="i"
      class="pagination-item"
      @click="$emit('change-page', pageNumber)"
    >
      {{ pageNumber }}
    </li>
    <li class="next-page" @click="changePage(currentPage + 1)">&#62;</li>
    <li class="last-page" @click="changePage(pagesNumber)">&#62;&#62;</li>
  </ul>
</template>

<script>
  export default {
    props: {
      pagesNumber: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        currentPage: 0,
      };
    },
    computed: {
      pageList() {
        const list = [];
        for (let i = 1; i <= this.pagesNumber; i++) {
          list.push(i);
        }
        return list;
      },
      pagesNumbersShown() {
        return this.pageList.slice(this.currentPage - 2, this.currentPage + 3);
      },
    },
    methods: {
      changePage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.pagesNumber) {
          return;
        }
        this.currentPage = pageNumber;
        this.$emit('change-page', pageNumber);
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
