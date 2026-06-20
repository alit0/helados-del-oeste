import { mockSource } from './mockSource';
import { appsScriptSource } from './appsScriptSource';
import type { Catalog } from '../types/catalog';

export interface CatalogSource {
  kind: 'mock' | 'apps-script';
  getCatalog(): Promise<Catalog>;
}

export function resolveSource(url: string | undefined): CatalogSource {
  return url && url.trim() ? appsScriptSource(url) : mockSource;
}
