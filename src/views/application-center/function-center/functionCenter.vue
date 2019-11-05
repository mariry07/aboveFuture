<style lang="less">
@import "./functionCenter.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Col class="fault-echarts-wrp">
              <div id="fire-fault">
                <div class="fault-echarts-wrp">
                  <div class="fault-header">
                    <span><img src="@/assets/sbzs.png" alt="" title="设备总数" /> <span class="fault-count-wrp"><h4 class="fault-count">{{deviceFaultAll.deviceAll}}</h4><span class="fault-label">设备总数</span></span></span>
                    <span><img src="@/assets/wclgz.png" alt="" title="当前未处理故障" /> <span class="fault-count-wrp"><h4 class="fault-count">{{deviceFaultAll.untreatedAll}}</h4> <span class="fault-label">当前未处理故障</span></span></span>
                    <span><img src="@/assets/drcl.png" alt="" title="当日处理故障数" /> <span class="fault-count-wrp"><h4 class="fault-count">{{deviceFaultAll.handleAll}}</h4> <span class="fault-label">当日处理故障数</span></span></span>
                    <span><img src="@/assets/dycl.png" alt="" title="当月处理故障数" /> <span class="fault-count-wrp"><h4 class="fault-count">{{deviceFaultAll.monthAll}}</h4> <span class="fault-label">当月处理故障数</span></span></span>
                  </div> 
                  <div class="fault-echarts-tooltip">
                    <span class="fault-echarts-label">故障趋势图</span> 
                    <div>
                      <DatePicker
                        :open="open"
                        confirm
                        placement="bottom-end"
                        type="daterange"
                        @on-change="selectDateRange"
                        @on-clear="handleClear"
                        @on-ok="handleOk">
                        <a href="javascript:void(0)" @click="handleClick">
                            <Icon type="ios-calendar-outline"></Icon>
                        </a>
                      </DatePicker>
                    </div>
                  </div> 
                  <div id="chart" class="fault-echart">
                    <apexchart type=line height=100% :options="chartOptions" :series="series" />
                  </div>
                </div>
            </div>
          </Col>
        </Row>
        <Row class="operation">
           <div style="width:95%; float:left">
            <Button @click="batchProcess">批量处理</Button>
            <Button @click="delAll" icon="md-trash">删除</Button>
            <circleLoading v-if="operationLoading"/>
          </div>
          <div style="width:5%; float:left">
            <a class="drop-down" @click="dropDown">
              {{dropDownContent}}
              <Icon :type="dropDownIcon"></Icon>
            </a>
          </div>
        </Row>
          
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="100" class="search-form">
              <span v-if="drop">
                <Form-item label="故障发生时间">
                  <DatePicker
                    v-model="selectDate"
                    type="daterange"
                    format="yyyy-MM-dd"
                    clearable
                    @on-change="selectDateRange"
                    placeholder="选择起始时间"
                    style="width: 200px"
                  ></DatePicker>
                </Form-item>
                <Form-item label="设备名称" prop="deviceName">
                  <Input
                    type="text"
                    v-model="searchForm.deviceName"
                    placeholder="请输入"
                    clearable
                    style="width: 200px"
                  />
                </Form-item>
               <Form-item label="故障类型" prop="faultTypeName">
                  <Select
                      v-model="searchForm.faultTypeName"
                      placeholder="请选择"
                      clearable
                      style="width: 200px"
                    >
                      <Option value="">全部</Option>
                      <Option :value='"主机故障"'>主机故障</Option>
                      <Option :value='"电量不足"'>电量不足</Option>
                      <Option :value='"温度传感器故障"'>温度传感器故障</Option>
                      <Option :value='"压力传感器故障"'>压力传感器故障</Option>
                      <Option :value='"液位传感器故障"'>液位传感器故障</Option>
                    </Select>
                </Form-item>
                  <Form-item label="处理状态" prop="status">
                    <Select
                      v-model="searchForm.status"
                      placeholder="请选择"
                      clearable
                      style="width: 200px"
                    >
                      <Option value="">全部</Option>
                      <Option value="0">未处理</Option>
                      <Option value="1">已处理</Option>
                    </Select>
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
          <Row type="flex" justify="end" class="page">
            <Page
              :current="searchForm.pageNumber"
              :total="total"
              :page-size="searchForm.pageSize"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import {
  getDeviceFaultChartsData
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
      dropDownContent:"查找筛选", // 搜索展开标识文字
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
      maxmax:0,
      searchForm: {
        // 搜索框对应data对象
        deviceName: "", //主机名称 
        categoryId: "",
        status: "",
        faultTypeName:"",//故障类型
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
          name: "故障数量",
          data: []
      }],
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
          title: "设备名称",
          key: "deviceName",
          minWidth: 150,
          align: "center",
          fixed: "left"
        },
        {
          title: "设备编号",
          key: "deviceCode",
          minWidth: 120,
          maxWidth: 200,
          align: "center",
          fixed: "left"
        },
        {
          title: "故障类型",
          key: "faultTypeName",
          align: "center",
          width: 300,
          align: "center",
          fixed: "left"
        },
        {
          title: "地理位置",
          key: "position",
          minWidth: 150,
          align: "center",
          fixed: "left"
        },
        {
          title: "故障发生时间",
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
           //let re = "";
            if (params.row.status == 0) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "yellow"
                    }
                  },
                  "未处理"
                )
              ]);
              //re = "未处理";
            } else if (params.row.status == 1) {
               return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "green"
                    }
                  },
                  "已处理"
                )
              ]);
              //re = "已处理";
            }else if(params.row.status==3){
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "red"
                    }
                  },
                  "误报"
                )
              ]);
              //re ="误报";
            }
            //return h("div", re);
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
      this.getDataList();
      // 初始化搜索框级联分类数据
      this.initCategoryData();
      // 初始化编辑添加树形分类数据
      this.initCategoryForEdit();

      this.getDeviceFaultAll();

      this.getDeviceFaultCharts();


    },
    handleOk () {
      this.open = false;
      this.getDeviceFaultCharts();
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
    loadData(item, callback) {
      // 异步加载搜索框级联类别子节点数据
      // item.loading = true;
      // this.getRequest("请求路径，如/category/getByParentId/" + item.value).then(res => {
      //   item.loading = false;
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
      //       if (e.status == -1) {
      //         e.label = "[已禁用] " + e.label;
      //         e.disabled = true;
      //       }
      //     });
      //     item.children = res.result;
      //     callback();
      //   }
      // });
    },
    loadDataTree(item, callback) {
      // 异步加载编辑添加选择类别树子节点数据
      // this.getRequest("请求路径，如/category/getByParentId/" + item.id).then(res => {
      //   if (res.success == true) {
      //     res.result.forEach(function(e) {
      //       if (e.isParent) {
      //         e.loading = false;
      //         e.children = [];
      //       }
      //     });
      //     callback(res.result);
      //   }
      // });
    },
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
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    handleClear () {
        this.open = false;
    },
    getDataList() {
      // 多条件搜索获取表格数据
      this.loading = true;
      this.getRequest("/deviceFault/getByCondition", this.searchForm).then(res => {
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
    getDeviceFaultCharts() {
      this.loading = true;
      getDeviceFaultChartsData(this.searchForm).then(res => {
        this.loading = false;
        if (res.success == true) {
          this.series[0].data = res.result.deviceFaultChartsY;
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
          this.chartOptions = {
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
                categories: res.result.deviceFaultChartsX,
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
          }}
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
        this.dropDownContent ="查找筛选";
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
    },
    
  },
  mounted() {
    this.init();
  }
};
</script>