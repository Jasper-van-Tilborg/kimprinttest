"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase, Product } from "../../lib/supabase";
import { useCart } from "../../contexts/CartContext";

interface NavbarProps {
  activePage?: 'home' | 'assortiment' | 'maak-je-eigen' | 'fotoboek' | 'account';
}

export default function Navbar({ activePage = 'home' }: NavbarProps) {
  const { totalItems, openCart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
          .limit(10);

        if (error) throw error;
        setSearchResults(data || []);
      } catch (err) {
        console.error('Zoekfout:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Close mobile menu when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isSearchOpen]);

  // Close search when mobile menu opens
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsSearchOpen(false);
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="bg-[#FAFAFA] overflow-hidden sticky top-0 z-50 shadow-sm">
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(to right, transparent, black, transparent)'
          }}
        ></div>
        
        {/* Mobile Header - Compact */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 h-16">
            {/* Logo - Mobile */}
            <Link href="/" className="flex items-center shrink-0">
              <Image 
                src="/images/logo/K-imprint logo.avif" 
                alt="K-imprint Logo" 
                width={80} 
                height={52}
                className="h-12 w-auto"
              />
            </Link>
            
            {/* Mobile Icons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={isSearchOpen ? handleSearchClose : handleSearchOpen}
                className="p-2 text-gray-700 hover:text-[#8B4513] transition-colors"
                aria-label="Zoeken"
              >
                {isSearchOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <Image 
                    src="/images/icons/Search.svg" 
                    alt="Search" 
                    width={20} 
                    height={20}
                  />
                )}
              </button>
              <button 
                onClick={openCart}
                className="p-2 text-gray-700 hover:text-[#8B4513] transition-colors relative"
                aria-label="Winkelwagen"
              >
                <Image 
                  src="/images/icons/Shopping cart.svg" 
                  alt="Shopping Cart" 
                  width={20} 
                  height={20}
                />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#8B4513] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-[#8B4513] transition-colors"
                aria-label="Menu"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Full Width */}
          {isSearchOpen && (
            <div className="border-t border-gray-200 bg-white px-4 py-3">
              <div className="flex items-center gap-3 w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 bg-white focus-within:border-[#8B4513] transition-colors">
                <Image 
                  src="/images/icons/Search.svg" 
                  alt="Search" 
                  width={18} 
                  height={18}
                  className="shrink-0"
                />
                <input
                  type="text"
                  placeholder="Zoek naar producten..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu - Full Screen Style */}
          <div 
            className={`bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <nav className="flex flex-col px-4 py-6 space-y-1">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-lg transition-all font-medium text-base ${
                  activePage === 'home' 
                    ? 'bg-[#8B4513] text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/assortiment" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-lg transition-all font-medium text-base ${
                  activePage === 'assortiment' 
                    ? 'bg-[#8B4513] text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                Assortiment
              </Link>
              <Link 
                href="/maak-je-eigen" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-lg transition-all font-medium text-base ${
                  activePage === 'maak-je-eigen' 
                    ? 'bg-[#8B4513] text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                Maak je eigen product
              </Link>
              <Link 
                href="/fotoboek" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 px-4 rounded-lg transition-all font-medium text-base ${
                  activePage === 'fotoboek' 
                    ? 'bg-[#8B4513] text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                Fotoboek
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              <Link 
                href="/account/dashboard" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-all font-medium text-base flex items-center gap-3"
              >
                <Image 
                  src="/images/icons/person.svg" 
                  alt="Account" 
                  width={20} 
                  height={20}
                />
                <span>Account</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="grid-12 h-[63px]">
            {/* Logo */}
            <div className="col-2 flex items-center justify-start h-[63px]">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/images/logo/K-imprint logo.avif" 
                  alt="K-imprint Logo" 
                  width={96} 
                  height={63}
                  className="h-[63px] w-[96px]"
                />
              </Link>
            </div>
            
            {/* Desktop Navigation - Center OR Search Bar */}
            <div className="col-8 relative h-[63px]">
              <nav 
                className={`flex justify-center items-center space-x-8 absolute inset-0 transition-all duration-300 ease-in-out ${
                  isSearchOpen 
                    ? 'opacity-0 scale-95 pointer-events-none' 
                    : 'opacity-100 scale-100'
                }`}
                style={{ height: '63px' }}
              >
                <Link 
                  href="/" 
                  className={`navbar-link ${activePage === 'home' ? 'text-[#8B4513]' : 'text-gray-700 hover:text-[#8B4513]'}`} 
                  style={{ fontSize: '16px' }}
                >
                  Home
                </Link>
                <Link 
                  href="/assortiment" 
                  className={`navbar-link ${activePage === 'assortiment' ? 'text-[#8B4513]' : 'text-gray-700 hover:text-[#8B4513]'}`} 
                  style={{ fontSize: '16px' }}
                >
                  Assortiment
                </Link>
                <Link 
                  href="/maak-je-eigen" 
                  className={`navbar-link ${activePage === 'maak-je-eigen' ? 'text-[#8B4513]' : 'text-gray-700 hover:text-[#8B4513]'}`} 
                  style={{ fontSize: '16px' }}
                >
                  Maak je eigen product
                </Link>
                <Link 
                  href="/fotoboek" 
                  className={`navbar-link ${activePage === 'fotoboek' ? 'text-[#8B4513]' : 'text-gray-700 hover:text-[#8B4513]'}`} 
                  style={{ fontSize: '16px' }}
                >
                  Fotoboek
                </Link>
              </nav>
              
              <div 
                className={`flex items-center px-8 absolute inset-0 transition-all duration-300 ease-in-out ${
                  isSearchOpen 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
                style={{ height: '63px' }}
              >
                <div className="flex items-center gap-4 w-full border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Image 
                    src="/images/icons/Search.svg" 
                    alt="Search" 
                    width={20} 
                    height={20}
                    className="text-gray-400 transition-transform duration-200 hover:scale-110"
                  />
                  <input
                    type="text"
                    placeholder="Zoek naar producten..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
            
            {/* Desktop Icons - Right */}
            <div className="col-2 flex items-center justify-end space-x-4 h-[63px]">
              <button 
                onClick={isSearchOpen ? handleSearchClose : handleSearchOpen}
                className="p-2 text-gray-700 hover:text-[#8B4513] transition-all duration-200 hover:scale-110"
              >
                {isSearchOpen ? (
                  <span className="text-2xl font-light inline-block animate-[spin_0.3s_ease-in-out]">×</span>
                ) : (
                  <Image 
                    src="/images/icons/Search.svg" 
                    alt="Search" 
                    width={20} 
                    height={20}
                    className="transition-transform duration-200"
                  />
                )}
              </button>
              <Link href="/account" className="p-2 text-gray-700 hover:text-[#8B4513] transition-all duration-200 hover:scale-110">
                <Image 
                  src="/images/icons/person.svg" 
                  alt="Account" 
                  width={20} 
                  height={20}
                />
              </Link>
              <button 
                onClick={openCart}
                className="p-2 text-gray-700 hover:text-[#8B4513] transition-all duration-200 hover:scale-110 relative"
              >
                <Image 
                  src="/images/icons/Shopping cart.svg" 
                  alt="Shopping Cart" 
                  width={20} 
                  height={20}
                />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8B4513] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium animate-[scale_0.3s_ease-in-out]">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Results Dropdown */}
      <div 
        className={`fixed md:absolute left-0 right-0 top-[64px] md:top-[63px] bg-white shadow-2xl z-40 border-t border-gray-200 transition-all duration-300 ease-in-out ${
          isSearchOpen && (searchQuery.trim() !== "" || isSearching)
            ? 'opacity-100 translate-y-0 max-h-[calc(100vh-64px)] md:max-h-[600px]'
            : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden pointer-events-none'
        }`}
      >
        {/* Mobile Search Results */}
        <div className="md:hidden">
          <div className="max-h-[calc(100vh-64px)] overflow-y-auto p-4">
            {isSearching ? (
              <div className="text-center py-8 text-gray-500 animate-pulse">
                <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#8B4513] rounded-full animate-spin mb-2"></div>
                <p className="text-sm">Zoeken...</p>
              </div>
            ) : searchResults.length === 0 && searchQuery.trim() !== "" ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                Geen producten gevonden voor "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={handleSearchClose}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all active:scale-[0.98]"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">Foto</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{product.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900 text-sm">€{product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Search Results */}
        <div className="hidden md:block">
          <div className="grid-12">
            <div className="col-8 col-start-3">
              <div className="max-h-[500px] overflow-y-auto p-6">
                {isSearching ? (
                  <div className="text-center py-8 text-gray-500 animate-pulse">
                    <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#8B4513] rounded-full animate-spin mb-2"></div>
                    <p>Zoeken...</p>
                  </div>
                ) : searchResults.length === 0 && searchQuery.trim() !== "" ? (
                  <div className="text-center py-8 text-gray-500 animate-[fadeIn_0.3s_ease-in-out]">
                    Geen producten gevonden voor "{searchQuery}"
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map((product, index) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={handleSearchClose}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-[1.02] animate-[slideIn_0.3s_ease-out]"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden transition-transform duration-200 group-hover:scale-110">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">Geen foto</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 transition-colors duration-200 hover:text-[#8B4513]">{product.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                          <p className="text-sm text-gray-400 mt-1">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 transition-all duration-200 hover:text-[#8B4513] hover:scale-110">€{product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
