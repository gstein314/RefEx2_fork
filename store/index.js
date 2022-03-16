import filters from '../static/filters.json';
import taxons from '../static/species.json';

export const state = () => ({
  active_taxon: taxons[0], //default,
  active_filter: 'gene',
  active_organization: 'FANTOM5',
  gene_modal: {
    isShowing: false,
    geneId: '',
  },
  results: filters.reduce((acc, filter) => {
    acc[filter.name] = { results: [], results_num: 0 };
    return acc;
  }, {}),
});

export const getters = {
  geneModal(state) {
    return state.gene_modal;
  },
  active_organization: state => state.active_organization,
  activeFilter(state) {
    return filters.find(col => col.name === state.active_filter);
  },
  activeTaxon: state => state.active_taxon,
  filterByName: _state => filterName =>
    filters.find(col => col.name === filterName),
  resultsByName(state) {
    return filterName => state.results[filterName];
  },
  resultsUniqueKeys(state, getters) {
    return state.results[state.active_filter].results.map(
      item => item[getters.activeFilter.uniqueKey]
    );
  },
};

export const mutations = {
  setGeneModal(state, { isShowing = false, geneId = '' }) {
    state.gene_modal = { isShowing, geneId };
  },
  setTaxon(state, taxonId) {
    state.active_taxon = taxons.find(taxon => taxon.name === taxonId);
  },
  setActiveOrganization(state, organization) {
    return (state.active_organization = organization);
  },
  setActiveFilter(state, filter = 'gene') {
    state.active_filter = filter;
  },
  setResults(
    state,
    { results = [], results_num = 0, filterType = state.activeFilter }
  ) {
    state.results = {
      ...state.results,
      [filterType]: { results, results_num },
    };
  },
};
