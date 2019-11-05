<style lang="less">
</style>

<template>
    <div style="display: flex; padding-top:50px;padding-left:50px;">
        <div>
            <Row>
                <!-- TODO: 封装组件样式 -->
                <div class="echat-title" id="device-name1"><span id="device-name-span1">凤凰城一楼消火栓应急箱</span></div>
                <div id="myChart1" :style="{width: '300px', height: '300px'}"></div>
            </Row>
            <Row>
                <div class="echat-title" id="device-name2"><span id="device-name-span2">凤凰城二楼消火栓应急箱</span></div>
                <div id="myChart2" :style="{width: '300px', height: '300px'}"></div>
            </Row>
            
        </div>
        <div>
            <Row>
                <div class="echat-title" id="device-name3"><span id="device-name-span3">凤凰城三楼消火栓应急箱</span></div>
                <div id="myChart3" :style="{width: '300px', height: '300px'}"></div>
            </Row>
            <Row>
                <div class="echat-title" id="device-name4"><span id="device-name-span3">凤凰城四楼消火栓应急箱</span></div>
                <div id="myChart4" :style="{width: '300px', height: '300px'}"></div>
            </Row>
        </div>
        <div>
            <Row>
                <div class="echat-title" id="device-name5"><span id="device-name-span3">凤凰城五楼消火栓应急箱</span></div>
                <div id="myChart5" :style="{width: '300px', height: '300px'}"></div>
            </Row>
            <Row>
            <div class="echat-title" id="device-name6"><span id="device-name-span3">张村河污水处理厂监测点Xh1</span></div>
            <div id="myChart6" :style="{width: '300px', height: '300px'}"></div>
        </Row>
        </div>
        
        <Row>
            <div class="echat-title" id="device-name7"><span id="device-name-span3">张村河污水处理厂监测点XH2</span></div>
            <div id="myChart7" :style="{width: '300px', height: '300px'}"></div>
        </Row>
        <Row>
            <div class="echat-title" id="device-name8"><span id="device-name-span3">张村河污水处理厂监测点XH3</span></div>
            <div id="myChart8" :style="{width: '300px', height: '300px'}"></div>
        </Row>
    </div>


</template>

<script>
export default {
  name: "monitor",
  data() {
      return {
          msg:'echats demo'
      }
  },
  mounted() {
      this.drawEcharts();
  },
  methods: {
      drawEcharts() {
        let myChart1 = this.$echarts.init(document.getElementById("myChart1"));
        let myChart2 = this.$echarts.init(document.getElementById("myChart2"));
        let myChart3 = this.$echarts.init(document.getElementById("myChart3"));
        let myChart4 = this.$echarts.init(document.getElementById("myChart4"));
        let myChart5 = this.$echarts.init(document.getElementById("myChart5"));
        let myChart6 = this.$echarts.init(document.getElementById("myChart6"))
        let myChart7 = this.$echarts.init(document.getElementById("myChart7"))
        let myChart8 = this.$echarts.init(document.getElementById("myChart8"))



          myChart1.setOption(
              //仪表盘
              {
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}mPa"
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                series : [
                    {
                        name:'某个消火栓的压力值',
                        type:'gauge',
                        min:0,
                        max: 8,
                        splitNumber: 8,       // 分割段数，默认为5
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[0.1, '#ff4500'],[0.9, '#48b'],[1, '#ff4500']],
                                width: 8
                            }
                        },
                        axisTick: {            // 坐标轴小标记、
                            splitNumber: 5,   // 每份split细分多少段
                            length :12,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            show: true,        // 默认显示，属性show控制显示与否
                            length :30,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        pointer : {
                            width : 5
                        },
                        title : {
                            show : true,
                            offsetCenter: [0, '-40%'],       // x, y，单位px
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder'
                            }
                        },
                        detail : {
                            //formatter:'{value}mPa',
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: 'auto',
                            }
                        },
                        data:[{value: 4.1, name: '压力'}]
                    }
                ]
            }

          )
          myChart2.setOption(
              //仪表盘
              {
                  tooltip : {
                      formatter: "{a} <br/>{b} : {c}mPa"
                  },
                  toolbox: {
                      show : true,
                      feature : {
                          mark : {show: true},
                          restore : {show: true},
                          saveAsImage : {show: true}
                      }
                  },
                  series : [
                      {
                          name:'某个消火栓的压力值',
                          type:'gauge',
                          min:0,
                          max: 8,
                          splitNumber: 8,       // 分割段数，默认为5
                          axisLine: {            // 坐标轴线
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: [[0.1, '#ff4500'],[0.9, '#48b'],[1, '#ff4500']],
                                  width: 8
                              }
                          },
                          axisTick: {            // 坐标轴小标记、
                              splitNumber: 5,   // 每份split细分多少段
                              length :12,        // 属性length控制线长
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: 'auto'
                              }
                          },
                          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto'
                              }
                          },
                          splitLine: {           // 分隔线
                              show: true,        // 默认显示，属性show控制显示与否
                              length :30,         // 属性length控制线长
                              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                  color: 'auto'
                              }
                          },
                          pointer : {
                              width : 5
                          },
                          title : {
                              show : true,
                              offsetCenter: [0, '-40%'],       // x, y，单位px
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  fontWeight: 'bolder'
                              }
                          },
                          detail : {
                              //formatter:'{value}mPa',
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto',
                              }
                          },
                          data:[{value: 4.5, name: '压力'}]
                      }
                  ]
              }

          )
           myChart3.setOption(
              //仪表盘
              {
                  tooltip : {
                      formatter: "{a} <br/>{b} : {c}mPa"
                  },
                  toolbox: {
                      show : true,
                      feature : {
                          mark : {show: true},
                          restore : {show: true},
                          saveAsImage : {show: true}
                      }
                  },
                  series : [
                      {
                          name:'某个消火栓的压力值',
                          type:'gauge',
                          min:0,
                          max: 8,
                          splitNumber: 8,       // 分割段数，默认为5
                          axisLine: {            // 坐标轴线
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: [[0.1, '#ff4500'],[0.9, '#48b'],[1, '#ff4500']],
                                  width: 8
                              }
                          },
                          axisTick: {            // 坐标轴小标记、
                              splitNumber: 5,   // 每份split细分多少段
                              length :12,        // 属性length控制线长
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: 'auto'
                              }
                          },
                          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto'
                              }
                          },
                          splitLine: {           // 分隔线
                              show: true,        // 默认显示，属性show控制显示与否
                              length :30,         // 属性length控制线长
                              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                  color: 'auto'
                              }
                          },
                          pointer : {
                              width : 5
                          },
                          title : {
                              show : true,
                              offsetCenter: [0, '-40%'],       // x, y，单位px
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  fontWeight: 'bolder'
                              }
                          },
                          detail : {
                              //formatter:'{value}mPa',
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto',
                              }
                          },
                          data:[{value: 4.3, name: '压力'}]
                      }
                  ]
              }

          )
           myChart4.setOption(
              //仪表盘
              {
                  tooltip : {
                      formatter: "{a} <br/>{b} : {c}mPa"
                  },
                  toolbox: {
                      show : true,
                      feature : {
                          mark : {show: true},
                          restore : {show: true},
                          saveAsImage : {show: true}
                      }
                  },
                  series : [
                      {
                          name:'某个消火栓的压力值',
                          type:'gauge',
                          min:0,
                          max: 8,
                          splitNumber: 8,       // 分割段数，默认为5
                          axisLine: {            // 坐标轴线
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: [[0.1, '#ff4500'],[0.9, '#48b'],[1, '#ff4500']],
                                  width: 8
                              }
                          },
                          axisTick: {            // 坐标轴小标记、
                              splitNumber: 5,   // 每份split细分多少段
                              length :12,        // 属性length控制线长
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: 'auto'
                              }
                          },
                          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto'
                              }
                          },
                          splitLine: {           // 分隔线
                              show: true,        // 默认显示，属性show控制显示与否
                              length :30,         // 属性length控制线长
                              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                  color: 'auto'
                              }
                          },
                          pointer : {
                              width : 5
                          },
                          title : {
                              show : true,
                              offsetCenter: [0, '-40%'],       // x, y，单位px
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  fontWeight: 'bolder'
                              }
                          },
                          detail : {
                              //formatter:'{value}mPa',
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto',
                              }
                          },
                          data:[{value: 4.6, name: '压力'}]
                      }
                  ]
              }

          )
           myChart5.setOption(
              //仪表盘
              {
                  tooltip : {
                      formatter: "{a} <br/>{b} : {c}mPa"
                  },
                  toolbox: {
                      show : true,
                      feature : {
                          mark : {show: true},
                          restore : {show: true},
                          saveAsImage : {show: true}
                      }
                  },
                  series : [
                      {
                          name:'某个消火栓的压力值',
                          type:'gauge',
                          min:0,
                          max: 8,
                          splitNumber: 8,       // 分割段数，默认为5
                          axisLine: {            // 坐标轴线
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: [[0.1, '#ff4500'],[0.9, '#48b'],[1, '#ff4500']],
                                  width: 8
                              }
                          },
                          axisTick: {            // 坐标轴小标记、
                              splitNumber: 5,   // 每份split细分多少段
                              length :12,        // 属性length控制线长
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: 'auto'
                              }
                          },
                          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto'
                              }
                          },
                          splitLine: {           // 分隔线
                              show: true,        // 默认显示，属性show控制显示与否
                              length :30,         // 属性length控制线长
                              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                  color: 'auto'
                              }
                          },
                          pointer : {
                              width : 5
                          },
                          title : {
                              show : true,
                              offsetCenter: [0, '-40%'],       // x, y，单位px
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  fontWeight: 'bolder'
                              }
                          },
                          detail : {
                              //formatter:'{value}mPa',
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto',
                              }
                          },
                          data:[{value: 4.1, name: '压力'}]
                      }
                  ]
              }

          )
           myChart6.setOption(
              //仪表盘
              {
                  tooltip : {
                      formatter: "{a} <br/>{b} : {c}mPa"
                  },
                  toolbox: {
                      show : true,
                      feature : {
                          mark : {show: true},
                          restore : {show: true},
                          saveAsImage : {show: true}
                      }
                  },
                  series : [
                      {
                          name:'某个消火栓的压力值',
                          type:'gauge',
                          min:0,
                          max: 8,
                          splitNumber: 8,       // 分割段数，默认为5
                          axisLine: {            // 坐标轴线
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: [[0.1, '#ff4500'],[0.9, '#48b'],[1, '#ff4500']],
                                  width: 8
                              }
                          },
                          axisTick: {            // 坐标轴小标记、
                              splitNumber: 5,   // 每份split细分多少段
                              length :12,        // 属性length控制线长
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: 'auto'
                              }
                          },
                          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto'
                              }
                          },
                          splitLine: {           // 分隔线
                              show: true,        // 默认显示，属性show控制显示与否
                              length :30,         // 属性length控制线长
                              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                  color: 'auto'
                              }
                          },
                          pointer : {
                              width : 5
                          },
                          title : {
                              show : true,
                              offsetCenter: [0, '-40%'],       // x, y，单位px
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  fontWeight: 'bolder'
                              }
                          },
                          detail : {
                              //formatter:'{value}mPa',
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto',
                              }
                          },
                          data:[{value: 0.1, name: '压力'}]
                      }
                  ]
              }

          )
           myChart7.setOption(
              //仪表盘
              {
                  tooltip : {
                      formatter: "{a} <br/>{b} : {c}mPa"
                  },
                  toolbox: {
                      show : true,
                      feature : {
                          mark : {show: true},
                          restore : {show: true},
                          saveAsImage : {show: true}
                      }
                  },
                  series : [
                      {
                          name:'某个消火栓的压力值',
                          type:'gauge',
                          min:0,
                          max: 8,
                          splitNumber: 8,       // 分割段数，默认为5
                          axisLine: {            // 坐标轴线
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: [[0.1, '#ff4500'],[0.9, '#48b'],[1, '#ff4500']],
                                  width: 8
                              }
                          },
                          axisTick: {            // 坐标轴小标记、
                              splitNumber: 5,   // 每份split细分多少段
                              length :12,        // 属性length控制线长
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: 'auto'
                              }
                          },
                          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto'
                              }
                          },
                          splitLine: {           // 分隔线
                              show: true,        // 默认显示，属性show控制显示与否
                              length :30,         // 属性length控制线长
                              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                  color: 'auto'
                              }
                          },
                          pointer : {
                              width : 5
                          },
                          title : {
                              show : true,
                              offsetCenter: [0, '-40%'],       // x, y，单位px
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  fontWeight: 'bolder'
                              }
                          },
                          detail : {
                              //formatter:'{value}mPa',
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto',
                              }
                          },
                          data:[{value: 4.9, name: '压力'}]
                      }
                  ]
              }

          )
           myChart8.setOption(
              //仪表盘
              {
                  tooltip : {
                      formatter: "{a} <br/>{b} : {c}mPa"
                  },
                  toolbox: {
                      show : true,
                      feature : {
                          mark : {show: true},
                          restore : {show: true},
                          saveAsImage : {show: true}
                      }
                  },
                  series : [
                      {
                          name:'某个消火栓的压力值',
                          type:'gauge',
                          min:0,
                          max: 8,
                          splitNumber: 8,       // 分割段数，默认为5
                          axisLine: {            // 坐标轴线
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: [[0.1, '#ff4500'],[0.9, '#48b'],[1, '#ff4500']],
                                  width: 8
                              }
                          },
                          axisTick: {            // 坐标轴小标记、
                              splitNumber: 5,   // 每份split细分多少段
                              length :12,        // 属性length控制线长
                              lineStyle: {       // 属性lineStyle控制线条样式
                                  color: 'auto'
                              }
                          },
                          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto'
                              }
                          },
                          splitLine: {           // 分隔线
                              show: true,        // 默认显示，属性show控制显示与否
                              length :30,         // 属性length控制线长
                              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                  color: 'auto'
                              }
                          },
                          pointer : {
                              width : 5
                          },
                          title : {
                              show : true,
                              offsetCenter: [0, '-40%'],       // x, y，单位px
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  fontWeight: 'bolder'
                              }
                          },
                          detail : {
                              //formatter:'{value}mPa',
                              textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                  color: 'auto',
                              }
                          },
                          data:[{value: 4.3, name: '压力'}]
                      }
                  ]
              }

          )

      }
  }

}

</script>
<style scoped>
    echat-title{
        display: flex;
    }
</style>
