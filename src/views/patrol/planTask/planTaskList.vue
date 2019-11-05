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
              <Form-item label="任务状态" prop="status">
                <Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">
                  <Option value="1">进行中</Option>
                  <Option value="2">已完成</Option>
                  <Option value="3">未完成</Option>
                </Select>
              </Form-item>
                <Form-item label="巡查人员" prop="doUserId">
                <Select v-model="searchForm.doUserId" placeholder="请选择" clearable style="width: 200px">
                    <Option v-for="(item, i) in allUserData" :key="i" :value="item.id">{{item.username}}</Option>
                </Select>
              </Form-item>
              <Form-item label="有效时间">
                <DatePicker v-model="selectDate" type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
              </Form-item>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset" >重置</Button>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <Button @click="getDataList" icon="md-refresh">刷新</Button>
            <circleLoading v-if="operationLoading"/>
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
    <!--       详情   -->
    <Modal :title="detailModalTitle" v-model="detailModalVisible" :mask-closable='false' :width="900" :styles="{top: '30px'}">
      <Form ref="detailForm" :model="detailForm" :label-width="70" label-position="left">
        <Row>
          <Col span="11">
            <FormItem label="任务名称" prop="name">
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
            <FormItem label="任务状态" prop="status">
              <Input v-model="detailForm.status" readonly/>
<!--              <InputNumber v-model="detailForm.status" :min="1"  style="width: 93%" readonly></InputNumber><span style="width:7%;">&nbsp&nbsp;天</span>-->
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
  getAllUserData,
  getPlanTaskData,
  getPatrolPlanTask
} from "@/api/index";
export default {
  name: "planTask",
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
        status: "",
        isPatrol:1,//巡查
        doUserId: "",
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
      allUserData:[], //所有用户数据
      form: {
        // 添加或编辑表单对象初始化数据
      },
      formValidate: {
        // 表单验证规则
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
          type: "index",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "任务名称",
          key: "name",
          Width: 280,
          sortable: true,
          fixed: "left",
          tooltip: true
        },
        {
          title: "任务完成率",
          key: "finishedRate",
          width: 180,
          sortable: true
        },
        {
          title: "巡查人员",
          key: "doUserId",
          width: 150,
          render: (h, params) => {
            if(params.row.user != null){
              return h("div", params.row.user.username);
            }else{
              return h("div", "----");
            }
          }
        },
        {
          title: "有效时间",
          key: "effDateStr",
          width: 220,
          sortable: true
        },
         {
          title: "任务完成时间",
          key: "finishedTime",
          width: 160,
          sortable: true
        },
        {
          title: "任务类型",
          key: "typeName",
          width: 150,
          sortable: true
        },
        {
          title: "状态",
          key: "status",
          width: 100,
          // align: "center",
          render: (h, params) => {
            let re = "";
            if (params.row.status == 1) {
              re = "进行中";
            } else if (params.row.status == 2) {
              re = "已完成";
            } else if (params.row.status == 3){
              re = "未完成";
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
      total: 0 // 表单数据总数
    };
  },
  methods: {
    init() {
      this.getDataList();
      this.getAllUser();
    },
     //获取全部用户
    getAllUser() {
        getAllUserData().then(res => {
          if (res.success) {
              this.allUserData = res.result;
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
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    getDataList() {
      this.loading = true;
      // 带多条件搜索参数获取表单数据 请自行修改接口
      getPlanTaskData(this.searchForm).then(res => {
        this.loading = false;
        if (res.success == true) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    detail(id){
      this.getPatrolPlanTaskDetail(id);
      this.detailModalTitle = "查看巡查任务";
      this.detailModalVisible = true;
    },
    //获取计划详情
    getPatrolPlanTaskDetail(id) {
      getPatrolPlanTask(id).then(res => {
        if (res.success) {
          let patrolPlanTask = res.result.patrolPlanTask;
          this.detailForm.name = patrolPlanTask.name;
          this.detailForm.typeName = patrolPlanTask.typeName;
          this.detailForm.username = patrolPlanTask.user.username;
          this.status = "";
          if (patrolPlanTask.status == 1) {
            this.detailForm.status = "进行中";
          } else if (patrolPlanTask.status == 2) {
            this.detailForm.status = "已完成";
          } else if (patrolPlanTask.status == 3){
            this.detailForm.status = "未完成";
          }
          this.detailForm.list = res.result.patrolMarks;
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
    showSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    }
  },
  mounted() {
    this.init();
  }
};
</script>