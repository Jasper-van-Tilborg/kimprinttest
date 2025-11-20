import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] py-8 md:py-16 relative">
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, black, transparent)'
        }}
      ></div>
      <div className="grid-12">
        {/* Mobile Layout */}
        <div className="md:hidden col-12">
          <div className="space-y-6">
            {/* Logo & Copyright */}
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <Image 
                  src="/images/logo/K-imprint logo.avif" 
                  alt="K-imprint Logo" 
                  width={100} 
                  height={52}
                  className="h-auto w-auto"
                />
              </div>
              <p className="text-gray-600 text-sm">©K-imprint</p>
              <p className="text-gray-600 text-sm">All Rights Reserved</p>
            </div>

            {/* Links Grid - 2 columns */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Over ons</h4>
                <ul className="space-y-2">
                  <li><Link href="/over-ons" className="text-gray-600 hover:text-[#8B4513] transition-colors text-sm">Over ons</Link></li>
                  <li><Link href="/contact" className="text-gray-600 hover:text-[#8B4513] transition-colors text-sm">Contact</Link></li>
                  <li><Link href="/offertes" className="text-gray-600 hover:text-[#8B4513] transition-colors text-sm">Offertes</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-gray-600 hover:text-[#8B4513] transition-colors text-sm">Privacy</Link></li>
                  <li><Link href="/algemene-voorwaarden" className="text-gray-600 hover:text-[#8B4513] transition-colors text-sm">Voorwaarden</Link></li>
                  <li><Link href="/size-guide" className="text-gray-600 hover:text-[#8B4513] transition-colors text-sm">Size Guide</Link></li>
                </ul>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Volg ons</h4>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-600 hover:text-[#8B4513] transition-colors text-sm">Facebook</Link>
                <Link href="#" className="text-gray-600 hover:text-[#8B4513] transition-colors text-sm">Instagram</Link>
                <Link href="#" className="text-gray-600 hover:text-[#8B4513] transition-colors text-sm">TikTok</Link>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-sm">Abonneer</h4>
              <p className="text-gray-600 mb-3 text-sm">E-mail updates over nieuwe collecties.</p>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Je email adres" 
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-gray-900 text-sm"
                />
                <button className="w-full px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">
                  Abonneer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid-12">
          {/* Logo & Copyright */}
          <div className="col-2 flex flex-col justify-center">
            <div className="mb-4">
              <Image 
                src="/images/logo/K-imprint logo.avif" 
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
        </div>
      </div>
    </footer>
  );
}

