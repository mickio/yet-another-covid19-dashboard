import {Option} from '../scr/helpers.js'


function formatParams(str, param) {
  let marker = `<span style="color:${param.color}">■</span>`
  if (param.seriesName == "Meldungen (Wochenmittel)") {
    return str+`<br>${marker} ${param.seriesName}: ${Math.round(param.data[1])}`
  } else if (param.seriesName == "Reproduktionszahl R") {
    return str+`<br>${marker}${param.seriesName}: ${Math.round(100*param.data[1])/100}`
  } else {
    return str+`<br>${marker} ${param.seriesName}: ${param.data[1]}`
  }

}

function tooltipContent(params) {
  return params.reduce(formatParams,new Date(params[0].data[0]).toLocaleDateString())
}

let visualMap = {
  show: false,
  type: 'continuous',
  inRange: {
    color: ['hsl(120, 100% , 50%)','hsl(60, 100% , 50%)','hsl(0, 100% , 50%)','hsl(0, 100% , 0%)']
  },
  min: 0.7,
  max: 2
}

let options = {
  xAxis: {
    type: "time",
    axisLabel: {
        formatter: (value) => new Date(value).toLocaleDateString()
    }
  },
  yAxis: [{type: 'value'},{}],
  grid: {
    top: 10,
    right:30,
    left:60,
    bottom: 30
  },
  tooltip: {
    trigger: 'axis',
    extraCssText: "text-align:left",
    formatter: tooltipContent
  },
  dataZoom: [
    {
      type: 'inside',
      realtime: true
    },
    {
      show: false,
      realtime: true
    },
  ],
  // legend: {
  //   orient: 'vertical',
  //   left: 50,
  //   backgroundColor: "hsl(242,10%,90%,0.8)"
  // }
}

let dVOptionsCounty = new Option(options)
let dailyValuesOptionsCounty = dVOptionsCounty
  .mergeSeriesOption({name: "Meldungen",type: "bar",stack: "this"})
  .setSeriesItemStyle([218,100,80], {normal: {color: 'hsl(218,100%,30%)'}})
  .appendSeries({name: "Nachmeldungen",type: "bar",stack: "this"})
  .setSeriesItemStyle([188,100,80], {normal: {color: 'hsl(188,100%,30%)'}},1)
  .appendSeries({name: "Meldungen (Wochenmittel)",type: "line",symbol: "none"})
  .setSeriesItemStyle([218,100,90], {normal: {color: 'hsl(218,100%,70%)'}},2)
  .appendSeries({name: "Todesfälle",type: "bar",stack: "this2"})
  .setSeriesItemStyle([0,100,80], {normal: {color: 'hsl(0,100%,30%)'}},3)
  .appendSeries({name: "Nachmeldungen Todesfälle",type: "bar",stack: "this2"})
  .setSeriesItemStyle([45,100,80], {normal: {color: 'hsl(45,100%,30%)'}},4)
  .appendSeries({name: "Reproduktionszahl R",type: "line",symbol: "none",yAxisIndex: 1})
  .setSeriesItemStyle([218,100,90], {normal: {color: 'hsl(218,100%,70%)'}},5)
  .setOption('visualMap',{seriesIndex:5,...visualMap})
  .getOptions()

let dVOptionsCountry = new Option(options)
let dailyValuesOptionsCountry = dVOptionsCountry
  .mergeSeriesOption({name: "Meldungen",type: "bar",stack: "this"})
  .setSeriesItemStyle([218,100,80], {normal: {color: 'hsl(218,100%,30%)'}})
  .appendSeries({name: "Meldungen (Wochenmittel)",type: "line",symbol: "none"})
  .setSeriesItemStyle([218,100,90], {normal: {color: 'hsl(218,100%,70%)'}},1)
  .appendSeries({name: "Todesfälle",type: "bar",stack: "this2"})
  .setSeriesItemStyle([0,100,80], {normal: {color: 'hsl(0,100%,30%)'}},2)
  .appendSeries({name: "Reproduktionszahl R",type: "line",symbol: "none",yAxisIndex: 1})
  .setSeriesItemStyle([218,100,90], {normal: {color: 'hsl(218,100%,70%)'}},3)
  .setOption('visualMap',{seriesIndex:3,...visualMap})
  .getOptions()

let cVOptionsCounty = new Option(options)
let cumulativeValuesOptionsCounty = cVOptionsCounty
  .mergeOption('grid',{left: 70})
  .mergeSeriesOption({name: "Meldungen",type: "line",symbol: "none"})
  .setSeriesItemStyle([218,100,80], {normal: {color: 'hsl(218,100%,30%)'}})
  .appendSeries({name: "Todesfälle",type: "line",symbol: "none"})
  .setSeriesItemStyle([0,100,80], {normal: {color: 'hsl(0,100%,30%)'}},1)
  .getOptions()
  
let cVOptionsCountry = new Option(options)
let cumulativeValuesOptionsCountry = cVOptionsCountry
  .mergeOption('grid',{left: 70})
  .mergeSeriesOption({name: "Meldungen",type: "line",symbol: "none"})
  .setSeriesItemStyle([218,100,80], {normal: {color: 'hsl(218,100%,30%)'}})
  .appendSeries({name: "Todesfälle",type: "line",symbol: "none"})
  .setSeriesItemStyle([0,100,80], {normal: {color: 'hsl(0,100%,30%)'}},1)
  .appendSeries({name: "Aktive Fälle",type: "line",symbol: "none"})
  .setSeriesItemStyle([120,100,80], {normal: {color: 'hsl(120,100%,30%)'}},2)
  .getOptions()
  
export {dailyValuesOptionsCounty, dailyValuesOptionsCountry, cumulativeValuesOptionsCounty, cumulativeValuesOptionsCountry}