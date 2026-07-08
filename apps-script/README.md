# Apps Script — Catalog JSON API

Backend that feeds the React catalog with **live data** from the existing master
Google Sheet (HOJA MAESTRA DE PRODUCTOS Y PRECIOS). Optional: until deployed, the
app runs on a local snapshot (`src/data/catalog.json`).

`Code.gs` parses the sheet **as it already is** — no need to restructure it. It:

- Skips title rows and category/subsection separators (only reads rows whose
  `CÓD.` starts with `HDO-`).
- Reads columns: CÓD · CATEGORÍA · PRODUCTO · DESCRIPCIÓN · LINK IMAGEN ·
  PRECIO UNITARIO · CANT. MAYORISTA · PRECIO x CANTIDAD · DISPONIBLE · ETIQUETA.
- Parses `$1,000` style prices into numbers.
- Hides rows where `DISPONIBLE = NO`.
- Marks `proximamente` when the description says so; empty prices render as
  **"Consultá"** (sabores por peso).
- Uses the `LINK IMAGEN` URL as the product photo (placeholder if empty).
- Reads the **kilo / "Sabores por Peso" prices from row `HDO-P00`**
  (`PRECIO UNITARIO` = ¼ kg, `CANT. MAYORISTA` = ½ kg, `PRECIO x CANTIDAD` = 1 kg)
  and exposes them as `catalog.pesoPrices`. The section-header pills and the
  "Kilo de helado" promo banner both read from this, so editing HDO-P00 updates
  the site. **After changing `Code.gs` you must redeploy the Web App** (a Sheet
  edit alone is enough for prices going forward, but the code change needs a
  new deployment version first).

## Deploy

1. Open the master Sheet → **Extensions → Apps Script**.
2. Paste the contents of `Code.gs` from this folder. Save.
3. **Deploy → New deployment → Web app**.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
4. Copy the **`/exec`** URL.

## Connect the frontend

In Vercel (Project → Settings → Environment Variables):

```
VITE_CATALOG_URL = https://script.google.com/macros/s/XXXX/exec
```

Redeploy. The app now serves live data; edits to the Sheet appear within ~5 min
(`CACHE_SECONDS`).

## Notes

- Reads the **first tab** of the spreadsheet. If the master is not the first
  tab, change `getSheets()[0]` to `getSheetByName('TabName')`.
- The 5 promo banners are defined in `Code.gs` (same as the local snapshot). To
  let the owner edit promos from the Sheet later, add a `Promos` tab and extend
  `buildCatalog()`.
- Regenerate the local snapshot from a CSV export with:
  `node scripts/build-catalog.mjs <export.csv> src/data/catalog.json`.
