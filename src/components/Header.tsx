import { useState } from 'react';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';
import type { Category } from '../types/catalog';

interface Props {
  count: number;
  onCartClick: () => void;
  onSinTacc: () => void;
  sinTaccActive: boolean;
  categories: Category[];
  onCategory: (id: string) => void;
}

export function Header({
  count,
  onCartClick,
  onSinTacc,
  sinTaccActive,
  categories,
  onCategory,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 hidden bg-brand-red text-white shadow-md md:block">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Logo className="h-12 w-12" />

        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-bold md:flex">
          <a href="#inicio" className="opacity-90 transition hover:opacity-100">
            Inicio
          </a>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="flex items-center gap-1 opacity-90 transition hover:opacity-100"
            >
              Categorías
              <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                <div className="absolute left-1/2 z-20 mt-2 max-h-[70vh] w-56 -translate-x-1/2 overflow-y-auto rounded-xl bg-white py-2 text-ink shadow-xl">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onCategory(c.id);
                        setOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm font-semibold hover:bg-cream"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <a href="#ofertas" className="opacity-90 transition hover:opacity-100">
            Ofertas
          </a>
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
