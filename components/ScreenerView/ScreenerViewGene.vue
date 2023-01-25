<template>
  <!-- v-html setup neccesary for plugin, does NOT use user input/API data and is therefore safe to use -->
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <h3>Genes with Chr</h3>
    <no-ssr>
      <multi-select
        v-model="chrValue"
        :allow-empty="true"
        :close-on-select="false"
        placeholder=""
        :options="chrOptions"
        :multiple="true"
        ><template slot="option" slot-scope="props">
          <div class="option">
            <input
              :checked="chrValue.includes(props.option)"
              type="checkbox"
              :value="props.option.name"
            />
            <span class="option__small">{{ props.option }}</span>
            <!-- <font-awesome-icon icon="exclamation-triangle" /> -->
          </div>
        </template>
        <!-- <template slot="selection" slot-scope="{ values }">
          <span
            v-if="values.length &amp;&amp; values.length > 3"
            class="multiselect__single"
          >
            {{
              values.length === filterObj.options1.length
                ? 'all'
                : values.length
            }}
            options selected
          </span>
        </template> -->
      </multi-select>
    </no-ssr>

    <h3>Genes with Type of Gene</h3>
    <no-ssr>
      <multi-select
        v-model="TOGValue"
        :allow-empty="true"
        :close-on-select="false"
        placeholder=""
        :options="TOGOptions"
        :multiple="true"
        ><template slot="option" slot-scope="props">
          <div class="option">
            <input
              type="checkbox"
              :checked="TOGValue.includes(props.option)"
              :value="props.option.name"
            />
            <span class="option__small">{{ props.option }}</span>
            <!-- <font-awesome-icon icon="exclamation-triangle" /> -->
          </div>
        </template>
        <!-- <template slot="selection" slot-scope="{ values }">
          <span
            v-if="values.length &amp;&amp; values.length > 3"
            class="multiselect__single"
          >
            {{
              values.length === filterObj.options2.length
                ? 'all'
                : values.length
            }}
            options selected
          </span>
        </template> -->
      </multi-select>
    </no-ssr>

    <h3>
      Genes with GO Term
      <span class="example"
        >e.g.
        <span
          class="sample_value"
          @click="
            handleSingleTagUpdate('GO:0008134', 'transcription factor binding')
          "
          >transcription factor binding</span
        >,
        <span
          class="sample_value"
          @click="handleSingleTagUpdate('GO:0030154', 'cell differentiation')"
          >cell differentiation
        </span>
      </span>
    </h3>
    <no-ssr>
      <vue-tags-input
        v-model="temporaryParameters.goTerm"
        :tags="parameters.go"
        :autocomplete-items="autoComplete.go"
        add-only-from-autocomplete
        :placeholder="placeholderGOTerm"
        @input="updateAutoComplete"
        @tags-changed="setTags($event, 'go')"
      >
        <div
          slot="autocomplete-item"
          slot-scope="{ item }"
          class="my-item"
          @click="handleSingleTagUpdate(item.id, item.text)"
          v-html="$highlightedSuggestion(item.text, temporaryParameters.goTerm)"
        ></div>
      </vue-tags-input>
    </no-ssr>

    <h3>Filter by Tissue specificity (ROKU)</h3>
    <no-ssr>
      <div class="filter_specificity_ROKU">
        <table>
          <tr>
            <td class="check">
              <input
                type="checkbox"
                :checked="specificityROKU.isAllChecked"
                @click="dispatchSpecificityAction('ROKU', 'CHECK_ALL')"
              />
            </td>
            <td
              v-for="filter in filtersROKU"
              :key="filter.id"
              :class="filter.class"
            >
              {{ filter.name }}
            </td>
            <td
              colspan="2"
              class="delete_all"
              @click="dispatchSpecificityAction('ROKU', 'DEL_ALL')"
            >
              <font-awesome-icon icon="trash" /> Delete All
            </td>
          </tr>
          <tr
            v-for="(item, index) in specificityROKU.list"
            :key="item.id"
            :class="{ unchecked: !item.check }"
          >
            <td class="check">
              <input
                v-model="item.check"
                type="checkbox"
                @click="dispatchSpecificityAction(item.type, 'CHECK', index)"
              />
            </td>
            <td v-for="filter in filtersROKU" :key="filter.id">
              <input
                v-model="filter.group"
                type="text"
                :placeholder="filter.placeholder"
                @input="
                  dispatchSpecificityAction(item.type, 'ADD', index, item.group)
                "
              />
            </td>
            <td class="icon">
              <button
                class="delete_btn"
                :class="{ disabled: !item.delete }"
                :disabled="!item.delete"
                @click="dispatchSpecificityAction(item.type, 'DEL', index)"
              >
                <font-awesome-icon icon="trash" />
                Delete
              </button>
            </td>
          </tr>
          <tr></tr>
        </table>
      </div>
    </no-ssr>

    <h3>Filter by Tissue specificity (tau)</h3>
    <no-ssr>
      <div class="filter_specificity_tau">
        <table>
          <tr>
            <td class="check">
              <input
                type="checkbox"
                :checked="specificityTau.isAllChecked"
                @click="dispatchSpecificityAction('Tau', 'CHECK_ALL')"
              />
            </td>
            <td
              v-for="filter in filtersTau"
              :key="filter.id"
              :class="filter.class"
            >
              {{ filter.name }}
            </td>
            <td
              colspan="2"
              class="delete_all"
              @click="dispatchSpecificityAction('Tau', 'DEL_ALL')"
            >
              <font-awesome-icon icon="trash" /> Delete All
            </td>
          </tr>
          <tr
            v-for="(item, index) in specificityTau.list"
            :key="item.id"
            :class="{ unchecked: !item.check }"
          >
            <td class="check">
              <input
                v-model="item.check"
                type="checkbox"
                @click="dispatchSpecificityAction(item.type, 'CHECK', index)"
              />
            </td>
            <td v-for="filter in filtersTau" :key="filter.id">
              <input
                v-model="filter.group"
                type="text"
                :placeholder="filter.placeholder"
                @input="
                  dispatchSpecificityAction(item.type, 'ADD', index, item.group)
                "
              />
            </td>
            <td class="icon">
              <button
                class="delete_btn"
                :class="{ disabled: !item.delete }"
                :disabled="!item.delete"
                @click="dispatchSpecificityAction(item.type, 'DEL', index)"
              >
                <font-awesome-icon icon="trash" />
                Delete
              </button>
            </td>
          </tr>
          <tr></tr>
        </table>
      </div>
    </no-ssr>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import MultiSelect from 'vue-multiselect';

  export default {
    components: { MultiSelect },
    data() {
      const specificityROKUDefaultItem = {
        type: 'ROKU',
        group: '',
        sample: '',
        horl: '',
        emin: '',
        emax: '',
        check: true,
        delete: true,
      };
      const specificityTauDefaultItem = {
        type: 'Tau',
        group: '',
        cutoff: '',
        condition: '',
        check: true,
        delete: true,
      };
      return {
        autocompleteStaticData: {},
        chrValue: [],
        TOGValue: [],
        chrCheckedValue: [],
        chrOptions: [],
        TOGOptions: [],
        // only used in this component
        temporaryParameters: {
          goTerm: '',
        },
        // passed down to API
        parameters: {
          go: [],
        },
        // will contain same keys as parameters. Autocompletion that does not come from the API should be hardcoded here in advance
        autoComplete: {
          go: [],
        },
        debounce: null,
        specificityROKU: {
          list: [{ ...specificityROKUDefaultItem }],
          defaultItem: { ...specificityROKUDefaultItem },
          isAllChecked: true,
        },
        specificityTau: {
          list: [{ ...specificityTauDefaultItem }],
          defaultItem: { ...specificityTauDefaultItem },
          isAllChecked: true,
        },
        filtersROKU: [
          {
            id: '1',
            name: 'Group',
            class: 'group',
            placeholder: 'select a group',
          },
          {
            id: '2',
            name: 'Sample',
            class: 'sample',
            placeholder: 'search samples by text',
          },
          { id: '3', name: 'High or Low', class: 'horl', placeholder: 'High' },
          {
            id: '4',
            name: 'Entropy (min)',
            class: 'entropy',
            placeholder: '1',
          },
          {
            id: '5',
            name: 'Entropy (max)',
            class: 'entropy',
            placeholder: '5',
          },
        ],
        filtersTau: [
          {
            id: '1',
            name: 'Group',
            class: 'group',
            placeholder: 'select a group',
          },
          {
            id: '2',
            name: 'Cutoff',
            class: 'cutoff',
            placeholder: '0.1',
          },
          { id: '3', name: 'Condition', class: 'condition', placeholder: '≧' },
        ],
      };
    },
    computed: {
      ...mapGetters({
        activeDataset: 'active_dataset',
      }),
      goTermString() {
        return this.parameters.go.map(tag => tag.id).join(', ');
      },
      placeholderGOTerm() {
        return this.temporaryParameters.goTerm === '' &&
          this.parameters.go.length < 1
          ? 'transcription factor binding'
          : '';
      },
      selection() {
        return this.chrValue.join();
      },
    },
    watch: {
      activeDataset() {
        // reset all keys of this.parameters to ''
        this.parameters = {
          go: [],
        };
      },
      parameters() {
        this.$emit('updateParameters', { go: this.goTermString });
      },
      chrValue() {
        console.log('event');
        this.handleChrTagsUpdate(this.chrValue);
      },
    },
    async created() {
      this.getAutoCompleteData().then(() => {});
    },
    methods: {
      getAutoCompleteData() {
        return this.$axios
          .$get(`api/cv`)
          .then(data => {
            this.autocompleteStaticData = data;
            this.chrOptions = data[
              this.activeDataset.dataset
            ].chromosomePosition
              .map(x => (!Number.isNaN(parseInt(x)) ? parseInt(x) : x))
              .sort(function (a, b) {
                const a1 = typeof a,
                  b1 = typeof b;
                return a1 < b1 ? -1 : a1 > b1 ? 1 : a < b ? -1 : a > b ? 1 : 0;
              });
            this.TOGOptions = data[this.activeDataset.dataset].typeOfGene;
          })
          .catch(_error => {
            this.setAlertModal({
              msg: 'Failed to get data in Screener View Sample',
            });
          });
      },
      updateAutoComplete() {
        clearTimeout(this.debounce);
        const query = `{ goSuggest (text: "${this.temporaryParameters.goTerm}", dataset: "${this.activeDataset.dataset}") { goId, goTerm }}`;
        this.debounce = setTimeout(() => {
          this.$axios
            .$post('gql', {
              query,
            })
            .then(response => {
              this.$set(
                this.autoComplete,
                'go',
                response.data?.goSuggest?.map(a => {
                  return { text: a.goTerm, id: a.goId };
                })
              );
            })
            .catch(() => console.warn('Oh. Something went wrong'));
        }, 300);
      },
      handleSingleTagUpdate(id, text, tiClasses = ['ti-valid'], key = 'go') {
        if (this.parameters[key].find(tag => tag.id === id)) {
          return;
        }
        this.$set(this.temporaryParameters, 'goTerm', '');
        this.setTags([{ id, text, tiClasses }], key);
      },
      handleChrTagsUpdate(tags) {
        console.log(tags);
      },
      setTags(newTags, key) {
        this.parameters = { ...this.parameters, [key]: newTags };
      },
      dispatchSpecificityAction(type, action, index, value) {
        const specificity = this[`specificity${type}`];
        const list = specificity.list;
        const targetItem = list[index];
        const defaultItem = specificity.defaultItem;
        switch (action) {
          case 'CHECK_ALL':
            specificity.isAllChecked = !specificity.isAllChecked;
            for (const item of list) {
              specificity.isAllChecked
                ? (item.check = true)
                : (item.check = false);
            }
            break;
          case 'CHECK':
            targetItem.check = !targetItem.check;
            break;
          case 'ADD':
            if (value.trim().length > 0) {
              if (!list[index + 1]) {
                list.push({ ...defaultItem });
              }
              targetItem.check = true;
              targetItem.delete = true;
            }
            break;
          case 'DEL':
            list.splice(index, 1);
            break;
          case 'DEL_ALL':
            list.splice(0, list.length);
            list.push({ ...defaultItem });
            break;
        }
      },
    },
  };
</script>

<style lang="sass" scoped>
  ::v-deep
    .multiselect
      input
        width: auto
      input[type="text"]
        +text_input
      .multiselect__tag
        background: $MAIN_COLOR
        > .multiselect__tag-icon
          background: none
          &:after
            color: white
      .multiselect__tags
        border: none
        background: $MAIN_COLOR_PALE
      .multiselect__option
        background: none
        > .option
          display: flex
          align-items: center
          gap: 10px
          > input[type="checkbox"]
            cursor: pointer
      .multiselect__element
        display: block
      .multiselect__option--highlight
        background: $MAIN_COLOR
      *[class^="multiselect__option"]
        &:after
          content: none

    .filter_specificity_ROKU, .filter_specificity_tau
      > table
        > tr
          > td
            font-size: 12px
            > input[type="checkbox"]
              cursor: pointer
            > .delete_btn
              +button
              align-items: initial
              padding: 13.5px 22px
              cursor: pointer !important
          > .delete_all
            color: $MAIN_COLOR
            cursor: pointer
          > .check
            padding-right: 5px
      .unchecked
        input
          background: #ccc
    .filter_specificity_ROKU
      > table
        > tr
          > .icon
            text-align: center
          > .group, .sample
            width: 30%
          > .horl
            width: 15%
          > .entropy
            width: 10%
    .filter_specificity_tau
      > table
        > tr
          > .icon
            text-align: center
          > .group
            width: 70%
          > .cutoff, .condition
            width: 15%
</style>
