import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  activePage?: 'home' | 'assortiment' | 'maak-je-eigen' | 'fotoboek';
}

export default function Navbar({ activePage = 'home' }: NavbarProps) {
  return (
    <header className="bg-[#FAFAFA] relative" style={{ height: '63px' }}>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black to-transparent"></div>
      <div className="grid-12" style={{ height: '63px' }}>
        <div className="col-2 flex items-center justify-start" style={{ height: '63px' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/K-imprint logo.avif" 
              alt="K-imprint Logo" 
              width={96} 
              height={63}
              className="h-[63px] w-[96px]"
            />
          </Link>
        </div>
        
        {/* Navigation - Center */}
        <nav className="col-8 flex justify-center items-center space-x-8" style={{ height: '63px' }}>
          <Link 
            href="/" 
            className={`navbar-link ${activePage === 'home' ? 'text-[#8B4513]' : 'text-gray-700 hover:text-[#8B4513]'}`} 
            style={{ fontSize: '16px' }}
          >
            Home
          </Link>
          <Link 
            href="/assortiment" 
            className={`navbar-link ${activePage === 'assortiment' ? 'text-[#8B4513]' : 'text-gray-700 hover:text-[#8B4513]'}`} 
            style={{ fontSize: '16px' }}
          >
            Assortiment
          </Link>
          <Link 
            href="/maak-je-eigen" 
            className={`navbar-link ${activePage === 'maak-je-eigen' ? 'text-[#8B4513]' : 'text-gray-700 hover:text-[#8B4513]'}`} 
            style={{ fontSize: '16px' }}
          >
            Maak je eigen product
          </Link>
          <Link 
            href="/fotoboek" 
            className={`navbar-link ${activePage === 'fotoboek' ? 'text-[#8B4513]' : 'text-gray-700 hover:text-[#8B4513]'}`} 
            style={{ fontSize: '16px' }}
          >
            Fotoboek
          </Link>
        </nav>
        
        {/* Icons - Right */}
        <div className="col-2 flex items-center justify-end space-x-4" style={{ height: '63px' }}>
          <button className="p-2 text-gray-700 hover:text-[#8B4513] transition-colors">
            <Image 
              src="/images/Search.svg" 
              alt="Search" 
              width={20} 
              height={20}
            />
          </button>
          <Link href="/account" className="p-2 text-gray-700 hover:text-[#8B4513] transition-colors">
            <Image 
              src="/images/person.svg" 
              alt="Account" 
              width={20} 
              height={20}
            />
          </Link>
          <button className="p-2 text-gray-700 hover:text-[#8B4513] transition-colors">
            <Image 
              src="/images/Shopping cart.svg" 
              alt="Shopping Cart" 
              width={20} 
              height={20}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
