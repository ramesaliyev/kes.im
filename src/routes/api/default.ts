import BuildMeta from 'gen/build';
import AppRoute from 'app/route';

export default class APIDefaultRoute extends AppRoute {
  cacheable = true;

  async serve() {
    return this.app.res.json({
      hello: `Whatcha doin'?`,
      build: BuildMeta,
    });
  }
}
