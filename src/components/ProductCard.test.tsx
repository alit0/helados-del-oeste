import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';
import type { Product } from '../types/catalog';

const p: Product = {
  id: 'summun-frutilla',
  category: 'palitos-agua',
  name: 'Summun Frutilla',
  description: 'Helado de agua de frutilla.',
  priceUnit: 800,
  boxQty: 24,
  priceBox: 12000,
  tags: ['Sin Gluten'],
  imageUrl: null,
  status: 'activo',
  badge: 'Más vendido',
};

describe('ProductCard', () => {
  it('shows both unit and box prices and the Más vendido ribbon', () => {
    render(<ProductCard product={p} categoryColor="#E11B22" onAdd={() => {}} />);
    expect(screen.getByText('$800')).toBeInTheDocument();
    expect(screen.getByText('x24: $12.000')).toBeInTheDocument();
    expect(screen.getByText(/Más vendido/i)).toBeInTheDocument();
  });

  it('shows "Próximamente" for proximamente status and no add button', () => {
    render(<ProductCard product={{ ...p, status: 'proximamente' }} categoryColor="#E11B22" onAdd={() => {}} />);
    expect(screen.getByText(/Próximamente/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /agregar/i })).toBeNull();
  });

  it('shows "Consultá" when prices are null', () => {
    render(<ProductCard product={{ ...p, priceUnit: null, boxQty: null, priceBox: null }} categoryColor="#E11B22" onAdd={() => {}} />);
    expect(screen.getByText(/Consultá/i)).toBeInTheDocument();
  });

  it('calls onAdd when the add button is clicked', async () => {
    const onAdd = vi.fn();
    render(<ProductCard product={p} categoryColor="#E11B22" onAdd={onAdd} />);
    await userEvent.click(screen.getByRole('button', { name: /agregar/i }));
    expect(onAdd).toHaveBeenCalledWith(p);
  });
});
