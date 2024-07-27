import {describe, it, expect} from 'vitest';

import {
  isSlugValidAndAllowed,
  isURLValidAndAllowed
} from '@lib/verify';

/**
 * Test verify library.
 */
describe('lib/verify', () => {
  /**
   * Test isSlugValidAndAllowed method.
   */
  describe('isURLValidAndAllowed', () => {
    it('should check length boundaries', async () => {
      expect(isSlugValidAndAllowed('a', 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('a'.repeat(11), 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('a'.repeat(2), 2, 10)).toBe(true);
      expect(isSlugValidAndAllowed('a'.repeat(10), 2, 10)).toBe(true);
    });

    it('should check if slug matches the pattern', async () => {
      expect(isSlugValidAndAllowed('a-b', 2, 10)).toBe(true);
      expect(isSlugValidAndAllowed('a_b', 2, 10)).toBe(true);
      expect(isSlugValidAndAllowed('abc', 2, 10)).toBe(true);
      expect(isSlugValidAndAllowed('1abc', 2, 10)).toBe(true);
      expect(isSlugValidAndAllowed('abc1', 2, 10)).toBe(true);
      expect(isSlugValidAndAllowed('Aabc', 2, 10)).toBe(true);
      expect(isSlugValidAndAllowed('abcB', 2, 10)).toBe(true);
      expect(isSlugValidAndAllowed('-ab', 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('ab-', 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('_ab', 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('ab_', 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('+', 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('$', 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('/', 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('%', 2, 10)).toBe(false);
    });


    it('should check if slug is banned', async () => {
      expect(isSlugValidAndAllowed('admin', 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('Admin', 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('ADMIN', 2, 10)).toBe(false);
      expect(isSlugValidAndAllowed('aDmIn', 2, 10)).toBe(false);
    });
  });

  /**
   * Test isURLValidAndAllowed method.
   */
  describe('isURLValidAndAllowed', () => {
    it('should check length boundaries', async () => {
      expect(isURLValidAndAllowed('https://a.c', 12, 20)).toBe(false);
      expect(isURLValidAndAllowed('https://a.com.tr', 12, 13)).toBe(false);
      expect(isURLValidAndAllowed('https://a.co', 12, 13)).toBe(true);
      expect(isURLValidAndAllowed('https://a.com', 12, 13)).toBe(true);
    });

    // it should check if url is valid url
    it('should check if url is valid url', async () => {
      const min = 10, max = 30;
      expect(isURLValidAndAllowed('https://a.com', min, max)).toBe(true);
      expect(isURLValidAndAllowed('http://a.com/?s=b', min, max)).toBe(true);
      expect(isURLValidAndAllowed('https://a.com.tr', min, max)).toBe(true);
      expect(isURLValidAndAllowed('https://a.co/p/a/t/h', min, max)).toBe(true);
      expect(isURLValidAndAllowed('http://x.xyz:80', min, max)).toBe(true);
      expect(isURLValidAndAllowed('https://ra.mes.tr:80', min, max)).toBe(true);
      expect(isURLValidAndAllowed('://a.com.tr', min, max)).toBe(false);
      expect(isURLValidAndAllowed('noteventrying', min, max)).toBe(false);
      expect(isURLValidAndAllowed('https//a.com.tr', min, max)).toBe(false);
      expect(isURLValidAndAllowed('https://a.com.tr:40:30', min, max)).toBe(false);
      expect(isURLValidAndAllowed('ftp://a.com.tr', min, max)).toBe(false);
      expect(isURLValidAndAllowed('http://a.com.tr^', min, max)).toBe(false);
      expect(isURLValidAndAllowed('https://a', min, max)).toBe(false);
    });

    it('should check if hostname is banned', async () => {
      const min = 10, max = 30;
      expect(isURLValidAndAllowed('https://kes.im', min, max)).toBe(false);
      expect(isURLValidAndAllowed('https://bitly.com', min, max)).toBe(false);
      expect(isURLValidAndAllowed('https://tinyurl.com', min, max)).toBe(false);
    });

    it('should check if url includes banned keywords', async () => {
      const min = 10, max = 30;
      expect(isURLValidAndAllowed('https://a.blogspot.com', min, max)).toBe(false);
    });

    it('should check if url matches any of the banned patterns', async () => {
      const min = 0, max = 2048;
      const scamURL = `http://some.domain.com/${'a'.repeat(100)}`;
      expect(isURLValidAndAllowed(scamURL, min, max)).toBe(false);
    });
  });
});

