import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    setting: {type: 'county',name: 'Bundesgebiet'},
    deviceClass: 'screen',
    resize: false
  },
  mutations: {
    updateRegion (state, obj) {
      state.setting = {...state.setting, ...obj}
    },
    updateDeviceClass (state, deviceClass) {
      state.deviceClass = deviceClass
      console.log(`Changed class to ${state.deviceClass} `)
    }
  },
  actions: {
  },
  modules: {
  }
})
