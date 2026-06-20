import { Home, LayoutGrid, ShoppingBag, ShoppingCart } from 'lucide-react';

interface Props {
  count: number;
  onCartClick: () => void;
}

export function BottomNav({ count, onCartClick }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around bg-brand-red px-2 py-2 text-white md:hidden">
      <a href="#inicio" className="flex flex-col items-center gap-0.5 text-[11px] font-semibold">
        <Home className="h-5 w-5" />
        Inicio
      </a>
      <a href="#categorias" className="flex flex-col items-center gap-0.5 text-[11px] font-semibold">
        <LayoutGrid className="h-5 w-5" />
        Categoría
      </a>
      <a href="#ofertas" className="flex flex-col items-center gap-0.5 text-[11px] font-semibold">
        <ShoppingBag className="h-5 w-5" />
        Promos
      </a>
      <button
        type="button"
        onClick={onCartClick}
        aria-label="Abrir mi pedido"
        className="relative flex flex-col items-center gap-0.5 text-[11px] font-semibold"
      >
        <ShoppingCart className="h-5 w-5" />
        Carrito
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-extrabold text-brand-red">
            {count}
          </span>
        )}
      </button>
    </nav>
  );
}
