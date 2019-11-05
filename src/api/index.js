// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, deleteRequest, importRequest, uploadFileRequest } from '@/libs/axios';


// Vaptcha ID
export const vaptchaID = "5bb9a277fc650e00a4155567"
// 文件上传接口
export const uploadFile = "/smartcity/upload/file"
// 验证码渲染图片接口
export const drawCodeImage = "/smartcity/common/captcha/draw/"
// 获取菜单
export const getMenuList = "/smartcity/permission/getMenuList"
// 获取数据字典
export const getDictData = "/smartcity/dictData/getByType/"
// Websocket
export const ws = "/smartcity/ws"



// 登陆
export const login = (params) => {
    return postRequest('/login', params)
}
// 获取用户登录信息
export const userInfo = (params) => {
    return getRequest('/user/info', params)
}
// 注册
export const regist = (params) => {
    return postRequest('/user/regist', params)
}
// 初始化验证码
export const initCaptcha = (params) => {
    return getRequest('/common/captcha/init', params)
}
// 发送短信验证码
export const sendSms = (mobile, params) => {
    return getRequest(`/common/captcha/sendSms/${mobile}`, params)
}
// 发送重置密码短信验证码
export const sendResetSms = (params) => {
    return postRequest('/common/captcha/sendResetSms', params)
}
// 通过手机重置密码
export const resetByMobile = (params) => {
    return postRequest('/user/resetByMobile', params)
}
// 发送重置密码邮件验证码
export const sendResetEmail = (params) => {
    return postRequest('/email/sendResetCode', params)
}
// 通过邮件重置密码
export const resetByEmail = (params) => {
    return postRequest('/email/resetByEmail', params)
}
// 短信验证码登录
export const smsLogin = (params) => {
    return postRequest('/user/smsLogin', params)
}
// IP天气信息
export const ipInfo = (params) => {
    return getRequest('/common/ip/info', params)
}
// 个人中心编辑
export const userInfoEdit = (params) => {
    return postRequest('/user/edit', params)
}
// 个人中心发送修改邮箱验证邮件
export const sendCodeEmail = (email, params) => {
    return getRequest(`/email/sendCode/${email}`, params)
}
// 个人中心发送修改邮箱验证邮件
export const editEmail = (params) => {
    return postRequest('/email/editEmail', params)
}
// 个人中心修改密码
export const changePass = (params) => {
    return postRequest('/user/modifyPass', params)
}
// 个人中心修改手机
export const changeMobile = (params) => {
    return postRequest('/user/changeMobile', params)
}
// 解锁
export const unlock = (params) => {
    return postRequest('/user/unlock', params)
}



// github登录
export const githubLogin = (params) => {
    return getRequest('/social/github/login', params)
}
// qq登录
export const qqLogin = (params) => {
    return getRequest('/social/qq/login', params)
}
// 微博登录
export const weiboLogin = (params) => {
    return getRequest('/social/weibo/login', params)
}
// 绑定账号
export const relate = (params) => {
    return postRequest('/social/relate', params)
}
// 获取JWT
export const getJWT = (params) => {
    return getRequest('/social/getJWT', params)
}



// 获取绑定账号信息
export const relatedInfo = (username, params) => {
    return getRequest(`/relate/getRelatedInfo/${username}`, params)
}
// 解绑账号
export const unRelate = (params) => {
    return postRequest('/relate/delByIds', params)
}
// 分页获取绑定账号信息
export const getRelatedListData = (params) => {
    return getRequest('/relate/findByCondition', params)
}



// 获取用户数据 多条件
export const getUserListData = (params) => {
    return getRequest('/user/getByCondition', params)
}
// 通过用户名搜索
export const searchUserByName = (username, params) => {
    return getRequest('/user/searchByName/'+username, params)
}
// 获取全部用户数据
export const getAllUserData = (params) => {
    return getRequest('/user/getAll', params)
}
// 通过部门获取全部用户数据
export const getUserByDepartmentId = (id, params) => {
    return getRequest(`/user/getByDepartmentId/${id}`, params)
}
// 添加用户
export const addUser = (params) => {
    return postRequest('/user/admin/add', params)
}
// 编辑用户
export const editUser = (params) => {
    return postRequest('/user/admin/edit', params)
}
// 启用用户
export const enableUser = (id, params) => {
    return postRequest(`/user/admin/enable/${id}`, params)
}
// 禁用用户
export const disableUser = (id, params) => {
    return postRequest(`/user/admin/disable/${id}`, params)
}
// 删除用户
export const deleteUser = (ids, params) => {
    return deleteRequest(`/user/delByIds/${ids}`, params)
}
// 导入用户
export const importUserData = (params) => {
    return importRequest('/user/importData', params)
}



// 获取一级部门
export const initDepartment = (params) => {
    return getRequest('/department/getByParentId/0', params)
}
// 加载部门子级数据
export const loadDepartment = (id, params) => {
    return getRequest(`/department/getByParentId/${id}`, params)
}
// 添加部门
export const addDepartment = (params) => {
    return postRequest('/department/add', params)
}
// 编辑部门
export const editDepartment = (params) => {
    return postRequest('/department/edit', params)
}
// 删除部门
export const deleteDepartment = (ids, params) => {
    return deleteRequest(`/department/delByIds/${ids}`, params)
}
// 搜索部门
export const searchDepartment = (params) => {
    return getRequest('/department/search', params)
}



// 获取全部角色数据
export const getAllRoleList = (params) => {
    return getRequest('/role/getAllList', params)
}
// 分页获取角色数据
export const getRoleList = (params) => {
    return getRequest('/role/getAllByPage', params)
}
// 添加角色
export const addRole = (params) => {
    return postRequest('/role/save', params)
}
// 编辑角色
export const editRole = (params) => {
    return postRequest('/role/edit', params)
}
// 设为或取消注册角色
export const setDefaultRole = (params) => {
    return postRequest('/role/setDefault', params)
}
// 分配角色权限
export const editRolePerm = (params) => {
    return postRequest('/role/editRolePerm', params)
}
// 分配角色数据权限
export const editRoleDep = (params) => {
    return postRequest('/role/editRoleDep', params)
}
// 删除角色
export const deleteRole = (ids, params) => {
    return deleteRequest(`/role/delAllByIds/${ids}`, params)
}



// 获取全部权限数据
export const getAllPermissionList = (params) => {
    return getRequest('/permission/getAllList', params)
}
// 添加权限
export const addPermission = (params) => {
    return postRequest('/permission/add', params)
}
// 编辑权限
export const editPermission = (params) => {
    return postRequest('/permission/edit', params)
}
// 删除权限
export const deletePermission = (ids, params) => {
    return deleteRequest(`/permission/delByIds/${ids}`, params)
}
// 搜索权限
export const searchPermission = (params) => {
    return getRequest('/permission/search', params)
}



// 获取全部字典
export const getAllDictList = (params) => {
    return getRequest('/dict/getAll', params)
}
// 添加字典
export const addDict = (params) => {
    return postRequest('/dict/add', params)
}
// 编辑字典
export const editDict = (params) => {
    return postRequest('/dict/edit', params)
}
// 删除字典
export const deleteDict = (ids, params) => {
    return deleteRequest(`/dict/delByIds/${ids}`, params)
}
// 搜索字典
export const searchDict = (params) => {
    return getRequest('/dict/search', params)
}
// 获取全部字典数据
export const getAllDictDataList = (params) => {
    return getRequest('/dictData/getByCondition', params)
}
// 添加字典数据
export const addDictData = (params) => {
    return postRequest('/dictData/add', params)
}
// 编辑字典数据
export const editDictData = (params) => {
    return postRequest('/dictData/edit', params)
}
// 删除字典数据
export const deleteData = (ids, params) => {
    return deleteRequest(`/dictData/delByIds/${ids}`, params)
}
// 通过类型获取字典数据
export const getDictDataByType = (type, params) => {
    return getRequest(`/dictData/getByType/${type}`, params)
}



// 分页获取日志数据
export const getLogListData = (params) => {
    return getRequest('/log/getAllByPage', params)
}
// 删除日志
export const deleteLog = (ids, params) => {
    return deleteRequest(`/log/delByIds/${ids}`, params)
}
// 清空日志
export const deleteAllLog = (params) => {
    return deleteRequest('/log/delAll', params)
}


// 分页获取Redis数据
export const getRedisData = (params) => {
    return getRequest('/redis/getAllByPage', params)
}
// 通过key获取Redis信息
export const getRedisByKey = (key, params) => {
    return getRequest(`/redis/getByKey/${key}`, params)
}
// 获取Redis键值数量
export const getRedisKeySize = (params) => {
    return getRequest('/redis/getKeySize', params)
}
// 获取Redis内存
export const getRedisMemory = (params) => {
    return getRequest('/redis/getMemory', params)
}
// 获取Redis信息
export const getRedisInfo = (params) => {
    return getRequest('/redis/info', params)
}
// 添加编辑Redis
export const saveRedis = (params) => {
    return postRequest('/redis/save', params)
}
// 删除Redis
export const deleteRedis = (params) => {
    return deleteRequest('/redis/delByKeys', params)
}
// 清空Redis
export const deleteAllRedis = (params) => {
    return deleteRequest('/redis/delAll', params)
}



// 分页获取定时任务数据
export const getQuartzListData = (params) => {
    return getRequest('/quartzJob/getAllByPage', params)
}
// 添加定时任务
export const addQuartz = (params) => {
    return postRequest('/quartzJob/add', params)
}
// 编辑定时任务
export const editQuartz = (params) => {
    return postRequest('/quartzJob/edit', params)
}
// 暂停定时任务
export const pauseQuartz = (params) => {
    return postRequest('/quartzJob/pause', params)
}
// 恢复定时任务
export const resumeQuartz = (params) => {
    return postRequest('/quartzJob/resume', params)
}
// 删除定时任务
export const deleteQuartz = (ids, params) => {
    return deleteRequest(`/quartzJob/delByIds/${ids}`, params)
}



// 分页获取消息数据
export const getMessageData = (params) => {
    return getRequest('/message/getByCondition', params)
}
// 获取单个消息详情
export const getMessageDataById = (id, params) => {
    return getRequest(`/message/get/${id}`, params)
}
// 添加消息
export const addMessage = (params) => {
    return postRequest('/message/add', params)
}
// 编辑消息
export const editMessage = (params) => {
    return postRequest('/message/edit', params)
}
// 删除消息
export const deleteMessage = (ids, params) => {
    return deleteRequest(`/message/delByIds/${ids}`, params)
}
// 分页获取消息推送数据
export const getMessageSendData = (params) => {
    return getRequest('/messageSend/getByCondition', params)
}
// 编辑发送消息
export const editMessageSend = (params) => {
    return putRequest('/messageSend/update', params)
}
// 删除发送消息
export const deleteMessageSend = (ids, params) => {
    return deleteRequest(`/messageSend/delByIds/${ids}`, params)
}



// 分页获取文件数据
export const getFileListData = (params) => {
    return getRequest('/file/getByCondition', params)
}
// 复制文件
export const copyFile = (params) => {
    return postRequest('/file/copy', params)
}
// 重命名文件
export const renameFile = (params) => {
    return postRequest('/file/rename', params)
}
// 删除文件
export const deleteFile = (ids, params) => {
    return deleteRequest(`/file/delete/${ids}`, params)
}
// 下载文件
export const aliDownloadFile = (fKey, params) => {
    return getRequest(`/file/ali/download/${fKey}`, params)
}


// 检查oss配置
export const checkOssSet = (params) => {
    return getRequest('/setting/oss/check', params)
}
// 获取oss配置
export const getOssSet = (serviceName, params) => {
    return getRequest(`/setting/oss/${serviceName}`, params)
}
// 编辑oss配置
export const editOssSet = (params) => {
    return postRequest('/setting/oss/set', params)
}
// 获取sms配置
export const getSmsSet = (serviceName, params) => {
    return getRequest(`/setting/sms/${serviceName}`, params)
}
// 获取sms模板code
export const getSmsTemplateCode = (type, params) => {
    return getRequest(`/setting/sms/templateCode/${type}`, params)
}
// 编辑sms配置
export const editSmsSet = (params) => {
    return postRequest('/setting/sms/set', params)
}
// 获取email配置
export const getEmailSet = (serviceName, params) => {
    return getRequest('/setting/email', params)
}
// 编辑email配置
export const editEmailSet = (params) => {
    return postRequest('/setting/email/set', params)
}
// 获取vaptcha配置
export const getVaptchaSet = (params) => {
    return getRequest('/setting/vaptcha', params)
}
// 编辑vaptcha配置
export const editVaptchaSet = (params) => {
    return postRequest('/setting/vaptcha/set', params)
}
// 获取vaptcha配置
export const getOtherSet = (params) => {
    return getRequest('/setting/other', params)
}
// 编辑other配置
export const editOtherSet = (params) => {
    return postRequest('/setting/other/set', params)
}
// 查看私密配置
export const seeSecretSet = (settingName, params) => {
    return getRequest(`/setting/seeSecret/${settingName}`, params)
}



// 表格生成
export const generateTable = (name, rowNum, params) => {
    return importRequest(`/generate/table/${name}/${rowNum}`, params)
}
// 树生成
export const generateTree = (name, rowNum, params) => {
    return importRequest(`/generate/tree/${name}/${rowNum}`, params)
}
// 通过实体类生成Vue代码Json数据
export const getEntityData = (path, params) => {
    return getRequest(`/generate/getEntityData/${path}`, params)
}



// base64上传
export const base64Upload = (params) => {
    return postRequest('/upload/file', params)
}

// 获取故障折线图
export const getDeviceFaultChartsData = (params) => {
    return postRequest('/deviceFault/getDeviceFaultCharts', params)
}


// 获取故障报警折线图
export const getDevicePoliceAndFaultChartsData = (params) => {
    return postRequest('/deviceFault/getDevicePoliceAndFaultCharts', params)
}

// 添加主机（设备）
export const addDevice = (params) => {
    return postRequest('/device/add', params)
}

// 编辑主机（设备）
export const editDevice = (params) => {
    return postRequest('/device/edit', params)
}

// 获取故障饼状图
export const getDeviceAlarmChartsData = (params) => {
    return postRequest('/serverAlarm/getDeviceAlarmCharts', params)
}

//获取报警类型饼状图
export const getAlarmTypeChartsData = (params) => {
    return postRequest('/serverAlarm/getAlarmTypeCharts', params)
}

//获取处理类型饼状图

export const getDealTypeChartsData = (params) => {
    return postRequest('/serverAlarm/getDealTypeCharts', params)
}

//获取设备统计柱状图
export const getDeviceTypeCountChartsData = (params) => {
    return postRequest('/device/getDeviceTypeCountCharts', params)
}

//获取报警折线图
export const getAlamChartsData = (params) => {
    return postRequest('/serverAlarm/getAlamCharts', params)
}

//获取报警、设备总数等
export const getAlarmSummaryCountAllData = (params) => {
    return postRequest('/serverAlarm/getAlarmSummaryCountAll', params)
}

// 获取一级巡查设备类型
export const initDeviceTree = (params) => {
    return getRequest('/patrolDeviceType/getByParentId/0', params)
}
// 加载巡查设备类型子级数据
export const loadDeviceTree = (id, params) => {
    return getRequest(`/patrolDeviceType/getByParentId/${id}`, params)
}
// 添加巡查设备类型
export const addDeviceTree = (params) => {
    return postRequest('/patrolDeviceType/add', params)
}
// 编辑巡查设备类型
export const editDeviceTree = (params) => {
    return postRequest('/patrolDeviceType/edit', params)
}

// 删除巡查设备类型
export const deleteDeviceTree = (ids, params) => {
    return deleteRequest(`/patrolDeviceType/delByIds/${ids}`, params)
}
// 搜索巡查设备类型
export const searchDeviceTree = (params) => {
    return getRequest('/patrolDeviceType/search', params)
}
//更具选择的树节点查询巡查项列表
export const getDeviceItemList = (params) => {
    return getRequest('/patrolCheckItem/getByCondition',params)
}
// 添加巡查项
export const saveDeviceItem = (params) => {
    return postRequest('/patrolCheckItem/save', params)
}
// 编辑巡查项
export const updateDeviceItem = (params) => {
    return putRequest('/patrolCheckItem/update', params)
}

// 删除巡查项
export const deleteDeviceItem = (ids, params) => {
    return deleteRequest(`/patrolCheckItem/delByIds/${ids}`, params)
}

// 分页获取巡查设备数据
export const getDeviceData = (params) => {
    return getRequest('/patrolDevice/getByCondition', params)
}
// 通过id获取巡查设备数据
export const getDeviceById = (id, params) => {
    return getRequest(`/patrolDevice/get/${id}`, params)
}
// 添加巡查设备
export const saveDevice = (params) => {
    return postRequest('/patrolDevice/save', params)
}
// 编辑巡查设备
export const updateDevice = (params) => {
    return putRequest('/patrolDevice/update', params)
}

// 删除巡查设备
export const deleteDevice = (ids, params) => {
    return deleteRequest(`/patrolDevice/delByIds/${ids}`, params)
}
// 获取全部巡查点数据
export const getSiteDataList = (params) => {
    return getRequest('/patrolSite/getAll', params)
}

//分页获取巡查点数据
export const getSiteDataListPage = (params) => {
    return getRequest('/patrolSite/getByCondition', params)
}

// 通过id获取巡查点数据
export const getSiteById = (id, params) => {
    return getRequest(`/patrolSite/get/${id}`, params)
}
// 添加巡查点
export const saveSite = (params) => {
    return postRequest('/patrolSite/save', params)
}
// 编辑巡查点
export const updateSite = (params) => {
    return putRequest('/patrolSite/update', params)
}

// 删除巡查点
export const deleteSite = (ids, params) => {
    return deleteRequest(`/patrolSite/delByIds/${ids}`, params)
}

// 获取一级楼层
export const initFloor = (params) => {
    return getRequest('/patrolSite/getByParentId/0', params)
}
// 加载楼层子级数据
export const loadFloor = (id, params) => {
    return getRequest(`/patrolSite/getByParentId/${id}`, params)
}

// 分页获取巡查计划数据
export const getPlanData = (params) => {
    return getRequest('/patrolPlan/getByCondition', params)
}
// 通过id获取巡查计划数据
export const getPlanById = (id, params) => {
    return getRequest(`/patrolPlan/get/${id}`, params)
}
// 添加巡查计划
export const savePlan = (params) => {
    return postRequest('/patrolPlan/save', params)
}
// 添加巡查/巡更计划
export const addPatrolPlan = (params) => {
    return postRequest('/patrolPlan/add', params)
}
// 编辑巡查计划
export const updatePlan = (params) => {
    return putRequest('/patrolPlan/update', params)
}

// 删除巡查/巡更计划
export const deletePlan = (ids, params) => {
    return deleteRequest(`/patrolPlan/delete/${ids}`, params)
}

// 分页获取巡查任务数据
export const getPlanTaskData = (params) => {
    return getRequest('/patrolPlanTask/getByCondition', params)
}

// 分页获取巡查隐患数据
export const getDeviceRepairData = (params) => {
    return getRequest('/patrolDeviceRepair/getByCondition', params)
}

//获取巡查报表统计数据
export const getPortalCountAllData = (params) => {
    return postRequest('/patrolReport/getPortalCountAll', params)
}

//获取巡查点统计柱状图
export const getSiteChartsData = (params) => {
    return postRequest('/patrolReport/getSiteCharts', params)
}

//获取报警类型饼状图
export const getPlanChartsData = (params) => {
    return postRequest('/patrolReport/getPlanCharts', params)
}

//获取巡查设备状态柱状图
export const getDeviceStatusCountChartsData = (params) => {
    return postRequest('/patrolReport/getDeviceStatusCountCharts', params)
}

//获取巡查/巡更计划详情
export const getPatrolPlan = (id,params) => {
    return getRequest(`/patrolPlan/getPatrol/${id}`, params)
}
//获取巡查/巡更任务详情
export const getPatrolPlanTask = (id,params) => {
    return getRequest(`/patrolPlanTask/getPatrol/${id}`, params)
}

//获取首页
export const homePageData = (params) => {
    return getRequest('/homePage', params)
}




// 分页获取巡更点数据
export const getPatrolMarkData = (params) => {
    return getRequest('/patrolMark/getByCondition', params)
}
// 删除巡更点
export const deletePatrolMark = (ids, params) => {
    return deleteRequest(`/patrolMark/delByIds/${ids}`, params)
}
// 新增巡更点
export const savePatrolMark = (params) => {
    return postRequest('/patrolMark/save', params)
}
// 修改巡更点
export const updatePatrolMark = (params) => {
    return putRequest('/patrolMark/update', params)
}
// 获取全部巡更点数据
export const getAllPatrolMark = (params) => {
    return getRequest('/patrolMark/getAll', params)
}
// 删除巡更任务
export const deletePatrolPlanTask = (ids, params) => {
    return deleteRequest(`/patrolPlanTask/delByIds/${ids}`, params)
}
// 获取巡更点数目
export const getCountByName = (params) => {
    return getRequest('/patrolMark/getCountByName', params)
}


