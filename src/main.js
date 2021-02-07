import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

class GeoJSONPropertiesLoader {
    /*  
        Lädt Daten von geojson-APIs, d.h. die json-Dateien müssen ein element features
        mit einer Liste von Objekten enthalten, die wiederum ein Element properties
        aufweisen. Eine Instanz dieser Klasse lädt die Daten nur einmal von der API
        und ist "threadsafe" in dem Sinn, dass auch zeitgleiche Aufrufe von get() zu 
        nur einem Ladevorgang führen.
    */
    constructor(url,headers=false) {
        this.promise = null
        this.url = url
        this.get = this.get.bind(this)
        this.isSet = false
        this.isLoading = false
        this.properties = []
        if (headers) {
            this.headers = headers 
        }else{
            this.headers = new Headers()
        }
    }
    async set() {
        if(this.isLoading) {
            return
        }
        this.isLoading = true
        this.promise = 
            fetch(this.url,this.headers)
            .then(resp => resp.json())
            .then((json) => {
                json.features.forEach(feature => {
                    this.properties.push(feature.properties);
                })
                this.isLoading = false
                this.isSet = true
            })
            .catch(e => console.error(`Es ist ein Fehler aufgetreten: ${e}`))
    }
    async get() {
        if(this.isSet) {
            console.log('Daten bereits vorhanden')
            return Promise.resolve(this.properties)
        }
        this.set()
        await this.promise
        return new Promise((resolve,reject) => {
            try {
                resolve(this.properties)
            }catch{
                reject(error => console.error(error))
            }
        })
    }
}
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

new Vue({
    store,
    render: h => h(App)
}).$mount('#app')
