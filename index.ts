import api from './api';
import client from './client';
import exec from './core/exec';
import event from './core/event';

import { WINDOW_OBJ_NAME, METHODS } from './constant';

try {
  // 初始化客户端的window对象
  // 所有的对象都挂在同一个对象下，避免太多window对象
  if (!window[WINDOW_OBJ_NAME]) {
    window[WINDOW_OBJ_NAME] = {};
  }
} catch (e) {
  console.warn('window[WINDOW_OBJ_NAME]', e);
}

/**
 * 客户端是否支持
 * @returns 
 */
const isSupport = () => {
  return exec.isSupport();
}

export default { exec, event, api, client, METHODS, isSupport };
