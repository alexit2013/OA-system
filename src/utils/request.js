import fetch from 'dva/fetch';
import {ErrorType} from './errorHandler';
import { routerRedux } from 'dva/router';
import store from '../index';

function checkStatus(response) {
  const { dispatch } = store;
  const {status} = response;
  if (status === 403) {
    dispatch(routerRedux.push('/tabs/exception/403'));
    return;
  }
  if (status <= 504 && status >= 500) {
    dispatch(routerRedux.push('/tabs/exception/500'));
    return;
  }
  if (status >= 404 && status < 422) {
    dispatch(routerRedux.push('/tabs/exception/404'));
  }
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 401) {
    const error = new Error(response.statusText);
    error.type = ErrorType.SessionError;
    throw error;
  }
  // notification.error({
  //   message: `请求错误 ${response.status}: ${response.url}`,
  //   description: response.statusText,
  // });
  console.error(`请求错误 ${response.status}: ${response.url}`);
  console.error(`description:${response.statusText}`);
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch((error) => {
      if (error.type === ErrorType.SessionError) {
        throw error;
      }
      if (error.code) {
        // notification.error({
        //   message: error.name,
        //   description: error.message,
        // });
        console.error(`${error.name}:${error.message}`);
      }
      if ('stack' in error && 'message' in error) {
        // notification.error({
        //   message: `请求错误: ${url}`,
        //   description: error.message,
        // });
        console.error(`请求错误: ${url},description:${error.message}`);
      }
      return error;
    });
}
