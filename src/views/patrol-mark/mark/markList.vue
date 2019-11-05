<style lang="less">
  @import "./markList.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
            <Form-item label="巡更点名称">
              <Input type="text" v-model="searchForm.name" clearable placeholder="请输入搜索关键词" style="width: 200px"/>
            </Form-item>
            <Form-item label="创建时间">
              <DatePicker type="daterange" v-model="selectDate" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
            </Form-item>
            <Form-item style="margin-left:-35px;" class="br">
              <Button @click="handleSearch"  type="primary" icon="ios-search">搜索</Button>
              <Button @click="handleReset" icon="ios-refresh">重置</Button>
            </Form-item>
          </Form>
          <Row class="operation">
            <Button @click="add" type="primary" icon="md-add">添加巡更点</Button>
<!--            <Button @click="printQrCode" type="primary" icon="md-print">打印二维码</Button>-->
            <Button @click="del" icon="md-trash">批量删除</Button>
            <Button @click="getPatrolMarkList" icon="md-refresh">刷新</Button>
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
            <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-sort-change="changeSort" @on-selection-change="changeSelect"></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal v-model="picVisible" title="图片预览" footer-hide draggable>
        <img :src="infoForm.qrCode" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
    </Modal>

<!--    <div id="subOutputRank-print">-->
<!--&lt;!&ndash;      <img :src="printPage.qrCode" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">&ndash;&gt;-->
<!--    </div>-->

    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable="false" :width="760">
      <Form ref="form" :model="form" :label-width="70" :rules="formValidate">
        <div style="height: 0px;">
          <Input type="hidden" v-model="form.posX">纬度</Input>
          <Input type="hidden" v-model="form.posY">经度</Input>
        </div>
        <Row>
          <Col span="12">
            <FormItem label="名称" prop="name">
              <Input v-model="form.name"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="描述" prop="description">
              <Input v-model="form.description"></Input>
            </FormItem>
          </Col>
        </Row>
        <!--    高德地图引入    -->
        <div id="container" style="height:400px;margin: 16px;">
        </div>
      </Form>
      <div slot="footer">
        <Button type="default" @click="modalCancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSubmit">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getPatrolMarkData,deletePatrolMark,savePatrolMark,updatePatrolMark,getCountByName} from "@/api/index";
  import circleLoading from "@/views/my-components/circle-loading.vue";

  import AMap from 'AMap' // 引入高德地图
  //高德地图变量
  let map = null;
  let marker = null;
  export default {
    // name: "role-manage",
    components: {
      circleLoading
    },
    data() {
      return {
        // 表单
        loading: true,// 表单加载状态
        operationLoading: false,// 操作加载状态
        modalType: 0, // 添加或编辑标识
        modalVisible: false, // 添加或编辑显示
        modalTitle: "", // 添加或编辑标题
        selectList: [],
        selectCount: 0,
        selectDate: null,
        searchKey: "",
        searchForm: { // 搜索框初始化对象
          type: 1,
          pageNumber: 1,
          pageSize: 10,
          startDate: "",
          endDate: "",
          sort: "createTime",
          order: "desc"
        },
        // 表单验证规则
        formValidate: {
          name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
          description: [{ required: true, message: "描述不能为空", trigger: "blur" }]
        },
        form: { // 添加或编辑表单对象初始化数据
          name: "",
          description:""
        },
        picVisible: false, // 图片预览默认关闭
        columns: [
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
            title: "名称",
            key: "name",
            width: 260,
            sortable: true,
            fixed: "left"
          },
          {
            title: "描述",
            key: "description"
          },
          {
            title: "创建时间",
            key: "createTime",
            sortable: true,
            sortType: "desc",
            width: 180
          },
            {
                title: "图片(点击可预览)",
                key: "qrCode",
                align: "center",
                render: (h, params) => {
                    return h("img", {
                        attrs: {
                            src: params.row.qrCode,
                            alt: "加载图片失败"
                        },
                        style: {
                            cursor: "pointer",
                            width: "40px",
                            height: "40px",
                            "margin-top": "5px",
                            "object-fit": "contain"
                        },
                        on: {
                            click: () => {
                                this.showPic(params.row);
                            }
                        }
                    });
                }
            },
          {
            title: "操作",
            key: "action",
            align: "center",
            width: 300,
            fixed: "right",
            render: (h, params) => {
              return h("div", [
                h(
                        "Button",
                        {
                          props: {
                            type: "info",
                            size: "small",
                          },
                          style: {
                            marginRight: "5px"
                          },
                          on: {
                            click: () => {
                              this.printQrCode(params.row);
                            }
                          }
                        },
                        "打印二维码"
                ),
                h(
                        "Button",
                        {
                          props: {
                            type: "primary",
                            size: "small",
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
                          },
                          on: {
                            click: () => {
                              this.remove(params.row);
                            }
                          }
                        },
                        "删除"
                ),
              ]);
            }
          }
        ],
        data: [],
        infoForm: {},
        printPage: {},
        total: 0
      };
    },
    methods: {
      //表单
      init() {
        this.getPatrolMarkList();
      },
      changePage(v) {
        this.searchForm.pageNumber = v;
        this.getPatrolMarkList();
        this.clearSelectAll();
      },
      changePageSize(v) {
        this.searchForm.pageSize = v;
        this.getPatrolMarkList();
      },
      selectDateRange(v) {
        if (v) {
          this.searchForm.startDate = v[0];
          this.searchForm.endDate = v[1];
        }
      },
      handleSearch() {
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.getPatrolMarkList();
      },
      handleReset() {
        this.searchKey = "";
        this.selectDate = null;
        this.searchForm.name ="";
        this.searchForm.startDate = "";
        this.searchForm.endDate = "";
        this.getPatrolMarkList();
      },
      clearSelectAll() {
        this.$refs.table.selectAll(false);
      },
      changeSelect(e) {
        this.selectList = e;
        this.selectCount = e.length;
      },
      changeSort(e) {
        this.searchForm.sort = e.key;
        this.searchForm.order = e.order;
        if (e.order == "normal") {
          this.searchForm.order = "";
        }
        this.getPatrolMarkList();
      },
      getPatrolMarkList() {
        this.loading = true;
        this.searchForm.key = this.searchKey;
        getPatrolMarkData(this.searchForm).then(res => {
          this.loading = false;
          if (res.success == true) {
            this.data = res.result.content;
            this.total = res.result.totalElements;
          }
          this.clearSelectAll();
        });
      },
      showPic(v) {
        this.infoForm.qrCode = v.qrCode;
        this.picVisible = true;
      },
      remove(v) {
        this.$Modal.confirm({
          title: "确认删除",
          content: "您确认要删除该条数据?",
          onOk: () => {
            this.operationLoading = true;
            deletePatrolMark(v.id).then(res => {
              this.operationLoading = false;
              if (res.success == true) {
                this.$Message.success("删除成功");
                this.init();
              }
            });
          }
        });
      },
      del() {
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
            this.operationLoading = true;
            deletePatrolMark(ids).then(res => {
              this.operationLoading = false;
              if (res.success == true) {
                this.$Message.success("删除成功");
                this.clearSelectAll();
                this.init();
              }
            });
          }
        });
      },
      printQrCode(v) {
        this.$Modal.confirm({
          title: "确认打印",
          content: "您确认要打印该条数据的二维码?",
          onOk: () => {
            this.printContent(v.qrCode);
          }
        });
      },
      printContent(qrCode){
        let pwindow = window.open();
        //pwindow.document.write('<!DOCTYPE html><html lang="pl"><head><meta charset="UTF-8"></head><body> </body></html>');
        let qrCodeHtml = "<div><img : src='" + qrCode + "'style='width:50%;margin:0px auto;display:block;'></div>";
        pwindow.document.body.innerHTML = qrCodeHtml;
        setTimeout( function(){
          pwindow.print();
          pwindow.close();
        }, 20);
        return false;
      },
      add() {
        this.modalType = 0;
        this.modalTitle = "添加巡更点";
        this.$refs.form.resetFields();
        this.form = { // 添加表单对象初始化数据
          name: "",
          description:""
        },
        this.modalVisible = true;
        //初始化地图
        this.initAmap();
      },
      edit(v) {
        this.modalType = 1;
        this.modalTitle = "修改巡更点";
        this.$refs.form.resetFields();

        this.modalVisible = true;
        // 转换null为""
        for (let attr in v) {
          if (v[attr] == null) {
            v[attr] = "";
          }
        }
        let str = JSON.stringify(v);
        let data = JSON.parse(str);
        this.form = data;
        //初始化地图
        this.initAmap();
        //在地图上新增标记点
        this.addMarker(data.posX,data.posY);
      },
      modalCancel(){
        this.modalVisible = false;
        map && map.destroy();
      },
      handleSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            //验证是否选择标记位置
            if(this.form.posX == undefined || this.form.posY == undefined){
              this.$Modal.warning({
                title: "巡更点位置",
                content: "请在地图上选择巡更点位置"
              });
              return;
            }
            //判断是否存在相同巡更点
            getCountByName(this.form).then(res => {
              if (res.success == true && res.result > 0) {
                this.$Message.warning("存在相同名称的巡更点！");
                return;
              }else{
                this.submitLoading = true;
                // 添加
                if(this.modalType == 0){
                  savePatrolMark(this.form).then(res => {
                    this.submitLoading = false;
                    if (res.success == true) {
                      this.$Message.success("操作成功");
                      this.getPatrolMarkList();
                      this.modalVisible = false;
                    }
                  });
                }
                // 编辑
                if(this.modalType == 1){
                  updatePatrolMark(this.form).then(res => {
                    this.submitLoading = false;
                    if (res.success == true) {
                      this.$Message.success("操作成功");
                      this.getPatrolMarkList();
                      this.modalVisible = false;
                    }
                  });
                }
              }
            });

          }
        });
      },
      //高德地图初始化
      initAmap () {
        map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 13
        });
        let type = this.modalType;
        //插件
        AMap.plugin(['AMap.ToolBar','AMap.Geolocation'], function(){
          // 工具条控件
          map.addControl(new AMap.ToolBar({
            // 简易缩放模式，默认为 false
            liteStyle: true
          }));
          // 高精度定位控件
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：5s
            buttonPosition:'LB',    //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(20, 40),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
          });
          map.addControl(geolocation);
          //新增窗口，IP定位
          if(type == 0){
            geolocation.getCurrentPosition(function (status, result) {
              if (status == 'complete') {
                map.center = [result.position.lng, result.position.lat];
              } else {
                console.log(result);
              }
            });
          }
        });
        //事件
        map.on('click', this.mapClickEvent);
      },
      //地图点击事件
      mapClickEvent(e){
        this.addMarker(e.lnglat.getLng(),e.lnglat.getLat());
        this.form.posX = e.lnglat.getLng();
        this.form.posY = e.lnglat.getLat();
      },
      //添加标记点（唯一标记点）
      addMarker(lng,lat){
        if(lng == undefined || lat == undefined){
          return;
        }
        if(marker != null){
          map.remove(marker);
          marker = null;
        }
        marker = new AMap.Marker({
          position: [lng,lat]
        });
        marker.setMap(map);
        //地图缩放至指定级别并以指定点为地图显示中心点。
        map.setZoomAndCenter(16,[lng,lat])
      }
    },
    mounted() {
      this.init();
    }
  };
</script>
