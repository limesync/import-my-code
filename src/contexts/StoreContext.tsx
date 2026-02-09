import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, Order, HeroSlide } from '@/types/store';
import { sampleProducts, sampleOrders, sampleHeroSlides } from '@/data/sampleProducts';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  heroSlides: HeroSlide[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateOrder: (order: Order) => void;
  updateHeroSlides: (slides: HeroSlide[]) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  activeProducts: Product[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadFromStorage('store_products', sampleProducts));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage('store_orders', sampleOrders));
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => loadFromStorage('store_hero', sampleHeroSlides));

  useEffect(() => { localStorage.setItem('store_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('store_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('store_hero', JSON.stringify(heroSlides)); }, [heroSlides]);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateOrder = useCallback((order: Order) => {
    setOrders(prev => prev.map(o => o.id === order.id ? order : o));
  }, []);

  const updateHeroSlides = useCallback((slides: HeroSlide[]) => {
    setHeroSlides(slides);
  }, []);

  const getProductBySlug = useCallback((slug: string) => products.find(p => p.slug === slug), [products]);
  const getProductById = useCallback((id: string) => products.find(p => p.id === id), [products]);
  const activeProducts = products.filter(p => p.status === 'active');

  return (
    <StoreContext.Provider value={{
      products, orders, heroSlides,
      addProduct, updateProduct, deleteProduct,
      updateOrder, updateHeroSlides,
      getProductBySlug, getProductById, activeProducts,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
