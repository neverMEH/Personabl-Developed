import React from 'react';
import { FeatureCard } from './FeatureCard';
import { Banknote, Target, BarChart3, Search, Store, Zap } from 'lucide-react';
export function FeaturesSection() {
  const features = [{
    icon: <Banknote size={32} className="text-indigo-600" />,
    title: 'Price Optimization Engine',
    description: 'Maximize cash flow with AI-driven pricing strategies. Analyze historical performance across 8 price segments and get optimal pricing recommendations that can increase monthly revenue by 20-50%.'
  }, {
    icon: <Target size={32} className="text-indigo-600" />,
    title: 'Market Opportunity Hunter',
    description: 'Discover untapped niches and market gaps before your competitors. Find high-potential, low-competition opportunities with comprehensive scoring across market size, competition, and profitability.'
  }, {
    icon: <BarChart3 size={32} className="text-indigo-600" />,
    title: 'Performance Analytics',
    description: 'Track product health with 360° performance monitoring. Get real-time insights on sales velocity, market share, buy box win rates, and category benchmarking with predictive forecasting.'
  }, {
    icon: <Search size={32} className="text-indigo-600" />,
    title: 'Deep Competitive Analysis',
    description: 'Uncover competitor strategies with detailed pricing, positioning, and market intelligence. Analyze up to 5 competitors simultaneously with historical performance data and strategic recommendations.'
  }, {
    icon: <Store size={32} className="text-indigo-600" />,
    title: 'Category Market Scanner',
    description: 'Map entire product categories with intelligent data sampling. Identify market trends, price distributions, brand landscapes, and entry opportunities across any Amazon category.'
  }, {
    icon: <Zap size={32} className="text-indigo-600" />,
    title: 'Real-Time Intelligence',
    description: 'Get instant competitive insights with lightning-fast scans. Monitor up to 10 products simultaneously with live pricing, rankings, and buy box status updates.'
  }];
  return <section className="bg-white py-20">
      <div className="container mx-auto px-5">
        <h2 className="text-4xl font-extrabold mb-12 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          Revolutionary Amazon Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />)}
        </div>
      </div>
    </section>;
}