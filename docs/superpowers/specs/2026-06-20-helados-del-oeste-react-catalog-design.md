# Diseño — Catálogo React Helados del Oeste (La Montevideana)

> Fecha: 2026-06-20
> Estado: aprobado para implementación
> Reemplaza: catálogo actual en Google Apps Script (`/exec`, HTML >10 MB, lento)

## Objetivo

Reconstruir el catálogo como una SPA rápida que se vea **igual o muy cercana** a las
maquetas (`docs/*.png`), manteniendo el flujo del dueño: edita precios en un Google
Sheet y el catálogo se actualiza solo. Modelo de negocio: **catálogo + pedido por
WhatsApp** (sin carrito de pago). Enfoque mayorista, pero también menorista → cada
producto muestra precio unitario y precio por caja.

## Restricciones / decisiones tomadas

- **Modelo:** catálogo + WhatsApp. El botón "+" arma un mensaje de WhatsApp
  pre-cargado. Sin checkout, sin pagos, sin manejo de stock.
- **Precios duales:** menorista (unidad) + mayorista (caja, ej. "x24: $12.000").
  En el pedido el cliente elige unidad o caja.
- **Fuente de datos (opción A):** Apps Script `doGet` devuelve **JSON liviano**
  (no HTML), leyendo el Sheet una vez con `getValues()` y cacheando con
  `CacheService`. React hace `fetch` en runtime. El dueño sigue editando el mismo
  Sheet; los cambios se ven al expirar la cache (~5 min).
- **Fuente swappable:** el Sheet real todavía no está disponible. Construimos contra
  datos mock y dejamos la fuente intercambiable por **una variable de entorno**
  (`VITE_CATALOG_URL`). Sin URL → mock; con URL → Apps Script real. El frontend no
  cambia: solo el endpoint debe respetar el contrato JSON.
- **Imágenes:** placeholders por ahora. Luego el dueño pega URLs en el Sheet
  (columna `imagen_url`). NUNCA base64 inline (esa fue la causa de la lentitud).
- **Diseño:** fiel a las maquetas. No reinterpretar.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS** (tokens del sistema de diseño)
- **Vercel** (deploy automático desde GitHub en cada push; gratis)
- Sin librería de estado pesada: estado del pedido en `useState`/context +
  `localStorage`.

## Arquitectura

```
Dueño → Google Sheet → Apps Script doGet (JSON + CacheService) → React SPA (Vercel)
                                                  ▲
                          VITE_CATALOG_URL define el endpoint (o mock si vacío)
```

Dos piezas, responsabilidades aisladas:

1. **Backend (Apps Script):** una función con una sola tarea — leer el Sheet y
   devolver JSON cacheado. Se escribe/deploya cuando el Sheet real esté disponible.
2. **Frontend (React):** consume el JSON vía una capa de datos abstracta. No conoce
   Google; solo conoce el contrato JSON y una URL.

## Capa de datos (abstracción swappable)

```ts
interface CatalogSource {
  getCatalog(): Promise<Catalog>;
}

// mockSource      → lee JSON local seedeado desde docs/catalogo.md (hoy)
// appsScriptSource → fetch(VITE_CATALOG_URL) (cuando exista el Sheet)
// El selector elige según VITE_CATALOG_URL esté vacío o no.
```

`useCatalog()` — hook que llama a la fuente activa, cachea en memoria + `localStorage`
(2da visita instantánea) y expone `{ data, loading, error }`.

## Contrato JSON (lo que el Apps Script debe devolver)

```json
{
  "updatedAt": "2026-06-20",
  "store": {
    "name": "Helados del Oeste",
    "subtitle": "La Montevideana",
    "address": "Blvd. J. M. de Rosas 102, Morón",
    "instagram": "@heladosdeloesteok",
    "whatsapp": "+54911XXXXXXXX",
    "freeShippingThreshold": 25000
  },
  "categories": [
    { "id": "palitos-agua", "name": "Palitos de Agua", "icon": "🧊" }
  ],
  "products": [
    {
      "id": "summun-frutilla",
      "category": "palitos-agua",
      "name": "Summun Frutilla",
      "description": "Helado de agua de frutilla.",
      "priceUnit": 800,
      "boxQty": 24,
      "priceBox": 12000,
      "tags": ["Sin Gluten"],
      "imageUrl": null,
      "status": "activo",
      "featured": false
    }
  ]
}
```

## Esquema del Sheet (contrato de edición del dueño)

Columnas en orden (el orden ES el contrato):

| categoria | nombre | descripcion | precio_unidad | caja_cantidad | precio_caja | etiquetas | imagen_url | estado | destacado |
|---|---|---|---|---|---|---|---|---|---|

- `estado`: `activo` | `proximamente` (los "proximamente" se muestran sin precio).
- `etiquetas`: separadas por coma (`Sin Gluten, Apto diabéticos`).
- `imagen_url` vacío → placeholder por categoría.
- `precio_caja` vacío → producto "Consultá" (sabores por peso).

## Componentes del frontend

| Componente | Propósito | Depende de |
|---|---|---|
| `useCatalog()` | Trae y cachea el catálogo | CatalogSource |
| `Header` / `BottomNav` | Top-nav (desktop) / bottom-nav (mobile) | estado pedido (badge) |
| `Hero` | "Armá tu antojo" + buscador | — |
| `SearchBar` | Filtra productos por texto | catálogo |
| `CategoryPills` | Filtro por categoría con íconos | categorías |
| `OfferBanner` | Carrusel "OFERTA DEL DÍA -20%" (azul marino) | productos destacados |
| `ProductCard` | Imagen/placeholder, nombre, **doble precio**, etiquetas, cinta "MÁS VENDIDO", botón "+" | producto |
| `ProductGrid` / `CategorySection` | Agrupa productos por categoría | productos |
| `FreeShippingBanner` | Franja "ENVÍO GRATIS" | store config |
| `Testimonials` | "Lo que dicen nuestros clientes" | data estática |
| `Newsletter` | "Sumate a las promos" | — |
| `Footer` | Medios de pago + redes + contacto | store config |
| `PedidoDrawer` | Carrito liviano: junta selección, elige unidad/caja, arma mensaje WhatsApp | estado pedido |

## Estado del pedido

- Lista en context + `localStorage` (`{ productId, modo: 'unidad'|'caja', cantidad }`).
- `PedidoDrawer` calcula subtotal y arma el texto.
- "Pedir por WhatsApp" → `https://wa.me/<num>?text=<pedido formateado>`.

## Sistema de diseño (fiel a las maquetas)

- **Colores:** rojo de marca (header, botones, badges), azul marino (`OFERTA`,
  footer), fondo crema/off-white, tarjetas blancas.
- **Tipografía:** sans bold redondeada para títulos; sans regular para cuerpo.
- **Logo:** badge circular "Helados del Oeste / Lm".
- **Placeholders:** silueta de producto + color de categoría hasta cargar fotos.
- **Responsive:** mobile-first; bottom-nav en mobile, top-nav en desktop;
  grids de 1→2→3→4 columnas según ancho.

## Testing

- Unit: `useCatalog` (loading/error/cache), parser del Sheet→JSON (en Apps Script),
  construcción del mensaje de WhatsApp, lógica unidad/caja.
- Componente: `ProductCard` renderiza ambos precios y el estado "Consultá"/"proximamente".
- Smoke: la app levanta con mock y muestra todas las categorías.

## Fuera de alcance (YAGNI)

- Pagos / checkout real / pasarela.
- Cuentas de usuario / login.
- Manejo de stock o inventario.
- Panel de administración (el "admin" es el Google Sheet).
- Multi-idioma.

## Plan de migración

1. Construir frontend contra mock (datos de `catalogo.md`).
2. Deploy a Vercel desde GitHub con `VITE_CATALOG_URL` vacío (corre con mock).
3. Cuando el dueño entregue el Sheet: escribir/deployar el Apps Script JSON, setear
   `VITE_CATALOG_URL` en Vercel. Cero cambios de código.
4. Cargar URLs de imágenes en el Sheet a medida que estén las fotos.
