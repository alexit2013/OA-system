import { message } from 'antd';
import {routerRedux} from 'dva/router';
import {isEmpty} from 'lodash';
import { addLeave, addWorkOvertime, queryWorkOvertimes, deleteAttendanceById } from '../services/api';

export default {
  namespace: 'attendance',

  state: {
    regularFormSubmitting: false,
    loading: false,
    list: [],
  },

  effects: {
    * addLeave({payload}, {call, put}) {
      const response = yield call(addLeave, payload);
      if (!isEmpty(response.id)) {
        message.info('请假申请创建成功');
        yield put(routerRedux.push('/tabs/attendance/leave-time'));
      } else {
        message.error('请假申请创建失败!', response);
      }
    },

    *submitAddOvertimeForm({ payload }, { call, put }) {
      yield put({
        type: 'addOvertimeFormSubmitting',
        payload: true,
      });
      yield call(addWorkOvertime, payload);
      yield put({
        type: 'addOvertimeFormSubmitting',
        payload: false,
      });
      message.success('提交成功');
      const target = '/tabs/attendance/work-overtime';
      yield put(routerRedux.push(target));
    },

    *queryAttendances({payload}, { call, put }) {
      yield put({
        type: 'changeLoadingState',
        payload: true,
      });
      const response = yield call(queryWorkOvertimes, payload);
      yield put({
        type: 'setListData',
        payload: response,
      });
      yield put({
        type: 'changeLoadingState',
        payload: false,
      });
    },
    *deleteAttendanceById({payload}, {call, put, select}) {
      yield call(deleteAttendanceById, payload);
      const list = yield select(state => state.attendance.list);
      yield put({
        type: 'setListData',
        payload: [...list].filter(it => it.id !== payload),
      });
      message.success('删除成功');
    },
  },

  reducers: {
    addOvertimeFormSubmitting(state, { payload }) {
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
  },
};
