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

  it('adds or routes promos when clicking the whole actionable banner', () => {
    const onAdd = vi.fn();
    const onCategory = vi.fn();
    const priced: Promo = { id: 'box', title: '$12.000', subtitle: 'Caja x24', cta: 'Pedir', price: 12000 };
    const toCat: Promo = { id: 'fit', title: 'Fit Cream', subtitle: 'fit', cta: 'Probalo', categoryId: 'fit-cream' };
    render(<OfferBanner promos={[priced, toCat]} onAdd={onAdd} onCategory={onCategory} />);

    const pricedBanner = screen.getByText('$12.000').closest('[role="button"]');
    const categoryBanner = screen.getByText('Fit Cream').closest('[role="button"]');

    expect(pricedBanner).not.toBe(screen.getByText('Pedir'));
    expect(categoryBanner).not.toBe(screen.getByText('Probalo'));

    fireEvent.click(pricedBanner!);
    expect(onAdd).toHaveBeenCalledWith(priced);

    fireEvent.click(categoryBanner!);
    expect(onCategory).toHaveBeenCalledWith('fit-cream');
  });

  it('supports keyboard activation for actionable banners', () => {
    const onAdd = vi.fn();
    const onCategory = vi.fn();
    const priced: Promo = { id: 'box', title: '$12.000', subtitle: 'Caja x24', cta: 'Pedir', price: 12000 };
    const toCat: Promo = { id: 'fit', title: 'Fit Cream', subtitle: 'fit', cta: 'Probalo', categoryId: 'fit-cream' };
    render(<OfferBanner promos={[priced, toCat]} onAdd={onAdd} onCategory={onCategory} />);

    fireEvent.keyDown(screen.getByText('$12.000').closest('[role="button"]')!, { key: 'Enter' });
    expect(onAdd).toHaveBeenCalledWith(priced);

    fireEvent.keyDown(screen.getByText('Fit Cream').closest('[role="button"]')!, { key: ' ' });
    expect(onCategory).toHaveBeenCalledWith('fit-cream');
  });
});
