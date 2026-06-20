import { useEffect, useState } from 'react';
import type { Catalog } from '../types/catalog';
import { resolveSource } from '../data/catalogSource';

const CACHE_KEY = 'hdo.catalog.v1';

export function useCatalog() {
  const [data, setData] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let alive = true;

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        setData(JSON.parse(cached) as Catalog);
        setLoading(false);
      } catch {
        /* ignore malformed cache */
      }
    }

    const source = resolveSource(import.meta.env.VITE_CATALOG_URL);
    source
      .getCatalog()
      .then((cat) => {
        if (!alive) return;
        setData(cat);
        localStorage.setItem(CACHE_KEY, JSON.stringify(cat));
        setError(null);
      })
      .catch((e) => {
        if (alive) setError(e as Error);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}
