<style lang="less">
@import "./firehost.less";
</style>

<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <!-- Tab页相关代码 -->
            <Tabs :animated="false" >
                <TabPane label="无线烟感主机" name= "name1">
                     <Row class="operation">
                      <div style="width:95%; float:left"> 
                        <Button @click="add" type="primary" icon="md-add">添加</Button>
                        <Button @click="delAll" icon="md-trash">删除</Button>
                        <Button @click="batchDisabling" icon="md-close">禁用</Button>
                        <Button @click="batchEnable" icon="md-checkmark">启用</Button>
                        <circleLoading v-if="operationLoading"/>
                      </div>
         
                      <div style="width:5%;  float:left"> <!-- 筛选查询按钮 -->
                        <a class="drop-down" @click="dropDown">
                          {{dropDownContent}}
                          <Icon :type="dropDownIcon"></Icon>
                        </a>
                      </div>
                      </Row>

              <Row><!-- 筛选查询表单相关代码 -->
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <span v-if="drop">
              <Form-item label="设备名称" prop="name">
                <Input
                  type="text"
                  v-model="searchForm.name"
                  placeholder="请输入"
                  clearable
                  style="width: 200px"
                />
              </Form-item>
               <Form-item label="设备编号" prop="code">
                <Input
                  type="text"
                  v-model="searchForm.code"
                  placeholder="请输入"
                  clearable
                  style="width: 200px"
                />
              </Form-item>
              <Form-item label="运行状态" prop="status">
                    <Select
                      v-model="searchForm.status"
                      placeholder="请选择"
                      clearable
                      style="width: 200px"
                    >
                      <Option v-for="(item, i) in dictPlanType" :key="i" :value="item.value">{{item.title}}</Option>
                    </Select>
                  </Form-item>
              
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset">重置</Button>
              </Form-item>
              <!-- 展开更多下拉列表 -->
              <!-- <div style="width:5%; margin:0 auto;">
                <a class="drop-down" @click="NextdropDown">
                          {{NextdropDownContent}}
                          <Icon :type="NextdropDownIcon"></Icon>
                </a>
              </div> -->
              </span>
              <!-- <span v-if="Nextdrop"> -->
                 <!-- <div style="width:15%; float:left;">
                <Form-item label="地理位置" prop="name">
                    <RadioGroup >
                        <span @click="show0()">
                        <Radio label="全部">
                            全部
                        </Radio>
                        </span>
                        <span @click="show1()">
                          <Radio label="室内" >
                            室内
                        </Radio>
                        </span>
                         <span @click="show2()">
                        <Radio label="室外" >
                            室外
                        </Radio>
                         </span>
                    </RadioGroup>
                </Form-item>
                  </div> -->

                  <!-- <div style="width:85%; float:left;"> -->
                      <!-- 点击室内单选框显示 -->
                    <!-- <span v-if="indoorStatus2">
                      <Select style="width:150px" v-model="hostConfigForm.companyId"  placeholder="请选择企业部门">
                      <Option value="1001">中国电科</Option>
                      </Select>
                    </span> -->
                      <!-- 点击室外单选框显示 -->
                      <!-- <span v-if="outdoorStatus2">
                    
                    </span> -->
                  <!-- </div> -->
            
              <!-- </span> -->
              <!-- 展开更多下拉列表 -->
            </Form>
          </Row>

            <Row>
            <Alert show-icon>
              已选择
              <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          
          <Row> <!-- Table表格相关代码 -->
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

          <Row type="flex" justify="end" class="page"> <!-- 分页相关代码 -->
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

                </TabPane>
                
                <TabPane label="用户传输装置" icon="md-alert" name= "name2">
                  <transport-host/>
                </TabPane>
                <TabPane label="物联中继主机" icon="md-alert" name= "name3" >
                  <middle-host/>
                </TabPane>
                <TabPane label="无线手报主机" icon="md-alert" name= "name4" >
                  <wireless-host/>
                </TabPane>
            </Tabs>
        </Card>
      </Col>
    </Row>

      <!-- Iview显示对话框的组件   -->
    <Modal 
      :title="modalTitle"
      v-model="hostConfigModelValidate"
      :mask-closable="false"
      :width="700"
      :styles="{top: '30px'}"
    >
    <!-- 编辑按钮对应的Form表单 -->
      <Form ref="hostConfigForm" :model="hostConfigForm" :label-width="90" :rules="hostConfigFormValidate">

        <div style="width:100%; float:left;">
          <div style="width:50%; float:left;">
            <h2 style="height:40px;">基本信息</h2>
            <FormItem label="主机名称:" prop="name">
              <Input  autocomplete="off" v-model="hostConfigForm.name"/>
            </FormItem>
            <FormItem label="版本号:" prop="version">
              <Select v-model="hostConfigForm.version" disabled  placeholder="请选择">
                <Option :value='"1002"'>3.0(电科用水主机)</Option>
              </Select>
            </FormItem>
            <FormItem label="SIM卡ID:" prop="sim">
              <Input  v-model="hostConfigForm.sim" autocomplete="off"/>
            </FormItem>
            <h2 style="height:40px;">负责人</h2>
            <FormItem label="负责人:" prop="chargeName">
              <Input  autocomplete="off" v-model="hostConfigForm.chargeName"/>
            </FormItem>
            <h2 style="height:40px;">参数配置</h2>
            <h2 style="height:40px;">地图配置</h2>
            <FormItem label="地理环境选择:" prop="outdoor" label-width="100" style="margin-left:20px;">
              <RadioGroup v-model="hostConfigForm.outdoor" size="large" style="height:50px;">
                <!-- <span>地理环境选择:&nbsp;&nbsp;</span> -->
                <span @click="indoorclick()"><Radio :key="0" :label="0">室内</Radio></span>
                <span @click="outdoorclick()"><Radio :key="1" :label="1">室外</Radio></span>
              </RadioGroup>
            </FormItem>
          </div>
          <div style="width:50%; float:left;">
            <h2 style="height:40px;"></h2>
            <FormItem label="主机类型:" prop="deviceType">
              <Select v-model="hostConfigForm.deviceType" disabled  placeholder="请选择">
                <Option :value="1001">无线烟感主机</Option>
                <Option :value="1002">消防用水主机</Option>
              </Select>
            </FormItem>
            <FormItem label="主机编号:" prop="code">
              <Input  autocomplete="off"  v-model="hostConfigForm.code"/>
            </FormItem>
            <div style="height:58px;"></div>
            <h2 style="height:40px;"></h2>
            <FormItem label="联系方式:" prop="chargePhone">
              <Input  autocomplete="off"  v-model="hostConfigForm.chargePhone"/>
            </FormItem>
            <h2 style="height:40px;"></h2>
            <h2 style="height:40px;"></h2>
          </div>
        </div>
        <div  style="width:100%; height:450px;"></div>
        <div v-if="indoorStatus" style="width:100%; height:50px;">
          <FormItem label="楼层选择" prop="parentTitleId" style="width:200px; float:left">
            <Select v-model="hostConfigForm.parentTitleId" @on-change="selectFloorList" placeholder="请选择建筑">
                <Option v-for="(item,index) in floorList" :value="item.id" :key="index" :label="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem prop="floorId" label-width="5" style="width:300px; float:left">
            <Select v-model="hostConfigForm.floorId"  @on-change="selectFloorTwo" placeholder="请选择楼层" >
              <Option v-for="(item,index) in title" :value="item.id" :key="index" :label="item.name" >{{item.name}}</Option>
            </Select>
          </FormItem>
        </div>
        <div v-if="indoorStatus" style="width:100%; height:25px;"></div>
        <FormItem v-if="indoorStatus" label="详细地址:" prop="position" >
          <Input v-model="hostConfigForm.position" disabled style="width: 80%"/>
        </FormItem>
        <div v-if="indoorStatus" style="width:60%; height:50px;">
          <FormItem label="摄像头:" prop="cameraId">
            <Select v-model="hostConfigForm.cameraId"  placeholder="请选择摄像头">
              <Option :value="1">无摄像头可选</Option>
            </Select>
          </FormItem>
        </div>
        <div v-if="indoorStatus"  style="width:100%; height:400px;">
          <!--<img src="../../../assets/bg.png" alt="alt" style="width:100%; height:400px;">-->
          <img :src=imagePath alt="alt" style="width:100%; height:400px;">
        </div>
        <div v-if="outdoorStatus">
          <div style="width:100%; height:50px;">
            <FormItem label="企业部门:" prop="companyId" style="width:50%">
              <Select v-model="hostConfigForm.companyId"  placeholder="请选择企业部门">
                <Option value="1001">中国电科</Option>
              </Select>
            </FormItem>
          </div>
          <div style="width:100%; height:25px;"></div>
          <FormItem label="省市区选择:">
            <div style="text-align: left;">
              省：<select id="province" style="width: 130px; height: 30px; border: 1px solid #ccc" @change="search"></select>
              市：<select id="city" style="width: 130px; height: 30px; border: 1px solid #ccc" @change="search"></select>
              区：<select id="district" style="width: 130px; height: 30px; border: 1px solid #ccc" @change="search"></select>
            </div>
          </FormItem>
          <div style="width:60%; height:50px;">
            <FormItem label="详细地址:"  prop="">
              <Input v-model="deAddr" @keyup.enter.native="makeDetailAddress" style="width: 80%"/>
            </FormItem>
          </div>
          <div  id="homeAmap" style="width:100%; height:400px;">
          </div>
        </div>


      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelHostConfig">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitHostConfig">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  //引入添加设备 编译设备到后端的执行方法的路径
  addDevice,
  editDevice,
  getDictDataByType
} from "@/api/index";
import circleLoading from "@/views/my-components/circle-loading.vue";
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
import { max } from 'date-fns';
// 引入高德地图
import AMap from "AMap";

//引入其他TabPane页面
import transportHost from "./transportHost.vue";
import middleHost from "./middleHost.vue";
import wirelessHost from "./wirelessHost.vue";

export default {
  name: "host-config",
  components: {
    circleLoading,
    uploadPicInput,
    'transport-host':transportHost,
    'middle-host':middleHost,
    'wireless-host':wirelessHost,
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度不得小于6位"));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      var reg2 = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[358]\d{9})$)/;
      if (!reg.test(value) && !reg2.test(value)) {
        callback(new Error("请填写11位手机号或座机号（座机号以 - 分割）"));
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
      Nextdrop:false,// 展开更多
      dropDownContent: "查找筛选", // 搜索展开标识文字
      dropDownIcon: "ios-arrow-down", //搜索展开图标
      NextdropDownContent:"展开更多",
      NextdropDownIcon:"ios-arrow-down",
      selectCount: 0, // 多选计数
      selectList: [], // 多选数据
      viewImage: false, // 图片预览标识
      dictPlanType: [], //巡查设备状态数据字典
      modalTitle: "",
      modalType: 0,
      hostConfigModelValidate: false,
      indoorStatus:true,
      indoorStatus2:false,
      outdoorStatus:false,
      outdoorStatus2:false,
      category: [
        // 搜索类别数据
      ],
      selectCat: [], // 搜索选择类别modal
      dataCat: [], // 编辑添加类别数据
      searchForm: {
        // 搜索框对应data对象
        name: "", //主机名称
        code:"",
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
      hostConfigForm: {
        // 添加或编辑表单对象初始化数据
        status:0,
        deviceType:1002,
        parentTitleId:"",
        title:"",
        floorId:"",
        name:"",
        code:"",
        position:"",
        version:"1002",
        sim:"",
        chargeName:"",
        chargePhone:"",
        outdoor:0,
        cameraId:"",
        companyId:"1001",
        posX:"",
        posY:"",
        runningState:"2",
        systemType:"11",
      },
      errorPass: "", // 密码错误提示
      hostConfigFormValidate: {
        name: [
          { required: true, message: "主机名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "主机编号不能为空", trigger: "blur" },
        ],

         parentTitleId: [
          { required: true, message: "请选择建筑", trigger: "blur" }
        ],
        floorId: [
          { required: true, message: "请选择楼层", trigger: "blur" }
        ],
        chargeName: [
          { required: true, message: "负责人不能为空", trigger: "blur" }
        ],
        chargePhone: [
          { required: true, message: "联系方式不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ],
        companyId: [
          { required: true, message: "请选择公司", trigger: "blur" }
        ]
      },
      submitLoading: false, // 添加或编辑提交状态
      //下面这一堆不知道是干啥的~
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
      //上面这一堆不知道是干啥的~

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
          fixed: "left",

        },
        {
          title: "主机名称",
          key: "name",
          minWidth: 150,
          align: "center",
          fixed: "left",

        },
        {
          title: "主机编号",
          key: "code",
          minWidth: 120,
          maxWidth: 200,
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
         title: "传感器",
         key: "alarmCount",
         minWidth: 150,
         align: "center",
         fixed: "left"
        },
        {
          title: "主机状态",
          key: "runningState",
          align: "center",
          width: 100,
          fixed: "left",
          render: (h, params) => {
            //let re = "";
            if (params.row.runningState == 0) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "yellow"
                    }
                  },
                  "未激活"
                )
              ]);
            } else if (params.row.runningState == 1) {
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
            }else if(params.row.runningState ==2){
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
            }else if(params.row.runningState == 3){
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "red"
                    }
                  },
                  "故障"
                )
              ]);
            }else if(params.row.runningState == 4){
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "orange"
                    }
                  },
                  "报警"
                )
              ]);
            }
            else if(params.row.runningState ==5){
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      color: "gray"
                    }
                  },
                  "禁用"
                )
              ]);
            }
            //return h("div", re);
          }
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
          title: "蜂鸣器",
          key: "status",
          align: "center",
          width: 100,
        },

        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    icon: "ios-create-outline",
                    disabled:params.row.runningState === '5'
                  },
                  style: {
                    marginRight: "5px",
                    disabled:true
                  },
                  on: {
                    click: () => {
                      this.edit(params.row);
                    }
                  },
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small",
                    icon: "ios-log-in",
                    disabled:params.row.runningState === '5'
                  },
                  on: {
                    click: () => {
                      this.details(params.row);
                    }
                  }
                },
                "详情"
              )
            ]);
          }
        }
      ],
      data: [], // 表单数据
      exportData: [], // 导出数据
      total: 0, // 表单数据总数
      floorList: [],
      title:[],
      map: null,
      polygons: [],
      district: null,
      deAddr:'',
      pcdAddress:[],
      //currentAcode:'010'
      imagePath:""
    };
  },
  methods: {
    init() {
      this.getDataList();
      // 初始化搜索框级联分类数据
      this.initCategoryData();
      // 初始化编辑添加树形分类数据
      this.initCategoryForEdit();

      this.getFloorDataList();
      this.getDictPermissions();
    },

    //数据字典 获取社备类型
    getDictPermissions() {
      getDictDataByType("patrol_device_status").then(res => {
        if (res.success) {
          this.dictPlanType = res.result;
        }
      });
    },
    handleOk () {
      this.open = false;
    },
    handleClick () {
        this.open = !this.open;
    },

    initCategoryData() {
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
    getDataList() {
      // 多条件搜索获取表格数据
      this.loading = true;
      this.getRequest("/device/getByCondition", this.searchForm).then(res => {
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
    NextdropDown(){
      if (this.Nextdrop) {
        this.NextdropDownContent = "展开更多";
        this.NextdropDownIcon = "ios-arrow-down";
      } else {
        this.NextdropDownContent = "收起更多";
        this.NextdropDownIcon = "ios-arrow-up";
      }
      this.Nextdrop = !this.Nextdrop;
    },
    // show0(){
    //   this.indoorStatus2 = false;
    //   this.outdoorStatus2 = false;
    // },
    // show1(){
    //   this.indoorStatus2 = true;
    //   this.outdoorStatus2 = false;
    // },
    // show2(){
    //   this.outdoorStatus2= true;
    //   this.indoorStatus2 = false;
    // },
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
          this.deleteRequest("/device/deleteByIds/" + ids).then(res => {
          this.operationLoading = false;
            if (res.success == true) {
              this.$Message.success("操作成功");
              this.clearSelectAll();
              this.getDataList();
            }
          });
        }
      });
    },
    add() {
      this.modalType = 0;
      this.modalTitle = "添加主机";
      this.$refs.hostConfigForm.resetFields();
      this.indoorStatus = true;
      this.outdoorStatus = false;
      this.hostConfigForm.position="";
      this.title=[];

      this.hostConfigModelValidate = true;
    },
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "编辑用户";
      this.$refs.hostConfigForm.resetFields();
      // 转换null为""
      for (let attr in v) {
        if (v[attr] == null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let data = JSON.parse(str);
      if(data.outdoor == 0){
        this.indoorStatus = true;
        this.outdoorStatus = false;
      }else{
        this.indoorStatus = false;
        this.outdoorStatus = true;
      }
      let parentTitleIdValue= data.floorId.slice(0,8);
      let floorIdValue = data.floorId;
      this.hostConfigForm = data;
      console.log(data);
      this.imagePath = data.img;
      this.hostConfigForm.parentTitleId = parentTitleIdValue;
      this.selectFloor(parentTitleIdValue,floorIdValue);
      this.hostConfigModelValidate = true;
    },
    getFloorDataList(){
      this.getRequest("/floor/getAllList").then(res => {
        if (res.success == true) {
          this.floorList = res.result;
        }
      });
    },
    details(v) {
      let query = { type: 1, id: v.id, name: v.name, code: v.code, version: v.version, addTime: v.addTime, position: v.position, updateTime: v.updateTime, companyId: v.companyId, chargeName:v.chargeName, chargePhone: v.chargePhone, backRoute: this.$route.name };
      this.$router.push({
        name: "details_hostConfig",
        query: query
      });
    },
    selectFloorList(value){
      const _this=this;
      this.floorList.forEach(function (item,index) {
          if(item.id==value){
              _this.title=item.children;
              _this.hostConfigForm.position= item.name;
              if(_this.title.length >0){
                _this.hostConfigForm.floorId=_this.title[0].id;
                _this.hostConfigForm.title = _this.title[0].name;
                _this.imagePath = _this.title[0].img
              }else{
                 _this.hostConfigForm.floorId="";
                _this.imagePath = "";
              }

          }
      })
    },
    selectFloorTwo(value){
      const _this=this;
      this.title.forEach(function (item,index) {
          if(item.id==value){
            _this.hostConfigForm.title = item.name;
            _this.imagePath=item.img
          }
      })
    },
    selectFloor(value,floorIdValue){
      const _this=this;
      this.floorList.forEach(function (item,index) {
          if(item.id==value){
              _this.title=item.children;
              _this.hostConfigForm.position= item.name;
              if(_this.title.length >0){
                _this.title.forEach(function (item2,index2) {
                  if(item2.id==floorIdValue){
                      _this.hostConfigForm.title = item2.name;
                  }
                })
                _this.hostConfigForm.floorId=floorIdValue;
              }else{
                 _this.hostConfigForm.floorId="";
              }

          }
      })
    },
    submitHostConfig() {
      this.$refs.hostConfigForm.validate(valid => {
        if (valid) {
          if (this.modalType == 0) {
            // 添加设备 避免编辑后传入id
            delete this.hostConfigForm.id;
            delete this.hostConfigForm.status;
            this.submitLoading = true;
            addDevice(this.hostConfigForm).then(res => {
              this.submitLoading = false;
              if (res.success == true) {
                this.$Message.success("操作成功");
                this.getDataList();
                this.hostConfigModelValidate = false;
              }
            });
          } else {
            // 编辑
            this.submitLoading = true;
            editDevice(this.hostConfigForm).then(res => {
              this.submitLoading = false;
              if (res.success == true) {
                this.$Message.success("操作成功");
                this.getDataList();
                this.hostConfigModelValidate = false;
              }
            });
          }
        }
      });
    },
    batchEnable(){
      let that = this;
      let statustrue= true;
      if (this.selectCount <= 0) {
        that.$Message.warning("您还未选择要启用的设备");
        return;
      }
      this.selectList.forEach(function(e) {
        if(e.runningState !='5'){
          that.$Message.warning("只能启用状态【禁用】的设备");
          statustrue = false;
        }
      });
      if(statustrue){
        this.$Modal.confirm({
        title: "启用",
        content: "您确认要启用所选的 " + this.selectCount + " 个设备?",
        onOk: () => {
            let ids = "";
            this.selectList.forEach(function(e) {
              ids += e.id + ",";
            });
            ids = ids.substring(0, ids.length - 1);
            // 批量处理
            this.operationLoading = true;
            this.deleteRequest("/device/batchEnable/" + ids).then(res => {
            this.operationLoading = false;
              if (res.success == true) {
                this.$Message.success("操作成功");
                this.clearSelectAll();
                this.getDataList();
              }
            });
          }
        });
      }

    },

    batchDisabling() {
      let that = this;
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要禁用的设备");
        return;
      }
      this.selectList.forEach(function(e) {
        if(e.runningState !='2'){
          that.$Message.warning("只能禁用状态【启用】的设备");
          statustrue = false;
        }
      });
      this.$Modal.confirm({
        title: "确认禁用",
        content: "您确认要禁用所选的 " + this.selectCount + " 个设备?",
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          // 批量处理
          this.operationLoading = true;
          this.deleteRequest("/device/batchDisabling/" + ids).then(res => {
          this.operationLoading = false;
            if (res.success == true) {
              this.$Message.success("操作成功");
              this.clearSelectAll();
              this.getDataList();
            }
          });
        }
      });
    },
    indoorclick(){
      this.indoorStatus = true;
      this.outdoorStatus = false;
    },
    outdoorclick(){
      this.indoorStatus = false;
      this.outdoorStatus = true;

      setTimeout(()=>{
        this.initAmap();
        this.province();
      },1000);
    },
    cancelHostConfig(){
      this.hostConfigModelValidate = false;
    },

    //高德地图
    initAmap() {
      this.map = new AMap.Map("homeAmap", {
        resizeEnable: true,
        zoom: 12
      });
      
    },
    province() {
      // 行政区划查询
      this.deAddr='';
      let opts = {
        subdistrict: 1, // 返回下一级行政区
        showbiz: false // 最后一级返回街道信息
      }
      this.district = new AMap.DistrictSearch(opts) // 注意：需要使用插件同步下发功能才能这样直接使用
      this.district.search('中国', (status, result) => {
        if (status === 'complete') {
          this.getData(result.districtList[0],'province')
        }
      })
    },
    getData (data, level) {
      let citySelect = document.getElementById('city')
      let districtSelect = document.getElementById('district')
      let bounds = data.boundaries
      if (bounds) {
        for (let i = 0, l = bounds.length; i < l; i++) {
          let polygon = new AMap.Polygon({
            map: this.map,
            strokeWeight: 1,
            strokeColor: '#0091ea',
            fillColor: '#80d8ff',
            fillOpacity: 0.2,
            path: bounds[i]
          })
          this.polygons.push(polygon)
        }
        this.map.setFitView() // 地图自适应
      }
      // 清空下一级别的下拉列表
      if (level === 'province') {
        citySelect.innerHTML = ''
        districtSelect.innerHTML = ''
      } else if (level === 'city') {
        districtSelect.innerHTML = ''
      }
      let subList = data.districtList
      if (subList) {
        let contentSub = new Option('--请选择--')
        let curlevel = subList[0].level
        let curList = document.querySelector('#' + curlevel)
        if(curList){
          curList.add(contentSub)
          for (let i = 0, l = subList.length; i < l; i++) {
            let name = subList[i].name
            let levelSub = subList[i].level
            contentSub = new Option(name)
            contentSub.setAttribute('value', levelSub)
            contentSub.center = subList[i].center
            contentSub.adcode = subList[i].adcode
            curList.add(contentSub)
          }
        }
      }
    },
    // tabsName(v){
    //   if(v == 'name1'){
    //      this.getDataList();
    //   }
    //   if(v == 'name2'){
    //      this.getDataList();
    //   }
    //   if(v == 'name3'){
    //     alert(33333)
    //   }
    //   if(v == 'name4'){
    //      alert(44444)
    //   }
    // },
    search (obj) {
      // 清除地图上所有覆盖物
      this.deAddr=''
      let that = this
      for (let i = 0, l = this.polygons.length; i < l; i++) {
        this.polygons[i].setMap(null)
      }
      let option = obj.srcElement[obj.srcElement.options.selectedIndex]
      let adcode = option.adcode
      if(option.value === 'province'){
        this.pcdAddress=[];
        this.pcdAddress.push(option.textContent)
      }else if(option.value === 'city' && this.pcdAddress.length >=2){
        let temp =[]
        temp.push(this.pcdAddress[0])
        this.pcdAddress=temp
        this.pcdAddress.push(option.textContent)
      }else  if (this.pcdAddress.length >=3){
        let temp =[]
        temp.push(this.pcdAddress[0])
        temp.push(this.pcdAddress[1])
        this.pcdAddress=temp
        this.pcdAddress.push(option.textContent)
      }else {
        this.pcdAddress.push(option.textContent)
      }

      this.district.setLevel(option.value) // 行政区级别
      this.district.setExtensions('all')
      // 行政区查询
      // 按照adcode进行查询可以保证数据返回的唯一性
      this.district.search(adcode, function (status, result) {
        if (status === 'complete') {
          that.getData(result.districtList[0], obj.srcElement.id)
        }
      })
    },


    search2 (obj) {
      // 清除地图上所有覆盖物
      this.deAddr=''
      let that = this
      for (let i = 0, l = this.polygons.length; i < l; i++) {
        this.polygons[i].setMap(null)
      }
      let option = obj.srcElement[obj.srcElement.options.selectedIndex]
      let adcode = option.adcode
      if(option.value === 'province1'){
        this.pcdAddress=[];
        this.pcdAddress.push(option.textContent)
      }else if(option.value === 'city1' && this.pcdAddress.length >=2){
        let temp =[]
        temp.push(this.pcdAddress[0])
        this.pcdAddress=temp
        this.pcdAddress.push(option.textContent)
      }else  if (this.pcdAddress.length >=3){
        let temp =[]
        temp.push(this.pcdAddress[0])
        temp.push(this.pcdAddress[1])
        this.pcdAddress=temp
        this.pcdAddress.push(option.textContent)
      }else {
        this.pcdAddress.push(option.textContent)
      }

      this.district.setLevel(option.value) // 行政区级别
      this.district.setExtensions('all')
      // 行政区查询
      // 按照adcode进行查询可以保证数据返回的唯一性
      this.district.search(adcode, function (status, result) {
        if (status === 'complete') {
          that.getData(result.districtList[0], obj.srcElement.id)
        }
      })
    },
    //web请求方式
    makeDetailAddressByRequest(){
      let path='//restapi.amap.com/v3/geocode/geo?address=';
      let key='key=d9d213dbd264c790b60c84dd28b200bd'
      let that=this
      let detailAddress=''
      if(this.deAddr){
        if(this.pcdAddress.length <3){
          alert('请选择完整的省市区')
          return
        }else{
          detailAddress=this.pcdAddress[1]+this.pcdAddress[2]+this.deAddr;
          console.log("详细地址："+detailAddress)
        }
      }

      let finalPath=path+detailAddress+'&city='+this.pcdAddress[1]+'&output=JSON&'+key;
      debugger
      this.$http.get(finalPath).then(function (res) {
        debugger
        console.log(res)
      },(error)=>{
        console.log(error)
      })

    },

    //js api方式
    makeDetailAddress(){
      let that=this
      let detailAddress=''
      let geocoder,marker;
      if(this.deAddr){
        if(this.pcdAddress.length <3){
          alert('请选择完整的省市区')
          return
        }else{
          detailAddress=this.pcdAddress[0]+this.pcdAddress[1]+this.pcdAddress[2]+this.deAddr;
          console.log("详细地址："+detailAddress)
        }
      }

      if(!geocoder){
        geocoder = new AMap.Geocoder({
          city: this.pcdAddress[1], //城市设为北京，默认：“全国”
        });
      }

      geocoder.getLocation(detailAddress,function (status,result) {
        debugger
        if(status==='complete' && result.geocodes.length){
          var lnglat = result.geocodes[0].location
          //document.getElementById('lnglat').value = lnglat;
          if(!marker){
            marker = new AMap.Marker();
            that.map.add(marker);
          }
          marker.setPosition(lnglat);
          that.map.setFitView(marker);
        }else{
          alert(result.toString());
          return;
        }
      })
    }
  },
  mounted() {
    this.init();
  },

};
</script>
