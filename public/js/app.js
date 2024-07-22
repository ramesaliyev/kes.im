
import {
  isSlugValidAndAllowed,
  isURLValidAndAllowed
} from './modules/verify.js';

import {
  AppErrorCodesMap as AppErrorCodes,
  AppErrorPayloadsMap as AppErrorPayloads,
} from './modules/errors.js';

import {ENV} from './modules/env.js';
import AppUI from './modules/ui.js';

class App {
  #ui = new AppUI();
  #token = null;

  constructor() {
    // Bind the event listeners.
    this.#ui.onShortenLinkRequest(
      this.#onShortenLinkRequest.bind(this)
    );
  }

  // Proxy
  onCopyButtonClick(event, slug) {
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
    if (!isURLValidAndAllowed(url, ENV.CFG_MIN_URL_LENGTH, ENV.CFG_MAX_URL_LENGTH)) {
      this.#ui.showError(AppErrorPayloads[AppErrorCodes.BAD_URL]);
      this.#ui.unsetShorteningInProgress();
      return;
    }

    // Validate the slug.
    if (slug && !isSlugValidAndAllowed(slug, ENV.CFG_MIN_SLUG_LENGTH, ENV.CFG_MAX_SLUG_LENGTH)) {
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
      this.#ui.showError(appErrorPayload);
    } finally {
      this.#ui.unsetShorteningInProgress();
    }

    // Reset the token.
    this.#resetToken();
  }

  async #shortenLink(url, slug, token) {
    // Craft fetch options.
    const fetchEndpoint = `${ENV.CFG_SITE_API_ORIGIN}/shorten`;
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

  onTokenSuccess(token) {
    this.#token = token;
  }
  
  onTokenExpired() {
    this.#token = null;
  }
}

// Register the app.
const app = window.app = new App();

// Turnstile callbacks.
window.onTokenSuccess = app.onTokenSuccess.bind(app);
window.onTokenExpired = app.onTokenExpired.bind(app);
