import {URL2} from 'lib/url';
import App from 'app/app';

interface Parsed {
  body: any | false | null;
  slug: string | false | null;
}

export default class AppRequest {
  app: App;
  #url: URL2;
  #eventReq: Request;
  #parsed: Parsed;

  constructor(app: App, eventReq: Request) {
    this.app = app;
    this.#eventReq = eventReq;
    this.#url = new URL2(this.#eventReq.url);

    this.#parsed = {
      body: false,
      slug: false,
    };
  }

  getEventReq() : Request {
    return this.#eventReq;
  }

  getHostname() {
    return this.#url.getHostname();
  }

  getPathname() {
    return this.#url.getPathname();
  }

  getMethod() {
    return this.#eventReq.method;
  };

  getHeader(name: string) {
    return this.#eventReq.headers.get(name);
  }

  getUserIP() {
    return this.getHeader('CF-Connecting-IP');
  }

  /**
   * Parses, caches and returns the body of the request.
   * If body does not exist, returns null.
   */
  async getBody() {
    let parsedBody = this.#parsed.body;

    // Parse if not parsed yet.
    if (parsedBody === false) {
      parsedBody = null;

      try {
        parsedBody = await this.#eventReq.json();
      } catch (e) {}
      
      this.#parsed.body = parsedBody;
    }

    return parsedBody;
  }

  /**
   * Parses, caches and returns slug from the request path.
   * If slug does not exist, returns null.
   */
  getSlug() {
    let parsedSlug = this.#parsed.slug;

    // Parse if not parsed yet.
    if (parsedSlug === false) {
      parsedSlug = null;

      try {
        const pathSegments = this.#url.getPathSegments();

        if (pathSegments.length === 1) {
          const slug = pathSegments[0];
          
          if (this.app.isSlugValidAndAllowed(slug)) {
            parsedSlug = slug;
          }
        }
      } catch (e) {}
      
      this.#parsed.slug = parsedSlug;
    }

    return parsedSlug;
  }

  hasSlug() {
    return !!this.getSlug();
  }
}
