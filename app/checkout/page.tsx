"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = gegevens, 2 = betaling, 3 = bevestiging
  
  
  // Formulier state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    country: "Nederland",
  });

  const [paymentMethod, setPaymentMethod] = useState<"ideal" | "creditcard" | "paypal">("ideal");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isStep1Valid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.address &&
      formData.postalCode &&
      formData.city
    );
  };

  const handlePlaceOrder = () => {
    if (!acceptedTerms) {
      alert("Accepteer de algemene voorwaarden om door te gaan");
      return;
    }

    // Hier zou je de order naar je backend sturen
    console.log("Order placed:", { formData, paymentMethod, items, totalPrice });
    
    // Simuleer succesvolle betaling
    setStep(3);
    
    // Clear cart na 2 seconden
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  // Redirect als cart leeg is (behalve bij bevestiging)
  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar />
        <div className="py-16">
          <div className="grid-12">
            <div className="col-12 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Je winkelwagen is leeg</h1>
              <p className="text-gray-600 mb-8">Voeg producten toe om af te rekenen</p>
              <Link
                href="/assortiment"
                className="inline-block px-4 py-2 bg-black text-white border-2 border-black rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                Naar Assortiment
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      {/* Order Bevestiging (Step 3) */}
      {step === 3 ? (
        <div className="py-8 md:py-16 min-h-[70vh] flex items-center">
          <div className="grid-12 w-full">
            <div className="col-12 md:col-10 md:col-start-2">
              <div className="bg-white rounded-lg p-6 md:p-12 text-center shadow-2xl max-w-2xl mx-auto">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 animate-[scale_0.5s_ease-in-out]">
                  <svg width="32" height="32" className="md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                
                <h1 className="text-2xl md:text-4xl font-bold text-black mb-3 md:mb-4">
                  Bestelling Geplaatst!
                </h1>
                
                <p className="text-base md:text-lg text-gray-700 mb-2 font-medium">
                  Bedankt voor je bestelling
                </p>
                
                <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 px-4">
                  Je ontvangt een bevestigingsmail op <span className="font-medium text-black break-all">{formData.email}</span>
                </p>
                
                <div className="bg-gray-50 rounded-xl p-4 md:p-8 mb-6 md:mb-10 border-2 border-gray-200">
                  <p className="text-xs md:text-sm font-bold text-gray-700 mb-2 md:mb-3 uppercase tracking-wider">
                    Ordernummer
                  </p>
                  <p className="text-xl md:text-3xl font-bold text-black tracking-wide">
                    #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                  <Link
                    href="/"
                    className="px-4 py-2 bg-black text-white border-2 border-black rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
                  >
                    Terug naar Home
                  </Link>
                  <Link
                    href="/assortiment"
                    className="px-4 py-2 bg-white text-black border-2 border-gray-300 rounded-lg font-medium text-sm hover:border-black transition-colors"
                  >
                    Verder Winkelen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Progress Steps */}
          <div className="bg-white border-b border-gray-200 py-4 md:py-6">
            <div className="grid-12">
              <div className="col-12">
                <div className="flex items-center justify-center gap-2 md:gap-4">
                  <div className={`flex items-center gap-1.5 md:gap-2 ${step >= 1 ? 'text-[#8B4513]' : 'text-gray-400'}`}>
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${step >= 1 ? 'bg-[#8B4513] text-white' : 'bg-gray-200'}`}>
                      1
                    </div>
                    <span className="font-medium text-sm md:text-base">Gegevens</span>
                  </div>
                  <div className="w-8 md:w-12 h-px bg-gray-300"></div>
                  <div className={`flex items-center gap-1.5 md:gap-2 ${step >= 2 ? 'text-[#8B4513]' : 'text-gray-400'}`}>
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${step >= 2 ? 'bg-[#8B4513] text-white' : 'bg-gray-200'}`}>
                      2
                    </div>
                    <span className="font-medium text-sm md:text-base">Betaling</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-6 md:py-12">
            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="grid-12">
                {/* Main Content */}
                <div className="col-12">
                  {step === 1 && (
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Verzendgegevens</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">
                            Voornaam *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium text-sm md:text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">
                            Achternaam *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium text-sm md:text-base"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium text-sm md:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Telefoonnummer *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium text-sm md:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Adres *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium text-sm md:text-base"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">
                            Postcode *
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium text-sm md:text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-black mb-2">
                            Plaats *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium text-sm md:text-base"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-black mb-2">
                          Land *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium text-sm md:text-base"
                        >
                          <option value="Nederland">Nederland</option>
                          <option value="België">België</option>
                          <option value="Duitsland">Duitsland</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!isStep1Valid()}
                      className={`w-full mt-6 md:mt-8 py-3 md:py-4 rounded-lg font-medium text-base md:text-lg transition-all ${
                        isStep1Valid()
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Naar Betaling →
                    </button>
                  </div>
                )}

                  {step === 2 && (
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Betaalmethode</h2>

                      <div className="space-y-3 mb-8">
                        <div
                          onClick={() => setPaymentMethod("ideal")}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            paymentMethod === "ideal" ? 'border-[#8B4513] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === "ideal" ? 'border-[#8B4513]' : 'border-gray-300'
                              }`}>
                                {paymentMethod === "ideal" && (
                                  <div className="w-3 h-3 rounded-full bg-[#8B4513]"></div>
                                )}
                              </div>
                              <span className="font-medium text-gray-900">iDEAL</span>
                            </div>
                            <span className="text-sm text-gray-500">Meest gekozen</span>
                          </div>
                        </div>

                        <div
                          onClick={() => setPaymentMethod("creditcard")}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            paymentMethod === "creditcard" ? 'border-[#8B4513] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === "creditcard" ? 'border-[#8B4513]' : 'border-gray-300'
                            }`}>
                              {paymentMethod === "creditcard" && (
                                <div className="w-3 h-3 rounded-full bg-[#8B4513]"></div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">Creditcard</span>
                          </div>
                        </div>

                        <div
                          onClick={() => setPaymentMethod("paypal")}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            paymentMethod === "paypal" ? 'border-[#8B4513] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === "paypal" ? 'border-[#8B4513]' : 'border-gray-300'
                            }`}>
                              {paymentMethod === "paypal" && (
                                <div className="w-3 h-3 rounded-full bg-[#8B4513]"></div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">PayPal</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6 mb-6">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-1 w-5 h-5 accent-[#8B4513]"
                          />
                          <span className="text-sm text-gray-600">
                            Ik ga akkoord met de{" "}
                            <Link href="/algemene-voorwaarden" className="text-[#8B4513] hover:underline">
                              algemene voorwaarden
                            </Link>{" "}
                            en het{" "}
                            <Link href="/privacy-beleid" className="text-[#8B4513] hover:underline">
                              privacybeleid
                            </Link>
                          </span>
                        </label>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => setStep(1)}
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-medium text-sm bg-white text-black hover:border-black transition-colors"
                        >
                          ← Terug
                        </button>
                        <button
                          onClick={handlePlaceOrder}
                          disabled={!acceptedTerms}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm border-2 transition-colors ${
                            acceptedTerms
                              ? 'bg-black text-white border-black hover:bg-gray-800'
                              : 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                          }`}
                        >
                          Bestelling Plaatsen
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile: Order Summary */}
                <div className="col-12 mt-6">
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Overzicht</h3>
                  
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {items.map((item) => {
                      const itemKey = `${item.id}-${item.color}-${item.size}`;
                      return (
                        <div key={itemKey} className="flex gap-2">
                          <div className="w-14 h-14 bg-gray-200 rounded-lg shrink-0">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                Foto
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-xs truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">
                              {item.color} • {item.size} • {item.quantity}x
                            </p>
                            <p className="text-xs font-medium text-gray-900 mt-1">
                              €{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Subtotaal</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Verzendkosten</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>BTW (21%)</span>
                      <span>€{(totalPrice * 0.21).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900">
                      <span>Totaal</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Desktop Layout: Form & Order Summary Side by Side */}
            <div className="hidden md:block">
              <div className="grid-12">
                {/* Main Content */}
                <div className="col-8">
                  {step === 1 && (
                    <div className="bg-white rounded-lg p-8 shadow-lg">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Verzendgegevens</h2>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-black mb-2">
                              Voornaam *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-black mb-2">
                              Achternaam *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-black mb-2">
                            E-mail *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-black mb-2">
                            Telefoonnummer *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-black mb-2">
                            Adres *
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-black mb-2">
                              Postcode *
                            </label>
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-black mb-2">
                              Plaats *
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-black mb-2">
                            Land *
                          </label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium"
                          >
                            <option value="Nederland">Nederland</option>
                            <option value="België">België</option>
                            <option value="Duitsland">Duitsland</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => setStep(2)}
                        disabled={!isStep1Valid()}
                        className={`w-full mt-8 py-4 rounded-lg font-medium text-lg transition-all ${
                          isStep1Valid()
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Naar Betaling →
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="bg-white rounded-lg p-8 shadow-lg">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Betaalmethode</h2>

                      <div className="space-y-3 mb-8">
                        <div
                          onClick={() => setPaymentMethod("ideal")}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            paymentMethod === "ideal" ? 'border-[#8B4513] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                paymentMethod === "ideal" ? 'border-[#8B4513]' : 'border-gray-300'
                              }`}>
                                {paymentMethod === "ideal" && (
                                  <div className="w-3 h-3 rounded-full bg-[#8B4513]"></div>
                                )}
                              </div>
                              <span className="font-medium text-gray-900">iDEAL</span>
                            </div>
                            <span className="text-sm text-gray-500">Meest gekozen</span>
                          </div>
                        </div>

                        <div
                          onClick={() => setPaymentMethod("creditcard")}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            paymentMethod === "creditcard" ? 'border-[#8B4513] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === "creditcard" ? 'border-[#8B4513]' : 'border-gray-300'
                            }`}>
                              {paymentMethod === "creditcard" && (
                                <div className="w-3 h-3 rounded-full bg-[#8B4513]"></div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">Creditcard</span>
                          </div>
                        </div>

                        <div
                          onClick={() => setPaymentMethod("paypal")}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            paymentMethod === "paypal" ? 'border-[#8B4513] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === "paypal" ? 'border-[#8B4513]' : 'border-gray-300'
                            }`}>
                              {paymentMethod === "paypal" && (
                                <div className="w-3 h-3 rounded-full bg-[#8B4513]"></div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">PayPal</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6 mb-6">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-1 w-5 h-5 accent-[#8B4513]"
                          />
                          <span className="text-sm text-gray-600">
                            Ik ga akkoord met de{" "}
                            <Link href="/algemene-voorwaarden" className="text-[#8B4513] hover:underline">
                              algemene voorwaarden
                            </Link>{" "}
                            en het{" "}
                            <Link href="/privacy-beleid" className="text-[#8B4513] hover:underline">
                              privacybeleid
                            </Link>
                          </span>
                        </label>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setStep(1)}
                          className="flex-1 py-4 border-2 border-gray-300 rounded-lg font-medium text-lg hover:bg-gray-50 transition-colors"
                        >
                          ← Terug
                        </button>
                        <button
                          onClick={handlePlaceOrder}
                          disabled={!acceptedTerms}
                          className={`flex-1 py-4 rounded-lg font-medium text-lg transition-all ${
                            acceptedTerms
                              ? 'bg-black text-white hover:bg-gray-800'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Bestelling Plaatsen
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop: Order Summary Sidebar */}
                <div className="col-4">
                  <div className="bg-white rounded-lg p-6 shadow-lg sticky top-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Overzicht</h3>
                    
                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                      {items.map((item) => {
                        const itemKey = `${item.id}-${item.color}-${item.size}`;
                        return (
                          <div key={itemKey} className="flex gap-3">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0">
                              {item.image_url ? (
                                <Image
                                  src={item.image_url}
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                  Foto
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                              <p className="text-xs text-gray-500">
                                {item.color} • {item.size} • {item.quantity}x
                              </p>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                €{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotaal</span>
                        <span>€{totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Verzendkosten</span>
                        <span className="text-green-600">Gratis</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>BTW (21%)</span>
                        <span>€{(totalPrice * 0.21).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                        <span>Totaal</span>
                        <span>€{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

