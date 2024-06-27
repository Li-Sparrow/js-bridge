/*
 * 事件注册和管理服务
 *
 */
import execService, { genRandomCallbackName, callbackHandle } from './exec';
import { WINDOW_OBJ_NAME, METHODS } from './../constant';

class EventService {
  private mapping: any;
  constructor() {
    this.mapping = {};
  }

  /**
   * 增加监听事件
   * @param eventName 事件名
   * @param callback 回调函数
   */
  addEventListener(eventName, cb: Function) {
    let innerCallback = genRandomCallbackName(eventName);
    this.mapping[eventName] = innerCallback;

    window[WINDOW_OBJ_NAME][innerCallback] = (res) => {
      return callbackHandle(res, cb);
    };

    return execService.execPromise(METHODS.EVENT.ADD_EVENT_LISTENER,
      {
        eventName,
        callback: `${WINDOW_OBJ_NAME}.${innerCallback}`,
        callbackName: `${WINDOW_OBJ_NAME}.${innerCallback}` // TODO: 暂时保留
      });
  }

  /**
   * 移除事件监听
   * @param eventName 事件名
   */
  removeEventListener(eventName) {
    execService.execPromise(METHODS.EVENT.REMOVE_EVENT_LISTENER, { eventName });

    let innerCallback = this.mapping[eventName];

    if (innerCallback) {
      delete window[WINDOW_OBJ_NAME][innerCallback];
      delete this.mapping[eventName];
    }
  }
}

export default new EventService();
