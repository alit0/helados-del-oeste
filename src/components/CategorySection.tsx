import type { Category, Product } from '../types/catalog';
import { ProductCard } from './ProductCard';
import { PESO_PRICES } from '../data/seed';
import { money } from '../lib/format';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  category: Category;
  products: Product[];
  color: string;
  onAdd: (p: Product) => void;
}

export function CategorySection({ category, products, color, onAdd }: Props) {
  if (products.length === 0) return null;
  const isPeso = category.id === 'sabores-peso';

  return (
    <section className="px-4 py-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold">
          <CategoryIcon id={category.id} className="h-5 w-5 text-brand-red" />
          {category.name}
        </h2>

        {isPeso && (
          <div className="mb-3 flex flex-wrap gap-2">
            {PESO_PRICES.map(([label, price]) => (
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
