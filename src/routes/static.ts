import App from 'app/app';
import AppRoute from 'app/route';

export default class StaticRoute extends AppRoute {
  cacheable = true;
  constructor(app:App) {
    super(app);

    // Set cache control age.
    this.cacheControlAge = app.env.CFG_DEFAULT_STATIC_CACHE_AGE;
    this.cacheControlAgeMode = 'default';
  }

  async serve() {
    const {kvam, req, log, res} = this.app;

    try {
      // Attempt to get the asset from KV.
      const asset = await kvam.getAssetFromKV(req.getEventReq());

      // Serve the asset.
      if (asset) {
        return res.asset(asset);
      }

      // If asset does not exist, throw an error.
      throw new Error('Asset not found. ' + req.getPathname());

    // Error handling.
    } catch (e) {
      // Log the error.
      log.error('Error while serving static request.', e);

      // Serve 404 page.
      try {
        return this.serve404();
      } catch (e) {
        log.error('Error while serving static 404.', e);
      }

      // Serve unknown error.
      return this.serve500();
    }
  }

  async serveErrorPage(errorCode:number) {
    const {kvam, req, res, err} = this.app;

    const eventReq = req.getEventReq();
    const errorPage = await kvam.getAssetFromKV(eventReq, _req => {
      const url = new URL(_req.url);
      url.pathname = `/${errorCode}.html`;
      return new Request(url.toString(), _req);
    });

    if (errorPage) {
      return res.asset(errorPage, errorCode);
    }

    return res.error(err.code.UNKNOWN);
  }

  async serve404() {
    return this.serveErrorPage(404);
  }

  async serve500() {
    return this.serveErrorPage(500);
  }
}
