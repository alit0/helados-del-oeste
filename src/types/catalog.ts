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
  featured: boolean;
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
}

export interface Catalog {
  updatedAt: string;
  store: Store;
  categories: Category[];
  products: Product[];
  promos?: Promo[];
}

export function isConsulta(p: Product): boolean {
  return p.priceUnit == null && p.priceBox == null;
}
