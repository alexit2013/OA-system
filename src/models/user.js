import {routerRedux} from 'dva/router';
import { message, notification } from 'antd';
import {changePassword, deleteUser, batchDelete, query as queryUsers, queryCurrentUser, saveUserInfo, queryInviterSort} from '../services/api';
import {Status} from '../common/constants';

export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {},
  },

  effects: {
    * fetchUsers(_, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUsers);
      yield put({
        type: 'saveUserListToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    * fetchCurrent(_, {call, put}) {
      const response = yield call(queryCurrentUser);
      yield put({
        type: 'saveCurrentUserToState',
        payload: response,
      });
    },

    * saveUser({payload}, {call, put}) {
      yield call(saveUserInfo, payload);
      message.success('提交成功');
      yield put(routerRedux.push('/tabs/manager/user-manage'));
    },

    * deleteUser({payload}, {call, put, select}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield call(deleteUser, payload);
      const list = yield select(state => state.user.list);
      yield put({
        type: 'saveUserListToRedux',
        payload: [...list].filter(it => it.emId !== payload),
      });
      message.success('删除成功');
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * batchDelete({payload}, {call, put, select}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      yield call(batchDelete, payload.join(','));
      const list = yield select(state => state.user.list);
      yield put({
        type: 'saveUserListToRedux',
        payload: [...list].filter((it) => {
          let flag = false;
          for (let i = 0; i < payload.length; i++) {
            if (it.emId === payload[i]) {
              flag = true;
            }
          }
          if (!flag) {
            return true;
          }
        }),
      });
      message.success('删除成功');
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *changePassword({payload}, {call, put}) {
      const response = yield call(changePassword, payload);
      if (response.status === Status.OK) {
        notification.success({
          message: '修改密码成功',
        });
        yield put({
          type: 'login/logout',
          payload: response,
        });
      } else {
        notification.error({
          message: '修改密码失败',
        });
      }
      return response;
    },
    * search({payload}, {put}) {
      yield put({
        type: 'saveUserListToRedux',
        payload: payload,
      });
    },
    * sortUser({payload}, {put, call}) {
      const response = yield call(queryInviterSort, payload);
      yield put({
        type: 'saveUserListToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    saveUserListToRedux(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUserToState(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
