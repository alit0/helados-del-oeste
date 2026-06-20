import type { Product } from '../types/catalog';

interface Props {
  featured: Product[];
}

export function OfferBanner({ featured }: Props) {
  const sample = featured.slice(0, 2);
  return (
    <div className="px-4 py-2">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-card bg-navy p-5 text-white">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-white/70">
            Oferta del día
          </span>
          <p className="mt-1 text-3xl font-black leading-none">-20%</p>
          <p className="mt-1 text-sm font-semibold">en potes seleccionados</p>
          <button
            type="button"
            className="mt-3 rounded-full bg-brand-red px-4 py-2 text-xs font-extrabold"
          >
            Ver oferta
          </button>
        </div>
        <div className="hidden gap-2 sm:flex" aria-hidden>
          {sample.map((p) => (
            <div
              key={p.id}
              className="flex h-24 w-20 items-center justify-center rounded-card bg-white/10 text-3xl"
            >
              🍨
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
