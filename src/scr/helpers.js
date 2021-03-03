export class GeoJSONPropertiesLoader {
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
        this.isComputed = false
        this.properties = []
        this.computedResult = null
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
                 if(json.features){   // @ToDo: JHU-Daten auch als FeatureCollection zurückgeben
                    json.features.forEach(feature => {
                        this.properties.push(feature.properties);
                })}else{
                    json.forEach(properties => this.properties.push(properties))
                }
                this.isLoading = false
                this.isSet = true
            })
            .catch(e => console.error(`Beim Abruf der Seite ${this.url} ist ein Fehler aufgetreten: ${e}`))
    }
    async get() {
        if(this.isSet) {
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
    async setComputed(fun) {
        await this.get()
        this.computedResult = fun( this.properties )
        this.isComputed = true
    }
    async getComputed(fun) {
        if(this.isComputed) {
            return Promise.resolve(this.computedResult)
        }
        await this.setComputed(fun)
        return new Promise((resolve,reject) => {
            try {
                resolve(this.computedResult)
            }catch{
                reject(error => console.error(error))
            }
        })
    }
}
export class MovingAverage {
    /* 
        Für den laufenden 7-Tage-Mittelwert
    */
    constructor(date, number) {
        this.q = number ? [number] :[]
        this.q2 = number && date ? [[date, number]] : []
        this.movingAverage = number ? number : 0
    }
    next(date,number, len = 7){
        /* 
            Liefert anfangs die erreichbaren Mittelwerte. Gibt
            undefined zurück, wenn die queue mehr als 7
            Werte enthält, was aber nicht passieren kann.
        */
        if (this.q.length < len) {
            this.q.push(number)
            this.q2.push([date,number])
            this.movingAverage += number
            return this.movingAverage/this.q.length
        } else if (this.q.length == len) {
            let first = this.q.shift()
            this.q2.shift()
            this.q.push(number)
            this.q2.push([date,number])
            this.movingAverage += number
            this.movingAverage -= first
            return this.movingAverage/len
        } else {
            return undefined
        }
    }
    getExponentialRegression() {
        let res = this.q2.reduce((t,step) => {
            return{
            date_mean: t.date_mean + step[0],
            date_stderr: t.date_stderr + step[0]**2,
            logY_mean: t.logY_mean + Math.log2(step[1]),
            logY_stderr: t.logY_stderr + Math.log2(step[1])**2,
            date_logY: t.date_logY + step[0]*Math.log2(step[1])
        }},{date_mean:0,date_stderr:0,logY_mean:0,logY_stderr:0, date_logY: 0})
        let rate = (res.date_logY-res.date_mean*res.logY_mean/7)/(res.date_stderr - res.date_mean**2/7)
        let intersection = (res.logY_mean - rate * res.date_mean)/this.q2.length
        return {
            rate: rate * 86400000,
            intersection: intersection,
            q_lin: Math.sqrt(Math.abs(1 - this.q2.reduce((t,s) => t+(intersection + rate * s[0] - Math.log2(s[1]))**2,0)/res.logY_stderr)),
            r: 2**(rate*4*86400000)
        }

    }
}
export async function fetchRKITimeSeries(features) {
    /* 
        Lädt je Tag und neu - nichtneu -akkumulierte Meldungen (AnzahlFall, AnzahlTodesfall, AnzahlGenesen).
        Weil die Zählung bei der Akkumulierung gemäß der Qualifikatoren NeuerFall, NeuerTodesfall usw. läuft,
        und diese im Fall des Wertes -9 den Eintrag -1 bei den zugehörigen Fallzahlen haben, kann man nich alle
        Fallkategorien in einem Ritt akkumuliert abfragen.

        Die jeweils geladene Reihe muss die properties Meldedatum, GesamtFaelleTag, und die Qualifikatoren enthalten
    */
    let timeSeries = [[], []]
    let cumulativeValue = 0
    let cumulativeSeries = []
    let movingAverageSeries = []
    let expRegressionSeries = []
    let currentMeldedatum = null
    let movingAverage = new MovingAverage()
    let smoothMovingAverage = new MovingAverage()
    let increment = 0
    let av
    features.forEach( properties => {
        if(properties.NeuerFall==0 || properties.NeuerTodesfall == 0 || properties.neuGenesen == 0) {
            timeSeries[0].push([properties.Meldedatum,properties.GesamtFaelleTag])
            if (currentMeldedatum === properties.Meldedatum) {
                increment += properties.GesamtFaelleTag
            }else{
                if(currentMeldedatum){
                    cumulativeSeries.push([currentMeldedatum,cumulativeValue])
                    av = movingAverage.next(currentMeldedatum,increment)
                    smoothMovingAverage.next(currentMeldedatum,av)
                    movingAverageSeries.push([currentMeldedatum,av])
                    expRegressionSeries.push([currentMeldedatum,smoothMovingAverage.getExponentialRegression().r])
                }else{
                    currentMeldedatum = properties.Meldedatum
                }
                cumulativeValue += properties.GesamtFaelleTag
                increment = properties.GesamtFaelleTag
                currentMeldedatum = properties.Meldedatum
            }
        } else {
            timeSeries[1].push([properties.Meldedatum,properties.GesamtFaelleTag])
            if (currentMeldedatum === properties.Meldedatum) {
                increment += properties.GesamtFaelleTag
            }else{
                cumulativeSeries.push([currentMeldedatum,cumulativeValue])
                av = movingAverage.next(currentMeldedatum,increment)
                smoothMovingAverage.next(currentMeldedatum,av)
                movingAverageSeries.push([currentMeldedatum,av])
                expRegressionSeries.push([currentMeldedatum,smoothMovingAverage.getExponentialRegression().r])
                cumulativeValue += properties.GesamtFaelleTag
                increment = properties.GesamtFaelleTag
                currentMeldedatum = properties.Meldedatum
            }
        }
    })
    cumulativeSeries.push([currentMeldedatum,cumulativeValue])
    av = movingAverage.next(currentMeldedatum,increment)
    smoothMovingAverage.next(currentMeldedatum,av)
    movingAverageSeries.push([currentMeldedatum,av])
    expRegressionSeries.push([currentMeldedatum,smoothMovingAverage.getExponentialRegression().r])
    return {
      timeSeries: timeSeries,
      cumulativeSeries: cumulativeSeries,
      movingAverageSeries: movingAverageSeries,
      expRegressionSeries: expRegressionSeries
    }
}
export async function fetchJHUTimeSeries(features) {
    let data = {
        timeSeriesConfirmed: [],
        timeSeriesDeaths: [],
        timeSeriesConfirmedCumulative: [],
        timeSeriesDeathsCumulative: [],
        timeSeriesActiveCumulative: [],
        timeSeriesR: [],
        timeSeriesConfirmedMovingAverage: []
    }
    features.forEach( properties => {
        data.timeSeriesConfirmed.push([properties.date,properties.d_confirmed])
        data.timeSeriesDeaths.push([properties.date,properties.d_deaths])
        data.timeSeriesActiveCumulative.push([properties.date,properties.active])
        data.timeSeriesConfirmedCumulative.push([properties.date,properties.confirmed])
        data.timeSeriesDeathsCumulative.push([properties.date,properties.deaths])
        data.timeSeriesR.push([properties.date,properties.r])
        data.timeSeriesConfirmedMovingAverage.push([properties.date,properties.d_confirmed_7/7])
    })
    return data
}
export async function mapToJHUFormat(features) {
    return features.map(properties => { return {
        confirmed: properties.cases,
        deaths: properties.deaths,
        incidence: properties.cases_per_100k,
        cfr: properties.death_rate,
        d_confirmed_7: properties.cases7_lk,
        d_confirmed_7_per_100k: properties.cases7_per_100k,
        d_deaths_7: properties.death7_lk,
        county: properties.GEN,
        Combined_Key: properties.county
    }})
}
export class Option {
    constructor(options) {
        this.seriesTemplate = {
             itemStyle: {
                emphasis: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(120, 36, 50, 0.5)',
                    shadowOffsetY: 5,
                    color: '#32fb08'
                }
            },  
            data: []
        }

        this.options = {
            series: this.seriesTemplate,
            ...options
        }
    }
    appendSeries(options){
        let series = {
            ...this.seriesTemplate,
            ...options
        }
        if (!Array.isArray(this.options.series)){
            this.options.series = [this.options.series]
        }
        this.options.series.push(series)
        return this
    }
    setSeriesLabel(hue,options,seriesIndex){
        let emphasis = {
            show:true,
            backgroundColor: `hsl(${hue},100%,90%,0.5)`,
            padding: [4,2,2,2],
            borderColor: `hsl(${hue},100%,10%,0.5)`,
            borderWidth: 1,
            ...options
        }
        if(seriesIndex===undefined){
            this.options.series.label = {emphasis}
        }else{
            this.options.series[seriesIndex].label = {emphasis}
        }
        return this
    }
    setSeriesItemStyle(hsl,options,seriesIndex){
        let emphasis = {
            shadowBlur: 20,
            shadowColor: `hsl(${hsl[0]},20%,10%,0.5)`,
            shadowOffsetY: 5,
            color: `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%,0.5)`
        }
        let itemStyle = {emphasis,...options}
        if(seriesIndex===undefined){
            this.options.series.itemStyle = itemStyle
        }else{
            this.options.series[seriesIndex].itemStyle = itemStyle
        }
        return this
    }
    mergeOption(option, options) {
        this.options[option] = {...this.options[option], ...options}
        return this
    }
    setOption(option, value) {
        this.options[option] = value
        return this
    }
    setSeriesOption(option, value, seriesIndex) {
        this.options.series[seriesIndex ?? 0][option] = value
        return this
    }
    mergeSeriesOption(options, seriesIndex) {
        if(seriesIndex===undefined) {
            this.options.series = {...this.options.series, ...options}
        } else {
            this.options.series[seriesIndex] = {...this.options.series[seriesIndex], ...options}
        }
        return this
    }
    getOptions(){
        return this.options
    }
}
export function selectRegionFromUrl() {
    let pathname = decodeURI( location.pathname )
    let eligiblePath = pathname.match(/\/(county|country)\/((\w|[äÄüÜß ,.])*)\/?$/)
    if (!eligiblePath) {
        return {type: 'county',name: 'Bundesgebiet'}
    }
    return {type: eligiblePath[1], name: eligiblePath[2]}
  }
  