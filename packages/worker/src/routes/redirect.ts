import App from 'app/app';
import AppRoute from 'app/route';
import StaticRoute from 'routes/static';

export default class RedirectRoute extends AppRoute {
  cacheable = true;

  async serve() {
    const {req, res, env, model} = this.app;

    const slug = req.getSlug() as string;
    const url = await model.fetchUrlBySlug(slug);

    // Redirect if URL is found.
    if (url) {
      return res.redirect(url, {
        status: 301,
        headers: {
          'Cache-Control': `public, immutable, max-age=${env.CFG_REDIRECT_CACHE_AGE}`,
          'X-Robots-Tag': 'noindex',
        },
      });
    }

    // Serve 404 if URL is not found.
    return new StaticRoute(this.app).serve404();
  }
}
