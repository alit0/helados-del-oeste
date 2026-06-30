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

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/**
 * Newsletter subscriptions. The React form POSTs { email } (form-encoded).
 * Stores unique emails in the "Suscriptores" tab of the same master Sheet.
 */
function doPost(e) {
  var email = '';
  try {
    if (e && e.parameter && e.parameter.email) {
      email = e.parameter.email;
    } else if (e && e.postData && e.postData.contents) {
      try {
        email = (JSON.parse(e.postData.contents).email) || '';
      } catch (errJson) {
        email = '';
      }
    }
  } catch (err) {
    email = '';
  }

  email = String(email).trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return jsonOut({ ok: false, error: 'invalid_email' });
  }

  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Suscriptores');
  if (!sheet) {
    sheet = ss.insertSheet('Suscriptores');
    sheet.appendRow(['Email', 'Fecha']);
  }

  var lastRow = sheet.getLastRow();
  if (lastRow >= 1) {
    var existing = sheet.getRange(1, 1, lastRow, 1).getValues();
    for (var i = 0; i < existing.length; i++) {
      if (String(existing[i][0]).trim().toLowerCase() === email) {
        return jsonOut({ ok: true, duplicate: true });
      }
    }
  }

  sheet.appendRow([email, Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM-dd HH:mm:ss')]);
  return jsonOut({ ok: true });
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

// Product images are rehosted on our own server under /productos as .webp.
// Any La Montevideana link in the Sheet is rewritten to its local copy.
// New products pointing at montevideanahelados.com.ar still need their image
// downloaded + converted into public/productos/ (see scripts).
function localImage(imagen) {
  var s = String(imagen);
  var m = s.match(/\/([^\/?#]+)\.(?:png|jpe?g|webp)(?:[?#].*)?$/i);
  if (/montevideanahelados\.com\.ar/i.test(s) && m) {
    return '/productos/' + m[1] + '.webp';
  }
  return s;
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
      imageUrl: imagen ? localImage(imagen) : (catId === 'sabores-por-peso' ? '/sabores/' + slug(cod) + '.webp' : null),
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
      { id: 'promo-palito-agua', eyebrow: 'Por mayor', title: '$12.000', subtitle: 'Caja x24 · Palito de agua', cta: 'Pedir', productImage: '/promos/promo-palito-agua.webp' },
      { id: 'promo-bombon', eyebrow: 'Por mayor', title: '$33.000', subtitle: 'Caja x35 · Palito bombón', cta: 'Pedir', productImage: '/productos/bombom.webp' },
      { id: 'promo-fit', eyebrow: 'Nuevo', title: 'Fit Cream', subtitle: 'Sin azúcar, apto diabéticos', cta: 'Probalo', productImage: '/promos/fitcream-pote.webp' },
      { id: 'promo-kilo', eyebrow: 'A elección', title: '$12.000', subtitle: 'Kilo de helado · gustos a elección', cta: 'Pedir', image: '/promos/promo-kilo.webp' },
    ],
  };
}
