import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-5">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" onClick={scrollToTop} className={`text-2xl md:text-3xl font-extrabold transition-all duration-300 transform hover:scale-105 ${isScrolled ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text' : 'text-white'}`}>
            Personabl
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isScrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white/90 hover:text-white'}`}>
              Login
            </Link>
            <Link to="/signup" className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isScrolled ? 'border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white' : 'border border-white/30 text-white hover:bg-white/10'}`}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>;
}