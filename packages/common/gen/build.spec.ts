import {describe, it, expect} from 'vitest';

import BuildMeta from '@gen/build';

/**
 * Test generated banneds list.
 */
describe('gen/banned', () => {
  it('should have timestamp', async () => {
    expect(typeof BuildMeta.time).toBe('string');
  });

  it('should have commit hash', async () => {
    expect(typeof BuildMeta.commitHash).toBe('string');
  });

  it('should have workerEnv', async () => {
    expect(typeof BuildMeta.workerEnv).toBe('string');
  });

  it('should have version', async () => {
    expect(typeof BuildMeta.version).toBe('string');
  });

  it('should have build number', async () => {
    expect(typeof BuildMeta.build).toBe('string');
  });

  it('should have build run identifier', async () => {
    expect(typeof BuildMeta.run).toBe('string');

    const run = BuildMeta.run.split('-');
    expect(run.length).toBe(3);
  });
});
