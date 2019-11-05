<style lang="less">
    @import "lanvideo.less";
</style>
<template>
    <div class="search">
        <div class="left">
            <Row>
                <i-col>
                    <Menu ref="videoMenu" style="width: 90%;" :theme="theme2" active-name="0-0" open-names="['0']" accordion
                          @on-select="selectSubItem">
                        <Submenu v-for="(menu ,index) in menuList" :name="index+''" :key="index+''">
                            <template slot="title">
                                <Icon typeof="ios-paper">
                                </Icon>
                                {{menu.name}}
                            </template>
                            <Menu-Item :disabled="menuItemDisable" v-for="(item ,k) in menu.subMenuList" :name="index+'-'+k" :key="index+'-'+k+''" style="margin-left: 10px;">{{item.name}}</Menu-Item>
                        </Submenu>
                    </Menu>
                </i-col>
            </Row>

        </div>
        <div class="right">
            <div>
                <Icon size="35px" color="red" type="md-alert"></Icon>
                <label style="color: red; font-size: 15px;padding-right: 5px;">请确保网站开启flash插件，请在浏览器设置中查看，修改</label>
                <i-button type="warning" shape="circle" size="small" style="float: right;" @click="refreshVideo">刷新监控</i-button>
            </div>
        <div ref="video" class="video">
          <video-player class="video-player vjs-custom-skin"
                        ref="videoPlayer"
                        :playsinline="true"
                        :options="playerOptions"
                        @play="onPlayerPlay($event)"
                        @pause="onPlayerPause($event)"
                >
          </video-player>

        </div>
        </div>
    </div>
</template>

<script>
    import {
        getVideoList,
        getVideoByUrl
    } from "@/api/index1";
    // 2.组件内引用
    import videojs from 'video.js'
    import { videoPlayer } from 'vue-video-player'
    import 'video.js/dist/video-js.css'
    import 'vue-video-player/src/custom-theme.css'
    import 'videojs-flash'
    import SWF_URL from 'videojs-swf/dist/video-js.swf'

    videojs.options.flash.swf = SWF_URL // 设置flash路径，Video.js会在不支持html5的浏览中使用flash播放视频文件

    export default {
        name: "lanvideo",
        components:{
            videoPlayer
        },
        data () {
            return {
                menuselect:'0-0',
                menuItemDisable:false,
                isPlayerPause:false,
                theme2: 'light',
                subMenu:1,
                subItem:1,
                subitem:'0-0',
                menuLoading:false,
                videoSrc:'rtmp://media3.sinovision.net:1935/live/livestream',
                isButtonCtrlShow:false,
                videoFrom:{
                    userId:'',
                    terminalId:'tb221932T001',
                    cameraId:'1',
                    playItemLimit:60
                },
                playerOptions : {
                    minHeight:'600',
                    playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: false, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<lanvideo>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    // width: document.documentElement.clientWidth,
                    sources: [
                        // {
                        //     type: "lanvideo/ogg",
                        //     type:"lanvideo/webm",
                        //     type: "lanvideo/mp4",
                        //     src: 'J:\\20181222105054.mp4' // 视频地址-改变它的值播放的视频会改变
                        // },
                        {
                            type: 'rtmp/flv',
                            src: 'rtmp://media3.sinovision.net:1935/live/livestream' // 视频地址-改变它的值播放的视频会改变
                            //src: ''
                        },
                        {
                            type: 'rtmp/mp4',
                            src: 'rtmp://media3.sinovision.net:1935/live/livestream' // 视频地址-改变它的值播放的视频会改变
                            //src: ''
                        },

                    ],
                    //poster: "http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg",
                    poster: "https://gitee.com/smallc/SpringBlade/raw/master/pic/springblade-framework.png",
                    //poster: "https://mmbiz.qpic.cn/mmbiz_jpg/kzuNHA1uLECubiaUlNpNJ2lfUKib9CArtUpxZmUm3asQDH9jXJkRzcSycgKMtaSeYHmFICCLXKwicVbR8Om7SZtCg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1",
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    techOrder: ['html5','flash'],
                    flash: { hls: {withCredentials: false },swf: SWF_URL },
                    html5: { hls: { withCredentials: false } },
                    // controlBar: {
                    //     timeDivider: false,
                    //     durationDisplay: true,
                    //     remainingTimeDisplay: false,
                    //     fullscreenToggle: true  //全屏按钮
                    // }
                },
                menuList:[
                    {
                        name:'摄像头列表',
                        id:'1000001',
                        subMenuList:[
                            {
                                id:1,
                                value:'camera1'
                            },
                            {
                                id:2,
                                value:'camera2'
                            },
                            {
                                id:3,
                                value:'camera3'
                            },
                            {
                                id:4,
                                value:'camera4'
                            }
                        ]
                    },
                    // {
                    //     name:'天博电子',
                    //     id:'2000000001',
                    //     subMenuList:[
                    //         {
                    //             id:1,
                    //             value:'camera1'
                    //         },
                    //         {
                    //             id:2,
                    //             value:'camera2'
                    //         },
                    //         {
                    //             id:3,
                    //             value:'camera3'
                    //         },
                    //         {
                    //             id:4,
                    //             value:'camera4'
                    //         }
                    //     ]
                    // }
                ],

            }
        },
        methods:{
            selectSubItem(value){
                if(value === null || value=== ''){
                    this.getVideoUrl(0,0);
                    return
                }

                if(this.menuselect === value)
                    return

                this.menuselect=value;
                let arr =new Array()
                arr=value.split('-')
                this.getVideoUrl(arr[0],arr[1]);
            },
            getVideoUrl(index,k){
                let _this=this
                this.menuItemDisable=true

                if(this.menuList != null && this.menuList.length>0){
                    let item = this.menuList[index].subMenuList[k]
                    this.videoFrom.userId=item.user;
                    getVideoByUrl(this.videoFrom).then(res=>{
                        if(res.status === 1){
                            this.$Message.success("切换视频播放成功");
                            this.videoSrc=res.dataValue

                            this.playerOptions.sources.forEach(source=>{
                                source.src=res.dataValue
                            })
                            this.player.src(this.videoSrc);
                            this.menuItemDisable=false
                        }else {
                            this.$Message.success("未找到指定视频")
                            this.playerOptions.sources.forEach(source=>{
                                source.src=''
                            })
                            this.videoSrc=''
                            this.player.src(this.videoSrc)
                            this.menuItemDisable=false
                        }
                    })
                }
            },
            getVideoList(){
                let _this=this
                getVideoList().then(res=>{
                    if(res.status===1){
                        this.menuList[0].subMenuList =res.dataValue.cameraList;
                        //this.menuList[1].subMenuList =res.dataValue.cameraList;
                    }else {
                        _this.menuList=[]
                    }
                }).then(()=>{
                    if(_this.menuList.length>0){
                        _this.getVideoUrl(0,0)
                    }
                }).finally(()=>{
                    _this.$nextTick(()=>{
                        _this.$refs.videoMenu.updateOpened();
                        //_this.$refs.side_menu.updateActiveName()
                    })
                })
            },
            refreshVideo(){
                this.player.src(this.videoSrc);
            },
            onPlayerPlay(e) {
                if(this.isPlayerPause){
                    this.isPlayerPause=false
                    this.player.src(this.videoSrc)
                }
            },
            onPlayerPause(e){
                this.isPlayerPause=true;
            }
        },
        created(){
            this.getVideoList();
        },
        computed: {
            player() {
                return this.$refs.videoPlayer.player
            }
        },
        mounted(){
            //this.selectSubItem(null)
        },
        beforeDestroy(){
            this.player.dispose()
        },
    }
</script>
<style scoped>
</style>
