import { queryUserAllInfo } from '../services/api';

export default {
  namespace: 'profile',

  state: {
    basicLoading: true,
  },

  effects: {
    *fetchEmployee(payload, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: { basicLoading: true },
      });
      const response = yield call(queryUserAllInfo);
      yield put({
        type: 'show',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: { basicLoading: false },
      });
    },
  },
  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
