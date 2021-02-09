export default {
    // backgroundColor: '#404a59',
    title: {
      show: true,
      // text: '7-Tage-Inzidenz in Landkreisen',
      subtext: 'Quelle: RKI',
      sublink: 'https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0/geoservice',
      left: 'left',
      textStyle: {
        color: '#111'
      }
    },
    tooltip: {
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
    series: {
      name: 'Inzidenz/Woche',
      nameProperty: 'RS',
      type: 'map',
      roam: true,
      map: 'landkreise',
      tooltip: {
        formatter (val) {
          return `<b>${val.data.values.GEN}</b><br/>
          Inzidenz/Woche: ${Math.round(val.data.value)}<br/>
          Todesfälle/100.000/Woche: ${Math.round(val.data.values.death7_lk*100000/val.data.values.EWZ)} `
        },
        extraCssText: "text-align:left"
      },
      emphasis: {
        label: {
          show:true,
          backgroundColor: "hsl(200,100%,90%,0.5)",
          padding: [4,2,2,2],
          borderColor: "hsl(200,100%,10%,0.5)",
          borderWidth: 1,
          formatter: function(param) {
            return param.data?param.data.values.GEN:''
          }
        }
      },
      itemStyle: {
        emphasis: {
            shadowBlur: 20,
            shadowColor: 'rgba(120, 36, 50, 0.5)',
            shadowOffsetY: 5,
            color: '#32fb08'
        }
      },  
      // left: 0, top: 0, right: 0, bottom: 0,
      boundingCoords: null, 
      center: [],
      zoom: 1,
      data: []
    },
  }
