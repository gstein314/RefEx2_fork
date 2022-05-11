import specieSets from '../refex-sample/datasets.json';
import filters from '../static/filters.json';

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
  active_specie: specieSets[0],
  active_filter: 'gene',
  active_dataset: specieSets[0].datasets[0],
  project_filters: {},
  filter_modal: null,
  gene_modal: null,
  alert_modal: { isOn: false, msg: '' },
  compare_modal: false,
  project_results: {
    arr: [],
    limit: 10,
    offset: 0,
  },
  results: filters.reduce((acc, filter) => {
    acc[filter.name] = { results: [], results_num: 0 };
    return acc;
  }, {}),
});

export const getters = {
  project_filters(state) {
    return state.project_filters;
  },
  get_project_results(state) {
    return state.project_results.arr || [];
  },
  get_project_pagination(state) {
    const { limit, offset } = state.project_results;
    return { limit, offset };
  },
  active_filter_modal(state) {
    return state.project_filters[state.filter_modal] || null;
  },
  compare_modal(state) {
    return state.compare_modal;
  },
  route_to_project_page: state => ids => {
    if (Array.isArray(ids)) ids = ids.join(',');
    return `${state.active_specie.species}/${state.active_filter}?id=${ids}`;
  },
  gene_modal(state) {
    return state.gene_modal;
  },
  active_dataset(state) {
    return state.active_dataset;
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
  search_condition_by_specie: state => {
    return state.active_specie.search_conditions;
  },
  filter_by_name: _state => filterName => {
    return filters.find(col => col.name === filterName);
  },
  results_by_name(state) {
    return filterName => state.results[filterName];
  },
};

export const mutations = {
  set_project_results(state, newResults) {
    state.project_results = { ...state.project_results, arr: newResults };
  },
  set_project_pagination(state, { limit, offset }) {
    state.project_results = { ...state.project_results, limit, offset };
  },
  set_filter_modal(state, filterKey = null) {
    state.filter_modal = filterKey;
  },
  set_compare_modal(state) {
    state.compare_modal = !state.compare_modal;
  },
  set_project_filters(state, { ageRange, medianRange, filters }) {
    const copy = {
      ...filters,
    };
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
    state.active_specie = specieSets.find(
      specie => specie.species === specieId
    );
  },
  set_active_dataset(state, project) {
    state.active_dataset = project;
  },
  set_active_filter(state, filter = 'gene') {
    state.active_filter = filter;
  },
  set_results(
    state,
    { results, results_num = 0, filterType = state.active_filter }
  ) {
    state.results = {
      ...state.results,
      [filterType]: {
        results: results ?? state.results[filterType].results,
        results_num,
      },
    };
  },
};
