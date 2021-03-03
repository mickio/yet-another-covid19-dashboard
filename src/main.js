import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ECharts from 'vue-echarts'

import landkreise from '@/charts/landkreise.geo.json'
import country_regions from '@/charts/countries.geo.json'
import {GeoJSONPropertiesLoader, selectRegionFromUrl} from '@/scr/helpers.js'

ECharts.registerMap('landkreise',landkreise)
ECharts.registerMap('worldmap',country_regions)

Vue.config.productionTip = false

console.log(`Root URL sollte sein: ${process.env.VUE_APP_API_ENDPOINT_ROOT}`)

let loaders = []
Vue.prototype.$loader = (url) => {
  if(!loaders.find(el => el.url === url)) {
    loaders.push({
      url: url,
      loader: new GeoJSONPropertiesLoader(url)
    })
  }
  return loaders.find(el => el.url === url).loader
}

let state = selectRegionFromUrl()
store.commit('updateRegion', state)
history.pushState({...state},'Infektionsgeschehen '+state.name,`/${state.type}/${state.name}`)

onpopstate = e => store.commit('updateRegion',e.state)

Vue.prototype.$landkreise = landkreise
Vue.prototype.$worldmap = country_regions

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

