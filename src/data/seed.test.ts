import { describe, it, expect } from 'vitest';
import { seedCatalog } from './seed';

describe('seedCatalog', () => {
  it('has the 10 categories from the catalog', () => {
    expect(seedCatalog.categories).toHaveLength(10);
  });

  it('includes Summun Frutilla with dual pricing, tag and a rehosted local image', () => {
    const p = seedCatalog.products.find((x) => x.name === 'Summun Frutilla');
    expect(p?.priceUnit).toBe(800);
    expect(p?.priceBox).toBe(12000);
    expect(p?.boxQty).toBe(24);
    expect(p?.tags).toContain('Sin Gluten');
    // Product images are rehosted on our own server (no external hotlinks).
    expect(p?.imageUrl).toMatch(/^\/productos\/.+\.webp$/);
  });

  it('has no images hotlinked from external servers (all rehosted)', () => {
    const external = seedCatalog.products.filter(
      (p) => p.imageUrl != null && !p.imageUrl.startsWith('/'),
    );
    expect(external).toHaveLength(0);
  });

  it('marks por-peso flavors as Consultá (null prices)', () => {
    const peso = seedCatalog.products.filter((x) => x.category === 'sabores-por-peso');
    expect(peso.length).toBeGreaterThan(0);
    expect(peso.every((x) => x.priceUnit === null && x.priceBox === null)).toBe(true);
  });

  it('has unique product ids', () => {
    const ids = seedCatalog.products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only references known category ids', () => {
    const catIds = new Set(seedCatalog.categories.map((c) => c.id));
    expect(seedCatalog.products.every((p) => catIds.has(p.category))).toBe(true);
  });
});
