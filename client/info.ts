import execService from './../core/exec';
import { METHODS } from './../constant';

class Info {
  /**
   * 获取客户端信息
   * @returns
   */
  getClientInfo() {
    return execService.execPromise(METHODS.CLIENT.GET_CLIENT_INFO);
  }
}

export default new Info();
