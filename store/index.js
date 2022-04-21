import datasets from '../refex-sample/datasets.json';
import filters from '../static/filters.json';
import species from '../static/species.json';

const maxInTenth = x => {
  return Math.ceil(x / 10) * 10;
};

const numberFilterObj = ([min, max], value) => {
  [min, max] = [maxInTenth(min), maxInTenth(max)];
  const isInTenths = max > 20;
  return {
    ...value,
    filterModal: [0, max],
    numberValue: {
      min: 0,
      max,
      marks: Array(isInTenths ? max / 10 : max)
        .fill(null)
        .map((_, i) => (isInTenths ? i * 10 : i)),
    },
  };
};

export const state = () => ({
  active_specie: species[0], //default,
  active_filter: 'gene',
  active_dataset: datasets[0].dataset,
  project_filters: {},
  filter_modal: null,
  gene_modal: null,
  alert_modal: { isOn: false, msg: '' },
  compare_modal: false,
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
  compare_modal(state) {
    return state.compare_modal;
  },
  route_to_project_page: state => ids => {
    if (Array.isArray(ids)) ids = ids.join(',');
    return `${state.active_specie.suggestions_key}/${state.active_filter}?id=${ids}`;
  },
  gene_modal(state) {
    return state.gene_modal;
  },
  active_dataset(state) {
    return datasets.find(dataset => dataset.dataset === state.active_dataset);
  },
  active_filter(state) {
    return filters.find(filter => state.active_filter === filter.name);
  },
  alert_modal(state) {
    return state.alert_modal;
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
};

export const mutations = {
  set_filter_modal(state, filterKey = null) {
    state.filter_modal = filterKey;
  },
  set_compare_modal(state) {
    state.compare_modal = !state.compare_modal;
  },
  set_project_filters(state, { ageRange, medianRange }) {
    const copy = { ...getters.active_filter(state).filters };
    Object.entries(copy).forEach(([key, value]) => {
      if (['Age', 'log2_Median'].includes(key)) {
        copy[key] = numberFilterObj(
          key === 'Age' ? ageRange : medianRange,
          value
        );
      } else value.filterModal = '';
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
  set_alert_modal(state, { msg = '' }) {
    (state.alert_modal.isOn = !state.alert_modal.isOn),
      (state.alert_modal.msg = msg);
  },
  set_specie(state, specieId) {
    state.active_specie = species.find(specie => specie.name === specieId);
  },
  set_active_dataset(state, project) {
    state.active_dataset = project;
  },
  set_active_filter(state, filter = 'gene') {
    state.active_filter = filter;
  },
  set_results(
    state,
    { results = [], results_num = 0, filterType = state.active_filter }
  ) {
    state.results = {
      ...state.results,
      [filterType]: { results, results_num },
    };
  },
};
