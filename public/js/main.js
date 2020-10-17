const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\\-\\_';
const slugRegex = new RegExp(`(?!.*(-|_)$)(?!^(-|_).*)^[${alphabet}]{3,}$`, 'i');
const URLRegex = /^(https?:\/\/[^\s\.]+\.[^\s]{2,})/i;

const ErrorCodes = {
  UNKNOWN: {code: 'UNKNOWN', message: 'Server in trouble, try later please.'},
  BAD_URL: {code: 'BAD_URL', message: 'Provided URL is not a valid one.'},
  BAD_SLUG: {code: 'BAD_SLUG', message: 'Slug is not in correct format.'},
  NO_RECURSIVE: {code: 'NO_RECURSIVE', message: 'No recursive shortening.'}
};

const body = document.body;
const resultList = document.getElementById('results');
const cutButton = document.getElementById('cutButton');
const urlInput = document.getElementById('urlInput');
const slugInput = document.getElementById('slugInput');

let _inProgress = false;
function inProgress(status) {
  if (typeof status === 'undefined') return _inProgress;
  _inProgress = status;
  body.classList[status ? 'add' : 'remove']('in-progress');
}

async function cut() {
  if (inProgress()) return;
  inProgress(true);

  const url = urlInput.value;
  const slug = slugInput.value;

  resetErrors();

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

  const response = await fetch('https://api.kes.im/shorten', {
    method: 'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({url, slug}),
  });

  const data = await response.json();

  if (response.status !== 200) {
    let error = ErrorCodes.UNKNOWN;

    if (response.status === 400 && data.code) {
      error = data;
    }

    inProgress(false);
    return showError(error);
  }

  resultList.insertAdjacentHTML('afterbegin', `
    <li class="result-item">
      <a target="_blank" rel="nofollow" href="https://kes.im/${data.shortLink}">
        https://kes.im/${cutString(data.shortLink, 40)}
      </a>
      <div class="original-url">${cutString(url, 40)}</div>
      <button class="copy-button">Copy URL</button>
    </li>
  `);

  inProgress(false);
}

function showError(error) {
  resultList.insertAdjacentHTML('afterbegin', `
    <li class="result-item result-error">Error: ${error.message}</li>
  `);
}

function resetErrors() {
  const elements = resultList.getElementsByClassName("result-error");

  while (elements[0]) {
    resultList.removeChild(elements[0]);
  }
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

cutButton.addEventListener('click', cut);