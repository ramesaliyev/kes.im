import App from "app/app";

export default class AppLogger {
  app: App;

  constructor(app:App) {
    this.app = app;
  }

  error(...args: any[]) {
    console.error('[ERROR] ', ...args);
  }

  info(...args: any[]) {
    if (this.app.isDebugMode()) {
      console.log('[INFO] ', ...args);
    }
  }
}
