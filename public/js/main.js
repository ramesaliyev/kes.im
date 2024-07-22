/**
 * Regex patterns for verifying URL and slug.
 */
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\\-\\_';
const slugRegex = new RegExp(`(?!.*(-|_)$)(?!^(-|_).*)^[${alphabet}]{4,}$`, 'i');
const URLRegex = /^(https?:\/\/[^\s\.]+\.[^\s]{2,})/i;

/**
 * Frontend error codes.
 */
const ErrorCodes = {
  UNKNOWN: {code: 'UNKNOWN', message: 'Unknown internal error occurred, run!', status: 500},
  BAD_URL: {code: 'BAD_URL', message: 'Provided URL is not a valid one.'},
  BAD_SLUG: {code: 'BAD_SLUG', message: 'Slug is not in correct format.'},
  BAD_CAPTCHA: {code: 'BAD_CAPTCHA', message: 'Captcha/Security check is not passed.'},
  SLUG_NA: {code: 'SLUG_NA', message: 'Slug already in use.'},
  NO_RECURSIVE: {code: 'NO_RECURSIVE', message: 'No recursive shortening.'},
  BAD_HOSTNAME: {code: 'BAD_HOSTNAME', message: 'Provided domain is not allowed to be shortened.'},
};

/**
 * DOM elements.
 */
const body = document.body;
const resultList = document.getElementById('results');
const cutButton = document.getElementById('cutButton');
const urlInput = document.getElementById('urlInput');
const slugInput = document.getElementById('slugInput');

/**
 * UI/DOM/APP helpers.
 */
let _inProgress = false;
function inProgress(status) {
  if (typeof status === 'undefined') return _inProgress;
  _inProgress = status;
  body.classList[status ? 'add' : 'remove']('in-progress');
}

function showError(error) {
  resultList.insertAdjacentHTML('afterbegin', `
    <li class="result-item result-error">Error: ${error.message}</li>
  `);
}

function resetErrors() {
  resultList.querySelectorAll('.result-error').forEach(element => {
    resultList.removeChild(element);
  });
}

function copy(event, shortLink) {
  navigator.clipboard.writeText(`https://kes.im/${shortLink}`);

  document.querySelectorAll('.copy-button').forEach(button => {
    button.classList.remove('copied');
    button.innerText = 'Copy';
  });

  event.target.classList.add('copied');
  event.target.innerText = 'Copied';
}

/**
 * Main function to cut the URL.
 */
async function shortenLink() {
  if (inProgress()) return;
  inProgress(true);

  const url = urlInput.value;
  const slug = slugInput.value;

  resetErrors();

  let securityError;
  if (securityError = hasSecurityError()) {
    inProgress(false);
    return showError(securityError);
  }

  let urlError;
  if (urlError = isURLHasError(url)) {
    inProgress(false);
    return showError(urlError);
  }

  let slugError;
  if (slug && (slugError = isSlugGHasError(slug))) {
    inProgress(false);
    return showError(slugError);
  }

  turnstileReset();

  const response = await fetch('https://api.kes.im/shorten', {
    method: 'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({url, slug, token: TURNSTILE_TOKEN}),
  });

  const data = await response.json();

  if (response.status !== 200) {
    let error = ErrorCodes.UNKNOWN;

    if (data && data.message) {
      error = data;
    }

    inProgress(false);
    return showError(error);
  }

  const completeURL = `https://kes.im/${data.slug}`;

  resultList.insertAdjacentHTML('afterbegin', `
    <li class="result-item">
      <a target="_blank" rel="nofollow" href="${completeURL}">
        https://kes.im/${cutString(data.slug, 40)}
      </a>
      <div class="original-url">${cutString(url, 40)}</div>
      <button class="copy-button" onclick="copy(event, '${data.slug}')">Copy URL</button>
      <img 
        class="qr-code"
        alt="QR Code"
        loading="lazy"
        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${completeURL}"
      />
    </li>
  `);

  urlInput.value = '';
  slugInput.value = '';

  inProgress(false);
}



function isURLHasError(url) {
  // Url has to be valid url.
  if (!URLRegex.test(url)) {
    return ErrorCodes.BAD_URL;
  }

  // Extra security.
  try {
    const parsedURL = new URL(url);

    // No recursive business.
    if (parsedURL.hostname.endsWith('kes.im')) {
      return ErrorCodes.NO_RECURSIVE;
    }

    // No banned domains.
    // const isDomainBanned = BANNED_DOMAINS.some(domain => parsedURL.hostname.endsWith(domain));
    // if (isDomainBanned) {
    //   return ErrorCodes.BAD_HOSTNAME;
    // }
  } catch (e) {
    return ErrorCodes.BAD_URL;
  }
}

function isSlugGHasError(slug) {
  if (!slugRegex.test(slug)) {
    return ErrorCodes.BAD_SLUG;
  }
}

function cutString(string, maxLength) {
  if (string.length <= maxLength) return string;
  const maxHalfLength = (maxLength - 3) / 2;
  return `${string.substr(0, maxHalfLength)}...${string.substr(-maxHalfLength)}`;
}



/**
 * Turnstile integration
 */
TURNSTILE_TOKEN = null;

function turnstileOnSuccess(token) {
  console.log('Turnstile success.', token);
  TURNSTILE_TOKEN = token;
}

function turnstileOnExpired() {
  console.log('Turnstile expired.');
  TURNSTILE_TOKEN = null;
}

function turnstileReset() {
  turnstile.reset();
}

function hasSecurityError() {
  let hasError = true;

  if (turnstile.isExpired()) {
    turnstile.reset();
  } else {
    TURNSTILE_TOKEN = turnstile.getResponse();
    hasError = false;
  }

  if (hasError) {
    return ErrorCodes.BAD_CAPTCHA;
  }
}

/**
 * Event listeners.
 */
cutButton.addEventListener('click', shortenLink);
