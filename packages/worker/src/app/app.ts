import {isURLValidAndAllowed, isSlugValidAndAllowed} from '@lib/verify';

import AppRequest from 'app/request';
import AppResponse from 'app/response';
import AppLogger from 'app/logger';
import AppKVAssetManager from 'app/kvam';
import AppError from 'app/error';
import AppRouter from 'app/router';
import AppModel from 'app/model';

type KVMap = {
  [key: string]: KVNamespace;
};

type D1Map = {
  [key: string]: D1Database;
};

type LimiterMap = {
  [key: string]: RateLimit;
};

export default class App {
  router: AppRouter;
  req: AppRequest;
  res: AppResponse;
  log: AppLogger;
  kvam: AppKVAssetManager;
  err: AppError;
  model: AppModel;
  env: Env;
  ctx: ExecutionContext;
  kv: KVMap;
  d1: D1Map;
  limiter: LimiterMap;

  constructor(eventReq:Request, env:Env, ctx:ExecutionContext) {
    this.env = env;
    this.ctx = ctx;

    this.kv = {
      links: this.env.KV_LINKS,
    }

    this.d1 = {
      links: this.env.D1_LINKS,
    }

    this.limiter = {
      api: this.env.API_RATE_LIMITER as RateLimit,
    }

    this.req = new AppRequest(this, eventReq);
    this.res = new AppResponse(this);
    this.log = new AppLogger(this);
    this.kvam = new AppKVAssetManager(this);
    this.err = new AppError(this);
    this.router = new AppRouter(this);
    this.model = new AppModel(this);
  }

  isDebugMode() {
    return this.env.DEBUG_MODE;
  }

  isURLValidAndAllowed(url:string): boolean {
    return isURLValidAndAllowed(url,
      this.env.CFG_MIN_URL_LENGTH,
      this.env.CFG_MAX_URL_LENGTH
    );
  }

  isSlugValidAndAllowed(slug:string): boolean {
    return isSlugValidAndAllowed(slug,
      this.env.CFG_MIN_SLUG_LENGTH,
      this.env.CFG_MAX_SLUG_LENGTH
    );
  }
}
