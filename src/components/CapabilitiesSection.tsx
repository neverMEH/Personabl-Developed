import React from 'react';
export function CapabilitiesSection() {
  const capabilities = [{
    icon: '📈',
    title: 'Revenue Optimization',
    description: 'Increase monthly cash flow by identifying optimal price points based on historical performance data'
  }, {
    icon: '🎯',
    title: 'Strategic Positioning',
    description: 'Find the perfect market position with comprehensive competitor analysis and market gap identification'
  }, {
    icon: '📊',
    title: 'Performance Tracking',
    description: 'Monitor product health with 0-100 scoring system and category percentile rankings'
  }, {
    icon: '🔄',
    title: 'Dynamic Pricing',
    description: 'Implement data-driven pricing strategies with real-time market intelligence'
  }, {
    icon: '🚀',
    title: 'Opportunity Discovery',
    description: 'Uncover profitable niches with low competition and high market potential'
  }, {
    icon: '⚠️',
    title: 'Risk Management',
    description: 'Identify market threats and opportunities before they impact your business'
  }, {
    icon: '🌍',
    title: 'Global Markets',
    description: 'Access intelligence across 12 Amazon marketplaces worldwide'
  }, {
    icon: '🔮',
    title: 'Predictive Analytics',
    description: 'Forecast trends and seasonal patterns with advanced AI modeling'
  }, {
    icon: '💡',
    title: 'Smart Recommendations',
    description: 'Get actionable insights with implementation roadmaps and success metrics'
  }];
  return <section className="bg-gradient-to-br from-gray-50 to-gray-200 py-20">
      <div className="container mx-auto px-5">
        <h2 className="text-4xl font-extrabold mb-12 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          What You Can Achieve
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => <div key={index} className="bg-white p-6 rounded-xl border-l-4 border-teal-400 shadow-sm hover:shadow-md hover:translate-x-1 transition-all duration-300">
              <p>
                <span className="mr-2">{capability.icon}</span>
                <strong>{capability.title}:</strong> {capability.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
}