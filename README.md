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

## Maintenance for filters(eg. sample / gene)

A filter consists of the following attributes:

1. an object in the `static/filters.json'

```JSON
  {
    // name of the filter. This name should correspond to the API prefix
    "name": "gene",
    // columns to be shown in the results on the index page. key refers to the key of the object in the API results
    "columns": [
      { "header": "GeneSymbol", "key": "symbol" },
      { "header": "GeneName", "key": "name" },
      { "header": "Alias", "key": "alias" },
      { "header": "NCBI GeneID", "key": "ncbiGeneId" }
    ],
    // search examples shown in searchBar component
    "search_conditions": [
      {
        "label": "Gene Name",
        "examples": ["transcription factor"]
      },
      { "label": "Symbol", "examples": ["ITG"] },
      { "label": "Summary", "examples": ["Breast cancer"] }
    ]
  }
```

2. a dedicated screenerView in `components/screener` named as `ScreenerView{filterName}`

## Maintenance for species (eg. human/ mouse)

A specie consists of the following attributes:

1. an object in the `static/filters.json'

```JSON
  {
    // name of specie. `_` characters will be parsed to ` `
    "name": "homo_sapiens",
    // list of projects associated witht the species, this project name will be used as an API prefix.
    "projects": ["FANTOM5"]
  }
```

2. an SVG icon in `components/icons` by the name of `Icon{SpecieName}` . The name of the specie should be in PascalCase without `_`

### `components`

For the component folder, find the preferred structure below:

1. Simple, dynamic components to be used all troughout the app

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

#### use of SVG icons

- all SVG icons should be set in `components/icons` by the name of `Icon{NameOfIconInPascalCase}`.
- When using the icon, import the `components/icons/IconBase` and pass the `icon-name` of `NameOfIconInPascalCase`.
- the color can be optionally set by `icon-color`. If it is not set, it will default to `currentColor`(inherits parents color)
- make sure all SVG icons do not have a `fill` color set otherwise the `components/icons/IconBase` will not be able to alter the color.
- if the SVG icon makes use of `stroke`, set `strokeColor` as a prop and use it for all strokes of the icon. (see `components/icons/IconOryzasativa` for an example)

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
