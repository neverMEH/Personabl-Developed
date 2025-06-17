import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGridIcon, CreditCardIcon, UserIcon, MessageSquareIcon, HomeIcon, BookOpenIcon, LogOutIcon } from 'lucide-react';
export function Sidebar() {
  const location = useLocation();
  const navigation = [{
    name: 'Home',
    href: '/dashboard',
    icon: HomeIcon
  }, {
    name: 'Products',
    href: '/dashboard/products',
    icon: LayoutGridIcon
  }, {
    name: 'Subscriptions',
    href: '/dashboard/subscriptions',
    icon: CreditCardIcon
  }, {
    name: 'Documentation',
    href: '/dashboard/documentation',
    icon: BookOpenIcon
  }, {
    name: 'Contact',
    href: '/dashboard/contact',
    icon: MessageSquareIcon
  }, {
    name: 'Account',
    href: '/dashboard/account',
    icon: UserIcon
  }];
  return <div className="w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-indigo-600">Personabl</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map(item => {
          const Icon = item.icon;
          return <Link key={item.name} to={item.href} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${location.pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>;
        })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={() => {
          // Handle logout logic here
          window.location.href = '/login';
        }} className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600">
            <LogOutIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>;
}