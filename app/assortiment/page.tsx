"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase, Product } from "../../lib/supabase";
import { getCollectionBySlug, getProductsInCollection, type Collection } from "../actions/collections";

export default function Assortiment() {
  const searchParams = useSearchParams();
  const collectionSlug = searchParams.get('collection');
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
  const [allCollectionProducts, setAllCollectionProducts] = useState<Product[]>([]); // Alle producten voor filtering
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [bestSellersLoading, setBestSellersLoading] = useState(true);

  // Haal collectie op basis van slug op
  useEffect(() => {
    async function fetchCollection() {
      if (!collectionSlug) {
        setCurrentCollection(null);
        setCollectionProducts([]);
        setAllCollectionProducts([]);
        return;
      }

      setLoading(true);
      try {
        // Probeer eerst de collectie op te halen via slug
        const collection = await getCollectionBySlug(collectionSlug);
        
        if (collection) {
          setCurrentCollection(collection);
          
          // Haal producten in collectie op
          const productsData = await getProductsInCollection(collection.id);
          // Extract products from the nested structure
          const products = productsData
            .map((item: any) => item.products)
            .filter((product: Product | null) => product !== null) as Product[];
          
          // Sorteer op sales_count
          const sortedProducts = products.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
          
          setAllCollectionProducts(sortedProducts);
          setCollectionProducts(sortedProducts);
        } else {
          // Fallback voor oude 'herten' collectie
          if (collectionSlug === 'herten') {
            const [hoodiesResult, tassenResult] = await Promise.all([
              supabase
                .from('products')
                .select('*')
                .ilike('category', '%hoodie%'),
              supabase
                .from('products')
                .select('*')
                .ilike('category', '%tas%')
            ]);

            if (hoodiesResult.error) throw hoodiesResult.error;
            if (tassenResult.error) throw tassenResult.error;

            const allProducts = [
              ...(hoodiesResult.data || []),
              ...(tassenResult.data || [])
            ].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));

            setAllCollectionProducts(allProducts);
            setCollectionProducts(allProducts);
          } else {
            setCurrentCollection(null);
            setCollectionProducts([]);
            setAllCollectionProducts([]);
          }
        }
      } catch (err) {
        console.error('Error fetching collection products:', err);
        setCollectionProducts([]);
        setAllCollectionProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, [collectionSlug]);

  // Filter producten op basis van geselecteerde categorie
  useEffect(() => {
    if (selectedCategory === "all") {
      setCollectionProducts(allCollectionProducts);
    } else if (selectedCategory === "hoodies") {
      setCollectionProducts(
        allCollectionProducts.filter((product) =>
          product.category?.toLowerCase().includes("hoodie")
        )
      );
    } else if (selectedCategory === "tassen") {
      setCollectionProducts(
        allCollectionProducts.filter((product) =>
          product.category?.toLowerCase().includes("tas")
        )
      );
    }
  }, [selectedCategory, allCollectionProducts]);

  // Haal best sellers op
  useEffect(() => {
    async function fetchBestSellers() {
      try {
        setBestSellersLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('sales_count', { ascending: false })
          .limit(8);

        if (error) throw error;
        setBestSellers(data || []);
      } catch (err) {
        console.error('Error fetching best sellers:', err);
        setBestSellers([]);
      } finally {
        setBestSellersLoading(false);
      }
    }

    // Alleen ophalen als er geen collection parameter is
    if (!collectionSlug) {
      fetchBestSellers();
    }
  }, [collectionSlug]);

  // Als er een collection parameter is, toon de gefilterde producten
  if (collectionSlug && (currentCollection || collectionSlug === 'herten')) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navbar activePage="assortiment" />

        {/* Hero Section */}
        <section className="w-full relative">
          <div className="relative h-[450px] md:h-[80vh] overflow-hidden">
            <div className="absolute inset-0 scale-100">
              {currentCollection?.hero_image ? (
                <Image
                  src={currentCollection.hero_image}
                  alt={currentCollection.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center center' }}
                  priority
                  sizes="100vw"
                  unoptimized={currentCollection.hero_image.includes('supabase.co')}
                />
              ) : (
                <Image
                  src="/images/hertencollectiehero.jpg"
                  alt="Herten Collectie"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 25%' }}
                  priority
                  sizes="100vw"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-black/20">
              <div className="grid-12 h-full">
                <div className="md:hidden col-12 flex flex-col items-center justify-center text-center px-4">
                  <h1 className="text-white text-3xl font-medium mb-3 drop-shadow-lg">
                    {currentCollection?.name || 'Herten Collectie'}
                  </h1>
                  <p className="text-white text-base font-normal drop-shadow-md">
                    {currentCollection?.description || 'Ontdek onze herten collectie'}
                  </p>
                </div>
                <div className="hidden md:flex col-3 flex-col items-start pt-16 gap-4">
                  <h1 className="text-white text-[60px] font-medium drop-shadow-lg">
                    {currentCollection?.name || 'Herten Collectie'}
                  </h1>
                  <p className="text-white text-[20px] font-normal drop-shadow-md">
                    {currentCollection?.description || 'Ontdek onze herten collectie'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-6 md:py-16 bg-[#FAFAFA]">
          <div className="grid-12">
            <div className="col-12">
              <h2 className="font-bold text-gray-900 underline mb-4 md:mb-8 text-lg md:text-[26px]">Herten Collectie Producten</h2>
              
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 ${
                    selectedCategory === "all"
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  Alle producten
                </button>
                <button
                  onClick={() => setSelectedCategory("hoodies")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 ${
                    selectedCategory === "hoodies"
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  Hoodies
                </button>
                <button
                  onClick={() => setSelectedCategory("tassen")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border-2 ${
                    selectedCategory === "tassen"
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  Totebags
                </button>
              </div>
            </div>

            {loading ? (
              <div className="col-12">
                <div className="text-center py-12">
                  <p className="text-gray-500">Producten laden...</p>
                </div>
              </div>
            ) : collectionProducts.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">Geen producten gevonden in de herten collectie</p>
                  <Link 
                    href="/assortiment"
                    className="inline-block bg-black text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
                  >
                    Bekijk alle producten
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile: Show 2 products per row */}
                <div className="md:hidden col-12">
                  <div className="grid grid-cols-2 gap-3">
                    {collectionProducts.map((product) => {
                      // Bepaal welke afbeeldingen te tonen - 1e als standaard, 2e bij hover
                      const firstImage = product.images && product.images.length > 0 
                        ? product.images[0] 
                        : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0
                        ? product.colors[0].images[0]
                        : product.image_url;
                      
                      const secondImage = product.images && product.images.length > 1 
                        ? product.images[1] 
                        : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 1
                        ? product.colors[0].images[1]
                        : null;
                      
                      const defaultImage = firstImage;
                      const hoverImage = secondImage;
                      
                      return (
                        <div key={product.id} className="group relative">
                          <Link href={`/product/${product.id}`} className="block">
                            <div className="bg-gray-200 rounded-lg mb-2 flex items-center justify-center w-full h-[180px] overflow-hidden relative">
                              {defaultImage ? (
                                <>
                                  {/* Standaard afbeelding (2e of 1e als fallback) */}
                                  <Image
                                    src={defaultImage}
                                    alt={product.name}
                                    fill
                                    className={`object-cover transition-opacity duration-300 ${
                                      hoverImage ? 'group-hover:opacity-0' : ''
                                    }`}
                                  />
                                  {/* Hover afbeelding (2e) - alleen zichtbaar bij hover als deze bestaat */}
                                  {hoverImage && (
                                    <Image
                                      src={hoverImage}
                                      alt={`${product.name} - hover`}
                                      fill
                                      className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                </div>

                {/* Desktop: Show all products */}
                <div className="hidden md:grid col-12 grid-cols-4 gap-5">
                  {collectionProducts.map((product) => {
                    // Bepaal welke afbeeldingen te tonen - 1e als standaard, 2e bij hover
                    const firstImage = product.images && product.images.length > 0 
                      ? product.images[0] 
                      : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0
                      ? product.colors[0].images[0]
                      : product.image_url;
                    
                    const secondImage = product.images && product.images.length > 1 
                      ? product.images[1] 
                      : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 1
                      ? product.colors[0].images[1]
                      : null;
                    
                    const defaultImage = firstImage;
                    const hoverImage = secondImage;
                    
                    return (
                      <div key={product.id} className="group relative">
                        <Link href={`/product/${product.id}`}>
                          <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center w-full h-[395px] overflow-hidden relative">
                            {defaultImage ? (
                              <>
                                {/* Standaard afbeelding (2e of 1e als fallback) */}
                                <Image
                                  src={defaultImage}
                                  alt={product.name}
                                  fill
                                  className={`object-cover transition-opacity duration-300 ${
                                    hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'
                                  }`}
                                />
                                {/* Hover afbeelding (2e) - alleen zichtbaar bij hover als deze bestaat */}
                                {hoverImage && (
                                  <Image
                                    src={hoverImage}
                                    alt={`${product.name} - hover`}
                                    fill
                                    className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <Navbar activePage="assortiment" />

      {/* Hero Section */}
      <section className="w-full relative">
        <div className="relative h-[450px] md:h-[80vh] overflow-hidden">
          <div className="absolute inset-0 scale-100">
            <Image
              src="/images/hero/assortimentheroimage.png"
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
                { name: 'T-shirts', href: '/assortiment/t-shirts', image: '/images/tshirtsimage.webp' },
                { name: 'Hoodies', href: '/assortiment/hoodies', image: '/images/hoodiesimage.webp' },
                { name: 'Totebags', href: '/assortiment/tassen', image: '/images/totebagsimage.webp' },
                { name: 'Rompers', href: '/assortiment/rompers', image: null }
              ].map((category, index) => (
                <Link key={category.name} href={category.href} className="block">
                  <div className="bg-gray-200 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden w-full h-[280px]">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">Category</span>
                    )}
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
              { name: 'T-shirts', href: '/assortiment/t-shirts', image: '/images/tshirtsimage.webp' },
              { name: 'Hoodies', href: '/assortiment/hoodies', image: '/images/hoodiesimage.webp' },
              { name: 'Totebags', href: '/assortiment/tassen', image: '/images/totebagsimage.webp' },
              { name: 'Rompers', href: '/assortiment/rompers', image: null }
            ].map((category, index) => (
              <div key={category.name} className="text-center group flex-1">
                <Link href={category.href}>
                  <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden transition-all duration-300 w-full h-[425px] group-hover:shadow-lg">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="25vw"
                      />
                    ) : (
                      <span className="text-gray-500">Category Image</span>
                    )}
                    <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white text-black border-2 border-gray-300 rounded-lg font-medium text-sm hover:border-black transition-colors z-10">
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
      {!collection && (
        <section className="py-6 md:py-16 bg-white">
          <div className="grid-12">
            <div className="col-12">
              <h2 className="font-bold text-gray-900 underline mb-4 md:mb-8 text-lg md:text-[26px]">Best Sellers</h2>
            </div>
            
            {bestSellersLoading ? (
              <div className="col-12">
                <div className="text-center py-12">
                  <p className="text-gray-500">Producten laden...</p>
                </div>
              </div>
            ) : bestSellers.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-12">
                  <p className="text-gray-500">Geen best sellers gevonden</p>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile: Show 2 products per row, only 4 products */}
                <div className="md:hidden col-12">
                  <div className="grid grid-cols-2 gap-3">
                    {bestSellers.slice(0, 4).map((product) => {
                      const firstImage = product.images && product.images.length > 0 
                        ? product.images[0] 
                        : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0
                        ? product.colors[0].images[0]
                        : product.image_url;
                      
                      const secondImage = product.images && product.images.length > 1 
                        ? product.images[1] 
                        : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 1
                        ? product.colors[0].images[1]
                        : null;
                      
                      const primaryImage = firstImage;
                      const hoverImage = secondImage;
                      
                      return (
                        <div key={product.id} className="group">
                          <Link href={`/product/${product.id}`} className="block">
                            <div className="bg-gray-200 rounded-lg mb-2 flex items-center justify-center w-full h-[180px] overflow-hidden relative">
                              {primaryImage ? (
                                <>
                                  <Image
                                    src={primaryImage}
                                    alt={product.name}
                                    fill
                                    className={`object-cover transition-opacity duration-300 ${
                                      hoverImage ? 'group-hover:opacity-0' : ''
                                    }`}
                                  />
                                  {hoverImage && (
                                    <Image
                                      src={hoverImage}
                                      alt={`${product.name} - hover`}
                                      fill
                                      className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                  <div className="text-center mt-5">
                    <Link 
                      href="/assortiment"
                      className="inline-block px-4 py-2 bg-black text-white border-2 border-black rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
                    >
                      Alle producten bekijken
                    </Link>
                  </div>
                </div>

                {/* Desktop: Show 8 products in 2 rows, 4 per row */}
                <div className="hidden md:grid col-12 grid-cols-4 gap-5">
                  {bestSellers.slice(0, 8).map((product) => {
                    const firstImage = product.images && product.images.length > 0 
                      ? product.images[0] 
                      : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0
                      ? product.colors[0].images[0]
                      : product.image_url;
                    
                    const secondImage = product.images && product.images.length > 1 
                      ? product.images[1] 
                      : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 1
                      ? product.colors[0].images[1]
                      : null;
                    
                    const primaryImage = firstImage;
                    const hoverImage = secondImage;
                    
                    return (
                      <div key={product.id} className="group text-center">
                        <Link href={`/product/${product.id}`}>
                          <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center w-full h-[395px] overflow-hidden relative">
                            {primaryImage ? (
                              <>
                                <Image
                                  src={primaryImage}
                                  alt={product.name}
                                  fill
                                  className={`object-cover transition-opacity duration-300 ${
                                    hoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-110'
                                  }`}
                                />
                                {hoverImage && (
                                  <Image
                                    src={hoverImage}
                                    alt={`${product.name} - hover`}
                                    fill
                                    className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
