"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import { supabase, Product } from "../lib/supabase";
import { isSupabaseImage } from "../lib/imageUtils";
import { getFeaturedCollection, getProductsInCollection, type Collection } from "./actions/collections";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('t-shirts');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredCollection, setFeaturedCollection] = useState<Collection | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(true);

  // Haal featured collectie op
  useEffect(() => {
    async function fetchFeaturedCollection() {
      try {
        setCollectionLoading(true);
        const collection = await getFeaturedCollection();
        setFeaturedCollection(collection);
        
        if (collection) {
          // Haal producten in collectie op
          const productsData = await getProductsInCollection(collection.id);
          // Extract products from the nested structure
          const products = productsData
            .map((item: any) => item.products)
            .filter((product: Product | null) => product !== null) as Product[];
          setCollectionProducts(products);
        }
      } catch (err) {
        console.error('Error fetching featured collection:', err);
        setFeaturedCollection(null);
      } finally {
        setCollectionLoading(false);
      }
    }

    fetchFeaturedCollection();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let categoryFilter = '';
        
        // Map de actieve categorie naar database categorie namen
        switch (activeCategory) {
          case 't-shirts':
            categoryFilter = 't-shirt';
            break;
          case 'hoodies':
            categoryFilter = 'hoodie';
            break;
          case 'tassen':
            categoryFilter = 'tas';
            break;
        }

        let query = supabase
          .from('products')
          .select('*')
          .ilike('category', `%${categoryFilter}%`)
          .order('sales_count', { ascending: false })
          .limit(4);

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <Navbar activePage="home" />

      {/* Hero Section - Featured Collection of Fallback Hero Image */}
      <section className="w-full">
        {featuredCollection && featuredCollection.hero_image ? (
          <Link href={`/assortiment?collection=${featuredCollection.slug}`}>
            <div className="relative h-[450px] md:h-[80vh] overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 scale-100">
                <Image
                  src={featuredCollection.hero_image}
                  alt={featuredCollection.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ objectPosition: 'center center' }}
                  priority
                  sizes="100vw"
                  quality={85}
                  unoptimized={isSupabaseImage(featuredCollection.hero_image)}
                />
              </div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                    {featuredCollection.name}
                  </h1>
                  {featuredCollection.description && (
                    <p className="text-white text-lg md:text-xl mb-6 drop-shadow-md max-w-2xl">
                      {featuredCollection.description}
                    </p>
                  )}
                  <div className="inline-block bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-lg font-medium text-sm md:text-lg hover:bg-gray-100 transition-colors">
                    Bekijk Collectie →
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="relative h-[450px] md:h-[80vh] overflow-hidden">
            <div className="absolute inset-0 scale-100">
              <Image
                src="/images/hero/heroimage.jpg"
                alt="K-imprint hero"
                fill
                className="object-cover"
                style={{ objectPosition: 'center 0%' }}
                priority
                sizes="100vw"
                quality={85}
              />
            </div>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
      </section>

      {/* Onze Collectie Section */}
      <section className="py-6 md:py-16">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-4 md:mb-8 text-lg md:text-[26px]">Onze Collectie</h2>
          </div>
          
          {/* Mobile: Simplified Category Buttons - Horizontal Scroll */}
          <div className="md:hidden col-12 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                <button 
                  onClick={() => setActiveCategory('hoodies')}
                  className={`px-4 py-2 rounded-lg transition-all font-medium text-sm whitespace-nowrap shrink-0 ${
                    activeCategory === 'hoodies' 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Hoodies
                </button>
                <button 
                  onClick={() => setActiveCategory('t-shirts')}
                  className={`px-4 py-2 rounded-lg transition-all font-medium text-sm whitespace-nowrap shrink-0 ${
                    activeCategory === 't-shirts' 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  T-shirts
                </button>
                <button 
                  onClick={() => setActiveCategory('tassen')}
                  className={`px-4 py-2 rounded-lg transition-all font-medium text-sm whitespace-nowrap shrink-0 ${
                    activeCategory === 'tassen' 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Totebags
                </button>
              </div>
            </div>
            <Link 
              href="/assortiment" 
              className="block text-center py-2 text-[#8B4513] font-medium text-sm hover:underline"
            >
              Bekijk volledige collectie →
            </Link>
          </div>

          {/* Desktop: Category Buttons */}
          <div className="hidden md:block col-12">
            <div className="flex justify-between items-end mb-8">
              <div className="flex space-x-4">
                <button 
                  onClick={() => setActiveCategory('hoodies')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 min-w-[100px] text-center ${
                    activeCategory === 'hoodies' 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  Hoodies
                </button>
                <button 
                  onClick={() => setActiveCategory('t-shirts')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 min-w-[100px] text-center ${
                    activeCategory === 't-shirts' 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  T-shirts
                </button>
                <button 
                  onClick={() => setActiveCategory('tassen')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 min-w-[100px] text-center ${
                    activeCategory === 'tassen' 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  }`}
                >
                  Totebags
                </button>
              </div>
              <Link href="/assortiment" className="text-black hover:underline">
                Ontdek meer...
              </Link>
            </div>
          </div>
          
          {/* Mobile: Show only 2 products in a row */}
          <div className="md:hidden col-12">
            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg mb-2 w-full h-[180px]"></div>
                    <div className="bg-gray-200 h-3 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Geen producten gevonden</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {products.slice(0, 2).map((product) => {
                  // Bepaal welke afbeeldingen te tonen
                  const secondImage = product.images && product.images.length > 1 ? product.images[1] : null;
                  const secondImageFromColor = product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 1 
                    ? product.colors[0].images[1] 
                    : null;
                  const firstImageFromArray = product.images && product.images.length > 0 ? product.images[0] : null;
                  const primaryImage = firstImageFromArray || product.image_url;
                  const hoverImage = secondImage || secondImageFromColor;
                  
                  return (
                    <div key={product.id} className="group">
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="bg-gray-200 rounded-lg mb-2 flex items-center justify-center w-full h-[180px] overflow-hidden relative">
                          {primaryImage ? (
                            <>
                              {/* Primaire afbeelding - altijd zichtbaar */}
                              <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className={`object-cover transition-opacity duration-300 ${
                                  hoverImage ? 'group-hover:opacity-0' : ''
                                }`}
                                unoptimized={isSupabaseImage(primaryImage)}
                                sizes="(max-width: 768px) 50vw, 25vw"
                                loading="lazy"
                                quality={85}
                              />
                              {/* Tweede afbeelding - alleen zichtbaar bij hover als deze bestaat */}
                              {hoverImage && (
                                <Image
                                  src={hoverImage}
                                  alt={`${product.name} - tweede afbeelding`}
                                  fill
                                  className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  unoptimized={isSupabaseImage(hoverImage)}
                                  sizes="(max-width: 768px) 50vw, 25vw"
                                  loading="lazy"
                                  quality={85}
                                />
                              )}
                            </>
                          ) : (
                            <span className="text-gray-500 text-xs">Product</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <h3 className="font-medium text-gray-900 text-xs truncate flex-1 mr-2">{product.name}</h3>
                          <p className="text-gray-600 text-xs font-medium shrink-0">€{product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="text-center mt-4">
              <Link 
                href={`/assortiment/${activeCategory === 't-shirts' ? 't-shirts' : activeCategory === 'hoodies' ? 'hoodies' : 'tassen'}`}
                className="inline-block bg-black text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                Alle producten bekijken
              </Link>
            </div>
          </div>

          {/* Desktop: Show all 4 products */}
          <div className="hidden md:block col-12">
            {loading ? (
              <div className="grid-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="col-3 animate-pulse">
                    <div className="bg-gray-200 rounded-lg mb-4 w-full h-[395px]"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Geen producten gevonden</p>
              </div>
            ) : (
              <div className="grid-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                {products.slice(0, 4).map((product) => {
                  // Bepaal welke afbeeldingen te tonen
                  const secondImage = product.images && product.images.length > 1 ? product.images[1] : null;
                  const secondImageFromColor = product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 1 
                    ? product.colors[0].images[1] 
                    : null;
                  const firstImageFromArray = product.images && product.images.length > 0 ? product.images[0] : null;
                  const primaryImage = firstImageFromArray || product.image_url;
                  const hoverImage = secondImage || secondImageFromColor;
                  
                  return (
                    <Link key={product.id} href={`/product/${product.id}`} className="col-3 group">
                      <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center w-full h-[395px] overflow-hidden relative">
                        {primaryImage ? (
                          <>
                            {/* Primaire afbeelding - altijd zichtbaar */}
                            <Image
                              src={primaryImage}
                              alt={product.name}
                              fill
                              className={`object-cover transition-opacity duration-300 ${
                                hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'
                              }`}
                              unoptimized={isSupabaseImage(primaryImage)}
                              sizes="(max-width: 768px) 50vw, 25vw"
                              loading="lazy"
                              quality={85}
                            />
                            {/* Tweede afbeelding - alleen zichtbaar bij hover als deze bestaat */}
                            {hoverImage && (
                              <Image
                                src={hoverImage}
                                alt={`${product.name} - tweede afbeelding`}
                                fill
                                className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                unoptimized={isSupabaseImage(hoverImage)}
                                sizes="(max-width: 768px) 50vw, 25vw"
                                loading="lazy"
                                quality={85}
                              />
                            )}
                          </>
                        ) : (
                          <span className="text-gray-500">Product Image</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <h3 className="font-medium text-gray-900 group-hover:text-[#8B4513] transition-colors">{product.name}</h3>
                        <p className="text-gray-600">€{product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Nu verkrijgbaar Section */}
      <section className="py-6 md:py-16 bg-white">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-4 md:mb-8 text-lg md:text-[26px]">Nu verkrijgbaar</h2>
          </div>
          
          {/* Mobile Layout - Simplified, Show only 2 items */}
          <div className="md:hidden col-12">
            <div className="space-y-4">
              {/* Herten Collectie Card */}
              <Link href="/assortiment?collection=herten" className="block bg-gray-200 rounded-lg overflow-hidden active:scale-[0.98] transition-transform">
                <div className="h-[220px] flex items-center justify-center relative overflow-hidden">
                  <Image
                    src="/images/hertencollectie.png"
                    alt="Herten Collectie"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    loading="lazy"
                    quality={85}
                  />
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white border-2 border-black rounded-lg font-medium text-xs hover:bg-gray-800 transition-colors">
                    Ontdek Nu!
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-gray-600 text-xs mb-1">Herten Collectie</p>
                  <h3 className="text-gray-900 text-sm font-semibold mb-2">Ontdek onze herten collectie</h3>
                </div>
              </Link>
              
              {/* Second placeholder */}
              <Link href="/assortiment" className="block bg-gray-200 rounded-lg overflow-hidden active:scale-[0.98] transition-transform">
                <div className="h-[220px] flex items-center justify-center relative">
                  <span className="text-gray-500 text-xs">Product Image</span>
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white border-2 border-black rounded-lg font-medium text-xs hover:bg-gray-800 transition-colors">
                    Ontdek Nu!
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="text-gray-600 text-xs mb-1">Demo Collectie</p>
                  <h3 className="text-gray-900 text-sm font-semibold mb-2">Demo Product Titel</h3>
                </div>
              </Link>
            </div>
            <div className="text-center mt-5">
              <Link 
                href="/assortiment" 
                className="inline-block px-4 py-2 bg-black text-white border-2 border-black rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                Meer bekijken
              </Link>
            </div>
          </div>
          
          {/* Desktop Layout - Side by Side */}
          <div className="hidden md:block col-12">
            <div className="grid-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
              {/* Left Column */}
              <div className="col-6">
                <div className="flex items-start gap-5">
                  {/* Herten Collectie Card */}
                  <Link href="/assortiment?collection=herten" className="text-center flex-1 group">
                    <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative w-full h-[425px] overflow-hidden">
                      <Image
                        src="/images/hertencollectie.png"
                        alt="Herten Collectie"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white text-black border-2 border-gray-300 rounded-lg font-medium text-sm hover:border-black transition-colors">
                        Ontdek Nu!
                      </div>
                    </div>
                  </Link>
                  
                  {/* Second placeholder */}
                  <div className="text-center flex-1">
                    <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative w-full h-[425px]">
                      <span className="text-gray-500">Product Image</span>
                      <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white text-black border-2 border-gray-300 rounded-lg font-medium text-sm hover:border-black transition-colors">
                        Ontdek Nu!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="col-6">
                <div className="flex flex-col gap-9">
                  {/* Herten Collectie Card */}
                  <Link href="/assortiment?collection=herten" className="bg-gray-200 rounded-lg flex w-full h-[195px] group hover:shadow-lg transition-shadow relative overflow-hidden">
                    {/* Background image - fills entire card */}
                    <div className="absolute inset-0">
                      <Image
                        src="/images/hertencollectiewide.jpg"
                        alt="Herten Collectie"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        loading="lazy"
                        quality={85}
                      />
                    </div>
                    
                    {/* Content overlay */}
                    <div className="relative z-10 flex-1 flex flex-col justify-between p-4">
                      {/* Top section - Collection name */}
                      <div className="flex-1 flex items-start">
                        <p className="text-white text-base font-normal drop-shadow-lg">Herten Collectie</p>
                      </div>
                      
                      {/* Middle section - Product title */}
                      <div className="flex-1 flex items-center">
                        <h3 className="text-white text-xl font-medium drop-shadow-lg">Ontdek onze herten collectie</h3>
                      </div>
                      
                      {/* Bottom section - Button */}
                      <div className="flex-1 flex items-end">
                        <div className="px-4 py-2 bg-white text-black border-2 border-gray-300 rounded-lg font-medium text-sm hover:border-black transition-colors">
                          Check Nu!
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Second placeholder */}
                  <div className="bg-gray-200 rounded-lg flex w-full h-[195px]">
                    {/* Left side - 3 vertical sections */}
                    <div className="flex-1 flex flex-col justify-between p-4">
                      {/* Top section - Collection name */}
                      <div className="flex-1 flex items-start">
                        <p className="text-gray-600 text-base font-normal">Demo Collectie</p>
                      </div>
                      
                      {/* Middle section - Product title */}
                      <div className="flex-1 flex items-center">
                        <h3 className="text-gray-900 text-xl font-medium">Demo Product Titel</h3>
                      </div>
                      
                      {/* Bottom section - Button */}
                      <div className="flex-1 flex items-end">
                        <button className="px-4 py-2 bg-white text-black border-2 border-gray-300 rounded-lg font-medium text-sm hover:border-black transition-colors">
                          Check Nu!
                        </button>
                      </div>
                    </div>
                    
                    {/* Right side - Product image */}
                    <div className="w-1/3 flex items-center justify-center">
                      <span className="text-gray-500">Product Image</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Check ons Fotoboek Section */}
      <section className="bg-black py-8 md:py-0">
        <div className="grid-12">
          {/* Mobile Layout - Simplified */}
          <div className="md:hidden col-12">
            <div className="flex flex-col justify-center items-center text-center py-8 space-y-6">
              <div>
                <h2 className="text-white mb-2 text-3xl font-light">Check ons Fotoboek</h2>
                <p className="text-gray-300 text-base font-light">©K-imprint</p>
              </div>
              <Link 
                href="/fotoboek"
                className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                Bekijk Fotoboek →
              </Link>
            </div>
          </div>
          
          {/* Desktop Layout - Centered */}
          <div className="hidden md:flex col-12">
            <div className="flex flex-col justify-center items-center text-center w-full py-16">
              <h2 className="text-white mb-4 text-[60px] font-light">Check ons Fotoboek</h2>
              <p className="text-gray-300 text-[30px] font-light mb-8">©K-imprint</p>
              <Link 
                href="/fotoboek"
                className="inline-block bg-white text-black px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors"
              >
                Bekijk Fotoboek →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
