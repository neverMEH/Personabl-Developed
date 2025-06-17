-- Insert the Keepa MCP Premium product
INSERT INTO products (
  id,
  stripe_product_id,
  name,
  description,
  active,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),  -- Generate a random UUID for the product
  'prod_keepa_premium',  -- This should match your actual Stripe product ID
  'Keepa MCP Premium',
  'Your Unfair Advantage in Amazon Selling. The most comprehensive Keepa data integration available.',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (stripe_product_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  active = EXCLUDED.active,
  updated_at = NOW();

-- Get the product ID we just inserted
WITH product_id AS (
  SELECT id FROM products WHERE stripe_product_id = 'prod_keepa_premium'
)

-- Insert the price for the product
INSERT INTO prices (
  id,
  product_id,
  stripe_price_id,
  price,
  currency,
  interval,
  trial_period_days,
  active,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),  -- Generate a random UUID for the price
  (SELECT id FROM product_id),  -- Reference to the product
  'price_1MfqUr2eZvKYlo2ClGBkSsNn',  -- This should match your actual Stripe price ID
  3999,  -- $39.99 (stored in cents)
  'usd',
  'month',
  7,  -- 7-day free trial
  true,
  NOW(),
  NOW()
)
ON CONFLICT (stripe_price_id) DO UPDATE SET
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  interval = EXCLUDED.interval,
  trial_period_days = EXCLUDED.trial_period_days,
  active = EXCLUDED.active,
  updated_at = NOW();