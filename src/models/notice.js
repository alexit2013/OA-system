import { message } from 'antd';
import {routerRedux} from 'dva/router';
import { addNotice, queryNotices, deleteNotice, getNoticeById, noticeInvite } from '../services/api';

export default {
  namespace: 'notice',

  state: {
    regularFormSubmitting: false,
    loading: false,
    list: [],
    item: {},
  },

  effects: {
    *queryNotices({payload}, { call, put }) {
      yield put({
        type: 'changeLoadingState',
        payload: true,
      });
      const response = yield call(queryNotices, payload);
      yield put({
        type: 'setListData',
        payload: response,
      });
      yield put({
        type: 'changeLoadingState',
        payload: false,
      });
    },
    * noticeInvite(_,{ call, put}) {
      yield put({
        type: 'changeLoadingState',
        payload: true,
      });
      const response = yield call(noticeInvite);
      // console.log('response: ',response);
      yield put({
        type: 'setListData',
        payload: response,
      });
      yield put({
        type: 'changeLoadingState',
        payload: false,
      });
    },
    *submitAddNoticeForm({ payload }, { call, put }) {
      yield put({
        type: 'addNoticeFormSubmitting',
        payload: true,
      });
      yield call(addNotice, payload);
      yield put({
        type: 'addNoticeFormSubmitting',
        payload: false,
      });
      message.success('提交成功');
      yield put({
        type: 'setOneData',
        payload: {},
      });
      yield put(routerRedux.push('/tabs/manager/notice-manage'));
    },
    *deleteNotice({payload}, {call, put, select}) {
      yield call(deleteNotice, payload);
      const list = yield select(state => state.notice.list);
      yield put({
        type: 'setListData',
        payload: [...list].filter(it => it.id !== payload),
      });
      message.success('删除成功');
    },
    *editNotice({payload}, {call, put}) {
      const response = yield call(getNoticeById, payload);
      yield put({
        type: 'setOneData',
        payload: response,
      });
      yield put(routerRedux.push('/tabs/manager/notice-manage/notice-add'));
    },

    *cancelNotice({payload = {}}, {put}) {
      yield put({
        type: 'setOneData',
        payload,
      });
    },
  },

  reducers: {
    addNoticeFormSubmitting(state, { payload }) {
      return {
        ...state,
        regularFormSubmitting: payload,
      };
    },
    changeLoadingState(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    setListData(state, {payload}) {
      return {
        ...state,
        list: payload,
      };
    },
    setOneData(state, {payload}) {
      return {
        ...state,
        item: payload,
      };
    },
  },
};
