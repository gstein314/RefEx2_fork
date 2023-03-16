<template>
  <div v-if="pagesList.length > 0" class="pagination_wrapper">
    <div class="wrapper_item_left"></div>
    <div class="wrapper_item_middle">
      <ul>
        <li
          :class="{ arrows: true, disabled: currentPage === 1 }"
          @click="setPageNumber(1)"
        >
          <font-awesome-icon
            icon="angle-double-left"
            class="angle-double-left"
          />
        </li>
        <li
          :class="{ arrows: true, disabled: currentPage === 1 }"
          @click="setPageNumber(currentPage - 1)"
        >
          <font-awesome-icon icon="angle-left" class="angle-left" />
        </li>
        <li v-if="isHiddenPagesLeft" class="dots">
          <span>...</span>
        </li>

        <li
          v-for="(pageNumber, i) in pagesNumbersShown"
          :key="i"
          :class="{ pagination_item: true, active: pageNumber === currentPage }"
          @click="setPageNumber(pageNumber)"
        >
          <span> {{ pageNumber }}</span>
        </li>
        <li v-if="isHiddenPagesRight" class="dots">
          <span>...</span>
        </li>
        <li
          :class="{ arrows: true, disabled: currentPage === pagesNumber }"
          @click="setPageNumber(currentPage + 1)"
        >
          <font-awesome-icon icon="angle-right" class="angle-right" />
        </li>
        <li
          :class="{ arrows: true, disabled: currentPage === pagesNumber }"
          @click="setPageNumber(pagesNumber)"
        >
          <font-awesome-icon
            icon="angle-double-right"
            class="chevron-double-right"
          />
        </li>
      </ul>
    </div>
    <div class="wrapper_item_right">
      <div class="showing_page">
        <div>
          <b>{{ firstItemOrderInCurrentPage }}</b>
          -
          <template v-if="tableType === 'index'">
            <b>{{ lastItemOrderInCurrentPage(resultsNum) }}</b>
            of
            {{ resultsNum.toLocaleString() }}
          </template>
          <template v-else-if="tableType === 'project'">
            <b>{{ lastItemOrderInCurrentPage(resultsDisplayed.length) }}</b>
            of
            {{ resultsDisplayed.length.toLocaleString() }}
          </template>
        </div>
        <div class="display_pagination">
          <label for="pagination">Show</label>
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
      </div>
    </div>
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
      resultsDisplayed: {
        type: Array,
        default: () => [],
      },
    },

    computed: {
      ...mapGetters({
        projectPaginationObject: 'get_project_pagination',
        indexPaginationObject: 'index_pagination',
        resultsByName: 'results_by_name',
        activeFilter: 'active_filter',
        projectResults: 'get_project_results',
      }),
      resultsNum() {
        return this.resultsByName(this.activeFilter.name).results_num ?? 0;
      },
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
      firstItemOrderInCurrentPage() {
        return (
          1 +
          (this.currentPage - 1) * this.currentLimit
        ).toLocaleString();
      },
    },
    watch: {
      resultsDisplayed() {
        this.setPageNumber(1);
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
      setPageNumber(page) {
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
      lastItemOrderInCurrentPage(totalNumOfResults) {
        return this.currentPage * this.currentLimit > totalNumOfResults
          ? totalNumOfResults.toLocaleString()
          : (this.currentPage * this.currentLimit).toLocaleString();
      },
    },
  };
</script>

<style lang="sass" scoped>

  .pagination_wrapper
    display: flex
    align-items: center
    justify-content: space-between
    & .wrapper_item_left, .wrapper_item_middle, .wrapper_item_right
      width: 100%
    > .wrapper_item_left
      display: block
    > .wrapper_item_right
      > .showing_page
        justify-content: flex-end
        font-size: 14px
        display: flex
        gap: 10px
        align-items: center
    > .display_pagination
      margin-top: 1rem
    > .wrapper_item_middle
      > ul
        padding: 0
        display: flex
        gap: 2px
        flex-direction: row
        align-items: baseline
        justify-content: center
        list-style: none
        align-items: center
        li
          user-select: none
          >span
            display: flex
            align-items: center
            justify-content: center
            width: 25px
            height: 25px
          &.pagination_item
            >span
              border: 1px rgba($GRAY, 0.3) solid
              border-radius: 3px
              box-sizing: border-box
              min-width: 25px
              width: auto
          &.arrows, &.pagination_item
            cursor: pointer
            position: relative
            &.active
              color: $WHITE
              >span
                border: 1px $MAIN_COLOR solid
                background-color: $MAIN_COLOR
            &:hover
              font-weight: bold
          &.dots
            >span
              display: block
              text-align: center
          &.arrows
            width: 1.5rem
            color: $COLOR_1
            text-align: center
            font-size: 1rem
            line-height: normal
  .disabled
    pointer-events: none
    opacity: 0.3
</style>
