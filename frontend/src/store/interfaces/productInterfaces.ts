export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  // images: File[];
  images: string[];
  userId: string;
}

export interface ProductState {
  products: Product[];
  status: 'idle' | 'loading' | 'loaded' | 'error';
  error: string;
}
