import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { isSupabaseImage } from "../lib/imageUtils";
import { getFeaturedCollection, getProductsInCollection, type Collection } from "./actions/collections";
import { getProductsByCategoryFilter, type Product } from "./actions/products";

// Dynamic import voor client component (code splitting)
const CategoryProducts = dynamic(() => import("./components/CategoryProducts"), {
  loading: () => <div className="col-12"><p className="text-gray-500">Laden...</p></div>,
});

export default async function Home() {
  // Server-side data fetching
  const featuredCollection = await getFeaturedCollection();
  
  let collectionProducts: Product[] = [];
  if (featuredCollection) {
    const productsData = await getProductsInCollection(featuredCollection.id);
    collectionProducts = productsData
      .map((item: any) => item.products)
      .filter((product: Product | null) => product !== null) as Product[];
  }

  // Haal initiële producten op voor t-shirts
  const initialProducts = await getProductsByCategoryFilter('t-shirt', 4);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <Navbar activePage="home" />

      {/* Hero Section - Featured Collection */}
      {featuredCollection?.hero_image && (
        <section className="w-full">
          <div className="relative h-[450px] md:h-[80vh] overflow-hidden">
            <div className="absolute inset-0 scale-100">
              <Image
                src={featuredCollection.hero_image}
                alt={featuredCollection.name}
                fill
                className="object-cover"
                style={{ objectPosition: 'center center' }}
                priority
                fetchPriority="high"
                sizes="100vw"
                quality={85}
                unoptimized={isSupabaseImage(featuredCollection.hero_image)}
              />
            </div>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0">
              <div className="grid-12 h-full">
                {/* Mobile Hero */}
                <div className="md:hidden col-12 flex flex-col items-center justify-center text-center px-4">
                  <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                    {featuredCollection.name}
                  </h1>
                  <Link 
                    href={`/assortiment?collection=${featuredCollection.slug}`}
                    className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                  >
                    Bekijk Collectie →
                  </Link>
                </div>
                {/* Desktop Hero */}
                <div className="hidden md:flex col-12 flex-col items-center justify-center text-center">
                  <h1 className="text-white text-[80px] md:text-[100px] font-bold mb-8 drop-shadow-lg">
                    {featuredCollection.name}
                  </h1>
                  <Link 
                    href={`/assortiment?collection=${featuredCollection.slug}`}
                    className="inline-block bg-white text-black px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors"
                  >
                    Bekijk Collectie →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Onze Collectie Section */}
      <section className="py-6 md:py-16">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-4 md:mb-8 text-lg md:text-[26px]">Onze Collectie</h2>
          </div>
          
          <CategoryProducts initialCategory="t-shirts" initialProducts={initialProducts} />
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
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    quality={75}
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
                        sizes="(max-width: 768px) 100vw, 50vw"
                        loading="lazy"
                        quality={75}
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
                        sizes="(max-width: 768px) 100vw, 50vw"
                        loading="lazy"
                        quality={75}
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
