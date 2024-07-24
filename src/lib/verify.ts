import banned from 'lib/banned';
import Base62 from 'lib/base62';
import {URL2} from 'lib/url';

// Patterns
const extendedAlphabet = [...Base62.alphabet, '\\-', '\\_'].join('');
const slugPattern = new RegExp(`(?!.*(-|_)$)(?!^(-|_).*)^[${extendedAlphabet}]{1,}$`, 'i');
const URLPattern = /^(https?:\/\/[^\s\.]+\.[^\s]{2,})/i;

/**
 * Verify if a string is valid and allowed slug.
 */
export function isSlugValidAndAllowed(slug:string, minLen:number, maxLen:number): boolean {
  // Check slug length.
  if (slug.length < minLen || slug.length > maxLen) {
    return false;
  }

  // Check if slug is... slug.
  if (!slugPattern.test(slug)) {
    return false;
  }

  // Check if slug is banned. A banned slug is no slug.
  if (banned.SLUGS.includes(slug.toLowerCase())) {
    return false;
  }

  // Okay, you won this time.
  return true;
}

/**
 * Verify a string is a valid allowed URL.
 */
export function isURLValidAndAllowed(url:string, minLen:number, maxLen:number): boolean {
  // Check URL length.
  if (url.length < minLen || url.length > maxLen) {
    return false;
  }

  // Check if URL is... URL.
  let parsedURL;
  try {
    parsedURL = new URL2(url);
  } catch (e) {
    return false;
  }

  if(!URLPattern.test(url)) {
    return false;
  }

  // Check if hostname is banned.
  const hostname = parsedURL.getHostname().toLowerCase();
  if (banned.HOSTNAMES.includes(hostname)) {
    return false;
  }

  // Check if url includes banned keywords.
  const lowerCaseUrl = url.toLowerCase();
  if (banned.URL_KEYWORDS.some(suffix => lowerCaseUrl.indexOf(suffix) !== -1)) {
    return false;
  }

  /**
   * Check for known scam URL patterns.
   */
  const pathSegs = parsedURL.getPathSegments();
  const firstPath = pathSegs[0];

  // Pattern 1: "http://.../<single-very-long-path>" + nearly full random chars.
  if (
    parsedURL.isHttpProtocol() &&
    pathSegs.length === 1 &&
    firstPath.length > 40 &&
    !firstPath.includes('-') &&
    !firstPath.includes('_')
  ) {
    return false;
  }

  // Okay, you won this time.
  return true;
}
