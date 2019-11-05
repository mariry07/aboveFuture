<style lang="less">
@import "./detailsHostConfig.less";
</style>
<template>
  <Row>
    <Card>
      <div style="margin-top: 10px;">
        <Button @click="handelCancel" icon="md-arrow-back">返回</Button>
        <span style="margin: 0px 20px; font-size: 24px; font-variant: bold; font-weight: 700;">主机名称：{{this.form.name}}</span>
        <span style="float:right; font-weight: 700; line-height:30px;">{{this.form.position}}</span>
      </div>
      <div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around; border-bottom:1px dashed #999;">
        <span>设备编号：<span style="color: #333;">{{this.form.code}}</span></span>
        <span>版本号：<span style="color: #333;">{{this.form.version}}</span></span>
         <span>添加时间：<span style="color: #333;">{{this.form.addTime}}</span></span>
         <span>更新时间：<span style="color: #333;">{{this.form.updateTime}}</span></span>
      </div>
      <div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around;"><span> 责任部门：<span style="color: #333;">{{this.form.companyName}}</span></span>
        <div> 责任人：<span class="height: 24px; padding: 0 8px; line-height: 22px; background-color: rgba(64,158,255,.1); padding: 0 10px; height: 32px; line-height: 30px; font-size: 12px; color: #409eff; border-radius: 4px; box-sizing: border-box; border: 1px solid rgba(64,158,255,.2); "><span style="color: #409eff;;" :title=this.form.chargePhone> {{this.form.chargeName}}</span><!----></span></div>
      </div>
      <Tabs :animated="false" @on-click="tabsName">
        <TabPane label="关联传感器" name= "name1">
          <div class="search">
            <Row class="operation">
              <div style="width:95%; float:left">
                <!-- <Button @click="batchProcess">批量处理</Button>
                <Button @click="delAll" icon="md-trash">删除</Button> -->
                <Button @click="batchEnable" icon="md-checkmark">启用</Button>
                <Button @click="batchDisabling" icon="md-close">禁用</Button>
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
              <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
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
                  <Form-item label="状态" prop="status">
                    <Select
                      v-model="searchForm.status"
                      placeholder="请选择"
                      clearable
                      style="width: 200px"
                    >
                       <Option value="">全部</Option>
                      <Option value="1">正常</Option>
                      <Option value="2">故障</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="传感器类型" prop="sensorTypeName">
                  <Select
                      v-model="searchForm.sensorTypeName"
                      placeholder="请选择"
                      clearable
                      style="width: 200px"
                    >
                       <Option value="">全部</Option>
                      <Option :value='"水压传感器"'>压力传感器</Option>
                      <Option :value='"液位传感器"'>液位传感器</Option>
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
                :data="sensorData"
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
                :total="sensorTotal"
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
          </div>
        </TabPane>
        <TabPane label="日志查看" name= "name2">
          <div class="search">
            <Row class="operation">
              <div style="width:95%; float:left">
                &nbsp;
              </div>
              <div style="width:5%; float:left">
                <a class="drop-down" @click="dropDown">
                  {{dropDownContent}}
                  <Icon :type="dropDownIcon"></Icon>
                </a>
              </div>
            </Row>
            <Row>
              <Form ref="sensorLogSearchForm" :model="sensorLogSearchForm" inline :label-width="90" class="search-form">
                <span v-if="drop">
                  <Form-item label="操作时间">
                    <DatePicker
                      v-model="selectSensorLogDate"
                      type="daterange"
                      format="yyyy-MM-dd"
                      clearable
                      @on-change="selectAlarmDateRange"
                      placeholder="选择起始时间"
                      style="width: 200px"
                    ></DatePicker>
                  </Form-item>
                <Form-item style="margin-left:-35px;" class="br">
                  <Button @click="sensorLogHandleSearch" type="primary" icon="ios-search">搜索</Button>
                  <Button @click="sensorLogHandleReset">重置</Button>
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
                :columns="sensorLogColumns"
                :data="sensorLogData"
                sortable="custom"
                @on-sort-change="sensorlogChangeSort"
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
                :current="sensorLogSearchForm.pageNumber"
                :total="sensorLogTotal"
                :page-size="sensorLogSearchForm.pageSize"
                @on-change="sensorLogChangePage"
                @on-page-size-change="sensorLogChangePageSize"
                :page-size-opts="[10,20,50]"
                size="small"
                show-total
                show-elevator
                show-sizer
              ></Page>
              
            </Row>
          </div>
        </TabPane>
        <TabPane label="报警历史" name= "name3">
         <div class="search">
            <Row>
              <div id="fire-alarm">
                <div class="alarm-echarts-wrp">
                  <div class="alarm-echarts-tooltip">
                    <span class="alarm-echarts-label">报警趋势图</span>
                     <div>
                      <DatePicker
                        :open="open"
                        placement="bottom-end"
                        confirm
                        type="daterange"
                        @on-change="selectAlarmDateRange"
                        @on-clear="handleAlarmClear"
                        @on-ok="handleAlarmOk">
                        <a href="javascript:void(0)" @click="handleClick">
                            <Icon type="ios-calendar-outline"></Icon>
                        </a>
                      </DatePicker>
                    </div>
                  </div> 
                  <div id="chart" class="alarm-echart" style="padding-right:24px;">
                    <apexchart type=line height=100% :options="alarmChartOptions" :series="alarmSeries" />
                  </div>
                </div>
            </div>
          </Row>
          <Row class="operation">
            <div style="width:95%; float:left">&nbsp;</div>
            <div style="width:5%; float:left">
              <a class="drop-down" @click="dropDown">
                {{dropDownContent}}
                <Icon :type="dropDownIcon"></Icon>
              </a>
            </div>
          </Row>
            <Row>
              <Form ref="alarmSearchForm" :model="alarmSearchForm" inline :label-width="90" class="search-form">
                <span v-if="drop">
                <Form-item label="报警类型" prop="alarmTypeName">
                  <Select
                    v-model="alarmSearchForm.alarmTypeName"
                    placeholder="请选择"
                    clearable
                    style="width: 200px"
                  >
                    <Option value="">全部</Option>
                    <Option :value='"水压报警"'>水压报警</Option>
                    <Option :value='"液位报警"'>液位报警</Option>
                    <Option :value='"温度报警"'>温度报警</Option>
                    <Option :value='"电量过低报警"'>电量过低报警</Option>
                  </Select>
                </Form-item>
                  <Form-item label="报警时间">
                    <DatePicker
                      v-model="selectAlarmDate"
                      type="daterange"
                      format="yyyy-MM-dd"
                      clearable
                      @on-change="selectAlarmDateRange"
                      placeholder="选择起始时间"
                      style="width: 200px"
                    ></DatePicker>
                  </Form-item>
                <Form-item style="margin-left:-35px;" class="br">
                  <Button @click="alarmHandleSearch" type="primary" icon="ios-search">搜索</Button>
                  <Button @click="alarmHandleReset">重置</Button>
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
                :columns="alarmColumns"
                :data="alarmData"
                sortable="custom"
                @on-sort-change="alarmChangeSort"
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
                :current="alarmSearchForm.pageNumber"
                :total="alarmTotal"
                :page-size="alarmSearchForm.pageSize"
                @on-change="alarmChangePage"
                @on-page-size-change="alarmChangePageSize"
                :page-size-opts="[10,20,50]"
                size="small"
                show-total
                show-elevator
                show-sizer
              ></Page>
            </Row>
          </div>
        </TabPane>
        <TabPane label="故障历史" name= "name4">
          <div class="search">
            <Row>
              <div id="fire-alarm">
                <div class="alarm-echarts-wrp">
                  <div class="alarm-echarts-tooltip">
                    <span class="alarm-echarts-label">故障趋势图</span>
                     <div>
                      <DatePicker
                        :open="open"
                        placement="bottom-end"
                        confirm
                        type="daterange"
                        @on-change="selectFaultDateRange"
                        @on-clear="handleFaultClear"
                        @on-ok="handleFaultOk">
                        <a href="javascript:void(0)" @click="handleClick">
                            <Icon type="ios-calendar-outline"></Icon>
                        </a>
                      </DatePicker>
                    </div>
                  </div> 
                  <div id="chart" class="alarm-echart" style="padding-right:24px;">
                    <apexchart type=line height=100% :options="faultChartOptions" :series="faultSeries" />
                  </div>
                </div>
            </div>
          </Row>
          <Row class="operation">
            <div style="width:95%; float:left">&nbsp;</div>
            <div style="width:5%; float:left">
              <a class="drop-down" @click="dropDown">
                {{dropDownContent}}
                <Icon :type="dropDownIcon"></Icon>
              </a>
            </div>
          </Row>
            <Row>
              <Form ref="faultSearchForm" :model="faultSearchForm" inline :label-width="90" class="search-form">
                <span v-if="drop">
                <Form-item label="故障类型" prop="faultTypeName">
                  <Select
                    v-model="faultSearchForm.faultTypeName"
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
                  <Form-item label="故障时间">
                    <DatePicker
                      v-model="selectFaultDate"
                      type="daterange"
                      format="yyyy-MM-dd"
                      clearable
                      @on-change="selectFaultDateRange"
                      placeholder="选择起始时间"
                      style="width: 200px"
                    ></DatePicker>
                  </Form-item>
                <Form-item style="margin-left:-35px;" class="br">
                  <Button @click="faultHandleSearch" type="primary" icon="ios-search">搜索</Button>
                  <Button @click="faultHandleReset">重置</Button>
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
                :columns="faultColumns"
                :data="faultData"
                sortable="custom"
                @on-sort-change="faultChangeSort"
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
                :current="faultSearchForm.pageNumber"
                :total="faultTotal"
                :page-size="faultSearchForm.pageSize"
                @on-change="faultChangePage"
                @on-page-size-change="faultChangePageSize"
                :page-size-opts="[10,20,50]"
                size="small"
                show-total
                show-elevator
                show-sizer
              ></Page>
            </Row>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </Row>
</template>

<script>
import {
  getAlamChartsData,
  getDeviceFaultChartsData

} from "@/api/index";
import circleLoading from "@/views/my-components/circle-loading.vue";
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
import { max } from 'date-fns';
export default {
  name: "details_hostConfig",
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
      deviceId:"",
      selectCat: [], // 搜索选择类别modal
      dataCat: [], // 编辑添加类别数据
      deviceFaultAll:[], //设备信息汇总
      maxtickAmount:10,
      alarmTickAmount:10,
      faultTickAmount:10,
      maxmax:0,
      alarmMax:0,
      faultMax:0,
      searchForm: {
        // 搜索框对应data对象
        deviceName: "", //主机名称
        deviceId:"",
        categoryId: "",
        status: "",
        sensorTypeName:"",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "addTime", // 默认排序字段
        order: "desc", // 默认排序方式
        startDate: "", // 起始时间
        endDate: "", // 终止时间
        delFlag: 0 //删除标记
      },
      
      sensorLogSearchForm:{
        deviceId:"",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "logTime", // 默认排序字段
        order: "desc", // 默认排序方式
        startDate: "", // 起始时间
        endDate: "", // 终止时间
        delFlag: 0 //删除标记
      },
      alarmSearchForm:{
        alarmTypeName:"",
        deviceId:"",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "addTime", // 默认排序字段
        order: "desc", // 默认排序方式
        startDate: "", // 起始时间
        endDate: "", // 终止时间
        delFlag: 0 //删除标记
      },
      faultSearchForm: {
        // 搜索框对应data对象
        deviceName: "", //主机名称 
        deviceId:"",
        categoryId: "",
        faultTypeName:"",
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
      selectAlarmDate: null, // 选择日期绑定modal
      selectFaultDate: null, // 选择日期绑定modal
      selectSensorLogDate: null, // 选择日期绑定modal
      form: {
        // 添加或编辑表单对象初始化数据
        type: 0,
        id:"",
        name:"",
        code:"",
        version:"",
        addTime:"",
        position:"",
        updateTime:"",
        companyId:"",
        companyName:"",
        chargeName:"",
        chargePhone:"",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
      },
      errorPass: "", // 密码错误提示
      formValidate: {
        // 表单验证规则
        name: [{ required: true, message: "不能为空", trigger: "blur" }]
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
          title: "监控点名称",
          key: "deviceName",
          minWidth: 150,
          align: "center",
          fixed: "left"
        },
        {
          title: "传感器类型",
          key: "sensorTypeName",
          minWidth: 120,
          align: "center",
          fixed: "left"
        },
        {
          title: "地理位置",
          key: "position",
          align: "center",
          minwidth: 150,
          align: "center",
          fixed: "left"
        },
        {
          title: "关联摄像头",
          key: "cameraId",
          align: "center",
          minwidth: 150,
          align: "center",
          fixed: "left",
          render: (h, params) => {
            return h("div", [
              h(
                "Tag",
                {
                  props: {
                    color: "gray"
                  }
                },
                "未知"
              )
            ]);
          }
        },
        {
          title: "处理状态",
          key: "runningState",
          align: "center",
          width: 100,
          fixed: "left",
          render: (h, params) => {
            //let re = "";
            if (params.row.status == 2) {
               return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "gray"
                    }
                  },
                  "离线"
                )
              ]);
            }else{
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "blue"
                    }
                  },
                  "正常"
                )
              ]);
            }

            //return h("div", re);
          }
        },
        // {
        //   title: "操作",
        //   key: "action",
        //   width: 200,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             type: "primary",
        //             size: "small",
        //             icon: "ios-create-outline"
        //           },
        //           style: {
        //             marginRight: "5px"
        //           },
        //           on: {
        //             click: () => {
        //               this.edit(params.row);
        //             }
        //           }
        //         },
        //         "编辑"
        //       ),
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             size: "small",
        //             icon: "ios-log-in"
        //           },
        //           on: {
        //             click: () => {
        //               this.details(params.row);
        //             }
        //           }
        //         },
        //         "详情"
        //       )
        //     ]);
        //   }
        // }
      ],
      sensorLogColumns: [
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
          title: "主机编号",
          key: "deviceId",
          minWidth: 150,
          align: "center",
          fixed: "left"
        },
        {
          title: "操作内容",
          key: "logData",
          minWidth: 120,
          align: "center",
          fixed: "left"
        },
        {
          title: "操作时间",
          key: "logTime",
          align: "center",
          minwidth: 150,
          align: "center",
          fixed: "left"
        }
      ],
      sensorLogData:[],
      alarmColumns: [
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
          minWidth: 200,
          align: "center",
          fixed: "left"
        },
        {
          title: "报警类型",
          key: "alarmTypeName",
          minWidth: 120,
          align: "center",
          fixed: "left"
        },
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
          minWidth: 180,
          fixed: "left"
        },
        {
          title: "处理状态",
          key: "status",
          align: "center",
          minWidth: 100,
          fixed: "left",
          render: (h, params) => {
            let re = "";
            if (params.row.status == 0) {
              return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      //alert(params.row.id);
                      //this.edit(params.row);
                    }
                  }
                },
                "未处理"
              )
            ]);
            } else if (params.row.status == 1) {
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
                      //alert(params.row.id);
                      //this.edit(params.row);
                    }
                  }
                },
                "已处理"
              )
            ]);
            }
            return h("div", re);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          sortType: "desc",
          width: 200,
          fixed: "left",
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
      faultColumns: [
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
          minWidth: 450,
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
      submitLoading: false, // 添加或编辑提交状态
      data: [], // 表单数据
      sensorData: [], //关联传感器列表
      exportData: [], // 导出数据
      total: 0, // 表单数据总数
      alarmTotal: 0, // 表单数据总数
      faultTotal: 0, // 表单数据总数
      sensorTotal: 0,
      sensorLogTotal: 0,
      alarmChartOptions: {
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
      alarmSeries: [{
          name: "报警数量",
          data: []
      }],
      faultChartOptions: {
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
      faultSeries: [{
          name: "故障数量",
          data: []
      }],
      alarmData: [],
      faultData: [],

    };
  },
  methods: {
    init() {
      this.type = this.$route.query.type;
      this.backRoute = this.$route.query.backRoute;
      if (this.type == 1) {
        this.form.deviceId = this.$route.query.id;
        this.deviceId = this.$route.query.id;
        this.searchForm.deviceId = this.$route.query.id;
        this.alarmSearchForm.deviceId = this.$route.query.id;
        this.faultSearchForm.deviceId = this.$route.query.id;
        this.sensorLogSearchForm.deviceId = this.$route.query.id;
        this.form.name = this.$route.query.name;
        this.form.code = this.$route.query.code;
        if(this.$route.query.version =='1002'){
          this.form.version = "3.0(电科用水主机)";
        }
        this.form.addTime = this.$route.query.addTime;
        this.form.position = this.$route.query.position;
        this.form.updateTime = this.$route.query.updateTime;
        if(this.$route.query.companyId =='1001'){
          this.form.companyName = "中国电科";
        }
        this.form.chargeName = this.$route.query.chargeName;
        this.form.chargePhone ="电话：" + this.$route.query.chargePhone;
      }
      this.getSensorDataList();
      this.getAlarmDataList();
      this.getFaultDataList();
      this.getAlamCharts();
      this.getDeviceFaultCharts();
      this.getSensorLogDataList();
    },
    handleOk () {
      this.open = false;
    },
    handleAlarmOk () {
      this.open = false;
      this.getAlamCharts();
    },
    handleFaultOk () {
      this.open = false;
      this.getAlamCharts();
    },
    handleClick () {
        this.open = !this.open;
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getSensorDataList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getSensorDataList();
    },
    sensorLogChangeSize(v) {
      this.sensorLogSearchForm.pageSize = v;
      this.getSensorLogDataList();
    },
    sensorLogChangePage(v) {
      this.sensorLogSearchForm.pageNumber = v;
      this.getSensorLogDataList();
      this.clearSelectAll();
    },
    
    alarmChangePage(v) {
      this.alarmSearchForm.pageNumber = v;
      this.getAlarmDataList();
      this.clearSelectAll();
    },
    alarmChangePageSize(v) {
      this.alarmSearchForm.pageSize = v;
      this.getAlarmDataList();
    },

    faultChangePage(v) {
      this.faultSearchForm.pageNumber = v;
      this.getFaultDataList();
      this.clearSelectAll();
    },
    faultChangePageSize(v) {
      alert(v)
      this.faultSearchForm.pageSize = v;
      this.getFaultDataList();
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    selectAlarmDateRange(v) {
      if (v) {
        this.alarmSearchForm.startDate = v[0];
        this.alarmSearchForm.endDate = v[1];
      }
    },
    selectFaultDateRange(v) {
      if (v) {
        this.faultSearchForm.startDate = v[0];
        this.faultSearchForm.endDate = v[1];
      }
    },
    selectSensorLogDateRange(v) {
      if (v) {
        this.sensorLogSearchForm.startDate = v[0];
        this.sensorLogSearchForm.endDate = v[1];
      }
    },
    andleAlarmClear () {
        this.open = false;
    },
    handleAlarmClear () {
      this.open = false;
    },
    handleFaultClear () {
      this.open = false;
    },


    getSensorDataList() {
      // 多条件搜索获取表格数据
      this.loading = true;
      this.getRequest("/sensor/getByConditionList", this.searchForm).then(res => {
        this.loading = false;
        if (res.success == true) {
          this.sensorData = res.result.sensorList;
          this.sensorTotal = res.result.sensorListCount;
        }
      });
      this.exportData = this.sensorData;
      this.sensorTotal = this.sensorData.length;
      this.loading = false;
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getSensorDataList();
    },
    alarmHandleSearch() {
      this.alarmSearchForm.pageNumber = 1;
      this.alarmSearchForm.pageSize = 10;
      this.getAlarmDataList();
    },
    faultHandleSearch() {
      this.faultSearchForm.pageNumber = 1;
      this.faultSearchForm.pageSize = 10;
      this.getFaultDataList();
    },
    
    sensorLogHandleSearch() {
      this.sensorLogSearchForm.pageNumber = 1;
      this.sensorLogSearchForm.pageSize = 10;
      this.getSensorLogDataList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      this.searchForm.categoryId = "";
      this.searchForm.deviceId = this.deviceId;
      // 重新加载数据
      this.getSensorDataList();
    },
    
    sensorLogHandleReset() {
      this.$refs.sensorLogSearchForm.resetFields();
      this.sensorLogSearchForm.pageNumber = 1;
      this.sensorLogSearchForm.pageSize = 10;
      this.selectSensorLogDate = null;
      this.sensorLogSearchForm.startDate = "";
      this.sensorLogSearchForm.endDate = "";
      //this.sensorLogSearchForm = [];
      this.sensorLogSearchForm.deviceId = this.deviceId;
      // 重新加载数据
      this.getSensorLogDataList();
    },
    alarmHandleReset() {
      this.$refs.alarmSearchForm.resetFields();
      this.alarmSearchForm.pageNumber = 1;
      this.alarmSearchForm.pageSize = 10;
      this.selectAlarmDate = null;
      this.alarmSearchForm.startDate = "";
      this.alarmSearchForm.endDate = "";
      //this.alarmSearchForm = [];
      this.alarmSearchForm.categoryId = "";
      this.alarmSearchForm.deviceId = this.deviceId;
      // 重新加载数据
      this.getAlarmDataList();
    },
    faultHandleReset() {
      this.$refs.faultSearchForm.resetFields();
      this.faultSearchForm.pageNumber = 1;
      this.faultSearchForm.pageSize = 10;
      this.selectFaultDate = null;
      this.faultSearchForm.startDate = "";
      this.faultSearchForm.endDate = "";
      //this.faultSearchForm = [];
      this.faultSearchForm.categoryId = "";
      this.faultSearchForm.deviceId = this.deviceId;
      // 重新加载数据
      this.getFaultDataList();
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order == "normal") {
        this.searchForm.order = "";
      }
      // 重新加载数据
      this.getAlarmDataList();
    },
    
    sensorlogChangeSort(e) {
      this.sensorLogSearchForm.sort = e.key;
      this.sensorLogSearchForm.order = e.order;
      if (e.order == "normal") {
        this.sensorLogSearchForm.order = "";
      }
      this.getSensorLogDataList();
    },
    alarmChangeSort(e) {
      this.alarmSearchForm.sort = e.key;
      this.alarmSearchForm.order = e.order;
      if (e.order == "normal") {
        this.alarmSearchForm.order = "";
      }
      this.getAlarmDataList();
    },
    faultChangeSort(e) {
      this.faultSearchForm.sort = e.key;
      this.faultSearchForm.order = e.order;
      if (e.order == "normal") {
        this.faultSearchForm.order = "";
      }
      this.getFaultDataList();
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
    batchEnable(){
      let that = this;
      let statustrue= true;
      if (this.selectCount <= 0) {
        that.$Message.warning("您还未选择要启用的传感器");
        return;
      }
      this.selectList.forEach(function(e) {
        if(e.disable !=1){
          that.$Message.warning("只能启用状态【禁用】的传感器");
          statustrue = false;
        }
      });
      if(statustrue){
        this.$Modal.confirm({
        title: "启用",
        content: "您确认要启用所选的 " + this.selectCount + " 个传感器?",
        onOk: () => {
            let ids = "";
            this.selectList.forEach(function(e) {
              ids += e.id + ",";
            });
            ids = ids.substring(0, ids.length - 1);
            // 批量处理
            this.operationLoading = true;
            this.deleteRequest("/sensor/batchEnable/" + ids).then(res => {
            this.operationLoading = false;
              if (res.success == true) {
                this.$Message.success("操作成功");
                this.clearSelectAll();
                this.getSensorDataList();
              }
            });
          }
        });
      }

    },

    batchDisabling() {
      let that = this;
      if (this.selectCount <= 0) {
        that.$Message.warning("您还未选择要禁用的传感器");
        return;
      }
      this.selectList.forEach(function(e) {
        if(e.disable !=0){
          that.$Message.warning("只能禁用状态【启用】的传感器");
          statustrue = false;
        }
      });
      this.$Modal.confirm({
        title: "确认禁用",
        content: "您确认要禁用所选的 " + this.selectCount + " 个传感器?",
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          // 批量删除
          this.operationLoading = true;
          this.deleteRequest("/sensor/batchDisabling/" + ids).then(res => {
          this.operationLoading = false;
            if (res.success == true) {
              this.$Message.success("操作成功");
              this.clearSelectAll();
              this.getSensorDataList();
            }
          });
        }
      });
    },
    handelCancel() {
      this.closeCurrentPage();
    },

    getAlamCharts(){
      this.loading = true;
      getAlamChartsData(this.alarmSearchForm).then(res => {
      this.loading = false;
      if (res.success == true) {
        this.alarmSeries[0].data = res.result.countList;
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
        this.alarmChartOptions= {
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
            tickAmount:this.alarmTickAmount,
            min: 0,
            max: this.alarmMax,
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
    getAlarmDataList() {
      // 多条件搜索获取表格数据
      this.loading = true;
      this.getRequest("/serverAlarm/getByCondition", this.alarmSearchForm).then(res => {
        this.loading = false;
        if (res.success == true) {
          this.alarmData = res.result.content;
          this.alarmTotal = res.result.totalElements;
        }
      });
      this.exportData = this.alarmData;
      //this.alarmData = this.alarmData.length;
      this.loading = false;
    },
    getSensorLogDataList() {
      // 多条件搜索获取表格数据
      this.loading = true;
      this.getRequest("/sensorLog/getByCondition", this.sensorLogSearchForm).then(res => {
        this.loading = false;
        if (res.success == true) {
          this.sensorLogData = res.result.content;
          this.sensorLogTotal = res.result.totalElements;
        }
      });
      this.exportData = this.sensorLogData;
      //this.sensorLogData = this.sensorLogData.length;
      this.loading = false;
    },
    getDeviceFaultCharts() {
      this.loading = true;
      getDeviceFaultChartsData(this.faultSearchForm).then(res => {
        this.loading = false;
        if (res.success == true) {
          this.faultSeries[0].data = res.result.deviceFaultChartsY;
          this.faultTickAmount = parseInt(res.result.max);
          if(res.result.max<=10){
            this.faultTickAmount = parseInt(res.result.max)+1;
            this.faultMax = parseInt(res.result.max)+1;
          }else if(res.result.max<=50){
            if(res.result.max%5==0){
              this.faultTickAmount = parseInt(res.result.max/5)+1;
              this.faultMax =  Math.ceil(res.result.max/5)*5+5;
            }else{
              this.faultTickAmount =  Math.ceil(res.result.max/5);
              this.faultMax = Math.ceil(res.result.max/5)*5;
            }
          }else if(res.result.max <=100){
            if(res.result.max%10==0){
              this.faultTickAmount = parseInt(res.result.max/10)+1;
              this.faultMax = Math.ceil(res.result.max/10)*10+10;
            }else{
              this.faultTickAmount = parseInt(res.result.max/10);
              this.faultMax =  Math.ceil(res.result.max/10)*10;
            }
          }else{
            if(res.result.max%100==0){
              this.faultTickAmount = parseInt(res.result.max/100)+1;
              this.faultMax = Math.ceil(res.result.max/100)+100;
            }else{
              this.faultTickAmount = parseInt(res.result.max/100);
              this.faultMax = Math.ceil(res.result.max/100)*100;
            }  
          }
          this.faultChartOptions = {
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
                tickAmount:this.faultTickAmount,
                min: 0,
                max:  this.faultMax,
                labels: {
                  formatter: function(val, index) {
                    return parseInt(val);
                  }
                }
              }
          }}
      });
    },
    getFaultDataList() {
      // 多条件搜索获取表格数据
      this.loading = true;
      this.getRequest("/deviceFault/getByCondition", this.faultSearchForm).then(res => {
        this.loading = false;
        if (res.success == true) {
          this.faultData = res.result.content;
          this.faultTotal = res.result.totalElements;
        }
      });
      this.exportData = this.faultData;
     // this.faultData = this.faultData.length;
      this.loading = false;
    },
    tabsName(v){
      if(v == 'name1'){
         this.getSensorDataList();
      }
      if(v == 'name2'){
         this.getSensorLogDataList();
      }
      if(v == 'name3'){
         this.getAlamCharts();
         this.getAlarmDataList();
      }
      if(v == 'name4'){
         this.getFaultDataList();
         this.getDeviceFaultCharts();
      }
    },
    // 关闭当前页面
    closeCurrentPage() {
      this.$store.commit("removeTag", "details_hostConfig");
      localStorage.pageOpenedList = JSON.stringify(
        this.$store.state.app.pageOpenedList
      );
      this.$router.push({
        name: this.backRoute
      });
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      if (to.name == "details_hostConfig") {
        this.type = this.$route.query.type;
        if (this.type == 1) {
          this.form.deviceId = this.$route.query.id;
          this.deviceId = this.$route.query.id;
          this.searchForm.deviceId = this.$route.query.id;
          this.alarmSearchForm.deviceId = this.$route.query.id;
          this.faultSearchForm.deviceId = this.$route.query.id;
          this.sensorLogSearchForm.deviceId = this.$route.query.id;
          this.form.name = this.$route.query.name;
          this.form.code = this.$route.query.code;
          
          if(this.$route.query.version =='1002'){
            this.form.version = "3.0(电科用水主机)";
          }
          this.form.addTime = this.$route.query.addTime;
          this.form.position = this.$route.query.position;
          this.form.updateTime = this.$route.query.updateTime;
          if(this.$route.query.companyId =='1001'){
            this.form.companyName = "中国电科";
          }
          this.form.chargeName = this.$route.query.chargeName;
          this.form.chargePhone ="电话：" + this.$route.query.chargePhone;
          //this.getData();
          this.getSensorDataList();
          this.getAlarmDataList();
          this.getFaultDataList();
          this.getAlamCharts();
          this.getDeviceFaultCharts();
          this.getSensorLogDataList()
        }
      }
    }
  }
};
</script>