import App from 'app/app';
import AppRequest from 'app/request';
import AppRoute from 'app/route';

type AppRouteType = new (app: App) => AppRoute;

interface BaseRouteEntry<TType, TData = undefined> {
  type: TType;
  route: AppRouteType;
  data?: TData;
}

type RouteEntryMap = {
  hostname: {hostname: string};
  pathname: {pathname: string};
  condition: {flag: boolean};
  always: undefined;
};

type RouteEntry = {
  [Key in keyof RouteEntryMap]:
    BaseRouteEntry<Key, RouteEntryMap[Key]>;
}[keyof RouteEntryMap];

export default class AppRouter {
  app: App;
  #routes: RouteEntry[];

  constructor(app: App) {
    this.app = app;

    this.#routes = [];
  }

  #addRoute<TType extends keyof RouteEntryMap>(
    type:TType, route: AppRouteType, data?: RouteEntryMap[TType]
  ) {
    this.#routes.push({type, route, data} as RouteEntry);
  }

  onHostname(hostname:string, route: AppRouteType) {
    this.#addRoute('hostname', route, {hostname});
  }

  onPathname(pathname:string, route: AppRouteType) {
    this.#addRoute('pathname', route, {pathname});
  }

  onConditionMet(flag:boolean, route: AppRouteType) {
    this.#addRoute('condition', route, {flag});
  }

  onDefault(route: AppRouteType) {
    this.#addRoute('always', route);
  }

  #matchRoute(entry: RouteEntry, req: AppRequest): boolean {
    switch (entry.type) {
      case 'hostname':
        return req.getHostname() === (entry.data as RouteEntryMap['hostname']).hostname;
      case 'pathname':
        return req.getPathname() === (entry.data as RouteEntryMap['pathname']).pathname;
      case 'condition':
        return (entry.data as RouteEntryMap['condition']).flag;
      case 'always':
        return true;
      default:
        return false;
    }
  }

  async resolve() {
    const {req} = this.app;

    const entry = this.#routes.find(
      entry => this.#matchRoute(entry, req)
    );

    if (!entry) {
      return this.app.res.error404();
    }

    return new entry.route(this.app).fetch();
  }
}
