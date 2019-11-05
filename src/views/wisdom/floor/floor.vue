<style lang="less">
@import "./floor.less";
</style>
<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button @click="add" type="primary" icon="md-add">添加楼层</Button>
        <Button @click="addRoot" icon="md-add">添加建筑</Button>
        <Button @click="delAll" icon="md-trash">批量删除</Button>
        <Button @click="getParentList" icon="md-refresh">刷新</Button>
      </Row>
      <Row type="flex" justify="start" class="code-row-bg">
        <Col span="6">
          <Alert show-icon>
            当前选择编辑：
            <span class="select-title">{{editTitle}}</span>
            <a class="select-clear" v-if="form.id" @click="cancelEdit">取消选择</a>
          </Alert>
          <Input
            v-model="searchKey"
            suffix="ios-search"
            @on-change="search"
            placeholder="输入建筑名搜索"
            clearable
          />
          <div class="tree-bar" :style="{maxHeight: maxHeight}">
            <Tree
              ref="tree"
              :data="data"
              :load-data="loadData"
              show-checkbox
              @on-check-change="changeSelect"
              @on-select-change="selectTree"
              :check-strictly="!strict"
            ></Tree>
          </div>
          <Spin size="large" fix v-if="loading"></Spin>
        </Col>
        <Col span="9" style="margin-left:10px">
          <Form ref="form" :model="form" :label-width="85" :rules="formValidate">
            <div v-if="architecture">
              <FormItem label="建筑名称" prop="parentTitle">
                <div v-if="leveltrue">
                  <Poptip trigger="click" placement="right-start" title="选择建筑" width="250">
                    <Input v-model="form.parentTitle" readonly/>
                    <div slot="content" style="position:relative;min-height:5vh">
                      <Tree :data="dataEdit" :load-data="loadData" @on-select-change="selectTreeEdit"></Tree>
                      <Spin size="large" fix v-if="loadingEdit"></Spin>
                    </div>
                  </Poptip>
                </div>
                <div v-if="!leveltrue">
                  <Input v-model="form.parentTitle"/>
                </div>
              </FormItem>
            </div>
            <div v-if="floor">
              <FormItem label="楼层名称" prop="title">
                <Input v-model="form.title"/>
              </FormItem>
              <Form-item label="楼层平面图" prop="img">
                <upload-pic-input v-model="form.img"></upload-pic-input>
              </Form-item>
            </div>
            <!-- <Form-item label="所属部门">
              <department-tree-choose @on-change="handleSelectDepTree" ref="depTree"></department-tree-choose>
            </Form-item> -->
            <FormItem label="排序值" prop="sort">
              <InputNumber :max="1000" :min="0" v-model="form.sort"></InputNumber>
              <span style="margin-left:5px">值越小越靠前，支持正整数</span>
            </FormItem>
            <Form-item>
              <Button
                @click="submitEdit"
                :loading="submitLoading"
                type="primary"
                icon="ios-create-outline"
                style="margin-right:5px"
              >修改并保存</Button>
              <Button @click="handleReset">重置</Button>
            </Form-item>
          </Form>
        </Col>
      </Row>
    </Card>

    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable="false" :width="500">
      <Form ref="formAdd" :model="formAdd" :label-width="85" :rules="formValidate">
        <div v-if="showParent">
          <FormItem label="建筑名称">{{form.parentTitle}}</FormItem>
          <FormItem label="楼层名称" prop="title">
            <Input v-model="formAdd.title"/>
          </FormItem>
        </div>
        <div v-if="!showParent">
          <FormItem label="建筑名称" prop="title">
            <Input v-model="formAdd.title"/>
          </FormItem>
        </div>
        <FormItem label="排序值" prop="sort">
          <InputNumber :max="1000" :min="0" v-model="formAdd.sort"></InputNumber>
          <span style="margin-left:5px">值越小越靠前，支持正整数</span>
        </FormItem>
        <!-- <FormItem label="是否启用" prop="status">
          <i-switch size="large" v-model="formAdd.status" :true-value="0" :false-value="-1">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitAdd">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import departmentTreeChoose from "@/views/my-components/xboot/department-tree-choose";
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
export default {
  name: "floor",
  components: {
    departmentTreeChoose,
    uploadPicInput
  },
  data() {
    const validateMobile1111 = (rule, value, callback) => {
      var reg = /^[0-9]\d*$/;
      if (!reg.test(value)) {
        callback(new Error("排序值需为整数"));
      } else {
        callback();
      }
    };
    return {
      loading: false, // 树加载状态
      maxHeight: "500px",
      strict: true,
      loadingEdit: false, // 编辑上级树加载状态
      modalVisible: false, // 添加显示
      selectList: [], // 多选数据
      selectCount: 0, // 多选计数
      showParent: false, // 显示上级标识
      modalTitle: "", // 添加标题
      editTitle: "", // 编辑节点名称
      searchKey: "", // 搜索树
      architecture:true,//建筑标识
      floor:false,//楼层标识
      leveltrue:false, //上级是否是下拉选择或者编辑
      form: {
        // 编辑对象初始化数据
        id: "",
        title: "",
        parentId: "",
        departmentId:"",
        parentTitle: "",
        sort: 0,
        status: 0,
        level:0,
        img:""
        //departmentTitle:""
      },
      formAdd: {
        // 添加对象初始化数据
      },
      formValidate: {
        // 表单验证规则
        title: [{ required: true, message: "楼层名称不能为空", trigger: "blur" }],
        parentTitle: [{ required: true, message: "建筑名称不能为空", trigger: "blur" }],
        sort: [{ validator: validateMobile1111, trigger: "blur" }]
      },
      submitLoading: false,
      data: [],
      dataEdit: []
    };
  },
  methods: {
    init() {
      // 初始化一级节点
      this.getParentList();
      // 初始化一级节点为编辑上级节点使用
      this.getParentListEdit();
    },
    getParentList() {
      this.loading = true;
      this.getRequest("/floor/getAllList").then(res => {
        this.loading = false;
        if (res.success == true) {
          res.result.forEach(function(e) {
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
          });
          this.data = res.result;
        }
      });
    },

    handleSelectDepTree(v) {
      this.form.departmentId = v[0];
    },

    getParentListEdit() {
      this.loadingEdit = true;
      this.getRequest("/floor/getAllList?parentId=0").then(res => {
        this.loadingEdit = false;
        if (res.success == true) {
          res.result.forEach(function(e) {
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
          });
          this.dataEdit = res.result;
        }
      });
    },
    loadData(item, callback) {
      异步加载树子节点数据
      this.getRequest("/floor/getAllList?parentId=0" + item.id).then(res => {
        if (res.success == true) {
          res.result.forEach(function(e) {
            if (e.isParent) {
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
        this.loading = true;
        this.getRequest("/floor/getAllList?parentId=0", { name: this.searchKey }).then(res => {
          this.loading = false;
          if (res.success == true) {
            this.data = res.result;
          }
        });
        // 模拟请求成功
        // this.data = [
        //   {
        //     title: "这里需要请求后台接口",
        //     id: "1",
        //     parentId: "0",
        //     parentTitle: "一级节点",
        //     status: 0
        //   },
        //   {
        //     title: "所以这里是假数据",
        //     id: "4",
        //     parentId: "0",
        //     parentTitle: "一级节点",
        //     status: 0
        //   },
        //   {
        //     title: "我是被禁用的节点",
        //     id: "5",
        //     parentId: "0",
        //     parentTitle: "一级节点",
        //     status: -1
        //   }
        // ];
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
        this.form = data;
        this.editTitle = data.title;
        if(this.form.level === 2){
          this.leveltrue = true;
        }else{
          this.leveltrue = false;
        }
        //this.$refs.depTree.setData([data.departmentId], data.departmentTitle);
        //此处为判断是否为建筑 如果是建筑就不显示一级节点
        if(data.parentId !='0'){
          this.architecture = true;
          this.floor = true;
          this.form.parentTitle =data.parentTitle;
        }else{
          this.architecture = true;
          this.floor =false;
          this.form.parentTitle =data.title;
        }
      } else {
        this.cancelEdit();
      }
    },
    cancelEdit() {
      let data = this.$refs.tree.getSelectedNodes()[0];
      if (data) {
        data.selected = false;
      }
      this.$refs.form.resetFields();
      delete this.form.id;
      this.editTitle = "";
      this.form.title = "";
      this.architecture = true;
      this.floor = false;


      
    },
    selectTreeEdit(v) {
      if (v.length > 0) {
        // 转换null为""
        for (let attr in v[0]) {
          if (v[0][attr] == null) {
            v[0][attr] = "";
          }
        }
        let str = JSON.stringify(v[0]);
        let data = JSON.parse(str);
        this.form.parentId = data.id;
        this.form.parentTitle = data.title;
      }
    },
    handleReset() {
      this.$refs.form.resetFields();
      this.form.status = 0;
      this.architecture = true;
      this.floor = false;
      this.form.parentTitle = "";
    },
    submitEdit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.id) {
            this.$Message.warning("请先点击选择要修改楼层或建筑信息");
            return;
          }
          this.submitLoading = true;
          // 避免传入null字符串
          this.postRequest("/floor/editFloor", this.form).then(res => {
            this.submitLoading = false;
            if (res.success == true) {
              this.$Message.success("编辑成功");
              this.init();
              // 初始化一级节点
              this.getParentList();
              // 初始化一级节点为编辑上级节点使用
              this.getParentListEdit();
              this.modalVisible = false;
            }
          });
        }
      });
    },
    submitAdd() {
      this.$refs.formAdd.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.postRequest("/floor/addFloor", this.formAdd).then(res => {
            this.submitLoading = false;
            if (res.success == true) {
              this.$Message.success("添加成功");
              this.init();
              this.modalVisible = false;
            }
          });
        }
      });
    },
    add() {
      if (this.form.id == "" || this.form.id == null) {
        this.$Message.warning("请先点击选择建筑信息");
        return;
      }
      if(this.form.level >=2){
        this.$Message.warning("楼层内无法继续添加下级信息");
        return;
      }
      this.modalTitle = "添加楼层信息";
      this.showParent = true;
      this.formAdd = {
        parentId: this.form.id,
        sort: 0,
        status: 0,
        level: this.form.level+1
      };
      this.modalVisible = true;
    },
    addRoot() {
      this.modalTitle = "添加建筑信息";
      this.showParent = false;
      this.formAdd = {
        parentId: 0,
        sort: 0,
        status: 0,
        level:1,
      };
      this.modalVisible = true;
    },
    changeSelect(v) {
      this.selectCount = v.length;
      this.selectList = v;
    },
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未勾选要删除的数据");
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
          this.deleteRequest("/floor/delByIds/" + ids).then(res => {
            if (res.success == true) {
              this.$Message.success("删除成功");
              this.selectList = [];
              this.selectCount = 0;
              this.cancelEdit();
              this.init();
            }
          });
          // 模拟成功
          // this.$Message.success("删除成功");
          // this.selectList = [];
          // this.selectCount = 0;
          // this.cancelEdit();
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