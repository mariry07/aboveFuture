<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>

<template>
    <div>
        <div v-show="currNav=='xboot'">
            <Row :gutter="10">
                <Col :md="24" :lg="8">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                    <Card>
                        <Row type="flex" class="user-infor">
                            <Col span="8">
                            <Row class-name="made-child-con-middle" type="flex" align="middle">
                                <img class="avator-img" :src="avatarPath" />
                            </Row>
                            </Col>
                            <Col span="16" style="padding-left:6px;">
                            <Row class-name="made-child-con-middle" type="flex" align="middle">
                                <div>
                                    <b class="card-user-infor-name">{{ username }}</b>
                                    <p>智慧应用开发平台 欢迎您的使用</p>
                                </div>
                            </Row>
                            </Col>
                        </Row>
                        <!-- <div class="line-gray"></div>
                        <Row class="margin-top-8">
                            <Col span="8">
                            <p class="notwrap">本次登录地点:</p>
                            </Col>
                            <Col span="16" class="padding-left-8">{{city}}</Col>
                        </Row>
                        <Row class="margin-top-8">
                            <Col span="8">
                            <p class="notwrap">天气:</p>
                            </Col>
                            <Col span="16" class="padding-left-8">{{weather}}</Col>
                        </Row> -->
                    </Card>
                    </Col>
                </Row>
                </Col>
                <Col :md="24" :lg="16">
                    <Row :gutter="5">
                        <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card id-name="user_created_count" :end-val="count.createUser" iconType="md-person-add" color="#2d8cf0" intro-text="今日新增用户"></infor-card>
                        </Col>
                        <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card id-name="visit_count" :end-val="count.visit" iconType="ios-eye" color="#64d572" :iconSize="50" intro-text="今日浏览量"></infor-card>
                        </Col>
                        <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card id-name="collection_count" :end-val="count.collection" iconType="md-cloud-upload" color="#ffd572" intro-text="今日数据采集量"></infor-card>
                        </Col>
                        <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card id-name="transfer_count" :end-val="count.transfer" iconType="md-shuffle" color="#f25e43" intro-text="今日服务调用量"></infor-card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <!-- <Row :gutter="10">
                <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="md-map"></Icon>
                        每日来访量统计
                    </p>
                    <div class="data-source-row">
                        <visite-volume></visite-volume>
                    </div>
                </Card>
                </Col>
                <Col :md="24" :lg="16" :style="{marginBottom: '10px'}">
                    <Card :padding="0">
                        <p slot="title" class="card-title">
                            <Icon type="md-locate"></Icon>
                            今日服务调用地理分布
                        </p>
                        <div class="map-con">
                            <Col span="10">
                            <map-data-table :cityData="cityData" height="281" :style-obj="{margin: '12px 0 0 11px'}"></map-data-table>
                            </Col>
                            <Col span="14" class="map-incon">
                            <Row type="flex" justify="center" align="middle">
                                <home-map :city-data="cityData"></home-map>
                            </Row>
                            </Col>
                        </div>
                    </Card>
                </col>
            </Row> -->
            <!-- <Modal
                v-model="showVideo"
                title="作者亲自制作XBoot炫酷文字快闪宣传片"
                :styles="{top: '30px'}"
                footer-hide
                width="1000"
                >
                <iframe src="//player.bilibili.com/player.html?aid=30284667&cid=52827707&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width:100%;height:550px;"> </iframe>
            </Modal> -->
        </div>
        <div v-show="currNav=='doc'||currNav=='xboot-show'||currNav=='xpay'||currNav=='xmall'">
            <show/>
        </div>
        <div v-show="currNav=='app'">
            <h1>我是智慧应用开发平台 App的首页，点击左侧菜单查看详情</h1>
        </div>
    </div>
</template>

<script>
import { ipInfo } from "@/api/index";
import cityData from "./map-data/get-city-value.js";
import homeMap from "./components/map.vue";
import visiteVolume from "./components/visiteVolume.vue";
import userFlow from "./components/userFlow.vue";
import countUp from "./components/countUp.vue";
import inforCard from "./components/inforCard.vue";
import mapDataTable from "./components/mapDataTable.vue";
import show from "./show.vue";
import Cookies from "js-cookie";
import "gitalk/dist/gitalk.css";
import Gitalk from "gitalk";

export default {
  name: "home",
  components: {
    homeMap,
    visiteVolume,
    userFlow,
    countUp,
    inforCard,
    mapDataTable,
    show
  },
  data() {
    return {
      count: {
        createUser: 496,
        visit: 3264,
        collection: 24389305,
        transfer: 39503498
      },
      cityData: cityData,
      newToDoItemValue: "",
      city: "",
      weather: "",
      username: ""
    };
  },
  computed: {
    currNav() {
      return this.$store.state.app.currNav;
    },
    avatarPath() {
      return localStorage.avatorImgPath;
    }
  },
  methods: {
    init() {
      let userInfo = JSON.parse(Cookies.get("userInfo"));
      this.username = userInfo.username;
      ipInfo().then(res => {
        if (res.success) {
          if(!res.result){
              return
          }
          let ipInfo = JSON.parse(res.result);
          if (ipInfo.retCode == "200") {
            let info = ipInfo.result[0];
            let weather =
              info.weather +
              " " +
              info.temperature +
              " 污染指数: " +
              info.pollutionIndex;
            this.city = info.city;
            this.weather = weather;
          } else {
            this.city = "未知";
            this.weather = "未知";
          }
        }
      });
    }
  },
  mounted() {
    this.init();
    // var gitalk = new Gitalk({
    //   clientID: "a128de2dd7383614273a",
    //   clientSecret: "a77691ecb662a8303a6c686ae651ae035868da6e",
    //   repo: "xboot-comments",
    //   owner: "Exrick",
    //   admin: ["Exrick"],
    //   distractionFreeMode: false // 遮罩效果
    // });
    // gitalk.render("comments");
    // // 宣传视频
    // let xbootVideo = Boolean(Cookies.get("xbootVideo"));
    // if (!xbootVideo) {
    //   this.showVideo = true;
    //   Cookies.set("xbootVideo", true);
    // }
  }
};
</script>
