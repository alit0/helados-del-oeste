import { MapPin, AtSign, MessageCircle } from 'lucide-react';
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

const SOCIALS: { name: string; href: string; path: string }[] = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/heladosdeloesteok/',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/heladosdeloesteok/',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
];

function SocialLinks() {
  return (
    <div className="flex gap-3">
      {SOCIALS.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}

export function Footer({ store }: Props) {
  return (
    <footer className="bg-navy px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          <div className="col-span-2 flex flex-col items-start gap-3 md:col-span-1">
            <Logo className="h-16 w-16" />
            <SocialLinks />
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
            <ul className="space-y-1.5 text-xs text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {store.address}
              </li>
              <li className="flex items-center gap-2">
                <AtSign className="h-4 w-4 shrink-0" />
                {store.instagram}
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=5491154792502&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/70 md:flex-row">
          <span>© 2026 {store.name}. Todos los derechos reservados.</span>
          <div className="flex gap-2">
            {PAYMENTS.map((p) => (
              <span key={p} className="rounded bg-white/10 px-2 py-1 font-semibold">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
