"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../contexts/CartContext";

export default function ShoppingCart() {
  const { items, removeItem, updateQuantity, totalPrice, isCartOpen, closeCart } = useCart();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isCartOpen 
            ? 'opacity-50 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Winkelwagen</h2>
          <button 
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-3xl font-light">×</span>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Image 
                  src="/images/icons/Shopping cart.svg" 
                  alt="Empty cart" 
                  width={40} 
                  height={40}
                  className="opacity-50"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Je winkelwagen is leeg
              </h3>
              <p className="text-gray-500 mb-6">
                Voeg producten toe om te beginnen met winkelen
              </p>
              <Link 
                href="/assortiment"
                onClick={closeCart}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Naar Assortiment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemKey = `${item.id}-${item.color}-${item.size}`;
                return (
                  <div 
                    key={itemKey}
                    className="flex gap-4 bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">Geen foto</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        <div className="flex gap-2 text-sm text-gray-500">
                          {item.color && <span>Kleur: {item.color}</span>}
                          {item.size && <span>• Maat: {item.size}</span>}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.color, item.size)}
                            className="w-8 h-8 rounded-full border-2 border-black text-black flex items-center justify-center hover:bg-gray-100 transition-colors font-bold"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-bold text-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.color, item.size)}
                            className="w-8 h-8 rounded-full border-2 border-black text-black flex items-center justify-center hover:bg-gray-100 transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id, item.color, item.size)}
                      className="text-gray-400 hover:text-red-500 transition-colors self-start"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Total & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-gray-700">Subtotaal</span>
              <span className="font-bold text-gray-900">€{totalPrice.toFixed(2)}</span>
            </div>
            
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-all duration-200 hover:shadow-lg font-medium text-lg text-center"
            >
              Afrekenen →
            </Link>
            
            <button 
              onClick={closeCart}
              className="w-full text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Verder winkelen
            </button>
          </div>
        )}
      </div>
    </>
  );
}

