import {getCORSHeaders} from './cors';
import {toBase62, alphabet} from './base62';
import {validateToken} from './security';
const {pow, random, floor} = Math;

const extendedAlphabet = [...alphabet, '\\-', '\\_'].join('');
export const slugRegex = new RegExp(`(?!.*(-|_)$)(?!^(-|_).*)^[${extendedAlphabet}]{3,}$`, 'i');
const URLRegex = /^(https?:\/\/[^\s\.]+\.[^\s]{2,})/i;

const ErrorCodes = {
  BAD_REQ: {code: 'BAD_REQ', message: 'Bad Request.'},
  BAD_URL: {code: 'BAD_URL', message: 'Provided URL is not a valid one.'},
  BAD_SLUG: {code: 'BAD_SLUG', message: 'Slug is not in correct format.'},
  BAD_CAPTCHA: {code: 'BAD_CAPTCHA', message: 'Captcha/Security check is not passed.'},
  SLUG_NA: {code: 'SLUG_NA', message: 'Slug already in use.'},
  NO_RECURSIVE: {code: 'NO_RECURSIVE', message: 'No recursive shortening.'},
};

export default event => {
  return event.respondWith(api(event));
};

function api(event) {
  const {method} = event.request;
  const {pathname} = new URL(event.request.url);

  if (method === 'OPTIONS') {
    return respond(event, null);
  }

  if (pathname === '/shorten' && method === 'POST') {
    return shortenLink(event);
  }

  if (pathname === '/reveal' && method === 'POST') {
    return getOriginalLink(event);
  }

  return respond(event, {hello: `Whatcha doin'?`});
}

async function shortenLink(event) {
  let body;
  try {
    body = await event.request.json();
  } catch (e) {
    return respond(event, event, ErrorCodes.BAD_REQ, 400);
  }

  const {url, slug, token} = body;

  // Security check.
  if (!await validateToken(token, event)) {
    return respond(event, ErrorCodes.BAD_CAPTCHA, 400);
  }

  // Url has to be valid url.
  if (!URLRegex.test(url)) {
    return respond(event, ErrorCodes.BAD_URL, 400);
  }

  // Extra security.
  try {
    const parsedURL = new URL(url);

    // No recursive business.
    if (parsedURL.hostname.endsWith('kes.im')) {
      return respond(event, ErrorCodes.NO_RECURSIVE, 400);
    }
  } catch (e) {
    return respond(event, ErrorCodes.BAD_URL, 400);
  }

  // Slug has to be in base62 + _ + -, if provided.
  // Slug cannot start or end with -, _
  if (slug && !slugRegex.test(slug)) {
    return respond(event, ErrorCodes.BAD_SLUG, 400);
  }

  // Generate short link if slug not provided.
  const shortLink = slug || toBase62(floor(random() * pow(62, 5)));

  // Is short link exist?
  const isShortLinkInUse = await kesim_data.get(shortLink);

  if (isShortLinkInUse) {
    if (slug) {
      return respond(event, ErrorCodes.SLUG_NA, 400);
    }

    // Try again.
    return shortenLink(event);
  }

  // Everyting is ok.
  await kesim_data.put(shortLink, url);

  return respond(event, {shortLink});
}

async function getOriginalLink(event) {
  let body;
  try {
    body = await event.request.json();
  } catch (e) {
    return respond(event, ErrorCodes.BAD_REQ, 400);
  }

  const {slug} = body;

  return respond(event, {
    url: await kesim_data.get(slug),
  });
}

function respond(event, data = {}, status = 200, headers = {}) {
  headers = {...getCORSHeaders(event), ...headers};
  return new Response(JSON.stringify(data), {status, headers});
}
