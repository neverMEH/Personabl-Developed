import React from 'react';
import { Link2Icon, BarChart2Icon, MegaphoneIcon } from 'lucide-react';
export function ComingSoonSection() {
  const integrations = [{
    icon: <Link2Icon size={32} className="text-purple-500" />,
    title: 'Jungle Scout Integration',
    description: 'Seamlessly sync product research data and market insights between Claude and Jungle Scout for enhanced decision making.'
  }, {
    icon: <BarChart2Icon size={32} className="text-purple-500" />,
    title: 'Amazon AMC Integration',
    description: 'Direct integration with Amazon Marketing Cloud for deeper advertising insights and customer journey analysis.'
  }, {
    icon: <MegaphoneIcon size={32} className="text-purple-500" />,
    title: 'Amazon Ads Integration',
    description: 'Automated campaign optimization insights and budget allocation based on real-time performance data and market intelligence.'
  }];
  return <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-20">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-purple-600 mb-4">
            COMING SOON
          </div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            Powerful Integrations
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {integrations.map((integration, index) => <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-purple-100">
              <div className="mb-6">{integration.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {integration.title}
              </h3>
              <p className="text-gray-600">{integration.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
}