import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {getMessageInviter, saveInviter, deleteInviter, inviterInfo, queryNameInviter, saveSynthesizeInviter, saveQualificationInviter, saveTechnbicalInviter, batchDeleteInviter, queryInviter, saveNeedInviter, findAllNeedInviter, deleteNeedInviter, batchDeleteNeedInviter, weekInviter, dateWeekInviter, weekDepInviter, dateDepWeekInviter, saveRecordInviter,
entryInviter, operateEntryInviter, ziyuanchi, NeedLikeInviter, saveSynthesizeDraft, saveTechnbicalDraft, saveQualificationDraft} from '../services/api';
export default {
  namespace: 'invite',
  state: {
    list: [],
    seclist: [],
    needlist: [],
    loading: false,
    inviterInfo: {},
  },

  effects: {
    * fetchData(_, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getMessageInviter);
      yield put({
        type: 'saveInviteListToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * fetchWeek(_, {call, put}) {
      const response = yield call(weekInviter);

      yield put({
        type: 'saveInviteSeclistToRedux',
        payload: response,
      });
    },
    * fetchWeekDate({payload}, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(dateWeekInviter, payload);
      // console.log('res: ', response);
      yield put({
        type: 'saveInviteSeclistToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * list({payload}, {put}) {
      yield put({
        type: 'saveInviteListToRedux',
        payload,
      });
    },
    * queryInviter(_, {call, put}) {
      const response = yield call(queryInviter);
      yield put({
        type: 'saveInviteListToRedux',
        payload: response,
      });
    },
    * saveInviter({payload}, {call, put}) {
      yield call(saveInviter, payload);
      message.success('提交成功');
      yield put(routerRedux.push('/tabs/invite/invite-message'));
    },
    * deleteInviter({payload}, {call, put, select}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(deleteInviter, payload);
      const list = yield select(state => state.invite.list);
      yield put({
        type: 'saveInviteListToRedux',
        payload: [...list].filter(it => it.zid !== payload),
      });
      message.success('删除成功');
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * batchDeleteInviter({payload}, {call, put, select}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(batchDeleteInviter, payload.join(','));
      const list = yield select(state => state.invite.list);
      yield put({
        type: 'saveInviteListToRedux',
        payload: [...list].filter((it) => {
          let flag = false;
          for (let i = 0; i < payload.length; i++) {
            if (it.zid === payload[i]) {
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
    * sortInviter({payload}, {call, put}) {
      const response = yield call(NeedLikeInviter, payload);
      yield put({
        type: 'saveInviteNeedlistToRedux',
        payload: response,
      });
    },
    * sortCenter({payload}, {call, put}) {
      const response = yield call(queryNameInviter, payload);
      yield put({
        type: 'saveInviteListToRedux',
        payload: response,
      });
    },
    * saveRecord({payload}, {call, put}) {
      const response = yield call(saveRecordInviter, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'changeLoading',
          payload: true,
        });
        message.success('保存成功');
      }
    },
    * saveNeedInviter({payload}, {call, put}) {
      yield call(saveNeedInviter, payload);
      message.success('保存成功');
      yield put(routerRedux.push('/tabs/invite/invite-need'));
    },
    * findAllNeed(_, {call, put}) {
      const response = yield call(findAllNeedInviter);
      yield put({
        type: 'saveInviteNeedlistToRedux',
        payload: response,
      });
    },
    * deleteNeedInviter({payload}, {call, put, select}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(deleteNeedInviter, payload);
      const list = yield select(state => state.invite.needlist);
      yield put({
        type: 'saveInviteNeedlistToRedux',
        payload: [...list].filter(it => it.nid !== payload),
      });
      message.success('删除成功');
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * batchDeleteNeedInviter({payload}, {call, put, select}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(batchDeleteNeedInviter, payload.join(','));
      const list = yield select(state => state.invite.needlist);
      yield put({
        type: 'saveInviteNeedlistToRedux',
        payload: [...list].filter((it) => {
          let flag = false;
          for (let i = 0; i < payload.length; i++) {
            if (it.nid === payload[i]) {
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
    * inviterInfoByName({payload}, {call, put}) {
      const response = yield call(queryNameInviter, payload);
      yield put({
        type: 'saveInviteInfoToRedux',
        payload: response,
      });
    },
    * inviterInfoById({payload}, {call, put}) {
      const response = yield call(inviterInfo, payload);
      yield put({
        type: 'saveInviteInfoToRedux',
        payload: response,
      });
    },
    * saveComp({payload}, {call, put}) {
      yield call(saveSynthesizeInviter, payload);
      message.success('保存成功');
      yield put(routerRedux.push({
        pathname: '/tabs/invite/invite-center',
        id: payload.zid,
      }));
    },
    * saveCompDraft({payload}, {call, put}) {
      yield call(saveSynthesizeDraft, payload);
      message.success('保存成功');
      yield put(routerRedux.push({
        pathname: '/tabs/invite/invite-center',
        id: payload.zid,
      }));
    },
    * saveQual({payload}, {call, put}) {
      yield call(saveQualificationInviter, payload);
      message.success('保存成功');
      yield put(routerRedux.push({
        pathname: '/tabs/invite/invite-center',
        id: payload.zid,
      }));
    },
    * saveQualDraft({payload}, {call, put}) {
      yield call(saveQualificationDraft, payload);
      message.success('保存成功');
      yield put(routerRedux.push({
        pathname: '/tabs/invite/invite-center',
        id: payload.zid,
      }));
    },
    * saveTech({payload}, {call, put}) {
      yield call(saveTechnbicalInviter, payload);
      message.success('保存成功');
      yield put(routerRedux.push({
        pathname: '/tabs/invite/invite-center',
        id: payload.zid,
      }));
    },
    * saveTechDraft({payload}, {call, put}) {
      yield call(saveTechnbicalDraft, payload);
      message.success('保存成功');
      yield put(routerRedux.push({
        pathname: '/tabs/invite/invite-center',
        id: payload.zid,
      }));
    },
    * fetchEntry(_, {call, put}) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(entryInviter);
      yield put({
        type: 'saveInviteEntrylistToRedux',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    * isEntry({payload}, {call, put, select}) {
      yield call(operateEntryInviter, payload);
      const list = yield select(state => state.invite.entrylist);
      yield put({
        type: 'saveInviteEntrylistToRedux',
        payload: [...list].filter(it => it.zid !== payload.reId),
      });
    },
    * ziyuanchi(_, {call, put}) {
      const response = yield call(ziyuanchi);
      yield put({
        type: 'saveInviteListToRedux',
        payload: response,
      });
    },
  },

  reducers: {
    saveInviteListToRedux(state, action) {
      return { ...state,
        list: action.payload,
      };
    },
    saveInviteSeclistToRedux(state, action) {
      return { ...state,
        seclist: action.payload,
      };
    },
    saveInviteNeedlistToRedux(state, action) {
      return { ...state,
        needlist: action.payload,
      };
    },
    saveInviteEntrylistToRedux(state, action) {
      return { ...state,
        entrylist: action.payload,
      };
    },
    saveInviteInfoToRedux(state, action) {
      return { ...state,
        inviterInfo: action.payload,
      };
    },
    changeLoading(state, action) {
      return { ...state,
        loading: action.payload,
      };
    },
    requestRead(state, action) {
      return { ...state,
        disabled: action.payload,
      };
    },
    saveCurrentAssetToState(state, action) {
      return { ...state,
        currentAsset: action.payload,
      };
    },
  },
};
