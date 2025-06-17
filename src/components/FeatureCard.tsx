import React from 'react';
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}
export function FeatureCard({
  icon,
  title,
  description
}: FeatureCardProps) {
  return <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl border-l-4 border-indigo-500 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group">
      {/* Shimmer effect */}
      <div className="absolute inset-0 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>;
}