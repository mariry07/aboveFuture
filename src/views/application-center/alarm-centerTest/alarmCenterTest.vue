<style lang="less">
@import "./alarmCenterTest.less";
</style>
<template>
  <Row>
    <Card>
      <Tabs :animated="false">
          <div class="search">

          <Row class="operation">
            <div style="width:95%; float:left">
              <Button @click="batchProcess">批量处理</Button>
              <Button @click="delAll" icon="md-trash">删除</Button>
              <circleLoading v-if="operationLoading"/>
            </div>
            <!-- 通过a标签，点击文字弹出表单-->
            <div style="width:5%; float:left">
              <a class="drop-down" @click="dropDown">
                {{dropDownContent}}
                <Icon :type="dropDownIcon"></Icon>
              </a>
            </div>
          </Row>
          <!-- 表单 点击查找筛选弹出来的表单内容-->
            <Row>
              <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
                <span v-if="drop">
                <Form-item label="设备名称" prop="deviceName">
                  <Input
                    type="text"
                    v-model="searchForm.deviceName"
                    placeholder="请输入"
                    clearable
                    style="width: 200px"
                  />
                </Form-item>
                <Form-item label="所属类别" prop="category">
                  <Cascader
                    v-model="selectCat"
                    :data="category"
                    :load-data="loadData"
                    @on-change="handleChangeCat"
                    change-on-select
                    filterable
                    placeholder="请选择或输入搜索类别"
                    style="width: 200px"
                  ></Cascader>
                </Form-item>
                  <Form-item label="状态" prop="status">
                    <Select
                      v-model="searchForm.status"
                      placeholder="请选择"
                      clearable
                      style="width: 200px"
                    >
                      <Option value="0">正常</Option>
                      <Option value="-1">禁用</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="创建时间">
                    <DatePicker
                      v-model="selectDate"
                      type="daterange"
                      format="yyyy-MM-dd"
                      clearable
                      @on-change="selectAlamDateRange"
                      placeholder="选择起始时间"
                      style="width: 200px"
                    ></DatePicker>
                  </Form-item>
                <Form-item style="margin-left:-35px;" class="br">
                  <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                  <Button @click="handleReset">重置</Button>
                </Form-item>
                </span>
              </Form>
            </Row>
            
            <Row>
              <Alert show-icon>
                已选择
                <span class="select-count">{{selectCount}}</span> 项
                <a class="select-clear" @click="clearSelectAll">清空</a>
              </Alert>
            </Row>
            <Row>
              <Table
                :loading="loading"
                border
                :columns="columns"
                :data="data"
                sortable="custom"
                @on-sort-change="changeSort"
                @on-selection-change="showSelect"
                ref="table"
              ></Table>
              <Table
                :columns="exportColumns"
                :data="exportData"
                ref="exportTable"
                style="display:none"
              ></Table>
            </Row>
            
            <!-- 分页处理-->
            <Row type="flex" justify="end" class="page">
              <Page
                :current="searchForm.pageNumber"
                :total="total"
                :page-size="searchForm.pageSize"
                @on-change="changePage"
                @on-page-size-change="changePageSize"
                :page-size-opts="[5,10,20]"
                size="small"
                show-total
                show-elevator
                show-sizer
              ></Page>
            </Row>
          </div>
      </Tabs>
    </Card>
  </Row>
</template>

<script>
import {
  getDevicePoliceAndFaultChartsData,
  getDeviceAlarmChartsData,
  getAlarmTypeChartsData,
  getDealTypeChartsData,
  getDeviceTypeCountChartsData,
  getAlamChartsData,
  getAlarmSummaryCountAllData

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
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度不得小于6位"));
      } else {
        callback();
      }
    };
    return {
      loading: true, // 表单加载状态
      open: false,
      operationLoading: false, // 操作加载状态
      modalExportAll: false, // 显示导出全部数据
      loadingExport: true, // 导出全部数据状态
      drop: false, // 搜索展开标识
      dropDownContent: "查找筛选", // 搜索展开标识文字
      dropDownIcon: "ios-arrow-down", //搜索展开图标
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
      deviceAll:0,
      untreated:0,
      processed:0,
      alarmCount:0,
      deviceStatusAll:0,
      searchForm: {
        // 搜索框对应data对象
        deviceName: "", //主机名称
        categoryId: "",
        status: "",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "addTime", // 默认排序字段
        order: "desc", // 默认排序方式
        startDate: "", // 起始时间
        endDate: "", // 终止时间
        delFlag: 0 //删除标记
      },
      selectDate: null, // 选择日期绑定modal
      form: {
        // 添加或编辑表单对象初始化数据
        type: 0,
        avatar: "https://s1.ax1x.com/2018/05/19/CcdVQP.png",
        categoryId: "",
        categoryTitle: ""
      },
      errorPass: "", // 密码错误提示
      formValidate: {
        // 表单验证规则
        name: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      submitLoading: false, // 添加或编辑提交状态
      series: [{
          name: "报警数量",
          data: []
      }],

      series1: [{
        name: '已处理',
        data: []
      }, {
        name: '未处理',
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
      series2: [
        {
          name: "报警",
          data: []
        },
        {
          name: "故障",
          data: []
        }
      ],
      chartOptions2: {
        chart: {
          shadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 1
          },
          toolbar: {
            show: false
          }
        },
        colors: ['#ff4f50', '#ffb83f'],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth'
        },
        // title: {
        //   text: 'Average High & Low Temperature',
        //   align: 'left'
        // },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        markers: {
          
          size: 6
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          // title: {
          //   text: 'Temperature'
          // },
          min: 5,
          max: 40
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      },
      series3: [1],
      chartOptions3: {
        labels: ['水压报警'],
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
          name: '统计：',
          data: []
        }],
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

      chartOptions: {
        chart: {
            height: 280,
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        // title: {
        //     text: 'Product Trends by Month',
        //     align: 'left'
        // },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: [],
        },
        yaxis: {
          tickAmount:this.maxtickAmount,
          min: 0,
          max:  this.maxmax,
          labels: {
            formatter: function(val, index) {
              return parseInt(val);
            }
          }
        }
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          type: "index",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "监测点名称",
          key: "deviceName",
          minWidth: 150,
          align: "center",
          fixed: "left"
        },
        {
          title: "报警类型",
          key: "alarmTypeName",
          minWidth: 120,
          maxWidth: 200,
          align: "center",
          fixed: "left"
        },
        // {
        //   title: "报警位置",
        //   key: "faultTypeName",
        //   align: "center",
        //   width: 300,
        //   align: "center",
        //   fixed: "left"
        // },
        {
          title: "报警位置",
          key: "position",
          minWidth: 150,
          align: "center",
          fixed: "left"
        },
        {
          title: "次数",
          key: "alarmCount",
          minWidth: 150,
          align: "center",
          fixed: "left"
        },
        {
          title: "报警时间",
          key: "addTime",
          align: "center",
          sortType: "desc",
          width: 180,
          fixed: "left"
        },
        {
          title: "处理状态",
          key: "status",
          align: "center",
          width: 100,
          fixed: "left",
          render: (h, params) => {
            let re = "";
            if (params.row.status == 0) {
              return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      alert(params.row.id);
                      //this.edit(params.row);
                    }
                  }
                },
                "未处理"
              )
            ]);
            } else if (params.row.status == 1) {
              re = "已处理";
            }else if(params.row.status==3){
              re ="误报";
            }
            return h("div", re);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            let enableOrDisable = "";
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.edit(params.row);
                    }
                  }
                },
                "视频"
              )
            ]);
          }
        }
      ],
      exportColumns: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "头像",
          key: "avatar"
        },
        {
          title: "所属类别",
          key: "categoryTitle"
        },
        {
          title: "类型",
          key: "type"
        },
        {
          title: "状态",
          key: "status"
        },
        {
          title: "创建时间",
          key: "addTime"
        }
      ],
      data: [], // 表单数据
      exportData: [], // 导出数据
      total: 0 // 表单数据总数
    };
  },
  methods: {
    init() {
       //获取报警、设备等数量
      this.getAlarmSummaryCountAll();
      
      this.getDataList();
      // 初始化搜索框级联分类数据
      this.initCategoryData();
      // 初始化编辑添加树形分类数据
      this.initCategoryForEdit();

      this.getDeviceFaultAll();
      //报警故障折线图
      this.getDevicePoliceAndFaultChartsData();
      //默认时间一个月
      this.selectedDataDate();
      //故障柱状图
      this.getDeviceAlarmChartsData();
      //报警类型
      this.getAlarmTypeCharts();
      //处理类型占比
      this.getDealTypeCharts();
      //设备统计
      this.getDeviceTypeCountCharts();
      //报警折线图
      this.getAlamCharts();
    },
    handleOk () {
      this.open = false;
      this.getAlamCharts();
    },
    handleClick () {
        this.open = !this.open;
    },

    initCategoryData() {
      // this.getRequest("级联一级数据请求路径，如/category/getByParentId/0").then(res => {
      //   if (res.success == true) {
      //     res.result.forEach(function(e) {
      //       if (e.isParent) {
      //         e.value = e.id;
      //         e.label = e.title;
      //         e.loading = false;
      //         e.children = [];
      //       } else {
      //         e.value = e.id;
      //         e.label = e.title;
      //       }
      //     });
      //     this.category = res.result;
      //   }
      // });
      // 模拟请求成功
      this.category = [
        {
          label: "分类1",
          value: "1",
          loading: false,
          children: [
            {
              label: "二级分类",
              value: "1.1"
            }
          ]
        },
        {
          label: "分类2",
          value: "2"
        }
      ];
    },
    initCategoryForEdit() {
      // this.getRequest("树形一级数据请求路径，如/category/getByParentId/0").then(res => {
      //   if (res.success == true) {
      //     res.result.forEach(function(e) {
      //       if (e.isParent) {
      //         e.loading = false;
      //         e.children = [];
      //       }
      //     });
      //     this.dataCat = res.result;
      //   }
      // });
      // 模拟请求成功
      this.dataCat = [
        {
          title: "分类1",
          id: "1",
          loading: false,
          children: [
            {
              title: "二级分类",
              id: "2"
            }
          ]
        },
        {
          title: "分类2",
          id: "3"
        }
      ];
    },
    // loadData(item, callback) {
    //   // 异步加载搜索框级联类别子节点数据
    //   // item.loading = true;
    //   // this.getRequest("请求路径，如/category/getByParentId/" + item.value).then(res => {
    //   //   item.loading = false;
    //   //   if (res.success == true) {
    //   //     res.result.forEach(function(e) {
    //   //       if (e.isParent) {
    //   //         e.value = e.id;
    //   //         e.label = e.title;
    //   //         e.loading = false;
    //   //         e.children = [];
    //   //       } else {
    //   //         e.value = e.id;
    //   //         e.label = e.title;
    //   //       }
    //   //       if (e.status == -1) {
    //   //         e.label = "[已禁用] " + e.label;
    //   //         e.disabled = true;
    //   //       }
    //   //     });
    //   //     item.children = res.result;
    //   //     callback();
    //   //   }
    //   // });
    // },
    // loadDataTree(item, callback) {
    //   // 异步加载编辑添加选择类别树子节点数据
    //   // this.getRequest("请求路径，如/category/getByParentId/" + item.id).then(res => {
    //   //   if (res.success == true) {
    //   //     res.result.forEach(function(e) {
    //   //       if (e.isParent) {
    //   //         e.loading = false;
    //   //         e.children = [];
    //   //       }
    //   //     });
    //   //     callback(res.result);
    //   //   }
    //   // });
    // },
    handleChangeCat(value, selectedData) {
      // 获取最后一个值
      if (value && value.length > 0) {
        this.searchForm.categoryId = value[value.length - 1];
      } else {
        this.searchForm.categoryId = "";
      }
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    // selectDateRange(v) {
    //   if (v) {
    //     this.searchForm.startDate = v[0];
    //     this.searchForm.endDate = v[1];
    //   }
    //   this.getDevicePoliceAndFaultChartsData();
    //   this.getDeviceAlarmChartsData();
    //   this.getAlarmTypeCharts();
    //   this.getDealTypeCharts();
    //   this.getDeviceTypeCountCharts();
    //   //获取报警、设备等数量
    //   this.getAlarmSummaryCountAll();
    // },
    selectAlamDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    handleClear () {
        this.open = false;
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
    getDataList() {
      // 多条件搜索获取表格数据
      this.loading = true;
      this.getRequest("/Alarm/getByCondition", this.searchForm).then(res => {
        this.loading = false;
        if (res.success == true) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
      this.exportData = this.data;
      this.total = this.data.length;
      this.loading = false;
    },
    getDeviceFaultAll() {
      this.loading = true;
      this.getRequest("/deviceFault/getDeviceFaultAll").then(res => {
        this.loading = false;
        if (res.success == true) {
          this.deviceFaultAll = res.result;
        }
      });
    },
    getDevicePoliceAndFaultChartsData() {
      this.loading = true;
      getDevicePoliceAndFaultChartsData(this.searchForm).then(res => {
      this.loading = false;
      if (res.success == true) {
        this.series2[0].data = res.result.deviceFaultChartsY;
        this.series2[1].data = res.result.serverAlarmChartsY;
        this.maxtickAmount = parseInt(res.result.max);
        if(res.result.max<=10){
          this.maxtickAmount = parseInt(res.result.max)+1;
          this.maxmax = parseInt(res.result.max)+1;
        }else if(res.result.max<=50){
          if(res.result.max%5==0){
            this.maxtickAmount = parseInt(res.result.max/5)+1;
            this.maxmax =  Math.ceil(res.result.max/5)*5+5;
          }else{
            this.maxtickAmount =  Math.ceil(res.result.max/5);
            this.maxmax = Math.ceil(res.result.max/5)*5;
          }
        }else if(res.result.max <=100){
          if(res.result.max%10==0){
            this.maxtickAmount = parseInt(res.result.max/10)+1;
            this.maxmax = Math.ceil(res.result.max/10)*10+10;
          }else{
            this.maxtickAmount = parseInt(res.result.max/10);
            this.maxmax =  Math.ceil(res.result.max/10)*10;
          }
        }else{
          if(res.result.max%100==0){
            this.maxtickAmount = parseInt(res.result.max/100)+1;
            this.maxmax = Math.ceil(res.result.max/100)+100;
          }else{
            this.maxtickAmount = parseInt(res.result.max/100);
            this.maxmax = Math.ceil(res.result.max/100)*100;
          }  
        }
        this.chartOptions2 = {
            chart: {
              shadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 1
              },
              toolbar: {
                show: false
              }
            },
            colors: ['#ff4f50', '#ffb83f'],
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: 'smooth'
            },
            title: {
              text: '.',
              align: 'top'
            },
            grid: {
              borderColor: '#e7e7e7',
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            markers: {
              
              size: 6
            },
            xaxis: {
              categories: res.result.deviceFaultChartsX,
              width:50
            },
            yaxis: {
              tickAmount:this.maxtickAmount,
              min: 0,
              max:  this.maxmax,
              labels: {
                formatter: function(val, index) {
                  return parseInt(val);
                }
              }
            },
            legend: {
              position: 'top',
              horizontalAlign: 'center',
              floating: true,
              offsetY: -25,
              offsetX: -5
            }
          }}
      });
    },

    getDeviceAlarmChartsData() {
      this.loading = true;
      getDeviceAlarmChartsData(this.searchForm).then(res => {
      this.loading = false;
      if (res.success == true) {
        this.series1[0].data = res.result.processedList;
        this.series1[1].data = res.result.untreatedList;
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
            categories:res.result.serverAlarmList,
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

    getAlarmTypeCharts(){
      this.loading = true;
      getAlarmTypeChartsData(this.searchForm).then(res => {
      this.loading = false;
      if (res.success == true) {
        if(res.result.countList.length>0){
          this.series3 = res.result.countList;
          this.chartOptions3= {
            labels: res.result.alarmTypeList,
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
          this.series3=[1],
          this.chartOptions3={
            labels: ['无报警信息'],
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
    getDeviceTypeCountCharts(){
      this.loading = true;
      getDeviceTypeCountChartsData(this.searchForm).then(res => {
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

    getAlamCharts(){
      this.loading = true;
      getAlamChartsData(this.searchForm).then(res => {
      this.loading = false;
      if (res.success == true) {
        this.alarmTickAmount = parseInt(res.result.max);
        if(res.result.max<=10){
          this.alarmTickAmount = parseInt(res.result.max)+1;
          this.alarmMax = parseInt(res.result.max)+1;
        }else if(res.result.max<=50){
          if(res.result.max%5==0){
            this.alarmTickAmount = parseInt(res.result.max/5)+1;
            this.alarmMax =  Math.ceil(res.result.max/5)*5+5;
          }else{
            this.alarmTickAmount =  Math.ceil(res.result.max/5);
            this.alarmMax = Math.ceil(res.result.max/5)*5;
          }
        }else if(res.result.max <=100){
          if(res.result.max%10==0){
            this.alarmTickAmount = parseInt(res.result.max/10)+1;
            this.alarmMax = Math.ceil(res.result.max/10)*10+10;
          }else{
            this.alarmTickAmount = parseInt(res.result.max/10);
            this.alarmMax =  Math.ceil(res.result.max/10)*10;
          }
        }else{
          if(res.result.max%100==0){
            this.alarmTickAmount = parseInt(res.result.max/100)+1;
            this.alarmMax = Math.ceil(res.result.max/100)+100;
          }else{
            this.alarmTickAmount = parseInt(res.result.max/100);
            this.alarmMax = Math.ceil(res.result.max/100)*100;
          }  
        }
        this.series[0].data = res.result.countList;
        this.chartOptions= {
          chart: {
              height: 280,
              zoom: {
                  enabled: false
              },
              toolbar: {
                show: false
              }
          },
          colors: ['#fdb74a'],
          dataLabels: {
              enabled: false
          },
          stroke: {
              curve: 'straight'
          },
          grid: {
              row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
              },
          },
          xaxis: {
            categories: res.result.alamNameList,
          },
          yaxis: {
              tickAmount:this.alarmtickAmount,
              min: 0,
              max:  this.alarmMax,
              labels: {
                formatter: function(val, index) {
                  return parseInt(val);
                }
              }
            },
        }
      }
      });
    },

    getAlarmSummaryCountAll(){
       this.loading = true;
      getAlarmSummaryCountAllData(this.searchForm).then(res => {
      this.loading = false;
      if (res.success == true) {
        this.deviceAll = res.result.deviceAll;
        this.untreated = res.result.untreated;
        this.processed = res.result.processed;
        this.alarmCount = res.result.alarmCount;
        this.deviceStatusAll = res.result.deviceStatusAll;
      }
      });
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.selectCat = [];
      this.searchForm.categoryId = "";
      // 重新加载数据
      this.getDataList();
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order == "normal") {
        this.searchForm.order = "";
      }
      this.getDataList();
    },
    dropDown() {
      if (this.drop) {
        this.dropDownContent = "查找筛选";
        this.dropDownIcon = "ios-arrow-down";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "ios-arrow-up";
      }
      this.drop = !this.drop;
    },
    showSelect(e) {
      this.exportData = e;
      this.selectList = e;
      this.selectCount = e.length;
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    batchProcess(){
      let that = this;
      let statustrue= true;
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要处理的故障");
        return;
      }
      this.selectList.forEach(function(e) {
        if(e.status !='0'){
          that.$Message.warning("只能处理【未处理】的故障信息");
          statustrue = false;
        }
      });
      if(statustrue){
        this.$Modal.confirm({
        title: "确认处理",
        content: "您确认要处理所选的 " + this.selectCount + " 条数据?",
        onOk: () => {
            let ids = "";
            this.selectList.forEach(function(e) {
              ids += e.id + ",";
            });
            ids = ids.substring(0, ids.length - 1);
            // 批量删除
            this.operationLoading = true;
            this.deleteRequest("/deviceFault/batchProcess/" + ids).then(res => {
            this.operationLoading = false;
              if (res.success == true) {
                this.$Message.success("操作成功");
                this.clearSelectAll();
                this.getDataList();
                this.getDeviceFaultCharts();
              }
            });
          }
        });
      }
      
    },

    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          // 批量删除
          this.operationLoading = true;
          this.deleteRequest("/deviceFault/deleteByIds/" + ids).then(res => {
          this.operationLoading = false;
            if (res.success == true) {
              this.$Message.success("操作成功");
              this.clearSelectAll();
              this.getDataList();
              this.getDeviceFaultCharts();
            }
          });
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>