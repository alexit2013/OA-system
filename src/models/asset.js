import {routerRedux} from 'dva/router';
import { message } from 'antd';
import { addAsset, deleteAsset, batchDeleteAsset, editAsset, showAssetUser, showUser, UsersInitMission, AssetAllocStatus, UsersAcceptMission, AssetSearch, batchConfirm, batchRefuse} from '../services/api';

export default {
  namespace: 'asset',

  state: {
    list: [],
    loading: false,
    currentAsset: {},
    disabled: false,
    verifylist: [],
  },

  effects: {
    * fetchAssets(_, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(showAssetUser);
      yield put({
        type: 'saveAssetListToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * filtrate({payload}, {put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      console.log('payload: ', payload);
      yield put({
        type: 'saveAssetListToRedux',
        payload,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * TaskList(_, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(UsersInitMission);
      yield put({
        type: 'saveAssetListToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    * fetchUser(_, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(showUser);
      // const response = defaultArr();
      yield put({
        type: 'saveAssetListToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    * UsersAcceptMission(_, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(UsersAcceptMission);
      yield put({
        type: 'saveAssetVerifyListToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * readOnly({payload}, {put}) {
      yield put({
        type: 'requestRead',
        payload,
      });
    },
////////////////////////////////////////////////////////////////////////////////// sadfasfas ///////////////////////////////////
    * batchOperation({payload}, {put, call, select}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const body = yield payload.body.join(',');
      if (payload.name === 'accept') {
        yield call(batchConfirm, body);
      } else if (payload.name === 'delete') {
        yield call(batchRefuse, body);
      }
      const list = yield select(state => state.asset.list);
      yield put({
        type: 'saveAssetListToRedux',
        payload: [...list].filter((it) => {
          let flag = false;
          for (let i = 0; i < payload.length; i += 1) {
            if (it.mid === payload.body[i]) {
              flag = true;
            }
          }
          if (!flag) {
            return true;
          }
        }),
      });
      message.success('操作成功');
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * VerifyTaskManage({payload}, {put, call}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(AssetSearch, payload);
      yield put({
        type: 'saveAssetListToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * assetAlloc({payload}, {call, put, select}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(AssetAllocStatus, payload);
      const list = yield select(state => state.asset.verifylist); // state来源于全局state,select 用于获取全局的namespace;
      yield put({
        type: 'saveAssetVerifyListToRedux',
        payload: [...list].filter(it => it.mid !== payload.mid),
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    * saveAsset({payload}, {call, put}) {
      yield call(addAsset, payload);
      message.success('提交成功');
      yield put(routerRedux.push('/tabs/asset/asset-manage'));
    },

    * editAsset({payload}, {call, put}) { // 编辑资产
      yield call(editAsset, payload);
      message.success('修改成功');
      yield put(routerRedux.push('/tabs/asset/asset-manage'));
    },

    * deleteAsset({payload}, {call, put, select}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(deleteAsset, payload);
      const list = yield select(state => state.asset.list);
      yield put({
        type: 'saveAssetListToRedux',
        payload: [...list].filter(it => it.aid !== payload),
      });
      message.success('删除成功');
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * search({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(AssetSearch, payload);
      yield put({
        type: 'saveAssetListToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * batchDelete({payload}, {call, put, select}) { // 批量删除资产
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(batchDeleteAsset, payload.join(','));
      const list = yield select(state => state.asset.list);
      yield put({
        type: 'saveAssetListToRedux',
        payload: [...list].filter((it) => {
          let flag = false;
          for (let j = 0; j < payload.length; j += 1) {
            if (it.aid === payload[j]) {
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

  },

  reducers: {
    saveAssetListToRedux(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveAssetVerifyListToRedux(state, action) {
      return {
        ...state,
        verifylist: action.payload,
      };
    },
    requestRead(state, action) {
      return {
        ...state,
        disabled: action.payload,
      };
    },
    saveCurrentAssetToState(state, action) {
      return {
        ...state,
        currentAsset: action.payload,
      };
    },
  },
};

