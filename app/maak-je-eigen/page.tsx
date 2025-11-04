"use client";

import { useState, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

const GRID_SIZE = 20; // 20x20 grid voor positioning

export default function MaakJeEigenProduct() {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("t-shirt");
  const [selectedColor, setSelectedColor] = useState<ProductColor>(colors["t-shirt"][0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState(100); // percentage - 100% = 9x9 grid cellen
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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

  const handleGridClick = (x: number, y: number) => {
    if (uploadedImage) {
      setImagePosition({ x, y });
    }
  };

  const getGridPosition = useCallback((clientX: number, clientY: number) => {
    if (!previewRef.current) return { x: 0, y: 0 };
    const rect = previewRef.current.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / (rect.width / GRID_SIZE));
    const y = Math.floor((clientY - rect.top) / (rect.height / GRID_SIZE));
    return { x, y };
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!uploadedImage || !previewRef.current) return;
    
    const { x, y } = getGridPosition(clientX, clientY);
    setIsDragging(true);
    setDragStart({ x: x - imagePosition.x, y: y - imagePosition.y });
  }, [uploadedImage, imagePosition, getGridPosition]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !uploadedImage || !previewRef.current) return;
    
    const { x, y } = getGridPosition(clientX, clientY);
    const newX = Math.max(0, Math.min(GRID_SIZE - 1, x - dragStart.x));
    const newY = Math.max(0, Math.min(GRID_SIZE - 1, y - dragStart.y));
    
    setImagePosition({ x: newX, y: newY });
  }, [isDragging, uploadedImage, dragStart, getGridPosition]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
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
    setImageSize(Math.max(10, Math.min(200, newSize)));
  };

  const snapToGrid = (value: number) => {
    return Math.round(value / (100 / GRID_SIZE)) * (100 / GRID_SIZE);
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
                    className="absolute border-2 border-dashed border-blue-500"
                    style={{
                      left: `${(imagePosition.x / GRID_SIZE) * 100}%`,
                      top: `${(imagePosition.y / GRID_SIZE) * 100}%`,
                      width: `${(imageSize / 100) * (9 / GRID_SIZE) * 100}%`,
                      height: `${(imageSize / 100) * (9 / GRID_SIZE) * 100}%`,
                      cursor: isDragging ? "grabbing" : "grab",
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

                {/* Grid Overlay (for positioning) */}
                {uploadedImage && (
                  <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-10">
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                      const x = i % GRID_SIZE;
                      const y = Math.floor(i / GRID_SIZE);
                      return (
                        <div
                          key={i}
                          className="border border-gray-300"
                          onClick={() => handleGridClick(x, y)}
                        />
                      );
                    })}
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
                    max="200"
                    value={imageSize}
                    onChange={(e) => handleSizeChange(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Toevoegen aan winkelwagen
              </button>
              <button className="w-full py-3 border-2 border-black text-black rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Opslaan als concept
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
                        max="200"
                        value={imageSize}
                        onChange={(e) => handleSizeChange(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                      Toevoegen aan winkelwagen
                    </button>
                    <button className="w-full py-3 border-2 border-black text-black rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      Opslaan als concept
                    </button>
                  </div>
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
                        className="absolute border-2 border-dashed border-blue-500"
                        style={{
                          left: `${(imagePosition.x / GRID_SIZE) * 100}%`,
                          top: `${(imagePosition.y / GRID_SIZE) * 100}%`,
                          width: `${(imageSize / 100) * (9 / GRID_SIZE) * 100}%`,
                          height: `${(imageSize / 100) * (9 / GRID_SIZE) * 100}%`,
                          cursor: isDragging ? "grabbing" : "grab",
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

                    {/* Grid Overlay (for positioning) */}
                    {uploadedImage && (
                      <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-10">
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                          const x = i % GRID_SIZE;
                          const y = Math.floor(i / GRID_SIZE);
                          return (
                            <div
                              key={i}
                              className="border border-gray-300"
                              onClick={() => handleGridClick(x, y)}
                            />
                          );
                    })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

