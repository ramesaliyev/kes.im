import {describe, it, expect} from 'vitest';

import banned from '@gen/banned';

/**
 * Test generated banneds list.
 */
describe('gen/banned', () => {
  it('should have hostnames array', async () => {
    expect(Array.isArray(banned.HOSTNAMES)).toBe(true);
  });

  it('should have url keywords array', async () => {
    expect(Array.isArray(banned.URL_KEYWORDS)).toBe(true);
  });

  it('should have slugs array', async () => {
    expect(Array.isArray(banned.SLUGS)).toBe(true);
  });
});
