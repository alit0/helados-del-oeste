/**
 * Helados del Oeste — Catalog JSON API.
 *
 * Reads the "Catalogo" sheet once, caches the result, and returns the JSON
 * contract consumed by the React app. Deploy as a Web App (see README.md) and
 * point VITE_CATALOG_URL at the /exec URL.
 *
 * Sheet columns (in order):
 *   categoria | nombre | descripcion | precio_unidad | caja_cantidad |
 *   precio_caja | etiquetas | imagen_url | estado | destacado
 */

var SHEET_NAME = 'Catalogo';
var CACHE_KEY = 'catalog_json';
var CACHE_SECONDS = 300;

function doGet() {
  var cache = CacheService.getScriptCache();
  var json = cache.get(CACHE_KEY);
  if (!json) {
    json = JSON.stringify(buildCatalog());
    cache.put(CACHE_KEY, json, CACHE_SECONDS);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function slug(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function num(v) {
  return v === '' || v == null ? null : Number(v);
}

function buildCatalog() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  var rows = sheet.getDataRange().getValues();
  rows.shift(); // drop header row

  var categoryNames = [];
  var products = rows
    .filter(function (r) {
      return r[0] && r[1];
    })
    .map(function (r) {
      var categoria = r[0];
      var nombre = r[1];
      var descripcion = r[2];
      var precioUnidad = r[3];
      var cajaCantidad = r[4];
      var precioCaja = r[5];
      var etiquetas = r[6];
      var imagenUrl = r[7];
      var estado = r[8];
      var destacado = r[9];

      if (categoryNames.indexOf(categoria) === -1) categoryNames.push(categoria);

      return {
        id: slug(nombre),
        category: slug(categoria),
        name: String(nombre),
        description: String(descripcion || ''),
        priceUnit: num(precioUnidad),
        boxQty: num(cajaCantidad),
        priceBox: num(precioCaja),
        tags: String(etiquetas || '')
          .split(',')
          .map(function (t) {
            return t.trim();
          })
          .filter(function (t) {
            return t.length > 0;
          }),
        imageUrl: imagenUrl ? String(imagenUrl) : null,
        status:
          String(estado || 'activo').toLowerCase() === 'proximamente' ? 'proximamente' : 'activo',
        featured:
          String(destacado || '').toLowerCase() === 'sí' ||
          String(destacado || '').toLowerCase() === 'si',
      };
    });

  var categories = categoryNames.map(function (name) {
    return { id: slug(name), name: name, icon: '🍦' };
  });

  return {
    updatedAt: Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM-dd'),
    store: {
      name: 'Helados del Oeste',
      subtitle: 'La Montevideana',
      address: 'Blvd. J. M. de Rosas 102, Morón',
      instagram: '@heladosdeloesteok',
      whatsapp: '+5491100000000',
      freeShippingThreshold: 25000,
    },
    categories: categories,
    products: products,
  };
}
