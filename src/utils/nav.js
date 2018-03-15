import {isAdmin, isHr} from './authority';

export const navlayout = (arr) => {
  let inviteNav = [];
  if (isAdmin() || isHr()) {
    inviteNav = arr;
  } else {
    arr.map((it) => {
      if (it.name === '招聘过程管理' || it.name === '添加候选人' || it.name === '招聘中心' || it.name === '技术面试表' || it.name === '资格面试表' || it.name === '综合面试表') {
        inviteNav.push(it);
      }
    });
  }
  return inviteNav;
};
