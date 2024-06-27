import execService from './core/exec';
import { METHODS } from './constant';

class Api {
  /**
   * 检查api是否存在
   * @param apis
   * @returns
   */
  async check(api: string) {
    const res = await this._check([api]);
    return !!res[api];
  }

  /**
   * 单个接口查询，无缓存
   * @param apis
   * @returns
   */
  _check(apis: string[]) {
    return execService.execPromise(METHODS.API.CHECK, { apis });
  }

  /**
   * 返回客户端支持的所有api列表
   * @returns
   */
  list() {
    return execService.execPromise(METHODS.API.LIST);
  }
}

export default new Api();
