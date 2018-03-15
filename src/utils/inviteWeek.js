export const trimDate = (arr) => {
  if (arr[1] === '面试不通过（含电话邀约）') {
    arr.push('msbtg');
  } else if (arr[1] === '待进一步邀约') {
    arr.push('djybyy');
  } else if (arr[1] === '已邀约待技术面试') {
    arr.push('yyydjsms');
  } else if (arr[1] === '待资格面试') {
    arr.push('dzgms');
  } else if (arr[1] === '待综合面试') {
    arr.push('dzhms');
  } else if (arr[1] === 'offer意向沟通') {
    arr.push('oyxgt');
  } else if (arr[1] === '待审批offer') {
    arr.push('dspo');
  } else if (arr[1] === '待发放offer') {
    arr.push('dffo');
  } else if (arr[1] === '跟进入职') {
    arr.push('gjrz');
  } else if (arr[1] === '已入职') {
    arr.push('yrz');
  } else if (arr[1] === '放弃Offer') {
    arr.push('fqo');
  } else if (arr[1] === '放入资源池') {
    arr.push('frzyc');
  } else if (arr[1] === '审批不通过') {
    arr.push('spbtg');
  } else if (arr[1] === '部门') {
    arr.push('department');
  }
  return arr;
};

export const expand = (arr) => {
  let result = '';
  arr.map((it) => {
    if (it.department === '能量平台开发部') {
      result = '研发中心';
    } else if (it.department === '测试部') {
      result = '运营部';
    } else if (it.department === '供应链管理部') {
      result = '生产中心';
    } else if (it.department === '人事行政部') {
      result = '人事行政部';
    } else if (it.department === '质量体系部') {
      result = '质量法规部';
    } else if (it.department === '财务部') {
      result = '财务部';
    } else if (it.department === '战略市场部') {
      result = '战略市场部';
    }
  });
  return result;
};

// export const getNumber = (arr) => {
//   const number = arr.pop();
//   let result = '';
//   if (number === 0) {
//     result = '研发中心';
//   } else if (number === 1) {
//     result = '运营部';
//   } else if (number === 2) {
//     result = '生产中心';
//   } else if (number === 3) {
//     result = '人事行政部';
//   } else if (number === 4) {
//     result = '质量法规部';
//   } else if (number === 5) {
//     result = '财务部';
//   } else if (number === 6) {
//     result = '战略市场部';
//   }
//   return result;
// }