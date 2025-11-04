"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase, Product } from "../../lib/supabase";
import { useCart } from "../../contexts/CartContext";

interface NavbarProps {
  activePage?: 'home' | 'assortiment' | 'maak-je-eigen' | 'fotoboek';
}

export default function Navbar({ activePage = 'home' }: NavbarProps) {
  const { totalItems, openCart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  return (
    <>
      <header className="bg-[#FAFAFA] relative overflow-hidden" style={{ height: '63px' }}>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black to-transparent"></div>
        <div className="grid-12" style={{ height: '63px' }}>
          <div className="col-2 flex items-center justify-start" style={{ height: '63px' }}>
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/K-imprint logo.avif" 
                alt="K-imprint Logo" 
                width={96} 
                height={63}
                className="h-[63px] w-[96px]"
              />
            </Link>
          </div>
          
          {/* Navigation - Center OR Search Bar */}
          <div className="col-8 relative" style={{ height: '63px' }}>
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
                  src="/images/Search.svg" 
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
          
          {/* Icons - Right */}
          <div className="col-2 flex items-center justify-end space-x-4" style={{ height: '63px' }}>
            <button 
              onClick={isSearchOpen ? handleSearchClose : handleSearchOpen}
              className="p-2 text-gray-700 hover:text-[#8B4513] transition-all duration-200 hover:scale-110"
            >
              {isSearchOpen ? (
                <span className="text-2xl font-light inline-block animate-[spin_0.3s_ease-in-out]">×</span>
              ) : (
                <Image 
                  src="/images/Search.svg" 
                  alt="Search" 
                  width={20} 
                  height={20}
                  className="transition-transform duration-200"
                />
              )}
            </button>
            <Link href="/account" className="p-2 text-gray-700 hover:text-[#8B4513] transition-all duration-200 hover:scale-110">
              <Image 
                src="/images/person.svg" 
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
                src="/images/Shopping cart.svg" 
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
      </header>

      {/* Search Results Dropdown */}
      <div 
        className={`absolute left-0 right-0 bg-white shadow-2xl z-40 border-t border-gray-200 transition-all duration-300 ease-in-out ${
          isSearchOpen && (searchQuery.trim() !== "" || isSearching)
            ? 'opacity-100 translate-y-0 max-h-[600px]'
            : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden pointer-events-none'
        }`}
      >
        <div className="grid-12">
          <div className="col-8 col-start-3">
            <div className="max-h-[500px] overflow-y-auto p-6">
              {isSearching ? (
                <div className="text-center py-8 text-gray-500 animate-pulse">
                  <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-[#8B4513] rounded-full animate-spin mb-2"></div>
                  <p>Zoeken...</p>
                </div>
              ) : searchResults.length === 0 ? (
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
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-transform duration-200 group-hover:scale-110">
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
