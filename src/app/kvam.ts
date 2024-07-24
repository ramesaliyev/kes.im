import {
  mapRequestToAsset,
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
  Options as GetAssetFromKVOptions,
} from "@cloudflare/kv-asset-handler";

import manifestJSON from "__STATIC_CONTENT_MANIFEST";
const ASSET_MANIFEST = JSON.parse(manifestJSON);

import App from "app/app";

type RequestMapper = typeof mapRequestToAsset;

export default class AppKVAssetManager {
  app: App;

  constructor(app:App) {
    this.app = app;
  }

  async getAssetFromKV(rawRequest: Request, reMapRequestToAsset?:RequestMapper): Promise<Response|null> {
    const {env, ctx} = this.app;

    const event = {
      request: rawRequest,
      waitUntil(promise: Promise<any>) {
        return ctx.waitUntil(promise);
      },
    };
    
    const options: Partial<GetAssetFromKVOptions> = {
      cacheControl: {
        browserTTL: env.CF_STATIC_ASSET_TTL, // cache control header returned to browser
        edgeTTL: env.CF_STATIC_ASSET_TTL, // cache time on Cloudflare's edge
        bypassCache: false, // do not bypass Cloudflare's cache
      },
      ASSET_NAMESPACE: env.__STATIC_CONTENT,
      ASSET_MANIFEST: ASSET_MANIFEST,
    };

    if (reMapRequestToAsset) {
      options.mapRequestToAsset = _req => {
        const newRequest = reMapRequestToAsset(_req);
        return mapRequestToAsset(newRequest);
      };
    }

    try {
      return await getAssetFromKV(event, options);
    } catch (e) {
      if (e instanceof NotFoundError) {
      } else if (e instanceof MethodNotAllowedError) {
      } else {
      }
    }
  
    return null;
  }
}
