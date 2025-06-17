import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Modal } from '../../components/Modal';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useStripe } from '../../contexts/StripeContext';
import { createCheckoutSession } from '../../lib/stripe';
import type { Product, ProductPrice } from '../../lib/supabase';

// UI helper to format product features based on the database product
const productFeatures: Record<string, {
  features: string[],
  additionalFeatures: string[],
  fullDescription: string
}> = {
  'Keepa MCP Premium': {
    features: ['Deep market intelligence', 'Professional analytics', 'Unlimited everything*'],
    additionalFeatures: ['Extensive price & rank history', 'Real-time competitor tracking', 'Buy Box ownership analysis', 'Advanced trend detection', 'Interactive dashboards', 'Bulk ASIN analysis', 'Profit calculators', 'Market opportunity scoring', 'Track unlimited products', 'Unlimited API calls', 'Unlimited historical lookups', '7-day free trial'],
    fullDescription: "The most comprehensive Keepa data integration available. See what others can't, react faster than competitors, and make profitable decisions with confidence."
  }
};

// Fallback URL in case the checkout flow fails
const STRIPE_DIRECT_URL = 'https://buy.stripe.com/test_3cIdR90dJ1Tf1m72rCcEw00';

export function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<(Product & { prices: ProductPrice[] }) | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user } = useAuth();
  const { products: dbProducts, isLoading } = useStripe();
  
  // Enhanced error logging for checkout issues
  const logError = (error: any) => {
    console.error("Detailed checkout error:", error);
    // Log specific properties for diagnosis
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.message) {
      console.error("Error message:", error.message);
    }
    console.error("Error stack:", error.stack);
  };
  
  // Fallback products in case database products aren't available yet
  const fallbackProducts: (Product & { prices: ProductPrice[] })[] = [{
    id: "keepa-premium-fallback",
    stripe_product_id: "prod_keepa_premium",
    name: "Keepa MCP Premium",
    description: "Your Unfair Advantage in Amazon Selling",
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prices: [{
      id: "keepa-premium-price-fallback",
      product_id: "keepa-premium-fallback",
      stripe_price_id: "price_1MfqUr2eZvKYlo2ClGBkSsNn", // Using the full price ID from earlier
      price: 3999,
      currency: "usd",
      interval: "month",
      trial_period_days: 7,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]
  }];
  
  // Use database products if available, otherwise use fallback
  const products = dbProducts.length > 0 ? dbProducts : fallbackProducts;
  
  // Monitor product availability
  useEffect(() => {
    // Silent monitoring
  }, [dbProducts]);
  
  // Reset selected product if products change
  useEffect(() => {
    if (selectedProduct && products.length > 0) {
      const updatedProduct = products.find((p: Product & { prices: ProductPrice[] }) => p.id === selectedProduct.id);
      if (updatedProduct) {
        setSelectedProduct(updatedProduct);
      } else {
        setSelectedProduct(null);
      }
    }
  }, [products, selectedProduct]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Available Products</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2Icon className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: Product & { prices: ProductPrice[] }) => {
              // Get the first active price
              const price = product.prices.find((p: ProductPrice) => p.active);
              // Get UI details for this product
              const uiDetails = productFeatures[product.name] || {
                features: ['Feature 1', 'Feature 2', 'Feature 3'],
                additionalFeatures: ['Additional Feature 1', 'Additional Feature 2'],
                fullDescription: product.description || 'No description available'
              };
              
              return (
                <div 
                  key={product.id} 
                  className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:border-indigo-500 transition-all cursor-pointer transform hover:-translate-y-1 hover:shadow-lg" 
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {price ? `$${(price.price / 100).toFixed(2)}/${price.interval === 'month' ? 'mo' : 'yr'}` : 'Contact us'}
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {uiDetails.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className="w-full mt-6 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                  >
                    Learn More
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
          {selectedProduct && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  {productFeatures[selectedProduct.name]?.fullDescription || selectedProduct.description}
                </p>
              </div>
              <div>
                {selectedProduct.prices.length > 0 ? (
                  <p className="text-2xl font-bold text-indigo-600">
                    ${(selectedProduct.prices[0].price / 100).toFixed(2)}/
                    {selectedProduct.prices[0].interval === 'month' ? 'mo' : 'yr'}
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-indigo-600">
                    Contact us for pricing
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  *Claude message limits may apply based on your Claude
                  subscription plan
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {productFeatures[selectedProduct.name]?.additionalFeatures.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t pt-6">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  🏆 Trusted by: Private label brands, wholesale buyers,
                  arbitrage pros, and agencies managing millions in Amazon
                  revenue.
                </p>
                <button 
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  disabled={isRedirecting || !selectedProduct.prices.length} 
                  onClick={async () => {
                    try {
                      console.log('Creating Stripe checkout session');
                      setIsRedirecting(true);
                      
                      if (!user) {
                        console.error('User not logged in');
                        alert('You must be logged in to subscribe.');
                        setIsRedirecting(false);
                        return;
                      }
                      
                      // Using direct URL first since it's known to work
                      console.log('Redirecting directly to Stripe URL');
                      
                      // Base Stripe URL
                      let checkoutUrl = "https://buy.stripe.com/test_3cIdR90dJ1Tf1m72rCcEw00";
                      
                      // Start building parameters
                      const params = new URLSearchParams();
                      
                      // Add user email if available
                      if (user?.email) {
                        params.append('prefilled_email', user.email);
                        console.log('Added email to URL:', user.email);
                      }
                      
                      // Add cancel_url parameter to allow users to return to our app
                      const cancelUrl = `${window.location.origin}/dashboard/products`;
                      params.append('cancel_url', cancelUrl);
                      console.log('Added cancel URL:', cancelUrl);
                      
                      // Append all parameters to the URL
                      const separator = checkoutUrl.includes('?') ? '&' : '?';
                      checkoutUrl += `${separator}${params.toString()}`;
                      
                      // Open in a new tab rather than redirecting
                      console.log('Opening Stripe checkout in new tab');
                      const newWindow = window.open(checkoutUrl, '_blank');
                      
                      // Reset the redirecting state since we're staying on this page
                      setTimeout(() => {
                        console.log('Resetting redirecting state');
                        setIsRedirecting(false);
                      }, 1000);
                      
                      // Handle popup blockers
                      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                        console.warn('Popup blocker may have blocked opening the checkout');
                        alert('Please allow popups for this site to open the checkout page');
                        setIsRedirecting(false);
                      }
                      return;
                      
                      /* Temporarily disabling checkout session creation
                      const price = selectedProduct.prices.find((p: ProductPrice) => p.active);
                      if (!price) {
                        console.error('No active price found for this product');
                        alert('No pricing information available for this product.');
                        setIsRedirecting(false);
                        return;
                      }
                      
                      console.log('Using price ID:', price.stripe_price_id);
                      
                      await createCheckoutSession({
                        priceId: price.stripe_price_id,
                        successUrl: `${window.location.origin}/dashboard/subscriptions?success=true`,
                        cancelUrl: `${window.location.origin}/dashboard/subscriptions?canceled=true`,
                      });
                      */
                      
                      // The createCheckoutSession function handles the redirect
                    } catch (error) {
                      logError(error);
                      console.error('Error redirecting to Stripe:', error);
                      setIsRedirecting(false);
                      
                      alert('Error connecting to Stripe. Please try again later.');
                    }
                  }}
                >
                  {isRedirecting ? (
                    <span className="flex items-center justify-center">
                      <Loader2Icon className="w-5 h-5 animate-spin mr-2" /> Processing...
                    </span>
                  ) : selectedProduct.prices.find((p: ProductPrice) => p.trial_period_days > 0) ? (
                    `Try Free for ${selectedProduct.prices.find((p: ProductPrice) => p.trial_period_days > 0)?.trial_period_days || 7} Days`
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}