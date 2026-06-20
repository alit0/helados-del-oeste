interface IconProps {
  className?: string;
}

function OfertasIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="10" fill="#E11B22" />
      <circle cx="12" cy="12" r="2.4" fill="#fff" />
      <circle cx="20" cy="20" r="2.4" fill="#fff" />
      <line x1="21" y1="9" x2="11" y2="23" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function PotesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M9 13a7 7 0 0 1 14 0z" fill="#E11B22" />
      <path d="M8 13h16l-1.4 12.4a2 2 0 0 1-2 1.8h-9.2a2 2 0 0 1-2-1.8z" fill="#16243F" />
    </svg>
  );
}

function PalitosIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(-12 11 14)">
        <rect x="7" y="4" width="8" height="15" rx="4" fill="#E11B22" />
        <rect x="10" y="18" width="2" height="9" rx="1" fill="#C99A5B" />
      </g>
      <g transform="rotate(12 21 14)">
        <rect x="17" y="4" width="8" height="15" rx="4" fill="#16243F" />
        <rect x="20" y="18" width="2" height="9" rx="1" fill="#C99A5B" />
      </g>
    </svg>
  );
}

function SinTaccIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g fill="#16243F">
        <line x1="16" y1="9" x2="16" y2="26" stroke="#16243F" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="12.5" cy="13" rx="2" ry="3" transform="rotate(-32 12.5 13)" />
        <ellipse cx="19.5" cy="13" rx="2" ry="3" transform="rotate(32 19.5 13)" />
        <ellipse cx="12.5" cy="18" rx="2" ry="3" transform="rotate(-32 12.5 18)" />
        <ellipse cx="19.5" cy="18" rx="2" ry="3" transform="rotate(32 19.5 18)" />
      </g>
      <line x1="7" y1="25" x2="25" y2="7" stroke="#E11B22" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export type QuickFilterKey = 'ofertas' | 'potes' | 'palitos' | 'sintacc';

const FILTERS: { key: QuickFilterKey; label: string; Icon: (p: IconProps) => JSX.Element }[] = [
  { key: 'ofertas', label: 'Ofertas', Icon: OfertasIcon },
  { key: 'potes', label: 'Potes', Icon: PotesIcon },
  { key: 'palitos', label: 'Palitos', Icon: PalitosIcon },
  { key: 'sintacc', label: 'Sin TACC', Icon: SinTaccIcon },
];

interface Props {
  isActive: (key: QuickFilterKey) => boolean;
  onSelect: (key: QuickFilterKey) => void;
}

export function QuickFilters({ isActive, onSelect }: Props) {
  return (
    <div className="flex justify-center gap-3 overflow-x-auto px-4 py-4">
      {FILTERS.map(({ key, label, Icon }) => {
        const active = isActive(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`flex min-w-[78px] flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 text-center text-xs font-semibold transition ${
              active
                ? 'border-brand-red bg-brand-red/10 text-brand-red'
                : 'border-black/5 bg-white text-ink shadow-sm'
            }`}
          >
            <Icon className="h-8 w-8" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
