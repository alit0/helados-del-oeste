import type { Category, PesoPrice, Product } from '../types/catalog';
import { ProductCard } from './ProductCard';
import { PESO_PRICES } from '../data/seed';
import { money } from '../lib/format';

interface Props {
  category: Category;
  products: Product[];
  color: string;
  onAdd: (p: Product) => void;
  /** Per-weight pricing from the catalog; falls back to PESO_PRICES when absent. */
  pesoPrices?: PesoPrice[];
}

export function CategorySection({ category, products, color, onAdd, pesoPrices }: Props) {
  if (products.length === 0) return null;
  const isPeso = category.id === 'sabores-por-peso';
  const pesoTiers = pesoPrices && pesoPrices.length > 0 ? pesoPrices : PESO_PRICES;

  return (
    <section id={`cat-${category.id}`} className="scroll-mt-24 px-4 py-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-lg font-extrabold">{category.name}</h2>

        {isPeso && (
          <div className="mb-3 flex flex-wrap gap-2">
            {pesoTiers.map(([label, price]) => (
              <span
                key={label}
                className="rounded-full bg-cardWhite px-3 py-1 text-sm font-bold text-brand-red shadow-sm"
              >
                {label} {money(price)}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} categoryColor={color} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}
