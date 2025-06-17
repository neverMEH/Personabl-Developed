// Test script to send a simulated Stripe webhook event to the webhook handler
const fetch = require('node-fetch');

// Configuration
const WEBHOOK_URL = 'http://localhost:54321/functions/v1/stripe-webhook'; // Adjust if needed

// Sample checkout.session.completed event
const checkoutSessionCompletedEvent = {
  id: 'evt_test_checkout_completed',
  object: 'event',
  api_version: '2023-10-16',
  created: Math.floor(Date.now() / 1000),
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_123456789',
      object: 'checkout.session',
      customer: 'cus_test_123456789',
      subscription: 'sub_test_123456789',
      mode: 'subscription',
      status: 'complete',
      client_reference_id: null,
      payment_status: 'paid',
      metadata: {}
    }
  }
};

// Function to send a test webhook event
async function sendTestEvent(event) {
  try {
    console.log(`Sending test ${event.type} event to webhook...`);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-supabase-test': 'true' // This signals the webhook to treat it as a test event
      },
      body: JSON.stringify(event)
    });
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('Successfully sent test webhook event!');
    } else {
      console.error('Failed to send test webhook event');
    }
  } catch (error) {
    console.error('Error sending test webhook event:', error);
  }
}

// Run the test
sendTestEvent(checkoutSessionCompletedEvent);