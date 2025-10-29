import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Assortiment() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <Navbar activePage="assortiment" />

      {/* Hero Section */}
      <section className="w-full relative">
        <div className="bg-gray-200 h-[600px] relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-500 text-lg">Hero Image Placeholder</span>
          </div>
          <div className="absolute inset-0">
            <div className="grid-12 h-full">
              <div className="col-3 flex flex-col items-start pt-16 gap-4">
                <h1 className="text-black" style={{ fontSize: '60px', fontWeight: '500' }}>Assortiment</h1>
                <p className="text-black" style={{ fontSize: '20px', fontWeight: '400' }}>Ontdek onze collectie gepersonaliseerde producten</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop onze Collecties Section */}
      <section className="py-16">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-8" style={{ fontSize: '26px' }}>Shop onze Collecties</h2>
          </div>
          
          <div className="col-12 flex items-start" style={{ gap: '20px' }}>
            {[
              { name: 'T-shirts', href: '/assortiment/t-shirts' },
              { name: 'Hoodies', href: '/assortiment/hoodies' },
              { name: 'Tassen', href: '/assortiment/tassen' },
              { name: 'Rompers', href: '/assortiment/rompers' }
            ].map((category) => (
              <Link key={category.name} href={category.href} className="text-center" style={{ width: '340px' }}>
                <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative" style={{ width: '340px', height: '425px' }}>
                  <span className="text-gray-500">Category Image</span>
                  <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-transparent text-black border border-black rounded-lg hover:bg-gray-50 transition-colors">
                    {category.name}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 bg-white">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-8" style={{ fontSize: '26px' }}>Best Sellers</h2>
          </div>
          
          <div className="col-12 flex flex-wrap items-start" style={{ gap: '20px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Link key={item} href="/product/demo-tshirt" className="text-center" style={{ width: '340px' }}>
                <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center" style={{ width: '340px', height: '395px' }}>
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="flex items-center justify-between" style={{ width: '340px' }}>
                  <h3 className="font-medium text-gray-900">Demo T-shirt</h3>
                  <p className="text-gray-600">€60</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
