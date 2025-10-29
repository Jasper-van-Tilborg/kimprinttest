import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] py-16 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black to-transparent"></div>
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
  );
}

