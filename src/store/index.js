import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    type: 'county',
    name: 'Bundesgebiet',
  },
  mutations: {
    updateRegion (state, type, name) {
      state.type = type
      state.name = name
    }
  },
  actions: {
  },
  modules: {
  }
})
