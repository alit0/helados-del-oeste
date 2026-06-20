import { describe, it, expect } from 'vitest';
import { seedCatalog } from './seed';

describe('seedCatalog', () => {
  it('has the 10 categories from the catalog', () => {
    expect(seedCatalog.categories).toHaveLength(10);
  });
  it('includes Summun Frutilla with dual pricing', () => {
    const p = seedCatalog.products.find((x) => x.id === 'summun-frutilla');
    expect(p?.priceUnit).toBe(800);
    expect(p?.priceBox).toBe(12000);
    expect(p?.boxQty).toBe(24);
    expect(p?.tags).toContain('Sin Gluten');
  });
  it('marks por-peso flavors as Consultá (null prices)', () => {
    const p = seedCatalog.products.find((x) => x.id === 'peso-chocolate');
    expect(p?.priceUnit).toBeNull();
    expect(p?.priceBox).toBeNull();
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
