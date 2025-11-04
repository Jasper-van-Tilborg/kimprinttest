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
      <section className="bg-white py-12">
        <div className="grid-12">
          <div className="col-12">
            <h1 className="text-5xl font-bold text-black mb-6">Onze T-shirts</h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mb-4">
              Van op maat gemaakte designs tot onze klanten die stralen in onze designs! Ontdek onze collectie gepersonaliseerde t-shirts voor elk moment en elke gelegenheid.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
              Je vindt ze allemaal in ons fotoboek - van bedrijfskleding tot festival shirts, van teamkleding tot unieke cadeaus.
            </p>
          </div>
        </div>
      </section>

      {/* Stats/Info Bar */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-8 border-y border-gray-200">
        <div className="grid-12">
          <div className="col-12 flex justify-around text-center">
            <div>
              <p className="text-4xl font-bold text-[#8B4513] mb-2">500+</p>
              <p className="text-gray-600 font-medium">Tevreden klanten</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#8B4513] mb-2">1000+</p>
              <p className="text-gray-600 font-medium">T-shirts geprint</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#8B4513] mb-2">100%</p>
              <p className="text-gray-600 font-medium">Kwaliteit garantie</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="grid-12">
          <div className="col-12 mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">Galerij</h2>
            <p className="text-gray-600">Klik op een afbeelding om deze te vergroten</p>
          </div>

          {/* Custom Bricks Layout */}
          <div className="col-12">
            <div className="grid grid-cols-2 gap-4 auto-rows-fr">
              {/* Eerste foto - Groot links (2 rijen hoog) */}
              <div
                className="row-span-2 group cursor-pointer"
                onClick={() => setSelectedImage(1)}
              >
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative h-full min-h-[400px]">
                    <Image
                      src={galleryItems[0].imageUrl}
                      alt={galleryItems[0].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
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

              {/* Tweede foto - Rechtsboven */}
              <div
                className="group cursor-pointer"
                onClick={() => setSelectedImage(2)}
              >
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative aspect-square">
                    <Image
                      src={galleryItems[1].imageUrl}
                      alt={galleryItems[1].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
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

              {/* Derde foto - Rechts midden */}
              <div
                className="group cursor-pointer"
                onClick={() => setSelectedImage(3)}
              >
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative aspect-square">
                    <Image
                      src={galleryItems[2].imageUrl}
                      alt={galleryItems[2].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center text-white p-4">
                      <h3 className="text-xl font-bold mb-2">{galleryItems[2].title}</h3>
                      <p className="text-sm">{galleryItems[2].description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vierde foto - Linksonder */}
              <div
                className="group cursor-pointer"
                onClick={() => setSelectedImage(4)}
              >
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative aspect-square">
                    <Image
                      src={galleryItems[3].imageUrl}
                      alt={galleryItems[3].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center text-white p-4">
                      <h3 className="text-xl font-bold mb-2">{galleryItems[3].title}</h3>
                      <p className="text-sm">{galleryItems[3].description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vijfde foto - Rechtsonder */}
              <div
                className="group cursor-pointer"
                onClick={() => setSelectedImage(5)}
              >
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative aspect-square">
                    <Image
                      src={galleryItems[4].imageUrl}
                      alt={galleryItems[4].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
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
      <section className="bg-black text-white py-16">
        <div className="grid-12">
          <div className="col-12 text-center">
            <h2 className="text-4xl font-bold mb-6">Jouw eigen design?</h2>
            <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Laat je inspireren door onze voorbeelden en maak jouw eigen gepersonaliseerde t-shirts
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/assortiment/t-shirts"
                className="bg-white text-black px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
              >
                Bekijk Assortiment
              </Link>
              <Link
                href="/maak-je-eigen"
                className="bg-[#8B4513] text-white px-8 py-4 rounded-lg hover:bg-[#6d3710] transition-colors font-medium text-lg"
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
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
            >
              ×
            </button>
            <div className="relative bg-gray-200 rounded-lg aspect-video">
              {galleryItems.find(item => item.id === selectedImage)?.imageUrl && (
                <Image
                  src={galleryItems.find(item => item.id === selectedImage)!.imageUrl}
                  alt={galleryItems.find(item => item.id === selectedImage)?.title || ""}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              )}
            </div>
            <div className="text-white text-center mt-4">
              <h3 className="text-2xl font-bold mb-2">
                {galleryItems.find(item => item.id === selectedImage)?.title}
              </h3>
              <p className="text-gray-300">
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

