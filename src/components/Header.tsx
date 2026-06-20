import { Logo } from './Logo';

interface Props {
  count: number;
  onCartClick: () => void;
}

const NAV = ['Inicio', 'Categorías', 'Ofertas', 'Sin TACC'];

export function Header({ count, onCartClick }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-brand-red text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Logo className="h-11 w-11 border-2 border-white" />
        <span className="font-extrabold leading-tight md:hidden">Helados del Oeste</span>

        <nav className="ml-6 hidden flex-1 items-center gap-6 text-sm font-bold md:flex">
          {NAV.map((item) => (
            <a key={item} href="#" className="opacity-90 hover:opacity-100">
              {item}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={onCartClick}
          aria-label="Abrir mi pedido"
          className="relative ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-lg"
        >
          🛒
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
