/**
 * Base62 module
 */

/**
 * Alphabet used for encoding and decoding.
 */
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const base = alphabet.length;

/**
 * Map of character to index.
 */
const charIndexMap = Object.fromEntries(alphabet.map((char, index) => [char, index]));

/**
 * Calculate the power of 62 with caching support.
 * @param num 
 * @returns 
 */
const pow62 = (function () {
  const cache: Record<number, number> = {};

  return function (num: number) {
    if (cache[num] === undefined) {
      cache[num] = Math.pow(base, num);
    }
    return cache[num];
  };
})();

/**
 * Decode a base62 string to a number.
 * @param encoded Base62 string.
 * @returns Number.
 */
function decode(encoded: string) {
  let result = 0;

  for (let index = encoded.length - 1; index >= 0; index--) {
    const coefficient = charIndexMap[encoded[index]];
    const multiplier = pow62(encoded.length - index - 1);

    result += coefficient * multiplier;
  }

  return result;
}

/**
 * Encode a number to a base62 string.
 * @param num 
 * @returns string
 */
function encode(num:number) {
  if (num === 0) {
    return '0';
  }

  let result = '';

  while (num > 0) {
    result = alphabet[num % base] + result;
    num = Math.floor(num / base);
  }

  return result;
}

/**
 * Calculate the next base62 string.
 * @param prev 
 * @returns string
 */
function next(prev='0') {
  return encode(decode(prev) + 1);
}

/**
 * Generates a random base62 string of a given length.
 * @param length 
 * @returns 
 */
function random(length: number) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}

/**
 * Base62 module
 */
export default {
  alphabet,
  decode,
  encode,
  next,
  random,
} as const;
