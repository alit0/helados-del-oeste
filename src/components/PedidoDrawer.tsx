import type { PedidoLine } from '../hooks/usePedido';
import { money } from '../lib/format';
import { buildWhatsAppUrl } from '../lib/whatsapp';

interface Props {
  open: boolean;
  lines: PedidoLine[];
  whatsapp: string;
  onClose: () => void;
  onRemove: (id: string, modo: string) => void;
}

export function PedidoDrawer({ open, lines, whatsapp, onClose, onRemove }: Props) {
  if (!open) return null;

  const total = lines.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const waUrl = buildWhatsAppUrl(
    whatsapp,
    lines.map((l) => ({ name: l.name, modo: l.modo, cantidad: l.cantidad, precio: l.precio })),
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        className="flex h-full w-full max-w-sm flex-col bg-cream p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Mi pedido</h2>
          <button type="button" aria-label="Cerrar" onClick={onClose} className="text-2xl leading-none">
            ×
          </button>
        </header>

        {lines.length === 0 ? (
          <p className="text-muted">Tu pedido está vacío.</p>
        ) : (
          <ul className="flex-1 space-y-2 overflow-y-auto">
            {lines.map((l) => (
              <li
                key={`${l.id}-${l.modo}`}
                className="flex items-center justify-between rounded-card bg-cardWhite p-3"
              >
                <div>
                  <p className="text-sm font-bold">{l.name}</p>
                  <p className="text-xs text-muted">
                    {l.modo} · x{l.cantidad} · {money(l.precio * l.cantidad)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Quitar ${l.name}`}
                  onClick={() => onRemove(l.id, l.modo)}
                  className="text-sm font-semibold text-brand-red"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer className="mt-3">
          <div className="mb-2 flex justify-between text-sm font-extrabold">
            <span>Total estimado</span>
            <span>{money(total)}</span>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={lines.length === 0}
            className={`block rounded-full px-4 py-3 text-center font-extrabold text-white ${
              lines.length ? 'bg-brand-red' : 'pointer-events-none bg-muted'
            }`}
          >
            Pedir por WhatsApp
          </a>
        </footer>
      </aside>
    </div>
  );
}
