import {Icon} from 'antd';
import React from 'react';

export const LOGO_NAME = 'Surgnova';

export const HREF_TODO = '';

export const UPLOAD_SERVER = '/api/file/uploadEmployee';

export const UPLOAD_TIME_SHEET_EXCEL = '/api/file/uploadTimesheet';

export const EXPORTUSEREXCEL = '/api/users/dcExcel';

export const UPLOADWORD = '/api/wordfile/upload';

export const EXPORTASSETEXCEL = '/api/asset/dcExcel';

export const EXPORTINVITERNEEDEXCEL = '/api/needs/dcExcel';

export const EXPORTINVITERRESOURCEEXCEL = '/api/resource/dcExcel';

export const UPLOAD_ASSERT = '/api/file/uploadAsset';

export const INVITE_HISTORY = '/api/file/resource';

export const INVITE_ASSESSORY = '/api/resource/accessory';

export const INVITE_NEED = '/api/file/needs';

export const UPLOAD_FILE = '/api/file/uploadFile';

export const DOWNLOAD_FILE = '/api/file/download';

// 临时添加
export const OPEN_FILE = '/api/openfile/view';

export const Status = {
  OK: 'ok',
  ERROR: 'error',
};

export const DOC_CATEGORIES = ['体系', '规程', '流程', '标准规范', '指导书', '模板', 'CheckList', '其他'];
export const DOC_SECRECTS = ['内部公开', '秘密', '机密', '绝密'];
export const DOC_LEVELS = ['一级', '二级', '三级', '四级', '五级', '其他'];
export const DOC_STAGE = ['起步', '市场调研', '落实'];

export const ASSET_USAGE = ['新购置', '闲置', '报废', '需维修', '使用中'];

export const LEAVE_TYPE = ['年假', '调休', '病假'];

export const INVITEREDUCATION = ['博士', '硕士', '本科', '大中专', '其他'];

// 招聘状态
export const INVITE_STATUS = ['面试不通过（含电话邀约）', '待进一步邀约', '已邀约待技术面试', '待资格面试', '待综合面试', 'offer意向沟通', '待审批Offer', '待发放Offer', '跟进入职', '已入职', '审批不通过', '放弃Offer', '放入资源池', '列入黑名单'];

// 二级部门
export const INVITE_SECONDARYSECTOR = ['研发中心', '生产中心', '质量法规部', '战略市场部', '财务部', '人事行政部', 'PMO', 'IT与信息安全部'];


// 三级部门
export const INVITE_TERTIARY = ['PMO', '测试部', '战略市场部', 'IT与信息安全部', '能量平台开发部', '视觉平台开发部', '手术机器人开发部', '生产部', '供应链管理部', '法规与临床事务部', '质量体系部', '供应商质量管理组', '生产质量管理部', '人事行政部', '财务部', '工程工艺工艺设计部'];

// 岗位类别
export const INVITE_CATEGARY = ['IT信息类', '财务类', '采购类', '测试类', '产品市场类', '电子类', '法规类', '工艺类', '机械类', '控制类', '品牌设计类', '人事行政类', '软件类', '生产供应链类', '生产技术类', '算法类', '项目管理类', '资源池', '质量类', '销售类'];

// 候选人来源
export const INVITE_SOURCE = ['自动搜索', '猎头推荐', '主动投递', '内部推荐', '候选人推荐', '其他'];

// 新增/替换
export const INVITE_NR = ['New', 'Replace', 'Backup'];

// 岗位优先级
export const INVITE_PRIORITY = ['低', '中', '高'];

// 入选状态
export const INVITE_SELECTSTATUS = ['已入职', '已发offer'];

// 职位状态
export const INVITE_STATIONSTATUS = ['招聘中', '已完成', '暂停', '再开启'];

export const INVITE_RECORD = ['微信', '电话', '邮件', '其他'];

export const ATTENDANCE_TYPE = {
  LEAVE: 'leave',
  WORK_OVERTIME: 'workOvertime',
};

export const FOOT_LINK = [{
  title: 'WIKI',
  href: 'http://192.168.10.3/doku.php',
}, {
  title: 'BUG跟踪系统',
  href: 'http://192.168.10.3:8080/',
}, {
  title: 'Agile系统',
  href: 'http://aglappsrvr:7001/Agile/',
}, {
  title: '公司官网',
  href: 'http://www.sinosurgical.cn/',
}];

export const FOOT_COPYRIGHT = <div>Copyright <Icon type="copyright"/> 2017 赛诺微医疗科技有限公司</div>;
export const FOOT_TIME = <div><Icon type="cloud-upload-o" />Build at 2018-02-09 20:35 </div>;
