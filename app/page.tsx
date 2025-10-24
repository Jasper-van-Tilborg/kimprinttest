"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";
import DomeGallery from "./components/DomeGallery";
import { useState } from "react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('t-shirts');

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
    <div className="min-h-screen bg-[#FEF2EB]">
      {/* Header */}
      <Navbar activePage="home" />

      {/* Hero Section */}
      <section className="w-full">
        <div className="bg-gray-200 h-[600px] flex items-center justify-center">
          <span className="text-gray-500 text-lg">Hero Image Placeholder</span>
        </div>
      </section>

      {/* Onze Collectie Section */}
      <section className="py-16">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-8" style={{ fontSize: '26px' }}>Onze Collectie</h2>
          </div>
          
          {/* Category Buttons */}
          <div className="col-12">
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
          
          {/* Product Grid */}
          <div className="col-12 flex items-start" style={{ gap: '20px' }}>
            {products[activeCategory as keyof typeof products].map((product, index) => (
              <div key={index} className="text-center" style={{ width: '340px' }}>
                <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center" style={{ width: '340px', height: '395px' }}>
                  <span className="text-gray-500">Product Image</span>
                </div>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-gray-600">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nu verkrijgbaar Section */}
      <section className="py-16 bg-[#FEF2EB]">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-8" style={{ fontSize: '26px' }}>Nu verkrijgbaar</h2>
          </div>
          
          {/* Left Column */}
          <div className="col-6">
            <div className="flex items-start" style={{ gap: '20px' }}>
              {[1, 2].map((item) => (
                <div key={item} className="text-center" style={{ width: '340px' }}>
                  <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative" style={{ width: '340px', height: '425px' }}>
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
            <div style={{ gap: '35px' }} className="flex flex-col">
              {[1, 2].map((item) => (
                <div key={item} className="bg-gray-200 rounded-lg flex" style={{ width: '100%', height: '195px' }}>
                  {/* Left side - 3 vertical sections */}
                  <div className="flex-1 flex flex-col justify-between p-4">
                    {/* Top section - Collection name */}
                    <div className="flex-1 flex items-start">
                      <p className="text-gray-600" style={{ fontSize: '16px', fontWeight: '400' }}>Demo Collectie</p>
                    </div>
                    
                    {/* Middle section - Product title */}
                    <div className="flex-1 flex items-center">
                      <h3 className="text-gray-900" style={{ fontSize: '20px', fontWeight: '500' }}>Demo Product Titel</h3>
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
      </section>

      {/* Check ons Fotoboek Section */}
      <section className="bg-black" style={{ height: '550px' }}>
        <div className="grid-12" style={{ height: '550px' }}>
          {/* Left side - Text */}
          <div className="col-6 flex flex-col justify-center items-start" style={{ height: '550px' }}>
            <h2 className="text-white mb-4" style={{ fontSize: '60px', fontWeight: '300' }}>Check ons Fotoboek</h2>
            <p className="text-gray-300" style={{ fontSize: '30px', fontWeight: '300' }}>©K-imprint</p>
          </div>
          
          {/* Right side - Dome Gallery */}
          <div className="col-6" style={{ height: '550px' }}>
            <DomeGallery 
              grayscale={true}
              overlayBlurColor="#000000"
              imageBorderRadius="8px"
              openedImageBorderRadius="8px"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FEF2EB] py-16">
        <div className="grid-12">
          {/* Logo & Copyright */}
          <div className="col-2 flex flex-col justify-center">
            <div className="mb-4">
              <Image 
                src="/images/K-imprint logo.avif" 
                alt="K-imprint Logo" 
                width={120} 
                height={63}
                className="h-full w-auto"
              />
            </div>
            <p className="text-gray-600">©K-imprint</p>
            <p className="text-gray-600">All Rights Reserved</p>
          </div>
          
          {/* Over ons */}
          <div className="col-2">
            <h4 className="font-bold text-gray-900 mb-4">Over ons</h4>
            <ul className="space-y-2">
              <li><Link href="/over-ons" className="text-gray-600 hover:text-[#8B4513] transition-colors">Over ons</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-[#8B4513] transition-colors">Contact</Link></li>
              <li><Link href="/offertes" className="text-gray-600 hover:text-[#8B4513] transition-colors">Offertes</Link></li>
            </ul>
          </div>
          
          {/* Links */}
          <div className="col-2">
            <h4 className="font-bold text-gray-900 mb-4">Links</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-600 hover:text-[#8B4513] transition-colors">Privacy</Link></li>
              <li><Link href="/algemene-voorwaarden" className="text-gray-600 hover:text-[#8B4513] transition-colors">Algemene Voorwaarden</Link></li>
              <li><Link href="/size-guide" className="text-gray-600 hover:text-[#8B4513] transition-colors">Size Guide</Link></li>
              <li><Link href="/faqs" className="text-gray-600 hover:text-[#8B4513] transition-colors">FAQs</Link></li>
            </ul>
          </div>
          
          {/* Volg ons */}
          <div className="col-2">
            <h4 className="font-bold text-gray-900 mb-4">Volg ons</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-[#8B4513] transition-colors">Facebook</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#8B4513] transition-colors">Instagram</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-[#8B4513] transition-colors">TikTok</Link></li>
            </ul>
          </div>
          
              {/* Abonneer */}
              <div className="col-4">
                <h4 className="font-bold text-gray-900 mb-4">Abonneer</h4>
                <p className="text-gray-600 mb-4">Krijg E-mail Updates over onze laatste collecties en tijdelijke offers.</p>
                <div className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="Vul hier je email in" 
                    className="w-full px-3 py-2 border-b border-black focus:outline-none focus:border-black text-gray-600"
                  />
                  <button className="px-4 py-2 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors">
                    Abonneer
                  </button>
                </div>
              </div>
        </div>
      </footer>
    </div>
  );
}
