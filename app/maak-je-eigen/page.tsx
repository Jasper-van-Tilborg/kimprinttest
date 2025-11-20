"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../../contexts/CartContext";

type ProductType = "t-shirt" | "hoodie";
type ProductColor = {
  name: string;
  value: string;
  image: string;
};

const productTypes: { type: ProductType; name: string }[] = [
  { type: "t-shirt", name: "T-shirt" },
  { type: "hoodie", name: "Hoodie" },
];

const colors: Record<ProductType, ProductColor[]> = {
  "t-shirt": [
    { name: "Zwart", value: "#000000", image: "/images/tshirt.png" },
    { name: "Wit", value: "#FFFFFF", image: "/images/wittshirt.png" },
    { name: "Grijs", value: "#808080", image: "/images/tshirt.png" },
    { name: "Navy", value: "#1a1a2e", image: "/images/tshirt.png" },
  ],
  "hoodie": [
    { name: "Zwart", value: "#000000", image: "/images/tshirt.png" },
    { name: "Wit", value: "#FFFFFF", image: "/images/wittshirt.png" },
    { name: "Grijs", value: "#808080", image: "/images/tshirt.png" },
    { name: "Navy", value: "#1a1a2e", image: "/images/tshirt.png" },
  ],
};

// Prijzen voor custom producten
const BASE_PRICES: Record<ProductType, number> = {
  "t-shirt": 29.99,
  "hoodie": 49.99,
};

const SIZES = ["XS", "S", "M", "L", "XL"];

type CustomProductDraft = {
  productType: ProductType;
  color: ProductColor;
  size: string;
  uploadedImage: string | null;
  imagePosition: { x: number; y: number };
  imageSize: number;
  createdAt: string;
};

export default function MaakJeEigenProduct() {
  const { addItem, openCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("t-shirt");
  const [selectedColor, setSelectedColor] = useState<ProductColor>(colors["t-shirt"][0]);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 }); // percentage-based (50% = center)
  const [imageSize, setImageSize] = useState(100); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSnapped, setIsSnapped] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<CustomProductDraft[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleProductChange = (productType: ProductType) => {
    setSelectedProduct(productType);
    setSelectedColor(colors[productType][0]);
  };

  const handleColorChange = (color: ProductColor) => {
    setSelectedColor(color);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Converteer pixel positie naar percentage binnen het product gebied
  const getPositionFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!previewRef.current) return { x: 50, y: 50 };
    const rect = previewRef.current.getBoundingClientRect();
    
    // Product gebied is 75% van de container, gecentreerd
    const productAreaWidth = rect.width * 0.75;
    const productAreaHeight = rect.height * 0.75;
    const productAreaX = rect.left + (rect.width - productAreaWidth) / 2;
    const productAreaY = rect.top + (rect.height - productAreaHeight) / 2;
    
    // Bereken relatieve positie binnen product gebied
    const relativeX = ((clientX - productAreaX) / productAreaWidth) * 100;
    const relativeY = ((clientY - productAreaY) / productAreaHeight) * 100;
    
    return { x: relativeX, y: relativeY };
  }, []);

  // Snap naar center als dichtbij (binnen 5% van het midden)
  const snapToCenter = useCallback((x: number, y: number) => {
    const SNAP_THRESHOLD = 5; // 5% threshold
    const centerX = 50;
    const centerY = 50;
    
    if (Math.abs(x - centerX) < SNAP_THRESHOLD && Math.abs(y - centerY) < SNAP_THRESHOLD) {
      setIsSnapped(true);
      return { x: centerX, y: centerY };
    }
    setIsSnapped(false);
    return { x, y };
  }, []);

  // Beperk positie binnen product grenzen (rekening houdend met image grootte)
  const constrainPosition = useCallback((x: number, y: number, size: number) => {
    // Image grootte in percentage van product gebied (75% is de product area)
    // Schaal aangepast: wat 25% was is nu 100%, dus vermenigvuldigen met 0.25
    const imageSizePercent = (size / 100) * 75 * 0.25;
    
    // Min en max posities zodat image binnen product blijft
    // Image is gecentreerd, dus we moeten de helft van de grootte aftrekken
    const halfSize = imageSizePercent / 2;
    const minX = halfSize;
    const maxX = 100 - halfSize;
    const minY = halfSize;
    const maxY = 100 - halfSize;
    
    const constrainedX = Math.max(minX, Math.min(maxX, x));
    const constrainedY = Math.max(minY, Math.min(maxY, y));
    
    return { x: constrainedX, y: constrainedY };
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!uploadedImage || !previewRef.current) return;
    
    const position = getPositionFromEvent(clientX, clientY);
    setIsDragging(true);
    // Sla offset op voor smooth dragging
    setDragStart({ 
      x: position.x - imagePosition.x, 
      y: position.y - imagePosition.y 
    });
  }, [uploadedImage, imagePosition, getPositionFromEvent]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !uploadedImage || !previewRef.current) return;
    
    const position = getPositionFromEvent(clientX, clientY);
    // Bereken nieuwe positie met offset
    let newX = position.x - dragStart.x;
    let newY = position.y - dragStart.y;
    
    // Beperk binnen grenzen
    const constrained = constrainPosition(newX, newY, imageSize);
    newX = constrained.x;
    newY = constrained.y;
    
    // Snap naar center als dichtbij
    const snapped = snapToCenter(newX, newY);
    
    setImagePosition(snapped);
  }, [isDragging, uploadedImage, dragStart, getPositionFromEvent, constrainPosition, snapToCenter, imageSize]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    // Reset snap indicator na korte delay
    setTimeout(() => setIsSnapped(false), 200);
  }, []);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleSizeChange = (newSize: number) => {
    const constrainedSize = Math.max(10, Math.min(100, newSize));
    setImageSize(constrainedSize);
    
    // Pas positie aan als image te groot wordt voor huidige positie
    if (uploadedImage) {
      const constrained = constrainPosition(imagePosition.x, imagePosition.y, constrainedSize);
      if (constrained.x !== imagePosition.x || constrained.y !== imagePosition.y) {
        setImagePosition(constrained);
      }
    }
  };


  // Laad opgeslagen concepten bij mount
  useEffect(() => {
    const saved = localStorage.getItem("custom-product-drafts");
    if (saved) {
      try {
        setSavedDrafts(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading drafts:", e);
      }
    }

    // Luister naar loadDraft event vanuit account dashboard
    const handleLoadDraft = (event: CustomEvent<CustomProductDraft>) => {
      const draft = event.detail;
      setSelectedProduct(draft.productType);
      setSelectedColor(draft.color);
      setSelectedSize(draft.size);
      setUploadedImage(draft.uploadedImage);
      setImagePosition(draft.imagePosition);
      setImageSize(draft.imageSize);
    };

    window.addEventListener("loadDraft" as any, handleLoadDraft as EventListener);
    return () => {
      window.removeEventListener("loadDraft" as any, handleLoadDraft as EventListener);
    };
  }, []);

  // Genereer preview afbeelding met canvas
  const generatePreview = useCallback(async (): Promise<string | null> => {
    if (!uploadedImage || !previewRef.current) return null;

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      // Stel canvas grootte in
      canvas.width = 800;
      canvas.height = 800;

      // Laad product template
      const productImg = new Image();
      productImg.crossOrigin = "anonymous";
      productImg.onload = () => {
        // Teken product template
        const productSize = canvas.width * 0.75;
        const productX = (canvas.width - productSize) / 2;
        const productY = (canvas.height - productSize) / 2;
        ctx.drawImage(productImg, productX, productY, productSize, productSize);

        // Kleur overlay (als niet wit)
        if (selectedColor.value !== "#FFFFFF") {
          ctx.fillStyle = selectedColor.value;
          ctx.globalAlpha = 0.4;
          ctx.globalCompositeOperation = "multiply";
          ctx.fillRect(productX, productY, productSize, productSize);
          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = "source-over";
        }

        // Laad en teken geüploade afbeelding
        const uploadedImg = new Image();
        uploadedImg.crossOrigin = "anonymous";
        uploadedImg.onload = () => {
          // Schaal aangepast: wat 25% was is nu 100%, dus vermenigvuldigen met 0.25
          const imgWidth = (productSize * imageSize * 0.25) / 100;
          const imgHeight = (productSize * imageSize * 0.25) / 100;
          // Position is nu in percentage (0-100), center is 50%
          const imgX = productX + (productSize * imagePosition.x) / 100 - imgWidth / 2;
          const imgY = productY + (productSize * imagePosition.y) / 100 - imgHeight / 2;

          ctx.drawImage(uploadedImg, imgX, imgY, imgWidth, imgHeight);
          resolve(canvas.toDataURL("image/png"));
        };
        uploadedImg.onerror = () => resolve(null);
        uploadedImg.src = uploadedImage;
      };
      productImg.onerror = () => resolve(null);
      productImg.src = selectedColor.image;
    });
  }, [uploadedImage, selectedColor, imagePosition, imageSize]);

  // Bereken prijs
  const calculatePrice = (): number => {
    return BASE_PRICES[selectedProduct];
  };

  // Sla concept op
  const handleSaveDraft = async () => {
    if (!uploadedImage) {
      alert("Upload eerst een foto om op te slaan als concept.");
      return;
    }

    setIsSaving(true);
    try {
      const draft: CustomProductDraft = {
        productType: selectedProduct,
        color: selectedColor,
        size: selectedSize,
        uploadedImage,
        imagePosition,
        imageSize,
        createdAt: new Date().toISOString(),
      };

      const updatedDrafts = [...savedDrafts, draft];
      setSavedDrafts(updatedDrafts);
      localStorage.setItem("custom-product-drafts", JSON.stringify(updatedDrafts));

      setSuccessMessage("Concept opgeslagen!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Fout bij het opslaan van het concept.");
    } finally {
      setIsSaving(false);
    }
  };

  // Laad concept
  const handleLoadDraft = (draft: CustomProductDraft) => {
    setSelectedProduct(draft.productType);
    setSelectedColor(draft.color);
    setSelectedSize(draft.size);
    setUploadedImage(draft.uploadedImage);
    setImagePosition(draft.imagePosition);
    setImageSize(draft.imageSize);
  };

  // Verwijder concept
  const handleDeleteDraft = (index: number) => {
    const updatedDrafts = savedDrafts.filter((_, i) => i !== index);
    setSavedDrafts(updatedDrafts);
    localStorage.setItem("custom-product-drafts", JSON.stringify(updatedDrafts));
  };

  // Voeg toe aan winkelwagen
  const handleAddToCart = async () => {
    if (!uploadedImage) {
      alert("Upload eerst een foto om toe te voegen aan de winkelwagen.");
      return;
    }

    setIsAdding(true);
    try {
      const preview = await generatePreview();
      const productName = `Custom ${productTypes.find((t) => t.type === selectedProduct)?.name || "Product"}`;
      const uniqueId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      addItem({
        id: uniqueId,
        name: productName,
        price: calculatePrice(),
        image_url: preview || undefined,
        color: selectedColor.name,
        size: selectedSize,
        quantity: 1,
      });

      setSuccessMessage("Toegevoegd aan winkelwagen!");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        openCart();
      }, 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Fout bij het toevoegen aan de winkelwagen.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar activePage="maak-je-eigen" />

      {/* Customizer Section */}
      <section className="py-6 md:py-12 bg-[#FAFAFA]">
        <div className="grid-12">
          {/* Mobile Layout */}
          <div className="md:hidden col-12">
            {/* Product Type Selector */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-3">Product Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {productTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => handleProductChange(type.type)}
                    className={`py-3 px-4 rounded-lg border-2 transition-all font-medium text-sm ${
                      selectedProduct === type.type
                        ? "border-[#8B4513] bg-[#8B4513] text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-3">Kleur</h3>
              <div className="grid grid-cols-4 gap-3">
                {colors[selectedProduct].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorChange(color)}
                    className={`relative aspect-square rounded-lg border-2 transition-all ${
                      selectedColor.name === color.name
                        ? "border-[#8B4513] ring-2 ring-[#8B4513]"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {selectedColor.name === color.name && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-3">Maat</h3>
              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-2 rounded-lg text-sm font-medium transition-colors border ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-transparent text-black border-black hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-3">Upload Foto</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#8B4513] transition-colors text-gray-600 font-medium"
              >
                {uploadedImage ? "Foto wijzigen" : "+ Foto uploaden"}
              </button>
              {uploadedImage && (
                <div className="mt-3 text-xs text-gray-500">
                  Foto geüpload. Sleep naar positie op product.
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <h3 className="text-base font-bold text-gray-900 mb-3">Preview</h3>
              <div
                ref={previewRef}
                className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-move touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Product Template */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-3/4 h-3/4" style={{ minHeight: '200px' }}>
                    <img
                      src={selectedColor.image}
                      alt={selectedProduct}
                      className="w-full h-full object-contain"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                    {/* Color overlay for different colors (not for white) */}
                    {selectedColor.value !== "#FFFFFF" && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ 
                          backgroundColor: selectedColor.value, 
                          mixBlendMode: "multiply",
                          opacity: 0.4
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Uploaded Image */}
                {uploadedImage && (
                  <div
                    className="absolute border-2 border-dashed transition-all duration-150"
                    style={{
                      left: `${12.5 + (imagePosition.x / 100) * 75}%`, // 12.5% offset + position within 75% product area
                      top: `${12.5 + (imagePosition.y / 100) * 75}%`,
                      width: `${(imageSize / 100) * 75 * 0.25}%`, // Schaal aangepast: wat 25% was is nu 100%
                      height: `${(imageSize / 100) * 75 * 0.25}%`,
                      transform: 'translate(-50%, -50%)', // Center the image on the position
                      cursor: isDragging ? "grabbing" : "grab",
                      borderColor: isSnapped ? '#10b981' : '#3b82f6', // Green when snapped, blue otherwise
                    }}
                  >
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                )}
              </div>

              {/* Image Size Control */}
              {uploadedImage && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grootte: {imageSize}%
                  </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={imageSize}
                      onChange={(e) => handleSizeChange(Number(e.target.value))}
                      className="w-full"
                    />
                </div>
              )}
            </div>

            {/* Price Display */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">Prijs</span>
                <span className="text-2xl font-bold text-gray-900">€ {calculatePrice().toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || !uploadedImage}
                className={`w-full py-3 bg-black text-white rounded-lg font-medium transition-colors ${
                  isAdding || !uploadedImage
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-800"
                }`}
              >
                {isAdding ? "Toevoegen..." : "Toevoegen aan winkelwagen"}
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={isSaving || !uploadedImage}
                className={`w-full py-3 border-2 border-black text-black rounded-lg font-medium transition-colors ${
                  isSaving || !uploadedImage
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                {isSaving ? "Opslaan..." : "Opslaan als concept"}
              </button>
            </div>

          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block col-12">
            <div className="grid-12">
              {/* Left Sidebar - Controls */}
              <div className="col-4">
                <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
                  {/* Product Type Selector */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Product Type</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {productTypes.map((type) => (
                        <button
                          key={type.type}
                          onClick={() => handleProductChange(type.type)}
                          className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                            selectedProduct === type.type
                              ? "border-[#8B4513] bg-[#8B4513] text-white"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Kleur</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {colors[selectedProduct].map((color) => (
                        <button
                          key={color.name}
                          onClick={() => handleColorChange(color)}
                          className={`relative aspect-square rounded-lg border-2 transition-all ${
                            selectedColor.name === color.name
                              ? "border-[#8B4513] ring-2 ring-[#8B4513]"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: color.value }}
                        >
                          {selectedColor.name === color.name && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-5 h-5 bg-white rounded-full"></div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Maat</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-3 px-4 rounded-lg text-base font-medium transition-colors border ${
                            selectedSize === size
                              ? "bg-black text-white border-black"
                              : "bg-transparent text-black border-black hover:bg-gray-50"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Foto</h3>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#8B4513] transition-colors text-gray-600 font-medium"
                    >
                      {uploadedImage ? "Foto wijzigen" : "+ Foto uploaden"}
                    </button>
                    {uploadedImage && (
                      <div className="mt-3 text-sm text-gray-500">
                        Foto geüpload. Sleep naar positie op product.
                      </div>
                    )}
                  </div>

                  {/* Image Size Control */}
                  {uploadedImage && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grootte: {imageSize}%
                      </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={imageSize}
                      onChange={(e) => handleSizeChange(Number(e.target.value))}
                      className="w-full"
                    />
                    </div>
                  )}

                  {/* Price Display */}
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900">Prijs</span>
                        <span className="text-2xl font-bold text-gray-900">€ {calculatePrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding || !uploadedImage}
                      className={`w-full py-3 bg-black text-white rounded-lg font-medium transition-colors ${
                        isAdding || !uploadedImage
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-800"
                      }`}
                    >
                      {isAdding ? "Toevoegen..." : "Toevoegen aan winkelwagen"}
                    </button>
                    <button
                      onClick={handleSaveDraft}
                      disabled={isSaving || !uploadedImage}
                      className={`w-full py-3 border-2 border-black text-black rounded-lg font-medium transition-colors ${
                        isSaving || !uploadedImage
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {isSaving ? "Opslaan..." : "Opslaan als concept"}
                    </button>
                  </div>

                  {/* Saved Drafts */}
                  {savedDrafts.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Opgeslagen concepten</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {savedDrafts.map((draft, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {productTypes.find((t) => t.type === draft.productType)?.name} - {draft.color.name} - {draft.size}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(draft.createdAt).toLocaleDateString("nl-NL")}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleLoadDraft(draft)}
                                className="px-3 py-1 text-xs bg-[#8B4513] text-white rounded hover:bg-[#6B3410] transition-colors"
                              >
                                Laad
                              </button>
                              <button
                                onClick={() => handleDeleteDraft(index)}
                                className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              >
                                Verwijder
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Preview */}
              <div className="col-8">
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Preview</h3>
                  <div
                    ref={previewRef}
                    className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-move touch-none"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Product Template */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-3/4 h-3/4" style={{ minHeight: '200px' }}>
                        <img
                          src={selectedColor.image}
                          alt={selectedProduct}
                          className="w-full h-full object-contain"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                        {/* Color overlay for different colors (not for white) */}
                        {selectedColor.value !== "#FFFFFF" && (
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ 
                              backgroundColor: selectedColor.value, 
                              mixBlendMode: "multiply",
                              opacity: 0.4
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Uploaded Image */}
                    {uploadedImage && (
                      <div
                        className="absolute border-2 border-dashed transition-all duration-150"
                        style={{
                          left: `${12.5 + (imagePosition.x / 100) * 75}%`, // 12.5% offset + position within 75% product area
                          top: `${12.5 + (imagePosition.y / 100) * 75}%`,
                          width: `${(imageSize / 100) * 75 * 0.25}%`, // Schaal aangepast: wat 25% was is nu 100%
                          height: `${(imageSize / 100) * 75 * 0.25}%`,
                          transform: 'translate(-50%, -50%)', // Center the image on the position
                          cursor: isDragging ? "grabbing" : "grab",
                          borderColor: isSnapped ? '#10b981' : '#3b82f6', // Green when snapped, blue otherwise
                        }}
                      >
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="w-full h-full object-contain"
                          draggable={false}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-[fadeIn_0.3s_ease-in-out]">
          {successMessage}
        </div>
      )}

      <Footer />
    </div>
  );
}

