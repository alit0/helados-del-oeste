# Helados del Oeste React Catalog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the slow Apps Script HTML catalog as a fast Vite + React + TypeScript SPA that looks like the mockups, reads its data through a swappable source (mock now, Apps Script JSON later), and lets customers build a WhatsApp order.

**Architecture:** A React SPA on Vercel consumes a `CatalogSource` abstraction. Today it resolves to a local mock seeded from `docs/catalogo.md`; when the real Google Sheet exists, setting `VITE_CATALOG_URL` switches it to an Apps Script endpoint that returns the same JSON contract — zero frontend changes. Order state lives client-side and is turned into a pre-filled WhatsApp message.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, Vitest + React Testing Library, Vercel.

---

## File Structure

```
helados-del-oeste/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ tailwind.config.ts
├─ postcss.config.js
├─ .env.example
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ index.css
│  ├─ types/catalog.ts            # Catalog, Product, Category, Store types
│  ├─ data/
│  │  ├─ catalogSource.ts         # CatalogSource interface + selector
│  │  ├─ mockSource.ts            # mock impl (seeded data)
│  │  ├─ appsScriptSource.ts      # fetch(VITE_CATALOG_URL) impl
│  │  └─ seed.ts                  # mock catalog data (from catalogo.md)
│  ├─ hooks/
│  │  ├─ useCatalog.ts            # fetch + cache (memory + localStorage)
│  │  └─ usePedido.ts             # order state + localStorage
│  ├─ lib/
│  │  ├─ format.ts                # money + box-label formatting
│  │  └─ whatsapp.ts             # build wa.me link from order
│  ├─ components/
│  │  ├─ Header.tsx
│  │  ├─ BottomNav.tsx
│  │  ├─ Hero.tsx
│  │  ├─ SearchBar.tsx
│  │  ├─ CategoryPills.tsx
│  │  ├─ OfferBanner.tsx
│  │  ├─ ProductCard.tsx
│  │  ├─ ProductImage.tsx        # img with placeholder fallback
│  │  ├─ CategorySection.tsx
│  │  ├─ FreeShippingBanner.tsx
│  │  ├─ Testimonials.tsx
│  │  ├─ Newsletter.tsx
│  │  ├─ Footer.tsx
│  │  └─ PedidoDrawer.tsx
│  └─ theme/tokens.ts             # design tokens mirrored from mockups
└─ apps-script/Code.gs            # JSON API (deployed when real Sheet exists)
```

---

## Task 1: Scaffold Vite + React + TS project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Scaffold with Vite**

Run from the project root:
```bash
npm create vite@latest . -- --template react-ts
```
If the directory is non-empty, choose "Ignore files and continue". Keep existing `docs/` and `.atl/`.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event
```

- [ ] **Step 3: Add the test script and jsdom env to `vite.config.ts`**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
```

- [ ] **Step 4: Create `src/setupTests.ts`**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 5: Add scripts to `package.json`**

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 6: Verify the app boots**

Run: `npm run dev`
Expected: dev server starts, default Vite page loads at the printed URL with no errors.

- [ ] **Step 7: Initialize git and commit**

```bash
git init
printf "node_modules\ndist\n.env\n.env.local\n" > .gitignore
git add -A
git commit -m "chore: scaffold vite react-ts project"
```

---

## Task 2: Install and configure Tailwind with design tokens

**Files:**
- Create: `tailwind.config.ts`, `postcss.config.js`, `src/theme/tokens.ts`
- Modify: `src/index.css`

- [ ] **Step 1: Install Tailwind**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: Define design tokens in `src/theme/tokens.ts`**

Values read from the mockups (`docs/*.png`).
```ts
export const tokens = {
  colors: {
    brandRed: '#E11B22',
    brandRedDark: '#B3141A',
    navy: '#16243F',
    cream: '#F6EFE7',
    cardWhite: '#FFFFFF',
    ink: '#1F2430',
    muted: '#6B7280',
  },
  radius: { card: '1rem', pill: '9999px' },
} as const;
```

- [ ] **Step 3: Configure `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';
import { tokens } from './src/theme/tokens';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { red: tokens.colors.brandRed, redDark: tokens.colors.brandRedDark },
        navy: tokens.colors.navy,
        cream: tokens.colors.cream,
        ink: tokens.colors.ink,
        muted: tokens.colors.muted,
      },
      borderRadius: { card: tokens.radius.card },
      fontFamily: { sans: ['Nunito', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 4: Replace `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

body { @apply bg-cream text-ink font-sans; }
```

- [ ] **Step 5: Smoke-check Tailwind**

Temporarily set `src/App.tsx` body to `<h1 className="text-brand-red text-3xl font-extrabold">Helados del Oeste</h1>`.
Run: `npm run dev`
Expected: red, bold, large heading on a cream background.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add tailwind and design tokens from mockups"
```

---

## Task 3: Define the catalog domain types

**Files:**
- Create: `src/types/catalog.ts`
- Test: `src/types/catalog.test.ts`

- [ ] **Step 1: Write the failing test (type-level + a guard)**

```ts
import { describe, it, expect } from 'vitest';
import { isConsulta, type Product } from './catalog';

const base: Product = {
  id: 'x', category: 'c', name: 'n', description: '',
  priceUnit: 800, boxQty: 24, priceBox: 12000,
  tags: [], imageUrl: null, status: 'activo', featured: false,
};

describe('isConsulta', () => {
  it('is true when priceBox is null and priceUnit is null', () => {
    expect(isConsulta({ ...base, priceUnit: null, priceBox: null })).toBe(true);
  });
  it('is false for a normal product', () => {
    expect(isConsulta(base)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- catalog`
Expected: FAIL — cannot find module './catalog'.

- [ ] **Step 3: Implement `src/types/catalog.ts`**

```ts
export type ProductStatus = 'activo' | 'proximamente';

export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  priceUnit: number | null;
  boxQty: number | null;
  priceBox: number | null;
  tags: string[];
  imageUrl: string | null;
  status: ProductStatus;
  featured: boolean;
}

export interface Category { id: string; name: string; icon: string; }

export interface Store {
  name: string;
  subtitle: string;
  address: string;
  instagram: string;
  whatsapp: string;
  freeShippingThreshold: number;
}

export interface Catalog {
  updatedAt: string;
  store: Store;
  categories: Category[];
  products: Product[];
}

export function isConsulta(p: Product): boolean {
  return p.priceUnit == null && p.priceBox == null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- catalog`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add catalog domain types"
```

---

## Task 4: Seed mock catalog data from catalogo.md

**Files:**
- Create: `src/data/seed.ts`
- Test: `src/data/seed.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { seedCatalog } from './seed';

describe('seedCatalog', () => {
  it('has the 10 categories from the catalog', () => {
    expect(seedCatalog.categories).toHaveLength(10);
  });
  it('includes Summun Frutilla with dual pricing', () => {
    const p = seedCatalog.products.find((x) => x.id === 'summun-frutilla');
    expect(p?.priceUnit).toBe(800);
    expect(p?.priceBox).toBe(12000);
    expect(p?.boxQty).toBe(24);
    expect(p?.tags).toContain('Sin Gluten');
  });
  it('marks por-peso flavors as Consulta (null prices)', () => {
    const p = seedCatalog.products.find((x) => x.id === 'peso-chocolate');
    expect(p?.priceUnit).toBeNull();
    expect(p?.priceBox).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- seed`
Expected: FAIL — cannot find module './seed'.

- [ ] **Step 3: Implement `src/data/seed.ts`**

Transcribe every product from `docs/catalogo.md`. Use slugged ids (`nombre` lowercased, spaces→`-`, accents stripped). The 10 categories and their icons:
```ts
import type { Catalog } from '../types/catalog';

export const seedCatalog: Catalog = {
  updatedAt: '2026-06-20',
  store: {
    name: 'Helados del Oeste',
    subtitle: 'La Montevideana',
    address: 'Blvd. J. M. de Rosas 102, Morón',
    instagram: '@heladosdeloesteok',
    whatsapp: '+5491100000000', // TODO replaced via Sheet later
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
    {
      id: 'summun-frutilla', category: 'palitos-agua', name: 'Summun Frutilla',
      description: 'Helado de agua de frutilla.', priceUnit: 800, boxQty: 24,
      priceBox: 12000, tags: ['Sin Gluten'], imageUrl: null, status: 'activo', featured: false,
    },
    // ... transcribe ALL remaining products from docs/catalogo.md the same way.
    // Por-peso flavors -> priceUnit/priceBox null, boxQty null, status 'activo'.
    {
      id: 'peso-chocolate', category: 'sabores-peso', name: 'Chocolate',
      description: 'Sabor por peso. Consultá.', priceUnit: null, boxQty: null,
      priceBox: null, tags: [], imageUrl: null, status: 'activo', featured: false,
    },
  ],
};
```
Note: the por-peso shared pricing (¼kg $4.000 / ½kg $6.000 / 1kg $10.000) is rendered as a header on that category section, not per-product — store it as a constant `export const PESO_PRICES = [['¼ kg', 4000], ['½ kg', 6000], ['1 kg', 10000]] as const;`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- seed`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: seed mock catalog data from catalogo.md"
```

---

## Task 5: CatalogSource abstraction + selector

**Files:**
- Create: `src/data/catalogSource.ts`, `src/data/mockSource.ts`, `src/data/appsScriptSource.ts`
- Test: `src/data/catalogSource.test.ts`
- Create: `.env.example`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { resolveSource } from './catalogSource';

describe('resolveSource', () => {
  it('returns mock source when url is empty', async () => {
    const src = resolveSource('');
    const cat = await src.getCatalog();
    expect(cat.categories.length).toBeGreaterThan(0);
  });
  it('returns apps-script source when url is set', () => {
    const src = resolveSource('https://example.com/exec');
    expect(src.kind).toBe('apps-script');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- catalogSource`
Expected: FAIL — cannot find module './catalogSource'.

- [ ] **Step 3: Implement the three files**

`src/data/catalogSource.ts`:
```ts
import type { Catalog } from '../types/catalog';
import { mockSource } from './mockSource';
import { appsScriptSource } from './appsScriptSource';

export interface CatalogSource {
  kind: 'mock' | 'apps-script';
  getCatalog(): Promise<Catalog>;
}

export function resolveSource(url: string | undefined): CatalogSource {
  return url && url.trim() ? appsScriptSource(url) : mockSource;
}
```

`src/data/mockSource.ts`:
```ts
import type { CatalogSource } from './catalogSource';
import { seedCatalog } from './seed';

export const mockSource: CatalogSource = {
  kind: 'mock',
  async getCatalog() {
    return seedCatalog;
  },
};
```

`src/data/appsScriptSource.ts`:
```ts
import type { Catalog } from '../types/catalog';
import type { CatalogSource } from './catalogSource';

export function appsScriptSource(url: string): CatalogSource {
  return {
    kind: 'apps-script',
    async getCatalog(): Promise<Catalog> {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Catalog fetch failed: ${res.status}`);
      return (await res.json()) as Catalog;
    },
  };
}
```

`.env.example`:
```
# Empty -> uses local mock data. Set to the deployed Apps Script /exec URL for live data.
VITE_CATALOG_URL=
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- catalogSource`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add swappable catalog source (mock + apps-script)"
```

---

## Task 6: useCatalog hook with caching

**Files:**
- Create: `src/hooks/useCatalog.ts`
- Test: `src/hooks/useCatalog.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCatalog } from './useCatalog';

describe('useCatalog', () => {
  it('starts loading then returns the catalog', async () => {
    const { result } = renderHook(() => useCatalog());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data?.categories.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- useCatalog`
Expected: FAIL — cannot find module './useCatalog'.

- [ ] **Step 3: Implement `src/hooks/useCatalog.ts`**

```ts
import { useEffect, useState } from 'react';
import type { Catalog } from '../types/catalog';
import { resolveSource } from '../data/catalogSource';

const CACHE_KEY = 'hdo.catalog.v1';

export function useCatalog() {
  const [data, setData] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let alive = true;
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try { setData(JSON.parse(cached) as Catalog); setLoading(false); } catch { /* ignore */ }
    }
    const source = resolveSource(import.meta.env.VITE_CATALOG_URL);
    source.getCatalog()
      .then((cat) => {
        if (!alive) return;
        setData(cat);
        localStorage.setItem(CACHE_KEY, JSON.stringify(cat));
        setError(null);
      })
      .catch((e) => { if (alive) setError(e as Error); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  return { data, loading, error };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- useCatalog`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useCatalog hook with localStorage cache"
```

---

## Task 7: Formatting + WhatsApp helpers

**Files:**
- Create: `src/lib/format.ts`, `src/lib/whatsapp.ts`
- Test: `src/lib/format.test.ts`, `src/lib/whatsapp.test.ts`

- [ ] **Step 1: Write the failing tests**

`src/lib/format.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { money, boxLabel } from './format';

describe('format', () => {
  it('formats money as AR pesos', () => {
    expect(money(12000)).toBe('$12.000');
    expect(money(800)).toBe('$800');
  });
  it('builds the box label', () => {
    expect(boxLabel(24, 12000)).toBe('x24: $12.000');
  });
});
```

`src/lib/whatsapp.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { buildWhatsAppUrl } from './whatsapp';

describe('buildWhatsAppUrl', () => {
  it('encodes the order into a wa.me link', () => {
    const url = buildWhatsAppUrl('+5491112345678', [
      { name: 'Summun Frutilla', modo: 'caja', cantidad: 2, precio: 12000 },
    ]);
    expect(url.startsWith('https://wa.me/5491112345678?text=')).toBe(true);
    expect(decodeURIComponent(url)).toContain('Summun Frutilla');
    expect(decodeURIComponent(url)).toContain('x2');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- format whatsapp`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `src/lib/format.ts`**

```ts
export function money(n: number): string {
  return '$' + n.toLocaleString('es-AR');
}

export function boxLabel(qty: number, priceBox: number): string {
  return `x${qty}: ${money(priceBox)}`;
}
```

- [ ] **Step 4: Implement `src/lib/whatsapp.ts`**

```ts
export interface OrderLine {
  name: string;
  modo: 'unidad' | 'caja';
  cantidad: number;
  precio: number; // unit price for the chosen modo
}

export function buildWhatsAppUrl(phone: string, lines: OrderLine[]): string {
  const digits = phone.replace(/\D/g, '');
  const body = lines
    .map((l) => `• ${l.name} (${l.modo}) x${l.cantidad} — $${(l.precio * l.cantidad).toLocaleString('es-AR')}`)
    .join('\n');
  const total = lines.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const text = `¡Hola Helados del Oeste! Quiero hacer un pedido:\n\n${body}\n\nTotal estimado: $${total.toLocaleString('es-AR')}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- format whatsapp`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add money/box formatting and whatsapp link builder"
```

---

## Task 8: usePedido hook (order state)

**Files:**
- Create: `src/hooks/usePedido.ts`
- Test: `src/hooks/usePedido.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePedido } from './usePedido';

beforeEach(() => localStorage.clear());

describe('usePedido', () => {
  it('adds, updates count, and removes lines', () => {
    const { result } = renderHook(() => usePedido());
    act(() => result.current.add({ id: 'a', name: 'Summun', modo: 'caja', precio: 12000 }));
    expect(result.current.lines).toHaveLength(1);
    expect(result.current.count).toBe(1);
    act(() => result.current.add({ id: 'a', name: 'Summun', modo: 'caja', precio: 12000 }));
    expect(result.current.lines[0].cantidad).toBe(2);
    act(() => result.current.remove('a', 'caja'));
    expect(result.current.lines).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- usePedido`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/hooks/usePedido.ts`**

```ts
import { useCallback, useEffect, useState } from 'react';

export interface PedidoLine {
  id: string; name: string; modo: 'unidad' | 'caja'; precio: number; cantidad: number;
}
type AddInput = Omit<PedidoLine, 'cantidad'>;

const KEY = 'hdo.pedido.v1';
const lineKey = (id: string, modo: string) => `${id}__${modo}`;

export function usePedido() {
  const [lines, setLines] = useState<PedidoLine[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as PedidoLine[]; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(lines)); }, [lines]);

  const add = useCallback((input: AddInput) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => lineKey(l.id, l.modo) === lineKey(input.id, input.modo));
      if (i === -1) return [...prev, { ...input, cantidad: 1 }];
      const next = [...prev];
      next[i] = { ...next[i], cantidad: next[i].cantidad + 1 };
      return next;
    });
  }, []);

  const remove = useCallback((id: string, modo: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l.id, l.modo) !== lineKey(id, modo)));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const count = lines.reduce((s, l) => s + l.cantidad, 0);

  return { lines, add, remove, clear, count };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- usePedido`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add usePedido order-state hook"
```

---

## Task 9: ProductImage with placeholder fallback

**Files:**
- Create: `src/components/ProductImage.tsx`
- Test: `src/components/ProductImage.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductImage } from './ProductImage';

describe('ProductImage', () => {
  it('renders a placeholder when imageUrl is null', () => {
    render(<ProductImage imageUrl={null} name="Summun" categoryColor="#E11B22" />);
    expect(screen.getByTestId('product-placeholder')).toBeInTheDocument();
  });
  it('renders an img with lazy loading when imageUrl exists', () => {
    render(<ProductImage imageUrl="http://x/y.jpg" name="Summun" categoryColor="#E11B22" />);
    const img = screen.getByRole('img', { name: 'Summun' });
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ProductImage`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/ProductImage.tsx`**

```tsx
interface Props { imageUrl: string | null; name: string; categoryColor: string; }

export function ProductImage({ imageUrl, name, categoryColor }: Props) {
  if (!imageUrl) {
    return (
      <div
        data-testid="product-placeholder"
        className="flex h-32 w-full items-center justify-center rounded-card"
        style={{ background: `${categoryColor}1A` }}
        aria-label={`${name} (imagen próximamente)`}
      >
        <span className="text-3xl" style={{ color: categoryColor }}>🍦</span>
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt={name}
      loading="lazy"
      decoding="async"
      className="h-32 w-full rounded-card object-cover"
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- ProductImage`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add ProductImage with placeholder fallback"
```

---

## Task 10: ProductCard (dual pricing, states, add button)

**Files:**
- Create: `src/components/ProductCard.tsx`
- Test: `src/components/ProductCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';
import type { Product } from '../types/catalog';

const p: Product = {
  id: 'summun-frutilla', category: 'palitos-agua', name: 'Summun Frutilla',
  description: 'Helado de agua de frutilla.', priceUnit: 800, boxQty: 24,
  priceBox: 12000, tags: ['Sin Gluten'], imageUrl: null, status: 'activo', featured: true,
};

describe('ProductCard', () => {
  it('shows both unit and box prices and the MÁS VENDIDO ribbon', () => {
    render(<ProductCard product={p} categoryColor="#E11B22" onAdd={() => {}} />);
    expect(screen.getByText('$800')).toBeInTheDocument();
    expect(screen.getByText('x24: $12.000')).toBeInTheDocument();
    expect(screen.getByText(/MÁS VENDIDO/i)).toBeInTheDocument();
  });
  it('shows "Próximamente" for proximamente status and no add button', () => {
    render(<ProductCard product={{ ...p, status: 'proximamente' }} categoryColor="#E11B22" onAdd={() => {}} />);
    expect(screen.getByText(/Próximamente/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /agregar/i })).toBeNull();
  });
  it('shows "Consultá" when prices are null', () => {
    render(<ProductCard product={{ ...p, priceUnit: null, priceBox: null }} categoryColor="#E11B22" onAdd={() => {}} />);
    expect(screen.getByText(/Consultá/i)).toBeInTheDocument();
  });
  it('calls onAdd when the add button is clicked', async () => {
    const onAdd = vi.fn();
    render(<ProductCard product={p} categoryColor="#E11B22" onAdd={onAdd} />);
    await userEvent.click(screen.getByRole('button', { name: /agregar/i }));
    expect(onAdd).toHaveBeenCalledWith(p);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ProductCard`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/ProductCard.tsx`**

```tsx
import type { Product } from '../types/catalog';
import { isConsulta } from '../types/catalog';
import { money, boxLabel } from '../lib/format';
import { ProductImage } from './ProductImage';

interface Props { product: Product; categoryColor: string; onAdd: (p: Product) => void; }

export function ProductCard({ product, categoryColor, onAdd }: Props) {
  const soon = product.status === 'proximamente';
  const consulta = isConsulta(product);

  return (
    <div className="relative rounded-card bg-cardWhite p-3 shadow-sm">
      {product.featured && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-extrabold text-white">
          MÁS VENDIDO
        </span>
      )}
      <ProductImage imageUrl={product.imageUrl} name={product.name} categoryColor={categoryColor} />
      <h3 className="mt-2 text-sm font-extrabold leading-tight">{product.name}</h3>
      {product.description && <p className="text-xs text-muted">{product.description}</p>}
      {product.tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {product.tags.map((t) => (
            <span key={t} className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold text-ink">{t}</span>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-end justify-between">
        <div>
          {soon ? (
            <span className="text-sm font-bold text-muted">Próximamente</span>
          ) : consulta ? (
            <span className="text-sm font-bold text-brand-red">Consultá</span>
          ) : (
            <>
              {product.priceUnit != null && <div className="text-base font-extrabold text-brand-red">{money(product.priceUnit)}</div>}
              {product.boxQty != null && product.priceBox != null && (
                <div className="text-xs text-muted">{boxLabel(product.boxQty, product.priceBox)}</div>
              )}
            </>
          )}
        </div>
        {!soon && !consulta && (
          <button
            type="button"
            aria-label={`Agregar ${product.name} al pedido`}
            onClick={() => onAdd(product)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-lg font-bold text-white"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- ProductCard`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add ProductCard with dual pricing and states"
```

---

## Task 11: Layout & presentational components (Header, Hero, CategoryPills, OfferBanner, banners, Footer)

**Files:**
- Create: `src/components/Header.tsx`, `BottomNav.tsx`, `Hero.tsx`, `SearchBar.tsx`, `CategoryPills.tsx`, `OfferBanner.tsx`, `FreeShippingBanner.tsx`, `Testimonials.tsx`, `Newsletter.tsx`, `Footer.tsx`
- Test: `src/components/CategoryPills.test.tsx`, `src/components/SearchBar.test.tsx`

> These are mostly presentational and styled to match `docs/*.png`. Only the two with logic get unit tests; the rest are verified in the Task 13 integration smoke test and the manual visual pass.

- [ ] **Step 1: Write the failing tests (the two with behavior)**

`src/components/CategoryPills.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryPills } from './CategoryPills';

const cats = [
  { id: 'palitos-agua', name: 'Palitos de Agua', icon: '🧊' },
  { id: 'potes-familiares', name: 'Potes Familiares', icon: '🪣' },
];

describe('CategoryPills', () => {
  it('renders a pill per category and reports selection', async () => {
    const onSelect = vi.fn();
    render(<CategoryPills categories={cats} selected={null} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button', { name: /Potes Familiares/i }));
    expect(onSelect).toHaveBeenCalledWith('potes-familiares');
  });
});
```

`src/components/SearchBar.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('emits the typed query', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText(/Buscar/i), 'frut');
    expect(onChange).toHaveBeenLastCalledWith('frut');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- CategoryPills SearchBar`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `CategoryPills.tsx` and `SearchBar.tsx`**

`src/components/CategoryPills.tsx`:
```tsx
import type { Category } from '../types/catalog';

interface Props { categories: Category[]; selected: string | null; onSelect: (id: string | null) => void; }

export function CategoryPills({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3">
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(selected === c.id ? null : c.id)}
          className={`flex min-w-[64px] flex-col items-center gap-1 rounded-card border px-3 py-2 text-xs font-semibold ${
            selected === c.id ? 'border-brand-red bg-brand-red/10 text-brand-red' : 'border-transparent bg-cardWhite text-ink'
          }`}
        >
          <span className="text-xl">{c.icon}</span>
          {c.name}
        </button>
      ))}
    </div>
  );
}
```

`src/components/SearchBar.tsx`:
```tsx
interface Props { value: string; onChange: (v: string) => void; }

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="px-4">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar sabores, promos más..."
        className="w-full rounded-full bg-cardWhite px-4 py-3 text-sm shadow-sm outline-none"
      />
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- CategoryPills SearchBar`
Expected: PASS (2 tests).

- [ ] **Step 5: Implement the remaining presentational components**

Build to match the mockups (`docs/*.png`). Keep each focused and prop-driven:

`Header.tsx` — red bar; logo badge left; desktop nav links (Inicio, Categorías, Ofertas, Sin TACC) right; cart icon with `count` badge. Accepts `{ count, onCartClick }`.
`BottomNav.tsx` — mobile only (`md:hidden`): Inicio, Categoría, Mis compras, Carrito(`count`). Accepts `{ count, onCartClick }`.
`Hero.tsx` — red panel, "Armá tu antojo" + subtitle, decorative ice-cream art area (placeholder block). Renders `SearchBar` underneath.
`OfferBanner.tsx` — navy panel, "OFERTA DEL DÍA -20% EN POTES SELECCIONADOS", "VER OFERTA" button, dot indicators. Static single slide for v1 (carousel optional later). Accepts `{ featured: Product[] }` to show product art.
`FreeShippingBanner.tsx` — cream/peach strip "ENVÍO GRATIS en compras superiores a $25.000" + "Pedí ahora". Accepts `{ threshold }`.
`Testimonials.tsx` — "Lo que dicen nuestros clientes", 3 static cards with name + stars (hardcode 3 sample reviews).
`Newsletter.tsx` — red strip "Sumate a las promos" + email input + "Suscribirme" (no backend; preventDefault, show inline thanks).
`Footer.tsx` — navy footer: logo, columns (Productos/Categorías/Ayuda/Contacto), payment badges (Visa/Mastercard/Maestro/MODO as text/emoji chips), social icons. Accepts `{ store }`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add layout and presentational components"
```

---

## Task 12: PedidoDrawer (unidad/caja choice + WhatsApp)

**Files:**
- Create: `src/components/PedidoDrawer.tsx`
- Test: `src/components/PedidoDrawer.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PedidoDrawer } from './PedidoDrawer';
import type { PedidoLine } from '../hooks/usePedido';

const lines: PedidoLine[] = [
  { id: 'summun-frutilla', name: 'Summun Frutilla', modo: 'caja', precio: 12000, cantidad: 2 },
];

describe('PedidoDrawer', () => {
  it('lists lines and links to WhatsApp with the order', () => {
    render(
      <PedidoDrawer open lines={lines} whatsapp="+5491112345678" onClose={() => {}} onRemove={() => {}} />
    );
    expect(screen.getByText('Summun Frutilla')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /WhatsApp/i }) as HTMLAnchorElement;
    expect(link.href).toContain('wa.me/5491112345678');
    expect(decodeURIComponent(link.href)).toContain('Summun Frutilla');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- PedidoDrawer`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/components/PedidoDrawer.tsx`**

```tsx
import type { PedidoLine } from '../hooks/usePedido';
import { money } from '../lib/format';
import { buildWhatsAppUrl } from '../lib/whatsapp';

interface Props {
  open: boolean;
  lines: PedidoLine[];
  whatsapp: string;
  onClose: () => void;
  onRemove: (id: string, modo: string) => void;
}

export function PedidoDrawer({ open, lines, whatsapp, onClose, onRemove }: Props) {
  if (!open) return null;
  const total = lines.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const waUrl = buildWhatsAppUrl(whatsapp, lines.map((l) => ({ name: l.name, modo: l.modo, cantidad: l.cantidad, precio: l.precio })));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside className="flex h-full w-full max-w-sm flex-col bg-cream p-4" onClick={(e) => e.stopPropagation()}>
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Mi pedido</h2>
          <button type="button" aria-label="Cerrar" onClick={onClose} className="text-2xl">×</button>
        </header>

        {lines.length === 0 ? (
          <p className="text-muted">Tu pedido está vacío.</p>
        ) : (
          <ul className="flex-1 space-y-2 overflow-y-auto">
            {lines.map((l) => (
              <li key={`${l.id}-${l.modo}`} className="flex items-center justify-between rounded-card bg-cardWhite p-3">
                <div>
                  <p className="text-sm font-bold">{l.name}</p>
                  <p className="text-xs text-muted">{l.modo} · x{l.cantidad} · {money(l.precio * l.cantidad)}</p>
                </div>
                <button type="button" aria-label={`Quitar ${l.name}`} onClick={() => onRemove(l.id, l.modo)} className="text-brand-red">Quitar</button>
              </li>
            ))}
          </ul>
        )}

        <footer className="mt-3">
          <div className="mb-2 flex justify-between text-sm font-extrabold">
            <span>Total estimado</span><span>{money(total)}</span>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={lines.length === 0}
            className={`block rounded-full px-4 py-3 text-center font-extrabold text-white ${lines.length ? 'bg-brand-red' : 'pointer-events-none bg-muted'}`}
          >
            Pedir por WhatsApp
          </a>
        </footer>
      </aside>
    </div>
  );
}
```
> Note: `modo` (unidad/caja) is chosen at add-time in the ProductCard add flow (Task 13 wires a small inline choice or defaults to `unidad` with a toggle). The drawer displays the chosen `modo` per line.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- PedidoDrawer`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add PedidoDrawer with WhatsApp order link"
```

---

## Task 13: Assemble App (filtering, sections, wiring) + integration smoke test

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/CategorySection.tsx`
- Test: `src/App.test.tsx`

- [ ] **Step 1: Write the failing integration test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('loads the catalog and filters by search', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText('Summun Frutilla')).toBeInTheDocument());
    expect(screen.getByText('Palitos de Agua')).toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText(/Buscar/i), 'almendrado');
    await waitFor(() => expect(screen.getByText('Almendrado')).toBeInTheDocument());
    expect(screen.queryByText('Summun Frutilla')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- App`
Expected: FAIL — App not assembled / sections missing.

- [ ] **Step 3: Implement `src/components/CategorySection.tsx`**

```tsx
import type { Category, Product } from '../types/catalog';
import { ProductCard } from './ProductCard';

interface Props {
  category: Category;
  products: Product[];
  color: string;
  onAdd: (p: Product) => void;
}

export function CategorySection({ category, products, color, onAdd }: Props) {
  if (products.length === 0) return null;
  return (
    <section className="px-4 py-4">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold">
        <span>{category.icon}</span> {category.name}
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} categoryColor={color} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement `src/App.tsx`**

```tsx
import { useMemo, useState } from 'react';
import { useCatalog } from './hooks/useCatalog';
import { usePedido } from './hooks/usePedido';
import { tokens } from './theme/tokens';
import type { Product } from './types/catalog';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Hero } from './components/Hero';
import { CategoryPills } from './components/CategoryPills';
import { OfferBanner } from './components/OfferBanner';
import { FreeShippingBanner } from './components/FreeShippingBanner';
import { CategorySection } from './components/CategorySection';
import { Testimonials } from './components/Testimonials';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { PedidoDrawer } from './components/PedidoDrawer';

export default function App() {
  const { data, loading, error } = useCatalog();
  const pedido = usePedido();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.products.filter((p) => {
      const matchesCat = !selectedCat || p.category === selectedCat;
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [data, query, selectedCat]);

  const onAdd = (p: Product) => {
    // v1: default modo 'unidad' if a unit price exists, else 'caja'
    const modo = p.priceUnit != null ? 'unidad' : 'caja';
    const precio = modo === 'unidad' ? p.priceUnit! : p.priceBox!;
    pedido.add({ id: p.id, name: p.name, modo, precio });
    setDrawerOpen(true);
  };

  if (loading && !data) return <div className="p-8 text-center">Cargando catálogo…</div>;
  if (error && !data) return <div className="p-8 text-center text-brand-red">No se pudo cargar el catálogo.</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header count={pedido.count} onCartClick={() => setDrawerOpen(true)} />
      <Hero query={query} onQuery={setQuery} />
      <CategoryPills categories={data.categories} selected={selectedCat} onSelect={setSelectedCat} />
      <OfferBanner featured={data.products.filter((p) => p.featured)} />
      <FreeShippingBanner threshold={data.store.freeShippingThreshold} />

      {data.categories
        .filter((c) => !selectedCat || c.id === selectedCat)
        .map((c) => (
          <CategorySection
            key={c.id}
            category={c}
            products={filtered.filter((p) => p.category === c.id)}
            color={tokens.colors.brandRed}
            onAdd={onAdd}
          />
        ))}

      <Testimonials />
      <Newsletter />
      <Footer store={data.store} />
      <BottomNav count={pedido.count} onCartClick={() => setDrawerOpen(true)} />
      <PedidoDrawer
        open={drawerOpen}
        lines={pedido.lines}
        whatsapp={data.store.whatsapp}
        onClose={() => setDrawerOpen(false)}
        onRemove={pedido.remove}
      />
    </div>
  );
}
```
> If `Hero` was defined with `SearchBar` inside, give it `{ query, onQuery }` props and pass them to `SearchBar`. Adjust prop names if Task 11 used different ones — keep them consistent.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- App`
Expected: PASS (1 test).

- [ ] **Step 6: Run the full suite + build**

Run: `npm test && npm run build`
Expected: all tests PASS; build succeeds with no type errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: assemble app with filtering, sections, and order drawer"
```

---

## Task 14: Visual pass against mockups

**Files:** none (manual + adjustments to existing components)

- [ ] **Step 1: Run the app**

Run: `npm run dev`

- [ ] **Step 2: Compare side by side with `docs/*.png`**

Open the mobile mockup (`hf_20260618_...png`) and the desktop mockup (`hf_20260620_145735_...png`). Verify: header color/logo, hero copy "Armá tu antojo", category pills row, navy offer banner, product card layout (image, name, dual price, red "+"), "MÁS VENDIDO" ribbon, free-shipping strip, testimonials, newsletter, footer with payment badges, bottom-nav on mobile / top-nav on desktop.

- [ ] **Step 3: Adjust spacing/colors/typography** in the relevant component files until it matches closely. Keep `tokens.ts` as the single source for colors.

- [ ] **Step 4: Verify responsive breakpoints**

Resize from 375px → 768px → 1280px. Grid should go 2 → 3 → 4 columns; nav should switch from bottom to top at `md`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "style: match mockups (spacing, colors, typography)"
```

---

## Task 15: Apps Script JSON API (for when the real Sheet exists)

**Files:**
- Create: `apps-script/Code.gs`
- Create: `apps-script/README.md`

> This is the backend deployed later, when the owner provides the real Sheet. It is not wired into the frontend until `VITE_CATALOG_URL` is set. No automated test (Apps Script runs in Google's runtime); validation is manual via the deployment URL.

- [ ] **Step 1: Write `apps-script/Code.gs`**

```js
const SHEET_NAME = 'Catalogo';
const CACHE_KEY = 'catalog_json';
const CACHE_SECONDS = 300;

function doGet() {
  const cache = CacheService.getScriptCache();
  let json = cache.get(CACHE_KEY);
  if (!json) {
    json = JSON.stringify(buildCatalog());
    cache.put(CACHE_KEY, json, CACHE_SECONDS);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function slug(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function num(v) { return v === '' || v == null ? null : Number(v); }

function buildCatalog() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  rows.shift(); // header

  const categoryNames = [];
  const products = rows.filter((r) => r[0] && r[1]).map((r) => {
    const [categoria, nombre, descripcion, precioUnidad, cajaCantidad, precioCaja, etiquetas, imagenUrl, estado, destacado] = r;
    if (categoryNames.indexOf(categoria) === -1) categoryNames.push(categoria);
    return {
      id: slug(nombre),
      category: slug(categoria),
      name: String(nombre),
      description: String(descripcion || ''),
      priceUnit: num(precioUnidad),
      boxQty: num(cajaCantidad),
      priceBox: num(precioCaja),
      tags: String(etiquetas || '').split(',').map((t) => t.trim()).filter(Boolean),
      imageUrl: imagenUrl ? String(imagenUrl) : null,
      status: String(estado || 'activo').toLowerCase() === 'proximamente' ? 'proximamente' : 'activo',
      featured: String(destacado || '').toLowerCase() === 'sí' || String(destacado).toLowerCase() === 'si',
    };
  });

  const categories = categoryNames.map((name) => ({ id: slug(name), name: name, icon: '🍦' }));

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
```

- [ ] **Step 2: Write `apps-script/README.md`**

Document: create a sheet named `Catalogo` with the columns from the spec (in order); paste `Code.gs`; deploy as Web App (Execute as: me, Access: anyone); copy the `/exec` URL; set `VITE_CATALOG_URL` to it in Vercel; redeploy. Note that icons default to 🍦 and can be mapped per category later if desired.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add apps-script json api for live sheet data"
```

---

## Task 16: Deploy to Vercel from GitHub

**Files:**
- Create: `README.md` (project root)

- [ ] **Step 1: Write a root `README.md`**

Cover: what the app is, `npm install` / `npm run dev` / `npm test`, the `VITE_CATALOG_URL` env var (empty = mock, set = live), and the `apps-script/` deployment pointer.

- [ ] **Step 2: Create the GitHub repo and push**

```bash
gh repo create helados-del-oeste --public --source=. --remote=origin --push
```

- [ ] **Step 3: Import the repo in Vercel**

In the Vercel dashboard: New Project → import `helados-del-oeste` → framework preset "Vite" → leave `VITE_CATALOG_URL` empty for now → Deploy.

- [ ] **Step 4: Verify the deployment**

Open the Vercel URL. Expected: the catalog renders from mock data, looks like the mockups, and the WhatsApp order opens `wa.me` with the order text.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: add project readme"
git push
```

---

## Self-Review Notes

- **Spec coverage:** architecture (Tasks 1–2, 5–6), JSON contract (Tasks 3, 15), Sheet schema (Task 15), swappable source (Task 5), dual pricing (Tasks 7, 10), WhatsApp order (Tasks 7, 12), all components (Tasks 9–13), placeholders (Task 9), design fidelity (Tasks 2, 11, 14), testing (each task), migration/deploy (Tasks 15–16). All spec sections covered.
- **Type consistency:** `Product`/`Category`/`Store`/`Catalog` defined in Task 3 and reused verbatim; `CatalogSource.getCatalog()` consistent across Tasks 5–6; `PedidoLine`/`add`/`remove` consistent across Tasks 8, 12, 13; `OrderLine` (whatsapp) maps from `PedidoLine` fields in Task 12.
- **Known follow-up (not a blocker):** unidad/caja is defaulted at add-time in v1 (Task 13). A richer in-card modo selector can be added later without schema changes.
```
