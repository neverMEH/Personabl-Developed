# Stripe and Supabase Integration

This project integrates Stripe subscriptions with Supabase authentication and database management. It includes features like:

- Social authentication (Google, GitHub)
- Subscription management with trials
- Coupon code support
- Multiple product subscriptions
- Customer portal integration

## Prerequisites

- Supabase account and project
- Stripe account
- Node.js and npm installed
- Supabase CLI installed

## Setup Instructions

### 1. Frontend Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 2. Supabase Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table profiles (
    id uuid references auth.users primary key,
    email text,
    full_name text,
    stripe_customer_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table products (
    id uuid primary key default uuid_generate_v4(),
    stripe_product_id text unique,
    name text not null,
    description text,
    active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create product pricing tiers
create table product_prices (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references products(id),
    stripe_price_id text unique,
    price decimal not null,
    currency text default 'usd',
    interval text not null,
    trial_period_days integer default 7,
    active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create coupons table
create table coupons (
    id uuid primary key default uuid_generate_v4(),
    stripe_coupon_id text unique,
    code text unique not null,
    description text,
    duration_in_days integer default 30,
    times_used integer default 0,
    max_redemptions integer,
    expires_at timestamp with time zone,
    active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subscriptions table
create table subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    product_id uuid references products(id) not null,
    price_id uuid references product_prices(id) not null,
    stripe_subscription_id text unique,
    status text not null,
    trial_end timestamp with time zone,
    trial_start timestamp with time zone,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    cancel_at_period_end boolean default false,
    canceled_at timestamp with time zone,
    payment_status text,
    coupon_id uuid references coupons(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create coupon redemptions tracking
create table coupon_redemptions (
    id uuid primary key default uuid_generate_v4(),
    coupon_id uuid references coupons(id),
    user_id uuid references auth.users,
    subscription_id uuid references subscriptions(id),
    redeemed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table products enable row level security;
alter table product_prices enable row level security;
alter table coupons enable row level security;
alter table coupon_redemptions enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
    on profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on profiles for update
    using (auth.uid() = id);

-- Products policies
create policy "Anyone can view active products"
    on products for select
    using (active = true);

-- Product prices policies
create policy "Anyone can view active prices"
    on product_prices for select
    using (active = true);

-- Subscriptions policies
create policy "Users can view their own subscriptions"
    on subscriptions for select
    using (auth.uid() = user_id);

-- Coupons policies
create policy "Anyone can view active coupons"
    on coupons for select
    using (active = true);

-- Coupon redemptions policies
create policy "Users can view their own redemptions"
    on coupon_redemptions for select
    using (auth.uid() = user_id);
```

### 3. Stripe Setup

1. Create products and prices in Stripe Dashboard

2. Configure Customer Portal:
   - Go to Stripe Dashboard > Settings > Customer Portal
   - Click "Configure" if no configuration exists
   - Set up the portal settings:
     * Products and prices to show
     * Subscription management options
     * Branding and appearance
   - After saving, get the configuration ID (starts with "bpc_") from:
     * The URL in your browser, or
     * Using Stripe CLI: `stripe customer_portal configurations list`
   - Save this ID for the `STRIPE_PORTAL_CONFIGURATION_ID` environment variable

3. Create webhook endpoint for `https://your-project.supabase.co/functions/v1/stripe-webhook`
   
4. Enable the following webhook events:
   - Subscription events:
     * `customer.subscription.created` - New subscription created
     * `customer.subscription.updated` - Subscription details changed
     * `customer.subscription.deleted` - Subscription cancelled
   - Invoice events:
     * `invoice.payment_succeeded` - Payment successful
     * `invoice.payment_failed` - Payment failed
     * `invoice.upcoming` - Upcoming renewal notification
   - Customer events:
     * `customer.created` - New Stripe customer created

5. Note down the webhook signing secret

### 4. Supabase Edge Functions Setup

1. Install and configure Supabase CLI:
```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase (will open browser for authentication)
supabase login

# Initialize Supabase in your project (if not already done)
supabase init

# Create new Edge Functions
supabase functions new stripe-webhook
supabase functions new create-checkout-session
supabase functions new create-portal-session
```

The above commands will create new function directories with this structure:
```
supabase/
  functions/
    stripe-webhook/
      index.ts
    create-checkout-session/
      index.ts
    create-portal-session/
      index.ts
    import_map.json    # Shared dependencies
    deno.json         # Deno configuration
```

2. Link your project:
   - Get your project reference from Supabase Dashboard URL
   - URL format: `https://app.supabase.com/project/[project-ref]`
   ```bash
   # Link local project to Supabase
   supabase link --project-ref your-project-ref
   ```

3. Set up environment variables:
   - Go to Supabase Dashboard > Settings > API
   - Scroll to "Environment Variables" section
   - Add the following variables:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
   STRIPE_PORTAL_CONFIGURATION_ID=bpc_your_stripe_portal_configuration_id
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Deploy the Edge Functions:
```bash
# Deploy webhook endpoint (disable JWT verification for Stripe)
supabase functions deploy stripe-webhook --no-verify-jwt

# Deploy other functions (with JWT verification)
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session

# Verify deployments
supabase functions list
```

5. Test the functions:
```bash
# For local development testing
supabase functions serve --env-file ./supabase/functions/.env
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# For production testing
stripe trigger customer.subscription.created
```

6. Troubleshooting:
   - Check function logs in Supabase Dashboard > Edge Functions
   - Verify environment variables are set correctly
   - Ensure project is properly linked (`supabase status`)
   - Test functions locally before deployment
   - Common issues:
     * 401 errors: Check JWT verification settings
     * 500 errors: Check environment variables
     * Timeout errors: Function execution taking too long

### 5. Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

## Authentication Flow

1. User signs up/logs in via email/password or social providers
2. Profile is created in Supabase
3. Stripe customer is created when user starts subscription

## Subscription Flow

1. User selects a product/plan
2. Optional coupon code application
3. Redirect to Stripe Checkout
4. Webhook handles subscription status updates
5. User can manage subscription via Customer Portal

## Development

- Frontend runs on `http://localhost:5173`
- Supabase Edge Functions can be tested locally with `supabase functions serve`
- Use Stripe webhook forwarding for local testing: `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`

## Testing

Test cards for Stripe:
- Success: 4242 4242 4242 4242
- Requires Authentication: 4000 0025 0000 3155
- Decline: 4000 0000 0000 9995

## Deployment

1. Build the frontend:
```bash
# Build the application
npm run build

# Test the build locally
npm run preview
```

2. Deploy Edge Functions to production:
```bash
# Ensure environment variables are set in Supabase Dashboard
supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session

# Verify functions are deployed
supabase functions list
```

3. Configure Stripe webhooks for production:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Update the webhook endpoint URL to your production URL:
     `https://[project-ref].supabase.co/functions/v1/stripe-webhook`
   - Verify the webhook signature secret matches your environment variable
   - Send test events to verify the webhook is working:
     ```bash
     stripe trigger customer.subscription.created
     stripe trigger invoice.payment_succeeded
     ```

4. Monitor the deployment:
   - Check Supabase Dashboard > Edge Functions for function status
   - Review function logs in Supabase Dashboard
   - Monitor Stripe webhook delivery status in Stripe Dashboard
   - Test the complete subscription flow in production

## Monitoring

- Check Supabase logs for Edge Function issues
- Monitor Stripe webhook events
- Track subscription statuses in database
