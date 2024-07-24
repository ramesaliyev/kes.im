
import App from 'app/app';
import {AppErrorCode, AppErrorPayload} from 'app/error';

type HeadersObject = Record<string, string>;

type ResponseOptions = {
  status?: number;
  statusText?: string;
  headers?: HeadersObject;
};

export default class AppResponse {
  app: App;
  CORS_DEFAULT_METHODS = 'GET, HEAD, POST, OPTIONS';
  CORS_DEFAULT_HEADERS = 'Content-Type';

  constructor(app: App) {
    this.app = app;
  }

  /**
   * Craft CORS headers based on request.
   */
  getCORSHeaders() {
    const {req, env} = this.app;

    const requestOrigin = req.getHeader('Origin') || '';
    const requestMethod = req.getHeader('Access-Control-Request-Method');
    const requestHeaders = req.getHeader('Access-Control-Request-Headers');

    const allowedOrigins = [
      env.CFG_SITE_ORIGIN as string,
    ];

    const allowedOrigin:string = allowedOrigins.includes(requestOrigin) ?
      requestOrigin : allowedOrigins[0];
  
    return {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': requestMethod || this.CORS_DEFAULT_METHODS,
      'Access-Control-Allow-Headers': requestHeaders || this.CORS_DEFAULT_HEADERS
    };
  }

  /**
   * Get security headers.
   */
  getSecurityHeaders() {
    return {
      'X-XSS-Protection': '1; mode=block',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'origin-when-cross-origin',
      'Feature-Policy': 'none',
    };
  }

  #setExtraHeaders(headers:Headers, extraHeaders:HeadersObject) {
    Object.entries(extraHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }	

  /**
   * Generic, Respond with a body, status, and headers.
   */
  #respond(status:number, body:any = '', options:ResponseInit={}) {
    // Create final options.
    options = {
      headers: options.headers || {},
      status: status || options.status || 200,
      statusText: options.statusText || 'OK',
    }

    // Create response.
    const response = new Response(body, options);

    // Set extra headers.
    this.#setExtraHeaders(response.headers, {
      ...this.getCORSHeaders(),
      ...this.getSecurityHeaders(),
    });

    return response;
  }

  /**
   * Asset response.
   */
  asset(asset:Response, status?:number) {
    return this.#respond(status || 200, asset.body, asset);
  }

  /**
   * Respond with success, status 200 by default.
   */
  ok(body?: any, options?:ResponseInit) {
    return this.#respond(200, body, options);
  }

  /**
   * Respond with JSON, status 200 by default.
   */
  json(body:any, options:ResponseOptions={}) {
    options.headers = {
      ...options.headers || {},
      'Content-Type': 'application/json',
    };

    // Stringify body if it's not a string.
    if (typeof body !== 'string') {
      body = JSON.stringify(body);
    }

    // Respond.
    return this.#respond(options.status || 200, body, options);
  }

  /**
   * Respond with an error, status 500 if not provided.
   */
  error(appErrorCode:AppErrorCode, status?:number, body?:any, options?:ResponseOptions) {
    // Get error data.
    const appErrorData:AppErrorPayload = this.app.err.get(appErrorCode);

    // Status fallback pipeline.
    body = body || appErrorData;

    // Recreate options.
    options = {
      status: status || options?.status || appErrorData.status || 500,
      statusText: appErrorData.code,
      headers: options?.headers || {},
    };

    return this.json(body, options);
  }

  error404(body?:any, options?:ResponseOptions) {
    return this.error(this.app.err.code.NOT_FOUND, 404, body, options);
  }

  error500(body?:any, options?:ResponseOptions) {
    return this.error(this.app.err.code.UNKNOWN, 500, body, options);
  }

  /**
   * Respond with redirection.
   */
  redirect(url:string, options:ResponseOptions) {
    const status = options?.status || 302;
    let redirect = Response.redirect(url, status);

    if (options) {
      // Redirect is immutable, so we need to create a new response.
      redirect = new Response(redirect.body, redirect);

      // Set headers.
      if (options.headers) {
        this.#setExtraHeaders(redirect.headers, options.headers);
      }
    }

    return redirect;
  }
}
