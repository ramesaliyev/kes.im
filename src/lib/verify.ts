import banned from './banned';
import {getBase62Alphabet} from './base62';
import {URL2} from './url';

// Patterns
const extendedAlphabet = [...getBase62Alphabet(), '\\-', '\\_'].join('');
const slugPattern = new RegExp(`(?!.*(-|_)$)(?!^(-|_).*)^[${extendedAlphabet}]{1,}$`, 'i');
const URLPattern = /^(https?:\/\/[^\s\.]+\.[^\s]{2,})/i;

/**
 * Verify if a string is valid and allowed slug.
 */
export function isSlugValidAndAllowed(slug:string, minLen:number, maxLen:number): boolean {
  // Check slug length.
  if (slug.length <= minLen || slug.length > maxLen) {
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
  if (url.length <= minLen || url.length > maxLen) {
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
  if (banned.URL_KEYWORDS.some(suffix => url.indexOf(suffix) !== -1)) {
    return false;
  }

  // Okay, you won this time.
  return true;
}
