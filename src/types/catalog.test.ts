import { describe, it, expect } from 'vitest';
import { isConsulta, type Product } from './catalog';

const base: Product = {
  id: 'x',
  category: 'c',
  name: 'n',
  description: '',
  priceUnit: 800,
  boxQty: 24,
  priceBox: 12000,
  tags: [],
  imageUrl: null,
  status: 'activo',
  featured: false,
};

describe('isConsulta', () => {
  it('is true when priceBox is null and priceUnit is null', () => {
    expect(isConsulta({ ...base, priceUnit: null, priceBox: null })).toBe(true);
  });
  it('is false for a normal product', () => {
    expect(isConsulta(base)).toBe(false);
  });
});
