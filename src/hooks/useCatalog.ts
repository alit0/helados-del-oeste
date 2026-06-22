import { useEffect, useState } from 'react';
import type { Catalog } from '../types/catalog';
import { resolveSource } from '../data/catalogSource';

const CACHE_KEY = 'hdo.catalog.v1';

// Live data source (Apps Script JSON of the master Google Sheet). The owner edits
// the Sheet and the catalog updates. Override with VITE_CATALOG_URL; set it to ''
// (empty) to fall back to the bundled local snapshot.
const DEFAULT_CATALOG_URL =
  'https://script.google.com/macros/s/AKfycbzFb00hZqN6dERNJCRrFL3nT6v5I0L2Zk6JD2pTmtrJu9AGD-HOGxnm1fM5N0DDc7WE8w/exec';

const CATALOG_URL =
  import.meta.env.VITE_CATALOG_URL !== undefined
    ? import.meta.env.VITE_CATALOG_URL
    : import.meta.env.MODE === 'test'
      ? '' // tests use the bundled snapshot, never the network
      : DEFAULT_CATALOG_URL;

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

    const source = resolveSource(CATALOG_URL);
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
