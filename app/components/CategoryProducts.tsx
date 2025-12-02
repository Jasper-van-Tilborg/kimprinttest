"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "../actions/products";
import { isSupabaseImage } from "../../lib/imageUtils";
import { getProductsByCategoryFilter } from "../actions/products";

type CategoryProductsProps = {
  initialCategory: string;
  initialProducts: Product[];
};

export default function CategoryProducts({ initialCategory, initialProducts }: CategoryProductsProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = async (category: string) => {
    setActiveCategory(category);
    setLoading(true);
    
    try {
      let categoryFilter = '';
      switch (category) {
        case 't-shirts':
          categoryFilter = 't-shirt';
          break;
        case 'hoodies':
          categoryFilter = 'hoodie';
          break;
        case 'tassen':
          categoryFilter = 'tas';
          break;
      }

      const data = await getProductsByCategoryFilter(categoryFilter, 4);
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mobile: Simplified Category Buttons - Horizontal Scroll */}
      <div className="md:hidden col-12 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <button 
              onClick={() => handleCategoryChange('hoodies')}
              className={`px-4 py-2 rounded-lg transition-all font-medium text-sm whitespace-nowrap shrink-0 ${
                activeCategory === 'hoodies' 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hoodies
            </button>
            <button 
              onClick={() => handleCategoryChange('t-shirts')}
              className={`px-4 py-2 rounded-lg transition-all font-medium text-sm whitespace-nowrap shrink-0 ${
                activeCategory === 't-shirts' 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              T-shirts
            </button>
            <button 
              onClick={() => handleCategoryChange('tassen')}
              className={`px-4 py-2 rounded-lg transition-all font-medium text-sm whitespace-nowrap shrink-0 ${
                activeCategory === 'tassen' 
                  ? 'bg-black text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Totebags
            </button>
          </div>
        </div>
        <Link 
          href="/assortiment" 
          className="block text-center py-2 text-[#8B4513] font-medium text-sm hover:underline"
        >
          Bekijk volledige collectie →
        </Link>
      </div>

      {/* Desktop: Category Buttons */}
      <div className="hidden md:block col-12">
        <div className="flex justify-between items-end mb-8">
          <div className="flex space-x-4">
            <button 
              onClick={() => handleCategoryChange('hoodies')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 min-w-[100px] text-center ${
                activeCategory === 'hoodies' 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              Hoodies
            </button>
            <button 
              onClick={() => handleCategoryChange('t-shirts')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 min-w-[100px] text-center ${
                activeCategory === 't-shirts' 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              T-shirts
            </button>
            <button 
              onClick={() => handleCategoryChange('tassen')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 min-w-[100px] text-center ${
                activeCategory === 'tassen' 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
            >
              Totebags
            </button>
          </div>
          <Link href="/assortiment" className="text-black hover:underline">
            Ontdek meer...
          </Link>
        </div>
      </div>
      
      {/* Mobile: Show only 2 products in a row */}
      <div className="md:hidden col-12">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg mb-2 w-full h-[180px]"></div>
                <div className="bg-gray-200 h-3 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Geen producten gevonden</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 2).map((product) => {
              const secondImage = product.images && product.images.length > 1 ? product.images[1] : null;
              const secondImageFromColor = product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 1 
                ? product.colors[0].images[1] 
                : null;
              const firstImageFromArray = product.images && product.images.length > 0 ? product.images[0] : null;
              const primaryImage = firstImageFromArray || product.image_url;
              const hoverImage = secondImage || secondImageFromColor;
              
              return (
                <div key={product.id} className="group">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="bg-gray-200 rounded-lg mb-2 flex items-center justify-center w-full h-[180px] overflow-hidden relative">
                      {primaryImage ? (
                        <>
                          <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className={`object-cover transition-opacity duration-300 ${
                              hoverImage ? 'group-hover:opacity-0' : ''
                            }`}
                            unoptimized={isSupabaseImage(primaryImage)}
                            sizes="(max-width: 768px) 188px, 300px"
                            loading="lazy"
                            quality={75}
                          />
                          {hoverImage && (
                            <Image
                              src={hoverImage}
                              alt={`${product.name} - tweede afbeelding`}
                              fill
                              className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              unoptimized={isSupabaseImage(hoverImage)}
                              sizes="(max-width: 768px) 188px, 300px"
                              loading="lazy"
                              quality={75}
                            />
                          )}
                        </>
                      ) : (
                        <span className="text-gray-500 text-xs">Product</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <h3 className="font-medium text-gray-900 text-xs truncate flex-1 mr-2">{product.name}</h3>
                      <p className="text-gray-600 text-xs font-medium shrink-0">€{product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        <div className="text-center mt-4">
          <Link 
            href={`/assortiment/${activeCategory === 't-shirts' ? 't-shirts' : activeCategory === 'hoodies' ? 'hoodies' : 'tassen'}`}
            className="inline-block bg-black text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
          >
            Alle producten bekijken
          </Link>
        </div>
      </div>

      {/* Desktop: Show all 4 products */}
      <div className="hidden md:block col-12">
        {loading ? (
          <div className="grid-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-3 animate-pulse">
                <div className="bg-gray-200 rounded-lg mb-4 w-full h-[395px]"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Geen producten gevonden</p>
          </div>
        ) : (
          <div className="grid-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
            {products.slice(0, 4).map((product) => {
              const secondImage = product.images && product.images.length > 1 ? product.images[1] : null;
              const secondImageFromColor = product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 1 
                ? product.colors[0].images[1] 
                : null;
              const firstImageFromArray = product.images && product.images.length > 0 ? product.images[0] : null;
              const primaryImage = firstImageFromArray || product.image_url;
              const hoverImage = secondImage || secondImageFromColor;
              
              return (
                <Link key={product.id} href={`/product/${product.id}`} className="col-3 group">
                  <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center w-full h-[395px] overflow-hidden relative">
                    {primaryImage ? (
                      <>
                        <Image
                          src={primaryImage}
                          alt={product.name}
                          fill
                          className={`object-cover transition-opacity duration-300 ${
                            hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'
                          }`}
                          unoptimized={isSupabaseImage(primaryImage)}
                          sizes="(max-width: 768px) 188px, (max-width: 1024px) 300px, 395px"
                          loading="lazy"
                          quality={75}
                        />
                        {hoverImage && (
                          <Image
                            src={hoverImage}
                            alt={`${product.name} - tweede afbeelding`}
                            fill
                            className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            unoptimized={isSupabaseImage(hoverImage)}
                            sizes="(max-width: 768px) 188px, (max-width: 1024px) 300px, 395px"
                            loading="lazy"
                            quality={75}
                          />
                        )}
                      </>
                    ) : (
                      <span className="text-gray-500">Product Image</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <h3 className="font-medium text-gray-900 group-hover:text-[#8B4513] transition-colors">{product.name}</h3>
                    <p className="text-gray-600">€{product.price.toFixed(2)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

