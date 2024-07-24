const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const letterValue = alphabet.reduce((mem:any, letter, index) => (mem[letter] = index, mem), {})

export function decode(n:string) {
  const length = n.length;
  let i = 0;
  let result = 0;

  while (i++ < length) {
    result += letterValue[n[i-1]] * Math.pow(62, length - i);
  }

  return result;
}

export function encode(n:number) {
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

export function next(prev= '0') {
  return encode(decode(prev) + 1);
}

export function random(length: number) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}

export default {
  alphabet,
  decode,
  encode,
  next,
  random,
} as const;
