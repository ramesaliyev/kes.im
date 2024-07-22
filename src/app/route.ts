import App from './app';

export default abstract class AppRoute {
  app: App;
  cacheable = false;
  cacheControlAge: number | null = null;

  constructor(app:App) {
    this.app = app;
  }

  abstract serve(): Promise<Response>;

  async serve404() {
    return this.app.res.error404();
  }

  async serve500() {
    return this.app.res.error500();
  }

  async fetch() {
    // If not cacheable, serve immediately.
    if (!this.cacheable) {
      return this.serve();
    }

    // Otherwise, try to serve from cache.
    // If not found, serve and cache.

    const {req, env, ctx} = this.app;
    const cache = caches.default;
    const eventReq = req.getEventReq();

    // Try to retrieve from cache.
    const cached = await cache.match(eventReq);
    if (cached) {
      return cached;
    }

    // Fetch the resource.
    const response = await this.serve();
    const {status} = response;

    // Cache if response is successful.
    if (status in [200, 301, 302]) {
      // Set cache headers if not already set.
      if (!response.headers.has('Cache-Control')) {
        // Set cache age.
        const age = this.cacheControlAge || env.CFG_DEFAULT_CACHE_AGE;
        response.headers.append('Cache-Control', `max-age=${age}`);
      }

      // Keep worker running until the cache is updated.
      // Worker will respond immediately with the response.
      ctx.waitUntil(cache.put(eventReq, response.clone()));
    }

    return response;
  }
}
