export default {
    grid: {
        left: 50,
        top: 10,
        bottom: 20,
        right: 20
    },  
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
                   return data[2].Landkreis??data[2].country
                },
                position: 'top'
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