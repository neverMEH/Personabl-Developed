import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
import type { Subscription, Product, ProductPrice, Coupon } from './supabase';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      throw new Error('Stripe publishable key is not set');
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export async function createCheckoutSession({
  priceId,
  successUrl,
  cancelUrl,
  couponCode,
}: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  couponCode?: string;
}) {
  try {
    const { data: { session } } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        successUrl,
        cancelUrl,
        couponCode,
      },
    });

    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function createCustomerPortalSession(returnUrl: string) {
  try {
    const { data: { url } } = await supabase.functions.invoke('create-portal-session', {
      body: { returnUrl },
    });

    window.location.href = url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

export async function validateCouponCode(code: string): Promise<Coupon | null> {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('active', true)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    // Check if coupon is expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }

    // Check if max redemptions reached
    if (data.max_redemptions && data.times_used >= data.max_redemptions) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error validating coupon:', error);
    return null;
  }
}

export async function getActiveSubscriptions(): Promise<Subscription[]> {
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .in('status', ['trialing', 'active'])
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return subscriptions;
}

export async function getProducts(): Promise<(Product & { prices: ProductPrice[] })[]> {
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .order('created_at', { ascending: true });

  if (productsError) {
    throw productsError;
  }

  return products.map(product => ({
    ...product,
    prices: (product.prices as ProductPrice[]).filter((price: ProductPrice) => price.active),
  }));
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId },
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export async function reactivateSubscription(subscriptionId: string) {
  try {
    await supabase.functions.invoke('reactivate-subscription', {
      body: { subscriptionId },
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    throw error;
  }
}