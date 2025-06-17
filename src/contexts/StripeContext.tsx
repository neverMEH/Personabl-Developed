import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getActiveSubscriptions, getProducts } from '../lib/stripe';
import type { Subscription, Product, ProductPrice } from '../lib/supabase';

interface StripeContextType {
  subscriptions: Subscription[];
  products: (Product & { prices: ProductPrice[] })[];
  isLoading: boolean;
  refreshSubscriptions: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [products, setProducts] = useState<(Product & { prices: ProductPrice[] })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadInitialData();
    } else {
      setSubscriptions([]);
      setProducts([]);
      setIsLoading(false);
    }
  }, [user]);

  async function loadInitialData() {
    setIsLoading(true);
    try {
      await Promise.all([
        refreshSubscriptions(),
        refreshProducts(),
      ]);
    } catch (error) {
      console.error('Error loading stripe data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshSubscriptions() {
    try {
      const subs = await getActiveSubscriptions();
      setSubscriptions(subs);
    } catch (error) {
      console.error('Error refreshing subscriptions:', error);
    }
  }

  async function refreshProducts() {
    try {
      const prods = await getProducts();
      setProducts(prods);
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  }

  const value = {
    subscriptions,
    products,
    isLoading,
    refreshSubscriptions,
    refreshProducts,
  };

  return <StripeContext.Provider value={value}>{children}</StripeContext.Provider>;
}

export function useStripe() {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
}