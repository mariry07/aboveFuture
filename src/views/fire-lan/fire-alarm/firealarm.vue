<style lang="less">
    @import "./firealarm.less";
</style>
<template>
    <div class="new-statics">
        <div class="top-head">
            <div class="static-alarm-section">
                <div class="statics-top-left">
                    <Row>
                        <RadioGroup v-model="alarmRadio" @on-change="alarmRadioChange">
                            <Radio label="alarmCount">
                                <!--<Icon type="social-apple"></Icon>-->
                                <span>报警统计</span>
                            </Radio>
                            <Radio label="alarmList">
                                <!--<Icon type="social-apple"></Icon>-->
                                <span>报警列表</span>
                            </Radio>
                        </RadioGroup>
                        <Divider type="vertical"/>
                        <span v-show="alarmcountAll" style="min-width: 450px">
                            <DatePicker
                                    v-model="startDate"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    @on-change="selectDateStart"
                                    placeholder="选择开始时间"
                                    style="width: 200px">
                            </DatePicker>
                            <span style="margin-left: 10px;margin-right: 10px"> -- </span>
                            <DatePicker
                                    v-model="endDate"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    @on-change="selectDateEnd"
                                    placeholder="选择结束时间"
                                    style="width: 200px">
                            </DatePicker>
                            <!--<DatePicker v-model="endDate" type="date"-->
                            <!--:options="options4" -->
                            <!--placeholder="Select date"-->
                            <!--style="width: 200px;padding-left: 10px"></DatePicker>-->
                    </span>
                    </Row>
                </div>
                <Divider size="24px" type="vertical"/>
                <div class="statics-top-right" v-show="alarmcountAll">
                    <Button style="float:right;padding-right: 10px;margin-top: 10px;" @click="showMail">
                        <Icon type="ios-mail" size="24"/>
                        <span>邮件推送</span>
                    </Button>
                    <Divider style="float: right;" type="vertical" />
                    <Button style="float:right;padding-right: 15px;margin-top:10px;" @click="showList">
                        <Icon type="ios-mail" size="24"/>
                        <span>查看报表</span>
                    </Button>
                </div>
                <div class="page-remember" v-show="!alarmcountAll" style="color: #4169E1;">
                    <Checkbox v-model="remCheck" style="font-size: 16px;">设为默认展示页</Checkbox>
                </div>
            </div>
            <div class="statics-header-tags">
                <div class="statics-grade-tag">
                    <div class="statics-grade">
                        <span style="margin-left: 30px">
                            <Button type="primary" shape="circle" size="large">96  分</Button>
                        </span>
                    </div>
                    <div class="statics-grade-item">
                        <Icon type="ios-list" size="40" color="blue"/>
                        <span style="margin-left: 5px" > 排名</span>
                    </div>
                    <div class="statics-grade-item">
                        <Icon type="ios-alert-outline" size="25" color="blue"/>
                        <span style="margin-left: 5px">异常</span>
                    </div>
                    <div class="statics-grade-item">
                        <Icon type="md-paper" size="25" color="blue"/>
                        <span style="margin-left: 5px">建议</span>
                    </div>
                </div>
                <div class="statics-header-tag">
                    <Icon  style="padding-left: 10px"  type="ios-notifications-outline" size="40" color="red"/>
                    <div style="margin-left: 15px;">
                        <div class="statics-item-count">{{alarmTotal}}</div>
                        <div>报警总数</div>
                    </div>
                </div>
                <div class="statics-header-tag">
                    <Icon style="padding-left: 10px" type="ios-build-outline" size="40" color="red"/>
                    <div style="margin-left: 15px;">
                        <div class="statics-item-count">
                            <span style="color:red">{{deviceOffline}}</span>
                            <span>/</span>
                            <span>{{deviceTotal}}</span>
                        </div>
                        <div>主机离线数/总数</div>
                    </div>
                </div>
                <div class="statics-header-tag">
                    <Icon  style="padding-left: 10px"  type="md-notifications-outline" size="40" color="green"/>
                    <div style="margin-left: 15px;">
                        <div class="statics-item-count">
                            <span style="color:red">{{alarmUnhandled}}</span>
                            <span>/</span>
                            <span>{{alarmHandled}}</span>
                        </div>
                        <div>未处理报警/已处理报警</div>
                    </div>
                </div>
            </div>
        </div>
        <div style="padding-top: 10px;padding-left: 10px;" v-show="alarmcountAll">
            <div class="statics-contain">
                <div class="v3-echart-body">
                    <div id="apexchart1" class="v3-echart-section">
                        <div class="v3-echart-header">
                            <span>
                                <span class="fault-echarts-label">报警楼栋分布图 </span>
                                <Icon type="ios-help-circle" size="20"/>
                            </span>
                            <span style="padding-left: 20px;">
                                <RadioGroup v-model="alarmType" @on-change="changeRadio">
                                    <Radio label="alarmcount">
                                        <span>按报警总数</span>
                                    </Radio>
                                    <Radio label="unalarmcount">
                                        <span>按未处理报警总数</span>
                                    </Radio>
                                </RadioGroup>
                            </span>
                            <Button type="text" style="float: right;" @click="showMore">
                                <span>更多</span>
                                <Icon type="ios-more" size="30"/>
                            </Button>
                        </div>
                        <div id="chart1">
                            <apexchart type=bar height=240 :options="chartOptions1" :series="series1" />
                        </div>
                    </div>
                    <div id="apexchart2" class="v3-echart-section" style="float: right;">
                        <div class="v3-echart-header">
                            <span>
                                <span class="fault-echarts-label">报警和故障趋势图</span>
                            </span>
                        </div>
                        <div id="chart5" style="height: 255px" ref="myechart2">
                            <!--<apexchart type=line height=240px :options="chartOptions2" :series="series2" />-->
                        </div>
                    </div>
                    <div class="v3-echart-section" style="margin-top: 10px;">
                        <div class="v3-echart-header">
                            <span>
                                <span class="fault-echarts-label">报警类型和处理类型占比 </span>
                                <Icon type="ios-help-circle" size="20"/>
                            </span>
                        </div>
                        <div id="echart3" style="height: 255px;width: 100%" ref="myecharts">
                            <!--<apexchart type=bar height=240 :options="chartOptions1" :series="series1" />-->
                        </div>
                    </div>
                    <div class="v3-echart-section v3-device-dilligence" style="margin-top: 10px;float: right;">
                        <div class="v3-echart-section">
                            <div  class="v3-echart-header">
                                <span class="fault-echarts-label"> 设备统计 </span>
                            </div>
                            <div id="chart4">
                                <apexchart type=bar height=240 :options="chartOptions4" :series="series4" />
                            </div>
                        </div>
                        <div class="v3-echart-section">

                            <div  class="v3-echart-header">
                                <span class="fault-echarts-label">报警处理排行榜 </span>
                            </div>
                            <div v-if="makeAlarm.length<=0" style="height: 255px;">
                                暂无数据
                            </div>
                            <div v-else>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="!alarmcountAll">
            <div class="fault-echarts-wrp">
                <div class="fault-echarts-tooltip">
                    <span class="fault-echarts-label">报警趋势图</span>
                    <div>
                        <DatePicker
                                v-model="faultrendDate"
                                :open="open"
                                confirm
                                placement="bottom-end"
                                type="daterange"
                                @on-change="selectDateRange2"
                                @on-clear="handleClear"
                                @on-ok="handleOk2">
                            <a href="javascript:void(0)" @click="handleClick">
                                <Icon type="ios-calendar-outline"></Icon>
                            </a>
                        </DatePicker>
                    </div>
                </div>
                <div id="trendchart" style="height: 255px" class="fault-echart" ref="trendecharts">
                    <!--<apexchart type=line height=95% :options="chartOptions" :series="series" />-->
                </div>
            </div>
            <div class="search" style="margin-top: 10px;">
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
                    <Form ref="searchForm1" :model="searchForm1" inline :label-width="90" class="search-form">
                        <span v-if="drop">
                            <Form-item label="监测点名称">
                                <Input
                                        v-model="searchForm1.floorName"
                                        type="text"
                                        placeholder="请输入"
                                        clearable
                                        style="width: 200px"
                                />
                            </Form-item>
                            <Form-item label="报警时间">
                                <DatePicker
                                        v-model="selectAlarmDate"
                                        type="daterange"
                                        format="yyyy-MM-dd"
                                        clearable
                                        @on-change="selectAlamDateRange"
                                        placeholder="选择起始时间"
                                        style="width: 200px">

                                </DatePicker>
                            </Form-item>
                            <Form-item label="报警类型" prop="alarmType">
                                <Select
                                        v-model="searchForm1.alarmType"
                                        placeholder="请选择"
                                        clearable
                                        style="width: 200px"
                                >
                                    <Option value="">全部</Option>
                                    <Option v-for="item in alarmTypeList" :key="item.id" :value="item.id">{{item.name}}</Option>

                                </Select>
                            </Form-item>
                            <Form-item label="处理状态" prop="status">
                                <Select
                                        v-model="searchForm1.status"
                                        placeholder="请选择"
                                        clearable
                                        style="width: 200px"
                                >
                                    <Option value="">全部</Option>
                                    <Option value="1">有效处理</Option>
                                    <Option value="2">误报</Option>
                                    <Option value="3">消防测试</Option>
                                    <Option value="4">维保检修</Option>
                                    <Option value="5">其他</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="设备编号">
                                <Input
                                        type="text"
                                        v-model="searchForm1.deviceCode"
                                        placeholder="请输入"
                                        clearable
                                        style="width: 200px"/>
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
                                    <!--<al-cascader v-model="searchForm1.eroomInfo" data-type="name" level="3" @on-change="handleOutdoor"></al-cascader>-->
                                <!--</span>-->
                                <!--<span v-show="placeName==='indoor'">-->
                                    <!--<Cascader v-model="searchForm1.inroominfo" data-type="value" level="2" :data="indoorData" @on-change="handleindoor"></Cascader>-->
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
                </Row>
                <Row type="flex" justify="end" class="page">
                    <Page
                            :current="searchForm1.currentPage"
                            :total="total"
                            :page-size="searchForm1.length"
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
        </div>

        <Modal :title="modalTitle"
               v-model="dealModelValidate"
               :mask-closable="false"
               :width="500"
               :styles="{top: '50px'}">

            <div style="padding-left: 20px;margin-bottom: 15px;">
                <RadioGroup v-model="makestatus">
                    <Radio label="1">
                        <span>有效处理</span>
                    </Radio>
                    <Radio label="2">
                        <span>误报</span>
                    </Radio>
                    <Radio label="3">
                        <span>消防测试</span>
                    </Radio>
                    <Radio label="4">
                        <span>Android</span>
                    </Radio>
                    <Radio label="5">
                        <span>其他</span>
                    </Radio>
                </RadioGroup>
            </div>

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
        getAlarmList,
        getAlarmType,
        getOfflineState,
        alarmTrendDiagram,
        getalarmStaticstics,
        getalarmTrendDiagram,
        getAlarmCountByType,
        getAlarmDetailStatus,
        getAlarmDealTypeCount,
        getlanfaultTrendDiagram,
        deleteAlarmDelete,
        postAlaramDetail
    } from "@/api/index1";

    import deviceDateUtil from '@/views/patrol/device/deviceDateUtil.vue'
    import echarts from 'echarts'
    import circleLoading from "@/views/my-components/circle-loading.vue";


    export default {
        name: "fire-fault",
        components: {
            circleLoading,
        },
        data(){
            return {
                makestatus:'1',
                dealMsg:'',
                submitLoading:false,
                modalTitle:'批量处理',
                dealModelValidate:false,
                indoorData:[{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        }
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ],
                }],
                alarmUnhandled:0,
                alarmTotal:0,
                alarmHandled:0,
                showLevel:1,
                oldData:[],
                chinaArea:[],
                placeName:'all',
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
                selectAlarmDate: null, // 选择日期绑定modal
                faultrendDate:null,
                selectCat: [], // 搜索选择类别modal
                dataCat: [], // 编辑添加类别数据
                deviceFaultAll:[], //设备信息汇总
                maxtickAmount:10,
                maxmax:0,
                remCheck:false,
                showdefaultPage:false,
                makeAlarm:[],
                chart: null,
                chart1:null,
                alarmcountAll:true,
                alarmRadio: 'alarmCount',
                alarmType: 'alarmcount',
                startDate: null,
                endDate: null,
                myTrend:null,
                series1: [
                    {
                        name: '已处理',
                        data: [44, 55, 57]
                    },
                    {
                        name: '未处理',
                        data: [76, 85, 101]
                    }
                ],
                chartOptions1: {
                    chart: {
                        toolbar: {
                            show: false
                        },
                    },
                    colors: ['#1E90FF', '#EE4000'],
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '30%',
                            endingShape: 'rounded'
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent']
                    },
                    legend: {
                        position: "top",
                    },
                    xaxis: {
                        categories: ['凤凰城', '中国电波研究所', 'Apr',],
                        axisTick:{
                            interval:4
                        }

                    },
                    yaxis: {

                        //     title: {
                        //         text: '$ (thousands)'
                        //     }
                    },
                    fill: {
                        opacity: 1

                    },

                    // tooltip: {
                    //     y: {
                    //         formatter: function (val) {
                    //             return "$ " + val + " thousands"
                    //         }
                    //     }
                    // }
                },
                option2: {
                    title:{
                        show:false
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#ff4f50', '#ffb83f'],
                    legend: {
                        position: 'top',
                        horizontalAlign: 'center',
                        floating: true,
                        offsetY: -25,
                        offsetX: -5
                    },
                    grid: {
                        bottom: '20%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [1,2]
                    },
                    yAxis: {
                        type: 'value',
                        splitLine:{
                            show:false
                        }
                    },
                    dataZoom:{
                        start:0,//默认为0
                        end: 100,//默认为100
                        type: 'slider',
                        show: true,
                        height: 8,//组件高度
                        handleColor: '#1E90FF',//h滑动图标的颜色
                        handleStyle: {
                            borderColor: "#1E90FF",
                            borderWidth: "1",
                            shadowBlur: 2,
                            background: "#1E90FF",
                            shadowColor: "#1E90FF",
                        },
                        backgroundColor: '#ddd',//两边未选中的滑动条区域的颜色
                        showDataShadow: false,//是否显示数据阴影 默认auto
                        showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
                        handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                        filterMode: 'filter',
                        fillerColor:'#1E90FF'
                    },
                    series: [
                        {
                            name: "报警",
                            type:'line',
                            data: [1,2],
                            itemStyle: {
                                normal: {
                                    lineStyle:{
                                        width:3//设置线条粗细
                                    }
                                }
                            }
                        },
                        {
                            name: "故障",
                            type:'line',
                            data: [0,1],
                            itemStyle: {
                                normal: {
                                    lineStyle:{
                                        width:3//设置线条粗细
                                    }
                                }
                            }
                        }
                    ]
                },
                searchForm: {
                    systemType: 1,
                    start:null,
                    end:null,
                    companyId:''
                },
                searchForm1: {
                    systemType:1,
                    // 搜索框对应data对象
                    //placeName:'',
                    alarmType:"",
                    status: "",
                    currentPage: 1, // 当前页数
                    length: 10, // 页面大小
                    startTime: "", // 起始时间
                    endTime: "", // 终止时间
                    deviceCode:'',
                    isOutdoor:'',
                    floorName:''

                },
                alarmForm:{
                    systemType:1,
                    startTime: '',
                    endTime:'',
                    company:'',
                    start:'',
                    end:''
                },
                alarmTypeList:[],
                categories:[],
                option3:{
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: [
                        {
                            show:true,
                            type:'scroll',
                            orient: 'vertical',
                            left:'10%',
                            y:'center',
                            data:['1','2']
                        },
                        {
                            show:true,
                            type:'scroll',
                            orient: 'vertical',
                            right:'15%',
                            y:'center',
                            data:['3','4']
                        }
                    ],
                    color:[
                        '#4682B4',
                        '#DAA520',
                        '#7FFFAA',
                        '#5F9EA0',
                        '#B0C4DE',
                        '#FF69B4',
                        '#FFD700',
                        '#48D1CC',
                        '#008080',
                        '#FFD700',
                        '#32CD32',
                        '#00FFFF',
                        '#6A5ACD',
                        '#C71585',
                        '#9370DB',
                        '#DC143C',
                    ],
                    series: [
                        {
                            name:'报警类型',
                            type:'pie',
                            radius: ['40%', '55%'],
                            label: {
                                normal: {
                                    show:false
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                            ]
                        },
                        {
                            name:'处理状态',
                            type:'pie',
                            selectedMode: 'single',
                            radius: [0, '30%'],

                            label: {
                                normal: {
                                    position: 'inner',
                                    show:false
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:[
                                {
                                  name:'1',
                                  value:1
                                },
                                {
                                    name:'1',
                                    value:1
                                }
                            ],
                        }
                    ],
                },
                series4: [{
                    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
                }],
                chartOptions4: {
                    chart: {
                        toolbar: {
                            show: false
                        },
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
                        categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
                            'United States', 'China', 'Germany'
                        ],
                    }
                },
                trendOption:{
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
                        data: ['1','2','3','4','5','6',]
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

                        data: ['1','2','3','4','5','6',]
                    },
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
                        key: "floorName",
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
                        fixed: "left",
                        render: (h,params)=>{
                            return h('div',[
                                h(
                                    "span", {
                                        props:{
                                            type:'label',
                                        },
                                        domProps:{
                                            innerHTML:this.getAlarmTypeName(params.row.type)
                                        }
                                    }
                                )
                            ])
                        }
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
                        key: "count",
                        width: 120,
                        align: "center",
                        fixed: "left"
                    },
                    {
                        title: "报警时间",
                        key: "addTime",
                        align: "center",
                        sortType: "desc",
                        width: 200,
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
                        width: 120,
                        fixed: "left",
                        render: (h, params) => {

                            if (params.row.status == 1) {
                                return h("div", [
                                    h(
                                        "span",
                                        {
                                            props: {
                                                type:'label',

                                            },
                                            domProps:{
                                                innerHTML:"有效处理"
                                            }
                                        },
                                    )
                                ]);
                                //re = "未处理";
                            } else if (params.row.status == 2) {
                                return h("div", [
                                    h(
                                        "span",
                                        {
                                            props: {
                                                type:'label',

                                            },
                                            domProps:{
                                                innerHTML:"误报"
                                            }
                                        },

                                    )
                                ]);
                                //re = "已处理";
                            }else if(params.row.status==3){
                                return h("div", [
                                    h(
                                        "span",
                                        {
                                            props: {
                                                type: "label"
                                            },
                                            domProps:{
                                                innerHTML:"消防测试"
                                            }
                                        },

                                    )
                                ]);
                                //re ="误报";
                            }else if(params.row.status ===4){
                                return h("div", [
                                    h(
                                        "span",
                                        {
                                            props: {
                                                type: "label"
                                            },
                                            domProps:{
                                                innerHTML:"维保检修"
                                            }
                                        },

                                    )
                                ]);
                            }else if(params.row.status ===5){
                                return h("div", [
                                    h(
                                        "span",
                                        {
                                            props: {
                                                type: "label"
                                            },
                                            domProps:{
                                                innerHTML:'其他'
                                            }
                                        },
                                    )
                                ]);
                            }else {
                                return h("div", [
                                    h(
                                        "span",
                                        {
                                            props: {
                                                type: "label"
                                            },
                                            domProps:{
                                                innerHTML:'未处理'
                                            }
                                        },
                                    )
                                ]);
                            }
                        }
                    },
                    {
                        title: "操作",
                        key: "action",
                        width: 180,
                        align: "center",
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
                total: 0, // 表单数据总数
                deviceOffline:0,
                deviceTotal:0,
                trendValue1:[],
                trendValue2:[],
                trendKeys:[],
            }

        },
        methods:{
            init(){
                //报警楼栋分布
                //this.getDevicePoliceAndFaultChartsData();
                if(this.chart === null){
                    this.chart = echarts.init(this.$refs.myecharts)
                }
                if(this.chart1=== null){
                    this.chart1 = echarts.init(this.$refs.myechart2);
                }


                //设备统计
                //this.getDeviceTypeCountCharts();
                //默认时间一个月
                this.selectedDataDate();
                this.chart.setOption(this.option3);
                //this.chart1.setOption(this.option2)
                this.getAlarmStatistics()
                this.getAlarmType()
                this.getdeviceOfflineStat()

                this.initAlarmyDetailAndCount()
                this.getTrendDiagram()
                //this.getDeviceFaultCharts1()
            },

            initAlarmyDetailAndCount(){
                let startTime=this.getStartDataDate()
                this.alarmForm.startTime=startTime

                this.getAlarmCountByType()
                this.getAlarmDetailStatus()
            },

            //画第二个图的双曲线图
            getAlarmAndFaultTrend(){
                let startTime=this.getStartDataDate()
                this.alarmForm.startTime=startTime
                this.alarmForm.start=startTime
                this.getlanfaultTrendDiagram();

                let option = this.chart1.getOption();
                option.series[0].data=values

                this.chart1.setOption(option);
            },

            getTrendDiagram(){
                this.loading=true
                let startTime=this.getStartDataDate()
                this.alarmForm.startTime=startTime
                this.alarmForm.start=startTime
                getalarmTrendDiagram(this.alarmForm).then(res=>{
                    this.loading=false
                    if(res.status===1){
                        let values=[]
                        let reData=res.dataValue

                        for (let property in reData){
                            let obj = reData[property]

                            let value=obj['count']

                            values.push(value)
                        }

                        this.trendValue1=values
                    }
                }).then(res=>{
                    getlanfaultTrendDiagram(this.alarmForm).then(res1=>{
                        this.loading=false

                        if(res1.status===1){

                            let keys=[]
                            let values=[]
                            let reData=res1.dataValue

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

                            this.trendKeys=keys
                            this.trendValue2=values
                        }
                    }).then(res1=>{
                        this.option2.xAxis.data=this.trendKeys
                        this.option2.series[0].data=this.trendValue1
                        this.option2.series[1].data=this.trendValue2
                        this.chart1.setOption(this.option2);
                    })
                })
            },

            getlanfaultTrendDiagram(){
                this.loading=true
                getlanfaultTrendDiagram(this.alarmForm).then(res=>{
                    this.loading=false

                    if(res.status===1){

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

                        let option = this.chart1.getOption();

                        option.xAxis.data=keys
                        option.series[1].data=values
                        this.chart1.setOption(option);
                    }
                })
            },

            //画第一个图的饼状图
            getAlarmDetailStatus(){
                this.loading=true
                getAlarmDealTypeCount(this.alarmForm).then(res=>{
                    this.loading=false
                    if(res.status===1){

                        let values=res.dataValue
                        let lengend=[]
                        let series=[]
                        for(let value in values){
                            let value1=values[value].statusName
                            let s={
                                value:values[value].amount,
                                name:values[value].statusName
                            }
                            lengend.push(value1)
                            series.push(s)
                        }

                        //this.option3.legend[0].data=lengend
                        //this.option3.series[0].data=series

                        let option = this.chart.getOption();

                        option.legend[1].data=lengend
                        option.series[1].data=series

                        this.chart.setOption(option);
                    }
                })
            },

            //报警类型统计数据
            getAlarmCountByType(){
                this.loading=true
                getAlarmCountByType(this.alarmForm).then(res=>{
                    this.loading=false
                    if(res.status===1){
                        let values=res.dataValue
                        let lengend=[]
                        let series=[]
                        for(let value in values){
                            let value1=values[value].alarmTypeName
                            let s={
                                value:values[value].amount,
                                name:values[value].alarmTypeName
                            }
                            lengend.push(value1)
                            series.push(s)
                        }

                        //this.option3.legend[0].data=lengend
                        //this.option3.series[0].data=series

                        let option = this.chart.getOption();

                        option.legend[0].data=lengend
                        option.series[0].data=series

                        this.chart.setOption(option);
                    }
                })
            },

            //查询设备(离线/总数)信息
            getdeviceOfflineStat(){
                this.loading=true
                getOfflineState({systemType:1}).then(res=>{
                    this.loading=false
                    if(res.status===1){
                        this.deviceTotal=res.dataValue.total
                        this.deviceOffline=res.dataValue.offLine
                    }
                })
            },
            //查询报警类型
            getAlarmType(){
                this.loading=true
                getAlarmType({systemType:1}).then(res=>{
                    this.loading=false
                    if(res.status===1){
                        this.alarmTypeList=res.dataValue
                    }
                })
            },
            getDataList(){
                this.loading=true
                getAlarmList(this.searchForm1).then(res=>{
                    this.loading=false

                    if(res.status === 1){
                        this.data=res.dataValue.alarmList
                        this.total=res.dataValue.total
                    }
                })
            },
            //查询报警数量
            getAlarmStatistics(){
                this.loading=true
                getalarmStaticstics({systemType:1}).then(res=>{
                    this.loading=false
                    if(res.status === 1){
                        this.alarmUnhandled=res.dataValue.unhandled
                        this.alarmTotal=res.dataValue.total
                        this.alarmHandled=res.dataValue.handled
                    }
                })
            },
            getStartDataDate(){
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
            changeRadio(v){
                if(v==='alaramcount'){

                }else {

                }
            },
            showMore(){
            },

            changePage(v) {
                this.searchForm1.currentPage = v;
                this.getDataList();
                this.clearSelectAll();
            },
            changePageSize(v) {
                this.searchForm1.length = v;
                //this.getDataList();
            },
            selectDateRange2(v) {
                if (v) {
                    this.searchForm.start = Math.floor(deviceDateUtil.timestamp(v[0],'YYYY-MM-DD')/1000) ;
                    this.searchForm.end = Math.floor(deviceDateUtil.timestamp(v[1],'YYYY-MM-DD')/1000) ;
                }
            },
            showSelect(e) {
                this.exportData = e;
                this.selectList = e;
                this.selectCount = e.length;
            },
            handleClear () {
                this.open = false;
            },
            alarmRadioChange(){
                this.alarmcountAll = !this.alarmcountAll

                if(!this.alarmcountAll){
                    //this.handleOk2();
                    this.getDeviceAlarmCharts1();
                    this.getDataList();
                }
            },
            handleOk2 () {
                this.open = false;
                this.getDeviceAlarmCharts();
            },
            selectDateStart(v) {
                if (v) {
                    this.searchForm.startDate = v;
                }
            },
            selectDateEnd(v) {
                if (v) {
                    this.searchForm.endDate = v;
                }
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
            handleClick () {
                this.open = !this.open;
            },
            handleSearch() {
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.getDataList();
            },
            handleReset() {
                this.$refs.searchForm1.resetFields();
                // 搜索框对应data对象
                this.searchForm1.pageNumber = 1;
                this.searchForm1.placeName="";
                this.searchForm1.deviceId="";
                this.searchForm1.alarmTypeName="";
                this.searchForm1.eroomInfo=[];
                this.searchForm1.inroominfo=[];
                this.searchForm1.pageSize = 10;
                this.searchForm1.startDate = "";
                this.searchForm1.endDate = "";
                this.searchForm.faultTypeName="";
                this.selectCat = [];
                this.searchForm.categoryId = "";
                this.selectAlarmDate="";
                // 重新加载数据
                //this.getDataList();
            },
            getDeviceTypeCountCharts(){
                this.loading = true;
                getDeviceTypeCountChartsData(this.searchForm).then(res => {
                    this.loading = false;
                    if (res.status === 1) {
                        if(res.result.deviceTypeCount.length>0){
                            this.series4[0].data = res.result.deviceTypeCount;
                            this.deviceTickAmount = parseInt(res.result.max);
                            // if(res.result.max<=10){
                            //   this.deviceTickAmount = parseInt(res.result.max)+1;
                            //   this.deviceMax = parseInt(res.result.max)+1;
                            // }else if(res.result.max<=50){
                            //   if(res.result.max%5==0){
                            //     this.deviceTickAmount = parseInt(res.result.max/5)+1;
                            //     this.deviceMax =  Math.ceil(res.result.max/5)*5+5;
                            //   }else{
                            //     this.deviceTickAmount =  Math.ceil(res.result.max/5);
                            //     this.deviceMax = Math.ceil(res.result.max/5)*5;
                            //   }
                            // }else if(res.result.max <=100){
                            //   if(res.result.max%10==0){
                            //     this.deviceTickAmount = parseInt(res.result.max/10)+1;
                            //     this.deviceMax = Math.ceil(res.result.max/10)*10+10;
                            //   }else{
                            //     this.deviceTickAmount = parseInt(res.result.max/10);
                            //     this.deviceMax =  Math.ceil(res.result.max/10)*10;
                            //   }
                            // }else{
                            //   if(res.result.max%100==0){
                            //     this.deviceTickAmount = parseInt(res.result.max/100)+1;
                            //     this.deviceMax = Math.ceil(res.result.max/100)+100;
                            //   }else{
                            //     this.deviceTickAmount = parseInt(res.result.max/100);
                            //     this.deviceMax = Math.ceil(res.result.max/100)*100;
                            //   }
                            // }
                            this.chartOptions4= {
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
                                // yaxis: {
                                //   tickAmount:1,
                                //   min: 0,
                                //   max:  this.deviceMax
                                // },
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
            getDevicePoliceAndFaultChartsData() {
                let _this=this
                this.loading = true;
                getDevicePoliceAndFaultChartsData(this.searchForm).then(res => {
                    this.loading = false;
                    if (res.status === 1) {

                        let option = {
                            title:{
                                show:false
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            color: ['#ff4f50', '#ffb83f'],
                            legend: {
                                position: 'top',
                                horizontalAlign: 'center',
                                floating: true,
                                offsetY: -25,
                                offsetX: -5
                            },
                            grid: {
                                bottom: '20%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: res.result.deviceFaultChartsX
                            },
                            yAxis: {
                                type: 'value'
                            },
                            dataZoom:{
                                start:0,//默认为0
                                end: 100,//默认为100
                                type: 'slider',
                                show: true,
                                height: 8,//组件高度
                                handleColor: '#1E90FF',//h滑动图标的颜色
                                handleStyle: {
                                    borderColor: "#1E90FF",
                                    borderWidth: "1",
                                    shadowBlur: 2,
                                    background: "#1E90FF",
                                    shadowColor: "#1E90FF",
                                },
                                backgroundColor: '#ddd',//两边未选中的滑动条区域的颜色
                                showDataShadow: false,//是否显示数据阴影 默认auto
                                showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
                                handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                                filterMode: 'filter',
                                fillerColor:'#1E90FF'
                            },
                            series: [
                                {
                                    name: "报警",
                                    type:'line',
                                    data: res.result.serverAlarmChartsY
                                },
                                {
                                    name: "故障",
                                    type:'line',
                                    data: res.result.deviceFaultChartsY
                                }
                            ]
                        };

                        this.chart1.setOption(option);

                    }
                });
            },
            getStartDataDate(){
                //获取系统当前时间
                var nowdate = new Date();
                nowdate.setMonth(nowdate.getMonth()-1);
                var startTime = Math.floor(nowdate.getTime()/1000)
                return startTime
            },
            getDeviceAlarmCharts() {
                let _this=this
                this.loading = true;
                getalarmTrendDiagram(this.searchForm).then(res => {
                    this.loading = false;
                    if (res.status === 1) {

                        var charttrend=echarts.init(document.getElementById('trendchart'));

                        let keys=[]
                        let values=[]
                        let reData=res.dataValue

                        for (let property in reData){
                            let obj = reData[property]

                            let key=obj['time'].replace(new RegExp('/','gm'),'-')
                            let value=obj['count']

                            keys.push(key)
                            values.push(value)

                        }

                        let option=  {
                            title:{
                                show:false
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            color: ['#FF69B4'],
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

                        charttrend.setOption(option)
                    }
                });
            },
            getDeviceAlarmCharts1() {
                let startTime=this.getStartDataDate()
                let _this=this
                this.loading = true;
                this.searchForm.start = startTime
                getalarmTrendDiagram(this.searchForm).then(res => {
                    this.loading = false;
                    if (res.status === 1) {
                        var charttrend=echarts.init(document.getElementById('trendchart'));
                        let keys=[]
                        let values=[]
                        let reData=res.dataValue

                        for (let property in reData){
                            let obj = reData[property]

                            let key=obj['time'].replace(new RegExp('/','gm'),'-')
                            let value=obj['count']

                            keys.push(key)
                            values.push(value)

                        }

                        let option= {
                            title:{
                                show:false
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            color: ['#FF69B4'],
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
                            series:[{
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
                            }],
                        };


                        charttrend.setOption(option)
                    }
                });
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
                        deleteAlarmDelete( {ids:ids} ).then(res => {
                            this.operationLoading = false;
                            if (res.status ===1) {
                                this.$Message.success("操作成功");
                                this.clearSelectAll();
                                this.getDataList();
                                this.getAlamCharts();
                            }
                        });
                    }
                });
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
                //this.selectAlarmDate=[endDate,startDate];
               //this.faultrendDate=[endDate,startDate];
            },
            selectAlamDateRange(v) {
                if (v) {
                    let start=deviceDateUtil.timestamp(v[0],'YYYY-MM-DD');
                    let end=deviceDateUtil.timestamp(v[1],'YYYY-MM-DD');

                    let startTime,endTime

                    if(start>end){
                        startTime=Math.floor(end/1000)
                        endTime=Math.floor(start/1000)
                    }else {
                        startTime=Math.floor(start/1000)
                        endTime=Math.floor(end/1000)
                    }

                    this.searchForm1.start = startTime;
                    this.searchForm1.end = endTime;
                }
            },
            changePlaceRadio(value){
                if(value === 'outdoor'){
                    this.searchForm1.isOutdoor=1
                }else if(value === 'indoor'){
                    this.searchForm1.isOutdoor=0
                }else {
                    this.searchForm1.isOutdoor=''
                }
            },
            handleOutdoor(value){
                console.log("outdoor:"+value)
            },
            handleindoor(value){
                console.log("indoor:"+value)
            },
            handleDate(value){
                return deviceDateUtil.format(value*1000,'YYYY-MM-DD HH:MM:SS');
            },
            getAlarmTypeName(v){
                let alarmName=''
                if(this.alarmTypeList.length>0){
                    for (let i in this.alarmTypeList){
                        if(this.alarmTypeList[i].id===v){
                            alarmName = this.alarmTypeList[i].name
                            break
                        }
                    }
                }else {
                    getAlarmType({systemType: 1}).then(res=>{
                        this.loading=false
                        if(res.status===1){
                            this.alarmTypeList=res.dataValue

                            for (let i in this.alarmTypeList){
                                if(this.alarmTypeList[i].id===v){
                                    alarmName = this.alarmTypeList[i].name
                                    break
                                }
                            }
                        }
                    })
                }

                return alarmName
            },
            batchProcess(){
                let that = this;
                let statustrue= true;
                if (this.selectCount <= 0) {
                    this.$Message.warning("您还未选择要处理的报警");
                    return;
                }


                this.selectList.forEach(function(e) {
                    if(e.status !== 0  && e.status!== '0'){
                        that.$Message.warning("只能处理【未处理】的故障信息");
                        statustrue = false;
                    }
                });
                if(statustrue){
                    this.modalTitle ='批量处理'
                    this.dealModelValidate=true
                    this.makestatus='1'
                    this.dealMsg=''
                }
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
                        status:this.makestatus,
                        dealDetail:this.dealMsg
                    }

                    this.submitLoading = true;

                    postAlaramDetail(params).then(res=>{
                        this.submitLoading=false
                        if(res.status === 1){
                            this.$Message.success("操作成功");
                            this.dealModelValidate=false
                            this.clearSelectAll();
                            this.getDataList();
                            this.getDeviceAlarmCharts();
                        }
                    })
                }
            },
        },
        mounted() {
            this.init()
        },
        created() {
        }
    }
</script>

<style scoped>

</style>