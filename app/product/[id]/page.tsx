import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";

export default function ProductDetail({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[#FEF2EB]">
      {/* Header */}
      <Navbar activePage="assortiment" />

      {/* Breadcrumbs */}
      <div className="bg-white py-4">
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Product Images */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Main Image */}
                <div className="md:col-span-2">
                  <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-lg">Main Product Image</span>
                  </div>
                  
                  {/* Image Indicators */}
                  <div className="flex justify-center mt-4 space-x-2">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                    <div className="w-3 h-3 border-2 border-gray-300 rounded-full"></div>
                    <div className="w-3 h-3 border-2 border-gray-300 rounded-full"></div>
                  </div>
                </div>
                
                {/* Side Images */}
                <div className="space-y-4">
                  <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Side View</span>
                  </div>
                  <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Back View</span>
                  </div>
                </div>
              </div>
              
              {/* Additional Image */}
              <div className="mt-8">
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Additional Product Image</span>
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">Halloween T-shirt</h1>
                  <button className="text-red-500 hover:text-red-600 transition-colors">
                    ❤️
                  </button>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-gray-900">€ 81,99</span>
                  <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center">
                    In winkelwagen
                    <span className="ml-2">→</span>
                  </button>
                </div>
                
                {/* Color Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Kleur</h3>
                  <div className="flex space-x-4">
                    <button className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-black rounded-full border-2 border-gray-300 mb-1"></div>
                      <span className="text-sm text-gray-700">Zwart</span>
                    </button>
                    <button className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-300 mb-1"></div>
                      <span className="text-sm text-gray-700">Wit</span>
                    </button>
                    <button className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-gray-300 mb-1"></div>
                      <span className="text-sm text-gray-700">Groen</span>
                    </button>
                  </div>
                </div>
                
                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Maat</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {['XS', 'S', 'M', 'L', 'XL'].map((size, index) => (
                      <button 
                        key={size}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          index === 0 
                            ? 'bg-black text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Omschrijving</h3>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors">
                      ▲
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Andere Must-Haves</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Link key={item} href="/product/demo-tshirt" className="group">
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 mb-1">Demo T-shirt</h3>
                  <p className="text-gray-600">€60</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FEF2EB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Copyright */}
            <div>
              <h3 className="text-2xl font-bold text-[#8B4513] mb-4">Kimprint</h3>
              <p className="text-gray-600">©K-imprint</p>
              <p className="text-gray-600">All Rights Reserved</p>
            </div>
            
            {/* Over ons */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Over ons</h4>
              <ul className="space-y-2">
                <li><Link href="/over-ons" className="text-gray-600 hover:text-[#8B4513] transition-colors">Over ons</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-[#8B4513] transition-colors">Contact</Link></li>
                <li><Link href="/offertes" className="text-gray-600 hover:text-[#8B4513] transition-colors">Offertes</Link></li>
              </ul>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Links</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-600 hover:text-[#8B4513] transition-colors">Privacy</Link></li>
                <li><Link href="/algemene-voorwaarden" className="text-gray-600 hover:text-[#8B4513] transition-colors">Algemene Voorwaarden</Link></li>
                <li><Link href="/size-guide" className="text-gray-600 hover:text-[#8B4513] transition-colors">Size Guide</Link></li>
                <li><Link href="/faqs" className="text-gray-600 hover:text-[#8B4513] transition-colors">FAQs</Link></li>
              </ul>
            </div>
            
            {/* Volg ons & Abonneer */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Volg ons</h4>
              <ul className="space-y-2 mb-6">
                <li><Link href="#" className="text-gray-600 hover:text-[#8B4513] transition-colors">Facebook</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-[#8B4513] transition-colors">Instagram</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-[#8B4513] transition-colors">TikTok</Link></li>
              </ul>
              
              <h4 className="font-bold text-gray-900 mb-4">Abonneer</h4>
              <p className="text-gray-600 mb-4 text-sm">Krijg E-mail Updates over onze laatste collecties en tijdelijke offers.</p>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Vul hier je email in" 
                  className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-[#8B4513]"
                />
                <button className="text-[#8B4513] hover:underline">
                  Abonneer
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
