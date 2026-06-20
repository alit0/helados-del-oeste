import type { Catalog, Product, ProductStatus } from '../types/catalog';

/** Shared pricing for the "Sabores por Peso" section (rendered as a section header). */
export const PESO_PRICES = [
  ['¼ kg', 4000],
  ['½ kg', 6000],
  ['1 kg', 10000],
] as const;

interface Opts {
  id: string;
  tags?: string[];
  status?: ProductStatus;
  featured?: boolean;
}

function mk(
  category: string,
  name: string,
  description: string,
  priceUnit: number | null,
  boxQty: number | null,
  priceBox: number | null,
  opts: Opts,
): Product {
  return {
    id: opts.id,
    category,
    name,
    description,
    priceUnit,
    boxQty,
    priceBox,
    tags: opts.tags ?? [],
    imageUrl: null,
    status: opts.status ?? 'activo',
    featured: opts.featured ?? false,
  };
}

const SG = ['Sin Gluten'];
const FIT = ['Sin Gluten', 'Apto diabéticos'];

// Sabores por peso: all "Consultá" (null prices).
const pesoFlavors: Array<[string, string]> = [
  ['peso-chocolate', 'Chocolate'],
  ['peso-chocolate-bariloche', 'Chocolate Bariloche'],
  ['peso-chocotorta', 'Chocotorta'],
  ['peso-chocolate-dubai', 'Chocolate Dubai'],
  ['peso-chocolate-almendras', 'Chocolate con Almendras'],
  ['peso-3-chocolates', '3 Chocolates'],
  ['peso-super-dulce-de-leche', 'Super Dulce de Leche'],
  ['peso-dulce-de-leche-granizado', 'Dulce de Leche Granizado'],
  ['peso-dulce-de-leche', 'Dulce de Leche'],
  ['peso-dulce-de-leche-de-la-casa', 'Dulce de Leche de la Casa'],
  ['peso-dulce-de-leche-bombon', 'Dulce de Leche Bombón'],
  ['peso-granizado', 'Granizado'],
  ['peso-menta-granizado', 'Menta Granizado'],
  ['peso-americana', 'Americana'],
  ['peso-crema-del-cielo', 'Crema del Cielo'],
  ['peso-frutilla-a-la-crema', 'Frutilla a la Crema'],
  ['peso-chantilly-con-frutilla', 'Chantilly con Frutilla'],
  ['peso-vainilla', 'Vainilla'],
  ['peso-frutilla-cadbury', 'Frutilla Cadbury'],
  ['peso-crema-patagonica', 'Crema Patagónica'],
  ['peso-banana-split', 'Banana Split'],
  ['peso-superflan', 'SuperFlan'],
  ['peso-mascarpone-frutos-rojos', 'Mascarpone con frutos rojos'],
  ['peso-crema-nutelina', 'Crema Nutelina'],
  ['peso-tramontana', 'Tramontana'],
  ['peso-mantecol', 'Mantecol'],
  ['peso-limon', 'Limón'],
  ['peso-naranja-mango', 'Naranja/Mango'],
  ['peso-frutilla-kiwi', 'Frutilla/Kiwi'],
  ['peso-anana', 'Ananá'],
  ['peso-limon-frutillas-maceradas', 'Limón con Frutillas Maceradas'],
];

export const seedCatalog: Catalog = {
  updatedAt: '2026-06-20',
  store: {
    name: 'Helados del Oeste',
    subtitle: 'La Montevideana',
    address: 'Blvd. J. M. de Rosas 102, Morón',
    instagram: '@heladosdeloesteok',
    whatsapp: '+5491100000000', // replaced via Sheet later
    freeShippingThreshold: 25000,
  },
  categories: [
    { id: 'palitos-agua', name: 'Palitos de Agua', icon: '🧊' },
    { id: 'palitos-crema', name: 'Palitos de Crema', icon: '🍦' },
    { id: 'bombones-premium', name: 'Bombones y Premium', icon: '🍫' },
    { id: 'vasitos-copas', name: 'Vasitos y Copas', icon: '🥤' },
    { id: 'potes-individuales', name: 'Potes Individuales', icon: '🍨' },
    { id: 'potes-familiares', name: 'Potes Familiares', icon: '🪣' },
    { id: 'postres-tortas', name: 'Postres y Tortas', icon: '🎂' },
    { id: 'especiales', name: 'Especiales', icon: '⭐' },
    { id: 'fit-cream', name: 'Fit Cream', icon: '💪' },
    { id: 'sabores-peso', name: 'Sabores por Peso', icon: '🍦' },
  ],
  products: [
    // ── Palitos de Agua ────────────────────────────────────────────────
    mk('palitos-agua', 'Summun 3 Mix Frutilla Manzana Ananá', 'Helado de agua de frutilla, manzana y ananá.', 800, 24, 12000, { id: 'summun-3-mix-frutilla-manzana-anana', tags: SG }),
    mk('palitos-agua', 'Summun Mix Frutilla - Limón', 'Helado de agua de frutilla y limón.', 800, 24, 12000, { id: 'summun-mix-frutilla-limon', tags: SG }),
    mk('palitos-agua', 'Summun Mix Naranja - Ananá', 'Helado de agua de naranja y ananá.', 800, 24, 12000, { id: 'summun-mix-naranja-anana', tags: SG }),
    mk('palitos-agua', 'Summun Frutilla', 'Helado de agua de frutilla.', 800, 24, 12000, { id: 'summun-frutilla', tags: SG, featured: true }),
    mk('palitos-agua', 'Summun Limón', 'Helado de agua de limón.', 800, 24, 12000, { id: 'summun-limon', tags: SG }),
    mk('palitos-agua', 'Do2', 'Helado de agua de frutilla relleno con crema americana.', 1000, 35, 22500, { id: 'do2' }),
    mk('palitos-agua', 'Do2 Extrem', 'Manzana ácida + Tutti Frutti, súper ácido.', 1000, 35, 22500, { id: 'do2-extrem' }),
    mk('palitos-agua', 'UP Mont', 'Helado de agua de uva y tutti frutti.', 800, 35, 17000, { id: 'up-mont', tags: SG }),
    mk('palitos-agua', 'Frutis Frutilla', 'Helado de agua de frutilla.', 1500, 24, 28000, { id: 'frutis-frutilla' }),
    mk('palitos-agua', 'Zum Mix', 'Próximamente.', 900, 24, 12000, { id: 'zum-mix', status: 'proximamente' }),

    // ── Palitos de Crema ───────────────────────────────────────────────
    mk('palitos-crema', 'bugyKids', 'Helado de crema americana y frutilla.', 1200, 24, 17500, { id: 'bugykids' }),
    mk('palitos-crema', 'Cabito Dulce de Leche Granizado', 'Helado de dulce de leche granizado.', 1400, 24, 20500, { id: 'cabito-dulce-de-leche-granizado', featured: true }),
    mk('palitos-crema', 'Cabito Granizado', 'Helado de granizado.', 1400, 24, 20500, { id: 'cabito-granizado' }),
    mk('palitos-crema', 'Cabito Chocolate - Dulce de Leche', 'Helado de chocolate y dulce de leche.', 1200, 24, 17500, { id: 'cabito-chocolate-dulce-de-leche' }),
    mk('palitos-crema', 'Palito Bombón', 'Helado de vainilla con baño de chocolate.', 1500, 35, 33000, { id: 'palito-bombon' }),
    mk('palitos-crema', 'Frutilla cremoso', 'Palito de crema frutilla cremoso.', 1200, 24, 16500, { id: 'frutilla-cremoso' }),
    mk('palitos-crema', 'Ouch! Helado dona', 'Palito de crema helado dona.', 1900, 20, 24000, { id: 'ouch-helado-dona' }),
    mk('palitos-crema', 'Bombón Croc!', 'Palito de crema.', 1500, 24, 23000, { id: 'bombon-croc-palito' }),

    // ── Bombones y Premium ─────────────────────────────────────────────
    mk('bombones-premium', 'Bombón Croc', 'Helado de americana con baño de chocolate y crocante de maní.', 1500, 24, 23000, { id: 'bombon-croc' }),
    mk('bombones-premium', 'Tuo Americana', 'Helado de americana con baño de chocolate y crocante de maní.', 2900, 12, 23000, { id: 'tuo-americana' }),
    mk('bombones-premium', 'Tuo Dulce de Leche', 'Helado de dulce de leche relleno con dulce de leche, con baño de chocolate.', 2900, 12, 23000, { id: 'tuo-dulce-de-leche', featured: true }),
    mk('bombones-premium', 'Tuo Blanco', 'Helado de chocolate relleno con dulce de leche, con baño de chocolate blanco.', 2900, 12, 23000, { id: 'tuo-blanco' }),
    mk('bombones-premium', 'Cuore Twist Triple Choc', 'Chocolate y chocolate blanco con baño de chocolate con almendras.', 2500, 15, 24500, { id: 'cuore-twist-triple-choc' }),
    mk('bombones-premium', 'Cuore Twist Caramel', 'Caramelo y dulce de leche con baño de chocolate blanco.', 2500, 15, 24500, { id: 'cuore-twist-caramel' }),
    mk('bombones-premium', 'Cono Bola', '', 2500, 12, 20000, { id: 'cono-bola' }),
    mk('bombones-premium', 'Alfajor Helado', 'Americana y dulce de leche relleno de DDL sobre tapa de alfajor, con baño de chocolate.', 2200, 16, 22500, { id: 'alfajor-helado' }),
    mk('bombones-premium', 'Alfajor Triple Fantoche helado negro', '', 2500, 16, 26500, { id: 'alfajor-triple-fantoche-negro' }),
    mk('bombones-premium', 'Alfajor Triple Fantoche helado blanco', '', 2500, 16, 26500, { id: 'alfajor-triple-fantoche-blanco' }),

    // ── Vasitos y Copas ────────────────────────────────────────────────
    mk('vasitos-copas', 'Caribe Dulce de Leche', 'Vainilla y dulce de leche con salsa de dulce de leche.', 2600, 12, 21500, { id: 'caribe-dulce-de-leche', tags: SG, featured: true }),
    mk('vasitos-copas', 'Caribe Frutilla', 'Frutilla y americana con salsa de frutilla.', 2600, 12, 21500, { id: 'caribe-frutilla', tags: SG }),
    mk('vasitos-copas', 'Caribe Chocolate', 'Chocolate y americana con salsa de dulce de leche y chips.', 2600, 12, 21500, { id: 'caribe-chocolate', tags: SG }),
    mk('vasitos-copas', 'Copa Jamaica Frutilla', 'Americana con salsa de frutilla.', 1800, 18, 21000, { id: 'copa-jamaica-frutilla' }),
    mk('vasitos-copas', 'Copa Jamaica Dulce de Leche', 'Americana con salsa de dulce de leche.', 1800, 18, 21000, { id: 'copa-jamaica-dulce-de-leche' }),
    mk('vasitos-copas', 'Midi Super Flan', '', 1800, 18, 20000, { id: 'midi-super-flan' }),

    // ── Potes Individuales ─────────────────────────────────────────────
    mk('potes-individuales', 'Pinta Choco Alpino', 'Chocolate con dulce de leche y chips de chocolate blanco.', 5000, 6, 26000, { id: 'pinta-choco-alpino' }),
    mk('potes-individuales', 'Pinta Dulce de Leche Granizado', 'Dulce de leche granizado con dulce de leche.', 5000, 6, 26000, { id: 'pinta-dulce-de-leche-granizado', featured: true }),
    mk('potes-individuales', 'Pinta Super Flan', 'Vainilla con dulce de leche y salsa de caramelo.', 5000, 6, 26000, { id: 'pinta-super-flan' }),
    mk('potes-individuales', 'Pinta Frutilla Francesa', 'Frutilla con frutillas maceradas y salsa de frutilla.', 5000, 6, 26000, { id: 'pinta-frutilla-francesa' }),

    // ── Potes Familiares ───────────────────────────────────────────────
    mk('potes-familiares', 'Limón 1 Litro', 'Helado de agua de limón.', 8000, 6, 39000, { id: 'limon-1-litro', tags: SG }),
    mk('potes-familiares', 'Chocolate - Dulce de Leche Granizado 1 Litro', 'Chocolate y dulce de leche granizado.', 8000, 6, 39000, { id: 'choco-ddl-granizado-1l', tags: SG }),
    mk('potes-familiares', 'Frutilla - Granizado 1 Litro', 'Frutilla y granizado.', 8000, 6, 39000, { id: 'frutilla-granizado-1l', tags: SG }),
    mk('potes-familiares', 'Chocolate - DDL Granizado - Frutilla - Americana 3 Litros', 'Dulce de leche granizado, chocolate, americana y frutilla.', 16000, 3, 38000, { id: 'choco-ddl-frutilla-americana-3l' }),
    mk('potes-familiares', 'Flan - DDL - Frutilla - Granizado 3 Litros', 'Flan, frutilla, dulce de leche y granizado.', 16000, 3, 38000, { id: 'flan-ddl-frutilla-granizado-3l', tags: SG }),
    mk('potes-familiares', 'Flan - DDL - Frutilla - Granizado 5 Litros', 'Flan, frutilla, dulce de leche y granizado.', 22500, 2, 35000, { id: 'flan-ddl-frutilla-granizado-5l', tags: SG }),
    mk('potes-familiares', 'Chocolate - DDL Granizado - Frutilla - Americana 5 Litros', 'Dulce de leche granizado, chocolate, americana y frutilla.', 22500, 2, 35000, { id: 'choco-ddl-frutilla-americana-5l' }),

    // ── Postres y Tortas ───────────────────────────────────────────────
    mk('postres-tortas', 'Barra Chocotorta', 'Dulce de leche y chocotorta, con dulce de leche y galletitas. Rinde 9 porciones.', 10500, 6, 50000, { id: 'barra-chocotorta' }),
    mk('postres-tortas', 'Barra Frutilla con Merengues', 'Frutilla y chantilly con salsa de frutilla y merengues. Rinde 9 porciones.', 10500, 6, 50000, { id: 'barra-frutilla-merengues' }),
    mk('postres-tortas', 'Barra Chocolate Intenso', 'Chocolate y granizado con salsa de chocolate. Rinde 9 porciones.', 10500, 6, 50000, { id: 'barra-chocolate-intenso' }),
    mk('postres-tortas', 'Barra Almendrado', 'Almendrado con crocante de maní y almendras. Rinde 9 porciones.', 10500, 6, 50000, { id: 'barra-almendrado' }),
    mk('postres-tortas', 'Almendrado', 'Almendrado con crocante de maní. 20 unidades.', 23800, 1, 23800, { id: 'almendrado' }),
    mk('postres-tortas', 'Escocés', 'Chocolate y americana relleno de dulce de leche, con baño de chocolate y crocante de maní. 16 unidades.', 23400, 1, 23400, { id: 'escoces' }),
    mk('postres-tortas', 'Mixto', 'Vainilla, frutilla y chocolate. 20 unidades.', 18300, 1, 18300, { id: 'mixto' }),
    mk('postres-tortas', 'Suizo', 'Americana y dulce de leche con baño de chocolate. 20 unidades.', 27400, 1, 27400, { id: 'suizo' }),
    mk('postres-tortas', 'Torta Bomba Dulce de Leche', 'Dulce de leche y americana con salsa de dulce de leche y gotas de chocolate.', 18000, 4, 58000, { id: 'torta-bomba-dulce-de-leche' }),
    mk('postres-tortas', 'Torta del Bosque', 'Chocolate y americana con salsa de frutos rojos y chocolate.', 18000, 4, 58000, { id: 'torta-del-bosque' }),

    // ── Especiales ─────────────────────────────────────────────────────
    mk('especiales', 'Bombones Dulce de Leche', 'Dulce de leche con baño de chocolate, con forma de corazón.', 5800, 6, 29500, { id: 'bombones-dulce-de-leche' }),
    mk('especiales', 'Super DDL', 'Dulce de leche con dulce de leche y merengues.', 9000, 6, 39000, { id: 'super-ddl', featured: true }),
    mk('especiales', 'Cookies & Cream', 'Americana con dulce de leche y galletitas reales.', 9000, 6, 50000, { id: 'cookies-and-cream' }),
    mk('especiales', 'Choco Super Torta', 'Próximamente.', 9000, 6, 50000, { id: 'choco-super-torta', status: 'proximamente' }),
    mk('especiales', 'Chocolate Shock', 'Próximamente.', 9000, 6, 50000, { id: 'chocolate-shock', status: 'proximamente' }),

    // ── Fit Cream ──────────────────────────────────────────────────────
    mk('fit-cream', 'Fit Cream Banana - Dulce de Leche', 'Sin azúcar de dulce de leche y banana con dulce de leche.', 7000, 6, 35000, { id: 'fit-cream-banana-ddl', tags: FIT }),
    mk('fit-cream', 'Fit Cream Chocolate Amargo - Mascarpone', 'Sin azúcar de chocolate y mascarpone con salsa de frutilla.', 7000, 6, 35000, { id: 'fit-cream-choco-mascarpone', tags: FIT }),
    mk('fit-cream', 'Fit Cream Volcán de Chocolate - Frutilla', 'Sin azúcar de frutilla y chocolate con salsa de chocolate.', 7000, 6, 35000, { id: 'fit-cream-volcan-frutilla', tags: FIT }),

    // ── Sabores por Peso (Consultá) ────────────────────────────────────
    ...pesoFlavors.map(([id, name]) =>
      mk('sabores-peso', name, 'Sabor por peso. Consultá.', null, null, null, { id }),
    ),
  ],
};
