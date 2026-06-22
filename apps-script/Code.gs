/**
 * Helados del Oeste — Catalog JSON API.
 *
 * Parses the existing master sheet (HOJA MAESTRA DE PRODUCTOS Y PRECIOS) and
 * returns the JSON contract consumed by the React app. Deploy as a Web App and
 * point VITE_CATALOG_URL at the /exec URL. The owner keeps editing the same
 * sheet; changes appear after the cache TTL (~5 min).
 *
 * Expected columns (row order, leading title/category rows are skipped):
 *   CÓD | CATEGORÍA | PRODUCTO | DESCRIPCIÓN | LINK IMAGEN | PRECIO UNITARIO |
 *   CANT. MAYORISTA | PRECIO x CANTIDAD | DISPONIBLE | ETIQUETA | COSTO
 */

var SHEET_ID = '1k-JPaRb3SuzuHxCcS1ZkutteqKfMobtvPO7QdrufJ1M';
var SHEET_GID = 396493507; // "HOJA MAESTRA" tab
var CACHE_KEY = 'catalog_json_v3';
var CACHE_SECONDS = 300;

function getMasterSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === SHEET_GID) return sheets[i];
  }
  return sheets[0];
}

var ICONS = {
  'palitos-de-agua': '🧊',
  'palitos-de-crema': '🍦',
  'bombones-y-premium': '🍫',
  'vasitos-y-copas': '🥤',
  'potes-individuales': '🍨',
  'potes-familiares': '🪣',
  'postres-y-tortas': '🎂',
  'especiales': '⭐',
  'fit-cream': '💪',
  'sabores-por-peso': '⚖️',
};

function doGet() {
  var cache = CacheService.getScriptCache();
  var json = cache.get(CACHE_KEY);
  if (!json) {
    json = JSON.stringify(buildCatalog());
    cache.put(CACHE_KEY, json, CACHE_SECONDS);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function stripEmoji(s) {
  return String(s).replace(
    /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu,
    '',
  );
}

function slug(s) {
  return stripEmoji(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function money(v) {
  var n = String(v).replace(/[^0-9]/g, '');
  return n === '' ? null : Number(n);
}

function buildCatalog() {
  var sheet = getMasterSheet();
  var rows = sheet.getDataRange().getValues();

  var categories = [];
  var seen = {};
  var products = [];

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    var cod = String(r[0] || '').trim();
    if (!/^HDO-/i.test(cod)) continue;
    if (cod.toUpperCase() === 'HDO-P00') continue;

    var categoria = String(r[1] || '').trim();
    var nombre = String(r[2] || '').trim();
    var descripcion = String(r[3] || '').trim();
    var imagen = String(r[4] || '').trim();
    var disponible = String(r[8] || '').trim().toUpperCase();
    var etiqueta = String(r[9] || '').trim();
    if (!categoria || !nombre) continue;
    if (disponible === 'NO') continue;

    var catId = slug(categoria);
    if (!seen[catId]) {
      seen[catId] = true;
      categories.push({ id: catId, name: categoria, icon: ICONS[catId] || '🍦' });
    }

    var tags = etiqueta
      .split(',')
      .map(function (t) {
        return t.trim().replace(/\.+$/, '');
      })
      .filter(function (t) {
        return t.length > 0;
      });

    products.push({
      id: slug(cod),
      category: catId,
      name: nombre,
      description: descripcion,
      priceUnit: money(r[5]),
      boxQty: String(r[6] || '').trim() ? Number(String(r[6]).replace(/[^0-9]/g, '')) : null,
      priceBox: money(r[7]),
      tags: tags,
      imageUrl: imagen ? String(imagen) : (catId === 'sabores-por-peso' ? '/sabores/' + slug(cod) + '.webp' : null),
      status: /pr[oó]ximamente/i.test(descripcion) ? 'proximamente' : 'activo',
      badge: String(r[11] || '').trim() || null, // column L "DESTACADO": Más vendido | Nuevo | Oferta
    });
  }

  return {
    updatedAt: Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM-dd'),
    store: {
      name: 'Helados del Oeste',
      subtitle: 'La Montevideana',
      address: 'Blvd. Juan Manuel de Rosas 102, Morón',
      instagram: '@heladosdeloesteok',
      whatsapp: '+5491154792502',
      freeShippingThreshold: 25000,
    },
    categories: categories,
    products: products,
    promos: [
      { id: 'promo-potes', eyebrow: 'Oferta del día', title: '-20%', subtitle: 'en potes seleccionados', cta: 'Ver oferta', image: '/promos/promo-potes.webp' },
      { id: 'promo-2x1', eyebrow: 'Solo esta semana', title: '2x1', subtitle: 'en palitos de agua', cta: 'Aprovechá', image: '/promos/promo-2x1.webp' },
      { id: 'promo-fit', eyebrow: 'Nuevo', title: 'Fit Cream', subtitle: 'sin azúcar, apto diabéticos', cta: 'Probalo', image: '/promos/promo-fit.webp' },
      { id: 'promo-combo', eyebrow: 'Combo familiar', title: '3L + Postre', subtitle: 'a precio especial', cta: 'Ver combo', image: '/promos/promo-combo.webp' },
    ],
  };
}
