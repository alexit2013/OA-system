import {routerRedux} from 'dva/router';
import {message } from 'antd';
import {isEmpty} from 'lodash';
import {addDoc, deleteDoc, eidtDoc, queryDocList} from '../services/api';
import {Status} from '../common/constants';

export default {
  namespace: 'document',
  state: {
    loading: false,
    list: [],
    submitting: false,
  },

  effects: {
    * fetchList({payload}, {call, put}) {
      yield put({
        type: 'changeLoadingState',
        payload: true,
      });

      const docList = yield call(queryDocList, payload);
      yield put({
        type: 'setListData',
        payload: docList,
      });

      yield put({
        type: 'changeLoadingState',
        payload: false,
      });
    },

    * deleteDoc({payload}, {call, put, select}) {
      const response = yield call(deleteDoc, payload);
      if (response.status === Status.OK) {
        const list = yield select(state => state.document.list);
        yield put({
          type: 'setListData',
          payload: [...list].filter(it => it.id !== payload),
        });
      } else {
        message.warn('删除文档失败!', response);
      }
    },

    * addDoc({payload}, {call, put}) {
      const response = yield call(addDoc, payload);
      if (!isEmpty(response.id)) {
        message.info('添加文档成功');
        yield put(routerRedux.push('/tabs/manager/doc-manage'));
      } else {
        message.error('添加文档失败!', response);
      }
    },

    * editDoc({payload}, {call, put}) {
      const response = yield call(eidtDoc, payload);
      if (!isEmpty(response.id)) {
        message.info('修改文档成功');
        yield put(routerRedux.push('/tabs/manager/doc-manage'));
      } else {
        message.error('修改文档失败!', response);
      }
    },

  },
  reducers: {

    changeLoadingState(state, {payload}) {
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
