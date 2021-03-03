import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    setting: {type: 'county',name: 'Bundesgebiet'},
    resize: false
  },
  mutations: {
    updateRegion (state, obj) {
      state.setting = {...state.setting, ...obj}
    },
  },
  actions: {
  },
  modules: {
  }
})
