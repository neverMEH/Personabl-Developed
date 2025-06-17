import React, { useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { useStripe } from '../../contexts/StripeContext';
import { useAuth } from '../../contexts/AuthContext';
import { createCheckoutSession, createCustomerPortalSession, validateCouponCode } from '../../lib/stripe';
import { Loader2Icon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from 'lucide-react';

export function SubscriptionsPage() {
  const { subscriptions, products, isLoading: isStripeLoading } = useStripe();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    setIsProcessing(true);
    try {
      await createCheckoutSession({
        priceId,
        successUrl: `${window.location.origin}/dashboard/subscriptions?success=true`,
        cancelUrl: `${window.location.origin}/dashboard/subscriptions?canceled=true`,
        couponCode: couponCode || undefined,
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await createCustomerPortalSession(`${window.location.origin}/dashboard/subscriptions`);
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  const handleCouponValidation = async () => {
    if (!couponCode) return;

    try {
      const coupon = await validateCouponCode(couponCode);
      if (!coupon) {
        setCouponError('Invalid or expired coupon code');
      } else {
        setCouponError(null);
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setCouponError('Error validating coupon code');
    }
  };

  const getSubscriptionStatus = (subscription: any) => {
    if (subscription.status === 'trialing') {
      const trialEnd = new Date(subscription.trial_end);
      const daysLeft = Math.ceil((trialEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return `Trial (${daysLeft} days left)`;
    }
    return subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1);
  };

  if (isStripeLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2Icon className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>

        {/* Active Subscriptions */}
        {subscriptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Active Subscriptions</h2>
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        {products.find((p) => p.id === subscription.product_id)?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Status: {getSubscriptionStatus(subscription)}
                      </p>
                      {subscription.cancel_at_period_end && (
                        <p className="text-sm text-orange-600">
                          Cancels at end of billing period
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleManageSubscription}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Products */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Products</h2>
          
          {/* Coupon Code Input */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponError(null);
                }}
                placeholder="Enter coupon code"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleCouponValidation}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 border border-indigo-600 rounded-lg"
                disabled={!couponCode}
              >
                Validate
              </button>
            </div>
            {couponError && (
              <p className="mt-2 text-sm text-red-600">{couponError}</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                {product.prices.map((price) => (
                  <div key={price.id} className="mb-4">
                    <p className="font-medium">
                      ${price.price}/
                      {price.interval === 'month' ? 'mo' : 'yr'}
                    </p>
                    {price.trial_period_days > 0 && (
                      <p className="text-sm text-green-600">
                        Includes {price.trial_period_days}-day free trial
                      </p>
                    )}
                    <button
                      onClick={() => handleSubscribe(price.stripe_price_id)}
                      disabled={isProcessing || subscriptions.some(s => s.product_id === product.id)}
                      className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <Loader2Icon className="w-5 h-5 animate-spin mx-auto" />
                      ) : subscriptions.some(s => s.product_id === product.id) ? (
                        'Already Subscribed'
                      ) : (
                        'Subscribe'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}