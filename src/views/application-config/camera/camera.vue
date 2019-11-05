<style lang="less">
    @import "./camera.less";
</style>

<template>
    <div class="search">
        <Row>
            <Col style="width: 100%;">
                <Card>
                    <Row @keydown.enter.native="handleSearch">
                        <Form ref="searchForm" :model="searchForm" inline :label-width="75" class="search-form">
                            <Form-item label="摄像机类型" prop="cameraType" style="padding-left: 10px" v-show="false">
                                <Select v-model="cameraSelect" @on-change="changeCameraSelect" style="width: 200px">
                                    <Option v-for="(item,index) in cameraTypeList" :key="index" :value="item.id">{{item.name}}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="所属设备" prop="cameraType" style="padding-left: 15px">
                                <Select v-model="equitmentSelct" @on-change="changeOwnEquitSelect" style="width: 200px" disabled>
                                    <Option v-for="(item,index) in ownEquipmentList" :key="index" :value="item.id">{{item.name}}</Option>
                                </Select>
                            </Form-item>
                            <!--<Form-item label="添加时间">-->
                            <!--<DatePicker-->
                            <!--v-model="selectDate"-->
                            <!--type="daterange"-->
                            <!--format="yyyy-MM-dd"-->
                            <!--clearable-->
                            <!--@on-change="selectDateRange"-->
                            <!--placeholder="选择起始时间"-->
                            <!--style="width: 200px"-->
                            <!--&gt;</DatePicker>-->
                            <!--</Form-item>-->
                            <Form-item style="margin-left:-35px;" class="br">
                                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                                <Button @click="handleReset" >重置</Button>
                            </Form-item>
                        </Form>
                    </Row>
                    <Row class="operation">
                        <div style="padding-left: 15px">
                            <Button @click="add" type="primary" icon="md-add">添加</Button>
                            <Button @click="removeAll" icon="md-trash">批量删除</Button>
                            <Button @click="getDataList" icon="md-refresh">刷新</Button>
                            <circleLoading v-if="operationLoading"/>
                        </div>
                    </Row>
                    <Row style="padding-top: 10px;">
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
                        <!--<Table-->
                                <!--:columns="exportColumns"-->
                                <!--:data="exportData"-->
                                <!--ref="exportTable"-->
                                <!--style="display:none;"-->
                        <!--&gt;</Table>-->
                    </Row>
                    <Row type="flex" justify="end" class="page" style="margin-top: 10px;">
                        <Page
                                :current="searchForm.pageNumber"
                                :total="total"
                                :page-size="searchForm.pageSize"
                                @on-change="changePage"
                                @on-page-size-change="changePageSize"
                                :page-size-opts="[15,30,45]"
                                size="small"
                                show-total
                                show-elevator
                                show-sizer
                        ></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal :title="modalTitle"
               v-model="showCameraForm"
               :mask-closable="false"
               :width="500"
               :styles="{top: '30px'}"
               >
            <Form ref="cameraForm" :model="cameraForm" :label-width="120" :rules="cameraFormValidate">
                <FormItem label="id" v-show="isEdit===true" prop="id">
                    <Input v-model="cameraForm.id" disabled></Input>
                </FormItem>
                <FormItem label="摄像头名称:" prop="name">
                    <Input autocomplete="off" v-model="cameraForm.name"/>
                </FormItem>
                <FormItem label="摄像头用户:" prop="user">
                    <Input autocomplete="off" v-model="cameraForm.user"/>
                </FormItem>
                <FormItem label="摄像头密码:" prop="password">
                    <Input type="password" autocomplete="off" v-model="cameraForm.password"/>
                </FormItem>
                <FormItem label="摄像头IP:" prop="ip">
                    <Input autocomplete="off" v-model="cameraForm.ip"/>
                </FormItem>
                <FormItem label="摄像头端口:" prop="port">
                    <Input type="number" autocomplete="off" v-model="cameraForm.port" >{{cameraForm.port}}</Input>
                </FormItem>
                <FormItem label="通道:" prop="channel">
                    <Input autocomplete="off" v-model="cameraForm.channel"/>
                </FormItem>
                <FormItem label="摄像头协议:" prop="codingProtocal">
                    <Input autocomplete="off" v-model="cameraForm.codingProtocal"/>
                </FormItem>
                <FormItem label="摄像头传输流:" prop="bitstream">
                    <Input autocomplete="off" v-model="cameraForm.bitstream"/>
                </FormItem>
                <FormItem label="摄像头buffer流:" prop="buffer">
                    <Input autocomplete="off" v-model="cameraForm.buffer"/>
                </FormItem>
                <FormItem label="摄像头终端ID:" prop="terminalId">
                    <Input autocomplete="off" v-model="cameraForm.terminalId"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelCamera">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitCamera">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {
        addCamera,
        editCamera,
        deleteCamera,
        getCameraList,
        checkName
    } from "@/api/index1";


    export default {
        name: "camera",
        data(){
            const isPort = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('输入不可以为空'));
                }
                if (value == '' || typeof(value) == undefined) {
                    callback(new Error('请输入端口值'));
                } else {
                    const re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
                    const rsCheck = re.test(value);
                    if (!rsCheck) {
                        callback(new Error('请输入在[0-65535]之间的端口值'));
                    } else {
                        callback();
                    }
                }
            };
            const validateName = (rule, value, callback) =>{
                let nameFrom={
                    name:value,
                    id:this.editId
                }
                checkName(nameFrom).then(res=>{
                    if(res.status === 0){
                        callback(new Error("摄像头名称不可用"));
                    }else {
                        if(res.dataValue===1){
                            callback()
                        }else {
                            callback(new Error("摄像头名称不可用"));
                        }
                    }
                }).finally(()=>{
                    callback()
                })

            };
            //Ip 格式验证
            const validateIP = (rule, value, callback) => {
                var reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if (!reg.test(value)) {
                    callback(new Error("Ip 格式不正确"));
                } else {
                    callback();
                }
            };
            return{
                cameraSelect:'',
                equitmentSelct:'0',
                selectDate: null, // 选择日期绑定modal
                exportData: [], // 导出数据
                selectList: [], // 多选数据
                selectCount: 0, // 多选计数
                modalTitle: "",
                modalType: 0,
                editId:'',
                submitLoading: false,
                loading: true,
                searchForm: {
                    // 搜索框对应data对象
                    currentPage: 1, // 当前页数
                    pageSize: 15, // 页面大小
                    cameraId:1,
                   // sort: "id", // 默认排序字段
                    //order: "desc", // 默认排序方式
                    //startDate: "", // 起始时间
                    //endDate: "", // 终止时间
                    //delFlag: 0 //删除标记
                },
                cameraTypeList:[
                    {
                        id:'0',
                        name:'全部'
                    },
                    {
                        id:'1',
                        name:'大华常规摄像机'
                    },
                    {
                        id:'2',
                        name:'宇视乐橙摄像机'
                    },
                    {
                        id:'3',
                        name:'宇视常规摄像机'
                    },
                    {
                        id:'4',
                        name:'海康常规摄像机'
                    },
                    {
                        id:'5',
                        name:'海康萤石摄像机'
                    },
                ],
                ownEquipmentList:[
                    {
                        id:'0',
                        name:'全部'
                    },
                ],
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
                        title: "名称",
                        key: "name",
                        minWidth: 180,
                        align: "center",
                    },
                    {
                        title: "IP地址",
                        key: "ip",
                        width: 150,
                        align: "center",
                    },
                    {
                        title: "端口",
                        key: "port",
                        width: 100,
                        align: "center",
                    },
                    {
                        title: "通道",
                        key: "channel",
                        width: 120,
                        align: "center",
                    },
                    {
                        title: "通信协议",
                        key: "codingProtocal",
                        width: 120,
                        align: "center",
                    },
                    {
                        title: "传输流",
                        key: "bitstream",
                        width: 150,
                        align: "center",
                    },
                    {
                        title: "buffer",
                        key: "buffer",
                        align: "center",
                        width: 150,
                    },
                    {
                        title: "terminalId ",
                        key: "terminalId",
                        align: "center",
                        minWidth: 180,
                    },
                    {
                        title: "使用者",
                        key: "user",
                        minWidth: 150,
                        align: "center",
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
                data:[
                    {
                        codingProtocal:'h264',
                        password: "Mariry602123",
                        port: 554,
                        ip: "172.16.20.85",
                        channel: "ch1",
                        name: "?????",
                        bitstream: "sub",
                        buffer: "av_stream",
                        id: 1,
                        terminalId: "tb221932T001",
                        user: "admin"
                    }
                ],
                cameraForm:{
                    name:'',
                    user:'',
                    password:'',
                    codingProtocal:'h264',
                    ip:"",
                    port:0,
                    channel:'',
                    bitstream:'',
                    buffer:'',
                    terminalId:'',
                },
                cameraFormValidate:{
                    name: [
                        { required: true, message: "摄像头名称不能为空", trigger: "blur" },
                        { validator: validateName , trigger:"blur"}
                    ],
                    user: [
                        { required: true, message: "摄像头使用者不能为空", trigger: "blur" },
                    ],
                    password: [
                        { required: true, message: "密码称不能为空", trigger: "blur" }
                    ],
                    ip: [
                        { required: true, message: "摄像头IP不能为空", trigger: "blur" },
                        { validator: validateIP , trigger:"blur"}
                    ],
                    codingProtocal: [
                        { required: true, message: "传输类型不能为空", trigger: "blur" }
                    ],
                    channel: [
                        { required: true, message: "摄像头通道不能为空", trigger: "blur" }
                    ],
                    bitstream: [
                        { required: true, message: "摄像头传输类型不能为空", trigger: "blur" }
                    ],
                    buffer: [
                        { required: true, message: "摄像头传输流类型不能为空", trigger: "blur" }
                    ],
                    terminalId: [
                        { required: true, message: "摄像头终端不能为空", trigger: "blur" }
                    ],
                    port: [
                        { required: true, },
                        { validator:isPort, message:"端口格式不对"  }
                    ],
                },
                showCameraForm:false,
                isEdit:false,

            }
        },
        methods:{
            init(){
                this.getDataList();
            },
            changeCameraSelect(index){},
            changeOwnEquitSelect(index){},
            handleSearch() {
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.getDataList();
            },
            getDataList() {
                // 多条件搜索获取表格数据
                this.loading = true;
                getCameraList(this.searchForm).then(res => {
                    this.loading = false;
                    if (res.status === 1) {
                        this.data = res.dataValue.cameraList;
                        this.total = res.dataValue.total;
                    }
                });
                this.exportData = this.data;
                this.total = this.data.length;
                this.loading = false;
            },
            handleReset() {
                this.$refs.searchForm.resetFields();
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 15;
                this.selectDate = null;
                this.searchForm.startDate = "";
                this.searchForm.endDate = "";
                this.selectCat = [];
                this.searchForm.terminalId = 1;
                // 重新加载数据
                this.getDataList();
            },
            showSelect(e) {
                this.exportData = e;
                this.selectList = e;
                this.selectCount = e.length;
            },
            clearSelectAll() {
                this.$refs.table.selectAll(false);
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
                        deleteCamera(ids).then(res => {
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
            changeSort(e) {
                this.searchForm.sort = e.key;
                this.searchForm.order = e.order;
                if (e.order == "normal") {
                    this.searchForm.order = "";
                }
                this.getDataList();
            },
            add() {
                this.modalType = 0;
                this.modalTitle = "添加摄像头";
                this.$refs.cameraForm.resetFields();
                this.editId=''
                this.showCameraForm = true;
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.getDataList();
            },
            submitCamera(){
                let _this=this
                this.$refs.cameraForm.validate(valid=>{
                    if(valid){
                        if(this.modalType ===0){
                            //添加摄像头，避免编辑后传入id
                            delete this.cameraForm.id
                            this.submitLoading = true;

                            addCamera(this.cameraForm).then(res=>{
                                this.submitLoading=false
                                if(res.status===1){
                                    _this.$Message.success('操作成功')
                                    _this.getDataList()
                                    this.showCameraForm=false
                                }else {
                                    _this.$Message.success(res.message)
                                }
                            });
                        }else {
                            //编辑
                            this.submitLoading=true
                            editCamera(this.cameraForm).then(res=>{
                                this.submitLoading=false
                                if(res.status===1){
                                    this.showCameraForm=false
                                    this.$Message.success("修改操作成功");
                                    this.getDataList();
                                }else {
                                    _this.$Message.success(res.message);
                                }
                            })
                        }
                    }

                })
            },
            edit(v){
                this.modalType=1;
                this.modalTitle="编辑摄像头"
                this.$refs.cameraForm.resetFields()

                //转换null为""
                for(let attr in v){
                    if(v[attr]=== null){
                        v[attr]=""
                    }
                }
                let str=JSON.stringify(v)
                let data=JSON.parse(str)
                this.cameraForm=data;
                this.editId=data.id
                this.showCameraForm=true
            },
            details(v) {
                let query = { id: v.id, name: v.name,user:v.user , ip:v.ip , port:v.port , terminalId:v.terminalId,buffer:v.buffer,
                    bitstream:v.bitstream ,channel:v.channel,codingProtocal:v.codingProtocal, backRoute: this.$route.name };
                this.$router.push({
                    name: "detail_camera",
                    query: query
                });
            },
            cancelCamera(){
                this.showCameraForm=false
            },
            removeAll() {
                if (this.selectCount <= 0) {
                    this.$Message.warning("您还未选择要删除的数据");
                    return;
                }
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要删除所选的 " + this.selectCount + " 个记录?",
                    onOk: () => {
                        let ids = "";
                        this.selectList.forEach(function(e) {
                            ids += e.id + ",";
                        });
                        ids = ids.substring(0, ids.length - 1);
                        this.operationLoading = true;
                        let deleteForm={
                            ids:''
                        }

                        deleteForm.ids=ids

                        deleteCamera(deleteForm).then(res => {
                            this.operationLoading = false;
                            if (res.status) {
                                this.$Message.success("批量删除摄像头成功");
                                this.clearSelectAll();
                                this.getDataList();
                            }
                        });
                    }
                });
            },
        },
        mounted() {
            this.init();
        },
    }
</script>

<style scoped>

</style>
