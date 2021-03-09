import {Option} from '../scr/helpers.js'

let optionsTemplate = {
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
            R ~ ${data[2].r?Math.round(100*data[2].r)/100 : Math.round(100*2**(4/7*Math.log2(1+data[1]/100)))/100} <br/>
            Todesfälle pro 1000 Infizierte: ${data[2].cfr ? Math.round(1000*data[2].cfr): Math.round(1000*data[3].deaths/data[3].cases)}<br>
            Todesfälle pro 100.000 Einwohner: ${data[2].cfr ? Math.round(data[2].cfr*data[2].incidence) : Math.round(data[3].deaths/data[3].EWZ*100000)} `
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

let optionObjects = {}

export function getOptions (regionType, deviceClass) {
    if (!optionObjects[regionType]) {
        optionObjects[regionType] = new Option(optionsTemplate)
        .mergeSeriesOption({type: 'scatter', name: 'Dynamik', symbolSize: deviceClass == 'touch' ? 25 : function(v,val) {return Math.round(val.data[4].scale)} })
        .setSeriesLabel(200,{color: 'black',formatter: ({data}) => regionType == 'county' ? data[2].Landkreis : data[2].country })
        .setSeriesItemStyle([200,100,50], {normal: {shadowBlur: 10,shadowColor: 'rgba(0, 19, 51, 0.5)',shadowOffsetY: 5, color: function(val) {return `hsl(242,100%,${val.data[4].lightness}%)`}}})
    }
    optionObjects[regionType].mergeSeriesOption({symbolSize: deviceClass == 'touch' ? 25 : function(v,val) {return Math.round(val.data[4].scale)} })
    optionsTemplate.dataZoom[0].type = deviceClass == 'touch' ? 'slider' : 'inside' 
    optionsTemplate.dataZoom[1].type = deviceClass == 'touch' ? 'slider' : 'inside' 
    return optionObjects[regionType].getOptions()
}