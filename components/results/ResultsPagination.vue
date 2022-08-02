<template>
  <div v-if="pagesList.length > 0" class="pagination-wrapper">
    <div class="display_pagination">
      <label for="pagination">Items per page</label>
      <select id="pagination" name="pagination" @change="setLimit">
        <option
          v-for="n in [10, 20, 50, 100]"
          :key="`pagination-limit-${n}`"
          :value="n"
          :selected="n === currentLimit"
        >
          {{ n }}
        </option>
      </select>
    </div>
    <ul>
      <li
        :class="{ arrows: true, disabled: currentPage === 1 }"
        @click="handleChangePage(1)"
      >
        <font-awesome-icon icon="angle-double-left" class="angle-double-left" />
      </li>
      <li
        :class="{ arrows: true, disabled: currentPage === 1 }"
        @click="handleChangePage(currentPage - 1)"
      >
        <font-awesome-icon icon="angle-left" class="angle-left" />
      </li>
      <li v-if="isHiddenPagesLeft" class="dots">
        <span>...</span>
      </li>

      <li
        v-for="(pageNumber, i) in pagesNumbersShown"
        :key="i"
        :class="{ 'pagination-item': true, active: pageNumber === currentPage }"
        @click="handleChangePage(pageNumber)"
      >
        <span> {{ pageNumber }}</span>
      </li>
      <li v-if="isHiddenPagesRight" class="dots">
        <span>...</span>
      </li>
      <li
        :class="{ arrows: true, disabled: currentPage === pagesNumber }"
        @click="handleChangePage(currentPage + 1)"
      >
        <font-awesome-icon icon="angle-right" class="angle-right" />
      </li>
      <li
        :class="{ arrows: true, disabled: currentPage === pagesNumber }"
        @click="handleChangePage(pagesNumber)"
      >
        <font-awesome-icon
          icon="angle-double-right"
          class="chevron-double-right"
        />
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  export default {
    props: {
      tableType: {
        type: String,
        default: 'project',
      },
      pagesNumber: {
        type: Number,
        default: 1,
      },
    },

    computed: {
      ...mapGetters({
        projectFilters: 'project_filters',
        projectPaginationObject: 'get_project_pagination',
        indexPaginationObject: 'index_pagination',
      }),
      paginationObject() {
        return this.tableType === 'index'
          ? this.indexPaginationObject
          : this.projectPaginationObject;
      },
      currentLimit() {
        return this.paginationObject.limit;
      },
      pagesList() {
        const list = [];
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
      isHiddenPagesLeft() {
        return this.pagesNumbersShown[0] !== 1;
      },
      isHiddenPagesRight() {
        return (
          this.pagesNumbersShown[this.pagesNumbersShown.length - 1] !==
          this.pagesNumber
        );
      },
    },

    methods: {
      ...mapMutations({
        updatePagination: 'set_pagination',
      }),
      setOffset(offset) {
        this.updatePagination({
          ...this.paginationObject,
          offset,
          type: this.tableType,
        });
      },
      handleChangePage(page) {
        if (page < 1 || page > this.pagesNumber) {
          return;
        }
        this.setOffset((page - 1) * this.paginationObject.limit);
      },
      setLimit(e) {
        const newLimit = +e.target.value;
        const newPage = Math.max(
          Math.ceil(this.paginationObject.offset / newLimit),
          1
        );
        const newOffset = (newPage - 1) * newLimit;
        this.updatePagination({
          limit: newLimit,
          offset: newOffset,
          type: this.tableType === 'index' ? 'index' : 'project',
        });
      },
    },
  };
</script>

<style lang="sass" scoped>

  .pagination-wrapper
    display: grid
    justify-content: left
    > .display_pagination
      margin-top: 1rem
    >ul
      padding: 0
      margin-top: 2rem
      display: flex
      justify-content: center
      flex-direction: row
      align-items: baseline
      list-style: none
      position: relative
      &::after
        display: block
        content: ''
        width: calc(100% - 3rem)
        position: absolute
        bottom: -0.2rem
        height: 0.04rem
        background-color: $GRAY
      li
        user-select: none
        width: calc(62/16 * 1rem)
        >span
          display: block
          text-align: center
        &.arrows, &.pagination-item
          cursor: pointer
          position: relative
          &.active
            font-weight: bold
            &::after
              position: absolute
              content: ''
              display: block
              width: 100%
              height: 0.2rem
              background-color: $COLOR_1
          &:hover
            color: $MAIN_COLOR
            font-weight: bold
        &.arrows
          width: 1.5rem
          color: $COLOR_1
          text-align: center
          font-size: 1rem
  .disabled
    pointer-events: none
    opacity: 0.5
</style>
