<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Tabs :animated="false">
            <TabPane label="设备管理">
              <Row @keydown.enter.native="handleSearch">
                <Form
                  ref="searchForm"
                  :model="searchForm"
                  inline
                  :label-width="40"
                  class="search-form"
                >
                  <Form-item label="设备名称" prop="name" inline :label-width="70">
                    <Input
                      type="text"
                      v-model="searchForm.name"
                      placeholder="请输入设备名称"
                      clearable
                      style="width: 200px"
                    />
                  </Form-item>
                  <Form-item label="设备类型" prop="deviceTypeName" inline :label-width="70">
                    <Input
                      type="text"
                      v-model="searchForm.deviceTypeName"
                      placeholder="请输入设备类型名称"
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
                      <Option v-for="(item, i) in dictPlanType" :key="i" :value="item.value">{{item.title}}</Option>
                    </Select>
                  </Form-item>
                  <Form-item style="margin-left:-35px;" class="br">
                    <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    <Button @click="handleReset">重置</Button>
                  </Form-item>
                </Form>
              </Row>
              <Row class="operation">
                <Button @click="add" type="primary" icon="md-add">添加</Button>
                <Button @click="delAll" icon="md-trash">批量删除</Button>
                <Button @click="getDataList" icon="md-refresh">刷新</Button>
                <circleLoading v-if="operationLoading"/>
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
                  ref="table"
                  sortable="custom"
                  @on-sort-change="changeSort"
                  @on-selection-change="changeSelect"
                ></Table>
              </Row>
              <Row type="flex" justify="end" class="page">
                <Page
                  :current="pageNumber"
                  :total="total"
                  :page-size="pageSize"
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
            <TabPane name="tree" label="设备类型管理">
              <device-tree/>
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable="false" :width="500">
      <Form ref="form" :model="form" :label-width="70" :rules="formValidate">
        <FormItem label="设备名称" prop="name">
          <Input v-model="form.name" style="width:100%"/>
        </FormItem>
         <FormItem label="所属巡查点" prop="siteId">
              <Select
                :loading="siteLoading"
                not-found-text="暂无巡查点数据"
                v-model="form.siteId"
              >
                <Option v-for="item in sites" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
        <Form-item label="设备类型">
          <deviceType-tree-choose  style="width: 100%" @on-change="handleSelectDeviceTypeTree" ref="deviceTypeTree"></deviceType-tree-choose>
        </Form-item>
        <FormItem label="设备编码" prop="code">
          <Input v-model="form.code" style="width:100%"/>
        </FormItem>
        <FormItem label="设备型号" prop="model">
          <Input v-model="form.model" style="width:100%"/>
        </FormItem>
        <FormItem label="设备规格" prop="spec">
          <Input v-model="form.spec" style="width:100%"/>
        </FormItem>
        <FormItem label="设备厂商" prop="manufactor">
          <Input v-model="form.manufactor" style="width:100%"/>
        </FormItem>
        <FormItem label="设备品牌" prop="brand">
          <Input v-model="form.brand" style="width:100%"/>
        </FormItem>
        <FormItem label="供货单位" prop="provider">
          <Input v-model="form.provider" style="width:100%"/>
        </FormItem>
        <FormItem label="出厂日期" prop="productTime">
          <DatePicker type="date" v-model="form.productTime" placeholder="请选择日期" style="width:100%"></DatePicker>
        </FormItem>
        <FormItem label="过期时间" prop="expireTime">
          <DatePicker type="date" v-model="form.expireTime" placeholder="请选择日期" style="width:100%"></DatePicker>
        </FormItem>
        <FormItem label="过期预警(天数)" prop="alarmDays">
          <Input v-model="form.alarmDays" style="width:100%"/>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="form.description" style="width:100%"/>
        </FormItem>
        <FormItem label="设备位置" prop="floorId"> 
          <floor-choose style="width:300px" @on-change="handleSelectFloor" ref="floor"></floor-choose>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSubmit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getDeviceData,
  getDeviceById,
  saveDevice,
  updateDevice,
  deleteDevice,
  getDictDataByType,
  getSiteDataList
} from "@/api/index";
import circleLoading from "@/views/my-components/circle-loading.vue";
import treeAndTable from "./deviceTree.vue";
import deviceTypeTreeChoose from "./deviceType-tree-choose.vue";
import { debuglog } from 'util';
import dateUtil from "./deviceDateUtil.vue";
import floorChoose from "@/views/patrol/site/floor-choose.vue";

export default {
  name: "device",
  components: {
    circleLoading,
    deviceTypeTreeChoose,
    'device-tree':treeAndTable,
    floorChoose
  },
  data() { 
    const validateNum = (rule, value, callback) => {
      var reg = /^[0-9]\d*$/;
      if (!reg.test(value)) {
        callback(new Error("过期预警天数需为整数"));
      } else {
        callback();
      }
    };
    return {
      loading: true, // 表单加载状态
      operationLoading: false, // 操作加载状态
      modalType: 0, // 添加或编辑标识
      modalVisible: false, // 添加或编辑显示
      modalTitle: "", // 添加或编辑标题
      siteLoading: false,//巡查点数据加载状态
      dictPlanType: [], //巡查设备状态数据字典
      searchForm: {
        // 搜索框初始化对象
        deviceTypeId:"",
        name:"",
        deviceTypeName:"",
        status:"",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc" // 默认排序方式
      }, 
      // 表单验证规则
      formValidate: {
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        siteId: [{ required: true, message: "不能为空", trigger: "blur" }],
        deviceTypeId: [{ required: true, message: "不能为空", trigger: "blur" }],
        model: [{ required: true, message: "不能为空", trigger: "blur" }],
        spec: [{ required: true, message: "不能为空", trigger: "blur" }],
        manufactor: [{ required: true, message: "不能为空", trigger: "blur" }],
        brand: [{ required: true, message: "不能为空", trigger: "blur" }],
        provider: [{ required: true, message: "不能为空", trigger: "blur" }],
        productTime: [{ required: true,type:"date", message: "不能为空", trigger: "blur"}],
        expireTime: [{ required: true, type:"date",message: "不能为空", trigger: "blur"}],
        alarmDays: [{ validator:validateNum, trigger: "blur" }]
      },
      form: {
        // 添加或编辑表单对象初始化数据
        name: "",
        siteId:"",
        deviceTypeId:"",
        deviceTypeName:"",
        code:"",
        model:"",
        spec:"",
        manufactor:"",
        brand:"",
        provider:"",
        productTime:"",
        expireTime:"",
        alarmDays:"",
        description:"",
        floorId:""
      },
      submitLoading: false, // 添加或编辑提交状态
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      columns: [
        // 表头
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title:"序号",
          type: "index",
          width: 80,
          align: "center"
        }, 
        {
          title: "名称",
          key: "name",
          minWidth: 200,
          sortable: false
        },
        {
          title: "设备类型",
          key: "deviceTypeName",
          minWidth: 200,
          ellipsis: true
        },
        {
          title: "所属巡查点",
          key: "siteName",
          minWidth: 200,
          ellipsis: true
        },
        {
          title: "地理位置",
          key: "floorName",
          minWidth: 300,
          ellipsis: true
        },
        {
          title: "状态",
          key: "status",
          width: 100,
          // align: "center",
          render: (h, params) => {
            let re = "";
            if (params.row.status == 0) {
              re = "未使用";
            } else if (params.row.status == 1) {
              re = "使用中";
            } else if (params.row.status == 2){
              re = "出现问题";
            }else if (params.row.status == 3){
              re = "维修";
            }else if (params.row.status == 4){
              re = "报废";
            }else if (params.row.status == 5){
              re = "到期";
            }else if (params.row.status == 6){
              re = "即将到期";
            }
            return h("div", re);
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    icon: "ios-create-outline"
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
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                    icon: "md-trash"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data: [], // 表单数据
      sites:[],//巡查点数据
      pageNumber: 1, // 当前页数
      pageSize: 10, // 页面大小
      total: 0 // 表单数据总数
    };
  },
  methods: {
    init() {
      this.getDataList();
      this.getDictPermissions();
    },
    //数据字典 获取巡查社备类型
    getDictPermissions() {
      getDictDataByType("patrol_device_status").then(res => {
        if (res.success) {
          this.dictPlanType = res.result;
        }
      });
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
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
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
    handleSelectFloor(v) {
      this.form.floorId=v.id;
    },
    handleSelectDeviceTypeTree(v) {
      this.form.deviceTypeId = v[0];
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    getDataList() {
      this.loading = true;
      getDeviceData(this.searchForm).then(res => {
        this.loading = false;
        if (res.success == true) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    getSiteList(){
      // 加载巡查点数据
      this.siteLoading = true;
      getSiteDataList().then(res => { 
        this.siteLoading = false;
        if (res.success) {
          this.sites = res.result;
        }
      });
    },  
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.productTime = dateUtil.format(this.form.productTime);
          this.form.expireTime = dateUtil.format(this.form.expireTime);
          // 添加
          if(this.modalType==0){
            this.submitLoading = true;
            saveDevice(this.form).then(res => {
              this.submitLoading = false;
              delete this.form.id;
              if (res.success == true) {
                this.$Message.success("操作成功");
                this.getDataList();
                this.modalVisible = false;
              }
            }); 
          }
          // 编辑
          if(this.modalType==1){
            this.submitLoading = true;
            updateDevice(this.form).then(res => {
              this.submitLoading = false;
              if (res.success == true) {
                this.$Message.success("操作成功");
                this.getDataList();
                this.modalVisible = false;
              }
            });
          }
          
        }
      });
    },
    add() {
      this.modalType = 0;
      this.modalTitle = "添加";
      this.$refs.form.resetFields();
      delete this.form.id;
      this.getSiteList();
      this.modalVisible = true;
    },
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "编辑";
      this.$refs.form.resetFields();
      this.getSiteList();
      // 转换null为""
      for (let attr in v) {
        if (v[attr] == null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let data = JSON.parse(str);
      this.$refs.deviceTypeTree.setData([data.deviceTypeId], data.deviceTypeName);
      this.form.value = "读取中..."
      getDeviceById(data.id).then(res => {
        this.form.value = ""
        if (res.success) { 
          data.value = res.result;
          this.form = data;
        }
      });
      this.modalVisible = true;
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        // 记得确认修改此处
        content: "您确认要删除 " + v.name + " ?",
        onOk: () => {
          // 删除
          this.operationLoading = true;
          deleteDevice(v.id).then(res => {
            this.operationLoading = false;
            if (res.success == true) {
              this.$Message.success("操作成功");
              this.getDataList();
            }
          });
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
          deleteDevice(ids).then(res => {
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
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
.search {
  .operation {
    margin-bottom: 2vh;
  }
  .select-count {
    font-size: 13px;
    font-weight: 600;
    color: #40a9ff;
  }
  .select-clear {
    margin-left: 10px;
  }
  .page {
    margin-top: 2vh;
  }
  .drop-down {
    font-size: 13px;
    margin-left: 5px;
  }
}
textarea.ivu-input {
  max-width: 100%;
  height: auto;
  min-height: 32px;
  vertical-align: bottom;
  font-size: 12px;
}
</style>