export const state = () => ({
  active_taxon: 'homo_sapiens', //default,
})

export const mutations = {
  setTaxon(state, taxon) {
    state.active_taxon = taxon
  }
}
