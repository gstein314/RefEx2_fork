export const state = () => ({
  active_taxon: 'homo_sapiens', //default,
  active_filter: 'gene',
});

export const getters = {
  activeFilter(state) {
    return state.active_filter;
  },
};

export const mutations = {
  setTaxon(state, taxon) {
    state.active_taxon = taxon;
  },
  setActiveFilter(state, filter = 'gene') {
    state.active_filter = filter;
  },
};
