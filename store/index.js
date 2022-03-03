import filters from '../static/filters.json';

export const state = () => ({
  active_taxon: 'homo_sapiens', //default,
  active_filter: 'gene',
  results: filters.reduce((acc, filter) => {
    acc[filter.name] = { results: [], results_num: 0 };
    return acc;
  }, {}),
});

export const getters = {
  activeFilter(state) {
    return filters.find(col => col.name === state.active_filter);
  },
  filterByName(_state) {
    return filterName => filters.find(col => col.name === filterName);
  },
  resultsByName(state) {
    return filterName => state.results[filterName];
  },
  results(state) {
    return state.results[state.active_filter];
  },
  resultsGeneIds(state) {
    return state.results[state.active_filter].results.map(
      gene => gene.ncbiGeneId
    );
  },
};

export const mutations = {
  setTaxon(state, taxon) {
    state.active_taxon = taxon;
  },
  setActiveFilter(state, filter = 'gene') {
    state.active_filter = filter;
  },
  setResults(state, { results = [], results_num = 0 }) {
    state.results = {
      ...state.results,
      [state.active_filter]: { results, results_num },
    };
  },
  setResultsNum(state, results_num) {
    state.results = { ...state.results, results_num };
  },
};
