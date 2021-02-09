import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    type: 'county',
    name: 'Bundesgebiet',
  },
  mutations: {
    updateRegion (state, obj) {
      state.type = obj.type
      state.name = obj.name
      state.dataIndex = obj.dataIndex??null
    }
  },
  actions: {
  },
  modules: {
  }
})
