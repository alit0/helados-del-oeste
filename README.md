# Helados del Oeste — Catálogo

Catálogo de productos de **Helados del Oeste (La Montevideana)**: una SPA rápida
en React que reemplaza al viejo catálogo en Google Apps Script (que devolvía
+10 MB de HTML y cargaba lento). Modelo **catálogo + pedido por WhatsApp**, con
precios mayorista y minorista.

## Stack

Vite · React · TypeScript · Tailwind CSS · Vitest · Vercel.

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm test         # corre la suite de tests
npm run build    # build de producción (typecheck + bundle)
npm run preview  # sirve el build
```

## Fuente de datos (swappable)

La app lee el catálogo a través de una abstracción controlada por una variable
de entorno:

| `VITE_CATALOG_URL` | Comportamiento |
|--------------------|----------------|
| vacío / sin definir | Usa datos **mock** locales (`src/data/seed.ts`) |
| URL del Apps Script | Usa datos **en vivo** desde el Google Sheet |

Para datos reales, crear un archivo `.env.local` (no se commitea):

```
VITE_CATALOG_URL=https://script.google.com/macros/s/XXXX/exec
```

El backend que devuelve ese JSON está en [`apps-script/`](./apps-script/README.md)
— se despliega cuando el Sheet real esté disponible. El dueño edita el Sheet y
los cambios aparecen solos (cache ~5 min). **Las imágenes van como URL en el
Sheet, nunca como base64.**

## Deploy (Vercel)

1. Importar el repo en Vercel (preset **Vite**).
2. Dejar `VITE_CATALOG_URL` vacío para correr con mock, o setearla para datos
   en vivo.
3. Deploy. Cada push a `main` redeploya automáticamente.

## Estructura

```
src/
  types/      tipos del dominio (Catalog, Product…)
  data/       fuente swappable (mock + apps-script) y seed
  hooks/      useCatalog (fetch+cache), usePedido (estado del pedido)
  lib/        formato de precios y armado del link de WhatsApp
  components/  UI (cards, hero, banners, drawer, footer…)
  theme/      design tokens
apps-script/  backend JSON para el Sheet (opcional)
docs/         catálogo documentado, auditoría, maquetas, spec y plan
```
