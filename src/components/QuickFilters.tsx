export type QuickFilterKey = 'ofertas' | 'potes' | 'palitos' | 'sintacc';

const FILTERS: { key: QuickFilterKey; label: string; icon: string }[] = [
  { key: 'ofertas', label: 'Ofertas', icon: '/icons/oferta.webp' },
  { key: 'potes', label: 'Potes', icon: '/icons/potes.webp' },
  { key: 'palitos', label: 'Palitos', icon: '/icons/palitos.webp' },
  { key: 'sintacc', label: 'Sin TACC', icon: '/icons/sintacc.webp' },
];

interface Props {
  isActive: (key: QuickFilterKey) => boolean;
  onSelect: (key: QuickFilterKey) => void;
}

export function QuickFilters({ isActive, onSelect }: Props) {
  return (
    <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FILTERS.map(({ key, label, icon }) => {
        const active = isActive(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`flex min-w-[70px] flex-col items-center gap-1.5 rounded-2xl border px-2 py-2 text-center text-xs font-semibold transition ${
              active
                ? 'border-brand-red bg-brand-red/10 text-brand-red'
                : 'border-black/5 bg-white text-ink shadow-sm'
            }`}
          >
            <img src={icon} alt="" aria-hidden className="h-10 w-10 object-contain" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
