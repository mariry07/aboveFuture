<style lang="less">
@import "./tree&table.less";
</style>
<template>
  <div class="search">
    <Card>
      <Row type="flex" justify="space-between" class="code-row-bg">
        <Col v-if="expand" span="5">
        <Row class="operation">
        <Col span="10">
            <Row style="margin-bottom: 0.5vh">        
              <Button @click="addTree" type="primary" icon="md-add">添加子节点</Button>
            </Row>
            <Row>        
              <Button @click="delAllTree" icon="md-trash" >批量删除</Button>
            </Row>
           </Col>
           <Col span="10">
            <Row style="margin-bottom: 0.5vh">        
              <Button @click="addTreeRoot" icon="md-add">添加一级节点</Button>
            </Row>
            <Row>        
              <Button @click="getParentList" icon="md-refresh">刷新</Button>
            </Row>
           </Col>


          </Row>              
        <Row>
          <Alert show-icon>
            当前选择： <span class="select-title">{{editTitle}}</span>
            <a class="select-clear" v-if="editTitle" @click="cancelEdit">取消选择</a>
          </Alert>   
          <Input v-model="searchKey" suffix="ios-search" @on-change="search" placeholder="输入节点名搜索" clearable/>
          <div class="tree-bar" :style="{maxHeight: maxHeight}">
            <Tree ref="tree" :data="treeData" :load-data="loadData" show-checkbox @on-check-change="changeSelect" @on-select-change="selectTree" :check-strictly="!strict"></Tree>
          </div>
          <Spin size="large" fix v-if="treeLoading"></Spin>
        </Row>
        </Col>
        <div class="expand">
          <Icon :type="expandIcon" size="16" class="icon" @click="changeExpand"/>
        </div>
        <Col :span="span">
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="50" class="search-form">
              <Form-item label="名称" prop="name">
              <Input type="text" v-model="searchForm.name" placeholder="请输入" clearable style="width: 200px"/>
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
        </Col>
      </Row>
    </Card>

    <Modal :title="modalTreeAddTitle" v-model="modalTreeAddVisible" :mask-closable="false" :width="500">
      <Form ref="formTreeAdd" :model="formTreeAdd" :label-width="85" :rules="formTreeAddValidate">
        <div v-if="showParent">
          <FormItem label="上级节点：">{{selectTitle}}</FormItem>
        </div>
        <FormItem label="节点名称" prop="title">
          <Input v-model="formTreeAdd.title"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalTreeAddVisible=false">取消</Button>
        <Button type="primary" :loading="submitTreeAddLoading" @click="submitTreeAdd">提交</Button>
      </div>
    </Modal>
    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}">
      <Form ref="form" :model="form" :label-width="70" :rules="formValidate">
        <FormItem label="名称" prop="name">
          <Input v-model="form.name"/>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="form.description"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  initDeviceTree,
  loadDeviceTree,
  searchDeviceTree,
  addDeviceTree,
  editDeviceTree,
  deleteDeviceTree,
  getDeviceItemList,
  saveDeviceItem,
  updateDeviceItem,
  deleteDeviceItem
} from "@/api/index";
import circleLoading from "@/views/my-components/circle-loading.vue";
export default {
  name: "treeAndTable",
  components: {
    circleLoading
  },
  data() {
    return {
      strict: true,
      loadingEdit: false, // 编辑上级树加载状态
      showParent: false, // 显示上级标识
      treeLoading: false, // 树加载状态
      maxHeight: "500px",
      loading: false, // 表加载状态
      editTitle: "", // 编辑节点名称
      selectTitle:"",
      searchKey: "", // 搜索树
      expand: true,
      span: 18,
      expandIcon: "ios-arrow-back",
      selectNode: {
      },
      treeData: [], // 树数据
      operationLoading: false, // 操作加载状态
      selectTreeCount: 0, // 多选树计数
      selectTreeList: [], // 多选树数据
      selectCount: 0, // 多选计数
      selectList: [], // 多选数据
      searchForm: {
        // 搜索框对应data对象
        name: "",
        deviceTypeId: "",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc" // 默认排序方式
      },
      modalType: 0, // 添加或编辑标识
      modalVisible: false, // 添加或编辑显示
      modalTitle: "", // 添加或编辑标题
      form: {
        // 添加或编辑表单对象初始化数据
        name: "",
        description: "",
        deviceTypeId:""
      },
      formValidate: {
        // 表单验证规则
        name: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      modalTreeAddType: 0, // 添加或编辑标识
      modalTreeAddVisible: false, // 添加或编辑显示
      modalTreeAddTitle: "", // 添加或编辑标题
      formTreeAdd: {
        // 添加或编辑表单对象初始化数据
        id: "",
        title: "",
        parentId: "",
        levle: 1
      },
      formTreeAddValidate: {
        // 表单验证规则
        title: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
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
          title: "检查项名称",
          key: "name",
          minWidth: 150,
          sortable: false,
          fixed: "left"
        },
        {
          title: "描述",
          key: "description",
          minWidth: 150,
          sortable: false
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          fixed: "right",
          render: (h, params) => {
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
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
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
      submitTreeAddLoading: false,
      data: [], //表单数据
      total: 0 // 表单数据总数
    };
  },
  methods: {
    init() {
      // 初始化一级节点
      this.getParentList();
    },
    getParentList() {
      this.treeLoading = true;
      initDeviceTree().then(res => {
        this.treeLoading = false;
        if (res.success == true) {
          res.result.forEach(function(e) {
            if (e.level!=3) {
              e.loading = false;
              e.children = [];
            }
          });
          this.treeData = res.result;
        }
      });
    },
    loadData(item, callback) {
      // 异步加载树子节点数据
      loadDeviceTree(item.id).then(res => {
        if (res.success == true) {
          res.result.forEach(function(e) {
            if (e.level!=3) {
              e.loading = false;
              e.children = [];
            }
          });
          callback(res.result);
        }
      });
    },
    search() {
      // 搜索树
      if (this.searchKey) {
        // 模拟请求
        this.treeLoading = true;
        searchDeviceTree({ title: this.searchKey }).then(res => {
          this.treeLoading = false;
          if (res.success == true) {
            this.treeData = res.result;
          }
        });
        // 模拟请求成功
      } else {
        // 为空重新加载
        this.getParentList();
      }
    },
    selectTree(v) {
      if (v.length > 0) {
        // 转换null为""
        for (let attr in v[0]) {
          if (v[0][attr] == null) {
            v[0][attr] = "";
          }
        }
        let str = JSON.stringify(v[0]);
        let data = JSON.parse(str);
        this.selectNode = data;
        this.editTitle = data.title;
        this.form.deviceTypeId = data.id;
        // 重新加载表
        this.getDataList();
      } else {
        this.cancelEdit();
      }
    },
    cancelEdit() {
      let data = this.$refs.tree.getSelectedNodes()[0];
      if (data) {
        data.selected = false;
      }
      // 取消选择后获取全部数据
      this.selectNode = {};
      this.editTitle = "";
      this.getDataList();
    },
    changeSelect(v) {
      this.selectTreeCount = v.length;
      this.selectTreeList = v;
    },
    changeExpand() {
      this.expand = !this.expand;
      if (this.expand) {
        this.expandIcon = "ios-arrow-back";
        this.span = 18;
      } else {
        this.expandIcon = "ios-arrow-forward";
        this.span = 23;
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
    getDataList() {
      this.loading = true;
      // 根据用户选择树加载表数据
      this.searchForm.deviceTypeId = this.selectNode.id;
      // 带多条件搜索参数获取表单数据 请自行修改接口
      getDeviceItemList(this.searchForm).then(res => {
        this.loading = false;
        if (res.success == true) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
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
    },
    addTree() {
      if (this.selectNode.id == "" || this.selectNode.id == null) {
        this.$Message.warning("请先点击选择一个节点");
        return;
      }
      this.modalTreeAddTitle = "添加子节点";
      this.selectTitle = this.selectNode.title;
      this.showParent = true;
      this.formTreeAdd = {
        parentId: this.selectNode.id,
        level:this.selectNode.level+1
      };
      this.modalTreeAddVisible = true;
    },
    addTreeRoot() {
      this.modalTreeAddTitle = "添加一级节点";
      this.showParent = false;
      this.formTreeAdd = {
        parentId: 0,
        level: 1
      };
      this.modalTreeAddVisible = true;
    },
    submitTreeAdd() {
      this.$refs.formTreeAdd.validate(valid => {
        if (valid) {
          this.submitTreeAddLoading = true;
          addDeviceTree(this.formTreeAdd).then(res => {
            this.submitTreeAddLoading = false;
            if (res.success == true) {
              this.$Message.success("添加成功");
              this.init();
              this.modalTreeAddVisible = false;
            }
          });
        }
      });
    },
    delAllTree() {
      if (this.selectTreeCount <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectTreeCount + " 条数据?",
        onOk: () => {
          let ids = "";
          this.selectTreeList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          // 批量删除
          this.operationLoading = true;
          deleteDeviceTree(ids).then(res => {
          this.operationLoading = false;
            if (res.success == true) {
              this.$Message.success("操作成功");
              this.cancelEdit();
              this.init();
            }
          });
        }
      });
    },
    add() {
      if(this.selectNode.level!=3){
        this.$Message.warning("请在三级分类下添加新的检查项");
        return;
      }
      this.modalType = 0;
      this.modalTitle = "添加";
      this.$refs.form.resetFields();
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
      this.form = data;
      this.modalVisible = true;
    },
    handelSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.modalType == 0) {
            // 添加 避免编辑后传入id等数据 记得删除
            delete this.form.id;
            saveDeviceItem(this.form).then(res => {
              this.submitLoading = false;
              if (res.success == true) {
                this.$Message.success("操作成功");
                this.getDataList();
                this.modalVisible = false;
              }else{
                his.$Message.warning(res.message);
              }
            });
          } else if (this.modalType == 1) {
            //编辑
            updateDeviceItem(this.form).then(res => {
              this.submitLoading = false;
              if (res.success == true) {
                this.$Message.success("操作成功");
                this.getDataList();
                this.modalVisible = false;
              }else{
                his.$Message.warning(res.message);
              }
            });
          }
        }
      });
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        // 记得确认修改此处
        content: "您确认要删除 " + v.name + " ?",
        onOk: () => {
          // 删除
          this.operationLoading = true;
          deleteDeviceItem(v.id).then(res => {
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
          deleteDeviceItem(ids).then(res => {
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
    // 计算高度
    let height = document.documentElement.clientHeight;
    this.maxHeight = Number(height-287) + "px";
    this.init();
  }
};
</script>