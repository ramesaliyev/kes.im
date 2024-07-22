import APIRoute from './routes/api/api';
import RedirectRoute from './routes/redirect';
import StaticRoute from './routes/static';

import App from './app/app';

export default {
  async fetch(eventReq:Request, env:Env, ctx:ExecutionContext): Promise<Response> {
    const app = new App(eventReq, env, ctx);

    // Define routes. Order matters.
    app.router.onHostname(app.env.CFG_SITE_API_HOSTNAME, APIRoute);
    app.router.onConditionMet(app.req.hasSlug(), RedirectRoute);
    app.router.onDefault(StaticRoute);

    return app.router.resolve();
  }
} satisfies ExportedHandler<Env>;
