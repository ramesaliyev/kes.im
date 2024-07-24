import App from 'app/app';
import {AppErrorCode, AppErrorPayload, AppErrorCodesMap, AppErrorPayloadsMap} from 'lib/errors';

export type {AppErrorCode, AppErrorPayload};

export default class AppError {
  app: App;
  code = AppErrorCodesMap;
  payload = AppErrorPayloadsMap;

  constructor(app:App) {
    this.app = app;
  }

  get(code: AppErrorCode): AppErrorPayload {
    return this.payload[code];
  }
}
