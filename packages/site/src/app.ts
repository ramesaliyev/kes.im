
import {
  isSlugValidAndAllowed,
  isURLValidAndAllowed
} from '@lib/verify';

import {
  AppErrorPayload,
  AppErrorCodesMap as AppErrorCodes,
  AppErrorPayloadsMap as AppErrorPayloads,
} from '@lib/errors';

import AppUI from './ui';

class App {
  #ui = new AppUI();
  #token:string|null = null;

  constructor() {
    // Bind the event listeners.
    this.#ui.onShortenLinkRequest(
      this.#onShortenLinkRequest.bind(this)
    );
  }

  // Proxy
  onCopyButtonClick(event:MouseEvent, slug:string) {
    this.#ui.onCopyButtonClick(event, slug);
  }

  async #onShortenLinkRequest() {
    // Clicking much?
    if (this.#ui.isShorteningInProgress()) {
      return;
    }

    // Mark the UI as in progress.
    this.#ui.setShorteningInProgress();

    // Reset errors.
    this.#ui.clearErrors();

    // Check if token is valid.
    const token = this.#getToken();
    if (!token) {
      this.#ui.showError(AppErrorPayloads[AppErrorCodes.BAD_CAPTCHA]);
      this.#ui.unsetShorteningInProgress();
      return;
    }

    // Get input values.
    const url = this.#ui.getURLInputValue();
    const slug = this.#ui.getSlugInputValue();

    // Validate the URL.
    if (!isURLValidAndAllowed(url, env.CFG_MIN_URL_LENGTH, env.CFG_MAX_URL_LENGTH)) {
      this.#ui.showError(AppErrorPayloads[AppErrorCodes.BAD_URL]);
      this.#ui.unsetShorteningInProgress();
      return;
    }

    // Validate the slug.
    if (slug && !isSlugValidAndAllowed(slug, env.CFG_MIN_SLUG_LENGTH, env.CFG_MAX_SLUG_LENGTH)) {
      this.#ui.showError(AppErrorPayloads[AppErrorCodes.BAD_SLUG]);
      this.#ui.unsetShorteningInProgress();
      return;
    }

    // Shorten the link.
    try {
      const savedSlug = await this.#shortenLink(url, slug, token);
      this.#ui.insertResultItem(url, savedSlug);
      this.#ui.clearInputs();
    } catch (appErrorPayload) {
      this.#ui.showError(appErrorPayload as AppErrorPayload);
    } finally {
      this.#ui.unsetShorteningInProgress();
    }

    // Reset the token.
    this.#resetToken();
  }

  async #shortenLink(url:string, slug:string, token:string) {
    // Craft fetch options.
    const fetchEndpoint = `${env.CFG_SITE_API_ORIGIN}/shorten`;
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url, slug, token}),
    };

    // Call the API.
    const response = await fetch(fetchEndpoint, fetchOptions);

    // Parse the response.
    const data = await response.json();

    // Handle errors.
    if (response.status !== 200) {
      // Default, unknown error.
      let appErrorPayload = AppErrorPayloads[AppErrorCodes.UNKNOWN];

      // If there is a message in the response, use it.
      if (data && data.message) {
        appErrorPayload = data;
      }

      // Throw the error.
      throw appErrorPayload;
    }

    // If everything ok, return the slug.
    return data.slug;
  }

  setLanguage(lang:string) {
    this.#ui.setLanguage(lang);
  }

  /**
   * Turnstile integration.
   */
  #getToken() {
    if (turnstile.isExpired()) {
      this.#resetToken();
      return null;
    }

    return this.#token;
  }

  #resetToken() {
    this.#token = null;
    turnstile.reset();
  }

  onTokenSuccess(token:string) {
    this.#token = token;
  }

  onTokenExpired() {
    this.#token = null;
  }
}

// Register the app.
const app = (window as any).app = new App();

// Turnstile callbacks.
(window as any).onTokenSuccess = app.onTokenSuccess.bind(app);
(window as any).onTokenExpired = app.onTokenExpired.bind(app);
