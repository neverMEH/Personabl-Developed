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
    console.log('StripeContext user change:', !!user, user?.email);
    
    if (user) {
      console.log('User available, loading stripe data');
      loadInitialData();
    } else {
      console.log('No user, resetting stripe data');
      setSubscriptions([]);
      setProducts([]);
      setIsLoading(false);
    }
  }, [user]);

  // Add a separate safety timeout effect
  useEffect(() => {
    if (isLoading) {
      console.log('Starting safety timeout for Stripe loading state');
      const safetyTimer = setTimeout(() => {
        console.log('⚠️ Safety timeout triggered for Stripe loading state');
        setIsLoading(false);
      }, 5000);
      
      return () => clearTimeout(safetyTimer);
    }
  }, [isLoading]);

  async function loadInitialData() {
    console.log('Loading initial Stripe data');
    setIsLoading(true);
    try {
      await Promise.all([
        refreshSubscriptions(),
        refreshProducts(),
      ]);
      console.log('Successfully loaded all Stripe data');
    } catch (error) {
      console.error('Error loading stripe data:', error);
    } finally {
      console.log('Setting Stripe loading state to false');
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
    console.log('Refreshing products');
    try {
      const prods = await getProducts();
      console.log('Products retrieved:', prods.length);
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