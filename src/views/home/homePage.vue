<style lang="less">
@import "./homePage.less";
@import "../../styles/common.less";
</style>
<template>
  <div class="screen-body">
    <div class="screen-nav-wrap">
      <div class="left-nav">
        <div class="logo">
          <img
            src="../../assets/logo.png"
            alt=""
          >
        </div>
        <ul class="nav">
          <!-- <li class="active">排名</li>
          <li>异常</li>
          <li>建议</li> -->
        </ul>
      </div>
      <div class="right-nav">
        <div class="right-menu">
          <div class="user-name">
            中国电科

          </div>
          <div class="user">
            <Dropdown
              trigger="click"
              @on-click='change'
            >
              <a href="javascript:void(0)">
                <img
                  src="../../assets/user_icon.png"
                  alt=""
                >
                <Icon type="arrow-down-b"></Icon>
              </a>
              <Dropdown-menu slot="list">
                <Dropdown-item name="home">{{$t('toHomeIndex')}}</Dropdown-item>
                <Dropdown-item name="loginOut">{{ $t('logout') }}</Dropdown-item>

              </Dropdown-menu>
            </Dropdown>

          </div>
        </div>
      </div>
    </div>
    <div class="screen-content-wrap">
      <div class="fl">
        <div class="box">
          <div class="title">报警总数<span>TOP5</span></div>
          <div class="a-btn">
            <img class="img" src="../../assets/more.png" alt="" ></div>
          <div class="ranking-wrap">
            <ul>

              <li
                v-for="(item, index) in cityName"
                :key="index"
              >
                <div class="name">{{item}}</div>
                <div class="precent-wrap">
                  <div
                    class="inner"
                    style="width: 10%;"
                  ></div>
                </div>
                <div class="num">{{cityCount[index]}}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="box">
          <div class="title">报警类型<span>TOP5</span></div>
          <div class="a-btn"><img class="img"
              src="../../assets/date.png"
              alt=""
            ></div>

          <div class="chart-wrap">
            <div id="chart">
              <apexchart
                type=donut

                :options="chartOptions"
                :series="series"
              />
              <!--width=380-->
            </div>
          </div>
        </div>
        <div class="box">
          <div class="title">报警历史趋势</div>
          <div class="a-btn"><img  class="img"
              src="../../assets/date.png"
              alt=""
            ></div>

          <div class="charts-wrap">
            <!-- <div
              class="chart"
              id="charttrend"
            ></div> -->
            <div id="chart">
              <apexchart
                type=line
                :options="labelChartOptions"
                :series="labelSeries"
              />
              <!--height=300-->
            </div>
          </div>
        </div>
      </div>
      <div class="c">
        <div class="box_c1">
          <!-- <div class="title">
            <div class="name active">常规地图</div>
            <div class="name">热力地图</div>
          </div> -->
          <!-- <div class="a-btn"><img  class="img"
              src="../../assets/fun.png"
              alt=""
            ></div>
          <div class="map-tools">
            <img
              src="../../assets/map3.png"
              alt=""
            >
            <img
              src="../../assets/map1.png"
              alt=""
            >
            <img
              src="../../assets/map2.png"
              alt=""
            >
          </div> -->
          <div
            :style="{width:'100%',height:'100%'}"
            id="homeAmap"
          >

            <div class="charts-wrap">
              <div class="toolbar">
                <span v-if="loaded">
                  <!-- location: lng = {{ lng }} lat = {{ lat }} -->
                </span>
                <span v-else>正在定位</span>
              </div>
              <!-- <div v-on:click="req_post()">
                查询周边
              </div> -->
            </div>

          </div>
        </div>
        <div class="box_c2">
          <div class="title">报警信息</div>
          <div class="a-btn"><img  class="img"
              src="../../assets/detail.png"
              alt=""
            ></div>
          <div class="box-wrap">
            <div class="box-wrap-l">
              <div class="c_box1">
                <div class="label">今日/本月报警</div>
                <div class="num">3/3</div>
              </div>
              <div class="c_box1">
                <div class="label">今日/本月故障</div>
                <div class="num">0/1</div>
              </div>
            </div>
            <div class="box-wrap-r">
              <div class="chart-item">
                <div class="chart c1">
                  <div class="name">有效报警率</div>
                  <div class="num">54.3%</div>
                </div>
                <div class="c_box2">
                  <div class="label">有效报警数</div>
                  <div class="num">1430458</div>
                </div>
              </div>
              <div class="chart-item">
                <div class="chart c2">
                  <div class="name">未处理报警数</div>
                  <div class="num">54.3%</div>
                </div>
                <div class="c_box2">
                  <div class="label">未处理报警数</div>
                  <div class="num">30458</div>
                </div>
              </div>
              <div class="chart-item">
                <div class="chart c3">
                  <div class="name">巡查未完成数</div>
                  <div class="num">54.3%</div>
                </div>
                <div class="c_box2">
                  <div class="label">巡查未完成数</div>
                  <div class="num">30458</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="fr">
        <div class="box bg2">
          <div class="title">信息统计</div>
          <div class="Information-wrap">
            <div class="rows">
              <div class="cols-items">
                <img
                  src="../../assets/xx_icon1.png"
                  alt=""
                >
                <div class="r">
                  <div class="name">今日访问量</div>
                  <div class="content">
                    <span class="num">{{visits}}</span>
                    <span class="p">次</span>
                  </div>
                </div>
              </div>
              <div class="cols-items">
                <img
                  src="../../assets/xx_icon2.png"
                  alt=""
                >
                <div class="r">
                  <div class="name">用户在线</div>
                  <div class="content">
                    <span class="num">1</span>
                    <span class="p">/</span>
                    <span class="num">3</span>
                  </div>
                </div>

              </div>
            </div>
            <div class="rows">
              <div class="cols-items">
                <img
                  src="../../assets/xx_icon3.png"
                  alt=""
                >
                <div class="r">
                  <div class="name">报警总数</div>
                  <div class="content">
                    <span class="num">{{alarms}}</span>
                    <span class="p">次</span>
                  </div>
                </div>
              </div>
              <div class="cols-items">
                <img
                  src="../../assets/xx_icon4.png"
                  alt=""
                >
                <div class="r">
                  <div class="name">故障总数</div>
                  <div class="content">
                    <span class="num">{{fault}}</span>
                    <span class="p">人</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box bg2">
          <div class="title">设备状态统计</div>
          <div class="charts-wrap">
            <!-- <div
              class="chart"
              id="chartstatistics"
            ></div> -->
            <div id="chart" >
              <apexchart
                type=bar
                :options="barChartOptions"
                :series="barSeries"
              />
              <!--height=300-->
            </div>
          </div>
        </div>
        <div class="box">
          <div class="title">电器监测</div>
          <div class="a-btn"><img  class="img"
              src="../../assets/date.png"
              alt=""
            ></div>
          <div class="charts-wrap">
            <!-- <div
              class="chart"
              id="chartMonitor"
            ></div> -->
            <div id="chart">
              <apexchart
                type=area
                :options="areaChartOptions"
                :series="areaSeries"
              />
              <!--height=300-->
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<style>
/* .amap_homePage {
    height: 300px;
  } */
</style>
<script>
import { homePageData } from "@/api/index";
import { ipInfo } from "@/api/index";
import util from "@/libs/util.js";

// 引入高德地图
import AMap from "AMap";

export default {
  data() {
    //const self = this;
    return {
      series: [44, 55, 41, 17],
      chartOptions: {
        labels: ["水压报警 5次", "加热报警 1次", "防拆报警 1次", "NB报警 1次"],
        chart: {
          type: "donut"
        },
        plotOptions: {
          pie: {
            size: 100,
            customScale: 1,
            offsetX: 0,
            offsetY: 0,
            expandOnClick: true,
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10
            },
            donut: {
              size: "65%",
              background: "transparent",
              labels: {
                show: false,
                name: {
                  show: true,
                  fontSize: "22px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  color: undefined,
                  offsetY: -10
                },
                value: {
                  show: true,
                  fontSize: "16px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  color: undefined,
                  offsetY: 16,
                  formatter: function(val) {
                    return val;
                  }
                }
              }
            }
          }
        }
      },

      //左下角line
      labelSeries: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      labelChartOptions: {
        chart: {
          height: 350,
          zoom: {
            enabled: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          // curve: 'straight'
        },
        title: {
          text: "Product Trends by Month",
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep"
          ]
        }
      },
      //右侧bar
      barSeries: [
        {
          name: "PRODUCT A",
          data: [44, 55, 41, 67, 22, 43]
        },
        {
          name: "PRODUCT D",
          data: [21, 7, 25, 13, 22, 8]
        }
      ],
      barChartOptions: {
        chart: {
          stacked: true,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0
              }
            }
          }
        ],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },

        xaxis: {
          type: "datetime",
          categories: [
            "01/01/2011 GMT",
            "01/02/2011 GMT",
            "01/03/2011 GMT",
            "01/04/2011 GMT",
            "01/05/2011 GMT",
            "01/06/2011 GMT"
          ]
        },
        legend: {
          position: "right",
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
      },
      areaSeries: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      areaChartOptions: {
        chart:{
          toolbar:{
            show:false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },

        xaxis: {
          type: "datetime",
          categories: [
            "2018-09-19T00:00:00",
            "2018-09-19T01:30:00",
            "2018-09-19T02:30:00",
            "2018-09-19T03:30:00",
            "2018-09-19T04:30:00",
            "2018-09-19T05:30:00",
            "2018-09-19T06:30:00"
          ]
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm"
          }
        }
      },
      cityName: [],
      cityCount: [],
      visits: "",
      user: "",
      alarms: "",
      fault: "",
      ratioX: document.body.clientWidth / 1920,
      ratioY: document.body.clientHeight / 940,
    };
  },
  methods: {
    resizeCharts: function () {
      let clientWidth = document.body.clientWidth
      let clientHeight = document.body.clientHeight
      this.ratioX = clientWidth / 1920
      this.ratioY = clientHeight / 940
      let ratio = Math.min(this.ratioX, this.ratioY)
      if (clientWidth <= 1024 && clientHeight <= 768) {
        ratio = Math.max(this.ratioX, this.ratioY)
      }
      document.getElementsByClassName('screen-body')[0].setAttribute('style', `transform:scale(${ratio}, ${ratio});transform-origin: left top 0px; left: ${(document.body.clientWidth - (1920 * ratio)) / 2}px`)
    },
    change(name) {
      if (name == "home") {
        // loginOut

        util.initRouter(this);
        this.$router.push({
          name: "home_index"
        });
      } else if (name == "loginOut") {
          this.$store.commit("logout", this);
        this.$store.commit("clearOpenedSubmenu");
        this.setStore("accessToken", "");
        // 强制刷新页面 重新加载router
        location.reload();
      }
    },
    init() {
      homePageData()
        .then(res => {
          // console.log(res);
          if (res.success) {
            if (!res.result) {
              return;
            }
            if (res.code == 200) {
              this.cityName = res.result.cityName;
              this.cityCount = res.result.cityCount;
              this.visits = res.result.visits;
              this.user = res.result.user;
              this.alarms = res.result.alarms;
              this.fault = res.result.fault;
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //高德地图
    initAmap() {
      let map = new AMap.Map("homeAmap", {
        resizeEnable: true,
        zoom: 12
      });
      //插件
      AMap.plugin(["AMap.ToolBar", "AMap.Geolocation"], function() {
        // 工具条控件
        map.addControl(
          new AMap.ToolBar({
            // 简易缩放模式，默认为 false
            liteStyle: true
          })
        );
        // 高精度定位控件
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：5s
          buttonPosition: "LB", //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(20, 40), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true //定位成功后是否自动调整地图视野到定位点
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status, result) {
          if (status == "complete") {
            map.center = [result.position.lng, result.position.lat];
          } else {
            console.log(result);
          }
        });
      });
    }
  },
  mounted() {
    this.init();
    this.initAmap();

    let clientWidth = document.body.clientWidth
    let clientHeight = document.body.clientHeight
    this.ratioX = clientWidth / 1920
    this.ratioY = clientHeight / 940
    let ratio = Math.min(this.ratioX, this.ratioY)
    if (clientWidth <= 1024 && clientHeight <= 768) {
      ratio = Math.max(this.ratioX, this.ratioY)
    }
    document.getElementsByClassName('screen-body')[0].setAttribute('style', `transform:scale(${ratio}, ${ratio});transform-origin: left top 0px; left: ${(document.body.clientWidth - (1920 * ratio)) / 2}px`)
    window.addEventListener('resize', this.resizeCharts)
  },
  destroyed: function () {
    window.removeEventListener('resize', this.resizeCharts)
  },
  watch: {
    ratioX: function (val) {
      if (!this.timer) {
        this.ratioX = val
        this.timer = true
        let self = this
        setTimeout(function () {
          self.resizeCharts()
          self.timer = false
        })
      }
    },
    ratioY: function (val) {
      if (!this.timer) {
        this.ratioY = val
        this.timer = true
        let self = this
        setTimeout(function () {
          self.resizeCharts()
          self.timer = false
        })
      }
    }
  }
};
</script>
