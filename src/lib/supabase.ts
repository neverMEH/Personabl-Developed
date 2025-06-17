import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for authenticated and anonymous operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for admin operations (bypasses RLS)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  product_id: string;
  price_id: string;
  stripe_subscription_id: string;
  status: 'incomplete' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  trial_end: string | null;
  trial_start: string | null;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  payment_status: 'succeeded' | 'pending' | 'failed' | null;
  coupon_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  stripe_product_id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductPrice = {
  id: string;
  product_id: string;
  stripe_price_id: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  trial_period_days: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Coupon = {
  id: string;
  stripe_coupon_id: string;
  code: string;
  description: string | null;
  duration_in_days: number;
  times_used: number;
  max_redemptions: number | null;
  expires_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};