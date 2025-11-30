"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createCollection, updateProductCollections } from "../../../actions/collections";
import { supabase, Product } from "@/lib/supabase";

export default function NewCollection() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hero_image: "",
    is_featured: false,
    display_order: 0,
  });
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>("all");
  const [productCategories, setProductCategories] = useState<string[]>([]);

  // Haal alle producten op
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("name", { ascending: true });

        if (error) {
          console.error("Error fetching products:", error);
        } else if (data) {
          setAllProducts(data);
          // Haal unieke categorieën op
          const uniqueCategories = Array.from(
            new Set(
              data
                .map((p: Product) => p.category)
                .filter((cat): cat is string => Boolean(cat))
            )
          );
          setProductCategories(uniqueCategories.sort());
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }

    fetchProducts();
  }, []);

  // Upload hero image
  const uploadHeroImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${random}.${fileExt}`;
    const filePath = `collections/${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Alleen afbeeldingen zijn toegestaan");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Afbeelding is te groot (max 5MB)");
      e.target.value = "";
      return;
    }

    setHeroImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setHeroImagePreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploading(true);

    try {
      // Upload hero image als er een file is
      let heroImageUrl = formData.hero_image;
      if (heroImageFile) {
        heroImageUrl = await uploadHeroImage(heroImageFile);
      }

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("hero_image", heroImageUrl);
      formDataToSubmit.append("is_featured", formData.is_featured.toString());
      formDataToSubmit.append("display_order", formData.display_order.toString());
      formDataToSubmit.append("product_ids", selectedProducts.join(","));

      await createCollection(formDataToSubmit);
      
    } catch (error: any) {
      console.error("Error creating collection:", error);
      alert(error.message || "Fout bij aanmaken van collectie");
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  // Toggle product selectie
  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Filter producten op basis van zoekopdracht en categorie
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = productSearchQuery === "" || 
      product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(productSearchQuery.toLowerCase()));
    
    const matchesCategory = selectedProductCategory === "all" || 
      product.category === selectedProductCategory;

    return matchesSearch && matchesCategory;
  });

  // Cleanup blob URLs bij unmount
  useEffect(() => {
    return () => {
      if (heroImagePreview && heroImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(heroImagePreview);
      }
    };
  }, [heroImagePreview]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <section className="py-8">
        <div className="grid-12">
          <div className="col-12 md:col-8 md:col-start-3">
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h1 className="text-3xl font-bold text-black mb-6">Nieuwe Collectie</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Naam */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Naam *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                    placeholder="Bijv. Herten Collectie"
                  />
                </div>

                {/* Beschrijving */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Beschrijving
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black resize-none"
                    placeholder="Beschrijving van de collectie..."
                  />
                </div>

                {/* Hero Image */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Hero Afbeelding *
                  </label>
                  <div className="mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                    />
                  </div>
                  {heroImagePreview && (
                    <div className="mt-3 relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={heroImagePreview}
                        alt="Hero preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {formData.hero_image && !heroImagePreview && (
                    <div className="mt-3 relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={formData.hero_image}
                        alt="Hero image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Is Featured */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black"
                    />
                    <span className="text-sm font-medium text-black">
                      Featured Collectie (wordt getoond op homepage)
                    </span>
                  </label>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Weergave Volgorde
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lagere nummers worden eerst getoond
                  </p>
                </div>

                {/* Producten */}
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Producten in Collectie
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Selecteer de producten die in deze collectie moeten verschijnen
                  </p>
                  
                  {/* Zoek en Filter */}
                  {allProducts.length > 0 && (
                    <div className="mb-4 space-y-3">
                      {/* Zoekbalk */}
                      <input
                        type="text"
                        placeholder="Zoek producten..."
                        value={productSearchQuery}
                        onChange={(e) => setProductSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black text-sm"
                      />
                      
                      {/* Categorie Filter */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProductCategory("all")}
                          className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors border-2 ${
                            selectedProductCategory === "all"
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border-gray-300 hover:border-black"
                          }`}
                        >
                          Alle
                        </button>
                        {productCategories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedProductCategory(category)}
                            className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors border-2 ${
                              selectedProductCategory === category
                                ? "bg-black text-white border-black"
                                : "bg-white text-black border-gray-300 hover:border-black"
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {allProducts.length === 0 ? (
                    <p className="text-xs text-gray-400 mb-2">
                      Geen producten beschikbaar
                    </p>
                  ) : filteredProducts.length === 0 ? (
                    <p className="text-xs text-gray-400 mb-2">
                      Geen producten gevonden met de huidige filters
                    </p>
                  ) : (
                    <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-4">
                      <div className="space-y-3">
                        {filteredProducts.map((product) => {
                          // Bepaal product afbeelding
                          const productImage = product.images && product.images.length > 0
                            ? product.images[0]
                            : product.colors && product.colors.length > 0 && product.colors[0].images && product.colors[0].images.length > 0
                            ? product.colors[0].images[0]
                            : product.image_url || null;

                          return (
                            <label
                              key={product.id}
                              className="flex items-center gap-3 cursor-pointer group p-3 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-all"
                            >
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => toggleProduct(product.id)}
                                className="w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black text-black shrink-0"
                              />
                              {productImage && (
                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                  <Image
                                    src={productImage}
                                    alt={product.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-700 group-hover:text-black font-medium block">
                                  {product.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  €{product.price.toFixed(2)}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {selectedProducts.length === 0 && allProducts.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      Geen producten geselecteerd ({selectedProducts.length} van {allProducts.length} producten)
                    </p>
                  )}
                  {selectedProducts.length > 0 && (
                    <p className="text-xs text-gray-600 mt-2">
                      {selectedProducts.length} product{selectedProducts.length !== 1 ? 'en' : ''} geselecteerd
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-4 py-2 bg-white text-black border-2 border-gray-300 rounded-lg font-medium text-sm hover:border-black transition-colors"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="flex-1 px-4 py-2 bg-black text-white border-2 border-black rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting || uploading ? "Aanmaken..." : "Collectie Aanmaken"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

