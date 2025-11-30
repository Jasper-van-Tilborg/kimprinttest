"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState, use, useEffect, useRef, useMemo } from "react";
import { useCart } from "../../../contexts/CartContext";
import { supabase } from "../../../lib/supabase";
import type { Product, ColorVariant } from "../../../lib/supabase";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem, openCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColorImages, setSelectedColorImages] = useState<string[]>([]);
  const [displayImagesState, setDisplayImagesState] = useState<string[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const isAddingToCartRef = useRef(false);

  // Get size from URL query parameter
  const sizeFromUrl = searchParams.get('size');
  
  // Memoize available sizes based on product - alleen als er maten zijn opgeslagen
  const availableSizes = useMemo(() => {
    if (product?.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
      return product.sizes;
    }
    // Geen maten - retourneer lege array
    return [];
  }, [product?.sizes]);
  
  // Memoize display sizes based on URL parameter and available sizes
  const displaySizes = useMemo(() => {
    if (availableSizes.length === 0) {
      return [];
    }
    if (sizeFromUrl && availableSizes.includes(sizeFromUrl)) {
      return [sizeFromUrl];
    }
    return availableSizes;
  }, [sizeFromUrl, availableSizes]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
          router.push("/assortiment");
          return;
        }

        if (data) {
          setProduct(data);
          
          // Set eerste kleur als default als er kleuren zijn
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0].name);
            setSelectedColorImages(data.colors[0].images || []);
          } else {
            // Fallback voor oude producten zonder kleuren (backward compatibility)
            if (data.images && data.images.length > 0) {
              setSelectedColorImages(data.images);
            } else if (data.image_url) {
              setSelectedColorImages([data.image_url]);
            }
          }

          // Haal gerelateerde producten op (zelfde categorie, exclusief huidige product)
          if (data.category) {
            const { data: related, error: relatedError } = await supabase
              .from("products")
              .select("*")
              .eq("category", data.category)
              .neq("id", data.id)
              .limit(3)
              .order("sales_count", { ascending: false });

            if (!relatedError && related) {
              setRelatedProducts(related);
            }
          }
        }
      } catch (err) {
        console.error("Error:", err);
        router.push("/assortiment");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [resolvedParams.id, router]);

  // Update images when color changes
  useEffect(() => {
    if (!product) return;

    if (product.colors && product.colors.length > 0 && selectedColor) {
      // Zoek de geselecteerde kleur variant
      const colorVariant = product.colors.find((c: ColorVariant) => c.name === selectedColor);
      
      if (colorVariant && colorVariant.images && Array.isArray(colorVariant.images) && colorVariant.images.length > 0) {
        // Gebruik de images van de geselecteerde kleur
        setSelectedColorImages(colorVariant.images);
        setCurrentImageIndex(0);
      } else {
        // Geen images voor deze kleur
        setSelectedColorImages([]);
        setCurrentImageIndex(0);
      }
    } else if (product.colors && product.colors.length > 0) {
      // Geen kleur geselecteerd, gebruik eerste kleur
      const firstColor = product.colors[0];
      if (firstColor && firstColor.images && Array.isArray(firstColor.images) && firstColor.images.length > 0) {
        setSelectedColorImages(firstColor.images);
        setCurrentImageIndex(0);
      } else {
        setSelectedColorImages([]);
        setCurrentImageIndex(0);
      }
    } else {
      // Geen kleuren gedefinieerd (oude producten zonder kleuren)
      // Fallback voor backward compatibility
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        setSelectedColorImages(product.images);
      } else if (product.image_url) {
        setSelectedColorImages([product.image_url]);
      } else {
        setSelectedColorImages([]);
      }
      setCurrentImageIndex(0);
    }
  }, [selectedColor, product]);

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    if (isLightboxOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  // Update displayImagesState when selectedColorImages or product changes
  useEffect(() => {
    if (!product) return;
    
    // Bereken baseDisplayImages binnen de useEffect
    const baseDisplayImages = selectedColorImages.length > 0 
      ? selectedColorImages 
      : (product.images && product.images.length > 0 
          ? product.images 
          : (product.image_url ? [product.image_url] : []));

    setDisplayImagesState((prevState) => {
      if (baseDisplayImages.length > 0) {
        // Check of de arrays daadwerkelijk verschillen
        const arraysEqual = prevState.length === baseDisplayImages.length &&
          prevState.every((val, idx) => val === baseDisplayImages[idx]);
        
        if (!arraysEqual) {
          return [...baseDisplayImages];
        }
        return prevState;
      } else {
        // Als baseDisplayImages leeg is geworden, reset displayImagesState ook
        return [];
      }
    });
    
    setCurrentImageIndex(0);
  }, [selectedColorImages, product]);

  // Set initial selected size from URL if valid, of eerste maat als er maten zijn
  useEffect(() => {
    if (availableSizes.length > 0) {
      if (sizeFromUrl && availableSizes.includes(sizeFromUrl)) {
        setSelectedSize(sizeFromUrl);
      } else {
        // Geen size in URL, gebruik eerste beschikbare maat
        setSelectedSize(availableSizes[0]);
      }
    } else {
      // Geen maten beschikbaar
      setSelectedSize(null);
    }
  }, [sizeFromUrl, availableSizes]);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/assortiment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-xl">Laden...</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    // Voorkom dubbele toevoeging - check zowel state als ref
    if (!product || addedToCart || isAddingToCartRef.current) {
      return;
    }
    
    // Zet beide guards direct om race conditions te voorkomen
    isAddingToCartRef.current = true;
    setAddedToCart(true);
    
    // Voeg item toe
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: selectedColorImages[0] || product.image_url || undefined,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
      quantity: quantity,
    });
    
    // Reset na 2 seconden
    setTimeout(() => {
      setAddedToCart(false);
      isAddingToCartRef.current = false;
    }, 2000);
  };

  // Get available colors from product
  const availableColors = product.colors && product.colors.length > 0 
    ? product.colors 
    : [];

  // Get all images (from selected color or general images)
  const baseDisplayImages = selectedColorImages.length > 0 
    ? selectedColorImages 
    : (product?.images && product.images.length > 0 
        ? product.images 
        : (product?.image_url ? [product.image_url] : []));

  // Use displayImagesState if it has items, otherwise fall back to baseDisplayImages
  // displayImagesState wordt geüpdatet wanneer we wisselen
  const displayImages = displayImagesState.length > 0 ? displayImagesState : baseDisplayImages;

  // Functie om twee afbeeldingen van plaats te wisselen
  const swapImages = (index1: number, index2: number) => {
    // Gebruik de huidige displayImages (die al de juiste state heeft)
    const currentImages = displayImagesState.length > 0 ? displayImagesState : baseDisplayImages;
    
    if (index1 === index2 || index1 < 0 || index2 < 0 || index1 >= currentImages.length || index2 >= currentImages.length) {
      return;
    }
    
    // Maak een nieuwe array en wissel de afbeeldingen
    const newImages = [...currentImages];
    [newImages[index1], newImages[index2]] = [newImages[index2], newImages[index1]];
    
    // Update de state
    setDisplayImagesState(newImages);
    
    // Reset currentImageIndex naar 0 als we de hoofdafbeelding wisselen
    // Dit zorgt ervoor dat de hoofdafbeelding altijd de eerste in de array is
    if (index1 === 0 || index2 === 0) {
      setCurrentImageIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <Navbar activePage="assortiment" />

      {/* Breadcrumbs */}
      <div className="bg-[#FAFAFA] py-3 md:py-4">
        <div className="grid-12">
          <div className="col-12">
            <button 
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-[#8B4513] transition-colors text-sm md:text-base"
            >
              <span className="mr-2">←</span>
              <span>Terug</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="pt-4 md:pt-8 pb-8 md:pb-16">
        <div className="grid-12 md:items-stretch">
          {/* Mobile: Single Image */}
          <div className="md:hidden col-12 mb-4">
            {displayImages.length > 0 ? (
              <div 
                className="relative rounded-lg overflow-hidden cursor-pointer" 
                style={{ height: '300px' }}
                onClick={() => setIsLightboxOpen(true)}
              >
                <Image
                  src={displayImages[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {displayImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {displayImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          swapImages(0, index);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === 0 ? 'bg-black' : 'bg-white border border-black'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg flex items-center justify-center relative" style={{ height: '300px' }}>
                <span className="text-gray-500 text-sm">Geen afbeelding beschikbaar</span>
              </div>
            )}
          </div>

          {/* Desktop: Top Row - Images */}
          <div className="hidden md:block col-6">
            {/* Main Image with Carousel */}
            {displayImages.length > 0 ? (
              <div 
                className="relative rounded-lg overflow-hidden cursor-pointer" 
                style={{ height: '550px' }}
                onClick={() => setIsLightboxOpen(true)}
              >
                <Image
                  src={displayImages[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {displayImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {displayImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          swapImages(0, index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === 0 ? 'bg-black' : 'bg-white border border-black'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg flex items-center justify-center relative" style={{ height: '550px' }}>
                <span className="text-gray-500 text-lg">Geen afbeelding beschikbaar</span>
              </div>
            )}
          </div>
          
          <div className="hidden md:block col-6">
            {/* Thumbnail images - 2 boven, 1 onder */}
            {displayImages.length > 1 && (
              <div className="flex flex-col gap-4" style={{ height: '550px' }}>
                {/* Top 2 images side by side */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {Array.from({ length: 2 }).map((_, index) => {
                    const imageIndex = index + 1;
                    const hasImage = imageIndex < displayImages.length;
                    return hasImage ? (
                      <div key={index} className="relative rounded-lg overflow-hidden">
                        <Image
                          src={displayImages[imageIndex]}
                          alt={`${product.name} ${imageIndex + 1}`}
                          fill
                          className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => swapImages(0, imageIndex)}
                        />
                      </div>
                    ) : (
                      <div key={index} className="relative rounded-lg overflow-hidden">
                        {/* Lege ruimte - geen placeholder */}
                      </div>
                    );
                  })}
                </div>
                {/* Bottom 1 wider image */}
                {displayImages.length > 3 ? (
                  <div className="relative rounded-lg overflow-hidden flex-1">
                    <Image
                      src={displayImages[3]}
                      alt={`${product.name} 4`}
                      fill
                      className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => swapImages(0, 3)}
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    {/* Lege ruimte - geen placeholder */}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Row - Product Info & Purchase */}
          {/* Mobile: Product Info */}
          <div className="md:hidden col-12 mt-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0 ${
                    isFavorite 
                      ? 'border-red-500 scale-110' 
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`transition-colors duration-300 ${
                      isFavorite ? 'text-red-500' : 'text-gray-700'
                    }`}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
              
              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Kleur</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color: ColorVariant) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? 'ring-2 ring-offset-2 ring-gray-400 border-gray-400'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.colorCode || '#000000' }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Size Selection - alleen tonen als er maten zijn */}
              {displaySizes.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Maat</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {displaySizes.map((size) => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-2 rounded-lg text-sm font-medium transition-colors border ${
                          selectedSize === size
                            ? 'bg-black text-white border-black' 
                            : 'bg-transparent text-black border-black hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Omschrijving</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Product Info */}
          <div className="hidden md:block col-6 mt-8">
            <div className="bg-white p-6 rounded-lg h-full">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0 ${
                    isFavorite 
                      ? 'border-red-500 scale-110' 
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`transition-colors duration-300 w-6 h-6 ${
                      isFavorite ? 'text-red-500' : 'text-gray-700'
                    }`}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
              
              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Kleur</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color: ColorVariant) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? 'ring-2 ring-offset-2 ring-gray-400 border-gray-400'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.colorCode || '#000000' }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Size Selection - alleen tonen als er maten zijn */}
              {displaySizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Maat</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {displaySizes.map((size) => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-4 rounded-lg text-base font-medium transition-colors border ${
                          selectedSize === size
                            ? 'bg-black text-white border-black' 
                            : 'bg-transparent text-black border-black hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Omschrijving</h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Purchase Section */}
          <div className="md:hidden col-12 mt-4 flex flex-col">
            <div className="bg-white p-4 rounded-lg mb-6 space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-700 font-medium text-sm md:text-base">Aantal</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-50 transition-colors text-lg text-black"
                  >
                    −
                  </button>
                  <span className="w-10 md:w-12 text-center font-bold text-base md:text-lg text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-gray-50 transition-colors text-lg text-black"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="bg-black rounded-lg p-4 flex flex-col gap-3">
                <span className="text-2xl font-bold text-white">€ {(product.price * quantity).toFixed(2)}</span>
                <button 
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  className={`w-full px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm ${
                    addedToCart
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-white text-black hover:bg-gray-100 hover:shadow-lg active:scale-[0.98]'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <span>✓</span>
                      Toegevoegd!
                    </>
                  ) : (
                    <>
                      In winkelwagen →
                    </>
                  )}
                </button>
              </div>

                {/* View Cart Link */}
                {addedToCart && (
                  <button
                    onClick={openCart}
                    className="w-full text-white hover:text-gray-300 hover:underline text-sm font-medium animate-[fadeIn_0.3s_ease-in-out]"
                  >
                    Bekijk winkelwagen
                  </button>
                )}
            </div>

            {/* Mobile: Andere Must-Haves */}
            {relatedProducts.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Andere Must-Haves</h2>
                <div className="grid grid-cols-2 gap-3">
                  {relatedProducts.slice(0, 2).map((relatedProduct) => (
                    <div key={relatedProduct.id} className="group">
                      <Link href={`/product/${relatedProduct.id}`} className="block">
                        <div className="bg-white rounded-lg mb-2 overflow-hidden group-active:scale-[0.98] transition-transform flex items-center justify-center p-2" style={{ height: '150px' }}>
                          {relatedProduct.image_url ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={relatedProduct.image_url}
                                alt={relatedProduct.name}
                                width={200}
                                height={150}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-500 text-xs">Geen afbeelding</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-medium text-gray-900 text-xs group-active:text-[#8B4513] transition-colors truncate mb-1">
                            {relatedProduct.name}
                          </h3>
                          <p className="text-gray-600 text-xs font-medium">€{relatedProduct.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop: Purchase Section */}
          <div className="hidden md:block col-6 mt-8">
            <div className="flex flex-col h-full">
              {/* Price & Add to Cart */}
              <div className="bg-black p-6 rounded-lg mb-4">
                <div className="flex flex-row items-center justify-between gap-0">
                  <span className="text-3xl font-bold text-white">€ {(product.price * quantity).toFixed(2)}</span>
                  <button 
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-auto px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-base ${
                      addedToCart
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-white text-black hover:bg-gray-100 hover:shadow-lg active:scale-[0.98]'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <span>✓</span>
                        Toegevoegd!
                      </>
                    ) : (
                      <>
                        In winkelwagen →
                      </>
                    )}
                  </button>
                </div>

                {/* View Cart Link */}
                {addedToCart && (
                  <button
                    onClick={openCart}
                    className="w-full text-white hover:text-gray-300 hover:underline text-sm font-medium animate-[fadeIn_0.3s_ease-in-out] mt-3"
                  >
                    Bekijk winkelwagen
                  </button>
                )}
              </div>

              {/* Desktop: Andere Must-Haves */}
              {relatedProducts.length > 0 && (
                <div className="flex flex-col flex-grow mt-auto">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Andere Must-Haves</h2>
                  <div className="grid grid-cols-3 gap-4 flex-grow items-stretch">
                    {relatedProducts.map((relatedProduct) => (
                      <div key={relatedProduct.id} className="group flex flex-col">
                        <Link href={`/product/${relatedProduct.id}`} className="block flex flex-col flex-grow h-full">
                          <div className="bg-white p-4 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow duration-300 flex-grow flex items-center justify-center" style={{ minHeight: '200px' }}>
                            {relatedProduct.image_url ? (
                              <div className="relative w-full h-full">
                                <Image
                                  src={relatedProduct.image_url}
                                  alt={relatedProduct.name}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-500 text-sm">Geen afbeelding</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <h3 className="font-medium text-gray-900 text-sm group-hover:text-[#8B4513] transition-colors truncate flex-1 mr-2">
                              {relatedProduct.name}
                            </h3>
                            <p className="text-gray-600 text-sm font-medium shrink-0">€{relatedProduct.price.toFixed(2)}</p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox Modal */}
      {isLightboxOpen && displayImages.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Sluiten"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous Button */}
          {displayImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
              aria-label="Vorige afbeelding"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {displayImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3"
              aria-label="Volgende afbeelding"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={displayImages[currentImageIndex]}
              alt={`${product.name} - Afbeelding ${currentImageIndex + 1}`}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </div>

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg text-sm">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          )}

          {/* Image Dots */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                  aria-label={`Ga naar afbeelding ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
