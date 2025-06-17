// Comprehensive Stripe webhook test script
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config();

// Get Supabase URL from environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env file');
  process.exit(1);
}

// Configuration - use the production URL instead of localhost
const WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/stripe-webhook`;

// Generate a valid UUID for use in tests
const TEST_UUID = randomUUID();
const PRODUCT_UUID = randomUUID();
const PRICE_UUID = randomUUID();

// Sample customer and subscription IDs (consistent across events)
const CUSTOMER_ID = 'cus_test_123456789';
const SUBSCRIPTION_ID = 'sub_test_123456789';
const USER_ID = '00000000-0000-0000-0000-000000000000'; // A valid UUID format
const PRODUCT_ID = 'prod_keepa_premium'; // Product ID from our migration
const PRICE_ID = 'price_1MfqUr2eZvKYlo2ClGBkSsNn'; // Price ID from our migration

// Test events
const events = {
  // Checkout session completed event
  checkoutSessionCompleted: {
    id: 'evt_test_checkout_completed',
    object: 'event',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123456789',
        object: 'checkout.session',
        customer: CUSTOMER_ID,
        subscription: SUBSCRIPTION_ID,
        mode: 'subscription',
        status: 'complete',
        payment_status: 'paid',
        metadata: {
          user_id: USER_ID
        }
      }
    }
  },
  
  // Subscription created event with items structure similar to real Stripe events
  subscriptionCreated: {
    id: 'evt_test_subscription_created',
    object: 'event',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    type: 'customer.subscription.created',
    data: {
      object: {
        id: TEST_UUID, // Using a valid UUID
        object: 'subscription',
        customer: CUSTOMER_ID,
        status: 'active',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
        trial_start: null,
        trial_end: null,
        cancel_at_period_end: false,
        canceled_at: null,
        // Include items structure similar to Stripe's
        items: {
          object: 'list',
          data: [
            {
              id: 'si_test_123456789',
              object: 'subscription_item',
              price: {
                id: PRICE_ID,
                object: 'price',
                product: PRODUCT_ID // Use our known product ID
              }
            }
          ]
        },
        metadata: {
          user_id: USER_ID,
          stripe_subscription_id: SUBSCRIPTION_ID,
          // Explicitly include these as fallbacks
          product_id: PRODUCT_ID,
          price_id: PRICE_ID
        }
      }
    }
  },
  
  // Invoice payment succeeded event
  invoicePaymentSucceeded: {
    id: 'evt_test_invoice_payment_succeeded',
    object: 'event',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    type: 'invoice.payment_succeeded',
    data: {
      object: {
        id: 'in_test_123456789',
        object: 'invoice',
        customer: CUSTOMER_ID,
        subscription: TEST_UUID, // Using a valid UUID
        status: 'paid',
        metadata: {}
      }
    }
  },
  
  // Invoice payment failed event
  invoicePaymentFailed: {
    id: 'evt_test_invoice_payment_failed',
    object: 'event',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    type: 'invoice.payment_failed',
    data: {
      object: {
        id: 'in_test_987654321',
        object: 'invoice',
        customer: CUSTOMER_ID,
        subscription: TEST_UUID, // Using a valid UUID
        status: 'open',
        metadata: {}
      }
    }
  }
};

// Function to send a test webhook event
async function sendTestEvent(event) {
  try {
    console.log(`Sending test ${event.type} event to webhook...`);
    console.log(`URL: ${WEBHOOK_URL}`);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-supabase-test': 'true', // This signals the webhook to treat it as a test event
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}` // Add the authorization header
      },
      body: JSON.stringify(event)
    });
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ Successfully sent test webhook event!');
    } else {
      console.error('❌ Failed to send test webhook event');
    }
    
    console.log('-'.repeat(50));
  } catch (error) {
    console.error('Error sending test webhook event:', error);
  }
}

// Function to run tests sequentially
async function runTests() {
  console.log('🚀 Starting Stripe webhook tests...');
  console.log('Using Supabase webhook URL:', WEBHOOK_URL);
  console.log('Test UUID:', TEST_UUID);
  console.log('Product ID:', PRODUCT_ID);
  console.log('Price ID:', PRICE_ID);
  
  // Get the event name from command line if provided
  const eventName = process.argv[2];
  
  if (eventName && events[eventName]) {
    // Run single test if specified
    await sendTestEvent(events[eventName]);
  } else if (eventName) {
    console.error(`Unknown event: ${eventName}`);
    console.log('Available events: ' + Object.keys(events).join(', '));
  } else {
    // Run all tests sequentially
    for (const [name, event] of Object.entries(events)) {
      console.log(`\nTesting event: ${name}`);
      await sendTestEvent(event);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n🏁 All tests completed!');
}

// Run the tests
runTests();

/*
Usage:
  node test-stripe-webhooks.js                  # Run all tests
  node test-stripe-webhooks.js checkoutSessionCompleted  # Run specific test
*/