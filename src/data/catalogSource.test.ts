import { describe, it, expect } from 'vitest';
import { resolveSource } from './catalogSource';

describe('resolveSource', () => {
  it('returns mock source when url is empty', async () => {
    const src = resolveSource('');
    expect(src.kind).toBe('mock');
    const cat = await src.getCatalog();
    expect(cat.categories.length).toBeGreaterThan(0);
  });
  it('returns apps-script source when url is set', () => {
    const src = resolveSource('https://example.com/exec');
    expect(src.kind).toBe('apps-script');
  });
});
