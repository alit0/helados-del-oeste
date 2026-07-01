// Single source of truth for the Apps Script Web App endpoint.
// Same /exec URL serves the catalog (GET) and receives newsletter
// subscriptions (POST). The owner edits the master Google Sheet and both the
// catalog and the subscribers list live there.
//
// Override with VITE_CATALOG_URL. Set it to '' (empty) to fall back to the
// bundled local snapshot for GET and disable the network POST (used in tests).

const DEFAULT_CATALOG_URL =
  'https://script.google.com/macros/s/AKfycbzlyyT22fhRRwikw30gVigxoW7mnpe2iKSZAOhIxz_iHzluRQqweyUd7GuIfIbCaGEiLg/exec';

export const CATALOG_URL =
  import.meta.env.VITE_CATALOG_URL !== undefined
    ? import.meta.env.VITE_CATALOG_URL
    : import.meta.env.MODE === 'test'
      ? '' // tests use the bundled snapshot, never the network
      : DEFAULT_CATALOG_URL;
