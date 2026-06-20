import type { Product } from '../types/catalog';
import { isConsulta } from '../types/catalog';
import { money, boxLabel } from '../lib/format';
import { ProductImage } from './ProductImage';

interface Props {
  product: Product;
  categoryColor: string;
  onAdd: (p: Product) => void;
}

export function ProductCard({ product, categoryColor, onAdd }: Props) {
  const soon = product.status === 'proximamente';
  const consulta = isConsulta(product);

  return (
    <div className="relative flex flex-col rounded-card bg-cardWhite p-3 shadow-sm">
      {product.featured && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
          Más vendido
        </span>
      )}

      <ProductImage imageUrl={product.imageUrl} name={product.name} categoryColor={categoryColor} />

      <h3 className="mt-2 text-sm font-extrabold leading-tight">{product.name}</h3>
      {product.description && (
        <p className="mt-0.5 line-clamp-2 text-xs text-muted">{product.description}</p>
      )}

      {product.tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {product.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold text-ink"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-end justify-between pt-2">
        <div>
          {soon ? (
            <span className="text-sm font-bold text-muted">Próximamente</span>
          ) : consulta ? (
            <span className="text-sm font-bold text-brand-red">Consultá</span>
          ) : (
            <>
              {product.priceUnit != null && (
                <div className="text-base font-extrabold text-brand-red">
                  {money(product.priceUnit)}
                </div>
              )}
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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red text-xl font-bold leading-none text-white transition hover:bg-brand-redDark"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
