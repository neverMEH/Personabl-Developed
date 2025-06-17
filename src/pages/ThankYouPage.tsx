import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from 'lucide-react';
export function ThankYouPage() {
  return <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
          <div className="transform transition-transform duration-700 hover:scale-110">
            <CheckCircleIcon className="w-16 h-16 mx-auto mb-6 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank You for Joining!</h1>
          <p className="text-gray-600 mb-8">
            We'll send you an invite with your 7-day free trial once Personabl
            launches. Get ready to transform your Amazon business!
          </p>
          <Link to="/" className="inline-block py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:transform hover:-translate-y-1 hover:scale-105">
            Return Home
          </Link>
        </div>
      </div>
    </div>;
}