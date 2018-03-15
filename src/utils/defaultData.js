export const defaultObj = () => {
  let tempData = {
    "aid": "555",
    "arriveDate": "2018-01-06T02:20:51.957Z",
    "brand": "number",
    "brandName": "number",
    "department": "number",
    "employeeNum": "number",
    "inventarNum": "number",
    "macAddress": "number",
    "modelNum": "number",
    "orderNum": "number",
    "price": "number",
    "procureDate": "2018-01-06T02:20:51.957Z",
    "quickCode": "number",
    "remarks": "number",
    "serial": "number",
    "tuser": "number",
    "type": "number",
    "usage": "number"
  };
  return tempData;
};

export const defaultArr = () => {
  let tempData = [
    {
      "aid": "222",
      "arriveDate": "2018-01-06T02:20:51.957Z",
      "brand": "number",
      "brandName": "number",
      "department": "number",
      "employeeNum": "number",
      "inventarNum": "number",
      "macAddress": "number",
      "modelNum": "number",
      "orderNum": "number",
      "price": "number",
      "procureDate": "2018-01-06T02:20:51.957Z",
      "quickCode": "number",
      "remarks": "number",
      "serial": "number",
      "tuser": "number",
      "type": "number",
      "usage": "number"
    },
    {
      "aid": "333",
      "arriveDate": "2018-01-06T02:20:51.957Z",
      "brand": "string",
      "brandName": "string",
      "department": "string",
      "employeeNum": "string",
      "inventarNum": "string",
      "macAddress": "string",
      "modelNum": "string",
      "orderNum": "string",
      "price": "string",
      "procureDate": "2018-01-06T02:20:51.957Z",
      "quickCode": "string",
      "remarks": "string",
      "serial": "string",
      "tuser": "string",
      "type": "string",
      "usage": "string"
    },
    {
      "aid": "444",
      "arriveDate": "2018-01-06T02:20:51.957Z",
      "brand": "string",
      "brandName": "Array",
      "department": "Array",
      "employeeNum": "Array",
      "inventarNum": "Array",
      "macAddress": "Array",
      "modelNum": "Array",
      "orderNum": "Array",
      "price": "Array",
      "procureDate": "2018-01-06T02:20:51.957Z",
      "quickCode": "Array",
      "remarks": "Array",
      "serial": "Array",
      "tuser": "Array",
      "type": "Array",
      "usage": "Array"
    }
  ];
  return tempData;
};

export const defaultList = () => {
    const data = [{
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    }, {
      key: '2',
      name: 'Joe Black',
      age: 42,
      address: 'London No. 1 Lake Park',
    }, {
      key: '3',
      name: 'Jim Green',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    }, {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park',
    }];

    return data;
}

export const dataNotice = () => {
    const data = [{
    id: '000000001',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: '你收到了 14 份新周报',
    datetime: '2017-08-09',
    type: '通知',
  }, {
    id: '000000002',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
    title: '你推荐的 曲妮妮 已通过第三轮面试',
    datetime: '2017-08-08',
    type: '通知',
  }, {
    id: '000000003',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
    title: '这种模板可以区分多种通知类型',
    datetime: '2017-08-07',
    read: true,
    type: '通知',
  }, {
    id: '000000004',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
    title: '左侧图标用于区分不同的类型',
    datetime: '2017-08-07',
    type: '通知',
  }, {
    id: '000000005',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    title: '内容不要超过两行字，超出时自动截断',
    datetime: '2017-08-07',
    type: '通知',
  }, {
    id: '000000006',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    title: '曲丽丽 评论了你',
    description: '描述信息描述信息描述信息',
    datetime: '2017-08-07',
    type: '消息',
  }, {
    id: '000000007',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    title: '朱偏右 回复了你',
    description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
    datetime: '2017-08-07',
    type: '消息',
  }, {
    id: '000000008',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
    title: '标题',
    description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
    datetime: '2017-08-07',
    type: '消息',
  }, {
    id: '000000009',
    title: '任务名称',
    description: '任务需要在 2017-01-12 20:00 前启动',
    extra: '未开始',
    status: 'todo',
    type: '待办',
  }, {
    id: '000000010',
    title: '第三方紧急代码变更',
    description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
    extra: '马上到期',
    status: 'urgent',
    type: '待办',
  }, {
    id: '000000011',
    title: '信息安全考试',
    description: '指派竹尔于 2017-01-09 前完成更新并发布',
    extra: '已耗时 8 天',
    status: 'doing',
    type: '待办',
  }, {
    id: '000000012',
    title: 'ABCD 版本发布',
    description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
    extra: '进行中',
    status: 'processing',
    type: '待办',
  }];
  return data;
}

export const departMatch = (value) => {
  let departArr = [];
  if (value === '研发中心') {
    departArr = ['能量平台开发部', '视觉平台开发部', '手术机器人开发部', '测试部', '工程工艺设计部', '采购部']
  } else if (value === '质量法规部') {
    departArr = ['法规与临床事务部', '供应商质量管理组', '生产质量管理部', '质量体系部']
  } else if (value === '项目管理部') {
    departArr = ['项目管理部']
  } else if (value === 'IT与信息安全部') {
    departArr = ['IT与信息安全部']
  } else if (value === '生产中心') {
    departArr = ['供应链管理部', '生产部']
  } else if (value === '财务部') {
    departArr = ['财务部']
  } else if (value === '人事行政部') {
    departArr = ['人事行政部']
  } else if (value === '销售部') {
    departArr = ['销售部']
  } else if (value === '战略市场部') {
    departArr = ['战略市场部']
  }
 return departArr;
}
