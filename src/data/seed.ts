import type { Catalog, PesoPrice } from '../types/catalog';
import catalog from './catalog.json';

/**
 * Fallback "Sabores por Peso" pricing, used only when the catalog does not
 * carry `pesoPrices` (older payloads). The live prices come from the master
 * Sheet's HDO-P00 row via `Catalog.pesoPrices`.
 */
export const PESO_PRICES: PesoPrice[] = [
  ['¼ kg', 4500],
  ['½ kg', 7000],
  ['1 kg', 12000],
];

/**
 * Mock catalog used when VITE_CATALOG_URL is empty. Generated from the master
 * Google Sheet by `scripts/build-catalog.mjs` (real products + image URLs).
 */
export const seedCatalog = catalog as unknown as Catalog;
