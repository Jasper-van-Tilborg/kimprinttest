import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCollectionBySlug, getProductsInCollection, type Collection } from "../actions/collections";
import { getBestSellers, getProductsByCategories, type Product } from "../actions/products";

// Dynamic import voor client component (code splitting)
const CollectionProducts = dynamic(() => import("../components/CollectionProducts"), {
  loading: () => <div className="col-12"><p className="text-gray-500">Laden...</p></div>,
});

type Props = {
  searchParams: Promise<{ collection?: string }>;
};

export default async function Assortiment({ searchParams }: Props) {
  const params = await searchParams;
  const collectionSlug = params.collection;

  // Server-side data fetching
  let currentCollection: Collection | null = null;
  let collectionProducts: Product[] = [];
  let bestSellers: Product[] = [];

  if (collectionSlug && collectionSlug !== 'herten') {
    currentCollection = await getCollectionBySlug(collectionSlug);
    if (currentCollection) {
      const productsData = await getProductsInCollection(currentCollection.id);
      collectionProducts = productsData
        .map((item: any) => item.products)
        .filter((product: Product | null) => product !== null) as Product[];
      collectionProducts.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
    }
  } else if (collectionSlug === 'herten') {
    // Fallback voor oude 'herten' collectie
    collectionProducts = await getProductsByCategories(['hoodie', 'tas']);
  }

  // Haal best sellers op als er geen collection is
  if (!collectionSlug) {
    bestSellers = await getBestSellers(8);
  }

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
                  <h1 className="text-white text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                    {currentCollection?.name || 'Herten Collectie'}
                  </h1>
                  <Link 
                    href="#products"
                    className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                  >
                    Bekijk Collectie
                  </Link>
                </div>
                <div className="hidden md:flex col-12 flex-col items-center justify-center text-center">
                  <h1 className="text-white text-[80px] md:text-[100px] font-bold mb-8 drop-shadow-lg">
                    {currentCollection?.name || 'Herten Collectie'}
                  </h1>
                  <Link 
                    href="#products"
                    className="inline-block bg-white text-black px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors"
                  >
                    Bekijk Collectie
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CollectionProducts 
          products={collectionProducts} 
          collectionName={currentCollection?.name || 'Herten Collectie'} 
        />

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
              ].map((category) => (
                <Link key={category.name} href={category.href} className="block">
                  <div className="bg-gray-200 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden w-full h-[280px]">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 280px, 425px"
                        loading="lazy"
                        quality={75}
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
            ].map((category) => (
              <div key={category.name} className="text-center group flex-1">
                <Link href={category.href}>
                  <div className="bg-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden transition-all duration-300 w-full h-[425px] group-hover:shadow-lg">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 280px, 425px"
                        loading="lazy"
                        quality={75}
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
      <section className="py-6 md:py-16 bg-white">
        <div className="grid-12">
          <div className="col-12">
            <h2 className="font-bold text-gray-900 underline mb-4 md:mb-8 text-lg md:text-[26px]">Best Sellers</h2>
          </div>
          
          {bestSellers.length === 0 ? (
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
                                  sizes="(max-width: 768px) 188px, 300px"
                                  loading="lazy"
                                  quality={75}
                                  unoptimized={primaryImage?.includes('supabase.co')}
                                />
                                {hoverImage && (
                                  <Image
                                    src={hoverImage}
                                    alt={`${product.name} - hover`}
                                    fill
                                    className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    sizes="(max-width: 768px) 188px, 300px"
                                    loading="lazy"
                                    quality={75}
                                    unoptimized={hoverImage?.includes('supabase.co')}
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
                                sizes="(max-width: 768px) 188px, (max-width: 1024px) 300px, 395px"
                                loading="lazy"
                                quality={75}
                                unoptimized={primaryImage?.includes('supabase.co')}
                              />
                              {hoverImage && (
                                <Image
                                  src={hoverImage}
                                  alt={`${product.name} - hover`}
                                  fill
                                  className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  sizes="(max-width: 768px) 188px, (max-width: 1024px) 300px, 395px"
                                  loading="lazy"
                                  quality={75}
                                  unoptimized={hoverImage?.includes('supabase.co')}
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
