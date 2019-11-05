<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Tabs :animated="false">
            <TabPane label="巡查隐患">
              <Row @keydown.enter.native="handleSearch">
                <Form
                  ref="searchForm"
                  :model="searchForm"
                  inline
                  :label-width="40"
                  class="search-form"
                > 
                  <Form-item label="任务状态" prop="status" inline :label-width="70">
                <Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">
                  <Option value="0">全部</Option>
                  <Option value="1">未派发</Option>
                  <Option value="2">进行中</Option>
                  <Option value="3">未审核</Option>
                  <Option value="4">已完成</Option>
                  <Option value="5">超时完成</Option>
                </Select>
              </Form-item>
                <Form-item label="检查人员" prop="checkUserId" inline :label-width="70">
                <Select v-model="searchForm.checkUserId" placeholder="请选择" clearable style="width: 200px">
                  <Option v-for="(item, i) in allUserData" :key="i" :value="item.id">{{item.username}}</Option>
                </Select>
              </Form-item>
              <Form-item label="创建时间" inline :label-width="70">
                <DatePicker v-model="selectDate" type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
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
          </Tabs>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import {
  getAllUserData,
  getDeviceRepairData
} from "@/api/index";
import circleLoading from "@/views/my-components/circle-loading.vue";
export default {
  name: "site",
  components: {
    circleLoading
  },
  data() { 
    return {
      loading: true, // 表单加载状态
      operationLoading: false, // 操作加载状态
      modalType: 0, // 添加或编辑标识
      modalVisible: false, // 添加或编辑显示
      modalTitle: "", // 添加或编辑标题
      searchForm: {
        // 搜索框初始化对象
        name:"",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc" // 默认排序方式
      }, 
      // 表单验证规则
      formValidate: {
        name: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      form: {
        // 添加或编辑表单对象初始化数据
        status:0,
        checkUserId: ""     
      },
      submitLoading: false, // 添加或编辑提交状态
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      allUserData:[], //所有用户数据
      columns: [
        // 表头
        {
          title:"序号",
          type: "index",
          width: 80,
          align: "center"
        }, 
        {
          title: "设备名称",
          key: "deviceName",
          minWidth: 200,
          sortable: true
        },
        {
          title: "隐患位置",
          key: "address",
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
          title: "检查人员",
          key: "checkUserId",
          minWidth: 200,
          render: (h, params) => {
              return h("div", params.row.checkUser.username);
          }
        },
        {
          title: "内容",
          key: "beforeDescription",
          minWidth: 300,
          ellipsis: false
        },
        {
          title: "维修有效时间",
          key: "periodTime",
          minWidth: 300,
          ellipsis: false
        },
        {
          title: "处理前",
          key: "beforePhotoId",
          minWidth: 300,
          ellipsis: false
        },
        {
          title: "处理后",
          key: "afterPhotoId",
          minWidth: 300,
          ellipsis: false
        },
        {
          title: "状态",
          key: "status",
          width: 100,
          align: "center",
          render: (h, params) => {
            let re = "";
            if (params.row.status == 1) {
              re = "未派发";
            } else if (params.row.status == 2) {
              re = "进行中";
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
                "查看"
              ) 
            ]);
          }
        }
      ],
      data: [], // 表单数据
      pageNumber: 1, // 当前页数
      pageSize: 10, // 页面大小
      total: 0 // 表单数据总数
    };
  },
  methods: {
    init() {
      this.getAllUser();
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    //获取全部用户
    getAllUser() {
        getAllUserData().then(res => {
          if (res.success) {
              this.allUserData = res.result;
          }
        });
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
    clearSelectAll() { 
      this.$refs.table.selectAll(false);
    }, 
    getDataList() {
      this.loading = true;
      getDeviceRepairData(this.searchForm).then(res => {
        this.loading = false;
        if (res.success == true) { 
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    }
  },
  mounted() {
    this.init();
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