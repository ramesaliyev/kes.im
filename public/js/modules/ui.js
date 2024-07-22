import {ENV} from './env.js';

/**
 * AppUI class.
 */
export default class AppUI {
  #origin = ENV.CFG_SITE_ORIGIN;

  #shorteningInProgress = false;

  #DOM = {
    body: document.body,
    resultList: document.getElementById('results'),
    cutButton: document.getElementById('cutButton'),
    urlInput: document.getElementById('urlInput'),
    slugInput: document.getElementById('slugInput'),
  };

  constructor() {
    // Set slug input placeholder and limits.
    const minSlugLen = ENV.CFG_MIN_SLUG_LENGTH;
    const maxSlugLen = ENV.CFG_MAX_SLUG_LENGTH;
    this.#DOM.slugInput.placeholder = `(optional) your very special keyword, only a-z, A-Z, 0-9, and - or _ (can't start or end with _ or -), min ${minSlugLen} max ${maxSlugLen} characters`;;
    this.#DOM.slugInput.minLength = minSlugLen;
    this.#DOM.slugInput.maxLength = maxSlugLen;

    // Set URL input placeholder and limits.
    const minURLLen = ENV.CFG_MIN_URL_LENGTH;
    const maxURLLen = ENV.CFG_MAX_URL_LENGTH;
    this.#DOM.urlInput.minLength = minURLLen;
    this.#DOM.urlInput.maxLength = maxURLLen;
  }

  onShortenLinkRequest(handlerFn) {
    // Clicking the cut button should trigger the handler.
    this.#DOM.cutButton.addEventListener('click', handlerFn);

    // Pressing enter on the URL input should trigger the handler.
    this.#DOM.urlInput.addEventListener('keyup',
      ({key}) => key === "Enter" && handlerFn());

    // Pressing enter on the Slug input should trigger the handler.
    this.#DOM.slugInput.addEventListener('keyup',
      ({key}) => key === "Enter" && handlerFn());
  }

  #getQRCodeURL(slugHref) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${slugHref}`;
  }

  /**
   * Shortening in progress.
   */
  #setShorteningInProgressStatus(status) {
    const method = status ? 'add' : 'remove';
    this.#DOM.body.classList[method]('in-progress');
    this.#shorteningInProgress = status;
  }

  isShorteningInProgress() {
    return this.#shorteningInProgress;
  }

  setShorteningInProgress() {
    this.#setShorteningInProgressStatus(true);
  }

  unsetShorteningInProgress() {
    this.#setShorteningInProgressStatus(false);
  }

  /**
   * Error management.
   */
  showError(appErrorPayload) {
    this.#DOM.resultList.insertAdjacentHTML('afterbegin', `
      <li class="result-item result-error">Error: ${appErrorPayload.message}</li>
    `);
  }
  
  clearErrors() {
    this.#DOM.resultList.querySelectorAll('.result-error')
      .forEach(el => this.#DOM.resultList.removeChild(el));
  }

  /**
   * Copy button.
   */
  onCopyButtonClick(event, slug) {
    // Copy to clipboard.
    navigator.clipboard.writeText(`${this.#origin}/${slug}`);
    
    const buttonSelector = '.copy-button';
    const activeClass = 'copied';

    // Clear all other buttons.
    document.querySelectorAll(buttonSelector)
      .forEach(button => {
        button.classList.remove(activeClass);
        button.innerText = 'Copy URL';
      });
      
    // Mark the current button as copied.
    event.target.classList.add(activeClass);
    event.target.innerText = 'Copied';
  }

  /**
   * Cut string util.
   */
  shortenString(str, maxLen) {
    if (str.length <= maxLen) {
      return str;
    }
    const halfMaxLen = (maxLen - 3) / 2;
    return `${str.substr(0, halfMaxLen)}...${str.substr(-halfMaxLen)}`;
  }

  /**
   * Create and insert a new result item.
   */
  insertResultItem(url, slug) {
    const maxHrefTextLen = 40;
    const slugHref = `${this.#origin}/${slug}`;
    const slugText = `${this.#origin}/${this.shortenString(slug, maxHrefTextLen)}`;
    const urlText = this.shortenString(url, maxHrefTextLen);

    this.#DOM.resultList.insertAdjacentHTML('afterbegin', `
      <li class="result-item">
        <a target="_blank" rel="nofollow" href="${slugHref}">
          ${slugText}
        </a>
        <div class="original-url">
          ${urlText}
        </div>
        <button class="copy-button" onclick="window.app.onCopyButtonClick(event, '${slug}')">
          Copy URL
        </button>
        <img class="qr-code" alt="QR Code" loading="lazy"
          src="${this.#getQRCodeURL(slugHref)}"
        />
      </li>
    `);
  }

  /**
   * Inputs
   */
  getURLInputValue() {
    return this.#DOM.urlInput.value.trim();
  }

  getSlugInputValue() {
    return this.#DOM.slugInput.value.trim();
  }

  clearInputs() {
    this.#DOM.urlInput.value = '';
    this.#DOM.slugInput.value = '';
  }
}
