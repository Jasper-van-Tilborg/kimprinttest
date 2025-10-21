'use client';

import { useState, useEffect } from 'react';

export default function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    // Check login status
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn');
      const user = localStorage.getItem('username');
      const role = localStorage.getItem('userRole');
      
      setIsLoggedIn(loggedIn === 'true');
      setUsername(user || '');
      setUserRole(role || '');
    };

    checkLoginStatus();
    window.addEventListener('scroll', handleScroll);
    
    // Listen for storage changes (login/logout)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUsername('');
    setUserRole('');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      {/* Hoofdnavigatie */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className={`text-2xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-gray-900' : 'text-white drop-shadow-lg'
          }`}>
            K-imprint
          </div>

          {/* Hoofdmenu */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#" className={`text-sm font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
            }`}>Home</a>
            <a href="#" className={`text-sm font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
            }`}>Collecties</a>
            <a href="#" className={`text-sm font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
            }`}>Personaliseer</a>
            <a href="#" className={`text-sm font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
            }`}>Lookbook</a>
            <a href="#" className={`text-sm font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
            }`}>Offertes</a>
            <a href="#" className={`text-sm font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
            }`}>Contact</a>
            <a href="#" className={`text-sm font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
            }`}>Over ons</a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Icons rechts */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className={`transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <span className={`text-xs font-medium ${
                  isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
                }`}>
                  Welkom, {username}
                </span>
                {userRole === 'admin' && (
                  <a 
                    href="/dashboard" 
                    className={`text-xs px-2 py-1 rounded-full border transition-all duration-300 hover:opacity-80 ${
                      isScrolled 
                        ? 'border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white' 
                        : 'border-white text-white hover:bg-white hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className={`text-xs px-2 py-1 rounded-full border transition-all duration-300 hover:opacity-80 ${
                    isScrolled 
                      ? 'border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white' 
                      : 'border-white text-white hover:bg-white hover:text-gray-900'
                  }`}
                >
                  Uitloggen
                </button>
              </div>
            ) : (
              <a href="/login" className={`transition-all duration-300 hover:opacity-80 ${
                isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </a>
            )}
            <button className={`transition-all duration-300 relative hover:opacity-80 group ${
              isScrolled ? 'text-gray-700' : 'text-white drop-shadow-md'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className={`absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm transition-all duration-300 group-hover:scale-105 ${
                isScrolled ? 'bg-orange-400 text-white' : 'bg-orange-400 text-white'
              }`}>0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md' : 'bg-black/90 backdrop-blur-md'
        }`}>
          <div className="px-4 py-4 space-y-4">
            <a href="#" className={`block text-base font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>Home</a>
            <a href="#" className={`block text-base font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>Collecties</a>
            <a href="#" className={`block text-base font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>Personaliseer</a>
            <a href="#" className={`block text-base font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>Lookbook</a>
            <a href="#" className={`block text-base font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>Offertes</a>
            <a href="#" className={`block text-base font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>Contact</a>
            <a href="#" className={`block text-base font-medium transition-all duration-300 hover:opacity-80 ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}>Over ons</a>
            
            {/* Mobile cart and user section */}
            <div className="pt-4 border-t border-gray-300">
              {/* Mobile cart */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-base font-medium ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  Winkelwagen
                </span>
                <button className={`relative transition-all duration-300 hover:opacity-80 group ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className={`absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm transition-all duration-300 group-hover:scale-105 ${
                    isScrolled ? 'bg-orange-400 text-white' : 'bg-orange-400 text-white'
                  }`}>0</span>
                </button>
              </div>

              {/* Mobile user section */}
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className={`text-sm font-medium ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}>
                    Welkom, {username}
                  </div>
                  {userRole === 'admin' && (
                    <a 
                      href="/dashboard" 
                      className={`block text-sm px-3 py-2 rounded-full border transition-all duration-300 hover:opacity-80 ${
                        isScrolled 
                          ? 'border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white' 
                          : 'border-white text-white hover:bg-white hover:text-gray-900'
                      }`}
                    >
                      Dashboard
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className={`block text-sm px-3 py-2 rounded-full border transition-all duration-300 hover:opacity-80 ${
                      isScrolled 
                        ? 'border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white' 
                        : 'border-white text-white hover:bg-white hover:text-gray-900'
                    }`}
                  >
                    Uitloggen
                  </button>
                </div>
              ) : (
                <a href="/login" className={`block text-base font-medium transition-all duration-300 hover:opacity-80 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  Inloggen
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}