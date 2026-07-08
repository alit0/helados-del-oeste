export type ProductStatus = 'activo' | 'proximamente';

export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  priceUnit: number | null;
  boxQty: number | null;
  priceBox: number | null;
  tags: string[];
  imageUrl: string | null;
  status: ProductStatus;
  badge: string | null;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Store {
  name: string;
  subtitle: string;
  address: string;
  instagram: string;
  whatsapp: string;
  freeShippingThreshold: number;
}

export interface Promo {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  cta?: string;
  bg?: string;
  image?: string;
  /** Transparent product render shown floating on the side of the banner. */
  productImage?: string;
  /** When set, the CTA adds this promo to the cart at this price (modo "caja"). */
  price?: number;
  /** When set (and no price), the CTA navigates to this category instead. */
  categoryId?: string;
}

/** A "Sabores por Peso" tier: [label, price] e.g. ['¼ kg', 4500]. Read live from the master Sheet's HDO-P00 row. */
export type PesoPrice = [string, number];

export interface Catalog {
  updatedAt: string;
  store: Store;
  categories: Category[];
  products: Product[];
  promos?: Promo[];
  /** Per-weight pricing for "Sabores por Peso", sourced from the Sheet (row HDO-P00). */
  pesoPrices?: PesoPrice[];
}

export function isConsulta(p: Product): boolean {
  return p.priceUnit == null && p.priceBox == null;
}
