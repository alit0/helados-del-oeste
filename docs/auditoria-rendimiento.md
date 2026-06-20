# Auditoría de Rendimiento — Catálogo Helados del Oeste

> App: Google Apps Script web app desplegada en `/exec`
> Fecha: 20/6/2026

## Resumen ejecutivo

La página tarda en cargar porque **el HTML que devuelve pesa más de 10 MB**, mientras
que el contenido útil (texto del catálogo) ronda los 30–50 KB. La diferencia es,
casi con certeza, **imágenes de producto incrustadas en base64 dentro del HTML**.
El navegador debe descargar y parsear todo ese peso antes de mostrar la primera
pantalla. El problema es de **payload**, no de lógica de negocio.

> Nota: esta auditoría se basa en la respuesta observada del endpoint (>10 MB) y en
> el contenido renderizado. No incluye revisión del código fuente (`Code.gs`, `.html`,
> `appsscript.json`) porque no está disponible. Con el fuente se puede confirmar la
> causa exacta y dar diffs concretos.

## Causa probable (en orden de impacto)

1. **Imágenes en base64 inline.** Cada producto tiene foto. Si están como
   `data:image/...;base64,...` dentro del HTML, no se cachean, no se cargan en
   paralelo y bloquean el render. ~80 productos × ~120 KB = varios MB.
2. **Todo el catálogo se renderiza en el primer load.** Las ~10 categorías y todos
   los productos llegan juntos, aunque el usuario vea una sola sección al inicio.
3. **Lectura de la planilla sin caché.** Si `doGet` lee la Spreadsheet en cada
   request con llamadas no batcheadas, se suma latencia de servidor.

## Recomendaciones (de mayor a menor impacto)

### 1. Sacar las imágenes del HTML — ESTE es el arreglo grande

No incrustar base64. Servir las fotos por URL y dejar que el navegador las maneje:

- Subir las imágenes a un host de imágenes (Cloudinary, imgbb) o a Drive con
  enlace público, y guardar **la URL** en la planilla en vez del base64.
- Usar `<img src="URL" loading="lazy" decoding="async">` para que solo se descarguen
  las que entran en pantalla.
- Comprimir y redimensionar a tamaño real de visualización (p. ej. 400–600 px de
  ancho, WebP). Una foto de catálogo no necesita 2 MB.

**Impacto esperado:** de >10 MB a unos cientos de KB en el primer paint.

### 2. Separar datos de presentación (carga asíncrona)

Servir un HTML liviano (estructura + estilos) y traer los productos después con
`google.script.run`, renderizando en el cliente. Así el usuario ve la página al
instante y los datos entran enseguida.

```js
// cliente
google.script.run.withSuccessHandler(render).getProductos();
```

### 3. Cachear la lectura de la planilla en el servidor

```js
function getProductos() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('productos');
  if (hit) return JSON.parse(hit);

  const rows = SpreadsheetApp.openById(ID).getSheetByName('Catalogo')
    .getDataRange().getValues();           // una sola lectura batch
  const data = mapRows(rows);
  cache.put('productos', JSON.stringify(data), 21600); // 6 h
  return data;
}
```

Regla de oro en Apps Script: **una sola llamada `getValues()`** sobre todo el rango,
nunca `getRange().getValue()` dentro de un loop.

### 4. Lazy-load por categoría

Cargar primero la categoría visible y diferir el resto (al hacer scroll o clic en la
pestaña). Reduce el trabajo de render inicial.

### 5. Higiene de cabeceras

Si se sirven imágenes desde Drive/host propio, agregar cache largo
(`Cache-Control`) para que el navegador no las vuelva a pedir en cada visita.

## Cómo confirmar el diagnóstico

Para pasar de "muy probable" a "confirmado" y darte los cambios exactos, necesito el
fuente del proyecto:

- `Code.gs` (y cualquier otro `.gs`)
- Los archivos `.html` que sirve `HtmlService`
- `appsscript.json`

Se obtienen desde el editor de Apps Script (**⚙ Configuración → mostrar manifiesto**)
o con `clasp pull`.

## Plan sugerido (orden de ejecución)

1. Reemplazar base64 por URLs de imágenes + `loading="lazy"` → **80% de la mejora**.
2. Cachear la lectura de la planilla con `CacheService`.
3. Mover la carga de datos a `google.script.run` asíncrono.
4. Lazy-load por categoría.
