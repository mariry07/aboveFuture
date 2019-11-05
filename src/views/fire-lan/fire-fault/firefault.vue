<style lang="less">
    @import "./firefault.less";
</style>
<template>
    <div class="search">
        <Col>
            <div id="fire-fault">
                <div class="fault-echarts-wrp">
                    <div class="fault-header">
                        <span>
                            <img class="fault-img" src="@/assets/sbzs.png" alt="" title="设备总数" />
                            <span class="fault-count-wrp">
                                <h4 class="fault-count" >{{ deviceFaultAll.deviceNum }}</h4>
                                <span class="fault-label">设备总数</span>
                            </span>
                        </span>
                        <span>
                            <img class="fault-img" src="@/assets/wclgz.png" alt="" title="当前未处理故障" />
                            <span class="fault-count-wrp">
                                <h4 class="fault-count">{{ deviceFaultAll.unhandledFault }}</h4>
                                <span class="fault-label">当前未处理故障</span>
                            </span>
                        </span>
                        <span>
                            <img class="fault-img" src="@/assets/drcl.png" alt="" title="当日处理故障数" />
                            <span class="fault-count-wrp">
                                <h4 class="fault-count">{{ deviceFaultAll.dayHandledFault }}</h4>
                                <span class="fault-label">当日处理故障数</span>
                            </span>
                        </span>
                        <span>
                            <img class="fault-img" src="@/assets/dycl.png" alt="" title="当月处理故障数" />
                            <span class="fault-count-wrp">
                                <h4 class="fault-count">{{ deviceFaultAll.monthHandleFault }}</h4>
                                <span class="fault-label">当月处理故障数</span>
                            </span>
                        </span>
                    </div>

                    <div class="fault-echarts-tooltip">
                        <span class="fault-echarts-label">故障趋势图</span>
                        <div style="margin-right: 30px">
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
                    <div id="chart" class="fault-echart" ref="myecharts">
                        <!--<apexchart type=line height=95% :options="chartOptions" :series="series" />-->
                    </div>
                </div>
            </div>
        </Col>
        <Row class="operation" style="padding-top: 20px;">
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
                          @on-change="selectDateRange1"
                          placeholder="选择起始时间"
                          style="width: 200px"
                  ></DatePicker>
                </Form-item>
                <Form-item label="设备编号" prop="deviceCode">
                  <Input
                          type="text"
                          v-model="searchForm.deviceCode"
                          placeholder="请输入"
                          clearable
                          style="width: 200px"
                  />
                </Form-item>
                <Form-item label="故障类型" prop="faultType">
                  <Select
                          v-model="searchForm.faultType"
                          placeholder="请选择"
                          clearable
                          style="width: 200px"
                  >
                      <Option value="">全部</Option>
                      <Option v-for="item in faultTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
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
                  <br/>
                  <Form-item label="地理位置">
                      <RadioGroup v-model="placeName"  @on-change="changePlaceRadio">
                          <Radio label="all">
                              <span>全部</span>
                          </Radio>
                          <Radio label="indoor">
                              <span>室内</span>
                          </Radio>
                          <Radio label="outdoor">
                              <span>室外</span>
                          </Radio>
                      </RadioGroup>
                  </Form-item>
                  <!--<Form-item v-show="placeName !== 'all'">-->
                  <!--<span v-show="placeName==='outdoor'">-->
                  <!--<al-cascader v-model="searchForm.eroomInfo" data-type="name" level="3" @on-change="handleOutdoor"></al-cascader>-->
                  <!--</span>-->
                  <!--<span v-show="placeName==='indoor'">-->
                  <!--<Cascader v-model="searchForm.inroominfo" data-type="value" level="2" :data="indoorData" @on-change="handleindoor"></Cascader>-->
                  <!--</span>-->
                  <!--</Form-item>-->
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
                    :current="searchForm.currentPage"
                    :total="total"
                    :page-size="searchForm.length"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"
                    :page-size-opts="[10,20,50]"
                    size="small"
                    show-total
                    show-elevator
                    show-sizer
            ></Page>
        </Row>

        <Modal :title="modalTitle"
               v-model="dealModelValidate"
               :mask-closable="false"
               :width="500"
               :styles="{top: '50px'}">
            <Form ref="dealConfigForm" :label-width="90" >
                <FormItem label="处理信息:" prop="name">
                    <Input v-model="dealMsg" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入内容" />
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelDeal">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitDetail">保存</Button>
            </div>
        </Modal>
    </div>


</template>

<script>
    import {
        getFaultType,
        getfaultStatics,
        getlanalarmfaultList,
        getdeviceType,
        getlanfaultTrendDiagram,
        postFaultBatchDetail,
        deleteDeviceFault
    } from "@/api/index1";

    import {
        getDeviceFaultChartsData
    } from "@/api/index";

    import circleLoading from "@/views/my-components/circle-loading.vue";
    import deviceDateUtil from '@/views/patrol/device/deviceDateUtil.vue'

    import echarts from 'echarts'

    export default {
        name: "fire-alarm",
        components:{
            circleLoading,
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
                submitLoading:false,
                dealModelValidate:false,
                placeName:'all',
                faultTypeList:[],
                mychart:null,
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
                deviceFaultAll:{
                    dayHandledFault: 1,
                    deviceNum: 1,
                    monthHandleFault: 1,
                    unhandledFault: 1
                }, //设备信息汇总
                maxtickAmount:10,
                maxmax:0,
                dealMsg:'',
                searchForm: {
                    // 搜索框对应data对象
                    systemType:'1',
                    deviceCode: "", //设备编号
                    faultType: "", //故障类型
                    status: "", //处理状态
                    currentPage: 1, // 当前页数
                    length: 10, // 页面大小
                    startTime: "", // 起始时间
                    endTime: "", // 终止时间
                    isOutdoor:'',
                },
                lineSearchFrom:{
                    systemType:1,
                    start: this.selectedDataDate(), // 起始时间
                    end: "", // 终止时间
                    companyId:'',
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
                        key: "type",
                        align: "center",
                        width: 300,
                        align: "center",
                        fixed: "left",
                        render:(h,params)=>{
                            return h('div',[
                                h(
                                    "span", {
                                        props:{
                                            type:'label',
                                        },
                                        domProps:{
                                            innerHTML:this.getTypeName(params.row.type)
                                        }
                                    }
                                )
                            ])
                        }
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
                        fixed: "left",
                        render:(h,params)=>{
                            return h('div',[
                                h(
                                    "span", {
                                        props:{
                                            type:'label',
                                        },
                                        domProps:{
                                            innerHTML:this.handleDate(params.row.addTime)
                                        }
                                    }
                                )
                            ])
                        }
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
                                        "Button",
                                        {
                                            props: {
                                                type:'warning',
                                                color: "yellow",
                                                size: 'small'
                                            },
                                            on:{
                                                click: () => {
                                                    this.details(params.row);
                                                }
                                            }
                                        },
                                        "未处理"
                                    )
                                ]);
                                //re = "未处理";
                            } else if (params.row.status == 1) {
                                return h("div", [
                                    h(
                                        "Button",
                                        {
                                            props: {
                                                type:'success',
                                                color: "green",
                                                size: 'small'
                                            },
                                            on:{
                                                click: () => {
                                                    this.details(params.row);
                                                }
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
                if(this.mychart === null){
                    this.mychart=echarts.init(this.$refs.myecharts);
                }
                //获取故障类型
                //获取故障和处理数
                //this.getFaultStatics()

                this.getDataList();
                this.getFaultStatics()
                // 初始化搜索框级联分类数据
                this.initCategoryData();
                // 初始化编辑添加树形分类数据
                this.initCategoryForEdit();

                this.getDeviceFaultCharts();

            },
            handleOk () {
                this.open = false;
                this.getDeviceFaultCharts1();
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
                this.searchForm.currentPage = v;
                this.getDataList();
                this.clearSelectAll();
            },
            changePageSize(v) {
                this.searchForm.length = v;
                this.getDataList();
            },
            selectDateRange(v) {
                if (v) {
                    let start=deviceDateUtil.timestamp(v[0],'YYYY-MM-DD');
                    let end=deviceDateUtil.timestamp(v[1],'YYYY-MM-DD');
                    // let start=new Date(v[0].replace(new RegExp('-','gm'),'/')).getTime()
                    // let end=new Date(v[1].replace(new RegExp('-','gm'),'/')).getTime()

                    let startTime,endTime

                    if(start>end){
                        startTime=Math.floor(end/1000)
                        endTime=Math.floor(start/1000)
                    }else {
                        startTime=Math.floor(start/1000)
                        endTime=Math.floor(end/1000)
                    }

                    this.lineSearchFrom.start = startTime;
                    this.lineSearchFrom.end = endTime;
                }
            },

            selectDateRange1(v) {
                if (v.length>1 ) {
                    this.searchForm.startTime = Math.floor(deviceDateUtil.timestamp(v[0],'YYYY-MM-DD')/1000) ;
                    this.searchForm.endTime = Math.floor(deviceDateUtil.timestamp(v[1],'YYYY-MM-DD')/1000) ;
                }
            },
            handleClear () {
                this.open = false;
            },
            getFaultStatics(){
                getfaultStatics({systemType:'1'}).then(res => {
                    if(res.status === 1){
                        //this.faultStatics=res.dataValue;
                        this.deviceFaultAll=res.dataValue
                    }else {
                        let resData={
                            dayHandledFault: 0,
                            deviceNum: 0,
                            monthHandleFault: 0,
                            unhandledFault: 0
                        }
                        //this.faultStatics=res.dataValue;
                        this.deviceFaultAll=resData
                    }
                })
            },
            getFaultType(){
                getFaultType({systemType:'1'}).then(res=>{
                    if(res.status === 1){
                        this.faultTypeList=res.dataValue;
                    }
                })
            },
            getFaultTypeName(id){
                let typeName=''
                getFaultType({systemType:'1'}).then(res=>{
                    if(res.status === 1){
                        this.faultTypeList=res.dataValue;
                    }
                }).then(res=>{
                    for(let t in this.faultTypeList){
                        if(this.faultTypeList[t].id === id){
                            typeName = this.faultTypeList[t].name
                            break;
                        }
                    }
                })

                return typeName;
            },
            getTypeName(id){
                let typeName='unKnow';
                if(this.faultTypeList.length<=0){
                    typeName=this.getFaultTypeName(id);
                }else{
                    for(let t in this.faultTypeList){
                        if(this.faultTypeList[t].id === id){
                            typeName = this.faultTypeList[t].name
                            break;
                        }
                    }
                }

                return typeName
            },

            getDataList() {
                // 多条件搜索获取表格数据
                this.loading = true;
                //getlanalarmfaultList({systemType:1})
                getlanalarmfaultList(this.searchForm).then(res => {
                    this.loading = false;
                    if (res.status === 1) {
                        this.data = res.dataValue.faultList;
                        this.total = res.dataValue.total;
                    }else {
                        this.$Message.warning("检查查询条件是否正确！！");
                        //alert("检查查询条件是否正确！！")
                    }
                });

                this.exportData = this.data;
                this.total = this.data.length;
                this.loading = false;
            },
            getDeviceFaultCharts() {
                this.selectedDataDate()

                getlanfaultTrendDiagram(this.lineSearchFrom).then(res => {
                    this.loading = false;
                    if (res.status === 1) {
                        //this.series[0].data = res.result.deviceFaultChartsY;

                        let keys=[]
                        let values=[]
                        let reData=res.dataValue

                        for (let property in reData){
                            let obj = reData[property]
                            for(let key in obj){
                                if(key !== 'start' && key !== 'end'){
                                    let key1=key.replace(new RegExp('/','gm'),'-')

                                    keys.push(key1)
                                    values.push(obj[key])
                                }
                            }
                        }

                        let option=  {
                            title:{
                                show:false
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            color: ['#ffb83f'],
                            grid: {
                                bottom: '20%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: keys
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series:{
                                name: "故障数量",
                                type:'line',
                                itemStyle:{
                                    normal:{
                                        lineStyle:{
                                            width:5
                                        }
                                    }
                                },
                                data: values
                            },
                        };

                        this.mychart.setOption(option)

                    }
                });
            },
            getDeviceFaultCharts1() {
                getlanfaultTrendDiagram(this.lineSearchFrom).then(res => {
                    this.loading = false;
                    if (res.status === 1) {
                        //this.series[0].data = res.result.deviceFaultChartsY;

                        let keys=[]
                        let values=[]
                        let reData=res.dataValue

                        for (let property in reData){
                            let obj = reData[property]
                            for(let key in obj){
                                if(key !== 'start' && key !== 'end'){
                                    let key1=key.replace(new RegExp('/','gm'),'-')

                                    keys.push(key1)
                                    values.push(obj[key])
                                }
                            }
                        }

                        let option=  {
                            title:{
                                show:false
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            color: ['#ffb83f'],
                            grid: {
                                bottom: '20%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: keys
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series:{
                                name: "故障数量",
                                type:'line',
                                itemStyle:{
                                    normal:{
                                        lineStyle:{
                                            width:5
                                        }
                                    }
                                },
                                data: values
                            },
                        };

                        this.mychart.setOption(option)

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
                this.searchForm.startTime = "";
                this.searchForm.endTime = "";
                this.selectCat = [];
                this.searchForm.isOutdoor=null;
                this.searchForm.faultType=null;
                this.searchForm.deviceCode='';
                this.searchForm.status='';


                this.getDataList();
            },

            selectedDataDate(){
                //获取系统当前时间
                var nowdate = new Date();

                //获取系统前一个月的时间
                //var endTime = Math.floor(nowdate.getTime()/1000)
                nowdate.setMonth(nowdate.getMonth()-1);

                var startTime = Math.floor(nowdate.getTime()/1000)

                // this.lineSearchFrom.startTime=startTime
                // this.lineSearchFrom.endTime=endTime

                return startTime

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
                    this.modalTitle ='批量处理'
                    this.dealMsg=''
                    this.dealModelValidate=true
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
                        deleteDeviceFault( {ids: ids}).then(res => {
                            this.operationLoading = false;
                            if (res.status === 1) {
                                this.$Message.success("操作成功");
                                this.clearSelectAll();
                                this.getDataList();
                                this.getDeviceFaultCharts();
                            }
                        });
                    }
                });
            },
            changePlaceRadio(value){
                if(value === 'outdoor'){
                    this.searchForm.isOutdoor=1
                }else if(value === 'indoor'){
                    this.searchForm.isOutdoor=0
                }else {
                    this.searchForm.isOutdoor=null;
                }
            },
            details(v) {
                let query={id:v.id,deviceId:v.deviceId,deviceCode: v.deviceCode, status:v.status,backRoute: this.$route.name}
                this.$router.push({
                    name: "detail_lanfault",
                    query: query
                });
            },
            handleDate(value){
                return deviceDateUtil.format(value*1000,'YYYY-MM-DD HH:MM:SS');
            },
            handleOutdoor(value){

            },
            handleindoor(value){

            },
            cancelDeal(){
                this.dealModelValidate=false
            },
            submitDetail(){
                if(this.dealMsg.trim() !== '' && this.dealMsg.trim()!== null){
                    let ids = "";
                    this.selectList.forEach(function(e) {
                        ids += e.id + ",";
                    });
                    ids = ids.substring(0, ids.length - 1);

                    let params={
                        ids:ids,
                        dealDetail:this.dealMsg
                    }

                    this.submitLoading = true;

                    postFaultBatchDetail(params).then(res=>{
                        this.submitLoading=false
                        if(res.status === 1){
                            this.$Message.success("操作成功");
                            this.dealModelValidate=false
                            this.clearSelectAll();
                            this.getDataList();
                            this.getDeviceFaultCharts1();
                        }
                    })
                }
            }
        },
        mounted() {
            this.init();
        },
        created() {
            this.getFaultType();
        }
    }
</script>

<style scoped>

</style>