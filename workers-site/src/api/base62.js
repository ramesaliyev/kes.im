export const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const letterValue = alphabet.reduce((mem, letter, index) => (mem[letter] = index, mem), {})

export function fromBase62(n) {
  const length = n.length;
  let i = 0;
  let result = 0;

  while (i++ < length) {
    result += letterValue[n[i-1]] * Math.pow(62, length - i);
  }

  return result;
}

export function toBase62(n) {
  let result = '';

  while (n >= 62) {
    result += alphabet[n % 62];
    n = Math.floor(n / 62);
  }

  if (n !== 0) {
    result += alphabet[n];
  }

  return result.split('').reverse().join('');
}

export function getNext(prev= '0') {
  return toBase62(fromBase62(prev) + 1);
}