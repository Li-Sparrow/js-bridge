/**
 * bridge 基类
 */
import { IOutput } from './../interface';
export default class BaseClass {
  protected version: string;
  constructor() {
    this.version = '1.0.2';
  }

  protected successCall(result: any): IOutput {
    return {
      callstatus: 'ok',
      result
    };
  }

  protected errorCall(err: any, extra?: any): IOutput {
    return {
      callstatus: 'fail',
      err,
      extra
    };
  }
}
