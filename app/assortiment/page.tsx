"use client";

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
        <div className="relative h-[450px] md:h-[80vh] overflow-hidden">
          <div className="absolute inset-0 scale-100">
            <Image
              src="/images/hero/heroimage.png"
              alt="K-imprint assortiment"
              fill
              className="object-cover"
              style={{ objectPosition: 'center 25%' }}
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-black/20">
            <div className="grid-12 h-full">
              {/* Mobile Hero */}
              <div className="md:hidden col-12 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-white text-3xl font-medium mb-3 drop-shadow-lg">Assortiment</h1>
                <p className="text-white text-base font-normal drop-shadow-md">Ontdek onze collectie gepersonaliseerde producten</p>
              </div>
              {/* Desktop Hero */}
              <div className="hidden md:flex col-3 flex-col items-start pt-16 gap-4">
                <h1 className="text-white text-[60px] font-medium drop-shadow-lg">Assortiment</h1>
                <p className="text-white text-[20px] font-normal drop-shadow-md">Ontdek onze collectie gepersonaliseerde producten</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop onze Collecties Section */}
      <section className="py-6 md:py-16 bg-[#FAFAFA]">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-4 md:mb-8 text-lg md:text-[26px]">Shop onze Collecties</h2>
          </div>
          
          {/* Mobile: Show 2 categories per row */}
          <div className="md:hidden col-12">
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'T-shirts', href: '/assortiment/t-shirts' },
                { name: 'Hoodies', href: '/assortiment/hoodies' },
                { name: 'Tassen', href: '/assortiment/tassen' },
                { name: 'Rompers', href: '/assortiment/rompers' }
              ].map((category, index) => (
                <Link key={category.name} href={category.href} className="block">
                  <div className="bg-gray-200 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden w-full h-[280px]">
                    <span className="text-gray-500 text-xs">Category</span>
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white rounded-lg font-medium text-sm">
                      {category.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop: Show all 4 categories */}
          <div className="hidden md:flex col-12 items-start gap-5">
            {[
              { name: 'T-shirts', href: '/assortiment/t-shirts' },
              { name: 'Hoodies', href: '/assortiment/hoodies' },
              { name: 'Tassen', href: '/assortiment/tassen' },
              { name: 'Rompers', href: '/assortiment/rompers' }
            ].map((category, index) => (
              <div key={category.name} className="text-center group flex-1">
                <Link href={category.href}>
                  <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden transition-all duration-300 w-full h-[425px] group-hover:shadow-lg">
                    <span className="text-gray-500">Category Image</span>
                    <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-transparent text-black border-2 border-black rounded-lg transition-all duration-300 group-hover:bg-black group-hover:text-white font-medium">
                      {category.name}
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-6 md:py-16 bg-white">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-4 md:mb-8 text-lg md:text-[26px]">Best Sellers</h2>
          </div>
          
          {/* Mobile: Show 2 products per row, only 4 products */}
          <div className="md:hidden col-12">
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((item, index) => (
                <Link key={item} href="/product/demo-tshirt" className="block">
                  <div className="bg-gray-200 rounded-lg mb-2 flex items-center justify-center w-full h-[180px]">
                    <span className="text-gray-500 text-xs">Product</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <h3 className="font-medium text-gray-900 text-xs truncate flex-1 mr-2">Demo T-shirt</h3>
                    <p className="text-gray-600 text-xs font-medium shrink-0">€60</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link 
                href="/assortiment/t-shirts"
                className="inline-block bg-black text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                Alle producten bekijken
              </Link>
            </div>
          </div>

          {/* Desktop: Show 8 products in 2 rows, 4 per row */}
          <div className="hidden md:grid col-12 grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
              <div key={item} className="text-center">
                <Link href="/product/demo-tshirt">
                  <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center w-full h-[395px]">
                    <span className="text-gray-500">Product Image</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <h3 className="font-medium text-gray-900">Demo T-shirt</h3>
                    <p className="text-gray-600">€60</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
