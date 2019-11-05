<style lang="less">
@import "./waterAlarm.less";
</style>
<template>
  <Row>
    <Card>
          <div class="search">
            <div id="new-statics" class="alarm-echarts-wrp">
              <div data-v-6a8e7a66 id="top-head">
                <div data-v-6a8e7a66 class="statics-alarm-section">
                  <div data-v-6a8e7a66 class="statics-top-left">
                    <div
                      data-v-6a8e7a66
                      role="radiogroup"
                      class="el-radio-group statics-radio-group"
                    >
                      <Row>
                        <Form ref="searchForm" :model="searchForm" inline :label-width="100" class="search-form">
                            <Form-item label="巡查统计">
                              <DatePicker
                                v-model="selectDate"
                                type="daterange"
                                format="yyyy-MM-dd"
                                @on-change="selectDateRange"
                                placeholder="选择起始时间"
                                style="width: 200px"
                              ></DatePicker>
                            </Form-item>
                        </Form>
                      </Row>
                    </div>
                  </div>
                </div>
                <div data-v-6a8e7a66 class="statics-header-tags">
                  <div data-v-6a8e7a66 class="statics-header-tag">
                    <div data-v-6a8e7a66 class="statics-item-icon icon-total"></div>
                    <div data-v-6a8e7a66>
                      <div data-v-6a8e7a66 class="statics-item-count">{{siteCount}}</div>
                      <div data-v-6a8e7a66 class="statics-item-label">巡查点总数</div>
                    </div>
                  </div>
                  <div data-v-6a8e7a66 class="statics-header-tag">
                    <div data-v-6a8e7a66 class="statics-item-icon icon-offline"></div>
                    <div data-v-6a8e7a66>
                      <div data-v-6a8e7a66 class="statics-item-count">
                        <span style="color: #FC3A44;">{{unSiteCount}}</span>/{{alSiteCount}}
                      </div>
                      <div data-v-6a8e7a66 class="statics-item-label">未巡查点/已巡查点</div>
                    </div>
                  </div>
                  <div data-v-6a8e7a66 class="statics-header-tag">
                    <div data-v-6a8e7a66 class="statics-item-icon icon-alarm"></div>
                    <div data-v-6a8e7a66>
                      <div data-v-6a8e7a66 class="statics-item-count">{{deviceCount}}</div>
                      <div data-v-6a8e7a66 class="statics-item-label">巡查设备总数</div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-v-23c99d24 style="height: calc(100% - 190px);">
                  <div style="height:320px;">
                    <div id="fire-alarm" style="width:45%; float:left">
                    <div class="alarm-echarts-wrp">
                      <div class="alarm-echarts-tooltip">
                          <span class="alarm-echarts-label"> 巡查点与设备完好数 </span> 
                        </div> 
                        <div id="Chart1">
                          <apexchart type=bar height=260px :options="chartOptions1" :series="series1" />
                        </div>
                    </div>
                  </div>
                  <div id="fire-alarm" style="width:50%; float:left">
                    <div class="alarm-echarts-wrp">
                      <div class="alarm-echarts-tooltip">
                          <span class="alarm-echarts-label">有效巡查计划</span> 
                        </div> 
                        <div id="chart2" class="alarm-echart">
                          <apexchart type=donut  height = 260px :options="chartOptions2" :series="series2" />
                        </div>
                    </div>
                  </div>
                  </div>
                  <div style="margin-top:2px;">
                    <div id="fire-alarm" style="width:50%; float:left;">
                    <div class="alarm-echarts-wrp">
                      <div class="alarm-echarts-tooltip">
                          <span class="alarm-echarts-label">隐患处理率</span> 
                        </div> 
                        <div id="chart4" style="height: 210px;">
                          <apexchart type=pie height = 200px :options="chartOptions4" :series="series4" />
                        </div>
                    </div>
                  </div>
                  <div id="fire-alarm" style="width:50%; float:left">
                    <div class="alarm-echarts-wrp">
                      <div class="alarm-echarts-tooltip">
                          <span class="alarm-echarts-label"> 设备统计</span> 
                        </div> 
                       <div id="chart5" style="height: 210px;">
                        <apexchart type=bar height=190px :options="chartOptions5" :series="series5" />
                      </div>
                    </div>
                  </div>

                  </div>
              </div>
            </div>
          </div>
    </Card>
  </Row>
</template>

<script>
import {
  getSiteChartsData,
  getDealTypeChartsData,
  getDeviceStatusCountChartsData,
  getPortalCountAllData,
  getPlanChartsData
} from "@/api/index";
import circleLoading from "@/views/my-components/circle-loading.vue";
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
import { max } from 'date-fns';
export default {
  name: "complex-table",
  components: {
    circleLoading,
    uploadPicInput
  },
  data() {
    return {
      loading: true, // 表单加载状态
      open: false,
      operationLoading: false, // 操作加载状态
      modalExportAll: false, // 显示导出全部数据
      loadingExport: true, // 导出全部数据状态
      selectCount: 0, // 多选计数
      selectList: [], // 多选数据
      viewImage: false, // 图片预览标识
      category: [
        // 搜索类别数据
      ],
      selectCat: [], // 搜索选择类别modal
      dataCat: [], // 编辑添加类别数据
      deviceFaultAll:[], //设备信息汇总
      maxtickAmount:10,
      deviceTickAmount:10,
      alarmTickAmount:10,
      maxmax:0,
      deviceMax:0,
      alarmMax:0,
      untreated:0,
      processed:0,
      alarmCount:0,
      //报表统计栏数据
      siteCount:0,
      unSiteCount:0,
      alSiteCount:0,
      deviceCount:0,

      selectDate: null, // 选择日期绑定modal
      searchForm: {
        // 搜索框对应data对象
        startDate: "", // 起始时间
        endDate: "" // 终止时间
      },
      series1: [{
        name: '已巡查点',
        data: []
      }, {
        name: '未巡查点',
        data: []
      }, {
        name: '设备完好数',
        data: []
      }],
      chartOptions1: {
        chart: {
          stacked: true,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        colors: ['#00c0ff', '#ff4f50'],
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },

        xaxis: {
          categories: [],
        },
        legend: {
          position: 'top',
          offsetY: 0
        },
        fill: {
          opacity: 1
        }
      },
      series2: [1],
      chartOptions2: {
        labels: ['有效巡查计划'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
              height:200
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
         yaxis: {
          labels: {
            formatter: function(val, index) {
              return parseInt(val);
            }
          }
        }
      },

      series4: [],
      chartOptions4: {
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
              height: 200,
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
        yaxis: {
          labels: {
            formatter: function(val, index) {
              return parseInt(val);
            }
          }
        }
      },

      series5: [{
          name: '数量：',
          data: []
        }
        ],
      chartOptions5: {
        chart: {
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [],
        },
        tooltip: {
            y: {
              formatter: function (val) {
                return parseInt(val) + "个"
              }
            }
          },
      },
      data: [], // 表单数据
      exportData: [], // 导出数据
      total: 0 // 表单数据总数
    };
  },
  methods: {
    init() {
       //获取报警、设备等数量
      this.getPortalCountAll();
      //巡查计划类型
      this.getPlanCharts();
      
      // 初始化搜索框级联分类数据

      //默认时间一个月
      this.selectedDataDate();
      //故障柱状图
      this.getSiteChartsData();
      
      //处理类型占比
      this.getDealTypeCharts();
      //设备统计
      this.getDeviceStatusCountCharts();
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
      this.getSiteChartsData();
      this.getPlanCharts();
      this.getDealTypeCharts();
      this.getDeviceStatusCountCharts();
      //获取报警、设备等数量
      this.getPortalCountAll();
    },
    selectedDataDate(){
       //获取系统当前时间
        var nowdate = new Date();
        var y = nowdate.getFullYear();
        var m = nowdate.getMonth()+1;
        var d = nowdate.getDate();
        var startDate = y+'-'+m+'-'+d;
        //获取系统前一个月的时间
        nowdate.setMonth(nowdate.getMonth()-1);
        var y = nowdate.getFullYear();
        var m = nowdate.getMonth()+1;
        var d = nowdate.getDate();
        var endDate = y+'-'+m+'-'+d;
        this.selectDate = [endDate, startDate];
    },
    getSiteChartsData() {
      this.loading = true;
      getSiteChartsData(this.searchForm).then(res => {
      this.loading = false;
      console.log(res.result);
      if (res.success == true) {
        this.series1[0].data = res.result.alSiteList;
        this.series1[1].data = res.result.unSiteList;
        this.series1[2].data = res.result.intactDeviceList;
        this.chartOptions1={
          chart: {
            stacked: true,
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          colors: ['#00c0ff', '#ff4f50'],
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }],
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },

          xaxis: {
            categories:res.result.reportFloorList,
          },
          yaxis: {
            labels: {
              formatter: function(val, index) {
                return parseInt(val);
              }
            }
          },
          legend: {
            position: 'top',
            offsetY: 0
          },
          fill: {
            opacity: 1
          }
        }}
      });
    },

    getPlanCharts(){
      this.loading = true;
      getPlanChartsData(this.searchForm).then(res => {
      this.loading = false;
      if (res.success == true) {
        if(res.result.countList.length>0){
          this.series2 = res.result.countList;
          this.chartOptions2= {
            labels: res.result.typeList,
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                  height:200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }],
            yaxis: {
              labels: {
                formatter: function(val, index) {
                  return parseInt(val);
                }
              }
            }
          }
        }else{
          this.series2=[1],
          this.chartOptions2={
            labels: ['无信息'],
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                  height:200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }],
            yaxis: {
              labels: {
                formatter: function(val, index) {
                  return parseInt(val);
                }
              }
            }
          }
        }
        }
      });

    },

    getDealTypeCharts(){
      this.loading = true;
      getDealTypeChartsData(this.searchForm).then(res => {
      this.loading = false;
      if (res.success == true) {
        if(res.result.countList.length>0){
          this.series4 = res.result.countList;
          this.chartOptions4= {
            labels: res.result.dealTypeList,
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                  height: 200,
                },
                legend: {
                  position: 'bottom'
                }
              }
            }],
            yaxis: {
              labels: {
                formatter: function(val, index) {
                  return parseInt(val);
                }
              }
            }
          }
        }else{
          this.series4 = [1];
          this.chartOptions4= {
            labels: ["无处理类型数据"],
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                  height: 200,
                },
                legend: {
                  position: 'bottom'
                }
              }
            }],
            yaxis: {
              labels: {
                formatter: function(val, index) {
                  return parseInt(val);
                }
              }
            }
          }
        }
        }
      });

    },
    getDeviceStatusCountCharts(){
      this.loading = true;
      getDeviceStatusCountChartsData(this.searchForm).then(res => {
      this.loading = false;
      if (res.success == true) {
        if(res.result.deviceTypeCount.length>0){
          this.series5[0].data = res.result.deviceTypeCount;
          this.deviceTickAmount = parseInt(res.result.max);
           if(res.result.max<=5){
            this.deviceTickAmount = 1;
            this.deviceMax = 6;
          }else if(res.result.max<=10){
            this.deviceTickAmount = parseInt(res.result.max)+1;
            this.deviceMax = parseInt(res.result.max)+1;
          }else if(res.result.max<=50){
            if(res.result.max%5==0){
              this.deviceTickAmount = parseInt(res.result.max/5)+1;
              this.deviceMax =  Math.ceil(res.result.max/5)*5+5;
            }else{
              this.deviceTickAmount =  Math.ceil(res.result.max/5);
              this.deviceMax = Math.ceil(res.result.max/5)*5;
            }
          }else if(res.result.max <=100){
            if(res.result.max%10==0){
              this.deviceTickAmount = parseInt(res.result.max/10)+1;
              this.deviceMax = Math.ceil(res.result.max/10)*10+10;
            }else{
              this.deviceTickAmount = parseInt(res.result.max/10);
              this.deviceMax =  Math.ceil(res.result.max/10)*10;
            }
          }else{
            if(res.result.max%100==0){
              this.deviceTickAmount = parseInt(res.result.max/100)+1;
              this.deviceMax = Math.ceil(res.result.max/100)+100;
            }else{
              this.deviceTickAmount = parseInt(res.result.max/100);
              this.deviceMax = Math.ceil(res.result.max/100)*100;
            }  
          }
          this.chartOptions5= {
            chart: {
              toolbar: {
                show: false
              }
            },
            plotOptions: {
              bar: {
                horizontal: true,
              }
            },
            dataLabels: {
              enabled: false
            },
            xaxis: {
              categories: res.result.deviceTypeName,
            },
            yaxis: {
              tickAmount:this.deviceTickAmount,
              min: 0,
              max:  this.deviceMax
            },
            tooltip: {
                y: {
                  formatter: function (val) {
                    return parseInt(val) + "个"
                  }
                }
              },
          }
        }
        }
      });

    },
    getPortalCountAll(){
       this.loading = true;
      getPortalCountAllData(this.searchForm).then(res => {
      this.loading = false;
      if (res.success == true) {
        this.siteCount = res.result.siteCount;
        this.unSiteCount = res.result.unSiteCount;
        this.alSiteCount = res.result.alSiteCount;
        this.deviceCount = res.result.deviceCount;
      }
      });
    } 
  },
  mounted() {
    this.init();
  }
};
</script>