export interface OrderLine {
  name: string;
  modo: 'unidad' | 'caja';
  cantidad: number;
  precio: number; // price for the chosen modo (per unit or per box)
}

export function buildWhatsAppUrl(phone: string, lines: OrderLine[]): string {
  const digits = phone.replace(/\D/g, '');
  const body = lines
    .map(
      (l) =>
        `• ${l.name} (${l.modo}) x${l.cantidad} — $${(l.precio * l.cantidad).toLocaleString('es-AR')}`,
    )
    .join('\n');
  const total = lines.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const text = `¡Hola Helados del Oeste! Quiero hacer un pedido:\n\n${body}\n\nTotal estimado: $${total.toLocaleString('es-AR')}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
