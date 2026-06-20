import type { Catalog } from '../types/catalog';
import type { CatalogSource } from './catalogSource';

export function appsScriptSource(url: string): CatalogSource {
  return {
    kind: 'apps-script',
    async getCatalog(): Promise<Catalog> {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Catalog fetch failed: ${res.status}`);
      return (await res.json()) as Catalog;
    },
  };
}
