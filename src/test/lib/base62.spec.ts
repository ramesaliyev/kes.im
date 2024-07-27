import {describe, it, expect} from 'vitest';

import Base62 from "lib/base62";

/**
 * Test Base62 library.
 */
describe('lib/base62', () => {
  /**
   * Test Base62.alphabet property.
   */
  describe('.alphabet', () => {
    it('should have 62 characters', async () => {
      expect(Base62.alphabet.length).toBe(62);
    });

    it('should have correct characters', async () => {
      expect(Base62.alphabet[0]).toBe('0');
      expect(Base62.alphabet[9]).toBe('9');
      expect(Base62.alphabet[10]).toBe('a');
      expect(Base62.alphabet[35]).toBe('z');
      expect(Base62.alphabet[36]).toBe('A');
      expect(Base62.alphabet[61]).toBe('Z');
    });

    it('should have unique characters', async () => {
      expect(new Set(Base62.alphabet).size).toBe(62);
    });
  });

  /**
   * Test Base62.encode method.
   */
  describe('.encode', () => {
    it('should encode 0 correctly', async () => {
      expect(Base62.encode(0)).toBe('0');
    });

    it('should encode num < 62 correctly', async () => {
      const number = 10;
      const encoded = Base62.encode(number);
      expect(encoded).toBe(Base62.alphabet[number]);
    });

    it('should encode num = 62 correctly', async () => {
      expect(Base62.encode(62)).toBe('10');
    });

    it('should encode num > 62 correctly', async () => {
      expect(Base62.encode(63)).toBe('11');
      expect(Base62.encode(62+62)).toBe('20');
      expect(Base62.encode(62+62+11)).toBe('2b');
      expect(Base62.encode(62*62)).toBe('100');
      expect(Base62.encode(62*62+10)).toBe('10a');
      expect(Base62.encode(62*62+(62*10)+11)).toBe('1ab');
    });

    it('should encode random numbers correctly', async () => {
      // Test 1000 random numbers.
      for (let i = 0; i < 1000; i++) {
        const number = Math.floor(Math.random() * 1000000);
        const encoded = Base62.encode(number);
        const decoded = Base62.decode(encoded);
        expect(decoded).toBe(number);
      }
    });
  });

  /**
   * Test Base62.decode method.
   */
  describe('.decode', () => {
    it('should decode 0 correctly', async () => {
      expect(Base62.decode('0')).toBe(0);
    });

    it('should decode char < 10 correctly', async () => {
      const number = 10;
      const decoded = Base62.decode(Base62.alphabet[number]);
      expect(decoded).toBe(number);
    });

    it('should decode char = 10 correctly', async () => {
      expect(Base62.decode(`10`)).toBe(62);
    });

    it('should decode char > 10 correctly', async () => {
      expect(Base62.decode('11')).toBe(63);
      expect(Base62.decode('20')).toBe(62+62);
      expect(Base62.decode('2a')).toBe(62+62+10);
      expect(Base62.decode('100')).toBe(62*62);
      expect(Base62.decode('10b')).toBe(62*62+11);
      expect(Base62.decode('1ab')).toBe(62*62+(62*10)+11);
    });
  });

  /**
   * Test Base62.next method.
   */
  describe('.next', () => {
    it('should return next number correctly', async () => {
      // Static test cases.
      expect(Base62.next('0')).toBe('1');
      expect(Base62.next('9')).toBe('a');
      expect(Base62.next('z')).toBe('A');
      expect(Base62.next('Z')).toBe('10');
      expect(Base62.next('1Z')).toBe('20');
      expect(Base62.next('aZ')).toBe('b0');
      expect(Base62.next('ZZ')).toBe('100');
    });

    it('should return next number correctly for random numbers', async () => {
      // Test 1000 random numbers.
      for (let i = 0; i < 1000; i++) {
        const number = Math.floor(Math.random() * 1000000);
        const nextNumber = Base62.next(Base62.encode(number));
        const decoded = Base62.decode(nextNumber);
        expect(decoded).toBe(number + 1);
      }
    });
  });

  /**
   * Test Base62.random method.
   */
  describe('.random', () => {
    it('should return random number in correct length', async () => {
      // Test 1000 random numbers.
      for (let i = 0; i < 1000; i++) {
        const length = Math.floor(Math.random() * 10);
        const random = Base62.random(length);
        expect(random.length).toBe(length);
      }
    });
  });
});

