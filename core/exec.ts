/**
 * 客户端接口API底层common服务
 */
import BaseClass from './base';
import { WINDOW_OBJ_NAME, QUERY_KEY } from '../constant';

const agent = window.navigator.userAgent.toLowerCase();
const isAndroid = /Android/i.test(agent);
const isIos = /iPhone|iPod|iPad/i.test(agent);

// 输入json格式
export interface IInputJson {
  method: string;
  params: Record<string, unknown>;
  callback: string;
  version: string;
}

// 失败回调json格式
export interface IErrorOutputJson {
  err: string;
  message: string;
}

export type IExecCallBack = (err: IErrorOutputJson | null, result?: any) => void;

/**
 * 返回随机值，用于生成随机回调名称
 * @returns
 */
export function genRandomCallbackName(method: string) {
  const randomStr = setTimeout(() => {
    return '';
  }, 0);
  return `${method.replace(/\./g, '_')}_${randomStr}`;
}

/**
 * 处理回调
 * @param res 
 * @param cb 
 * @returns 
 */
export function callbackHandle(res, cb) {
  try {

    if (res && res.callstatus === 'ok') {
      return cb(null, res.result);
    }

    return cb({
      err: res.err,
      message: JSON.stringify(res.extra),
    });
  } catch (ex: any) {
    return cb({
      err: 'client_response_error',
      message: ex.message,
    });
  }
}

class ClientCommonService extends BaseClass {
  private defaultQuery: string;
  protected methods!: Record<string, string>;

  constructor() {
    super();
    this.defaultQuery = QUERY_KEY;
  }

  isSupport(): boolean {
    return (
      window.webkit?.messageHandlers?.[this.defaultQuery] !== undefined ||
      window[this.defaultQuery] !== undefined;
    );
  }

  /**
   * IOS QUERY
   */
  protected iosQuery(json: IInputJson) {
    window.webkit.messageHandlers[this.defaultQuery].postMessage(json);
  }

  /**
   * ANDROID QUERY
   * @param json
   */
  protected androidQuery(json: IInputJson) {
    window[this.defaultQuery].invoke(JSON.stringify(json));
  }

  /**
   * 最底层 exec json方法
   * @param json
   * @param cb
   */
  execJson(json: IInputJson, cb: IExecCallBack) {
    try {
      // IOS移动端
      if (isIos) {
        return this.iosQuery(json);
      }

      // android端
      if (isAndroid) {
        return this.androidQuery(json);
      }

      return cb({ err: 'client_not_support', message: JSON.stringify(json) });
    } catch (ex: any) {
      cb({
        err: 'client_exec_error',
        message: `${ex.message}, params: ${JSON.stringify(json)}`,
      });
    }
  }

  /**
   * exec
   * @param method
   * @param params
   * @param cb
   * @returns
   */
  execWithCallback(method: string, params: any, cb: IExecCallBack, rawCallback?: any) {
    // 嵌套性回调函数，所有回调fn都放在__client_api__下
    const innerCallback = genRandomCallbackName(method);

    const json = {
      method,
      params,
      callback: `${WINDOW_OBJ_NAME}.${innerCallback}`,
      version: this.version,
    };

    if (!window[WINDOW_OBJ_NAME]) {
      window[WINDOW_OBJ_NAME] = {};
    }

    window[WINDOW_OBJ_NAME][innerCallback] = (res: any) => {
      // 支持业务方自己处理response
      delete window[WINDOW_OBJ_NAME][innerCallback];
      rawCallback && rawCallback(res);
      callbackHandle(res, cb);
    };

    return this.execJson(json, cb);
  }

  /**
   * promise exec
   * @param method
   * @param params
   * @returns
   */
  execPromise(method: string, params?: Record<string, any>, rawCallback?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.execWithCallback(method, params || {}, (err, result) => {
        err ? reject(err) : resolve(result);
      }, rawCallback);
    });
  }

  /**
   * 不处理客户端数据，直接返回
   * @param method 
   * @param params 
   * @returns 
   */
  rawExec(method: string, params?: Record<string, any>) {
    return new Promise(resolve => {
      this.execWithCallback(method, params || {}, () => { }, (res) => {
        resolve(res);
      });
    });
  }
}

export default new ClientCommonService();
