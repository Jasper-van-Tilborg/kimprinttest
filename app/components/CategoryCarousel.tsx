'use client';

import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/carousel";
import { Product } from '../../lib/database';

interface CategoryCarouselProps {
  products: Product[];
}

export default function CategoryCarousel({ products }: CategoryCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  
  // Duplicate products for infinite scroll
  const duplicatedProducts = products.length > 0 ? [...products, ...products, ...products] : [];

  useEffect(() => {
    if (!api) {
      return;
    }

    // Start with middle slide for proper 3-card display
    const totalSlides = duplicatedProducts.length;
    if (totalSlides > 0) {
      // Start at the beginning of the second set (middle of all duplicated products)
      const startIndex = products.length;
      setCurrent(startIndex);
      // Scroll to start position after a short delay to ensure proper initialization
      setTimeout(() => {
        api.scrollTo(startIndex);
      }, 100);
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

  }, [api, products.length, duplicatedProducts.length]);

  // Function to check if a slide is the center one
  // With align: "center", the current slide is the center one
  const isCenterSlide = (index: number) => {
    return index === current;
  };

  return (
        <div className="relative max-w-7xl mx-auto h-[28rem] flex items-center">
          {/* Left Arrow */}
          <button 
            onClick={() => api?.scrollPrev()}
            className="absolute left-4 z-10 w-14 h-14 bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-110 transition-all duration-300 shadow-xl flex items-center justify-center border-2 border-gray-200 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button 
            onClick={() => api?.scrollNext()}
            className="absolute right-4 z-10 w-14 h-14 bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white hover:scale-110 transition-all duration-300 shadow-xl flex items-center justify-center border-2 border-gray-200 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
              containScroll: false,
              dragFree: false,
              skipSnaps: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-8 flex items-center">
          {duplicatedProducts.length > 0 ? (
            duplicatedProducts.map((product, index) => {
              const hasDiscount = product.compare_price && product.compare_price > product.price;
              const discountPercentage = hasDiscount ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100) : 0;
              const productImage = product.images && product.images.length > 0 ? product.images[0].url : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center';
              
              return (
                <CarouselItem key={`${product.id}-${index}`} className="pl-8 basis-1/3">
                  <div className={`relative rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 ${
                    isCenterSlide(index)
                      ? 'h-[28rem]' 
                      : 'h-72'
                  }`}>
                    {/* Background image */}
                    <div 
                      className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 ${
                        isCenterSlide(index)
                          ? 'scale-105' 
                          : 'scale-95'
                      }`}
                      style={{ backgroundImage: `url(${productImage})` }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    
                    {/* Discount badge */}
                    {hasDiscount && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: '#8B6F47', color: '#F5F1ED' }}>
                        -{discountPercentage}%
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                      <h3 className={`font-bold text-white mb-3 drop-shadow-lg ${
                        isCenterSlide(index)
                          ? 'text-4xl md:text-5xl' 
                          : 'text-xl md:text-2xl'
                      }`}>
                        {product.name}
                      </h3>
                      <div className={`text-white mb-6 drop-shadow-md ${
                        isCenterSlide(index)
                          ? 'text-lg md:text-xl' 
                          : 'text-sm md:text-base'
                      }`}>
                        {hasDiscount ? (
                          <>
                            <span className="line-through text-sm mr-2 opacity-80">€{product.compare_price!.toFixed(2)}</span>
                            <span className="font-bold text-lg">€{product.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="font-bold text-lg">€{product.price.toFixed(2)}</span>
                        )}
                      </div>
                      {hasDiscount && (
                        <p className={`text-gray-200 mb-6 drop-shadow-md ${
                          isCenterSlide(index)
                            ? 'text-lg md:text-xl' 
                            : 'text-sm md:text-base'
                        }`}>
                          Beperkte tijd aanbieding
                        </p>
                      )}
                      <button className={`bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ${
                        isCenterSlide(index)
                          ? 'px-10 py-5 text-xl' 
                          : 'px-6 py-3 text-base'
                      }`}>
                        {hasDiscount ? 'Bekijk offer →' : 'Bekijk product →'}
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              );
            })
          ) : (
            // Placeholder cards als er geen producten zijn
            Array.from({ length: 9 }).map((_, index) => (
              <CarouselItem key={`placeholder-${index}`} className="pl-8 basis-1/3">
                <div className={`relative rounded-2xl overflow-hidden group transition-all duration-500 ${
                  isCenterSlide(index)
                    ? 'h-[28rem]' 
                    : 'h-72'
                }`} style={{ backgroundColor: '#E5E7EB' }}>
                  {/* Placeholder content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className={`font-bold text-gray-500 mb-3 ${
                      isCenterSlide(index)
                        ? 'text-2xl md:text-3xl' 
                        : 'text-lg md:text-xl'
                    }`}>
                      Geen aanbiedingen
                    </h3>
                    <p className={`text-gray-400 ${
                      isCenterSlide(index)
                        ? 'text-base md:text-lg' 
                        : 'text-sm md:text-base'
                    }`}>
                      Er zijn momenteel geen speciale aanbiedingen beschikbaar
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
