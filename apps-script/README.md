# Apps Script — Catalog JSON API

This is the backend that feeds the React catalog with live data from a Google
Sheet. It is **optional**: until it's deployed, the app runs on local mock data.

## 1. Prepare the Sheet

Create (or reuse) a Google Sheet with a tab named **`Catalogo`** and these
columns, in this exact order (row 1 = headers):

| categoria | nombre | descripcion | precio_unidad | caja_cantidad | precio_caja | etiquetas | imagen_url | estado | destacado |
|-----------|--------|-------------|---------------|---------------|------------|-----------|------------|--------|-----------|

Rules:
- `etiquetas`: comma-separated (e.g. `Sin Gluten, Apto diabéticos`).
- `estado`: `activo` or `proximamente` (próximamente hides the price).
- `precio_caja` empty → product shows as **"Consultá"** (e.g. sabores por peso).
- `imagen_url` empty → the app shows a placeholder. **Paste a URL, never a
  base64 image** — that was the cause of the old version being slow.
- `destacado`: `sí` to show the "Más vendido" ribbon.

## 2. Add the script

1. In the Sheet: **Extensions → Apps Script**.
2. Replace the default `Code.gs` with the contents of `Code.gs` from this folder.
3. Save.

## 3. Deploy as a Web App

1. **Deploy → New deployment → Web app**.
2. Description: `catalog-json`.
3. **Execute as:** Me.
4. **Who has access:** Anyone.
5. Deploy and copy the **`/exec`** URL.

## 4. Connect the frontend

In Vercel (Project → Settings → Environment Variables):

```
VITE_CATALOG_URL = https://script.google.com/macros/s/XXXX/exec
```

Redeploy. The app now serves live data; the owner edits the Sheet and changes
appear within ~5 minutes (cache TTL).

## Notes

- Category icons default to 🍦. To customize per category, extend the `icon`
  mapping in `buildCatalog()`.
- The response is cached for 5 minutes (`CACHE_SECONDS`). Lower it for faster
  propagation, raise it for fewer reads.
