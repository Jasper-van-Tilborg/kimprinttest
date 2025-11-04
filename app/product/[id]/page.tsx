"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState, use } from "react";
import { useCart } from "../../../contexts/CartContext";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { addItem, openCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Demo product data - in productie zou dit van de API komen
  const product = {
    id: resolvedParams.id,
    name: 'Halloween T-shirt',
    price: 81.99,
    image_url: undefined,
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <Navbar activePage="assortiment" />

      {/* Breadcrumbs */}
      <div className="bg-[#FAFAFA] py-4">
        <div className="grid-12">
          <div className="col-12">
            <Link href="/assortiment" className="flex items-center text-gray-600 hover:text-[#8B4513] transition-colors">
              <span className="mr-2">←</span>
              <span>Assortiment • Hoodies</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="pt-8 pb-16">
        <div className="grid-12">
          {/* Top Row - Images */}
          <div className="col-6">
            {/* Main Image with Carousel */}
            <div className="bg-gray-200 rounded-lg flex items-center justify-center relative" style={{ height: '550px' }}>
              <span className="text-gray-500 text-lg">Main Product Image</span>
              
              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button className="w-2 h-2 rounded-full border border-black"></button>
                <button className="w-2 h-2 rounded-full bg-black"></button>
                <button className="w-2 h-2 rounded-full border border-black"></button>
              </div>
            </div>
          </div>
          
          <div className="col-6">
            {/* 3 images - 2 boven, 1 onder */}
            <div className="flex flex-col gap-4" style={{ height: '550px' }}>
              {/* Top 2 cards horizontaal */}
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Image 2</span>
                </div>
                <div className="bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Image 3</span>
                </div>
              </div>
              {/* Bottom 1 bredere card */}
              <div className="bg-gray-200 rounded-lg flex items-center justify-center flex-1">
                <span className="text-gray-500 text-sm">Image 4</span>
              </div>
            </div>
          </div>

          {/* Bottom Row - Product Info & Purchase */}
          <div className="col-6 mt-8">
            <div className="bg-white p-6 rounded-lg">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl font-bold text-gray-900">Halloween T-shirt</h1>
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isFavorite 
                      ? 'border-red-500 scale-110' 
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`transition-colors duration-300 ${
                      isFavorite ? 'text-red-500' : 'text-gray-700'
                    }`}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
              
              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Kleur</h3>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setSelectedColor('black')}
                    className={`w-10 h-10 bg-black rounded-full border-2 transition-all ${
                      selectedColor === 'black' ? 'border-black ring-2 ring-offset-2 ring-black' : 'border-gray-300'
                    }`}
                  ></button>
                  <button 
                    onClick={() => setSelectedColor('white')}
                    className={`w-10 h-10 bg-white rounded-full border-2 transition-all ${
                      selectedColor === 'white' ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'
                    }`}
                  ></button>
                  <button 
                    onClick={() => setSelectedColor('green')}
                    className={`w-10 h-10 bg-green-400 rounded-full border-2 transition-all ${
                      selectedColor === 'green' ? 'border-green-400 ring-2 ring-offset-2 ring-green-400' : 'border-gray-300'
                    }`}
                  ></button>
                </div>
              </div>
              
              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Maat</h3>
                <div className="grid grid-cols-5 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 rounded-lg text-base font-medium transition-colors border ${
                        selectedSize === size
                          ? 'bg-black text-white border-black' 
                          : 'bg-transparent text-black border-black hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Omschrijving</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </div>
            </div>
          </div>

          <div className="col-6 mt-8 flex flex-col">
            <div className="bg-white p-6 rounded-lg mb-8 space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Aantal</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-3xl font-bold text-gray-900">€ {(product.price * quantity).toFixed(2)}</span>
                <button 
                  onClick={handleAddToCart}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <span>✓</span>
                      Toegevoegd!
                    </>
                  ) : (
                    <>
                      In winkelwagen →
                    </>
                  )}
                </button>
              </div>

              {/* View Cart Link */}
              {addedToCart && (
                <button
                  onClick={openCart}
                  className="w-full text-[#8B4513] hover:underline text-sm font-medium animate-[fadeIn_0.3s_ease-in-out]"
                >
                  Bekijk winkelwagen
                </button>
              )}
            </div>

            {/* Andere Must-Haves */}
            <div className="flex flex-col flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Andere Must-Haves</h2>
              <div className="grid grid-cols-3 gap-4 flex-1">
                {[1, 2, 3].map((item) => (
                  <Link key={item} href="/product/demo-tshirt" className="group flex flex-col">
                    <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center flex-1">
                      <span className="text-gray-500 text-sm">Product</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Demo T-shirt</h3>
                      <p className="text-gray-600">€60</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
