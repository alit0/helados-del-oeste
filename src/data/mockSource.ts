import type { CatalogSource } from './catalogSource';
import { seedCatalog } from './seed';

export const mockSource: CatalogSource = {
  kind: 'mock',
  async getCatalog() {
    return seedCatalog;
  },
};
