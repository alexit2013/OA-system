import { routerRedux } from 'dva/router';
import { accountLogin, accountLogout } from '../services/api';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
      window.sessionStorage.setItem('user', JSON.stringify(response));
    },

    *logout(_, { call, put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield call(accountLogout);
      window.sessionStorage.clear();
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
