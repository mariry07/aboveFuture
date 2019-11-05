<style lang="less">
</style>
<template>
<!--  justify="end"-->

  <Row :gutter="10" align="top" class="code-row-bg" >
      <Col span="16" >
        <Card :bordered="false">
          <!--    高德地图引入    -->
          <div id="container" style="height:780px;width: 100%;">
          </div>
        </Card>
      </Col>
      <Col span="8" >
        <Card :bordered="false" style="height:410px;">
            <p slot="title">人员位置</p>
<!--            <Form ref="searchForm" :model="searchForm" inline :label-width="60" class="search-form">-->
<!--            </Form>-->
            <Row>
              <Table border highlight-row :columns="columns" :data="data" :loading="loading" @on-current-change="handleRowChange" ref="table"></Table>
            </Row>
            <!--             show-sizer           :page-size-opts="[5]"-->
            <Row type="flex" justify="end" class="page" style="margin-top: 15px;">
                <Page
                        :current="searchForm.pageNumber"
                        :total="total"
                        :page-size="searchForm.pageSize"
                        @on-change="changePage"
                        @on-page-size-change="changePageSize"
                        size="small"
                        show-total
                        show-elevator
                ></Page>
            </Row>
        </Card>
        <Card :bordered="false" style="min-height:390px;margin-top: 10px;">
           <p slot="title">历史轨迹</p>
           <div>
              <Form ref="form" :model="form" :label-width="75" :rules="formValidate">
                      <FormItem label="选择人员" >
                          <div style="display:inline;padding-left: 60px;" >
                              <Input v-model="form.username" style="width: 200px" readonly></Input></div>
                      </FormItem>
                      <FormItem label="选择日期">
                          <div style="display:inline;padding-left: 60px;" ></div>
                          <DatePicker type="date" placeholder="选择日期" style="width: 200px"></DatePicker>
                      </FormItem>
                      <FormItem label="选择时间">
                          <div style="display:inline;padding-left: 60px;" ></div>
                          <TimePicker format="HH:mm" type="timerange" placement="bottom-end" placeholder="开始时间" style="width: 200px"></TimePicker>
                      </FormItem>
                      <Button  @click="trail" type="default">回放查询</Button>
                      <ButtonGroup style="margin-left: 55px;">
                          <Button @click="startAnimation" type="primary" icon="md-arrow-forward">开始</Button>
                          <Button @click="pauseAnimation" type="primary" icon="md-pause">暂停</Button>
                          <Button @click="resumeAnimation" type="primary" icon="md-play">继续</Button>
                          <Button @click="stopAnimation" type="primary" icon="md-square">停止</Button>
                      </ButtonGroup>
              </Form>
           </div>
        </Card>
      </Col>
  </Row>
</template>

<script>
  import { getUserListData } from "@/api/index";
  import AMap from 'AMap' // 引入高德地图
  //高德地图变量
  let map = null;
  let marker = null;
  let icon = null;

  let polyline = null;
  let passedPolyline = null;
  //坐标
  let lineArr = [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]];

  export default {
    data() {
      return {
        loading: false,
        searchForm: {
            username: "",
            departmentId: "",
            mobile: "",
            email: "",
            sex: "",
            type: "",
            status: "",
            pageNumber: 1,
            pageSize: 5,
            sort: "createTime",
            order: "desc",
            startDate: "",
            endDate: ""
        },
        columns: [
          {
            title: '人员名称',
            key: 'username',
          },
         {
            title: "手机",
            key: "mobile",
            align: "center",
            sortable: true,
            render: (h, params) => {
                if (this.getStore("roles").includes("ROLE_ADMIN")) {
                    return h("span", params.row.mobile);
                } else {
                    return h("span", "您无权查看该数据");
                }
            }
         },
          {
            title: "角色",
            key: "type",
            align: "center",
              width: 150,
            render: (h, params) => {
                let re = "";
                if (params.row.type == 1) {
                    re = "管理员";
                } else if (params.row.type == 0) {
                    re = "普通用户";
                }
                return h("div", re);
            }
          }
        ],
        form:{
            username: "",
            id: ""
        },
        data: [],
        total: 0,
      }
    },
    methods: {
        init() {
            this.getUserList();
        },
        //选择人员
        handleRowChange(currentRow, oldCurrentRow){
            this.form.username = currentRow.username;
            this.form.id = currentRow.id;
        },
        changePage(v) {
            this.searchForm.pageNumber = v;
            this.getUserList();
            this.clearSelectAll();
        },
        changePageSize(v) {
            this.searchForm.pageSize = v;
            this.getUserList();
        },
        handleSearch() {
            this.searchForm.pageNumber = 1;
            this.searchForm.pageSize = 5;
            this.getUserList();
        },
        handleReset() {
            this.$refs.searchForm.resetFields();
            this.searchForm.pageNumber = 1;
            this.searchForm.pageSize = 5;
            // 重新加载数据
            this.getUserList();
        },
        getUserList() {
            this.loading = true;
            getUserListData(this.searchForm).then(res => {
                this.loading = false;
                if (res.success == true) {
                    this.data = res.result.content;
                    this.total = res.result.totalElements;
                }
            });

        },
        // handleClearCurrentRow () {
        //     this.$refs.currentRowTable.clearCurrentRow();
        // },
        trail(){
            // todo 清空,移除事件
            if(marker != null) {
                //停止移动
                marker.stopMove();
                map.remove(marker);
                marker = null;
            }
            if(polyline != null){
                map.remove(polyline);
                polyline = null;
            }
            if(passedPolyline != null){
                map.remove(passedPolyline);
                passedPolyline = null;
            }
            // marker
            icon = new AMap.Icon({
                size: new AMap.Size(40, 50),    // 图标尺寸
                //image:'//webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png',
                image:  require("@/assets/trail-man.png"),  // Icon的图像
                //imageOffset: new AMap.Pixel(0, -60),  // 图像相对展示区域的偏移量，适于雪碧图等
                //imageSize: new AMap.Size(40, 50)   // 根据所设置的大小拉伸或压缩图片
            });
            marker = new AMap.Marker({
                map: map,
                position: [116.478935,39.997761],
                icon: "https://webapi.amap.com/images/car.png",
                //icon: require("@/assets/trail-man.png"),
                //icon: icon,
                offset: new AMap.Pixel(-26, -13),
                autoRotation: true,
                angle:-90,
            });
            marker.on('moving', function (e) {
                passedPolyline.setPath(e.passedPath);
            });
            // 绘制轨迹
            polyline = new AMap.Polyline({
                map: map,
                path: lineArr,
                showDir:true,
                strokeColor: "#28F",  //线颜色
                // strokeOpacity: 1,     //线透明度
                strokeWeight: 6,      //线宽
                // strokeStyle: "solid"  //线样式
            });
            passedPolyline = new AMap.Polyline({
                map: map,
                // path: lineArr,
                strokeColor: "#AF5",  //线颜色
                // strokeOpacity: 1,     //线透明度
                strokeWeight: 6,      //线宽
                // strokeStyle: "solid"  //线样式
            });
            map.setFitView();
         },
        //高德地图初始化
        initAmap () {
            map = new AMap.Map('container', {
                center: [116.397428, 39.90923],
                zoom: 17,
                resizeEnable: true,
            });
            //插件
            AMap.plugin(['AMap.ToolBar','AMap.Geolocation'], function(){
              // 工具条控件
              map.addControl(new AMap.ToolBar({
                // 简易缩放模式，默认为 false
                liteStyle: true
              }));
            });
        },
        //开始
        startAnimation () {
          marker.moveAlong(lineArr, 200);


        },
        //暂停
        pauseAnimation () {
          marker.pauseMove();
        },
        //继续
        resumeAnimation () {
          marker.resumeMove();
        },
        //停止
        stopAnimation () {
          marker.stopMove();
          //this.trail();
        }
    },
    mounted() {
        this.init();
        this.initAmap();
    }
  };
</script>
