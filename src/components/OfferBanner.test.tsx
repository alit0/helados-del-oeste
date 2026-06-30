import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OfferBanner } from './OfferBanner';
import type { Promo } from '../types/catalog';

const promos: Promo[] = [
  { id: 'a', title: '-20%', subtitle: 'en potes' },
  { id: 'b', title: '2x1', subtitle: 'en palitos' },
  { id: 'c', title: 'Nuevo', subtitle: 'fit cream' },
];

describe('OfferBanner', () => {
  it('renders every promo and one dot per slide', () => {
    render(<OfferBanner promos={promos} />);
    expect(screen.getByText('-20%')).toBeInTheDocument();
    expect(screen.getByText('2x1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ir a la promo 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ir a la promo 3' })).toBeInTheDocument();
  });

  it('renders nothing when there are no promos', () => {
    const { container } = render(<OfferBanner promos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('adds a priced promo to the cart via its CTA, and routes a category promo', () => {
    const onAdd = vi.fn();
    const onCategory = vi.fn();
    const priced: Promo = { id: 'box', title: '$12.000', subtitle: 'Caja x24', cta: 'Pedir', price: 12000 };
    const toCat: Promo = { id: 'fit', title: 'Fit Cream', subtitle: 'fit', cta: 'Probalo', categoryId: 'fit-cream' };
    render(<OfferBanner promos={[priced, toCat]} onAdd={onAdd} onCategory={onCategory} />);

    fireEvent.click(screen.getByRole('button', { name: 'Pedir' }));
    expect(onAdd).toHaveBeenCalledWith(priced);

    fireEvent.click(screen.getByRole('button', { name: 'Probalo' }));
    expect(onCategory).toHaveBeenCalledWith('fit-cream');
  });
});
