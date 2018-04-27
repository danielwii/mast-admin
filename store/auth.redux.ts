import { call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';

import _             from 'lodash';
import * as R        from 'ramda';
import { message }   from 'antd';
import { REHYDRATE } from 'redux-persist/constants';

import { authProxy }        from '../adapters/auth';
import { routerActions }    from './router.redux';
import { createLogger, lv } from '../helpers';
import { reduxAction }      from 'node-buffs';

const logger = createLogger('store:auth', lv.warn);

// --------------------------------------------------------------
// Login actionTypes
// --------------------------------------------------------------

const authActionTypes = {
  LOGIN        : 'auth::login',
  LOGOUT       : 'auth::logout',
  LOGIN_FAILED : 'auth::login-failed',
  LOGIN_SUCCESS: 'auth::login-success',
};

const isCurrent = type => type.startsWith('auth::');

// --------------------------------------------------------------
// Login actions
// --------------------------------------------------------------

const authActions = {
  login       : (username, password) => reduxAction(authActionTypes.LOGIN, { username, password }),
  logout      : () => reduxAction(authActionTypes.LOGOUT, { token: null, loginTime: null }),
  loginSuccess: token => reduxAction(authActionTypes.LOGIN_SUCCESS, { token, loginTime: new Date() }),
  loginFailed : error => reduxAction(authActionTypes.LOGIN_FAILED, {}, error),
};

// --------------------------------------------------------------
// Login sagas
// --------------------------------------------------------------

function* loginSaga({ payload: { username, password } }) {
  try {
    logger.log('[loginSaga]');
    const response = yield call(authProxy.login, { body: { username, password } });
    logger.log('[loginSaga]', 'response is', response);
    const token = yield call(authProxy.extractToken, response.data);
    yield put(authActions.loginSuccess(token));
    message.info(`'${username}' login success`);
    yield put(routerActions.toIndex());
  } catch (e) {
    logger.error('[loginSaga]', { e });
    if (e.response) {
      yield put(authActions.loginFailed(e.response));
      message.error(JSON.stringify(e.response.data));
    }
  }
}

function* logoutSaga() {
  try {
    logger.log('[logoutSaga]');
    const response = yield call(authProxy.logout);
    logger.log('[logoutSaga]', 'response is', response);
  } catch (e) {
    logger.error('[logoutSaga]', { e });
  }
}

/**
 * 未找到可用 token 时重定向到登录页面
 */
function* tokenWatcher(action) {
  const { auth: { token }, router: { path } } = yield select();
  if (action.type === authActionTypes.LOGOUT) {
    yield put(routerActions.toLogin());
  } else if (!token && path !== '/login') {
    const rehydrateAction = yield take(REHYDRATE);
    logger.log('[tokenWatcher]', 'waiting for rehydrateAction', rehydrateAction);
    if (!_.get(rehydrateAction, 'payload.auth.token')) {
      yield put(routerActions.toLogin());
    }
  }
}

const authSagas = [
  takeLatest(authActionTypes.LOGIN as any, loginSaga),
  takeLatest(authActionTypes.LOGOUT, logoutSaga),
  takeEvery('*', tokenWatcher),
];

// --------------------------------------------------------------
// Login reducers
// --------------------------------------------------------------

const initialState = {
  loginTime: null,
  username : null,
  token    : null,
};

const authReducer = (previousState = initialState, action) => {
  if (isCurrent(action.type)) {
    switch (action.type) {
      default:
        return R.mergeDeepRight(previousState, _.omit(action.payload, 'password'));
    }
  } else {
    return previousState;
  }
};

export {
  authActionTypes,
  authActions,
  authSagas,
  authReducer,
};