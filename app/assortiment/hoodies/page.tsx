"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState, useEffect } from "react";
import { supabase, Product } from "../../../lib/supabase";

export default function HoodiesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "newest">("popular");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");

  const colors = ["Zwart", "Wit", "Grijs", "Blauw", "Rood", "Groen", "Navy"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('category', 'hoodies');

      switch (sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
        default:
          query = query.order('sales_count', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar activePage="assortiment" />

      {/* Hero Section */}
      <section className="w-full relative bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="bg-gray-200 h-[400px] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400 text-lg">Hero Image Placeholder</span>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-30">
            <div className="grid-12 h-full">
              <div className="col-12 flex flex-col justify-center items-center text-center">
                <h1 className="text-white text-6xl font-bold mb-4 drop-shadow-lg">
                  Hoodies Collectie
                </h1>
                <p className="text-white text-xl font-light drop-shadow-md">
                  Warme en stijlvolle hoodies met jouw unieke design
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="grid-12">
          <div className="col-12">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-[#8B4513] transition-colors">Home</Link>
              <span className="mx-2">›</span>
              <Link href="/assortiment" className="hover:text-[#8B4513] transition-colors">Assortiment</Link>
              <span className="mx-2">›</span>
              <span className="text-black font-medium">Hoodies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Products Section */}
      <section className="py-12">
        <div className="grid-12">
          {/* Sidebar Filters */}
          <div className="col-3">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h3 className="text-xl font-bold text-black mb-6">Filters</h3>
              
              <div className="mb-8">
                <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wider">
                  Sorteren
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#8B4513] text-black font-medium"
                >
                  <option value="popular">Meest populair</option>
                  <option value="newest">Nieuwste eerst</option>
                  <option value="price-low">Prijs: laag - hoog</option>
                  <option value="price-high">Prijs: hoog - laag</option>
                </select>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wider">
                  Kleur
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="color"
                      value="all"
                      checked={selectedColor === "all"}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-4 h-4 accent-[#8B4513]"
                    />
                    <span className="text-gray-700 group-hover:text-black font-medium">
                      Alle kleuren
                    </span>
                  </label>
                  {colors.map((color) => (
                    <label key={color} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        checked={selectedColor === color}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-4 h-4 accent-[#8B4513]"
                      />
                      <span className="text-gray-700 group-hover:text-black font-medium">
                        {color}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wider">
                  Maat
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="size"
                      value="all"
                      checked={selectedSize === "all"}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-4 h-4 accent-[#8B4513]"
                    />
                    <span className="text-gray-700 group-hover:text-black font-medium">
                      Alle maten
                    </span>
                  </label>
                  {sizes.map((size) => (
                    <label key={size} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="size"
                        value={size}
                        checked={selectedSize === size}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-4 h-4 accent-[#8B4513]"
                      />
                      <span className="text-gray-700 group-hover:text-black font-medium">
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {(selectedColor !== "all" || selectedSize !== "all") && (
                <button
                  onClick={() => {
                    setSelectedColor("all");
                    setSelectedSize("all");
                  }}
                  className="w-full py-2 text-sm text-[#8B4513] hover:text-[#6d3710] font-medium transition-colors"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-9">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-700">
                <span className="font-bold text-black">{products.length}</span> producten gevonden
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-96 mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">Geen producten gevonden</p>
                <p className="text-gray-400">Probeer andere filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative bg-gray-200 h-96 flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-gray-400">Product Foto</span>
                        )}
                      </div>
                    </Link>
                    
                    <div className="p-4">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-bold text-gray-900 mb-2 hover:text-[#8B4513] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-black">
                          €{product.price.toFixed(2)}
                        </span>
                        <Link
                          href={`/product/${product.id}`}
                          className="text-[#8B4513] hover:text-[#6d3710] font-medium text-sm"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

