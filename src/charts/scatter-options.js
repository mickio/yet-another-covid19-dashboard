import {Option} from '../scr/helpers.js'

let options = {
    grid: {
        left: 50,
        top: 10,
        bottom: 40,
        right: 20
    },  
    xAxis: {
        name: "7-Tage-Inzidenz",
        nameLocation: "center",
        nameGap: 27,
        nameTextStyle: {
            color: "hsl(242,20%,70%)",
            fontStyle: 'oblique'
        }
    },
    yAxis: {
        axisLabel: {
            formatter: "{value} %"
        },
        name: "                                                Änderung gegenüber Vorwoche",
        nameLocation: "center",
        nameGap: -15,
        nameTextStyle: {
            color: "hsl(242,20%,70%)",
            fontStyle: 'oblique'
        }
    },
    tooltip:{
        formatter ({data}) {
            return `<b>${data[2].Landkreis??data[2].country}</b><br/>
            Inzidenz: ${data[0]}<br/>
            Veränderung: ${data[1]} %<br/>
            ${data[1]<0?'Halbierungszeit':'Verdopplungszeit'}: ${data[2].r?Math.abs(Math.round(1/data[2].rate_d_confirmed)) : Math.abs(Math.round(7/Math.log2(1+data[1]/100)))} Tage<br/>
            R ~ ${data[2].r?Math.round(100*data[2].r)/100 : Math.round(100*2**(4/7*Math.log2(1+data[1]/100)))/100} `
        },
        extraCssText: "text-align:left"
    },
    dataZoom: [
        {
            type: 'inside',
            xAxisIndex: [0],
        },
        {
            type: 'inside',
            yAxisIndex: [0],
        }
    ],
}

let natOptions = new Option(options)
let nationalOptions = natOptions
    .mergeSeriesOption({type: 'scatter', name: 'Dynamik'})
    .setSeriesLabel(200,{color: 'black',formatter: ({data}) => data[2].Landkreis})
    .setSeriesItemStyle([200,100,50], {normal: {shadowBlur: 10,shadowColor: 'rgba(0, 19, 51, 0.5)',shadowOffsetY: 5, color: 'rgb(0, 56, 153)'}})
    .getOptions()

let inatOptions = new Option(options)
let internationalOptions = inatOptions
    .mergeSeriesOption({type: 'scatter', name: 'Dynamik'})
    .setSeriesLabel(200,{color: 'black',formatter: ({data}) => data[2].country})
    .setSeriesItemStyle([200,100,50], {normal: {shadowBlur: 10,shadowColor: 'rgba(0, 19, 51, 0.5)',shadowOffsetY: 5, color: 'rgb(0, 56, 153)'}})
    .getOptions()

export {nationalOptions, internationalOptions}