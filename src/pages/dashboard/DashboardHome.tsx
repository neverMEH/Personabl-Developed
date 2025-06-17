import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { BookOpenIcon, SearchIcon, BarChart2Icon, Link2Icon, MegaphoneIcon } from 'lucide-react';
export function DashboardHome() {
  const steps = [{
    icon: <BookOpenIcon className="w-6 h-6" />,
    title: 'Read Documentation',
    description: "Learn about our platform's features and capabilities",
    link: '/dashboard/documentation'
  }, {
    icon: <SearchIcon className="w-6 h-6" />,
    title: 'Explore Products',
    description: 'Add your first products to start tracking performance',
    link: '/dashboard/products'
  }];
  const comingSoon = [{
    icon: <Link2Icon className="w-6 h-6" />,
    title: 'Jungle Scout Integration',
    description: 'Sync product research data and market insights'
  }, {
    icon: <BarChart2Icon className="w-6 h-6" />,
    title: 'Amazon AMC Integration',
    description: 'Direct integration with Amazon Marketing Cloud'
  }, {
    icon: <MegaphoneIcon className="w-6 h-6" />,
    title: 'Amazon Ads Integration',
    description: 'Automated campaign optimization insights'
  }];
  return <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to Personabl
          </h1>
          <p className="text-gray-600 mt-1">
            Let's get you started with Amazon intelligence.
          </p>
        </div>
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => <Link key={index} to={step.link} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all">
                <div className="p-2 bg-indigo-100 rounded-lg w-fit mb-4">
                  <div className="text-indigo-600">{step.icon}</div>
                </div>
                <h3 className="font-medium mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </Link>)}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-6">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comingSoon.map((feature, index) => <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-100">
                <div className="p-2 bg-white rounded-lg w-fit mb-4">
                  <div className="text-purple-600">{feature.icon}</div>
                </div>
                <h3 className="font-medium mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </div>
    </DashboardLayout>;
}