import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductImage } from './ProductImage';

describe('ProductImage', () => {
  it('renders a placeholder when imageUrl is null', () => {
    render(<ProductImage imageUrl={null} name="Summun" categoryColor="#E11B22" />);
    expect(screen.getByTestId('product-placeholder')).toBeInTheDocument();
  });
  it('renders an img with lazy loading when imageUrl exists', () => {
    render(<ProductImage imageUrl="http://x/y.jpg" name="Summun" categoryColor="#E11B22" />);
    const img = screen.getByRole('img', { name: 'Summun' });
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
