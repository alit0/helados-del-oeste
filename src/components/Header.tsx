import { ShoppingCart } from 'lucide-react';
import { Logo } from './Logo';

interface Props {
  count: number;
  onCartClick: () => void;
  onSinTacc: () => void;
  sinTaccActive: boolean;
}

const LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Categorías', href: '#categorias' },
  { label: 'Ofertas', href: '#ofertas' },
];

export function Header({ count, onCartClick, onSinTacc, sinTaccActive }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-brand-red text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Logo className="h-12 w-12" />
        <span className="font-extrabold leading-tight md:hidden">Helados del Oeste</span>

        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-bold md:flex">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="opacity-90 transition hover:opacity-100">
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onSinTacc}
            aria-pressed={sinTaccActive}
            className={`transition hover:opacity-100 ${
              sinTaccActive ? 'underline decoration-2 underline-offset-4 opacity-100' : 'opacity-90'
            }`}
          >
            Sin TACC
          </button>
        </nav>

        <button
          type="button"
          onClick={onCartClick}
          aria-label="Abrir mi pedido"
          className="relative ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/15 md:ml-0"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-xs font-extrabold text-brand-red">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
