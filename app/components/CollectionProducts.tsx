"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "../../app/actions/products";

type CollectionProductsProps = {
  products: Product[];
  collectionName: string;
};

export default function CollectionProducts({ products, collectionName }: CollectionProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const filteredProducts = selectedCategory === "all" 
    ? products
    : products.filter((product) =>
        product.category?.toLowerCase().includes(selectedCategory)
      );

  return (
    <section id="products" className="py-6 md:py-16 bg-[#FAFAFA]">
      <div className="grid-12">
        <div className="col-12">
          <h2 className="font-bold text-gray-900 underline mb-4 md:mb-8 text-lg md:text-[26px]">{collectionName} Producten</h2>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 ${
                selectedCategory === "all"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:border-black"
              }`}
            >
              Alle producten
            </button>
            <button
              onClick={() => setSelectedCategory("hoodie")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 ${
                selectedCategory === "hoodie"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:border-black"
              }`}
            >
              Hoodies
            </button>
            <button
              onClick={() => setSelectedCategory("tas")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 ${
                selectedCategory === "tas"
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:border-black"
              }`}
            >
              Totebags
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Geen producten gevonden</p>
              <Link 
                href="/assortiment"
                className="inline-block bg-black text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                Bekijk alle producten
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile: Show 2 products per row */}
            <div className="md:hidden col-12">
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => {
                  const firstImage = product.images && product.images.length > 0 
                    ? product.images[0] 
                    : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0
                    ? product.colors[0].images[0]
                    : product.image_url;
                  
                  const secondImage = product.images && product.images.length > 1 
                    ? product.images[1] 
                    : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 1
                    ? product.colors[0].images[1]
                    : null;
                  
                  const defaultImage = firstImage;
                  const hoverImage = secondImage;
                  
                  return (
                    <div key={product.id} className="group relative">
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="bg-gray-200 rounded-lg mb-2 flex items-center justify-center w-full h-[180px] overflow-hidden relative">
                          {defaultImage ? (
                            <>
                              <Image
                                src={defaultImage}
                                alt={product.name}
                                fill
                                className={`object-cover transition-opacity duration-300 ${
                                  hoverImage ? 'group-hover:opacity-0' : ''
                                }`}
                                sizes="(max-width: 768px) 188px, 300px"
                                loading="lazy"
                                quality={75}
                                unoptimized={defaultImage?.includes('supabase.co')}
                              />
                              {hoverImage && (
                                <Image
                                  src={hoverImage}
                                  alt={`${product.name} - hover`}
                                  fill
                                  className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  sizes="(max-width: 768px) 188px, 300px"
                                  loading="lazy"
                                  quality={75}
                                  unoptimized={hoverImage?.includes('supabase.co')}
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
            </div>

            {/* Desktop: Show all products */}
            <div className="hidden md:grid col-12 grid-cols-4 gap-5">
              {filteredProducts.map((product) => {
                const firstImage = product.images && product.images.length > 0 
                  ? product.images[0] 
                  : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0
                  ? product.colors[0].images[0]
                  : product.image_url;
                
                const secondImage = product.images && product.images.length > 1 
                  ? product.images[1] 
                  : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 1
                  ? product.colors[0].images[1]
                  : null;
                
                const defaultImage = firstImage;
                const hoverImage = secondImage;
                
                return (
                  <div key={product.id} className="group relative">
                    <Link href={`/product/${product.id}`}>
                      <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center w-full h-[395px] overflow-hidden relative">
                        {defaultImage ? (
                          <>
                            <Image
                              src={defaultImage}
                              alt={product.name}
                              fill
                              className={`object-cover transition-opacity duration-300 ${
                                hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'
                              }`}
                              sizes="(max-width: 768px) 188px, (max-width: 1024px) 300px, 395px"
                              loading="lazy"
                              quality={75}
                              unoptimized={defaultImage?.includes('supabase.co')}
                            />
                            {hoverImage && (
                              <Image
                                src={hoverImage}
                                alt={`${product.name} - hover`}
                                fill
                                className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                sizes="(max-width: 768px) 188px, (max-width: 1024px) 300px, 395px"
                                loading="lazy"
                                quality={75}
                                unoptimized={hoverImage?.includes('supabase.co')}
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
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

