const {pow, random, floor} = Math;

const base62Alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const letterValue = base62Alphabet.reduce((mem:any, letter, index) => (mem[letter] = index, mem), {})

export function fromBase62(n:string) {
  const length = n.length;
  let i = 0;
  let result = 0;

  while (i++ < length) {
    result += letterValue[n[i-1]] * Math.pow(62, length - i);
  }

  return result;
}

export function toBase62(n:number) {
  let result = '';

  while (n >= 62) {
    result += base62Alphabet[n % 62];
    n = Math.floor(n / 62);
  }

  if (n !== 0) {
    result += base62Alphabet[n];
  }

  return result.split('').reverse().join('');
}

export function getNextBase62(prev= '0') {
  return toBase62(fromBase62(prev) + 1);
}

export function getBase62Alphabet() {
  return base62Alphabet;
}

export function generateRandomBase62(length:number) {
  return toBase62(floor(random() * pow(base62Alphabet.length, length)));
}
