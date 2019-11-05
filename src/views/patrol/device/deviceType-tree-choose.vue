<template>
  <div>
    <Poptip trigger="click" placement="right" title="选择设备类型" width="250">
      <div style="display:flex;">
        <Input
          v-model="deviceTypeName"
          readonly
          style="margin-right:10px;"
          :placeholder="placeholder"
        />
        <Button icon="md-trash" @click="clearSelect">清空已选</Button>
      </div>
      <div slot="content" class="tree-bar">
        <Input
          v-model="searchKey"
          suffix="ios-search"
          @on-change="searchDeviceType"
          placeholder="输入设备类型名搜索"
          clearable
        />
        <Tree
          :data="dataDeviceType"
          :load-data="loadData"
          @on-select-change="selectTree"
          :multiple="multiple"
        ></Tree>
        <Spin size="large" fix v-if="deviceTypeLoading"></Spin>
      </div>
    </Poptip>
  </div>
</template>

<script>
import { initDeviceTree, loadDeviceTree, searchDeviceTree } from "@/api/index";
export default {
  name: "deviceTypeTreeChoose",
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "点击选择设备类型"
    }
  },
  data() {
    return {
      deviceTypeLoading: false,
      deviceTypeName: "",
      searchKey: "",
      dataDeviceType: [],
      selectDeviceType: [],
      deviceType: []
    };
  },
  methods: {
    initDeviceTreeData() {
      initDeviceTree().then(res => {
        if (res.success == true) {
          res.result.forEach(function(e) {
            if (e.level!=3) {
              e.loading = false;
              e.children = [];
            }
            if (e.status == -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          this.dataDeviceType = res.result;
        }
      });
    },
    loadData(item, callback) {
      loadDeviceTree(item.id).then(res => {
        if (res.success == true) {
          res.result.forEach(function(e) {
            if (e.level!=3) {
              e.loading = false;
              e.children = [];
            }
            if (e.status == -1) {
              e.title = "[已禁用] " + e.title;
              e.disabled = true;
            }
          });
          callback(res.result);
        }
      });
    },
    searchDeviceType() {
      // 搜索部门
      if (this.searchKey) {
        this.deviceTypeLoading = true;
        searchDeviceTree({ title: this.searchKey }).then(res => {
          this.deviceTypeLoading = false;
          if (res.success) {
            res.result.forEach(function(e) {
              if (e.status == -1) {
                e.title = "[已禁用] " + e.title;
                e.disabled = true;
              }
            });
            this.dataDeviceType = res.result;
          }
        });
      } else {
        this.initDeviceTreeData();
      }
    },
    selectTree(v) {
      let ids = [],
        title = "";
      v.forEach(e => {
        ids.push(e.id);
        if (title == "") {
          title = e.title;
        } else {
          title = title + "、" + e.title;
        }
      });
      this.deviceTypeId = ids;
      this.deviceTypeName = title;
      this.$emit("on-change", this.deviceTypeId);
    },
    clearSelect() {
      this.deviceTypeId = [];
      this.deviceTypeName = "";
      this.initDeviceTreeData();
      this.$emit("on-change", this.deviceTypeId);
    },
    setData(ids, title){
      this.deviceTypeId = ids;
      this.deviceTypeName = title;
      this.$emit("on-change", this.deviceTypeId);
    }
  },
  created() {
    this.initDeviceTreeData();
  }
};
</script>

<style lang="less">
.tree-bar {
    max-height: 500px;
    overflow: auto;
    margin-top: 5px;
}

.tree-bar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.tree-bar::-webkit-scrollbar-thumb {
    border-radius: 4px;
    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
    background: #e4e4e4;
}

.ivu-tree .ivu-tree-empty {
    margin-top: 10px;
    font-size: 12px;
}
</style>

