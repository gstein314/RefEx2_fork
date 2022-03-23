import filters from '../static/filters.json';
import species from '../static/species.json';

export const state = () => ({
  active_specie: species[0], //default,
  active_filter: 'gene',
  active_project: 'FANTOM5',
  project_filters: {},
  filter_modal: null,
  gene_modal: null,
  results: filters.reduce((acc, filter) => {
    acc[filter.name] = { results: [], results_num: 0 };
    return acc;
  }, {}),
});

export const getters = {
  project_filters(state) {
    return state.project_filters;
  },
  active_filter_modal(state) {
    return state.project_filters[state.filter_modal] || null;
  },
  route_to_project_page: state => ids => {
    if (Array.isArray(ids)) ids = ids.join(',');
    return `${state.active_specie.suggestions_key}/${state.active_filter}?id=${ids}`;
  },
  gene_modal(state) {
    return state.gene_modal;
  },
  active_project(state) {
    return state.active_project;
  },
  active_filter(state) {
    return filters.find(col => col.name === state.active_filter);
  },
  active_specie(state) {
    return state.active_specie;
  },
  filter_by_name: _state => filterName => {
    return filters.find(col => col.name === filterName);
  },
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
  set_filter_modal(state, filterKey = null) {
    state.filter_modal = filterKey;
  },
  set_project_filters(state) {
    const copy = { ...getters.active_filter(state).filters };
    Object.values(copy).forEach(value => {
      value.filterModal = '';
      if (['age', 'median'].includes(value.innerKey))
        value.numberValue = {
          value: [0, 0],
          min: 0,
          max: 0,
          marks: [],
        };
    });

    state.project_filters = copy;
  },
  update_project_filters(
    state,
    { key, filter, filterKey = state.filter_modal }
  ) {
    const copy = { ...state.project_filters };
    copy[filterKey][key] = filter;
    state.project_filters = copy;
  },
  set_gene_modal(state, id = null) {
    state.gene_modal = id;
  },
  set_specie(state, specieId) {
    state.active_specie = species.find(specie => specie.name === specieId);
  },
  set_active_project(state, project) {
    state.active_project = project;
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
