import React, { useState } from 'react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { Modal } from '../../components/Modal';
import { CheckIcon } from 'lucide-react';
const products = [{
  id: 1,
  name: 'Keepa MCP Premium',
  description: 'Your Unfair Advantage in Amazon Selling',
  price: '$39.99/month',
  features: ['Deep market intelligence', 'Professional analytics', 'Unlimited everything*'],
  fullDescription: "The most comprehensive Keepa data integration available. See what others can't, react faster than competitors, and make profitable decisions with confidence.",
  additionalFeatures: ['Extensive price & rank history', 'Real-time competitor tracking', 'Buy Box ownership analysis', 'Advanced trend detection', 'Interactive dashboards', 'Bulk ASIN analysis', 'Profit calculators', 'Market opportunity scoring', 'Track unlimited products', 'Unlimited API calls', 'Unlimited historical lookups', '7-day free trial']
}];
export function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null);
  return <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Available Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => <div key={product.id} className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:border-indigo-500 transition-all cursor-pointer transform hover:-translate-y-1 hover:shadow-lg" onClick={() => setSelectedProduct(product)}>
              <div className="mb-4 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {product.price}
                </p>
              </div>
              <ul className="space-y-3">
                {product.features.map((feature, index) => <li key={index} className="flex items-center text-gray-700">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>)}
              </ul>
              <button className="w-full mt-6 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors" onClick={e => {
            e.stopPropagation();
            setSelectedProduct(product);
          }}>
                Learn More
              </button>
            </div>)}
        </div>
        <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
          {selectedProduct && <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  {selectedProduct.fullDescription}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600">
                  {selectedProduct.price}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  *Claude message limits may apply based on your Claude
                  subscription plan
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProduct.additionalFeatures.map((feature, index) => <li key={index} className="flex items-center gap-2">
                      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>)}
                </ul>
              </div>
              <div className="border-t pt-6">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  🏆 Trusted by: Private label brands, wholesale buyers,
                  arbitrage pros, and agencies managing millions in Amazon
                  revenue.
                </p>
                <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors" onClick={() => {
              // Handle subscription logic here
              alert('Subscription flow would start here');
            }}>
                  Try Free for 7 Days
                </button>
              </div>
            </div>}
        </Modal>
      </div>
    </DashboardLayout>;
}