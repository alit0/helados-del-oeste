import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategorySection } from './CategorySection';
import type { Category, PesoPrice, Product } from '../types/catalog';

const category: Category = { id: 'sabores-por-peso', name: 'Sabores por Peso', icon: '⚖️' };

const product: Product = {
  id: 'hdo-p02',
  category: 'sabores-por-peso',
  name: 'Chocolate',
  description: 'Chocolate tradicional',
  priceUnit: null,
  boxQty: null,
  priceBox: null,
  tags: [],
  imageUrl: null,
  status: 'activo',
  badge: null,
};

describe('CategorySection — Sabores por Peso pricing', () => {
  it('renders per-weight tiers from the catalog pesoPrices', () => {
    const pesoPrices: PesoPrice[] = [
      ['¼ kg', 4500],
      ['½ kg', 7000],
      ['1 kg', 12000],
    ];
    render(
      <CategorySection
        category={category}
        products={[product]}
        color="#E11B22"
        onAdd={() => {}}
        pesoPrices={pesoPrices}
      />,
    );
    expect(screen.getByText(/¼ kg/)).toHaveTextContent('$4.500');
    expect(screen.getByText(/½ kg/)).toHaveTextContent('$7.000');
    expect(screen.getByText(/1 kg/)).toHaveTextContent('$12.000');
  });

  it('falls back to PESO_PRICES when the catalog omits pesoPrices', () => {
    render(
      <CategorySection category={category} products={[product]} color="#E11B22" onAdd={() => {}} />,
    );
    // Fallback still renders the three weight tiers.
    expect(screen.getByText(/¼ kg/)).toBeInTheDocument();
    expect(screen.getByText(/½ kg/)).toBeInTheDocument();
    expect(screen.getByText(/1 kg/)).toBeInTheDocument();
  });
});
