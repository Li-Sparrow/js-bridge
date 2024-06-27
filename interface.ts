export interface IOutput {
  callstatus: 'ok' | 'fail';
  result?: any;
  err?: any;
  extra?: any;
}
