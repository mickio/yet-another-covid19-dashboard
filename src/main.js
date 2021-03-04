import Vue from 'vue'
import App from './App.vue'
import store from './store'

/* 
  Die Karten für die Map-component werden hier geladen und verfügbar gemacht
 */
import ECharts from 'vue-echarts'
import landkreise from '@/charts/landkreise.geo.json'
import country_regions from '@/charts/countries.geo.json'

ECharts.registerMap('landkreise',landkreise)
ECharts.registerMap('worldmap',country_regions)

Vue.prototype.$landkreise = landkreise
Vue.prototype.$worldmap = country_regions

import {GeoJSONPropertiesLoader, selectRegionFromUrl} from '@/scr/helpers.js'
/* 
loaders enthält für jede angefragte URL einen thread-sicheren GeoJSONPropertiesLoader
der wiederum einmal per fetch geladene Daten zwischenspeichert  
*/  
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
  
/* 
  Die einzelnen Ansichten sollen bookmarkable sein, d.h. die history-API wird
  bemüht
 */  
let state = selectRegionFromUrl()
store.commit('updateRegion', state)
history.pushState({...state},'Infektionsgeschehen '+state.name,`/${state.type}/${state.name}`)
 
onpopstate = e => store.commit('updateRegion',e.state)

/* 
  Für die echarts benötigen wir an das device angepasste options, weil mouse events nicht äquivalent
  zu touch events sind
 */ 
function setDeviceClass (mQL) {
  store.commit('updateDeviceClass', mQL.matches ?  'touch' : 'screen' ) 
}
let mediaQueryList = matchMedia('(max-width: 700px)')
mediaQueryList.addEventListener( 'change',setDeviceClass ) 
setDeviceClass(mediaQueryList)

/* 
  Und schließlich die Vue-Instanz
 */
Vue.config.productionTip = false
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

