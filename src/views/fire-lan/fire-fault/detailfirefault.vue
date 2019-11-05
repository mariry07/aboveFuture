<template>
    <div class="fault-detail">
        <Row :gutter="6">
            <Col span="2">
                <Button @click="handelCancel" icon="md-arrow-back">返回</Button>
            </Col>
            <Col span="4">
            <span>
                <Tabs value="faultdetail" @on-click="handleTabs">
                    <TabPane label="故障详情" name="faultdetail"></TabPane>
                    <TabPane label="故障历史" name="faulthistory"></TabPane>
                </Tabs>
            </span>
            </Col>
        </Row>

        <div>
            <div class="f-d-contain" v-show="curtab==='faultdetail'">
                <section v-show="form.status === 0">
                    <h2>处理故障 {{form.id}}</h2>
                    <div class="dec-lable">处理备注&nbsp;：</div>
                    <div class="el-textarea">
                        <Input placeholder="请输入处理备注" v-model="remarks" type="textarea" rows="2" style="min-height: 33px;"></Input>
                    </div>
                    <div class="btn-wrp">
                        <Button type="warning" size="large" @click="handleSubmit">提交</Button>
                    </div>
                </section>
                <section v-show="form.status === 1">
                    <h2>处理结果</h2>
                    <div class="dec-lable">处理备注&nbsp;：
                        <span class="">{{faultDetail.dealDetail}}</span>
                    </div>
                    <div class="btn-wrp">
                        <Button type="info" icon="md-add" size="large">添加到维保服务</Button>
                    </div>
                </section>
                <section class="detail-section">
                    <h2>故障详情</h2>
                    <div class="section-box" style="margin-top: 5px;">
                        <div class="section-list">
                            <span class="s-b-lable">设备名称&nbsp;：</span>
                            <span class="s-b-value">{{faultDetail.name}}</span>
                        </div>
                        <div class="section-list"><span class="s-b-lable">设备编号&nbsp;：</span>
                            <span class="s-b-value">{{ faultDetail.code}}</span>
                        </div><div class="section-list">
                        <span class="s-b-lable">故障发生时间&nbsp;：</span>
                        <span class="s-b-value">{{  faultDetail.addTime | dataFormat}}</span>
                    </div>
                        <div class="section-list">
                            <span class="s-b-lable">地理位置&nbsp;：</span>
                            <span class="s-b-value tpson-mouse-hand">{{faultDetail.position}}</span>
                        </div>
                        <div class="section-list">
                            <span class="s-b-lable">故障类型&nbsp;：</span>
                            <span class="s-b-value">{{faultDetail.type_name}}</span></div>
                        <div class="section-list">
                            <span class="s-b-lable">故障次数&nbsp;：</span>
                            <span class="s-b-value">{{faultDetail.count}}</span>
                        </div>
                        <div class="section-list">
                            <span class="s-b-lable">第一负责人&nbsp;：</span>
                            <span class="s-b-value">{{faultDetail.deviceMan}}</span></div>
                        <div class="section-list">
                            <span class="s-b-lable">联系方式&nbsp;：</span>
                            <span class="s-b-value">{{faultDetail.devicePhone}}</span>
                        </div>
                        <div class="section-list">
                            <span class="s-b-lable">处理状态&nbsp;：</span>
                            <span class="s-b-value">{{faultDetail.status === '0'?"已处理":"未处理"}}</span>
                        </div>
                    </div>
                </section>
                <section class="detail-section">
                    <h2>设备详情</h2>
                    <div class="section-box" style="margin-top: 5px;">
                        <div class="section-list">
                            <span class="s-b-lable">设备名称&nbsp;：</span>
                            <span class="s-b-value">{{ faultDetail.name }}</span>
                        </div>
                        <div class="section-list">
                            <span class="s-b-lable">设备编号&nbsp;：</span>
                            <span class="s-b-value">{{ faultDetail.code}}</span>
                        </div>
                        <div class="section-list">
                            <span class="s-b-lable">版本号&nbsp;：</span>
                            <span class="s-b-value">{{ faultDetail.deviceVersionName }}</span>
                            <!--<span class="s-b-value">{{ getDeviceeTypNameById(deviceDetail.version) }}</span>-->
                        </div>
                        <div class="section-list">
                            <span class="s-b-lable">责任部门&nbsp;：</span>
                            <span class="s-b-value"> {{faultDetail.departmentName === null}}- {{ faultDetail.departmentName }}</span>
                        </div>
                        <div class="section-list" v-for="(item ,index) in faultDetail.man">
                            <span class="s-b-lable">责任人&nbsp;：</span>
                            <span class="s-b-value">{{item}} - {{ faultDetail.phone[index] }}</span>
                        </div>
                        <!--<div class="section-list">-->
                        <!--<span class="s-b-lable">责任人&nbsp;：</span>-->
                        <!--<span class="s-b-value">王凯 - 17706534656</span>-->
                        <!--</div>-->
                        <div class="section-list">
                            <span class="s-b-lable">设备地理位置&nbsp;：</span>
                            <span class="s-b-value tpson-mouse-hand">{{ faultDetail.position }}</span>
                        </div>
                    </div>
                </section>
            </div>

            <div class="hidden-scrollbar" id="alarm-history" v-show="curtab==='faulthistory'">
                <div style="text-align: center;margin-bottom: 24px;">
                    <span style="margin-right: 50px">故障发生时间</span>
                    <DatePicker
                            v-model="startDate"
                            type="date"
                            format="yyyy-MM-dd"
                            @on-change="selectDateRange1"
                            placeholder="选择开始时间"
                            style="width: 200px"
                    ></DatePicker>
                    <span style="margin: 5px 5px;">至</span>
                    <DatePicker
                            v-model="endDate"
                            type="date"
                            format="yyyy-MM-dd"
                            @on-change="selectDateRange2"
                            placeholder="选择结束时间"
                            style="width: 200px"
                    ></DatePicker>
                </div>
                <Row>
                    <Table
                            :loading="loading"
                            border
                            :columns="columns"
                            :data="data"
                            sortable="custom"
                            @on-selection-change="showSelect"
                            ref="table"
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
            </div>
        </div>

    </div>
</template>

<script>
    import {
        getDeviceInfoById,
        getdeviceType,
        getfaultDetail,
        getlanalarmfaultList,
        updateFaultDetail,
        getFaultType
    } from "@/api/index1";

    import circleLoading from "@/views/my-components/circle-loading.vue";
    import deviceDateUtil from '@/views/patrol/device/deviceDateUtil.vue'
    import { max } from 'date-fns';

    export default {
        name: "detail_fireAlarm",
        components: {
            circleLoading,
        },
        data(){
            return {
                loading:false,
                startDate:'',
                endDate:'',
                remarks:'',
                deviceType:[],
                curtab:'faultdetail',
                form:{
                    id:'',
                    deviceId:'',
                    status:'',
                    deviceCode:''
                },
                faultDetail:{
                    name:'用户传输',
                    code:'18120079',
                    addTime: 1570756025,
                    position:'中国电科-凤凰城-消控室',
                    type_name:' 通用传感器故障',
                    count:'10',
                    firstMan:'王凯',
                    phone:'17706534656',
                    status:'0',
                    man:[],
                    phone:[],
                    dealDetail:'marks'

                },
                backRoute:'',
                deviceTypeName:'',
                deviceVersion:'',
                searchForm:{
                    systemType:1,
                    startTime:'',
                    endTime:'',
                    deviceCode:'',
                    currentPage:1,
                    length:10
                },
                columns: [
                    {
                        title: "监测点名称",
                        key: "detail",
                        minWidth: 200,
                        align: "center",
                        fixed: "left"
                    },
                    {
                        title: "故障类型",
                        key: "type",
                        align: "center",
                        minWidth: 200,
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
                                            innerHTML:  this.getTypeName(params.row.type)
                                        }
                                    }
                                )
                            ])
                        }
                    },
                    {
                        title: "处理人",
                        key: "deviceMan",
                        minWidth: 150,
                        align: "center",
                        fixed: "left"
                    },
                    {
                        title: "故障发生时间",
                        key: "addTime",
                        align: "center",
                        sortType: "desc",
                        minWidth: 200,
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
                        title: "故障处理时间",
                        key: "updateTime",
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
                                            innerHTML:this.handleDate(params.row.dealTime)
                                        }
                                    }
                                )
                            ])
                        }
                    },
                    {
                        title: "处理备注",
                        key: "dealDetail",
                        align: "center",
                        minWidth: 200,
                        fixed: "left",
                    }
                ],
                data:[],
                selectCount: 0, // 多选计数
                selectList: [], // 多选数据
                total:0,
            }
        },
        methods:{
            // 关闭当前页面
            closeCurrentPage() {
                this.$store.commit("removeTag", "detail_fireAlarm");
                localStorage.pageOpenedList = JSON.stringify(
                    this.$store.state.app.pageOpenedList
                );
                this.$router.push({
                    name: this.backRoute
                });
            },
            init(){
                this.backRoute = this.$route.query.backRoute;
                this.form.id=this.$route.query.id;
                this.form.deviceId=this.$route.query.deviceId;
                this.form.deviceCode=this.$route.query.deviceCode;
                this.form.status=this.$route.query.status;

                this.getfaultDetailbyId(this.form.id);

            },
            getDeviceType(){
                //this.loading=true;
                getdeviceType({deviceType:'7'}).then(res=>{
                    if(res.status === 1){
                        this.deviceType=res.dataValue;
                    }
                })
            },
            getDeviceTypeName(id){
                //this.loading=true;
                let typename=''

                getdeviceType({deviceType:'7'}).then(res=>{
                    if(res.status === 1){
                        this.deviceType=res.dataValue;
                    }
                }).then(res=>{
                    this.getDeviceeTypNameById(id);
                })

                return typename
            },
            getDeviceeTypNameById(id){
                let typeName='unKnow';
                if(this.deviceType.length<=0){
                    typeName = this.getDeviceTypeName();
                }else {
                    for(let t in this.deviceType){
                        if(this.deviceType[t].id === id){
                            typeName = this.deviceType[t].name
                            break;
                        }
                    }
                }

                return typeName
            },
            handelCancel() {
                this.closeCurrentPage();
            },
            handleTabs(t){
                this.curtab=t

                if(t === 'faulthistory'){
                    this.getLanalarmfaultList()
                }
            },
            details(v) {
                let query={id:this.id,status:v.status,backRoute: this.$route.name}
                this.$router.push({
                    name: "detail_lanalarm",
                    query: query
                });
            },
            getfaultDetailbyId(deviceId){
                getfaultDetail({id:deviceId}).then(res=>{
                    if(res.status === 1){
                        let mans=res.dataValue.man.split(',')
                        let phones=res.dataValue.phone.split(',')
                        this.faultDetail=res.dataValue

                        this.faultDetail.man=mans
                        this.faultDetail.phone=phones
                    }

                })
            },
            handleSubmit(){
                let submit={
                    id:this.form.id,
                    dealDetail:this.remarks
                }
                updateFaultDetail(submit).then(res=>{
                    if(res.status===1){
                        this.$Message.success("操作成功");
                        // this.form.status = 1
                        // this.faultDetail.dealDetail=this.remarks
                        this.closeCurrentPage();
                    }
                })
            },
            selectDateRange1(v) {
                if (v.length>=1 ) {
                    this.searchForm.startTime = Math.floor(deviceDateUtil.timestamp(v,'YYYY-MM-DD')/1000) ;
                }
            },
            selectDateRange2(v) {
                if (v.length>=1 ) {
                    this.searchForm.endTime = Math.floor(deviceDateUtil.timestamp(v,'YYYY-MM-DD')/1000) ;

                    if(this.searchForm.startTime >this.searchForm.endTime){
                        this.$Message.success("开始时间要早于结束时间");
                    }else {
                        this.getLanalarmfaultList()
                    }
                }
            },
            showSelect(e) {
                this.exportData = e;
                this.selectList = e;
                this.selectCount = e.length;
            },
            getLanalarmfaultList(){
                this.loading = true;
                this.searchForm.deviceCode=this.form.deviceCode
                getlanalarmfaultList(this.searchForm).then(res=>{
                    this.loading = false;
                    if(res.status === 1){
                        this.data=res.dataValue.faultList
                        this.total = res.dataValue.total;
                    }
                })
            },
            handleDate(value){
                if(value === '' || value === null){
                    return ''
                }

                return deviceDateUtil.format(value*1000,'YYYY-MM-DD HH:MM:SS');
            },
            getFaultType(){
                getFaultType({systemType:'1'}).then(res=>{
                    if(res.status === 1){
                        this.faultTypeList=res.dataValue;
                    }
                })
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
            changePage(v) {
                this.searchForm.currentPage = v;
                this.getLanalarmfaultList();
                this.clearSelectAll();
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
            },
            changePageSize(v) {
                this.searchForm.length = v;
                this.getLanalarmfaultList();
            },
        },
        created(){
            this.getFaultType();
            this.getDeviceType();
        },
        mounted() {
            this.init()
        },
        filters:{
            dataFormat(time) {
                let dateTime=Number(time);

                return deviceDateUtil.format(dateTime*1000,'YYYY-MM-DD HH:MM:SS');
            }
        },
        watch:{
            // 监听路由变化
            $route$route(to, from) {
                if (to.name === "lanfault") {
                    this.form.id=this.$route.query.id;
                    this.form.status=this.$route.query.status
                    this.backRoute = this.$route.query.backRoute;
                    this.form.deviceId=this.$route.query.deviceId;
                    this.form.deviceCode=this.$route.query.deviceCode;

                    this.getfaultDetailbyId(this.form.id);
                }
            }
        }
    }
</script>

<style scoped>
    .fault-detail{
        padding: 20px;
        overflow-y: auto;
        background-color: #ffffff;
        width: 100%;
        height: 100%;
    }
    .dec-lable{
        margin: 10px 0;
        font-weight: bold;
    }
    .el-textarea {
        display: inline-block;
        width: 100%;
        vertical-align: bottom;
        font-size: 14px;
    }
    .btn-wrp {
        height: 50px;
        text-align: right;
        padding: 20px;
    }

    .detail-section {
        margin-top: 25px;
        position: relative;
    }
    .section-box {
        width: 100%;
        display: flex;
        flex-direction: row;
        display: inline-block;
        padding: 20px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    .section-list {
        width: 25%;
        line-height: 2.3vw;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        font-family: "MicrosoftYaHei";
    }

    .s-b-lable {
        color: #999;
    }

    .hidden-scrollbar{
        height: calc(100vh - 160px);
        margin-right: 50px;
        margin-left: 50px;
    }
</style>