import type { Store } from '../types/catalog';
import { Logo } from './Logo';

interface Props {
  store: Store;
}

const COLUMNS = [
  { title: 'Productos', items: ['Potes', 'Palitos y Bombones', 'Postres', 'Tortas Heladas', 'Sin TACC'] },
  { title: 'Categorías', items: ['Ofertas', 'Más Vendidos', 'Nuevos Sabores', 'Sabores Destacados'] },
  { title: 'Ayuda', items: ['Preguntas Frecuentes', 'Formas de Pago', 'Envíos y Retiro', 'Términos y Condiciones'] },
];

const PAYMENTS = ['Visa', 'Mastercard', 'Maestro', 'MODO'];

export function Footer({ store }: Props) {
  return (
    <footer className="bg-navy px-4 py-8 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-5">
        <div className="md:col-span-1">
          <Logo className="h-16 w-16" />
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-2 text-sm font-extrabold">{col.title}</h3>
            <ul className="space-y-1 text-xs text-white/80">
              {col.items.map((it) => (
                <li key={it}>
                  <a href="#" className="hover:text-white">
                    {it}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-2 text-sm font-extrabold">Contacto</h3>
          <ul className="space-y-1 text-xs text-white/80">
            <li>📍 {store.address}</li>
            <li>📸 {store.instagram}</li>
            <li>📱 WhatsApp</li>
          </ul>
          <div className="mt-3 flex gap-3 text-lg">
            <span aria-label="Instagram">📸</span>
            <span aria-label="Facebook">📘</span>
            <span aria-label="TikTok">🎵</span>
            <span aria-label="YouTube">▶️</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/70 md:flex-row">
        <span>© 2026 {store.name}. Todos los derechos reservados.</span>
        <div className="flex gap-2">
          {PAYMENTS.map((p) => (
            <span key={p} className="rounded bg-white/10 px-2 py-1 font-semibold">
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
