import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    setting: {type: 'county',name: 'Bundesgebiet',dataType: 'daily-values'},
    resize: false
  },
  mutations: {
    updateRegion (state, obj) {
      state.setting = {type: obj.type,name: obj.name}
    },
  },
  actions: {
  },
  modules: {
  }
})
