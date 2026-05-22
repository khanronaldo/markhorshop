export interface ColorVariant {
  colorName: string;
  hex: string;
  imgUrl: string;
}

export interface DbVariant {
  id: string;
  product_id: string;
  color: string;
  color_code: string;
  size: string;
  stock: number;
  price?: number | null;
  main_image?: string | null;
  gallery_images?: string[];
}

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  reviewer_name: string;
  comment: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string; // Alias for title (or holds primary text)
  title?: string; // Supabase column name
  category: 'men' | 'women' | 'kids';
  subcategory: 'essentials' | 'streetwear' | 'accessories';
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  colorImagesList?: ColorVariant[];
  badge?: string;
  description: string;
  shipping: string;
  specifications: Record<string, string>;
  gallery?: string[];
  stock?: number;
  variants?: DbVariant[];
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  colorImage?: string;
}

export interface Leader {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export type ViewType = 'home' | 'shop' | 'product' | 'about' | 'contact' | 'checkout' | 'admin';
