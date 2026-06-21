// Converts the Helados del Oeste master Google Sheet (exported as CSV) into the
// Catalog JSON the React app consumes. Run: node scripts/build-catalog.mjs <csv> <out>
import fs from 'node:fs';

const csvPath = process.argv[2] ?? '/tmp/hdo_sheet.csv';
const outPath = process.argv[3] ?? 'src/data/catalog.json';

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* ignore */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const stripEmoji = (s) =>
  s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '');

const slug = (s) =>
  stripEmoji(String(s))
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const money = (v) => {
  const n = String(v).replace(/[^0-9]/g, '');
  return n === '' ? null : Number(n);
};

const ICONS = {
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

const rows = parseCSV(fs.readFileSync(csvPath, 'utf8'));

const categories = [];
const seenCat = new Set();
const products = [];

for (const r of rows) {
  const cod = (r[0] ?? '').trim();
  if (!/^HDO-/i.test(cod)) continue; // skip titles + category/subsection separators
  if (cod.toUpperCase() === 'HDO-P00') continue; // "por peso" master row (prices shown as section header)

  const categoria = (r[1] ?? '').trim();
  const nombre = (r[2] ?? '').trim();
  const descripcion = (r[3] ?? '').trim();
  const imagen = (r[4] ?? '').trim();
  const disponible = (r[8] ?? '').trim().toUpperCase();
  const etiqueta = (r[9] ?? '').trim();
  if (!categoria || !nombre) continue;
  if (disponible === 'NO') continue; // hide unavailable products

  const catId = slug(categoria);
  if (!seenCat.has(catId)) {
    seenCat.add(catId);
    categories.push({ id: catId, name: categoria, icon: ICONS[catId] ?? '🍦' });
  }

  const proximamente = /pr[oó]ximamente/i.test(descripcion);
  const tags = etiqueta
    .split(',')
    .map((t) => t.trim().replace(/\.+$/, ''))
    .filter(Boolean);

  products.push({
    id: slug(cod),
    category: catId,
    name: nombre,
    description: descripcion,
    priceUnit: money(r[5]),
    boxQty: r[6] && String(r[6]).trim() ? Number(String(r[6]).replace(/[^0-9]/g, '')) : null,
    priceBox: money(r[7]),
    tags,
    imageUrl: imagen || (catId === 'sabores-por-peso' ? `/sabores/${slug(cod)}.webp` : null),
    status: proximamente ? 'proximamente' : 'activo',
    badge: (r[11] ?? '').trim() || null, // column L "DESTACADO": Más vendido | Nuevo | Oferta
  });
}

const catalog = {
  updatedAt: new Date().toISOString().slice(0, 10),
  store: {
    name: 'Helados del Oeste',
    subtitle: 'La Montevideana',
    address: 'Blvd. Juan Manuel de Rosas 102, Morón',
    instagram: '@heladosdeloesteok',
    whatsapp: '+5491154792502',
    freeShippingThreshold: 25000,
  },
  categories,
  products,
  promos: [
    { id: 'promo-potes', eyebrow: 'Oferta del día', title: '-20%', subtitle: 'en potes seleccionados', cta: 'Ver oferta', image: '/promos/promo-potes.webp' },
    { id: 'promo-2x1', eyebrow: 'Solo esta semana', title: '2x1', subtitle: 'en palitos de agua', cta: 'Aprovechá', image: '/promos/promo-2x1.webp' },
    { id: 'promo-fit', eyebrow: 'Nuevo', title: 'Fit Cream', subtitle: 'sin azúcar, apto diabéticos', cta: 'Probalo', image: '/promos/promo-fit.webp' },
    { id: 'promo-combo', eyebrow: 'Combo familiar', title: '3L + Postre', subtitle: 'a precio especial', cta: 'Ver combo', image: '/promos/promo-combo.webp' },
  ],
};

fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2));
console.log(`Wrote ${outPath}: ${categories.length} categories, ${products.length} products`);
