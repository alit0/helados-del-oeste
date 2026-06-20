import { describe, it, expect } from 'vitest';
import { buildWhatsAppUrl } from './whatsapp';

describe('buildWhatsAppUrl', () => {
  it('encodes the order into a wa.me link', () => {
    const url = buildWhatsAppUrl('+5491112345678', [
      { name: 'Summun Frutilla', modo: 'caja', cantidad: 2, precio: 12000 },
    ]);
    expect(url.startsWith('https://wa.me/5491112345678?text=')).toBe(true);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('Summun Frutilla');
    expect(decoded).toContain('x2');
    expect(decoded).toContain('24.000');
  });
});
