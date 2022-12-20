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
                :checked="isAllChecked_ROKU"
                @click="toggleAllSpecificityROKU()"
              />
            </td>
            <td class="group">Group</td>
            <td class="sample">Sample</td>
            <td class="horl">High or Low</td>
            <td class="entropy">Entropy (min)</td>
            <td class="entropy">Entropy (max)</td>
            <td
              colspan="2"
              class="delete_all"
              @click="deleteAllSpecificityROKU"
            >
              <font-awesome-icon icon="trash" /> Delete All
            </td>
          </tr>
          <tr v-for="(val, index) in specificityROKU" :key="val.id">
            <td>
              <input
                v-model="val.check"
                type="checkbox"
                @click="addSpecificityROKU(index)"
              />
            </td>
            <td>
              <input
                v-model="val.group"
                type="text"
                placeholder="select a group"
                @input="addIndexSpecificityROKU(index, val.group)"
              />
            </td>
            <td>
              <input
                v-model="val.sample"
                type="text"
                placeholder="search samples by text"
                @input="addIndexSpecificityROKU(index, val.sample)"
              />
            </td>
            <td>
              <input
                v-model="val.horl"
                type="text"
                placeholder="High"
                @input="addIndexSpecificityROKU(index, val.horl)"
              />
            </td>
            <td>
              <input
                v-model="val.emin"
                type="text"
                placeholder="1"
                @input="addIndexSpecificityROKU(index, val.emin)"
              />
            </td>
            <td>
              <input
                v-model="val.emax"
                type="text"
                placeholder="5"
                @input="addIndexSpecificityROKU(index, val.emax)"
              />
            </td>
            <td class="icon">
              <button
                class="delete_btn"
                :class="{ disabled: !val.delete }"
                :disabled="!val.delete"
                @click="delSpecificityROKU(index)"
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
                :checked="isAllChecked_Tau"
                @click="toggleAllSpecificityTau()"
              />
            </td>
            <td class="group">Group</td>
            <td class="cutoff">Cutoff</td>
            <td class="condition">Condition</td>
            <td colspan="2" class="delete_all" @click="deleteAllSpecificityTau">
              <font-awesome-icon icon="trash" /> Delete All
            </td>
          </tr>
          <tr v-for="(val, index) in specificityTau" :key="val.id">
            <td>
              <input
                v-model="val.check"
                type="checkbox"
                @click="addSpecificityTau(index)"
              />
            </td>
            <td>
              <input
                v-model="val.group"
                type="text"
                placeholder="select a group"
                @input="addIndexSpecificityTau(index, val.group)"
              />
            </td>
            <td>
              <input
                v-model="val.cutoff"
                type="text"
                placeholder="0.1"
                @input="addIndexSpecificityTau(index, val.cutoff)"
              />
            </td>
            <td>
              <input
                v-model="val.condition"
                type="text"
                placeholder="≧"
                @input="addIndexSpecificityTau(index, val.condition)"
              />
            </td>
            <td class="icon">
              <button
                class="delete_btn"
                :class="{ disabled: !val.delete }"
                :disabled="!val.delete"
                @click="delSpecificityTau(index)"
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
        specificityROKU: [
          {
            group: '',
            sample: '',
            horl: '',
            emin: '',
            emax: '',
            check: false,
            delete: false,
          },
        ],
        specificityTau: [
          {
            group: '',
            cutoff: '',
            condition: '',
            check: false,
            delete: false,
          },
        ],
        isAllChecked_ROKU: false,
        isAllChecked_Tau: false,
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
      addSpecificityROKU(index) {
        this.specificityROKU[index].check = !this.specificityROKU[index].check;
      },
      toggleAllSpecificityROKU() {
        this.isAllChecked_ROKU = !this.isAllChecked_ROKU;
        if (this.isAllChecked_ROKU) {
          for (const index in this.specificityROKU) {
            this.specificityROKU[index].check = true;
          }
        } else {
          for (const index in this.specificityROKU) {
            this.specificityROKU[index].check = false;
          }
        }
      },
      toggleAllSpecificityTau() {
        this.isAllChecked_Tau = !this.isAllChecked_Tau;
        if (this.isAllChecked_Tau) {
          for (const index in this.specificityTau) {
            this.specificityTau[index].check = true;
          }
        } else {
          for (const index in this.specificityTau) {
            this.specificityTau[index].check = false;
          }
        }
      },
      delSpecificityROKU(index) {
        this.specificityROKU.splice(index, 1);
      },
      addIndexSpecificityROKU(index, value) {
        if (value.trim().length > 0) {
          if (!this.specificityROKU[index + 1]) {
            this.specificityROKU.push({
              group: '',
              sample: '',
              horl: '',
              emin: '',
              emax: '',
              check: false,
              delete: false,
            });
          }
          this.specificityROKU[index].check = true;
          this.specificityROKU[index].delete = true;
        }
      },
      deleteAllSpecificityROKU() {
        this.specificityROKU = [
          {
            group: '',
            sample: '',
            horl: '',
            emin: '',
            emax: '',
            check: false,
            delete: false,
          },
        ];
      },
      addSpecificityTau(index) {
        this.specificityTau[index].check = !this.specificityTau[index].check;
      },
      delSpecificityTau(index) {
        this.specificityTau.splice(index, 1);
      },
      addIndexSpecificityTau(index, value) {
        if (value.trim().length > 0) {
          if (!this.specificityTau[index + 1]) {
            this.specificityTau.push({
              group: '',
              cutoff: '',
              condition: '',
              check: false,
              delete: false,
            });
          }
          this.specificityTau[index].check = true;
          this.specificityTau[index].delete = true;
        }
      },
      deleteAllSpecificityTau() {
        this.specificityTau = [
          {
            group: '',
            cutoff: '',
            condition: '',
            check: false,
            delete: false,
          },
        ];
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
            width: 5%
    .filter_specificity_ROKU
      > table
        > tr
          > .icon
            text-align: center
          > .group, .sample
            width: 30%
          > .horl, .entropy
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
