"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabase";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
  sales_count: number;
  created_at: string;
};

export default function AdminProducts() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Hoodies");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [categories, setCategories] = useState<{ id: string; name: string; description: string }[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchProducts() {
      if (!user) return;

      try {
        setProductsLoading(true);

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching products:", error);
        } else if (data) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, [user]);

  useEffect(() => {
    async function fetchCategories() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });

        if (error) {
          console.error("Error fetching categories:", error);
        } else if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    // Haal altijd categorieën op (ook voor de filter dropdown)
    fetchCategories();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const { error } = await supabase
        .from("categories")
        .insert([{ name: newCategoryName, description: newCategoryDesc }]);

      if (error) {
        console.error("Error adding category:", error);
        alert("Fout bij het toevoegen van de categorie");
      } else {
        setNewCategoryName("");
        setNewCategoryDesc("");
        // Refresh categories
        const { data } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });
        if (data) setCategories(data);
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = (category: { id: string; name: string; description: string }) => {
    setEditingCategory(category.id);
    setEditName(category.name);
    setEditDesc(category.description || "");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName("");
    setEditDesc("");
  };

  const handleSaveEdit = async () => {
    if (!editingCategory || !editName.trim()) return;

    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: editName,
          description: editDesc,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingCategory);

      if (error) {
        console.error("Error updating category:", error);
        alert("Fout bij het bijwerken van de categorie");
      } else {
        // Refresh categories
        const { data } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });
        if (data) setCategories(data);
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Weet je zeker dat je deze categorie wilt verwijderen?")) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) {
        console.error("Error deleting category:", error);
        alert("Fout bij het verwijderen van de categorie");
      } else {
        setCategories(categories.filter((c) => c.id !== categoryId));
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        console.error("Error deleting product:", error);
        alert("Fout bij het verwijderen van het product");
      } else {
        setProducts(products.filter((p) => p.id !== productId));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Fout bij het verwijderen van het product");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Haal categorieën uit de categories tabel (niet uit producten)
  // Dit zorgt ervoor dat alle categorieën zichtbaar zijn, ook als er nog geen producten in zitten
  const productCategories = categories.length > 0 
    ? categories.map(c => c.name)
    : Array.from(new Set(products.map((p) => p.category)));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-xl">Laden...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header Section */}
      <section className="py-8 md:py-16">
        <div className="grid-12">
          <div className="col-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6 md:mb-8">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-black mb-2 md:mb-4">Producten Beheer</h1>
                <p className="text-base md:text-xl text-gray-700">
                  {activeTab === "products" 
                    ? `${products.length} product${products.length !== 1 ? "en" : ""} in totaal`
                    : `${categories.length} categorie${categories.length !== 1 ? "ën" : ""} in totaal`
                  }
                </p>
              </div>
              {activeTab === "products" && (
                <Link
                  href="/admin/products/new"
                  className="bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md text-sm md:text-base whitespace-nowrap"
                >
                  + Nieuw Product Toevoegen
                </Link>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-4 md:px-6 py-2 md:py-3 font-medium transition-all border-b-2 text-sm md:text-base ${
                  activeTab === "products"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                Producten
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`px-4 md:px-6 py-2 md:py-3 font-medium transition-all border-b-2 text-sm md:text-base ${
                  activeTab === "categories"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                Categorieën
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Tab */}
      {activeTab === "products" && (
        <>
          {/* Stats Cards */}
          <section className="pb-6 md:pb-8">
        <div className="grid-12">
          <div className="col-12 md:col-4 mb-4 md:mb-0">
            <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
              <p className="text-xs md:text-sm text-gray-600 mb-2">Totaal Producten</p>
              <p className="text-2xl md:text-3xl font-bold text-black">{products.length}</p>
            </div>
          </div>
          <div className="col-12 md:col-4 mb-4 md:mb-0">
            <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
              <p className="text-xs md:text-sm text-gray-600 mb-2">Op Voorraad</p>
              <p className="text-2xl md:text-3xl font-bold text-black">
                {products.filter((p) => p.stock > 0).length}
              </p>
            </div>
          </div>
          <div className="col-12 md:col-4">
            <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
              <p className="text-xs md:text-sm text-gray-600 mb-2">Totaal Verkocht</p>
              <p className="text-2xl md:text-3xl font-bold text-black">
                {products.reduce((sum, p) => sum + (p.sales_count || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Buttons & Search */}
      <section className="pb-6 md:pb-8">
        <div className="grid-12">
          <div className="col-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-3 flex-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all border text-xs md:text-sm ${
                    selectedCategory === category.name
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all border md:ml-auto text-xs md:text-sm ${
                  selectedCategory === "all"
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50"
                }`}
              >
                Alle Categorieën
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Zoek op naam of omschrijving..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black text-sm md:text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products List */}
      <section className="pb-12 md:pb-16">
        <div className="grid-12">
          <div className="col-12">
            {productsLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="text-center py-16 text-gray-500">Producten laden...</div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="text-center py-16">
                  <p className="text-gray-500 text-base md:text-lg mb-6">
                    {searchQuery || selectedCategory !== "all"
                      ? "Geen producten gevonden met deze filters"
                      : "Nog geen producten toegevoegd"}
                  </p>
                  {!searchQuery && selectedCategory === "all" && (
                    <Link
                      href="/admin/products/new"
                      className="inline-block bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md text-sm md:text-base"
                    >
                      + Voeg je eerste product toe
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table View - Original Structure */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hidden md:block">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-[#FAFAFA] border-b border-gray-200 font-bold text-sm text-black">
                    <div className="col-span-1">Foto</div>
                    <div className="col-span-3">Product</div>
                    <div className="col-span-2">Categorie</div>
                    <div className="col-span-1 text-right">Prijs</div>
                    <div className="col-span-1 text-right">Voorraad</div>
                    <div className="col-span-1 text-right">Verkocht</div>
                    <div className="col-span-3 text-right">Acties</div>
                  </div>

                  {/* Table Body */}
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={`grid grid-cols-12 gap-4 px-8 py-6 ${
                        index !== filteredProducts.length - 1 ? "border-b border-gray-100" : ""
                      } hover:bg-[#FAFAFA] transition-colors items-center`}
                    >
                      {/* Afbeelding */}
                      <div className="col-span-1">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Naam */}
                      <div className="col-span-3">
                        <p className="font-bold text-black mb-1">{product.name}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Categorie */}
                      <div className="col-span-2">
                        <span className="inline-block bg-black text-white px-4 py-1 rounded-full text-xs font-medium">
                          {product.category}
                        </span>
                      </div>

                      {/* Prijs */}
                      <div className="col-span-1 text-right">
                        <p className="font-bold text-black text-lg">
                          €{product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Voorraad */}
                      <div className="col-span-1 text-right">
                        <div className="inline-flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              product.stock === 0
                                ? "bg-red-500"
                                : product.stock < 10
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <p className="font-semibold text-black">{product.stock}</p>
                        </div>
                      </div>

                      {/* Verkocht */}
                      <div className="col-span-1 text-right">
                        <p className="text-gray-700 font-medium">{product.sales_count || 0}</p>
                      </div>

                      {/* Acties */}
                      <div className="col-span-3 text-right flex justify-end gap-3">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all text-sm font-medium"
                        >
                          Bewerken
                        </Link>
                        {deleteConfirm === product.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
                            >
                              Ja, verwijder
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="bg-gray-200 text-black px-5 py-2 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
                            >
                              Annuleren
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="bg-white text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition-all text-sm font-medium border border-red-600"
                          >
                            Verwijderen
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
                    >
                      <div className="flex gap-3 mb-3">
                        {/* Afbeelding */}
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                              N/A
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-black mb-1 text-sm leading-tight">{product.name}</p>
                          <span className="inline-block bg-black text-white px-2 py-0.5 rounded-full text-[10px] font-medium mb-1.5">
                            {product.category}
                          </span>
                          {product.description && (
                            <p className="text-xs text-gray-600 line-clamp-1 leading-tight">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-gray-100">
                        <div>
                          <p className="text-[10px] text-gray-600 mb-0.5">Prijs</p>
                          <p className="font-bold text-black text-xs">€{product.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-600 mb-0.5">Voorraad</p>
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                product.stock === 0
                                  ? "bg-red-500"
                                  : product.stock < 10
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <p className="font-semibold text-black text-xs">{product.stock}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-600 mb-0.5">Verkocht</p>
                          <p className="text-gray-700 font-medium text-xs">{product.sales_count || 0}</p>
                        </div>
                      </div>

                      {/* Acties */}
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="flex-1 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all text-xs font-medium text-center"
                        >
                          Bewerken
                        </Link>
                        {deleteConfirm === product.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all text-xs font-medium"
                            >
                              Ja
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="flex-1 bg-gray-200 text-black px-3 py-2 rounded-lg hover:bg-gray-300 transition-all text-xs font-medium"
                            >
                              Nee
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="flex-1 bg-white text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-all text-xs font-medium border border-red-600"
                          >
                            Verwijderen
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
        </>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <>
          {/* Add Category */}
          <section className="pb-6 md:pb-8">
            <div className="grid-12">
              <div className="col-12">
                <div className="bg-white rounded-lg p-4 md:p-8 border border-gray-200 shadow-sm">
                  <h2 className="font-bold text-black mb-4 md:mb-6 text-lg md:text-xl">Nieuwe Categorie Toevoegen</h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Naam *
                      </label>
                      <input
                        type="text"
                        placeholder="Bijv. T-shirts"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black text-sm md:text-base"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Omschrijving
                      </label>
                      <input
                        type="text"
                        placeholder="Optionele omschrijving"
                        value={newCategoryDesc}
                        onChange={(e) => setNewCategoryDesc(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black text-sm md:text-base"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleAddCategory}
                        className="w-full md:w-auto bg-black text-white px-6 md:px-8 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium whitespace-nowrap text-sm md:text-base"
                      >
                        + Toevoegen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Categories List */}
          <section className="pb-12 md:pb-16">
            <div className="grid-12">
              <div className="col-12">
                {categories.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-center py-16">
                      <p className="text-gray-500 text-base md:text-lg mb-6">Nog geen categorieën toegevoegd</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View - Original Structure */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hidden md:block">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-[#FAFAFA] border-b border-gray-200 font-bold text-sm text-black">
                        <div className="col-span-4">Naam</div>
                        <div className="col-span-6">Omschrijving</div>
                        <div className="col-span-2 text-right">Acties</div>
                      </div>

                      {/* Table Body */}
                      {categories.map((category, index) => (
                        <div
                          key={category.id}
                          className={`grid grid-cols-12 gap-4 px-8 py-6 ${
                            index !== categories.length - 1 ? "border-b border-gray-100" : ""
                          } ${editingCategory === category.id ? "bg-blue-50" : "hover:bg-[#FAFAFA]"} transition-colors items-center`}
                        >
                          {editingCategory === category.id ? (
                            <>
                              {/* Edit Mode - Naam */}
                              <div className="col-span-4">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
                                  placeholder="Categorie naam"
                                />
                              </div>

                              {/* Edit Mode - Omschrijving */}
                              <div className="col-span-6">
                                <input
                                  type="text"
                                  value={editDesc}
                                  onChange={(e) => setEditDesc(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
                                  placeholder="Omschrijving"
                                />
                              </div>

                              {/* Edit Mode - Acties */}
                              <div className="col-span-2 text-right flex gap-2 justify-end">
                                <button
                                  onClick={handleSaveEdit}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
                                >
                                  Opslaan
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
                                >
                                  Annuleren
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* View Mode - Naam */}
                              <div className="col-span-4">
                                <p className="font-bold text-black text-lg">{category.name}</p>
                              </div>

                              {/* View Mode - Omschrijving */}
                              <div className="col-span-6">
                                <p className="text-gray-600">{category.description || "Geen omschrijving"}</p>
                              </div>

                              {/* View Mode - Acties */}
                              <div className="col-span-2 text-right flex gap-2 justify-end">
                                <button
                                  onClick={() => handleEditCategory(category)}
                                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all text-sm font-medium"
                                >
                                  Bewerken
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="bg-red-100 text-red-700 px-6 py-2 rounded-lg hover:bg-red-200 transition-all text-sm font-medium"
                                >
                                  Verwijderen
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${
                            editingCategory === category.id ? "bg-blue-50" : ""
                          }`}
                        >
                          {editingCategory === category.id ? (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Naam</label>
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black text-sm"
                                  placeholder="Categorie naam"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Omschrijving</label>
                                <input
                                  type="text"
                                  value={editDesc}
                                  onChange={(e) => setEditDesc(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black text-sm"
                                  placeholder="Omschrijving"
                                />
                              </div>
                              <div className="flex gap-2 pt-1">
                                <button
                                  onClick={handleSaveEdit}
                                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-all text-xs font-medium"
                                >
                                  Opslaan
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="flex-1 bg-gray-200 text-black px-3 py-2 rounded-lg hover:bg-gray-300 transition-all text-xs font-medium"
                                >
                                  Annuleren
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="mb-3">
                                <p className="font-bold text-black text-sm mb-1">{category.name}</p>
                                <p className="text-xs text-gray-600">{category.description || "Geen omschrijving"}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditCategory(category)}
                                  className="flex-1 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all text-xs font-medium"
                                >
                                  Bewerken
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-all text-xs font-medium"
                                >
                                  Verwijderen
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

