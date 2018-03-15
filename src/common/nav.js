import dynamic from 'dva/dynamic';
// import {navlayout} from '../utils/nav';
// 解决组件动态加载问题的util方法
// app: dva实例，加载models时需要
// models：返回Promise数组的函数，Promise返回dva model
// component:返回Promise的函数，Promise返回React Component

// wrapper of dynamic

const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m =>
  import(`../models/${m}.js`)),
  component,
});

// nav data

export const getNavData = app => [{
  component: dynamicWrapper(app, [], () => 
    import('../layouts/UserLayout')),
  path: '/user',
  layout: 'UserLayout',
  children: [{
    name: '帐户',
    icon: 'user',
    path: 'user',
    children: [{
      name: '登录',
      path: 'login',
      component: dynamicWrapper(app, ['login'], () =>
        import('../routes/User/Login')),
    }],
  }],
},
{
  component: dynamicWrapper(app, ['user', 'login'], () =>
      import('../layouts/TabsLayout')),
  layout: 'TabsLayout',
  path: '/tabs',
  name: '首页', // for breadcrumb
  children: [{
    name: '公告栏',
    path: 'notice',
    tabs: true,
    component: dynamicWrapper(app, ['notice'], () =>
      import('../routes/Notice/Notice')),
    children: [{
      name: '公告详情',
      path: 'detail/:id',
      tabs: false,
      component: dynamicWrapper(app, ['notice'], () =>
        import('../routes/Notice/NoticeDetail')),
    }],
  }, {
    name: '文档中心',
    path: 'techdoc',
    tabs: true,
    component: dynamicWrapper(app, ['document'], () =>
      import('../routes/TechDoc/TechDoc')),
    children: [{
      path: 'detail/:docId',
      name: '文档详情',
      component: dynamicWrapper(app, ['document'], () =>
        import('../routes/TechDoc/DocDetail')),
    }],
  }, {
    name: '个人信息',
    path: 'profile',
    tabs: true,
    component: dynamicWrapper(app, ['profile'], () =>
      import('../routes/Profile/Profile')),
    children: [{
      path: 'change-password',
      name: '修改密码',
      component: dynamicWrapper(app, ['user', 'login'], () =>
      import('../routes/Profile/UserChangePw')),
    }],
  },
  // {
  //   name: '考勤',
  //   path: 'attendance',
  //   tabs: true,
  //   component: dynamicWrapper(app, [], () => import('../routes/Attendance/Attendance')),
  //   children: [
  //     {
  //       path: 'work-overtime',
  //       name: '加班',
  //       menu: true,
  //       component: dynamicWrapper(app, ['attendance'], () => import('../routes/Attendance/WorkOvertime/WorkOvertime')),
  //     },
  //     {
  //       name: '申请加班',
  //       path: 'work-overtime/add',
  //       component: dynamicWrapper(app, ['attendance'], () => import('../routes/Attendance/WorkOvertime/WorkOvertimeAdd')),
  //     },
  //     {
  //       path: 'leave-time',
  //       name: '请假',
  //       menu: true,
  //       component: dynamicWrapper(app, ['attendance'], () => import('../routes/Attendance/LeaveTime/LeaveTime')),
  //     },
  //     {
  //       name: '申请请假',
  //       path: 'leave-time/add',
  //       component: dynamicWrapper(app, ['attendance'], () => import('../routes/Attendance/LeaveTime/LeaveTimeAdd')),
  //     },
  //     {
  //       path: 'notice-manage',
  //       name: '审批',
  //       menu: true,
  //       component: dynamicWrapper(app, ['notice'], () => import('../routes/Manager/NoticeManage/NoticeManage')),
  //     },
  //   ],
  // },
  {
    name: '管理员',
    path: 'manager',
    tabs: false,
    component: dynamicWrapper(app, [], () =>
      import('../routes/Manager/Manager')),
    children: [{
      path: 'user-manage',
      name: '用户管理',
      menu: true,
      component: dynamicWrapper(app, ['user'], () =>
        import('../routes/Manager/UserManage/UserManage')),
    }, {
      name: '用户编辑',
      path: 'user-manage/user-add',
      component: dynamicWrapper(app, ['user'], () =>
        import('../routes/Manager/UserManage/UserAdd')),
    }, {
      path: 'doc-manage',
      name: '文档中心',
      menu: true,
      component: dynamicWrapper(app, ['document'], () =>
        import('../routes/Manager/DocManage/DocManage')),
    }, {
      path: 'organization-structure',
      name: '组织结构',
      menu: true,
      component: dynamicWrapper(app, ['document'], () => import('../routes/Manager/Organization/Organization')),
    }, {
      path: 'doc-manage/doc-add',
      name: '添加文档',
      component: dynamicWrapper(app, ['document'], () =>
        import('../routes/Manager/DocManage/AddDoc')),
    }, {
      path: 'notice-manage',
      name: '公告管理',
      menu: true,
      component: dynamicWrapper(app, ['notice'], () =>
        import('../routes/Manager/NoticeManage/NoticeManage')),
    }, {
      path: 'notice-manage/notice-add',
      name: '添加公告',
      component: dynamicWrapper(app, ['notice'], () =>
        import('../routes/Manager/NoticeManage/NoticeAdd')),
    }, {
      path: 'attendance-manage',
      name: '考勤管理',
      menu: false,
      component: dynamicWrapper(app, [], () =>
        import('../routes/Manager/AttendanceManage/AttendanceManage')),
    }],
  }, {
    name: '异常页',
    path: 'exception',
    tabs: 'error',
    component: dynamicWrapper(app, [], () => import('../routes/Exception/exception')),
    children: [{
      path: '403',
      name: '403',
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    }, {
      path: '404',
      name: '404',
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    }, {
      path: '500',
      name: '500',
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    }, {
      name: '触发异常',
      path: 'trigger',
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    }],
  }, {
    name: '资产管理',
    path: 'asset',
    tabs: true,
    component: dynamicWrapper(app, [], () =>
      import('../routes/Asset/Asset')),
    children: [{
      path: 'asset-manage',
      name: '资产中心',
      menu: true,
      component: dynamicWrapper(app, ['asset'], () =>
        import('../routes/Asset/AssetManage/AssetManage')),
    }, {
      path: 'asset-manage/asset-add',
      name: '添加资产',
      component: dynamicWrapper(app, ['asset'], () =>
        import('../routes/Asset/AssetManage/AddAsset')),
    }, {
      path: 'asset-initMission',
      name: '我发出的任务',
      menu: true,
      component: dynamicWrapper(app, ['asset'], () =>
        import('../routes/Asset/TaskManage/TaskManage')),
    }, {
      path: 'asset-acceptMission',
      name: '待确认任务',
      menu: true,
      component: dynamicWrapper(app, ['asset'], () =>
        import('../routes/Asset/VerifyTaskManage/VerifyTaskManage')),
    }, {
      path: 'asset-historyMission',
      name: '历史任务',
      menu: true,
      component: dynamicWrapper(app, ['asset'], () =>
        import('../routes/Asset/HistoryTaskManage/HistoryTaskManage')),
    }],
  }, {
    name: '招聘管理',
    path: 'invite',
    tabs: true,
    component: dynamicWrapper(app, [], () =>
      import('../routes/Invite/Invite')),
    children: [{
      path: 'invite-need',
      name: '招聘需求管理',
      authority: 'hr_recruit',
      component: dynamicWrapper(app, ['invite'], () => import('../routes/Invite/InviteNeed/InviteNeed')),
    }, {
      path: 'invite-need/add-need',
      name: '新增需求',
      component: dynamicWrapper(app, ['invite'], () => import('../routes/Invite/InviteNeed/AddNeed')),
    }, {
      path: 'invite-message',
      name: '招聘过程管理',
      authority: 'user',
      component: dynamicWrapper(app, ['invite'], () =>
        import('../routes/Invite/InviteMessage/InviteMessage')),
    }, {
      path: 'invite-message/add-inviter',
      name: '添加候选人',
      component: dynamicWrapper(app, ['invite'], () =>
        import('../routes/Invite/InviteMessage/AddInvite')),
    }, {
      path: 'invite-center',
      name: '招聘中心',
      component: dynamicWrapper(app, ['invite'], () =>
        import('../routes/Invite/InviteCenter/InviteCenter')),
    }, {
      path: 'invite-analyze',
      name: '数据分析',
      authority: 'hr_recruit',
      component: dynamicWrapper(app, ['invite'], () =>
        import('../routes/Invite/InviteMessage/layoutMessage')),
      children: [{
        path: 'invite-statistics',
        name: '招聘统计',
        authority: 'hr_recruit',
        component: dynamicWrapper(app, ['invite'], () =>
        import('../routes/Invite/InviteStatistics/InviteStatistics')),
      }, {
        path: 'invite-week',
        name: '周报',
        authority: 'hr_recruit',
        component: dynamicWrapper(app, ['invite'], () => import('../routes/Invite/InviteWeek/InviteWeek')),
      }],
    }, {
      path: 'invite-entry',
      name: '入职过程管理',
      authority: 'hr_recruit',
      component: dynamicWrapper(app, ['invite'], () =>
        import('../routes/Invite/InviteEntry/InviteEntry')),
    }, {
      path: 'invite-examine',
      name: '审批过程管理',
      authority: 'hr_recruit',
      component: dynamicWrapper(app, ['invite'], () =>
        import('../routes/Invite/InviteExamine/InviteExamine')),
    }, {
      path: 'invite-task/tech-invite',
      name: '技术面试表',
      component: dynamicWrapper(app, ['invite'], () =>
        import('../routes/Invite/InviteTask/InviteTech')),
    }, {
      path: 'invite-task/qual-invite',
      name: '资格面试表',
      component: dynamicWrapper(app, ['invite'], () =>
        import('../routes/Invite/InviteTask/InviteQual')),
    }, {
      path: 'invite-task/comp-invite',
      name: '综合面试表',
      component: dynamicWrapper(app, ['invite'], () =>
        import('../routes/Invite/InviteTask/InviteComp')),
    }],
  }, {
    name: '试用期管理',
    path: 'probation',
    tabs: true,
    component: dynamicWrapper(app, [], () =>
      import('../routes/Probation/Probation')),
    children: [{
      name: '培养计划表',
      path: 'probation-table',
      menu: true,
      component: dynamicWrapper(app, ['probation'], () => import('../routes/Probation/StaffTraining/StaffTraining')),
    }, {
      name: '培养阶段记录表',
      path: 'probation-stage',
      component: dynamicWrapper(app, ['probation'], () => import('../routes/Probation/rotationStage/index.js')),
    }],
  }],
}];
