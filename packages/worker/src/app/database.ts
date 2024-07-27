import App from 'app/app';

type QueryMap = {
  [key: string]: string | D1PreparedStatement;
};

interface D1LinksEntry {
  url: string;
  slug: string;
  created_at: Date;
}

type D1LinksEntryKeys = keyof D1LinksEntry;
type D1LinksEntryValues = D1LinksEntry[D1LinksEntryKeys];

export default class AppDatabase {
  app: App;
  #KVLinks: KVNamespace;
  #D1Links: D1Database;
  #D1LinksQueries: QueryMap;

  constructor(app:App) {
    this.app = app;
    this.#KVLinks = this.app.kv.links;
    this.#D1Links = this.app.d1.links;

    this.#D1LinksQueries = {
      'getLinkByUrl': 'SELECT * FROM links WHERE url = ?1 LIMIT 1',
      'getLinkBySlug': 'SELECT * FROM links WHERE slug = ?1 LIMIT 1',
      'insertLink': 'INSERT INTO links (slug, url) VALUES (?1, ?2)',
      'deleteLinkBySlug': 'DELETE FROM links WHERE slug = ?1 LIMIT 1',
      'deleteLinkByUrl': 'DELETE FROM links WHERE url = ?1 LIMIT 1',
    };
  }

  /**
   * KV Links
   * We're doing a auto migration now,
   * This is why we have a KV and D1 methods.
   * You can remove KV part if you starting from scratch.
   */
  async kvLinksGet(key: string): Promise<string|null> {
    return this.#KVLinks.get(key, {
      cacheTtl: this.app.env.CF_KV_CACHE_TTL,
    });
  }

  async kvLinksPut(key:string, value:string): Promise<void> {
    return this.#KVLinks.put(key, value);
  }

  async kvLinksDelete(key:string):Promise<void> {
    return this.#KVLinks.delete(key);
  }

  /**
   * D1 Links
   */
  #query(key:string): D1PreparedStatement {
    let query = this.#D1LinksQueries[key];

    // Prepare query if type is string.
    if (typeof query === 'string') {
      query = this.#D1Links.prepare(query);
      this.#D1LinksQueries[key] = query;
    }

    return query;
  }

  async getLinkByUrl(url:string): Promise<D1LinksEntry | null>;
  async getLinkByUrl(url:string, col:D1LinksEntryKeys): Promise<D1LinksEntryValues | null>;
  async getLinkByUrl(url:string, col?:D1LinksEntryKeys): Promise<D1LinksEntry | D1LinksEntryValues | null> {
    const query = this.#query('getLinkByUrl').bind(url);
    return col ? query.first(col) : query.first();
  }

  async getLinkBySlug(slug:string): Promise<D1LinksEntry | null>;
  async getLinkBySlug(slug:string, col:D1LinksEntryKeys): Promise<D1LinksEntryValues | null>;
  async getLinkBySlug(slug:string, col?:D1LinksEntryKeys): Promise<D1LinksEntry | D1LinksEntryValues | null> {
    const query = this.#query('getLinkBySlug').bind(slug);
    return col ? query.first(col) : query.first();
  }

  async insertLink(slug:string, url:string): Promise<D1Response> {
    return this.#query('insertLink')
      .bind(slug, url)
      .run();
  }

  async deleteLinkBySlug(slug:string): Promise<D1Response> {
    return this.#query('deleteLinkBySlug')
      .bind(slug)
      .run();
  }

  async deleteLinkByUrl(url:string): Promise<D1Response> {
    return this.#query('deleteLinkByUrl')
      .bind(url)
      .run();
  }
}
