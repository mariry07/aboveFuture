<style lang="less">
@import "./tree&table.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Tabs :animated="false">
            <TabPane label="巡查记录">
              <Row @keydown.enter.native="handleSearch">
                <Form
                  ref="searchForm"
                  :model="searchForm"
                  inline
                  :label-width="40"
                  class="search-form"
                >
                  <Form-item label="名称" prop="name">
                    <Input
                      type="text"
                      v-model="searchForm.name"
                      placeholder="请输入巡查点名称"
                      clearable
                      style="width: 200px"
                    />
                  </Form-item>
                  <Form-item style="margin-left:-35px;" class="br">
                    <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                    <Button @click="handleReset">重置</Button>
                  </Form-item>
                </Form>
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
            <TabPane name="siteDate" label="巡查点信息">
              <Row type="flex" justify="start" class="code-row-bg">
                  <Col span="13">
                    <Row class="operation">
                        <Form
                  ref="searchForm"
                  :model="searchForm"
                  inline
                  :label-width="40"
                  class="search-form"
                >
                  <Form-item label="楼号" prop="name">
                     <floor-choose style="width:300px" @on-change="handleSelectFloor" ref="floor"></floor-choose>
                  </Form-item>
                </Form>
                    </Row>
                    <Row>
                      <div>
                          <viewer :images="imgs">
                              <img v-for="src in imgs" :src="src.url" :key="src.title" style="height:650px;">
                          </viewer>
                      </div>
                    </Row>
                  </Col>
                  <Col span="7" style="margin-left:10px">
                    <div>
                    <Row class="operation">
                      <Button @click="add" type="primary" icon="md-add">添加</Button>
                    </Row>
                    <Row>
                      <Table :loading="siteLoading" border :columns="siteColumns" :data="siteData" @on-row-click="handleRowChange"  ref="siteTable"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                      <Page :current="searchSiteForm.pageNumber" @on-change="changeSitePage" :total="siteTotal" :page-size="searchSiteForm.pageSize"  :page-size-opts="[5]" size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                    
                    </div>
                    <div>
                      <div id="printContent" ref="printContent">
                      <h3 style="margin-left:35%;">当前巡查点信息:</h3>
                      <span style="color:rgb(26, 230, 255);">{{currentSiteName}}</span></p>
                      <span>描述:</span>
                      <div align="center">
                          <viewer :images="siteImgs">
                              <img v-for="src in siteImgs" :src="src.url" :key="src.title">
                          </viewer> 
                      </div>
                      </div>
                    <Row class="operation">
                      <Button @click="print" type="primary" icon="md-add">打印</Button>
                    </Row>
                    <Row>
                      <Table :loading="deviceLoading" border :columns="deviceColumns" :data="deviceData" sortable="custom"   ref="deviceTable"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                      <Page :current="searchDeviceForm.pageNumber" :total="deviceTotal" :page-size="searchDeviceForm.pageSize" @on-change="changeDevicePage" :page-size-opts="[5]" size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                    </div>
                  </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
     <Modal :title="modalTitle" v-model="modalVisible" :mask-closable="false" :width="500">
      <Form ref="form" :model="form" :label-width="70" :rules="formValidate">
        <FormItem label="名称" prop="name">
          <Input v-model="form.name" style="width:100%"/>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="form.description" style="width:100%"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSubmit">提交</Button>
      </div>
    </Modal>
    <!--       详情   -->
      <Modal :title="detailModalTitle" v-model="detailModalVisible" :mask-closable='false' :width="900" :styles="{top: '30px'}">
          <Form ref="detailForm" :model="detailForm" :label-width="70" label-position="left">
            <Row>
                  <Col span="11">
                    <FormItem label="设备名称" prop="name">
                      <Input v-model="detailForm.name" style="width:100%" readonly/>
                    </FormItem>
                  </Col>
                  <Col span="11" offset="2">
                    <FormItem label="所属巡查点" prop="siteId">
                      <Input v-model="detailForm.siteName" style="width:100%" readonly/>      
                      </FormItem>
                  </Col>
            </Row>
            <Row>
                <Col span="11">
                  <Form-item label="设备类型">
                    <Input v-model="detailForm.deviceTypeName" style="width:100%" readonly/>      
                  </Form-item>
                </Col>
                <Col span="11" offset="2">
                  <FormItem label="设备编码" prop="code">
                    <Input v-model="detailForm.code" style="width:100%" readonly/>
                  </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                  <FormItem label="设备型号" prop="model">
                    <Input v-model="detailForm.model" style="width:100%" readonly/>
                  </FormItem>
                </Col>
                <Col span="11" offset="2">
                  <FormItem label="设备规格" prop="spec">
                    <Input v-model="detailForm.spec" style="width:100%" readonly/>
                  </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                  <FormItem label="设备厂商" prop="manufactor">
                    <Input v-model="detailForm.manufactor" style="width:100%" readonly/>
                  </FormItem>
                </Col>
                <Col span="11" offset="2">
                  <FormItem label="设备品牌" prop="brand">
                    <Input v-model="detailForm.brand" style="width:100%" readonly/>
                  </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                  <FormItem label="供货单位" prop="provider">
                    <Input v-model="detailForm.provider" style="width:100%" readonly/>
                  </FormItem>
                </Col>
                 <Col span="11" offset="2">
                    <FormItem label="出厂日期" prop="productTime">
                      <DatePicker type="date" v-model="detailForm.productTime" placeholder="请选择日期" style="width:100%"></DatePicker>
                    </FormItem>
                  </Col>
            </Row>
            <Row>
                <Col span="11">
                  <FormItem label="过期时间" prop="expireTime">
                    <DatePicker type="date" v-model="detailForm.expireTime" placeholder="请选择日期" style="width:100%"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="11" offset="2">
                  <FormItem label="过期预警(天数)" prop="alarmDays">
                    <Input v-model="detailForm.alarmDays" style="width:100%" readonly/>
                  </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="11">
                  <FormItem label="描述" prop="description">
                    <Input v-model="detailForm.description" style="width:100%" readonly/>
                  </FormItem>  
                </Col>
            </Row>
        </Form>

      </Modal>
  </div>
</template> 

<script>
import {
  getSiteDataListPage,
  getDeviceData,
  getSiteById,
  saveSite,
  updateSite,
  deleteSite,
  getDeviceById
} from "@/api/index";
import circleLoading from "@/views/my-components/circle-loading.vue";
import floorChoose from "./floor-choose.vue";
export default {
  name: "site",
  components: {
    circleLoading,
    floorChoose
  },
  data() { 
    return {
      loading: true, // 表单加载状态
      operationLoading: false, // 操作加载状态
      modalType: 0, // 添加或编辑标识
      modalVisible: false, // 添加或编辑显示
      modalTitle: "", // 添加或编辑标题
      currentSiteName:"",//当前选中巡查点
      searchForm: {
        // 搜索框初始化对象
        name:"",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc" // 默认排序方式
      }, 
       /** 详情modal **/
      detailModalVisible: false, // 添加或编辑显示
      detailModalTitle: "", // 添加或编辑标题
      detailForm: {
          // 查看表单对象初始化数据
          name: "",
          siteName:"",
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
          description:""
      },
      siteLoading: false, // 表单加载状态
      searchSiteForm: {
        // 搜索巡查点初始化对象
        floorId:"",
        pageNumber: 1, // 当前页数
        pageSize: 5, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc" // 默认排序方式
      },
      deviceLoading:false,
      searchDeviceForm:{
        siteId:"",
        floorId:"",
        pageNumber: 1, // 当前页数
        pageSize: 5, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc" // 默认排序方式
      },
      imgs: [
       {
          url: '',
          title: ''
        }
      ],
      siteImgs:[
        {
          url:'',
          title:''
        }
      ],
      // 表单验证规则
      formValidate: {
        name: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      form: {
        // 添加或编辑表单对象初始化数据
        name: "",
        description:"",
        floorId:""     
      },
      submitLoading: false, // 添加或编辑提交状态
      columns: [
        // 表头
        {
          title:"序号",
          type: "index",
          width: 80,
          align: "center"
        }, 
        {
          title: "楼层信息",
          key: "floorName",
          minWidth: 100,
          sortable: true
        },
        {
          title: "巡查点名称",
          key: "name",
          minWidth: 100,
          ellipsis: true
        },
        {
          title: "设备类型",
          key: "deviceTypeName",
          minWidth: 100,
          ellipsis: true
        },
        {
          title: "设备总数",
          key: "deviceCount",
          minWidth: 100,
          ellipsis: false
        },
        {
          title: "检查项总数",
          key: "checkItemCount",
          minWidth: 100,
          ellipsis: false
        },
        {
          title: "设备完好率",
          key: "availRate",
          minWidth: 100,
          ellipsis: false
        },
        {
          title: "更新时间",
          key: "updateTime",
          minWidth: 200,
          ellipsis: false
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
                "查看"
              ) 
            ]);
          }
        }
      ],
      siteColumns: [
        {
          title:"序号",
          type: "index",
          width: 80,
          align: "center"
        }, 
        {
          title: "名称",
          key: "name",
          minWidth: 80,
          ellipsis: true
        },
        {
          title: "描述",
          key: "description",
          minWidth: 100,
          ellipsis: true
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
      deviceColumns: [
        {
          title:"序号",
          type: "index",
          width: 80,
          align: "center"
        }, 
        {
          title: "名称",
          key: "name",
          minWidth: 100,
          ellipsis: true
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 100,
          render: (h, params) => {
            return h("div", [
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
                      this.detail(params.row);
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ],
      data: [], // 表单数据
      pageNumber: 1, // 当前页数
      pageSize: 10, // 页面大小
      total: 0 ,// 表单数据总数
      siteData: [], // 表单数据
      sitePageNumber: 1, // 当前页数
      sitePageSize: 5, // 页面大小
      siteTotal: 0, // 表单数据总数
      deviceData: [], // 表单数据
      devicePageNumber: 1, // 当前页数
      devicePageSize: 5, // 页面大小
      deviceTotal: 0 // 表单数据总数  
    };
  },
  methods: {
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    changeSitePage(v) {
      this.searchSiteForm.pageNumber = v;
      this.getSiteDataList();
    },
    changeDevicePage(v) {
      this.searchDeviceForm.pageNumber = v;
      this.getDeviceDataList();
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
    handleRowChange(row, event, column){ 
      this.currentSiteName=row.name;
      this.searchDeviceForm.floorId=row.floorId;
      this.searchDeviceForm.siteId=row.id;
      this.siteImgs[0].url=row.photoId;
      this.getDeviceDataList();
     },
    handleSelectFloor(v) {
      this.searchSiteForm.floorId = v.id;
      this.form.floorId=v.id;
      this.imgs[0].url=v.img;
      if(v.level==2){
        this.getSiteDataList();
      }
    },
    print(){
      if(!this.searchDeviceForm.siteId||this.searchDeviceForm.siteId==''){
        this.$Message.warning("请先选择巡查点");
        return;
      }
      let pwindow = window.open();
      pwindow.document.body.innerHTML = this.$refs.printContent.innerHTML;
      setTimeout( function(){
        pwindow.print();
        pwindow.close();
      }, 20);
      return false;
    },
    add() {
      if(!this.searchSiteForm.floorId||this.searchSiteForm.floorId==''){
        this.$Message.warning("请先选择楼层");
        return;
      }
      this.modalType = 0;
      this.modalTitle = "添加";
      this.$refs.form.resetFields();
      delete this.form.id;
      this.modalVisible = true;
    },
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "编辑";
      this.$refs.form.resetFields();
      // 转换null为""
      for (let attr in v) {
        if (v[attr] == null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let data = JSON.parse(str);
      this.form.value = "读取中..."
      getSiteById(data.id).then(res => {
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
          deleteSite(v.id).then(res => {
            this.operationLoading = false;
            if (res.success == true) {
              this.$Message.success("操作成功");
              this.getSiteDataList();
            }
          });
        }
      });
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 添加
          if(this.modalType==0){
            this.submitLoading = true;
            saveSite(this.form).then(res => {
              this.submitLoading = false;
              delete this.form.id;
              if (res.success == true) {
                this.$Message.success("操作成功");
                this.getSiteDataList();
                this.modalVisible = false;
              }else{
                his.$Message.warning(res.message);
              }
            }); 
          }
          // 编辑
          if(this.modalType==1){
            this.submitLoading = true;
            updateSite(this.form).then(res => {
              this.submitLoading = false;
              if (res.success == true) {
                this.$Message.success("操作成功");
                this.getSiteDataList();
                this.modalVisible = false;
              }else{
                his.$Message.warning(res.message);
              }
            });
          }
          
        }
      });
    },
    getDataList() {
      this.loading = true;
      getSiteDataListPage(this.searchForm).then(res => {
        this.loading = false;
        if (res.success == true) { 
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    detail(device){
      this.detailModalTitle = "查看设备详情";
      this.detailForm.name = device.name;
      this.detailForm.siteName = device.siteName;
      this.detailForm.deviceTypeName = device.deviceTypeName;
      this.detailForm.code = device.code;
      this.detailForm.model = device.model;
      this.detailForm.spec = device.spec;
      this.detailForm.manufactor = device.manufactor;
      this.detailForm.brand = device.brand;
      this.detailForm.provider = device.provider;
      this.detailForm.productTime = device.productTime;
      this.detailForm.expireTime = device.expireTime;
      this.detailForm.alarmDays = device.alarmDays;
      this.detailForm.description = device.description;
      this.detailModalVisible = true;
    },
    getSiteDataList() {
      this.siteLoading = true;
      getSiteDataListPage(this.searchSiteForm).then(res => {
        this.siteLoading = false;
        if (res.success == true) { 
          this.siteData = res.result.content;
          this.siteTotal = res.result.totalElements;
        }
      });
    },
    getDeviceDataList() {
      this.deviceLoading = true;
      getDeviceData(this.searchDeviceForm).then(res => {
        this.deviceLoading = false;
        if (res.success == true) { 
          this.deviceData = res.result.content;
          this.deviceTotal = res.result.totalElements;
        }
      });
    }
  },
  mounted() {
    this.getDataList();
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