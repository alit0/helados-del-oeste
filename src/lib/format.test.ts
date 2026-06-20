import { describe, it, expect } from 'vitest';
import { money, boxLabel } from './format';

describe('format', () => {
  it('formats money as AR pesos', () => {
    expect(money(12000)).toBe('$12.000');
    expect(money(800)).toBe('$800');
  });
  it('builds the box label', () => {
    expect(boxLabel(24, 12000)).toBe('x24: $12.000');
  });
});
