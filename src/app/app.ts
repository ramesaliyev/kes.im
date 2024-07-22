import AppRequest from './request';
import AppResponse from './response';
import AppLogger from './logger';
import AppKVAssetManager from './kvam';
import AppErrors from './errors';
import AppRouter from './router';
import AppModel from './model';

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
	err: AppErrors;
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
			api: this.env.API_RATE_LIMITER,
		}

		this.req = new AppRequest(this, eventReq);
		this.res = new AppResponse(this);
		this.log = new AppLogger(this);
		this.kvam = new AppKVAssetManager(this);
		this.err = new AppErrors(this);
		this.router = new AppRouter(this);
		this.model = new AppModel(this);
	}

	isDebugMode() {
		return this.env.DEBUG_MODE;
	}
}
