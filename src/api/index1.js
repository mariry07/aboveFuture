// 统一请求路径前缀在libs/axios.js中修改
import { getRequest1, postRequest1, putRequest1, deleteRequest1, importRequest1, uploadFileRequest1 } from '@/libs/axios1';


// Vaptcha ID
export const vaptchaID = "5bb9a277fc650e00a4155567"
// 文件上传接口
export const uploadFile = "/tianbo/upload/file"
// 验证码渲染图片接口
export const drawCodeImage = "/tianbo/common/captcha/draw/"
// 获取菜单
export const getMenuList = "/tianbo/permission/getMenuList"
// 获取数据字典
export const getDictData = "/tianbo/dictData/getByType/"
// Websocket
export const ws = "/tianbo/ws"


//添加摄像头
export const addCamera = (params)=>{
    return postRequest1('/camera/newCamera',params)
}

export const getCameraList = (params)=>{
    return getRequest1('/camera/cameraList',params)
}

//编辑摄像头
export const editCamera = (params)=>{
    return postRequest1('/camera/updateCamera',params)
}

//删除摄像头
export const deleteCamera = (params)=>{
    return deleteRequest1('/camera/deleteCamera',params)
}

export const getVideoList = (params)=>{
    return getRequest1('/camera/cameraList',params)
}

export const checkName = (params)=>{
    return getRequest1('/camera/dupCameraName',params)
}

export const getVideoByUrl = (params)=>{
    return postRequest1('/camera/videoUrl',params)
}

export const getVideoPoster = (params)=>{
    return getRequest1("/video/poster",params)
}


//新增设备   wrz
export const addDevice = (params)=>{
    return postRequest1("/device/newDevice",params)
}
//编辑设备     wrz
export const editDevice = (params)=>{
    return postRequest1("/device/update",params)
}
//查询设备 wrz
export const getdeviceList = (params)=>{
    return getRequest1('/device/deviceList',params)
}
// 删除设备 wrz
export const deleteDevice = (params) => {
    return deleteRequest1(`/device/deleteDevice/`, params)
}
//查询设备版本信息 
export const getdeviceVersion =(params)=>{
    return getRequest1('/device/version',params);
}

//查询设备状态  wrz
export const getdeviceType =(params)=>{
    return getRequest1('/device/version',params);
}
//改变设备状态 0启用 1停用 wrz
export const changeDeviceStatus = (params)=>{
    return postRequest1('/device/changeDeviceStatus',params);
}

//设备(离线/总数)信息
export const getOfflineState = (params)=>{
    return getRequest1('/device/offLineStat',params)
}

//获取故障类型list
export const getFaultType = (params) => {
    return getRequest1('/deviceFault/faultType',params);
}

//消防故障-故障详情页
export const getfaultDetail = (params)=>{
    return getRequest1('/deviceFault/faultDetail',params)
}

//消防故障页-上方4中数据
export const getfaultStatics = (params) =>{
    return getRequest1('/deviceFault/faultStatistics',params);
}

//获取故障list
export const getlanalarmfaultList = (params) =>{
    return getRequest1('/deviceFault/faultList',params)
}

//获取故障趋势图数据list
export const getlanfaultTrendDiagram = (params) =>{
    return getRequest1('/deviceFault/faultTrendDiagram',params)
}

//消防故障-更新处理结果
export const updateFaultDetail = (params) =>{
    return postRequest1('/deviceFault/updatefaultDetail',params)
}

//消防故障-批量删除By Ids
export const deleteDeviceFault = (params)=>{
    return deleteRequest1('/deviceFault/delete',params)
}

//消防故障-批量处理
export const postFaultBatchDetail = (params)=>{
    return postRequest1('/deviceFault/batchDeal',params)
}

//根据获取报警类型list
export const getAlarmType = (params) =>{
    return postRequest1('/alarm/alarmType',params)
}

//获取报警list
export const getAlarmList = (params) =>{
    return getRequest1('/alarm/alarmList',params)
}

//消防报警-获取报警总数、未处理报警数、已处理报警数
export const getalarmStaticstics = (params)=>{
    return getRequest1('/alarm/alarmStatistics',params)
}

//获取报警趋势图数据list
export const getalarmTrendDiagram = (params)=>{
    return getRequest1('/alarm/alarmTrendDiagram',params)
}

//报警 - 获取报警类型统计数据
export const  getAlarmCountByType = (params) =>{
    return getRequest1('/alarm/alarmCountByType',params);
}

//报警 - 获取报警详情By Id
export  const  getAlaramDetail = (params) =>{
    return getRequest1('/alarm/alarmDetail',params);
}

//报警页-批量处理
export  const  postAlaramDetail = (params) =>{
    return postRequest1('/alarm/batchDeal',params);
}

//报警页-获取处理状态常量列表
export const getAlarmDetailStatus = (params) =>{
    return getRequest1('/alarm/dealStatus',params);
}

//报警 - 获取处理类型统计数据
export const getAlarmDealTypeCount = (params)=>{
    return getRequest1('/alarm/dealTypeCount',params);
}

//报警页-批量删除By Ids
export const deleteAlarmDelete = (params) =>{
    return deleteRequest1('/alarm/delete',params)
}

//报警 - 获取报警楼栋分布图
export const  getBuildingAlarmCount = (params) =>{
    return getRequest1('/alarm/getBuildingAlarmCount',params)
}

//报警 -单个处理
export const postUpdateAlarmDetail = (params) =>{
    return postRequest1('/alarm/updateAlarmDetail',params);
}


// // 通过类型获取字典数据   wrz
// export const getDictDataByType = (type, params) => {
//     return getRequest(`/dictData/getByType/${type}`, params)
// }



