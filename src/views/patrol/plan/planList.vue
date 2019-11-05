<style lang="less">
@import "./searchTable.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="计划类型" prop="type">
                <Select v-model="searchForm.type" placeholder="请选择" clearable style="width: 200px">
                  <Option v-for="(item, i) in dictPlanType" :key="i" :value="item.value">{{item.title}}</Option>
                </Select>
              </Form-item>
              <Form-item label="创建时间">
                <DatePicker v-model="selectDate" type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
              </Form-item>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset" >重置</Button>
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
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>

 <!--  新增modal -->
    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable='false' :width="860" :styles="{top: '30px'}">
      <Form ref="form" :model="form" :label-width="70" :rules="formValidate" label-position="left">
          <Row>
              <Col span="11">
                  <FormItem label="计划名称" prop="name">
                      <Input v-model="form.name"/>
                  </FormItem>
              </Col>
              <Col span="11" offset="2">
                  <FormItem label="执行人" prop="type">
                      <Select v-model="form.doUserId" placeholder="请选择或输入搜索" filterable clearable>
                          <Option v-for="(item, i) in allUserData" :key="i" :value="item.id">{{item.username}}</Option>
                      </Select>
                  </FormItem>
              </Col>
          </Row>
          <Row>
              <Col span="11">
                  <FormItem label="执行周期" prop="type">
                      <Select v-model="form.type" placeholder="请选择或输入搜索" filterable clearable>
                          <Option v-for="(item, i) in dictPlanType" :key="i" :value="item.value">{{item.title}}</Option>
                      </Select>
                  </FormItem>
              </Col>
              <Col span="11" offset="2">
                  <FormItem label="有效时间" prop="limitDays">
                      <InputNumber v-model="form.limitDays" :min="1"  style="width: 93%"></InputNumber><span style="width:7%;">&nbsp&nbsp;天</span>
                  </FormItem>
              </Col>
          </Row>
          <Row>
              <Col span="11">
                  <Table height="280" border :columns="siteColumns" :data="siteData" ref="siteTable"></Table>
                  <div style="text-align: center;margin-top: 15px;">
                      <span>共&nbsp;{{siteTotal}}&nbsp;条</span>
                  </div>
              </Col>
              <Col span="2">
                  <div style="text-align: center">
                      <Icon type="md-swap" size="26" />
                  </div>
              </Col>
              <Col span="11">
                  <Table height="280" border :columns="selectedSiteColumns" :data="selectedSiteData" ref="selectedSiteTable"></Table>
                  <div style="text-align: center;margin-top: 15px;">
                      <span>共&nbsp;{{selectedSiteTotal}}&nbsp;条</span>
                  </div>
              </Col>
          </Row>

      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmit">提交</Button>
      </div>
    </Modal>
    <!--       详情   -->
      <Modal :title="detailModalTitle" v-model="detailModalVisible" :mask-closable='false' :width="900" :styles="{top: '30px'}">
          <Form ref="detailForm" :model="detailForm" :label-width="70" label-position="left">
              <Row>
                  <Col span="11">
                      <FormItem label="计划名称" prop="name">
                          <Input v-model="detailForm.name" readonly/>
                      </FormItem>
                  </Col>
                  <Col span="11" offset="2">
                      <FormItem label="执行人" prop="type">
                          <Input v-model="detailForm.username" readonly/>
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span="11">
                      <FormItem label="执行周期" prop="type">
                          <Input v-model="detailForm.typeName" readonly/>

                      </FormItem>
                  </Col>
                  <Col span="11" offset="2">
                      <FormItem label="有效时间" prop="limitDays">
                          <InputNumber v-model="detailForm.limitDays" :min="1"  style="width: 93%" readonly></InputNumber><span style="width:7%;">&nbsp&nbsp;天</span>
                      </FormItem>
                  </Col>
              </Row>

          </Form>

      </Modal>
  </div>
</template>

<script>
import circleLoading from "@/views/my-components/circle-loading.vue";
import {
  getPlanData,
  savePlan,
  getAllUserData,
  getSiteDataList,
  getDictDataByType,
  deletePlan,
  addPatrolPlan,
  getPatrolPlan
} from "@/api/index";
export default {
  name: "plan",
  components: {
    circleLoading
  },
  data() {
    return {
      loading: true, // 表单加载状态
      operationLoading: false, // 操作加载状态
      selectCount: 0, // 多选计数
      selectList: [], // 多选数据
      searchForm: {
        // 搜索框对应data对象
        name: "",
        type: "",
        isPatrol:1,
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc", // 默认排序方式
        startDate: "", // 起始时间
        endDate: "" // 终止时间
      },
      selectDate: null, // 选择日期绑定modal
      modalType: 0, // 添加或编辑标识
      modalVisible: false, // 添加或编辑显示
      modalTitle: "", // 添加或编辑标题
      form: {
        // 添加或编辑表单对象初始化数据
        type: 0,
        name: "",
        limitDays:1,
        isPatrol:1,
        doUserId:"",
        list:[]
      },
      formValidate: {
        // 表单验证规则
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        doUserId: [{ required: true, message: "不能为空", trigger: "blur" }],
        type: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
       /** 详情modal **/
      detailModalVisible: false, // 添加或编辑显示
      detailModalTitle: "", // 添加或编辑标题
      detailForm: {
          // 查看表单对象初始化数据
          type: 0,
          name: "",
          limitDays:1,
          username:"",
          list:[]
      },
      submitLoading: false, // 添加或编辑提交状态
      columns: [
        // 表头
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
          title: "计划名称",
          key: "name",
          width: 280,
          sortable: true,
          fixed: "left",
          tooltip: true
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 200,
          sortable: true
        },
        {
          title: "执行人员",
          key: "doUserId",
          width: 180,
          render: (h, params) => {
              if(params.row.user != null){
                  return h("div", params.row.user.username);
              }else{
                  return h("div", "----");
              }
          }
        },
        {
          title: "完成率",
          key: "finishedRate",
          width: 180,
          sortable: true
        },
         {
          title: "计划类型",
          key: "typeName",
          width: 180,
          sortable: true
        },
        {
          title: "状态",
          key: "isDoing",
          width: 100,
          align: "center",
          render: (h, params) => {
            let re = "";
            if (params.row.isDoing == 0) {
              re = "进行中";
            } else if (params.row.isDoing == 1) {
              re = "已完成";
            }
            return h("div", re);
          }
        },
        {
          title: "有效天数",
          key: "limitDays",
          width: 120,
          sortable: true
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
                      this.detail(params.row.id);
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
      allUserData:[], //所有用户数据
      dictPlanType: [], //巡更类型数据字典
      allUserData:[], //所有用户数据
      //巡查点列表
      siteColumns: [
            {
                title: "名称",
                key: "name",
                align: "center",
                minWidth: 50,
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
                                },
                                attrs: {
                                    disabled: params.row.selected==1?true:false,
                                },
                                style: {
                                    marginRight: "5px"
                                },
                                on: {
                                    click: () => {
                                        params.row.selected = 1;
                                        this.addToSelected(params.row);
                                    }
                                }
                            },
                            params.row.selected==1?"已添加":"添加",
                        )
                    ]);
                }
            }
        ],
      siteData: [], // 表单数据
      siteTotal: 0,
      //已选择巡更点列表
      selectedSiteTable: {
            pageNumber: 1, // 当前页数
            pageSize: 5, // 页面大小
      },
      selectedSiteTotal: 0,
      selectedSiteColumns: [
            {
                title: "名称",
                key: "name",
                align: "center",
                minWidth: 50,
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
                                    type: "warning",
                                },
                                style: {
                                    marginRight: "5px",
                                },
                                on: {
                                    click: () => {
                                        this.moveSelected(params.row);
                                    }
                                }
                            },
                            "移除"
                        )
                    ]);

                }
            }
        ],
      selectedSiteData: [], // 表单数据
      total: 0 // 表单数据总数
    };
  },
  methods: {
    init() {
      this.getDataList();
      this.getDictPermissions();

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
     //数据字典 获取巡更类型
    getDictPermissions() {
      getDictDataByType("patrol_plan_type").then(res => {
        if (res.success) {
          this.dictPlanType = res.result;
        }
      });
    },
    //获取全部用户
    getAllUser() {
        getAllUserData().then(res => {
          if (res.success) {
              this.allUserData = res.result;
          }
        });
    },
    //获取全部巡查点
    getSiteList(){
        getSiteDataList().then(res => {
          if (res.success == true) {
              this.siteData = res.result;
              this.siteTotal = res.result.length;
          }
      });
    },
    getDataList() {
      this.loading = true;
      // 带多条件搜索参数获取表单数据 请自行修改接口
      getPlanData(this.searchForm).then(res => {
        this.loading = false;
        if (res.success == true) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
        this.clearSelectAll();
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
    handelSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.selectedSiteData.forEach((item) => {
              this.form.list.push(item.id);
          });
          if(this.form.type==1&&this.form.limitDays<7){//周检
              this.$Message.warning("周检有效时间必须大于7天");
              return;
          }
          if(this.form.type==2&&this.form.limitDays<31){//周检
              this.$Message.warning("周检有效时间必须大于31天");
              return;
          }
          if(this.form.type==3&&this.form.limitDays<92){//季检
              this.$Message.warning("季检有效时间必须大于92天");
              return;
          }
          if(this.form.type==4&&this.form.limitDays<183){//半年检
              this.$Message.warning("半年检有效时间必须大于183天");
              return;
          } 
          if(this.form.type==5&&this.form.limitDays<365){//年检
              this.$Message.warning("年检有效时间必须大于365天");
              return;
          }
          if (this.modalType == 0) {
            // 添加 避免编辑后传入id等数据 记得删除
            delete this.form.id;
            delete this.form.status;
            addPatrolPlan(this.form).then(res => {
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
      this.getAllUser();
      this.getSiteList();
      this.modalTitle = "添加";
      this.$refs.form.resetFields();
      this.modalVisible = true;
      this.selectedSiteData = [];
      this.selectedSiteTotal = 0;
    },
    showSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    addToSelected(e){
        //e是左侧列表的元素
        this.selectedSiteData.push(e);
        this.selectedSiteTotal++;
    },
    moveSelected(e){
        //备选列表恢复
        this.selectedSiteData.forEach((item) => {
            if(e.id == item.id){
                item.selected = 0;
            }
        });
        //移除元素
        this.selectedSiteData.splice(e._index,1);
        this.selectedSiteTotal--;
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    detail(id){
        this.getPatrolPlanDetail(id);
        this.detailModalTitle = "查看巡查计划";
        this.detailModalVisible = true;
    },
      //获取计划详情
    getPatrolPlanDetail(id) {
        getPatrolPlan(id).then(res => {
          if (res.success) {
              let patrolPlan = res.result.patrolPlan;
              this.detailForm.name = patrolPlan.name;
              this.detailForm.typeName = patrolPlan.typeName;
              this.detailForm.limitDays = patrolPlan.limitDays;
              this.detailForm.username = patrolPlan.user.username;
              this.detailForm.list = res.result.patrolMarks;
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
          deletePlan(ids).then(res => {
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