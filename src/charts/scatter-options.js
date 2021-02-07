export default {
    series: {
        type: 'scatter',
        name: 'Dynamik',
        data: [],
        label: {
            emphasis: {
                show: true,
                color: 'black',
                backgroundColor: "hsl(200,100%,90%,0.5)",
                padding: [4,2,2,2],
                borderColor: "hsl(200,100%,10%,0.5)",
                borderWidth: 1,
                      formatter ({ data }) {
                   return data[2].Landkreis
                },
                position: 'top'
            }
        },
        tooltip:{
            formatter ({data}) {
                return `<b>${data[2].Landkreis}</b><br/>
                Inzidenz: ${data[0]}<br/>
                Veränderung: ${data[1]} %<br/>
                ${data[1]<0?'Halbierungszeit':'Verdopplungszeit'}: ${Math.abs(Math.round(7/Math.log2(1+data[1]/100)))} Tage<br/>
                R ~ ${Math.round(100*2**(4/7*Math.log2(1+data[1]/100)))/100} `
            },
            extraCssText: "text-align:left"
        },
        itemStyle: {
            normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 19, 51, 0.5)',
                shadowOffsetY: 5,
                color: 'rgb(0, 56, 153)'
            },
            emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 19, 51, 0.5)',
                shadowOffsetY: 5,
                color: 'rgb(0, 223, 255)'
            }
        }   
    },
    xAxis: {
    },
    yAxis: {
        axisLabel: {
            formatter: "{value} %"
          }
    },
    tooltip: {
        trigger: 'item',
        // formatter: '{a} {c}'
    },
    dataZoom: [
        // {
        //     type: 'slider',
        //     show: true,
        //     xAxisIndex: [0],
        //     // start: 1,
        //     // end: 35
        // },
        // {
        //     type: 'slider',
        //     show: true,
        //     yAxisIndex: [0],
        //     left: '93%',
        //     // start: 29,
        //     // end: 36
        // },
        {
            type: 'inside',
            xAxisIndex: [0],
            // start: 1,
            // end: 35
        },
        {
            type: 'inside',
            yAxisIndex: [0],
            // start: 29,
            // end: 36
        }
    ],
}