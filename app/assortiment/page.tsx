import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";

export default function Assortiment() {
  return (
    <div className="min-h-screen bg-[#FEF2EB]">
      {/* Header */}
      <Navbar activePage="assortiment" />

      {/* Hero Section */}
      <section className="w-full">
        <div className="bg-gray-200 h-[600px] flex items-center justify-center">
          <span className="text-gray-500 text-lg">Hero Image Placeholder</span>
        </div>
      </section>

      {/* Shop onze Collecties Section */}
      <section className="py-16">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 underline">Shop onze Collecties</h2>
          </div>
          
          <div className="col-3">
            <Link href="/assortiment/t-shirts" className="group">
              <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <span className="text-gray-500">Category Image</span>
              </div>
              <div className="text-center">
                <span className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium">
                  T-shirts
                </span>
              </div>
            </Link>
          </div>
          
          <div className="col-3">
            <Link href="/assortiment/hoodies" className="group">
              <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <span className="text-gray-500">Category Image</span>
              </div>
              <div className="text-center">
                <span className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium">
                  Hoodies
                </span>
              </div>
            </Link>
          </div>
          
          <div className="col-3">
            <Link href="/assortiment/tassen" className="group">
              <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <span className="text-gray-500">Category Image</span>
              </div>
              <div className="text-center">
                <span className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium">
                  Tassen
                </span>
              </div>
            </Link>
          </div>
          
          <div className="col-3">
            <Link href="/assortiment/rompers" className="group">
              <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <span className="text-gray-500">Category Image</span>
              </div>
              <div className="text-center">
                <span className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium">
                  Rompers
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 bg-white">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 underline">Best Sellers</h2>
          </div>
          
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="col-3">
              <Link href="/product/demo-tshirt" className="group">
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 mb-1">Demo T-shirt</h3>
                  <p className="text-gray-600">€60</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FEF2EB] py-16">
        <div className="grid-12">
          {/* Logo & Copyright */}
          <div className="col-2">
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
                className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:border-[#8B4513]"
              />
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Abonneer
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
