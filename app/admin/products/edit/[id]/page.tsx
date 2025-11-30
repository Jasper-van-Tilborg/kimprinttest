"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../../hooks/useAuth";
import { supabase } from "../../../../../lib/supabase";
import { getAllCollections, getCollectionsForProduct, updateProductCollections, type Collection } from "../../../../actions/collections";

interface ColorVariant {
  id: string;
  name: string;
  colorCode: string; // Hex kleurcode voor het bolletje
  files: File[];
  previewUrls: string[];
  existingImages: string[];
}

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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [colors, setColors] = useState<ColorVariant[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const isSubmittingRef = useRef(false);

  // Beschikbare maten
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Toggle size selectie
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

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

          // Laad bestaande kleuren
          if (data.colors && Array.isArray(data.colors) && data.colors.length > 0) {
            const loadedColors: ColorVariant[] = data.colors.map((color: any, index: number) => ({
              id: `existing-${index}-${Date.now()}`,
              name: color.name || "",
              colorCode: color.colorCode || "#000000",
              files: [],
              previewUrls: color.images || [],
              existingImages: color.images || [],
            }));
            setColors(loadedColors);
          } else {
            // Als er geen kleuren zijn, voeg automatisch één toe
            const newColor: ColorVariant = {
              id: Date.now().toString(),
              name: "",
              colorCode: "#000000",
              files: [],
              previewUrls: [],
              existingImages: [],
            };
            setColors([newColor]);
          }

          // Laad bestaande maten
          if (data.sizes && Array.isArray(data.sizes) && data.sizes.length > 0) {
            setSelectedSizes(data.sizes);
          } else {
            setSelectedSizes([]);
          }

          // Laad collecties voor dit product
          try {
            const productCollections = await getCollectionsForProduct(productId);
            setSelectedCollections(productCollections.map((c) => c.id));
          } catch (err) {
            console.error("Error fetching collections for product:", err);
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
          setCategories(['T-shirts', 'Hoodies', 'Totebags', 'Rompers']);
        } else if (data) {
          setCategories(data.map((cat: any) => cat.name));
        }
      } catch (err) {
        console.error('Error:', err);
        // Fallback naar hardcoded categorieën
        setCategories(['T-shirts', 'Hoodies', 'Totebags', 'Rompers']);
      }
    }

    fetchCategories();
  }, []);

  // Haal collecties op uit de database
  useEffect(() => {
    async function fetchCollections() {
      try {
        const collections = await getAllCollections();
        setAllCollections(collections);
      } catch (err) {
        console.error('Error fetching collections:', err);
      }
    }

    fetchCollections();
  }, []);

  // Toggle collectie selectie
  const toggleCollection = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  // Cleanup blob URLs bij unmount
  useEffect(() => {
    return () => {
      colors.forEach((color) => {
        color.previewUrls.forEach((url) => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      });
    };
  }, [colors]);

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


  // Kleuren beheer functies
  const addColor = () => {
    const newColor: ColorVariant = {
      id: Date.now().toString(),
      name: "",
      colorCode: "#000000", // Standaard zwart
      files: [],
      previewUrls: [],
      existingImages: [],
    };
    setColors((prev) => [...prev, newColor]);
  };

  const removeColor = (colorId: string) => {
    setColors((prev) => prev.filter((c) => c.id !== colorId));
  };

  // Kleurcode mapping voor standaard kleuren
  const getColorCodeFromName = (colorName: string): string => {
    const normalizedName = colorName.toLowerCase().trim();
    const colorMap: { [key: string]: string } = {
      'roze': '#FFC0CB',
      'pink': '#FFC0CB',
      'zwart': '#000000',
      'black': '#000000',
      'wit': '#FFFFFF',
      'white': '#FFFFFF',
      'rood': '#FF0000',
      'red': '#FF0000',
      'blauw': '#0000FF',
      'blue': '#0000FF',
      'groen': '#008000',
      'green': '#008000',
      'geel': '#FFFF00',
      'yellow': '#FFFF00',
      'oranje': '#FFA500',
      'orange': '#FFA500',
      'paars': '#800080',
      'purple': '#800080',
      'grijs': '#808080',
      'gray': '#808080',
      'grey': '#808080',
      'beige': '#F5F5DC',
      'bruin': '#A52A2A',
      'brown': '#A52A2A',
      'navy': '#000080',
      'turquoise': '#40E0D0',
      'turkoois': '#40E0D0',
      'lime': '#00FF00',
      'limegroen': '#00FF00',
      'magenta': '#FF00FF',
      'cyan': '#00FFFF',
      'zilver': '#C0C0C0',
      'silver': '#C0C0C0',
      'goud': '#FFD700',
      'gold': '#FFD700',
    };
    
    return colorMap[normalizedName] || '#000000';
  };

  const updateColorName = (colorId: string, name: string) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.id === colorId) {
          // Auto-detecteer kleurcode op basis van naam
          const autoColorCode = getColorCodeFromName(name);
          return { ...c, name, colorCode: autoColorCode };
        }
        return c;
      })
    );
  };

  const updateColorCode = (colorId: string, colorCode: string) => {
    setColors((prev) =>
      prev.map((c) => (c.id === colorId ? { ...c, colorCode } : c))
    );
  };

  const handleColorFileChange = (colorId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Valideer alle bestanden
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Alleen afbeeldingen zijn toegestaan");
        e.target.value = ""; // Reset input
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Afbeelding is te groot (max 5MB)");
        e.target.value = ""; // Reset input
        return;
      }
    }

    // Reset input direct om dubbele calls te voorkomen
    e.target.value = "";

    setColors((prev) => {
      return prev.map((c) => {
        if (c.id === colorId) {
          // Filter duplicaten op basis van naam, grootte en laatste wijzigingsdatum
          const existingFileKeys = new Set(
            c.files.map(f => `${f.name}-${f.size}-${f.lastModified}`)
          );
          const uniqueNewFiles = files.filter(
            file => !existingFileKeys.has(`${file.name}-${file.size}-${file.lastModified}`)
          );

          if (uniqueNewFiles.length === 0) {
            return c; // Geen nieuwe bestanden
          }

          // Genereer preview URLs direct met URL.createObjectURL (synchron)
          const newPreviewUrls = uniqueNewFiles.map(file => URL.createObjectURL(file));
          const newFiles = [...c.files, ...uniqueNewFiles];

          return {
            ...c,
            files: newFiles,
            previewUrls: [...c.previewUrls, ...newPreviewUrls],
          };
        }
        return c;
      });
    });
    setError("");
  };

  const removeColorImage = (colorId: string, index: number) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.id === colorId) {
          // Cleanup object URL als het een blob URL is
          const urlToRemove = c.previewUrls[index];
          if (urlToRemove && urlToRemove.startsWith('blob:')) {
            URL.revokeObjectURL(urlToRemove);
          }

          const isExisting = index < c.existingImages.length;
          if (isExisting) {
            // Verwijder uit bestaande afbeeldingen
            return {
              ...c,
              existingImages: c.existingImages.filter((_, i) => i !== index),
              previewUrls: c.previewUrls.filter((_, i) => i !== index),
            };
          } else {
            // Verwijder uit nieuwe bestanden
            const newFileIndex = index - c.existingImages.length;
            return {
              ...c,
              files: c.files.filter((_, i) => i !== newFileIndex),
              previewUrls: c.previewUrls.filter((_, i) => i !== index),
            };
          }
        }
        return c;
      })
    );
  };

  // Verplaats afbeelding omhoog in de lijst
  const moveImageUp = (colorId: string, index: number) => {
    if (index === 0) return; // Al op de eerste positie
    
    setColors((prev) =>
      prev.map((c) => {
        if (c.id === colorId) {
          const newPreviewUrls = [...c.previewUrls];
          const newExistingImages = [...c.existingImages];
          const newFiles = [...c.files];
          
          // Wissel met vorige afbeelding
          [newPreviewUrls[index - 1], newPreviewUrls[index]] = [newPreviewUrls[index], newPreviewUrls[index - 1]];
          
          // Update existingImages als beide bestaand zijn
          if (index < c.existingImages.length && index - 1 < c.existingImages.length) {
            [newExistingImages[index - 1], newExistingImages[index]] = [newExistingImages[index], newExistingImages[index - 1]];
          } else if (index < c.existingImages.length) {
            // Als huidige bestaand is maar vorige niet, verplaats bestaande naar nieuwe positie
            const existingImage = newExistingImages[index];
            newExistingImages.splice(index, 1);
            newExistingImages.splice(index - 1, 0, existingImage);
          } else if (index - 1 < c.existingImages.length) {
            // Als vorige bestaand is maar huidige niet, verplaats bestaande naar nieuwe positie
            const existingImage = newExistingImages[index - 1];
            newExistingImages.splice(index - 1, 1);
            newExistingImages.splice(index, 0, existingImage);
          }
          
          // Update files als beide nieuw zijn
          const newFileIndex = index - c.existingImages.length;
          const prevFileIndex = index - 1 - c.existingImages.length;
          if (newFileIndex >= 0 && prevFileIndex >= 0) {
            [newFiles[prevFileIndex], newFiles[newFileIndex]] = [newFiles[newFileIndex], newFiles[prevFileIndex]];
          } else if (newFileIndex >= 0) {
            // Huidige is nieuw, vorige is bestaand - verplaats file
            const file = newFiles[newFileIndex];
            newFiles.splice(newFileIndex, 1);
            newFiles.splice(prevFileIndex, 0, file);
          } else if (prevFileIndex >= 0) {
            // Vorige is nieuw, huidige is bestaand - verplaats file
            const file = newFiles[prevFileIndex];
            newFiles.splice(prevFileIndex, 1);
            newFiles.splice(newFileIndex, 0, file);
          }
          
          return {
            ...c,
            previewUrls: newPreviewUrls,
            existingImages: newExistingImages,
            files: newFiles,
          };
        }
        return c;
      })
    );
  };

  // Verplaats afbeelding omlaag in de lijst
  const moveImageDown = (colorId: string, index: number) => {
    setColors((prev) =>
      prev.map((c) => {
        if (c.id === colorId && index < c.previewUrls.length - 1) {
          const newPreviewUrls = [...c.previewUrls];
          const newExistingImages = [...c.existingImages];
          const newFiles = [...c.files];
          
          // Wissel met volgende afbeelding
          [newPreviewUrls[index], newPreviewUrls[index + 1]] = [newPreviewUrls[index + 1], newPreviewUrls[index]];
          
          // Update existingImages als beide bestaand zijn
          if (index < c.existingImages.length && index + 1 < c.existingImages.length) {
            [newExistingImages[index], newExistingImages[index + 1]] = [newExistingImages[index + 1], newExistingImages[index]];
          } else if (index < c.existingImages.length) {
            // Als huidige bestaand is maar volgende niet, verplaats bestaande naar nieuwe positie
            const existingImage = newExistingImages[index];
            newExistingImages.splice(index, 1);
            newExistingImages.splice(index + 1, 0, existingImage);
          } else if (index + 1 < c.existingImages.length) {
            // Als volgende bestaand is maar huidige niet, verplaats bestaande naar nieuwe positie
            const existingImage = newExistingImages[index + 1];
            newExistingImages.splice(index + 1, 1);
            newExistingImages.splice(index, 0, existingImage);
          }
          
          // Update files als beide nieuw zijn
          const newFileIndex = index - c.existingImages.length;
          const nextFileIndex = index + 1 - c.existingImages.length;
          if (newFileIndex >= 0 && nextFileIndex >= 0) {
            [newFiles[newFileIndex], newFiles[nextFileIndex]] = [newFiles[nextFileIndex], newFiles[newFileIndex]];
          } else if (newFileIndex >= 0) {
            // Huidige is nieuw, volgende is bestaand - verplaats file
            const file = newFiles[newFileIndex];
            newFiles.splice(newFileIndex, 1);
            newFiles.splice(nextFileIndex, 0, file);
          } else if (nextFileIndex >= 0) {
            // Volgende is nieuw, huidige is bestaand - verplaats file
            const file = newFiles[nextFileIndex];
            newFiles.splice(nextFileIndex, 1);
            newFiles.splice(newFileIndex, 0, file);
          }
          
          return {
            ...c,
            previewUrls: newPreviewUrls,
            existingImages: newExistingImages,
            files: newFiles,
          };
        }
        return c;
      })
    );
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    // Dedupliceer bestanden op basis van naam, grootte en lastModified
    const uniqueFiles = files.filter((file, index, self) => {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
      return index === self.findIndex(f => `${f.name}-${f.size}-${f.lastModified}` === fileKey);
    });

    try {
      const uploadPromises = uniqueFiles.map(async (file) => {
        // Genereer unieke bestandsnaam met timestamp en random string
        const fileExt = file.name.split(".").pop();
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const fileName = `${timestamp}-${random}.${fileExt}`;
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
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Voorkom dubbele submissions
    if (saving || uploading || isSubmittingRef.current) {
      return;
    }
    
    isSubmittingRef.current = true;
    setError("");

    // Validatie
    if (!formData.name || !formData.price || !formData.category) {
      setError("Naam, prijs en categorie zijn verplicht");
      isSubmittingRef.current = false;
      return;
    }

    // Valideer dat er minstens één kleur is
    if (colors.length === 0) {
      setError("Je moet minstens één kleur toevoegen");
      isSubmittingRef.current = false;
      return;
    }

    // Valideer dat alle kleuren een naam hebben
    const invalidColors = colors.filter((c) => !c.name.trim());
    if (invalidColors.length > 0) {
      setError("Alle kleuren moeten een naam hebben");
      isSubmittingRef.current = false;
      return;
    }

    // Valideer dat alle kleuren minstens één afbeelding hebben (bestaand of nieuw)
    const colorsWithoutImages = colors.filter((c) => c.existingImages.length === 0 && c.files.length === 0);
    if (colorsWithoutImages.length > 0) {
      setError("Alle kleuren moeten minstens één afbeelding hebben");
      isSubmittingRef.current = false;
      return;
    }

    try {
      setSaving(true);
      setUploading(true);

      // Upload afbeeldingen per kleur
      const colorsData: Array<{ name: string; colorCode: string; images: string[] }> = [];
      const uploadedFileKeys = new Set<string>(); // Track geüploade bestanden om dubbele uploads te voorkomen
      
      for (const color of colors) {
        // Combineer bestaande en nieuwe afbeeldingen voor deze kleur
        const colorAllImages = [...color.existingImages];
        
        if (color.files.length > 0) {
          try {
            // Filter duplicaten voordat we uploaden (op basis van naam, grootte en lastModified)
            const uniqueFiles = color.files.filter((file, index, self) => {
              const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
              // Check of dit bestand al is geüpload in een eerdere iteratie
              if (uploadedFileKeys.has(fileKey)) {
                return false;
              }
              // Check of dit bestand al in de huidige lijst voorkomt
              return index === self.findIndex(f => `${f.name}-${f.size}-${f.lastModified}` === fileKey);
            });
            
            // Markeer bestanden als geüpload
            uniqueFiles.forEach(file => {
              uploadedFileKeys.add(`${file.name}-${file.size}-${file.lastModified}`);
            });
            
            const colorImageUrls = await uploadImages(uniqueFiles);
            colorAllImages.push(...colorImageUrls);
          } catch (err) {
            setError(`Fout bij het uploaden van afbeeldingen voor kleur "${color.name}"`);
            setSaving(false);
            setUploading(false);
            isSubmittingRef.current = false;
            return;
          }
        }

        if (color.name.trim()) {
          colorsData.push({
            name: color.name.trim(),
            colorCode: color.colorCode || "#000000",
            images: colorAllImages,
          });
        }
      }

      // Bepaal hoofdafbeelding (eerste image van eerste kleur)
      let mainImageUrl: string | null = null;
      if (colorsData.length > 0 && colorsData[0].images.length > 0) {
        mainImageUrl = colorsData[0].images[0];
      }

      // Combineer alle images voor backward compatibility
      const allProductImages: string[] = [];
      colorsData.forEach((color) => {
        allProductImages.push(...color.images);
      });

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          stock: parseInt(formData.stock) || 0,
          image_url: mainImageUrl,
          images: allProductImages.length > 0 ? allProductImages : null,
          colors: colorsData.length > 0 ? colorsData : null,
          sizes: selectedSizes.length > 0 ? selectedSizes : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);

      if (updateError) {
        console.error("Error updating product:", updateError);
        setError("Fout bij het opslaan van het product");
      } else {
        // Update collecties voor dit product
        try {
          await updateProductCollections(productId, selectedCollections);
        } catch (err) {
          console.error("Error updating product collections:", err);
          // Niet fatal, product is al opgeslagen
        }
        router.push("/admin/products");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Er is een fout opgetreden");
    } finally {
      setSaving(false);
      setUploading(false);
      isSubmittingRef.current = false;
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

                {/* Maten */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-black mb-2">
                    Beschikbare Maten
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Selecteer de maten die beschikbaar zijn voor dit product. Laat leeg voor producten zonder maten (bijv. totebags).
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((size) => (
                      <label
                        key={size}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => toggleSize(size)}
                          className="w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black text-black"
                        />
                        <span className="text-gray-700 group-hover:text-black font-medium text-sm">
                          {size}
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedSizes.length === 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      Geen maten geselecteerd - dit product heeft geen maten (bijv. totebags)
                    </p>
                  )}
                </div>

                {/* Collecties */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-black mb-2">
                    Collecties
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Selecteer de collecties waar dit product in moet verschijnen. Een product kan in meerdere collecties zitten.
                  </p>
                  {allCollections.length === 0 ? (
                    <p className="text-xs text-gray-400 mb-2">
                      Geen collecties beschikbaar. <Link href="/admin/collections/new" className="text-black hover:underline">Maak eerst een collectie aan</Link>.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {allCollections.map((collection) => (
                        <label
                          key={collection.id}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCollections.includes(collection.id)}
                            onChange={() => toggleCollection(collection.id)}
                            className="w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black text-black"
                          />
                          <span className="text-gray-700 group-hover:text-black font-medium text-sm">
                            {collection.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  {selectedCollections.length === 0 && allCollections.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      Geen collecties geselecteerd
                    </p>
                  )}
                </div>

                {/* Kleuren met per-kleur afbeeldingen */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-black">
                      Product Kleuren
                    </label>
                    <button
                      type="button"
                      onClick={addColor}
                      className="text-sm bg-gray-100 text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      + Kleur toevoegen
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Voeg kleuren toe en upload per kleur specifieke afbeeldingen. Elke kleur moet minstens één afbeelding hebben.
                  </p>

                  {colors.length === 0 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                      <p className="text-sm">Nog geen kleuren toegevoegd</p>
                      <p className="text-xs mt-1">Klik op "Kleur toevoegen" om te beginnen</p>
                    </div>
                  )}

                  {colors.map((color) => (
                    <div key={color.id} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        {/* Kleur bolletje */}
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                            style={{ backgroundColor: color.colorCode }}
                          />
                          <input
                            type="color"
                            value={color.colorCode}
                            onChange={(e) => updateColorCode(color.id, e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                            title="Selecteer kleur"
                          />
                        </div>
                        <input
                          type="text"
                          value={color.name}
                          onChange={(e) => updateColorName(color.id, e.target.value)}
                          placeholder="Kleurnaam (bijv. Zwart, Wit, Rood)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeColor(color.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Verwijderen
                        </button>
                      </div>

                      {/* Preview Grid voor deze kleur */}
                      {color.previewUrls.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mb-3">
                          {color.previewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`${color.name} preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                              {/* Verwijder knop */}
                              <button
                                type="button"
                                onClick={() => removeColorImage(color.id, index)}
                                className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-700 text-xs z-10"
                                title="Verwijderen"
                              >
                                ×
                              </button>
                              {/* Bestaand label */}
                              {index < color.existingImages.length && (
                                <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                                  Bestaand
                                </div>
                              )}
                              {/* Volgorde knoppen */}
                              <div className="absolute left-1 top-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                  type="button"
                                  onClick={() => moveImageUp(color.id, index)}
                                  disabled={index === 0}
                                  className={`bg-black bg-opacity-70 text-white w-6 h-6 rounded flex items-center justify-center hover:bg-opacity-90 transition-all ${
                                    index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  title="Verplaats omhoog"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveImageDown(color.id, index)}
                                  disabled={index === color.previewUrls.length - 1}
                                  className={`bg-black bg-opacity-70 text-white w-6 h-6 rounded flex items-center justify-center hover:bg-opacity-90 transition-all ${
                                    index === color.previewUrls.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  title="Verplaats omlaag"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Upload Zone voor deze kleur */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-black transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleColorFileChange(color.id, e)}
                          className="hidden"
                          id={`color-upload-${color.id}`}
                        />
                        <label
                          htmlFor={`color-upload-${color.id}`}
                          className="cursor-pointer"
                        >
                          <div>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg
                                className="w-6 h-6 text-gray-400"
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
                            <p className="text-xs font-medium text-black mb-1">
                              {color.previewUrls.length > 0 ? "Meer afbeeldingen toevoegen" : "Afbeeldingen voor deze kleur"}
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF tot 5MB
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actieknoppen */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Afbeeldingen uploaden..." : saving ? "Opslaan..." : "Wijzigingen Opslaan"}
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

