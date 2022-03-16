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
  gene_modal(state) {
    return state.gene_modal;
  },
  active_organization: state => state.active_organization,
  active_filter(state) {
    return filters.find(col => col.name === state.active_filter);
  },
  active_taxon: state => state.active_taxon,
  filter_by_name: _state => filterName =>
    filters.find(col => col.name === filterName),
  results_by_name(state) {
    return filterName => state.results[filterName];
  },
  results_unique_keys(state, getters) {
    return state.results[state.active_filter].results.map(
      item => item[getters.active_filter.uniqueKey]
    );
  },
};

export const mutations = {
  set_gene_modal(state, { isShowing = false, geneId = '' }) {
    state.gene_modal = { isShowing, geneId };
  },
  set_taxon(state, taxonId) {
    state.active_taxon = taxons.find(taxon => taxon.name === taxonId);
  },
  set_active_organization(state, organization) {
    return (state.active_organization = organization);
  },
  set_active_filter(state, filter = 'gene') {
    state.active_filter = filter;
  },
  set_results(
    state,
    { results = [], results_num = 0, filterType = state.activeFilter }
  ) {
    state.results = {
      ...state.results,
      [filterType]: { results, results_num },
    };
  },
};
