import request from '../utils/request';

export async function accountLogin(params) {
  return request('/api/login', {
    method: 'POST',
    body: params,
  });
}

export async function accountLogout() {
  return request('/api/logout', {
    method: 'POST',
  });
}

export async function queryUserInfo(emId) {
  return request(`/api/users/${emId}`, {
    method: 'GET',
  });
}
export async function queryUserAllInfo() {
  return request('/api/users/findEmp', {
    method: 'GET',
  });
}

export async function exportDocx() {
  return request('/api/users/dcExcel', {
    method: 'GET',
  });
}

export async function query() {
  return request('/api/users');
}

export async function queryCurrentUser() {
  return request('/api/currentUser');
}

export const changePassword = async (params) => {
  return request('/api/users/changePwd', {
    method: 'POST',
    body: params,
  });
};

export async function saveUserInfo(params) {
  return request(`/api/users/${params.employeeNumber}`, {
    method: 'POST',
    body: params,
  });
}

export const queryDoc = async (docId) => {
  return request(`/api/document/get/${docId}`, {
    method: 'GET',
  });
};

export const queryLike = async (name) => {
  return request(`/api/users/queryLike/${name}`, {
    method: 'GET',
  });
};

export const queryInviterSort = async (name) => {
  return request(`/api/users/query/${name}`, {
    method: 'GET',
  });
};

export const queryDocCategories = async () => {
  return request('/api/document/categories', {
    method: 'GET',
  });
};

export async function queryDocList() {
  return request('/api/document/docs');
}

export const deleteDoc = async (docId) => {
  return request(`/api/document/delete/${docId}`, {
    method: 'DELETE',
  });
};

export const addDoc = async (params) => {
  return request('/api/document/add', {
    method: 'POST',
    body: params,
  });
};

export const eidtDoc = async (params) => {
  return request('/api/document/edit', {
    method: 'POST',
    body: params,
  });
};

export const deleteUser = async (emId) => {
  return request(`/api/users/delete/${emId}`, {
    method: 'DELETE',
  });
};
export const batchDelete = async (attr) => {
  return request(`/api/users/batchDelete/${attr}`, {
    method: 'DELETE',
  });
};

export const addNotice = async (params) => {
  return request('/api/notices', {
    method: 'POST',
    body: params,
  });
};

export const queryNotices = async () => {
  return request('/api/notices');
};

export const deleteNotice = async (id) => {
  return request(`/api/notices/${id}`, {
    method: 'DELETE',
  });
};

export const getNoticeById = (id) => {
  return request(`/api/notices/${id}`, {
    method: 'GET',
  });
};

export const saveComment = (params) => {
  return request('/api/comment', {
    method: 'POST',
    body: params,
  });
};

export const getCommentByNoticeId = (noticeId) => {
  return request(`/api/comment/?noticeId=${noticeId}`, {
    method: 'GET',
  });
};

export const addLeave = async (params) => {
  return request('/api/attendance/leave/add', {
    method: 'POST',
    body: params,
  });
};

export const addWorkOvertime = async (params) => {
  return request('/api/attendance/workovertime', {
    method: 'POST',
    body: params,
  });
};

export const queryWorkOvertimes = async (attendanceType) => {
  return request(`/api/attendance/query?attendanceType=${attendanceType}`);
};

export const deleteAttendanceById = async (id) => {
  return request(`/api/attendance/${id}`, {
    method: 'DELETE',
  });
};

export const getAttendanceById = (id) => {
  return request(`/api/attendance/${id}`, {
    method: 'GET',
  });
};
export const addAsset = async (params) => { // 添加资产
  return request('/api/asset/add', {
    method: 'POST',
    body: params,
  });
};

export const deleteAsset = async (aid) => { // 单个删除资产
  return request(`/api/asset/delete/${aid}`, {
    method: 'DELETE',
  });
};

export const batchDeleteAsset = async (attr) => { // 批量删除
  return request(`/api/asset/batchDelete/${attr}`, {
    method: 'DELETE',
  });
};

export const editAsset = async (params) => { // 编辑后保存
  return request('/api/asset/update', {
    method: 'PUT',
    body: params,
  });
};

export const showUser = () => { // 普通用户显示
  return request('/api/asset/queryByUser', {
    method: 'GET',
  });
};

export const showAssetUser = () => { // 资产管理员显示
  return request('/api/asset/queryAll', {
    method: 'GET',
  });
};

export const allotAsset = async (params) => { // 提交分配请求
  return request('/api/asset/allot', {
    method: 'POST',
    body: params,
  });
};

export const operationAsset = async (params) => { // sfsdffsdf /////////////////////////////////////
  return request('/api/asset/operation', {
    method: 'POST',
    body: params,
  });
};

export const UsersInitMission = async () => { // 显示用户发起的分配任务
  return request('/api/asset/initMassion', {
    method: 'GET',
  });
};

export const UsersAcceptMission = async () => { // 显示用户待确认的任务
  return request('/api/asset/acceptMassion', {
    method: 'GET',
  });
};

export const AssetDetails = async (aid) => { // 显示资产详情
  return request(`/api/asset/queryByAid/${aid}`, {
    method: 'GET',
  });
};

export const AssetSearch = async (context) => { // 资产查询
  return request(`/api/asset/queryLike/${context}`, {
    method: 'GET',
  });
};


export const AssetAllocStatus = async (params) => { // 任务分配结束
  return request('/api/asset/allotAsset', {
    method: 'PUT',
    body: params,
  });
};

export const HistoryMassion = async () => { // 显示历史任务
  return request('/api/asset/historyMassion', {
    method: 'GET',
  });
};

// 招聘系统/////////////////////////////

export const saveInviter = async (params) => { // 保存候选人信息/修改候选人信息
  return request('/api/resource', {
    method: 'POST',
    body: params,
  });
};

export const inviterInfo = async (zid) => {
  return request(`/api/resource/find/${zid}`, { // 通过候选人id查询
    method: 'GET',
  });
};

export const batchDeleteInviter = async (zids) => { // 批量删除候选人
  return request(`/api/resource/batchDelete/${zids}`, {
    method: 'DELETE',
  });
};

export const deleteInviter = async (zid) => { // 删除候选人
  return request(`/api/resource/delete/${zid}`, {
    method: 'DELETE',
  });
};

export const queryInviter = async () => { // 查询所有候选人
  return request('/api/resource/queryRole', {
    method: 'GET',
  });
};

export const queryNameInviter = async (name) => { // 通过姓名查询候选人
  return request(`/api/resource/queryName/${name}`, {
    method: 'GET',
  });
};

export const saveCenter = async (params) => { // 招聘中心操作
  return request('/api/resource/operationCenter', {
    method: 'POST',
    body: params,
  });
};

export const findTechInfo = async (id) => { // 招聘中心操作
  return request(`/api/resource/findByIdTe/${id}`, {
    method: 'GET',
  });
};
export const findQualInfo = async (id) => { // 招聘中心操作
  return request(`/api/resource/findByIdQu/${id}`, {
    method: 'GET',
  });
};
export const findCompInfo = async (id) => { // 招聘中心操作
  return request(`/api/resource/findByIdSy/${id}`, {
    method: 'GET',
  });
};

export const saveTechnbicalInviter = async (params) => { // 保存技术面试信息
  return request('/api/resource/saveTechnbical', {
    method: 'POST',
    body: params,
  });
};

export const saveTechnbicalDraft = async (params) => { // 保存技术面试信息为草稿
  return request('/api/resource/saveTechnbicalDraft', {
    method: 'POST',
    body: params,
  });
};

export const saveQualificationInviter = async (params) => { // 保存资格面试信息
  return request('/api/resource/saveQualification', {
    method: 'POST',
    body: params,
  });
};

export const saveQualificationDraft = async (params) => { // 保存资格面试信息为草稿
  return request('/api/resource/saveQualificationDraft', {
    method: 'POST',
    body: params,
  });
};

export const saveSynthesizeInviter = async (params) => { // 保存综合面试信息
  return request('/api/resource/saveSynthesize', {
    method: 'POST',
    body: params,
  });
};
export const saveSynthesizeDraft = async (params) => { // 保存综合面试信息为草稿
  return request('/api/resource/saveSynthesizeDraft', {
    method: 'POST',
    body: params,
  });
};
export const uniqueId = async (idNo) => { // 身份证唯一性
  return request(`/api/resource/validateIdNo/${idNo}`, {
    method: 'GET',
  });
};
export const uniquePhoneNo = async (phoneNo) => { // 手机唯一性
  return request(`/api/resource/validatePhoneNo/${phoneNo}`, {
    method: 'GET',
  });
};
export const saveRecordInviter = async (params) => { // 添加记录
  return request('/api/resource/saveTouchRecord', {
    method: 'POST',
    body: params,
  });
};
export const findRecordInviter = async (zid) => { // 查找候选人联系记录
  return request(`/api/resource/findTouchRecord/${zid}`, {
    method: 'GET',
  });
};
export const hcQueryLike = async (hcNo) => { // hc联想
  return request(`/api/resource/hcCodeLike/${hcNo}`, {
    method: 'GET',
  });
};
export const hcUnique = async (hcNo) => { // hc编码验证
  return request(`/api/resource/hcCodeValidate/${hcNo}`, {
    method: 'GET',
  });
};
export const judgeInviter = async (id) => { // 判断身份
  return request(`/api/resource/validateToucher/${id}`, {
    method: 'GET',
  });
};
export const ziyuanchi = async () => { // 资源池筛选
  return request('/api/resource/pool', {
    method: 'GET',
  });
};
export const saveNeedInviter = async (params) => { // 保存需求信息
  return request('/api/needs', {
    method: 'POST',
    body: params,
  });
};

export const deleteNeedInviter = async (nid) => { // 删除需求信息
  return request(`/api/needs/delete/${nid}`, {
    method: 'DELETE',
  });
};

export const batchDeleteNeedInviter = async (nids) => { // 批量删除需求信息
  return request(`/api/needs/batchDelete/${nids}`, {
    method: 'DELETE',
  });
};

export const findAllNeedInviter = async () => { // 查询全部需求信息
  return request('/api/needs/findAll', {
    method: 'GET',
  });
};

export const findNeedByIdInviter = async (nid) => { // 通过id查询需求
  return request(`/api/needs/find/${nid}`, {
    method: 'GET',
  });
};

export const NeedLikeInviter = async (pname) => { // need需求联想
  return request(`/api/needs/findLike/${pname}`, {
    method: 'GET',
  });
};

export const staticsticsInfoInviter = async () => { // 请求统计数据
  return request('/api/needs/statistics', {
    method: 'GET',
  });
};
export const weekInviter = async () => { // 不加时间请求数据
  return request('/api/resource/defaultWeeklyM2', {
    method: 'GET',
  });
};

export const dateWeekInviter = async (DateTime) => { // 时间请求数据
  return request(`/api/resource/havaDateWeeklyM2/${DateTime}`, {
    method: 'GET',
  });
};

export const noticeInvite = async () => {
  return request('/api/notices/byType');
};

export const entryInviter = async () => { // 入职数据
  return request('/api/resource/offering', {
    method: 'GET',
  });
};

export const operateEntryInviter = async (params) => { // 入职操作
  return request('/api/resource/putIn', {
    method: 'POST',
    body: params,
  });
};
// export const operateEntryInviter = async (id) => { // 入职操作
//   return request(`/api/resource/putIn/${id}`, {
//     method: 'GET',
//   });
// };


export const zuzhijgbc = async (params) => { // 组织结构保存
  return request('/api/department', {
    method: 'POST',
    body: params,
  });
};

export const zhuzijgsc = async (ids) => { // 组织结构删除
  return request(`/api/department/delete/${ids}`, {
    method: 'DELETE',
  });
};

export const findDepartmentY = async () => { // 查询一级部门
  return request('/api/department/findFirst', {
    method: 'GET',
  });
};

export const findDepartmentE = async (depart) => { // 查询二级部门
  return request(`/api/department/findSecond/${depart}`, {
    method: 'GET',
  });
};

export const findDepartmentS = async (depart) => { // 查询三级部门
  return request(`/api/department/findThree/${depart}`, {
    method: 'GET',
  });
};

export const findDepartmentF = async (depart) => { // 查询四级部门
  return request(`/api/department/findFour/${depart}`, {
    method: 'GET',
  });
};

export const findDepartmentW = async (depart) => { // 查询五级部门
  return request(`/api/department/findFive/${depart}`, {
    method: 'GET',
  });
};

export const editDepartment = async (params) => { // 修改组织结构
  return request('/api/department/update', {
    method: 'PUT',
    body: params,
  });
};

export const FindAllDepartment = async () => { // 查询全部组织信息
  return request('/api/department/findAll', {
    method: 'GET',
  });
};

export const resumeInviter = async () => { // 查询全部组织信息
  return request('/api/wordfile/upload', {
    method: 'GET',
  });
};

// 试用期api//////////////////////////////////////////////////////////////

export const getAllTrainplan = async () => { // 获取全部培养计划
  return request('/api/trainplan', {
    method: 'GET',
  });
};

export const getSomeBodyTrainplan = async (id) => { // 获取全部培养计划
  return request(`/api/trainrecord/get/${id}`, {
    method: 'GET',
  });
};

export const getSrchvalueTrainplan = async (srchvalue) => { // 通过搜索框获取培养计划
  return request(`/api/trainplan/search/${srchvalue}`, {
    method: 'GET',
  });
};

export const postGoal = async (params) => { // 提交员工定目标表单
  return request('/api/trainrecord/goal', {
    method: 'POST',
    body: params,
  });
};

export const postAuthor = async (params) => { // 提交主管审核表单
  return request('/api/trainrecord/author', {
    method: 'POST',
    body: params,
  });
};

export const postSummarize = async (params) => { // 提交员工总结表单
  return request('/api/trainrecord/summarize', {
    method: 'POST',
    body: params,
  });
};

export const postEvaluate = async (params) => { // 提交主管评价表单
  return request('/api/trainrecord/evaluate', {
    method: 'POST',
    body: params,
  });
};

export const postConfirm = async (params) => { // 提交员工确认表单
  return request('/api/trainrecord/confirm', {
    method: 'POST',
    body: params,
  });
};

export const batchDeleteProbation = async (ids) => { // 批量删除培养阶段
  return request(`/api/trainrecord/delete/${ids}`, {
    method: 'DELETE',
  });
};

export const returntosummarize = async (id) => { // 主管驳回员工总结
  return request(`/api/trainrecord/returntosummarize/${id}`, {
    method: 'GET',
  });
};

export const becomeRegalar = async (id) => { // 转正
  return request(`/api/trainplan/becomeRegular/${id}`, {
    method: 'GET',
  });
};
