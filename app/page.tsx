"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FadeInScroll from "./components/FadeInScroll";
import { useState } from "react";
import { useFadeInScroll } from "../hooks/useFadeInScroll";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('t-shirts');
  
  // Fade-in scroll hooks voor verschillende secties
  const collectieSection = useFadeInScroll({ threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
  const nuVerkrijgbaarSection = useFadeInScroll({ threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
  const fotoboekSection = useFadeInScroll({ threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

  const products = {
    'hoodies': [
      { name: "Demo Hoodie", price: "€75" },
      { name: "Demo Hoodie", price: "€75" },
      { name: "Demo Hoodie", price: "€75" },
      { name: "Demo Hoodie", price: "€75" }
    ],
    't-shirts': [
      { name: "Demo T-shirt", price: "€60" },
      { name: "Demo T-shirt", price: "€60" },
      { name: "Demo T-shirt", price: "€60" },
      { name: "Demo T-shirt", price: "€60" }
    ],
    'tassen': [
      { name: "Demo Tas", price: "€45" },
      { name: "Demo Tas", price: "€45" },
      { name: "Demo Tas", price: "€45" },
      { name: "Demo Tas", price: "€45" }
    ]
  };
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <Navbar activePage="home" />

      {/* Hero Section */}
      <section className="w-full">
        <div className="bg-gray-200 h-[400px] md:h-[600px] flex items-center justify-center">
          <span className="text-gray-500 text-sm md:text-lg">Hero Image Placeholder</span>
        </div>
      </section>

      {/* Onze Collectie Section */}
      <section ref={collectieSection.ref} className={`py-6 md:py-16 ${collectieSection.className}`}>
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-4 md:mb-8 text-lg md:text-[26px]">Onze Collectie</h2>
          </div>
          
          {/* Mobile: Simplified Category Buttons - Horizontal Scroll */}
          <div className="md:hidden col-12 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                <button 
                  onClick={() => setActiveCategory('hoodies')}
                  className={`px-4 py-2 rounded-lg transition-all font-medium text-sm whitespace-nowrap shrink-0 ${
                    activeCategory === 'hoodies' 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Hoodies
                </button>
                <button 
                  onClick={() => setActiveCategory('t-shirts')}
                  className={`px-4 py-2 rounded-lg transition-all font-medium text-sm whitespace-nowrap shrink-0 ${
                    activeCategory === 't-shirts' 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  T-shirts
                </button>
                <button 
                  onClick={() => setActiveCategory('tassen')}
                  className={`px-4 py-2 rounded-lg transition-all font-medium text-sm whitespace-nowrap shrink-0 ${
                    activeCategory === 'tassen' 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tassen
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
                  onClick={() => setActiveCategory('hoodies')}
                  className={`px-6 py-2 rounded-lg transition-colors min-w-[100px] text-center border ${
                    activeCategory === 'hoodies' 
                      ? 'bg-black text-white border-black' 
                      : 'bg-transparent text-black border-black hover:bg-gray-50'
                  }`}
                >
                  Hoodies
                </button>
                <button 
                  onClick={() => setActiveCategory('t-shirts')}
                  className={`px-6 py-2 rounded-lg transition-colors min-w-[100px] text-center border ${
                    activeCategory === 't-shirts' 
                      ? 'bg-black text-white border-black' 
                      : 'bg-transparent text-black border-black hover:bg-gray-50'
                  }`}
                >
                  T-shirts
                </button>
                <button 
                  onClick={() => setActiveCategory('tassen')}
                  className={`px-6 py-2 rounded-lg transition-colors min-w-[100px] text-center border ${
                    activeCategory === 'tassen' 
                      ? 'bg-black text-white border-black' 
                      : 'bg-transparent text-black border-black hover:bg-gray-50'
                  }`}
                >
                  Tassen
                </button>
              </div>
              <Link href="/assortiment" className="text-black hover:underline">
                Ontdek meer...
              </Link>
            </div>
          </div>
          
          {/* Mobile: Show only 2 products in a row */}
          <div className="md:hidden col-12">
            <div className="grid grid-cols-2 gap-3">
              {products[activeCategory as keyof typeof products].slice(0, 2).map((product, index) => (
                <FadeInScroll 
                  key={`${activeCategory}-${index}`}
                  threshold={0.1}
                  rootMargin="0px 0px -50px 0px"
                  delay={index * 50}
                >
                  <Link href="/assortiment" className="block">
                    <div className="bg-gray-200 rounded-lg mb-2 flex items-center justify-center w-full h-[180px]">
                      <span className="text-gray-500 text-xs">Product</span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <h3 className="font-medium text-gray-900 text-xs truncate flex-1 mr-2">{product.name}</h3>
                      <p className="text-gray-600 text-xs font-medium shrink-0">{product.price}</p>
                    </div>
                  </Link>
                </FadeInScroll>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link 
                href="/assortiment" 
                className="inline-block bg-black text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                Alle producten bekijken
              </Link>
            </div>
          </div>

          {/* Desktop: Show all 4 products */}
          <div className="hidden md:block col-12">
            <div className="grid-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
              {products[activeCategory as keyof typeof products].map((product, index) => (
                <FadeInScroll 
                  key={`${activeCategory}-${index}`}
                  threshold={0.1}
                  rootMargin="0px 0px -50px 0px"
                  delay={index * 50}
                  className="col-3"
                >
                  <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center w-full h-[395px]">
                    <span className="text-gray-500">Product Image</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-gray-600">{product.price}</p>
                  </div>
                </FadeInScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nu verkrijgbaar Section */}
      <section ref={nuVerkrijgbaarSection.ref} className={`py-6 md:py-16 bg-white ${nuVerkrijgbaarSection.className}`}>
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-4 md:mb-8 text-lg md:text-[26px]">Nu verkrijgbaar</h2>
          </div>
          
          {/* Mobile Layout - Simplified, Show only 2 items */}
          <div className="md:hidden col-12">
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <Link key={item} href="/assortiment" className="block bg-gray-200 rounded-lg overflow-hidden active:scale-[0.98] transition-transform">
                  <div className="h-[220px] flex items-center justify-center relative">
                    <span className="text-gray-500 text-xs">Product Image</span>
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white rounded-lg font-medium text-xs">
                      Ontdek Nu!
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-gray-600 text-xs mb-1">Demo Collectie</p>
                    <h3 className="text-gray-900 text-sm font-semibold mb-2">Demo Product Titel</h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link 
                href="/assortiment" 
                className="inline-block bg-black text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                Meer bekijken
              </Link>
            </div>
          </div>
          
          {/* Desktop Layout - Side by Side */}
          <div className="hidden md:block col-12">
            <div className="grid-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
              {/* Left Column */}
              <div className="col-6">
                <div className="flex items-start gap-5">
                  {[1, 2].map((item) => (
                    <div key={item} className="text-center flex-1">
                      <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative w-full h-[425px]">
                        <span className="text-gray-500">Product Image</span>
                        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-transparent text-black border border-black rounded-lg hover:bg-gray-50 transition-colors">
                          Ontdek Nu!
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right Column */}
              <div className="col-6">
                <div className="flex flex-col gap-9">
                  {[1, 2].map((item) => (
                    <div key={item} className="bg-gray-200 rounded-lg flex w-full h-[195px]">
                      {/* Left side - 3 vertical sections */}
                      <div className="flex-1 flex flex-col justify-between p-4">
                        {/* Top section - Collection name */}
                        <div className="flex-1 flex items-start">
                          <p className="text-gray-600 text-base font-normal">Demo Collectie</p>
                        </div>
                        
                        {/* Middle section - Product title */}
                        <div className="flex-1 flex items-center">
                          <h3 className="text-gray-900 text-xl font-medium">Demo Product Titel</h3>
                        </div>
                        
                        {/* Bottom section - Button */}
                        <div className="flex-1 flex items-end">
                          <button className="px-4 py-2 bg-transparent text-black border border-black rounded-lg hover:bg-gray-50 transition-colors">
                            Check Nu!
                          </button>
                        </div>
                      </div>
                      
                      {/* Right side - Product image */}
                      <div className="w-1/3 flex items-center justify-center">
                        <span className="text-gray-500">Product Image</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Check ons Fotoboek Section */}
      <section ref={fotoboekSection.ref} className={`bg-black ${fotoboekSection.className} py-8 md:py-0`}>
        <div className="grid-12">
          {/* Mobile Layout - Simplified */}
          <div className="md:hidden col-12">
            <div className="flex flex-col justify-center items-center text-center py-8 space-y-6">
              <div>
                <h2 className="text-white mb-2 text-3xl font-light">Check ons Fotoboek</h2>
                <p className="text-gray-300 text-base font-light">©K-imprint</p>
              </div>
              <Link 
                href="/fotoboek"
                className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                Bekijk Fotoboek →
              </Link>
            </div>
          </div>
          
          {/* Desktop Layout - Centered */}
          <div className="hidden md:flex col-12">
            <div className="flex flex-col justify-center items-center text-center w-full py-16">
              <h2 className="text-white mb-4 text-[60px] font-light">Check ons Fotoboek</h2>
              <p className="text-gray-300 text-[30px] font-light mb-8">©K-imprint</p>
              <Link 
                href="/fotoboek"
                className="inline-block bg-white text-black px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors"
              >
                Bekijk Fotoboek →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
