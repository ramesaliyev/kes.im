import Base62 from '@lib/base62';

import App from 'app/app';
import AppDatabase from 'app/database';
import {AppErrorCode} from 'app/error';

export default class AppModel {
  app: App;
  #db;

  constructor(app:App) {
    this.app = app;
    this.#db = new AppDatabase(this.app);
  }

  /**
   * Insert link if slug and URL are valid.
   */
  async createLinkEntry(url:string, slug:string|null = null): Promise<string> {
    const errCodes = this.app.err.code;

    // Check if URL is valid.
    if (!this.app.isURLValidAndAllowed(url)) {
      throw errCodes.BAD_URL;
    }

    // If slug is provided.
    if (slug) {
      // Check if slug is valid.
      if (!this.app.isSlugValidAndAllowed(slug)) {
        throw errCodes.BAD_SLUG;
      }

      // Check if slug is already in use.
      if (await this.fetchUrlBySlug(slug)) {
        throw errCodes.SLUG_NA;
      }
    } else {
      // Generate random slug.
      slug = await this.generateAvailableRandomSlug();
    }

    // Check if URL is already shortened.
    const existingSlug = await this.fetchSlugByUrl(url);
    if (existingSlug) {
      return existingSlug;
    }

    // Insert the link.
    await this.#db.insertLink(slug, url);

    // Return the slug.
    return slug;
  }

  /**
   * Helper function to generate a random available slug.
   */
  async generateAvailableRandomSlug(): Promise<string> {
    const randomSlugLen = this.app.env.CFG_RANDOM_SLUG_LENGTH;

    // Generate random slug.
    const slug = Base62.random(randomSlugLen);

    // Verify slug.
    if (!this.app.isSlugValidAndAllowed(slug)) {
      return this.generateAvailableRandomSlug();
    }

    // Check if slug is already in use.
    if (await this.fetchUrlBySlug(slug)) {
      return this.generateAvailableRandomSlug();
    }

    // Slug is available.
    return slug;
  }

  /**
   * Fetch slug by URL.
   */
  async fetchSlugByUrl(url:string): Promise<string|null> {
    return await this.#db.getLinkByUrl(url, 'slug') as string | null;
  }

  /**
   *
   * This is where the migration happens.
   * We revalidate the slug and URL each time.
   * This is not only because of the migration,
   * but also because we want to keep the data clean,
   * and we're constantly under attack.
   * Btw, I'm keep saying "we" but it's just me.
   * I'm just trying to sound more professional.
   * OR maybe I'm schizophrenic. WHO KNOWS?!
   * Anyway. Let's get back to work.
   *
   */
  async fetchUrlBySlug(slug: string): Promise<string|null> {
    // Try to get from D1.
    let url = await this.#db.getLinkBySlug(slug, 'url') as string | null;

    // D1 has the URL, we're done.
    if (url) {
      return url;
    }

    // Next part handles migration from KV to D1.
    // If you're starting from scratch, you can remove this part.

    // Try to get from KV.
    url = await this.#db.kvLinksGet(slug);

    // KV does not have the URL.
    if (!url) {
      return null;
    }

    // If KV has the URL, first remove it.
    // Then check if we should insert to D1.
    await this.#db.kvLinksDelete(slug);

    // Check if D1 has URL with another slug.
    // If it does, we should not insert to D1 and return null.
    const existingSlugOnD1 = await this.fetchSlugByUrl(url);
    if (existingSlugOnD1) {
      return null;
    }

    // Otherwise, try to create entry on D1.
    // If it fails, return null.
    try {
      await this.createLinkEntry(url, slug);
    } catch (e) {
      this.app.log.info(`Failed to migrate ${slug}:${url} to D1: ${this.app.err.get(e as AppErrorCode).code}`);
      return null;
    }

    // Return the URL.
    return url;
  }
}
