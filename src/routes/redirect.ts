import App from '../app/app';
import AppRoute from '../app/route';
import StaticRoute from './static';

export default class RedirectRoute extends AppRoute {
	cacheable = true;

  constructor(app:App) {
    super(app);

    // Set cache control age.
    this.cacheControlAge = app.env.CFG_REDIRECT_CACHE_AGE;
  }

  async serve() {
    const {req, res, model} = this.app;

    const slug = req.getSlug() as string;
    const url = await model.fetchUrlBySlug(slug);

    // Redirect if URL is found.
    if (url) {
      return res.redirect(url, {
        status: 301,
        headers: {
          'Cache-Control': `max-age=${this.cacheControlAge}`,
          'X-Robots-Tag': 'noindex',
        },
      });
    }

    // Serve 404 if URL is not found.
    return new StaticRoute(this.app).serve404();
  }
}
