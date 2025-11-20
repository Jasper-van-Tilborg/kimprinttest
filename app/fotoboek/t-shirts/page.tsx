"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";

export default function TShirtsFotoboek() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Galerij items met echte afbeeldingen
  const galleryItems = [
    { 
      id: 1, 
      title: "Custom Design T-shirt", 
      description: "Gepersonaliseerd design voor bedrijfsevenement",
      imageUrl: "https://k-imprint.nl/cdn/shop/files/IMG_3192.jpg?v=1751981439&width=1920"
    },
    { 
      id: 2, 
      title: "Team Shirts", 
      description: "Matching shirts voor sportteam",
      imageUrl: "https://k-imprint.nl/cdn/shop/files/Afbeelding_van_WhatsApp_op_2025-05-07_om_13.26.58_f8dce1d9.jpg?v=1746631376&width=1920"
    },
    { 
      id: 3, 
      title: "Festival T-shirts", 
      description: "Unieke prints voor festival",
      imageUrl: "https://k-imprint.nl/cdn/shop/files/IMG_0998_c2ae4f0c-9900-4210-97f1-17d21e3bf7a3.heic?v=1746631312&width=1920"
    },
    { 
      id: 4, 
      title: "Promotie Shirts", 
      description: "Bedrijfslogo op premium katoen",
      imageUrl: "https://k-imprint.nl/cdn/shop/files/Afbeelding_van_WhatsApp_op_2025-05-07_om_14.52.19_77a10c3c.jpg?v=1746626331&width=1920"
    },
    { 
      id: 5, 
      title: "Familie T-shirts", 
      description: "Matching family shirts",
      imageUrl: "https://k-imprint.nl/cdn/shop/files/Afbeelding_van_WhatsApp_op_2025-04-09_om_14.42.50_1964c84c.jpg?v=1746626475&width=1920"
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar activePage="fotoboek" />

      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="grid-12">
          <div className="col-12">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-[#8B4513] transition-colors">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/fotoboek" className="hover:text-[#8B4513] transition-colors">Fotoboek</Link>
              <span className="mx-2">›</span>
              <span className="text-black font-medium">T-shirts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-6 md:py-12">
        <div className="grid-12">
          <div className="col-12">
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 md:mb-6">Onze T-shirts</h1>
            <p className="text-base md:text-xl text-gray-700 leading-relaxed max-w-4xl mb-3 md:mb-4">
              Van op maat gemaakte designs tot onze klanten die stralen in onze designs! Ontdek onze collectie gepersonaliseerde t-shirts voor elk moment en elke gelegenheid.
            </p>
            <p className="text-sm md:text-lg text-gray-600 leading-relaxed max-w-4xl">
              Je vindt ze allemaal in ons fotoboek - van bedrijfskleding tot festival shirts, van teamkleding tot unieke cadeaus.
            </p>
          </div>
        </div>
      </section>

      {/* Stats/Info Bar */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-6 md:py-8 border-y border-gray-200">
        <div className="grid-12">
          <div className="col-12 flex flex-col md:flex-row justify-around text-center gap-6 md:gap-0">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#8B4513] mb-1 md:mb-2">500+</p>
              <p className="text-sm md:text-base text-gray-600 font-medium">Tevreden klanten</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#8B4513] mb-1 md:mb-2">1000+</p>
              <p className="text-sm md:text-base text-gray-600 font-medium">T-shirts geprint</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#8B4513] mb-1 md:mb-2">100%</p>
              <p className="text-sm md:text-base text-gray-600 font-medium">Kwaliteit garantie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 md:py-16">
        <div className="grid-12">
          <div className="col-12 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">Galerij</h2>
            <p className="text-sm md:text-base text-gray-600">Klik op een afbeelding om deze te vergroten</p>
          </div>

          {/* Mobile Layout - Single Column */}
          <div className="md:hidden col-12">
            <div className="space-y-4">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(item.id)}
                >
                  <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="100vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-active:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-active:opacity-100">
                      <div className="text-center text-white p-4">
                        <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                        <p className="text-xs">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Layout - Masonry/Bricks Style */}
          <div className="hidden md:block col-12">
            <div className="grid grid-cols-12 gap-4 auto-rows-[200px]">
              {/* Eerste foto - Groot links (span 6 cols, 2 rows) */}
              <div
                className="col-span-6 row-span-2 group cursor-pointer"
                onClick={() => setSelectedImage(1)}
              >
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative h-full">
                    <Image
                      src={galleryItems[0].imageUrl}
                      alt={galleryItems[0].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 600px"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center text-white p-4">
                      <h3 className="text-xl font-bold mb-2">{galleryItems[0].title}</h3>
                      <p className="text-sm">{galleryItems[0].description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tweede foto - Rechtsboven (span 6 cols, 1 row) */}
              <div
                className="col-span-6 group cursor-pointer"
                onClick={() => setSelectedImage(2)}
              >
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative h-full">
                    <Image
                      src={galleryItems[1].imageUrl}
                      alt={galleryItems[1].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 600px"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center text-white p-4">
                      <h3 className="text-xl font-bold mb-2">{galleryItems[1].title}</h3>
                      <p className="text-sm">{galleryItems[1].description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Derde foto - Rechts midden (span 3 cols, 1 row) */}
              <div
                className="col-span-3 group cursor-pointer"
                onClick={() => setSelectedImage(3)}
              >
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative h-full">
                    <Image
                      src={galleryItems[2].imageUrl}
                      alt={galleryItems[2].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 300px"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center text-white p-4">
                      <h3 className="text-lg font-bold mb-1">{galleryItems[2].title}</h3>
                      <p className="text-xs">{galleryItems[2].description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vierde foto - Rechts midden (span 3 cols, 1 row) */}
              <div
                className="col-span-3 group cursor-pointer"
                onClick={() => setSelectedImage(4)}
              >
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative h-full">
                    <Image
                      src={galleryItems[3].imageUrl}
                      alt={galleryItems[3].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 300px"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center text-white p-4">
                      <h3 className="text-lg font-bold mb-1">{galleryItems[3].title}</h3>
                      <p className="text-xs">{galleryItems[3].description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vijfde foto - Onder (span 6 cols, 1 row) */}
              <div
                className="col-span-6 group cursor-pointer"
                onClick={() => setSelectedImage(5)}
              >
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative h-full">
                    <Image
                      src={galleryItems[4].imageUrl}
                      alt={galleryItems[4].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 600px"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center text-white p-4">
                      <h3 className="text-xl font-bold mb-2">{galleryItems[4].title}</h3>
                      <p className="text-sm">{galleryItems[4].description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-12 md:py-16">
        <div className="grid-12">
          <div className="col-12 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Jouw eigen design?</h2>
            <p className="text-base md:text-xl mb-6 md:mb-8 text-gray-300 max-w-2xl mx-auto">
              Laat je inspireren door onze voorbeelden en maak jouw eigen gepersonaliseerde t-shirts
            </p>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
              <Link
                href="/assortiment/t-shirts"
                className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-base md:text-lg"
              >
                Bekijk Assortiment
              </Link>
              <Link
                href="/maak-je-eigen"
                className="bg-[#8B4513] text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-[#6d3710] transition-colors font-medium text-base md:text-lg"
              >
                Maak Je Eigen Design
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 md:-top-12 right-0 text-white text-3xl md:text-4xl hover:text-gray-300 transition-colors z-10"
            >
              ×
            </button>
            <div className="relative bg-gray-200 rounded-lg aspect-video max-h-[80vh]">
              {galleryItems.find(item => item.id === selectedImage)?.imageUrl && (
                <Image
                  src={galleryItems.find(item => item.id === selectedImage)!.imageUrl}
                  alt={galleryItems.find(item => item.id === selectedImage)?.title || ""}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
                />
              )}
            </div>
            <div className="text-white text-center mt-4">
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                {galleryItems.find(item => item.id === selectedImage)?.title}
              </h3>
              <p className="text-sm md:text-base text-gray-300">
                {galleryItems.find(item => item.id === selectedImage)?.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

