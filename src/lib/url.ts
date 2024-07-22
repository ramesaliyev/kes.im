export class URL2 {
  #url: URL;
  
  constructor(urlString:string) {
    this.#url = new URL(urlString);
  }

  getHostname() {
    return this.#url.hostname;
  }

  getPathname() {
    return this.#url.pathname;
  }

  getPathSegments() {
    return this.getPathname().split("/").slice(1);
  }
}
