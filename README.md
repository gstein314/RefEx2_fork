# Refex

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Naming rules for variables

- #### `JS variables`

  camelCase

  ***

- #### `Vuex variables`

  snake_case

  ***

- #### `CSS classes`

  snake*case
  \_but can sometimes be kebab-case due to use of plugin*

  ***

- ### `json / config files`
  snake_case

## Maintenance for filters(eg. sample / gene)

A filter consists of the following attributes:

1. an object in the `static/filters.json'

```JSON
  {
    // name of the filter. This name should correspond to the API prefix
    "name": "gene",


    // columns to be shown in the results on the index page & project page.
    // in case of 'sample', these filters are set by the backend hence not in this file
    // column: parameter refers to the key of the object in the API results
    // label: label of column
    // note: sub label of column
    // is_checkbox: if true, the value cannot be freely set by the user but is a choice of preset options
    // is_displayed: if true, the column is shown by default
    // is_ontology: if true, the column has note as sublabel at the project table
    "filter": [
      {
        "column": "symbol",
        "label": "GeneSymbol",
        "note": "",
        "is_checkbox": false,
        "is_displayed": true,
        "is_ontology": false
      },
    ],
  }
```

2. a dedicated screenerView in `components/screener` named as `ScreenerView{filterName}`

## Maintenance for species (eg. human/ mouse)

A specie consists of the following attributes:

1. an object in `refex-sample/datasets.json'

```JSON
  {
    // name of specie. `_` characters will be parsed to ` `
    "species": "Human",
    // search examples shown in searchBar component
    "search_conditions": [
      {
        "label": "Gene Name",
        "examples": ["transcription factor"]
      },
      { "label": "Symbol", "examples": ["ITG"] },
      { "label": "Summary", "examples": ["Breast cancer"] }
    ],
    // array of info by dataset
    "datasets": [
      // dataset: dataset name
      // label: label of dataset
      // gene: Information for gene filter which is different by dataset
      //       info that does not differ by dataset is set in static/filters.json
      // sample: Infromation for sample filter which is different by dataset
      //       includes filter array since the columns used in tables are different per dataset
      {
        "dataset": "humanFantom5",
        "label": "FANTOM5",
        "gene": {
          "key": "ncbiGeneId",
          "header": "NCBI Gene ID",
          "item_comparison_example": [
            {
              "route": "5460,6657,9314,4609",
              "label": "Yamanaka Factors (OCT3/4, SOX2, KLF4 and C-MYC-OSKM)"
            }
          ]
        },
        "sample": {
          "filter": [
            {
              "column": "SampleTypeCategory",
              "label": "Sample type",
              "note": "FANTOM5",
              "is_checkbox": true,
              "is_displayed": true,
              "is_ontology": false
            },
          ],
          "item_comparison_example": [
            {
              "route": "RES00001676,RES00001677,RES00001678",
              "label": "Adipocyte differentiation"
            },
          ],
          "search_conditions": [
            {
              "label": "Sample Name",
              "examples": ["liver", "lung"]
            }
          ]
        }
      }
    ]
  }
```

2. an SVG icon in `components/icons` by the name of `Icon{SpecieName}` . The name of the specie should be in PascalCase without `_`

## Main API callings in front-end app

＊all API callings are done by Axios and have a default base of 'https://refex2-api.dbcls.jp/' as set in `nuxt.config.js`

1. ### Auto suggestions - upon creation

   #### api

   ```JavaScript
    // GET API call
    `api/cv`
   ```

   ***

   #### parameters

   n/a

   ***

   #### response

   Object with dataset names are parameters. These then contain the fixed options for the screener & column filters

   ```JavaScript
   gtexV8: {
    Age: ["20-29", "20-79", "30-39", "40-49", "50-59", "60-69", "70-79"],
    Sex: ["F", "M", "Mixed"]
    }
   ```

   ***

   #### place of usage

   used in `components/ScreenerView/ScreenerViewSample.vue` upon creation to set autocomplete items. The API is only called on creation and not updated afterwards.

2. ### Auto suggestions - real time API fetch for GO terms

   #### api

   ```JavaScript
    // POST API graphQI call
    `gql`
   ```

    #### parameters

        - `query`
          - object containing the following
          ```JavaScript
            `{ goSuggest (text: ${SEARCH_TERM}, dataset: ${DATASET_NAME}) { goId, goTerm }}`
          ```
        - `SEARCH_TERM`
          - string reffering to the search key inputted by the user
        - `DATASET_NAME`
          - string reffering to the dataset name as set in `datasets.json`

    #### response

    Object with `data` and `goSuggest` array in that.

    ```JavaScript
    // example of Genes with GO terms auto completion list.
    {
        "data": {
          "goSuggest": [
            {
              "goId": "GO:0022900",
              "goTerm": "electron transport chain"
            }
          ]
        }
    }
    ```

    #### place of usage

    used in `components/ScreenerView/ScreenerViewGene.vue` when the input for `temporaryParameters.go_term` has been changed. This process is done by the `vue-tags-input` external plugin.

3.  ### Results and Estimated results number fetch of Index page

    #### api

    ```JavaScript
     // POST API call
     `gql`
    ```

    see more and test[https://refex2-api.dbcls.jp/gql]

    ***

    #### parameters

    - `query`

      ```JavaScript
      // string with the following structure
      `${SPECIE}${DATASET}${FILTERTYPE}${NUMFOUND}(${FILTER_PARAMETERS}){${RESPONSE_PARAMETERS}}`

      // SPECIE - specie selected by user.
      // Uses`suggestions_key` property of `static/species.json`

      // DATASET - dataset selected by user.
      // Uses a single item of `projects` of `static/species.json`

      // FILTERTYPE - filtertype selected by user.
      // Uses `name` property of  `static/filters.json`

      // NUMFOUND - suffix in case the API is called to get the estimated result count.
      // In this case, `Numfound` is attached to the string.

      // RESPONSE_PARAMETERS - properties that should be included in response separated by spaces.

      // FILTER_PARAMETERS - filters set by user on the `index` page.
      // Contains each key and value of the filter


      // example calling both `response` and `numfound` API
      `humanFantom5Sample(UBERON: "skin epidermi", )
          {
              Description
              biosample
              UBERON
              CL
              NCIT
          } humanFantom5SampleNumfound }"`
      ```

    ***

    #### response

    Object with `data` property containing dynamic result properties based on `${SPECIE}${DATASET}${FILTERTYPE}`.

    ```JavaScript
        {
          data:
           {
             // only available in case `${SPECIE}${DATASET}${FILTERTYPE}` was part of the POST calling
             // contains result data shown in `components/ResultsWrapper.vue`
             // array contains objects with keys set at `columns` of the FILTERTYPE as set in`static/filters.json`
             `${SPECIE}${DATASET}${FILTERTYPE}`: [],

             // only available in case `${SPECIE}${DATASET}${FILTERTYPE}${NUMFOUND}` was part of the POST calling
             // only counts amount of results as number
             `${SPECIE}${DATASET}${FILTERTYPE}${NUMFOUND}`: 0
           }
        }

         // example of API response with both `response` and `numfound`
         {
             data:
                 {
                     humanFantom5Sample:
                     [
                         {
                             Description: "basal cell carcinoma cell line:TE 354.T",
                             biosample: "SAMD00004671",
                             UBERON: "skin epidermis"
                             ,CL: "basal cell of epidermis",
                             NCIT: "Skin basal cell carcinoma"
                         }...
                     ]
                     humanFantom5SampleNumfound :19
                 }
         }
    ```

    ***

    #### place of usage

    used in `components/SearchBar.vue` when

    1. a filter has changed value, triggering a `Numfound` search to update the estimated results.
    2. the `search` button has been clicked, triggering a `results` and `Numfound` API call.
       The query itself is formed in the `suggest_query` method.

4.  ### Result data for project page

    #### api

    ```JavaScript
    // GET API call
    `api/${FILTER_TYPE}/${ID}?dataset=${DATASET_NAME}`
    ```
    #### parameters
    - `FILTER_TYPE`
       - one of the filters as set in `static/filters.json`. In case of sample, columns of gene are used and vice versa
    - `ID`
       - array of IDS to get. Either sample or Gene ids
    - `DATASET_NAME`
       - name of dataset to get information from

     #### response
     object with table results and details of the id.
     ```JavaScript
     {
       // contains details about requested id. `sample_info` in case of sample data.
       "gene_info": {
         alias: '[\"AOF2\", \"BHC110\", \"CPRF\", \"KDM1\", \"LSD1\"]',
         id: 23028
         name: "lysine demethylase 1A"
         symbol: "KDM1A",
       },
       // contains results for table
       "refex_info": []
     }
    ````

    #### place of usage

    used in `pages/_organism/_project.vue` in asyncData. Upon opening the page, the info in the URL is used to make this API call.
    In this way, one can use the URL directly to go the project page without having to pass index page.

5.  ### Gene information with information icon

    #### api

    ```JavaScript
    // GET API call
    `https://mygene.info/v3/gene/${GENE_ID}`
    ```

    #### parameters

    - `GENE_ID`
    - id of gene info to get

    #### response

    Object with detailed information about the gene.

    ```JavaScript
       HGNC: "56187"
       accession: {genomic: ["AC078778.34", "AC079313.35", "CP068266.2", "KF459780.1", "NC_000012.12", "NC_060936.1"],...}]
       ...
    ```

    #### place of usage

    used in `components/ModalView/ModalViewGene.vue` to get detailed information about specific gene to show when user clicks on information icon.

## Icons

### Font awesome icons

- pro icons are used in this project so it is neccesary to set a token. See [official documentation](https://fontawesome.com/v5/docs/web/setup/use-package-managers) for more info

### SVG icons

- all SVG icons should be set in `components/icons` by the name of `Icon{NameOfIconInPascalCase}`.
- When using the icon, import the `components/icons/IconBase` and pass the `icon-name` of `NameOfIconInPascalCase`.
- the color can be optionally set by `icon-color`. If it is not set, it will default to `currentColor`(inherits parents color)
- make sure all SVG icons do not have a `fill` color set otherwise the `components/icons/IconBase` will not be able to alter the color.
- if the SVG icon makes use of `stroke`, set `strokeColor` as a prop and use it for all strokes of the icon. (see `components/icons/IconOryzasativa` for an example)

## Folders

### `components`

For the component folder, find the preferred structure below:

1. Simple, dynamic components to be used all throughout the app

   - Stored inside the `components` folder
   - name of single component consist of 2 words in PascalCase eg `LoadingSpinner`
   - Should be small-scale modals to be imported to other components regardless of their parent

2. Complex components with specific purpose and child components

   - name of parent component should consist of 2 words in PascalCase eg `FilterSection`
   - folder name should be identical to the parent component name eg `@/components/FilterSection/FilterSection.vue`
   - child components should start with the same name as parent + child name in 1 word eg `FilterSectionCondition.vue`
   - children/siblings can be directly imported in the parent component by using PascalCase in the vue template

   ```
   <!-- template of FilterSection (parent component) -->
   <template>
       <FilterSectionSearch />
       <FilterSectionButtons />
   </template>
   ```

3. Components that belong to a similair group but do not neccesarily have a parent/child relationship
   - grouped together in folder
   - folder name should be a single word like `search`

### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.
Example: `/static/robots.txt` is mapped as `/robots.txt`.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.
More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).

