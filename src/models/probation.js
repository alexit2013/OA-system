import {routerRedux} from 'dva/router';
import { message } from 'antd';
import { getAllTrainplan, getSomeBodyTrainplan, batchDeleteProbation, getSrchvalueTrainplan} from '../services/api';

export default {
  namespace: 'probation',

  state: {
    probationList: [],
    probationInfo: {},
    loading: false,
  },

  effects: {
    * fetchDate(_, {call, put}) { // 获取全部的培养计划
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getAllTrainplan);
      yield put({
        type: 'saveProbationListToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * fetchStep({payload}, {call, put}) { // 获取每个状态的信息
      const response = yield call(getSomeBodyTrainplan, payload);
      yield put({
        type: 'saveProbationInfoToRedux',
        payload: response,
      });
    },
    * batchDelete({payload}, {call, put, select}) {
      console.log('payload: ', payload);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(batchDeleteProbation, payload.join(','));
      const list = yield select(state => state.probation.probationList);
      yield put({
        type: 'saveProbationListToRedux',
        payload: [...list].filter((item) => {
          let flag = false;
          for (let i = 0; i < payload.length; i++) {
            item.trainRecords.map((it) => {
              if (it.id === payload[i]) {
                flag = true;
              }
            })
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
    * searchDate({payload}, {call, put}) { // 搜索框输入model
      const response = yield call(getSrchvalueTrainplan, payload);
      yield put({
        type: 'saveProbationListToRedux',
        payload: response,
      });
    },
  },

  reducers: {
    saveProbationListToRedux(state, action) {
      return {
        ...state,
        probationList: action.payload,
      };
    },
    saveProbationInfoToRedux(state, action) {
      return {
        ...state,
        probationInfo: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
