import specieSets from '../refex-sample/datasets.json';
import filters from '../static/filters.json';

const numberFilterObj = ([min, max]) => {
  const isInTenths = max > 20;
  return {
    filterModal: [0, max],
    numberValue: {
      min,
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
  project_filters: [],
  project_filter_ranges: {
    LogMedian: [0, 18],
  },
  filter_modal: null,
  gene_modal: null,
  alert_modal: { isOn: false, msg: '' },
  compare_modal: false,
  project_results: {
    arr: [],
    limit: 10,
    offset: 0,
  },
  project_results_all: {},
  index_pagination: {
    limit: 10,
    offset: 0,
  },
  checked_results: {
    gene: [],
    sample: [],
  },
  results: filters.reduce((acc, filter) => {
    acc[filter.name] = { results: [], results_num: 0 };
    return acc;
  }, {}),
  page_type: '',
  filter_search_value: '',
  index_gene_pages_number: 0,
  index_sample_pages_number: 0,
  project_pages_number: 0,
  project_items: {},
  search_conditions: {
    gene: {
      text: '',
      summary: '',
      chr: '',
      tog: '',
      go: '',
      tpm: '',
      roku: '',
      tau: '',
    },
    sample: {
      text: '',
      SampleTypeCategory: '',
      ExperimentCategory: '',
      UberonLabel: '',
      ClLabel: '',
      NcitLabel: '',
      DevelopmentalStage: '',
      Sex: '',
    },
  },
});

export const getters = {
  project_filters(state) {
    return state.project_filters;
  },
  get_project_results(state) {
    return state.project_results.arr || [];
  },
  get_project_results_all(state) {
    return state.project_results_all;
  },
  get_project_items(state) {
    return state.project_items;
  },
  get_project_pagination(state) {
    const { limit, offset } = state.project_results;
    return { limit, offset };
  },
  get_checked_results(state) {
    return state.checked_results[state.active_filter];
  },
  index_pagination(state) {
    return state.index_pagination;
  },
  active_filter_modal(state) {
    return (
      state.project_filters.find(x => x.column === state.filter_modal) || null
    );
  },
  compare_modal(state) {
    return state.compare_modal;
  },
  route_to_project_page: state => ids => {
    if (Array.isArray(ids)) ids = ids.join(',');
    return `${state.active_specie.species}/${state.active_dataset.dataset}?type=${state.active_filter}&id=${ids}`;
  },
  route_to_other_project_page: state => ids => {
    if (Array.isArray(ids)) ids = ids.join(',');
    if (location.search.match(/=(.*)&/)[1] === 'gene')
      return `/${state.active_specie.species}/${state.active_dataset.dataset}?type=sample&id=${ids}`;
    else
      return `/${state.active_specie.species}/${state.active_dataset.dataset}?type=gene&id=${ids}`;
  },
  gene_modal(state) {
    return state.gene_modal;
  },
  dataset_by_name: state => name => {
    return state.active_specie.datasets.find(x => x.dataset === name);
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
  gene_summary_source: state => resultItem => {
    const datasetName = state.active_dataset.dataset;
    return `https://refex2-api.dbcls.jp/static/${datasetName}/${datasetName}_${resultItem}.png`;
  },
  get_page_type(state) {
    return state.page_type;
  },
  get_filter_search_value(state) {
    return state.filter_search_value;
  },
  get_index_gene_pages_number(state) {
    return state.index_gene_pages_number;
  },
  get_index_sample_pages_number(state) {
    return state.index_sample_pages_number;
  },
  get_project_pages_number(state) {
    return state.project_pages_number;
  },
  get_search_conditions(state) {
    return state.search_conditions;
  },
};

export const mutations = {
  set_project_results(state, newResults) {
    state.project_results = { ...state.project_results, arr: newResults };
  },
  set_project_results_all(state, newResults) {
    state.project_results_all = newResults;
  },
  set_project_items(state, newItems) {
    state.project_items = newItems;
  },
  // type: 'index' or 'project'
  set_pagination(state, { limit, offset, type = 'project' }) {
    if (type === 'index')
      state.index_pagination = {
        limit: limit ?? state.index_pagination.limit,
        offset,
      };
    else state.project_results = { ...state.project_results, limit, offset };
  },
  set_filter_modal(state, filterKey = null) {
    state.filter_modal = filterKey;
  },
  set_compare_modal(state) {
    state.compare_modal = !state.compare_modal;
  },
  set_project_filters(state, filters) {
    const copy = [...filters];
    copy.forEach((entry, index) => {
      let paramsToBeMerged = {};
      const column = entry.column;
      if (Object.keys(state.project_filter_ranges).includes(column)) {
        paramsToBeMerged = numberFilterObj(state.project_filter_ranges[column]);
      } else if (entry.options) {
        const options = [...entry.options.sort((a, b) => a - b)];
        paramsToBeMerged = { filterModal: options, options };
      } else paramsToBeMerged = { filterModal: entry.options ? [] : '' };
      copy[index] = { ...entry, ...paramsToBeMerged };
    });
    state.project_filters = copy;
  },
  update_project_filters(
    state,
    { key = 'filterModal', filter, filterKey = state.filter_modal }
  ) {
    const copy = [...state.project_filters];
    const targetObjIndex = copy.findIndex(entry => entry.column === filterKey);
    if (copy[targetObjIndex][key] !== filter) {
      copy[targetObjIndex][key] = filter;
      state.project_filters = copy;
    }
  },
  set_gene_modal(state, id = null) {
    state.gene_modal = id;
  },
  set_alert_modal(state, { msg = '', bool = true }) {
    state.alert_modal.msg = msg;
    state.alert_modal.isOn = bool;
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
        results: results ?? [],
        results_num,
      },
    };
  },
  set_page_type(state, type) {
    state.page_type = type;
  },
  set_filter_search_value(state, value) {
    state.filter_search_value = value;
  },
  set_checked_results(state, checked_results) {
    state.checked_results[state.active_filter] = checked_results;
  },
  set_index_gene_pages_number(state, index_gene_pages_number) {
    state.index_gene_pages_number = index_gene_pages_number;
  },
  set_index_sample_pages_number(state, index_sample_pages_number) {
    state.index_sample_pages_number = index_sample_pages_number;
  },
  set_project_pages_number(state, project_pages_number) {
    state.project_pages_number = project_pages_number;
  },
  set_search_conditions(state, items) {
    state.search_conditions[items.type][items.item] = items.value;
  },
};
