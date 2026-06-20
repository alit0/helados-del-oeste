import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
