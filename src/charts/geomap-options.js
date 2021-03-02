import {Option} from '../scr/helpers.js'

let options = {
  title: {
    text: "7-Tage-Inzidenz",
    show: true,
    left: 'left',
    textStyle: {
      color: "black",
      fontSize: 12
    }
  },
  tooltip: {
    formatter (val) {
      return `<b>${val.data.values.GEN??val.data.name}</b><br/>
      Inzidenz/Woche: ${Math.round(val.data.value)}<br/>`
    },
    extraCssText: "text-align:left",
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2,
  },
  visualMap: {
      left: 'left',
      type: 'piecewise',
      pieces: [
        {min: 500,label: '> 500', color: 'hsl(370, 100%, 10%)'},
        {min: 400,max: 500,color: 'hsl(370, 100%, 20%)'},
        {min: 300,max: 400,color: 'hsl(370, 100%, 30%)'},
        {min: 200,max: 300,color: 'hsl(370, 100%, 40%)'},
        {min: 100,max: 200,color: 'hsl(370, 100%, 50%)'},
        {min: 50,max: 100, color: 'hsl(370, 100%, 60%)'},
        {min: 30,max: 50, color: 'orange', label: '30-50'},
        {max: 30, color: 'green', label: '< 30'},
      ],
      calculable: true
  },
}

let natOptions = new Option(options)
let nationalOptions = natOptions
  .mergeOption('title', {subtext: 'Quelle: RKI Feature Service',sublink: 'https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0/geoservice'})
  .mergeSeriesOption({
    type: 'map',
    roam: true,
    center: [],
    zoom: 1,
    data: [],
    map:'landkreise',
    nameProperty:'RS'
  })
  .setSeriesLabel(200,{formatter: (param) => param.data?param.data.values.GEN:''})
  .getOptions()

let inatOptions = new Option(options)
let internationalOptions = inatOptions
  .setSeriesLabel(200,{formatter: (param) => param.data?param.data.values.GEN:''})
  .mergeOption('title', {subtext: 'Quelle: COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University',sublink: 'https://github.com/CSSEGISandData/COVID-19'})
  .mergeSeriesOption({
    type: 'map',
    roam: true,
    center: [],
    zoom: 1,
    data: [],
    map:'worldmap',
    nameProperty:'name'
  })
  .getOptions()

export {nationalOptions, internationalOptions}