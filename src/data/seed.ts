import type { Catalog } from '../types/catalog';
import catalog from './catalog.json';

/** Shared pricing for the "Sabores por Peso" section (rendered as a section header). */
export const PESO_PRICES = [
  ['¼ kg', 4000],
  ['½ kg', 6000],
  ['1 kg', 10000],
] as const;

/**
 * Mock catalog used when VITE_CATALOG_URL is empty. Generated from the master
 * Google Sheet by `scripts/build-catalog.mjs` (real products + image URLs).
 */
export const seedCatalog = catalog as unknown as Catalog;
