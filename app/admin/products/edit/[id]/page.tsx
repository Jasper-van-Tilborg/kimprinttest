"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../../hooks/useAuth";
import { supabase } from "../../../../../lib/supabase";
import AdminHeader from "../../../../components/AdminHeader";

export default function EditProduct() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image_url: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProduct() {
      if (!user || !productId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (fetchError) {
          console.error("Error fetching product:", fetchError);
          setError("Product niet gevonden");
        } else if (data) {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            price: data.price?.toString() || "",
            category: data.category || "",
            stock: data.stock?.toString() || "",
            image_url: data.image_url || "",
          });
          // Set bestaande afbeeldingen als preview
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            setExistingImages(data.images);
            setPreviewUrls(data.images);
          } else if (data.image_url) {
            // Backwards compatibility voor oude producten met alleen image_url
            setExistingImages([data.image_url]);
            setPreviewUrls([data.image_url]);
          }
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Fout bij het laden van het product");
      } finally {
        setProductLoading(false);
      }
    }

    fetchProduct();
  }, [user, productId]);

  // Haal categorieën op uit de database
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
          // Fallback naar hardcoded categorieën
          setCategories(['T-shirts', 'Hoodies', 'Tassen', 'Rompers']);
        } else if (data) {
          setCategories(data.map((cat: any) => cat.name));
        }
      } catch (err) {
        console.error('Error:', err);
        // Fallback naar hardcoded categorieën
        setCategories(['T-shirts', 'Hoodies', 'Tassen', 'Rompers']);
      }
    }

    fetchCategories();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }

      if (files.length > 0) {
        // Valideer alle bestanden
        for (const file of files) {
          if (file.size > 5 * 1024 * 1024) {
            setError("Afbeelding is te groot (max 5MB)");
            return;
          }
        }

        // Voeg nieuwe bestanden toe aan bestaande
        setSelectedFiles((prev) => [...prev, ...files]);
        setError("");

        // Maak previews voor alle nieuwe bestanden
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrls((prev) => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Valideer alle bestanden
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Alleen afbeeldingen zijn toegestaan");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Afbeelding is te groot (max 5MB)");
        return;
      }
    }

    // Voeg nieuwe bestanden toe aan bestaande
    setSelectedFiles((prev) => [...prev, ...files]);
    setError("");

    // Maak previews voor alle nieuwe bestanden
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    // Check of het een bestaande of nieuwe afbeelding is
    if (index < existingImages.length) {
      // Verwijder uit bestaande afbeeldingen
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Verwijder uit nieuwe bestanden
      const newFileIndex = index - existingImages.length;
      setSelectedFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
    }
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];

    try {
      setUploading(true);

      const uploadPromises = selectedFiles.map(async (file) => {
        // Genereer unieke bestandsnaam
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Upload naar Supabase Storage
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

        // Haal publieke URL op
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        return urlData.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (err) {
      console.error("Error uploading images:", err);
      setError("Fout bij het uploaden van de afbeeldingen");
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validatie
    if (!formData.name || !formData.price || !formData.category) {
      setError("Naam, prijs en categorie zijn verplicht");
      return;
    }

    try {
      setSaving(true);

      // Upload nieuwe afbeeldingen indien geselecteerd
      let newImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const uploadedUrls = await uploadImages();
        if (uploadedUrls.length > 0) {
          newImageUrls = uploadedUrls;
        } else {
          setSaving(false);
          return; // Stop als upload mislukt
        }
      }

      // Combineer bestaande en nieuwe afbeeldingen
      const allImages = [...existingImages, ...newImageUrls];

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          stock: parseInt(formData.stock) || 0,
          image_url: allImages[0] || null, // Eerste afbeelding als main image
          images: allImages, // Array met alle afbeeldingen
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);

      if (updateError) {
        console.error("Error updating product:", updateError);
        setError("Fout bij het opslaan van het product");
      } else {
        router.push("/admin/products");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Er is een fout opgetreden");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading || productLoading) {
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
      <AdminHeader userEmail={user.email} onSignOut={handleSignOut} />

      {/* Header Section */}
      <section className="py-16">
        <div className="grid-12">
          <div className="col-12">
            <div className="flex items-center gap-4 mb-8">
              <Link
                href="/admin/products"
                className="text-gray-600 hover:text-black transition-colors"
              >
                ← Terug naar producten
              </Link>
            </div>
            <h1 className="text-5xl font-bold text-black mb-4">Product Bewerken</h1>
            <p className="text-xl text-gray-700">Pas de productgegevens aan</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-16">
        <div className="grid-12">
          <div className="col-8">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Product Naam */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-black mb-2">
                    Product Naam *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                    placeholder="Bijv. Premium Fotoboek A4"
                    required
                  />
                </div>

                {/* Omschrijving */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-black mb-2">
                    Omschrijving
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black resize-none"
                    placeholder="Beschrijf het product..."
                  />
                </div>

                {/* Prijs en Voorraad */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Prijs (€) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Voorraad
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Categorie */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-black mb-2">
                    Categorie *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black bg-white"
                    required
                  >
                    <option value="">Selecteer een categorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Afbeeldingen Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-black mb-2">
                    Product Afbeeldingen {previewUrls.length > 0 && `(${previewUrls.length})`}
                  </label>

                  {/* Preview Grid */}
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-700"
                          >
                            ×
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                              Hoofd
                            </div>
                          )}
                          {index < existingImages.length && (
                            <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Bestaand
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Zone */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-black transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer"
                    >
                      <div>
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-black mb-1">
                          {previewUrls.length > 0 ? "Meer afbeeldingen toevoegen" : "Klik om afbeeldingen te uploaden"}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF tot 5MB per afbeelding<br />
                          Of gebruik <span className="font-semibold">Ctrl+V</span> om te plakken
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Actieknoppen */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? `Afbeeldingen uploaden (${selectedFiles.length})...` : saving ? "Opslaan..." : "Wijzigingen Opslaan"}
                  </button>
                  <Link
                    href="/admin/products"
                    className="bg-gray-200 text-black px-8 py-4 rounded-lg hover:bg-gray-300 transition-all font-medium"
                  >
                    Annuleren
                  </Link>
                </div>
              </div>
            </form>
          </div>

          {/* Info Panel */}
          <div className="col-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              <h3 className="font-bold text-black mb-4 text-lg">Product Info</h3>
              <div className="space-y-3 text-sm">
                <div className="pb-3 border-b border-gray-200">
                  <p className="text-gray-600 mb-1">Product ID</p>
                  <p className="font-mono text-xs text-black break-all">{productId}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Opmerking</p>
                  <p className="text-gray-700">
                    Let op: wijzigingen zijn meteen zichtbaar op de website na het opslaan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

