<template>
    <Row>
        <Card>
            <div style="margin-top: 10px;">
                <Button @click="handelCancel" icon="md-arrow-back">返回</Button>
                <span style="margin: 0px 40px; font-size: 24px; font-weight: bold; font-weight: 500;">摄像机名称:   {{this.form.name}}</span>
            </div>


            <div style="width: 60%; position: absolute;left: 25%;padding-top: 20px;font-weight: bold">
                <Form ref="cameraForm" :model="form" :label-width="180" style="padding-top: 20px">
                    <FormItem label="id:" prop="id" >{{form.id}}
                        <!--<Input v-model="form.id" disabled></Input>-->
                    </FormItem>
                    <FormItem label="摄像头名称:" prop="name"> {{form.name}}
                        <!--<Input autocomplete="off" v-model="form.name" disabled/>-->
                    </FormItem>
                    <FormItem label="摄像头用户:" prop="user"> {{form.user}}
                        <!--<Input autocomplete="off" v-model="form.user" disabled/>-->
                    </FormItem>
                    <!--<FormItem label="摄像头密码:" prop="password">-->
                    <!--<Input type="password" autocomplete="off" v-model="cameraForm.password"/>-->
                    <!--</FormItem>-->
                    <FormItem label="摄像头IP:" prop="ip"> {{form.ip}}
                        <!--<Input autocomplete="off" v-model="form.ip" disabled/>-->
                    </FormItem>
                    <FormItem label="摄像头端口:" prop="port"> {{form.port}}
                        <!--<Input type="number" autocomplete="off" v-model="form.port" disabled>{{form.port}}</Input>-->
                    </FormItem>
                    <FormItem label="通道:" prop="channel">{{form.channel}}
                        <!--<Input autocomplete="off" v-model="form.channel" disabled/>-->
                    </FormItem>
                    <FormItem label="摄像头协议:" prop="codingProtocal"> {{form.codingProtocal}}
                        <!--<Input autocomplete="off" v-model="form.codingProtocal" disabled/>-->
                    </FormItem>
                    <FormItem label="摄像头传输流:" prop="bitstream">{{form.bitstream}}
                        <!--<Input autocomplete="off" v-model="form.bitstream" disabled/>-->
                    </FormItem>
                    <FormItem label="摄像头buffer流:" prop="buffer">{{form.buffer}}
                        <!--<Input autocomplete="off" v-model="form.buffer" disabled/>-->
                    </FormItem>
                    <FormItem label="摄像头终端ID:" prop="terminalId">{{form.terminalId}}
                        <!--<Input autocomplete="off" v-model="form.terminalId" disabled/>-->
                    </FormItem>
                </Form>
            </div>



            <!--<div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around; border-bottom:1px dashed #999;">-->
                <!--<span class="left">设备编号:</span>-->
                <!--<span class="right">{{this.form.id}}</span>-->
                <!--<span class="left">设备编号:</span>-->
                <!--<span class="right">{{this.form.id}}</span>-->
            <!--</div>-->
            <!--<div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around; border-bottom:1px dashed #999;">-->
                <!--<span class="left">使用者:</span>-->
                <!--<span class="right">{{this.form.user}}</span>-->
            <!--</div>-->
            <!--<div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around; border-bottom:1px dashed #999;">-->
                <!--<span class="left">IP:</span>-->
                <!--<span class="right">{{this.form.ip}}</span>-->
            <!--</div>-->
            <!--<div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around; border-bottom:1px dashed #999;">-->
                <!--<span class="left">port:</span>-->
                <!--<span class="right">{{this.form.port}}</span>-->
            <!--</div>-->
            <!--<div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around; border-bottom:1px dashed #999;">-->
                <!--<span class="left">terminalId:</span>-->
                <!--<span class="right">{{this.form.terminalId}}</span>-->
            <!--</div>-->
            <!--<div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around; border-bottom:1px dashed #999;">-->
                <!--<span class="left">codingProtocal:</span>-->
                <!--<span class="right">{{this.form.codingProtocal}}</span>-->
            <!--</div>-->
            <!--<div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around; border-bottom:1px dashed #999;">-->
                <!--<span class="left">channel:</span>-->
                <!--<span class="right">{{this.form.channel}}</span>-->
            <!--</div>-->
            <!--<div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around; border-bottom:1px dashed #999;">-->
                <!--<span class="left">bitstream:</span>-->
                <!--<span class="right">{{this.form.bitstream}}</span>-->
            <!--</div>-->
            <!--<div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around; border-bottom:1px dashed #999;">-->
                <!--<span class="left">buffer:</span>-->
                <!--<span class="right">{{this.form.buffer }}</span>-->
            <!--</div>-->
            <!--<div style="display: -webkit-box; display: -ms-flexbox; display: flex; line-height: 55px; color: #999; font-size: 14px; -ms-flex-pack: distribute; justify-content: space-around; border-bottom:1px dashed #999;">-->
                <!--<span class="left">bitstream: </span>-->
                <!--<span class="right">{{this.form.bitstream }}</span>-->
            <!--</div>-->
        </Card>
    </Row>
</template>

<script>
    export default {
        name: "detail_camera",
        data(){
            return{
                backRoute:'',
                form:{
                    id:'',
                    name:'',
                    user:'',
                    password:'',
                    codingProtocal:'h264',
                    ip:"",
                    port:0,
                    channel:'',
                    bitstream:'',
                    buffer:'',
                    terminalId:'',
                },
            }
        },
        methods:{
            init(){
                this.backRoute = this.$route.query.backRoute;
                this.form.id=this.$route.query.id;
                this.form.name=this.$route.query.name;
                this.form.user=this.$route.query.user;
                this.form.codingProtocal=this.$route.query.codingProtocal;
                this.form.ip=this.$route.query.ip;
                this.form.port=this.$route.query.port;
                this.form.channel=this.$route.query.channel;
                this.form.bitstream=this.$route.query.bitstream;
                this.form.buffer=this.$route.query.buffer;
                this.form.terminalId=this.$route.query.terminalId;
            },
            handelCancel() {
                this.closeCurrentPage();
            },
            // 关闭当前页面
            closeCurrentPage() {
                this.$store.commit("removeTag", "detail_camera");
                localStorage.pageOpenedList = JSON.stringify(
                    this.$store.state.app.pageOpenedList
                );
                this.$router.push({
                    name: this.backRoute
                });
            }
        },
        mounted() {
            this.init();
        },
        watch:{
            // 监听路由变化
            $route(to, from) {
                if (to.name === "detail_camera"){
                    this.form.id=this.$route.query.id;
                    this.form.name=this.$route.query.name;
                    this.form.user=this.$route.query.user;
                    this.form.codingProtocal=this.$route.query.codingProtocal;
                    this.form.ip=this.$route.query.ip;
                    this.form.port=this.$route.query.port;
                    this.form.channel=this.$route.query.channel;
                    this.form.bitstream=this.$route.query.bitstream;
                    this.form.buffer=this.$route.query.buffer;
                    this.form.terminalId=this.$route.query.terminalId;
                }
            }
        }
    }
</script>

<style scoped>
    .left{
        width: 100%;
        text-align:right;
        padding-right: 20px;
        font-size: 20px;
    }
    .right{
        width:100%;
        color: #333;
        text-align:left;
        font-size: 18px;
    }
</style>
