import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface AdminProduct {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  variants: AdminVariant[];
  images: AdminImage[];
}

export interface AdminVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  inventory: number;
  options: Json | null;
}

export interface AdminImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number | null;
}

export function useAdminProducts() {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch variants and images for all products
      const productIds = productsData.map(p => p.id);
      
      if (productIds.length === 0) {
        return [] as AdminProduct[];
      }

      const [variantsResult, imagesResult] = await Promise.all([
        supabase.from('product_variants').select('*').in('product_id', productIds),
        supabase.from('product_images').select('*').in('product_id', productIds).order('sort_order'),
      ]);

      const variantsByProduct: Record<string, AdminVariant[]> = {};
      (variantsResult.data || []).forEach(v => {
        if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
        variantsByProduct[v.product_id].push(v as AdminVariant);
      });

      const imagesByProduct: Record<string, AdminImage[]> = {};
      (imagesResult.data || []).forEach(img => {
        if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id] = [];
        imagesByProduct[img.product_id].push(img as AdminImage);
      });

      return productsData.map(p => ({
        ...p,
        variants: variantsByProduct[p.id] || [],
        images: imagesByProduct[p.id] || [],
      })) as AdminProduct[];
    },
  });

  const createProduct = useMutation({
    mutationFn: async (product: {
      title: string;
      slug: string;
      description?: string;
      category?: string;
      tags?: string[];
      status?: string;
      variants: Omit<AdminVariant, 'id' | 'product_id'>[];
      images: { url: string; alt?: string }[];
    }) => {
      // Create product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          title: product.title,
          slug: product.slug,
          description: product.description,
          category: product.category,
          tags: product.tags || [],
          status: product.status || 'draft',
        })
        .select()
        .single();

      if (productError) throw productError;

      // Create variants
      if (product.variants.length > 0) {
        const { error: variantsError } = await supabase
          .from('product_variants')
          .insert(product.variants.map(v => ({
            product_id: newProduct.id,
            name: v.name,
            sku: v.sku,
            price: v.price,
            compare_at_price: v.compare_at_price,
            inventory: v.inventory,
            options: v.options,
          })));

        if (variantsError) throw variantsError;
      }

      // Create images
      if (product.images.length > 0) {
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(product.images.map((img, i) => ({
            product_id: newProduct.id,
            url: img.url,
            alt: img.alt || product.title,
            sort_order: i,
          })));

        if (imagesError) throw imagesError;
      }

      return newProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produkt oprettet');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Kunne ikke oprette produkt');
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AdminProduct> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update({
          title: updates.title,
          slug: updates.slug,
          description: updates.description,
          category: updates.category,
          tags: updates.tags,
          status: updates.status,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produkt opdateret');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Kunne ikke opdatere produkt');
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Produkt slettet');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Kunne ikke slette produkt');
    },
  });

  const updateVariant = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AdminVariant> & { id: string }) => {
      const { data, error } = await supabase
        .from('product_variants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const createVariant = useMutation({
    mutationFn: async (variant: Omit<AdminVariant, 'id'>) => {
      const { data, error } = await supabase
        .from('product_variants')
        .insert(variant)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const deleteVariant = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    updateVariant,
    createVariant,
    deleteVariant,
  };
}

export function useAdminProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      if (!id || id === 'ny') return null;

      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) throw productError;

      const [variantsResult, imagesResult] = await Promise.all([
        supabase.from('product_variants').select('*').eq('product_id', id),
        supabase.from('product_images').select('*').eq('product_id', id).order('sort_order'),
      ]);

      return {
        ...product,
        variants: variantsResult.data || [],
        images: imagesResult.data || [],
      } as AdminProduct;
    },
    enabled: !!id && id !== 'ny',
  });
}
