export default {
  xAxis: {
    type: "time",
    axisLabel: {
        formatter: (value) => new Date(value).toLocaleDateString()
    }
},
  yAxis: {},
  grid: {
    top: 10,
    right:30,
    left:60,
    bottom: 30
  },
  series: [
    {
      name: "Meldungen",
      type: "bar",
      stack: "this",
      itemStyle: {
          normal: {
              // shadowBlur: 10,
              // shadowColor: 'hsl(218, 100%, 10%, 0.5)',
              // shadowOffsetY: 5,
              color: 'hsl(218, 100%, 30%)'
          },
          emphasis: {
              shadowBlur: 10,
              shadowColor: 'hsl(218, 100%, 10%, 0.5)',
              shadowOffsetY: 5,
              color: 'hsl(218, 100%, 80%)'
          },
      },
      data: [],
      large: true
    },
    {
      name: "Nachmeldungen",
      type: "bar",
      stack: "this",
      itemStyle: {
          normal: {
              // shadowBlur: 10,
              // shadowColor: 'hsl(188, 100%, 10%, 0.5)',
              // shadowOffsetY: 5,
              color: 'hsl(188, 100%, 50%)'
          },
          emphasis: {
              shadowBlur: 10,
              shadowColor: 'hsl(188, 100%, 10%, 0.5)',
              shadowOffsetY: 5,
              color: 'hsl(188, 100%, 80%)'
          }
      },
      data: [],
      large: true
    },
    // {
    //   name: "Todesfälle",
    //   type: "bar",
    //   stack: "this2",
    //   itemStyle: {
    //       normal: {
    //           // shadowBlur: 10,
    //           // shadowColor: 'hsl(0, 100%, 10%, 0.5)',
    //           // shadowOffsetY: 5,
    //           color: 'hsl(0, 100%, 30%)'
    //       },
    //       emphasis: {
    //           shadowBlur: 10,
    //           shadowColor: 'hsl(0, 100%, 10%, 0.5)',
    //           shadowOffsetY: 5,
    //           color: 'hsl(0, 100%, 80%)'
    //       },
    //   },
    //   data: []
    // },
    // {
    //   name: "Nachmeldungen Todesfälle",
    //   type: "bar",
    //   stack: "this2",
    //   itemStyle: {
    //       normal: {
    //           // shadowBlur: 10,
    //           // shadowColor: 'hsl(45, 100%, 10%, 0.5)',
    //           // shadowOffsetY: 5,
    //           color: 'hsl(45, 100%, 50%)'
    //       },
    //       emphasis: {
    //           shadowBlur: 10,
    //           shadowColor: 'hsl(45, 100%, 10%, 0.5)',
    //           shadowOffsetY: 5,
    //           color: 'hsl(45, 100%, 80%)'
    //       }
    //   },
    //   data: []
    // },
  ],
  tooltip: {
    trigger: 'axis',
    // formatter: (params) => `${new Date(params[0].data[0]).toLocaleDateString()}<br/>${params[0].data[1]} Fälle berichtet`
    extraCssText: "text-align:left"
  },
  dataZoom: [{
      type: 'inside'
  }],
  legend: {}
}
