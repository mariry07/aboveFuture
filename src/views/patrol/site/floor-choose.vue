<template>
  <div>
    <Cascader
      v-model="selectFloor"
      :data="floor"
      :load-data="loadData"
      @on-change="handleChangeFloor"
      change-on-select
      filterable
      clearable
      placeholder="请选择或输入搜索楼层"
    ></Cascader>
  </div>
</template>

<script>
import { initFloor, loadFloor } from "@/api/index";
export default {
  name: "floorChoose",
  props: {

  },
  data() {
    return {
      selectFloor: [],
      floor: []
    };
  },
  methods: {
    initFloorData() {
      initFloor().then(res => {
        if (res.success == true) {
          res.result.forEach(function(e) {
            if (e.level!=2) {
              e.value = e.id;
              e.label = e.title;
              e.loading = false;
              e.children = [];
            } else {
              e.value = e.id;
              e.label = e.title;
            }
            if (e.status == -1) {
              e.label = "[已禁用] " + e.label;
              e.disabled = true;
            }
          });
          this.floor = res.result;
        }
      });
    },
    loadData(item, callback) {
      item.loading = true;
      loadFloor(item.value).then(res => {
        item.loading = false;
        if (res.success == true) {
          res.result.forEach(function(e) {
            if (e.level!=2) {
              e.value = e.id;
              e.label = e.title;
              e.loading = false;
              e.children = [];
            } else {
              e.value = e.id;
              e.label = e.title;
            }
            if (e.status == -1) {
              e.label = "[已禁用] " + e.label;
              e.disabled = true;
            }
          });
          item.children = res.result;
          callback();
        }
      });
    },
    handleChangeFloor(value, selectedData) {
      let floor = "";
      // 获取最后一个值
      if (selectedData && selectedData.length > 0) {
        floor = selectedData[selectedData.length - 1];
      }
      this.$emit("on-change", floor);
    },
    clearSelect() {
      this.selectFloor = [];
    }
  },
  created() {
    this.initFloorData();
  }
};
</script>

<style lang="less">
</style>

