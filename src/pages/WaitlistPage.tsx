import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRightIcon, ZapIcon, UsersIcon, BrainCircuitIcon } from 'lucide-react';
export function WaitlistPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/thank-you');
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const quickFeatures = [{
    icon: <ZapIcon className="w-6 h-6 text-indigo-500" />,
    title: 'Instant Market Analysis',
    description: 'Get real-time insights across 12 Amazon marketplaces in seconds'
  }, {
    icon: <UsersIcon className="w-6 h-6 text-indigo-500" />,
    title: 'Team Collaboration',
    description: 'Share insights and strategies across your entire organization'
  }, {
    icon: <BrainCircuitIcon className="w-6 h-6 text-indigo-500" />,
    title: 'AI-Powered Automation',
    description: 'Automate pricing strategies and market monitoring tasks'
  }];
  return <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
      {/* Header with logo */}
      <header className="container mx-auto px-4 pt-8 pb-4">
        <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105">
          <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-400 via-teal-400 to-blue-400 text-transparent bg-clip-text">
            Personabl
          </div>
        </Link>
      </header>
      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 pb-4">
        <ol className="flex items-center space-x-2 text-white/90">
          <li>
            <Link to="/" className="hover:text-white">
              Home
            </Link>
          </li>
          <ChevronRightIcon className="w-4 h-4" />
          <li className="font-medium">Join Waitlist</li>
        </ol>
      </nav>
      <div className="container mx-auto px-4 py-4 flex items-center min-h-[calc(100vh-130px)]">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
          {/* Quick Features Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <h2 className="text-2xl font-bold mb-6">
              Streamline Your Amazon Operations
            </h2>
            <div className="space-y-6">
              {quickFeatures.map((feature, index) => <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:transform hover:translate-x-2">
                  <div className="bg-white rounded-lg p-2 transition-transform duration-300 hover:rotate-6">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-white/80 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>)}
            </div>
          </div>
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Join the Waitlist
            </h1>
            <p className="text-gray-600 mb-8">
              Be the first to experience the future of Amazon intelligence.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300 hover:border-indigo-300" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input type="text" id="company" name="company" required value={formData.company} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Acme Inc" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Tell us about your Amazon business..." />
              </div>
              <button type="submit" className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:transform hover:-translate-y-1 hover:scale-102 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Join Waitlist
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>;
}