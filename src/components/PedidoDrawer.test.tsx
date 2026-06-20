import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PedidoDrawer } from './PedidoDrawer';
import type { PedidoLine } from '../hooks/usePedido';

const lines: PedidoLine[] = [
  { id: 'summun-frutilla', name: 'Summun Frutilla', modo: 'caja', precio: 12000, cantidad: 2 },
];

describe('PedidoDrawer', () => {
  it('lists lines and links to WhatsApp with the order', () => {
    render(
      <PedidoDrawer open lines={lines} whatsapp="+5491112345678" onClose={() => {}} onRemove={() => {}} />,
    );
    expect(screen.getByText('Summun Frutilla')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /WhatsApp/i }) as HTMLAnchorElement;
    expect(link.href).toContain('wa.me/5491112345678');
    expect(decodeURIComponent(link.href)).toContain('Summun Frutilla');
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <PedidoDrawer open={false} lines={lines} whatsapp="+5491112345678" onClose={() => {}} onRemove={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
