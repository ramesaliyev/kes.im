import BuildMeta from '@gen/build';
import {AppErrorPayload} from '@lib/errors';

/**
 * AppUI class.
 */
export default class AppUI {
  #origin: string;

  #shorteningInProgress = false;

  #DOM = {
    body: document.body,
    logo: document.getElementById('logo') as HTMLImageElement,
    resultList: document.getElementById('results') as HTMLUListElement,
    cutButton: document.getElementById('cutButton') as HTMLButtonElement,
    urlInput: document.getElementById('urlInput') as HTMLInputElement,
    slugInput: document.getElementById('slugInput') as HTMLInputElement,
    buildInfo: document.getElementById('buildInfo') as HTMLDivElement,
  };

  constructor() {
    // Set the origin.
    this.#origin = env.CFG_SITE_ORIGIN;;

    // Set slug input placeholder and limits.
    const minSlugLen = env.CFG_MIN_SLUG_LENGTH;
    const maxSlugLen = env.CFG_MAX_SLUG_LENGTH;
    this.#DOM.slugInput.placeholder = `(optional) your very special keyword, only a-z, A-Z, 0-9, and - or _ (can't start or end with _ or -), min ${minSlugLen} max ${maxSlugLen} characters`;;
    this.#DOM.slugInput.minLength = minSlugLen;
    this.#DOM.slugInput.maxLength = maxSlugLen;

    // Set URL input placeholder and limits.
    const minURLLen = env.CFG_MIN_URL_LENGTH;
    const maxURLLen = env.CFG_MAX_URL_LENGTH;
    this.#DOM.urlInput.minLength = minURLLen;
    this.#DOM.urlInput.maxLength = maxURLLen;

    // Set the build meta.
    const runId = BuildMeta.run.split('-')[0];
    const build = BuildMeta.build;
    this.#DOM.buildInfo.innerHTML = `<a rel="nofollow" target="_blank" href="https://github.com/ramesaliyev/kes.im/actions/runs/${runId}">
      v${BuildMeta.version}.${build}
    </a>`;

  }

  onShortenLinkRequest(handlerFn: () => void) {
    // Clicking the cut button should trigger the handler.
    this.#DOM.cutButton.addEventListener('click', handlerFn);

    // Pressing enter on the URL input should trigger the handler.
    this.#DOM.urlInput.addEventListener('keyup',
      ({key}) => key === "Enter" && handlerFn());

    // Pressing enter on the Slug input should trigger the handler.
    this.#DOM.slugInput.addEventListener('keyup',
      ({key}) => key === "Enter" && handlerFn());
  }

  #getQRCodeURL(slugHref: string) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${slugHref}`;
  }

  /**
   * Shortening in progress.
   */
  #setShorteningInProgressStatus(status: boolean) {
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
  showError(appErrorPayload: AppErrorPayload) {
    this.#DOM.resultList.insertAdjacentHTML('afterbegin', `
      <li class="result-item result-error">${appErrorPayload.message}</li>
    `);
  }

  clearErrors() {
    this.#DOM.resultList.querySelectorAll('.result-error')
      .forEach(el => this.#DOM.resultList.removeChild(el));
  }

  /**
   * Copy button.
   */
  onCopyButtonClick(event: MouseEvent, slug: string) {
    // Copy to clipboard.
    navigator.clipboard.writeText(`${this.#origin}/${slug}`);

    const buttonSelector = '.copy-button';
    const activeClass = 'copied';

    // Clear all other buttons.
    document.querySelectorAll(buttonSelector)
      .forEach(el => {
        const button = el as HTMLButtonElement;
        button.classList.remove(activeClass);
        button.innerText = 'Copy URL';
      });

    // Mark the current button as copied.
    const target = event.target as HTMLButtonElement;
    target.classList.add(activeClass);
    target.innerText = 'Copied';
  }

  /**
   * Cut string util.
   */
  shortenString(str: string, maxLen: number) {
    if (str.length <= maxLen) {
      return str;
    }
    const halfMaxLen = (maxLen - 3) / 2;
    return `${str.substr(0, halfMaxLen)}...${str.substr(-halfMaxLen)}`;
  }

  /**
   * Create and insert a new result item.
   */
  insertResultItem(url: string, slug: string) {
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

  /**
   * Language
   */
  setLanguage(lang: string) {
    lang = lang.toLocaleLowerCase();
    lang = lang === 'tr' ? 'tr' : 'en';

    document.documentElement.lang = lang;
    this.#DOM.body.classList.remove('lang-en', 'lang-tr');
    this.#DOM.body.classList.add(`lang-${lang}`);
    this.#DOM.logo.src = `/img/logo_${lang}.svg`;

    console.log('Language set to:', lang);
  }
}
