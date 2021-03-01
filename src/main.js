import Vue from 'vue'
import App from './App.vue'
import store from './store'
import ECharts from 'vue-echarts'

import landkreise from '@/charts/landkreise.geo.json'
import country_regions from '@/charts/countries.geo.json'
import {GeoJSONPropertiesLoader} from '@/scr/helpers.js'

ECharts.registerMap('landkreise',landkreise)
ECharts.registerMap('worldmap',country_regions)

Vue.config.productionTip = false

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
Vue.prototype.$landkreise = landkreise
Vue.prototype.$worldmap = country_regions

new Vue({
    store,
    render: h => h(App)
}).$mount('#app')
