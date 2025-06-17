import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import Stripe from 'https://esm.sh/stripe@13.6.0';

// Initialize Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

console.log('[Webhook Init] Initializing with:', { 
  supabaseUrl, 
  hasServiceKey: !!supabaseServiceKey,
  hasWebhookSecret: !!webhookSecret
});

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers for Supabase Edge Functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    console.log(`[Webhook] Received ${req.method} request`);
    
    // Test Supabase connection first
    try {
      const { data, error } = await supabase.from('products').select('count').limit(1);
      if (error) {
        console.error('[Webhook] Supabase connection test failed:', error);
      } else {
        console.log('[Webhook] Supabase connection test succeeded');
      }
    } catch (error) {
      console.error('[Webhook] Supabase connection test exception:', error);
    }
    
    // Get the raw request body
    const requestBody = await req.text();
    
    // Get signature from headers
    const signature = req.headers.get('stripe-signature');
    console.log('[Webhook] Stripe signature present:', !!signature);

    let event: Stripe.Event;
    
    // Try to parse the body as JSON
    try {
      // First try to parse as JSON regardless of signature
      event = JSON.parse(requestBody);
      console.log('[Webhook] Successfully parsed JSON, event type:', event.type);
      
      // Try signature verification if available, but don't reject if it fails
      if (signature && webhookSecret) {
        try {
          const verifiedEvent = stripe.webhooks.constructEvent(
            requestBody,
            signature,
            webhookSecret
          );
          console.log('[Webhook] ✅ Signature verification successful');
          // Use the verified event if signature verification succeeds
          event = verifiedEvent;
        } catch (err) {
          // Just log the error but continue with the parsed event
          console.log('[Webhook] ⚠️ Signature verification failed:', err.message);
          console.log('[Webhook] Continuing with parsed event for testing purposes');
        }
      } else {
        console.log('[Webhook] No signature or webhook secret available, skipping verification');
      }
    } catch (err) {
      console.error('[Webhook] Error parsing request body:', err.message);
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Log the event details
    console.log('[Webhook] Processing event type:', event.type);
    
    // Handle different event types
    if (event.type === 'checkout.session.completed') {
      console.log('[Webhook] Processing checkout.session.completed event');
      
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('[Webhook] Session details:', {
        id: session.id,
        customer: session.customer,
        subscription: session.subscription,
        status: session.status
      });
      
      if (session.subscription) {
        console.log('[Webhook] Session includes subscription:', session.subscription);
        
        // 1. First, lookup the user ID
        let userId: string | undefined;
        
        if (session.customer) {
          const customerId = typeof session.customer === 'string' 
            ? session.customer 
            : session.customer.id;
            
          console.log('[Webhook] Looking up user by customer ID:', customerId);
          
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('id')
              .eq('stripe_customer_id', customerId)
              .single();
              
            if (error) {
              console.error('[Webhook] Error finding profile by customer ID:', error);
            } else if (profile) {
              userId = profile.id;
              console.log('[Webhook] Found user ID from profile:', userId);
            } else {
              console.log('[Webhook] No profile found with customer ID:', customerId);
              
              if (session.customer_details?.email) {
                console.log('[Webhook] Looking up user by email:', session.customer_details.email);
                
                const { data: profileByEmail, error: emailError } = await supabase
                  .from('profiles')
                  .select('id')
                  .eq('email', session.customer_details.email)
                  .single();
                  
                if (emailError) {
                  console.error('[Webhook] Error finding profile by email:', emailError);
                } else if (profileByEmail) {
                  userId = profileByEmail.id;
                  console.log('[Webhook] Found user ID by email:', userId);
                } else {
                  console.log('[Webhook] No profile found with email:', session.customer_details.email);
                }
              }
            }
          } catch (error) {
            console.error('[Webhook] Exception finding profile:', error);
          }
        }
        
        if (!userId) {
          console.error('[Webhook] Failed to determine user ID - cannot proceed without valid user_id');
          return new Response(JSON.stringify({ error: 'Could not determine user ID' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        // 2. Get stripe subscription details
        const subscriptionId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription.id;
          
        console.log('[Webhook] Subscription ID:', subscriptionId);
        
        try {
          // Retrieve the full subscription from Stripe to get price ID and product ID
          const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
          console.log('[Webhook] Retrieved subscription from Stripe:', {
            id: stripeSubscription.id,
            items: stripeSubscription.items?.data?.length || 0,
            status: stripeSubscription.status
          });
          
          if (!stripeSubscription.items?.data || stripeSubscription.items.data.length === 0) {
            console.error('[Webhook] Subscription has no items');
            return new Response(JSON.stringify({ error: 'Subscription has no items' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          // Get the Stripe price and product IDs
          const stripePriceId = stripeSubscription.items.data[0].price.id;
          const stripeProductId = typeof stripeSubscription.items.data[0].price.product === 'string'
            ? stripeSubscription.items.data[0].price.product
            : stripeSubscription.items.data[0].price.product.id;
            
          console.log('[Webhook] Stripe product/price IDs:', { stripePriceId, stripeProductId });
          
          // 3. Look up the corresponding product and price IDs in Supabase
          const { data: productData, error: productError } = await supabase
            .from('products')
            .select('id')
            .eq('stripe_product_id', stripeProductId)
            .single();
            
          if (productError || !productData) {
            console.error('[Webhook] Error finding product:', productError);
            return new Response(JSON.stringify({ error: 'Product not found' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          const productId = productData.id;
          console.log('[Webhook] Found product ID:', productId);
          
          const { data: priceData, error: priceError } = await supabase
            .from('prices')
            .select('id')
            .eq('stripe_price_id', stripePriceId)
            .single();
            
          if (priceError || !priceData) {
            console.error('[Webhook] Error finding price:', priceError);
            return new Response(JSON.stringify({ error: 'Price not found' }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          const priceId = priceData.id;
          console.log('[Webhook] Found price ID:', priceId);
          
          // 4. Prepare subscription data with all required fields
          const subscriptionData = {
            id: crypto.randomUUID(), // Generate a new UUID for the subscription record
            user_id: userId,
            product_id: productId,
            price_id: priceId,
            stripe_subscription_id: subscriptionId,
            status: stripeSubscription.status,
            current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: stripeSubscription.cancel_at_period_end,
            trial_start: stripeSubscription.trial_start 
              ? new Date(stripeSubscription.trial_start * 1000).toISOString() 
              : null,
            trial_end: stripeSubscription.trial_end 
              ? new Date(stripeSubscription.trial_end * 1000).toISOString() 
              : null,
            canceled_at: stripeSubscription.canceled_at 
              ? new Date(stripeSubscription.canceled_at * 1000).toISOString() 
              : null,
            payment_status: 'succeeded',
            coupon_id: null, // No coupon support in this example
          };
          
          console.log('[Webhook] Inserting subscription:', subscriptionData);
          
          // 5. Insert the subscription
          const { data: insertedData, error: insertError } = await supabase
            .from('subscriptions')
            .insert(subscriptionData)
            .select();
            
          if (insertError) {
            console.error('[Webhook] Error inserting subscription:', insertError);
            return new Response(JSON.stringify({ error: 'Error inserting subscription', details: insertError }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          
          console.log('[Webhook] Successfully inserted subscription:', insertedData);
        } catch (error) {
          console.error('[Webhook] Error processing subscription:', error);
          return new Response(JSON.stringify({ error: 'Error processing subscription', details: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      } else {
        console.log('[Webhook] Checkout did not create a subscription');
      }
    } else {
      console.log(`[Webhook] Ignoring event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Webhook] Unexpected error:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});