import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  inventory: number;
  options: Record<string, string>;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  tags: string[];
  status: string;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
  images: ProductImage[];
}

// Static images mapping (since we have local assets)
import nordicSandImg from '@/assets/product-nordic-sand.jpg';
import forestDreamImg from '@/assets/product-forest-dream.jpg';
import autumnGlowImg from '@/assets/product-autumn-glow.jpg';
import blushBloomImg from '@/assets/product-blush-bloom.jpg';
import coastalStripeImg from '@/assets/product-coastal-stripe.jpg';
import midnightGoldImg from '@/assets/product-midnight-gold.jpg';

const productImages: Record<string, string> = {
  'nordic-sand': nordicSandImg,
  'forest-dream': forestDreamImg,
  'autumn-glow': autumnGlowImg,
  'blush-bloom': blushBloomImg,
  'coastal-stripe': coastalStripeImg,
  'midnight-gold': midnightGoldImg,
};

export function getProductImage(slug: string): string {
  return productImages[slug] || '/placeholder.svg';
}

export function useProducts(status: 'active' | 'all' = 'active') {
  return useQuery({
    queryKey: ['products', status],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from('products')
        .select(`
          *,
          variants:product_variants(*),
          images:product_images(*)
        `)
        .order('created_at', { ascending: false });

      if (status === 'active') {
        query = query.eq('status', 'active');
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Product[];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          variants:product_variants(*),
          images:product_images(*)
        `)
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data as Product;
    },
    enabled: !!slug,
  });
}

export function useProductsByCategory(category: string | null) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from('products')
        .select(`
          *,
          variants:product_variants(*),
          images:product_images(*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Product[];
    },
  });
}

export function getLowestPrice(variants: ProductVariant[]): number {
  if (!variants.length) return 0;
  return Math.min(...variants.map(v => v.price));
}

export function getCompareAtPrice(variants: ProductVariant[]): number | null {
  const withCompare = variants.filter(v => v.compare_at_price);
  if (!withCompare.length) return null;
  return Math.min(...withCompare.map(v => v.compare_at_price!));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}