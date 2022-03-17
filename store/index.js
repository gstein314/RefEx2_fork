import filters from '../static/filters.json';
import species from '../static/species.json';

export const state = () => ({
  active_specie: species[0], //default,
  active_filter: 'gene',
  active_project: 'FANTOM5',
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
  route_to_project_page: state => ids => {
    if (Array.isArray(ids)) ids = ids.join(',');
    return `${state.active_specie.suggestions_key}/${state.active_filter}?id=${ids}`;
  },
  gene_modal(state) {
    return state.gene_modal;
  },
  active_project: state => state.active_project,
  active_filter(state) {
    return filters.find(col => col.name === state.active_filter);
  },
  active_specie: state => state.active_specie,
  filter_by_name: _state => filterName =>
    filters.find(col => col.name === filterName),
  results_by_name(state) {
    return filterName => state.results[filterName];
  },
  results_unique_keys(state, getters) {
    return state.results[state.active_filter].results.map(
      item => item[getters.active_filter.unique_key]
    );
  },
};

export const mutations = {
  set_gene_modal(state, { isShowing = false, geneId = '' }) {
    state.gene_modal = { isShowing, geneId };
  },
  set_specie(state, specieId) {
    state.active_specie = species.find(specie => specie.name === specieId);
  },
  set_active_project(state, project) {
    return (state.active_project = project);
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
