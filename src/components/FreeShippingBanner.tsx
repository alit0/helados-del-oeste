import { money } from '../lib/format';

interface Props {
  threshold: number;
}

export function FreeShippingBanner({ threshold }: Props) {
  return (
    <div className="px-4 py-2">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-card bg-[#FBE9D8] px-4 py-3">
        <p className="text-sm font-bold text-ink">
          🚚 ENVÍO GRATIS{' '}
          <span className="font-semibold text-muted">
            en compras superiores a {money(threshold)}
          </span>
        </p>
        <button
          type="button"
          className="shrink-0 rounded-full bg-brand-red px-4 py-2 text-xs font-extrabold text-white"
        >
          Pedí ahora
        </button>
      </div>
    </div>
  );
}
