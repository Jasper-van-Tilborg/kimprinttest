'use client';

import { useState, useEffect, useRef } from 'react';
import { Product, Category, ProductImage } from '../../lib/database';

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSave: (productData: Partial<Product>) => void;
  onCancel: () => void;
  onCategoryAdded?: (category: Category) => void;
}

export default function ProductForm({ product, categories, onSave, onCancel, onCategoryAdded: _onCategoryAdded }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compare_price: '',
    sku: '',
    quantity: '',
    weight: '',
    category_id: '',
    is_active: true,
    track_quantity: true,
    requires_shipping: true,
    taxable: true,
    is_digital: false,
    is_temporary_offer: false,
  });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Shopify-achtige zijbalk velden (lokaal, optioneel)
  const [publicationChannels, setPublicationChannels] = useState({ webshop: true, shop: false, pos: false });
  const [productType, setProductType] = useState('');
  const [vendor, setVendor] = useState('');
  const [collections, setCollections] = useState('');
  const [tags, setTags] = useState('');
  const [themeTemplate, setThemeTemplate] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        compare_price: product.compare_price?.toString() || '',
        sku: product.sku || '',
        quantity: product.quantity?.toString() || '',
        weight: product.weight?.toString() || '',
        category_id: product.category_id || '',
        is_active: product.is_active ?? true,
        track_quantity: product.track_quantity ?? true,
        requires_shipping: product.requires_shipping ?? true,
        taxable: product.taxable ?? true,
        is_digital: product.is_digital ?? false,
        is_temporary_offer: product.is_temporary_offer ?? false,
      });
      setImages(product.images || []);
    }
  }, [product]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const validateAll = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) newErrors.name = 'Productnaam is verplicht';
    if (!formData.category_id) newErrors.category_id = 'Categorie is verplicht';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Prijs moet groter zijn dan 0';
    if (formData.track_quantity && (formData.quantity === '' || parseInt(formData.quantity) < 0)) newErrors.quantity = 'Voorraad moet 0 of hoger zijn';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addImage = () => {
    const url = prompt('Voer de afbeelding URL in:');
    if (url) {
      const newImage: ProductImage = {
        id: Date.now().toString(),
        url: url.trim(),
        alt_text: '',
        sort_order: images.length,
        is_primary: images.length === 0
      };
      setImages([...images, newImage]);
    }
  };

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    if (updatedImages.length > 0 && images.find(img => img.id === imageId)?.is_primary) {
      updatedImages[0].is_primary = true;
    }
    setImages(updatedImages);
  };

  const setPrimaryImage = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      is_primary: img.id === imageId
    }));
    setImages(updatedImages);
  };

  const updateImageAltText = (imageId: string, altText: string) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, alt_text: altText } : img
    );
    setImages(updatedImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) return;

    const productData: Partial<Product> = {
      name: formData.name,
      slug: generateSlug(formData.name),
      description: formData.description || undefined,
      price: parseFloat(formData.price) || 0,
      compare_price: formData.compare_price ? parseFloat(formData.compare_price) : undefined,
      sku: formData.sku || undefined,
      quantity: formData.quantity !== '' ? parseInt(formData.quantity) : 0,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      category_id: formData.category_id || undefined,
      is_active: formData.is_active,
      track_quantity: formData.track_quantity,
      requires_shipping: formData.requires_shipping,
      taxable: formData.taxable,
      is_digital: formData.is_digital,
      is_temporary_offer: formData.is_temporary_offer,
      images: images,
    };

    onSave(productData);
  };

  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
       <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">
            {product ? 'Product Bewerken' : 'Nieuw Product Aanmaken'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 h-[calc(95vh-80px)]">
          {/* Main Content (links) */}
          <div className="overflow-y-auto px-6 pb-6">
            <div className="space-y-6">
              {/* Basisinformatie */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-base font-medium text-gray-900 mb-4">Basisinformatie</h2>
                {/* Productnaam */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titel *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 text-gray-900 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Bijv. T-shirt met korte mouwen"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                {/* Beschrijving */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Omschrijving</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Beschrijf het product..."
                  />
                </div>
              </div>

              {/* Media */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-base font-medium text-gray-900 mb-4">Media</h2>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-600">Upload of selecteer foto&apos;s</p>
                  <button type="button" onClick={addImage} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">Nieuwe upload</button>
                </div>
                {images.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <p className="text-sm text-gray-500">Nog geen afbeeldingen toegevoegd</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={image.id} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                          <img src={image.url} alt={image.alt_text || `Product afbeelding ${index + 1}`} className="w-full h-full object-cover" onError={(e) => { const target = e.target as HTMLImageElement; target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='; }} />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition flex space-x-2">
                            <button type="button" onClick={() => setPrimaryImage(image.id)} className={`px-3 py-1 text-xs rounded ${image.is_primary ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>{image.is_primary ? 'Primair' : 'Maak primair'}</button>
                            <button type="button" onClick={() => removeImage(image.id)} className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Verwijder</button>
                          </div>
                        </div>
                        {image.is_primary && (<div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">Primair</div>)}
                        <div className="p-3 bg-white">
                          <input type="text" value={image.alt_text || ''} onChange={(e) => updateImageAltText(image.id, e.target.value)} placeholder="Alt tekst (optioneel)" className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Categorie & Prijzen */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-base font-medium text-gray-900 mb-4">Categorie & Prijzen</h2>
                {/* Categorie */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categorie *</label>
                  <div className="relative" ref={dropdownRef}>
                    <button type="button" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className={`w-full px-4 py-2.5 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}>
                      {formData.category_id ? (categories.find(c => c.id === formData.category_id)?.name || 'Selecteer categorie') : 'Selecteer categorie'}
                    </button>
                    {showCategoryDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {categories.map((category) => (
                          <button key={category.id} type="button" onClick={() => { setFormData({ ...formData, category_id: category.id }); setShowCategoryDropdown(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-100">{category.name}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prijs (€) *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 sm:text-sm">€</span></div>
                      <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={`block w-full pl-7 pr-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 text-gray-900 ${errors.price ? 'border-red-500' : 'border-gray-300'}`} placeholder="0.00" />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vergelijkingsprijs (€)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 sm:text-sm">€</span></div>
                      <input type="number" step="0.01" value={formData.compare_price} onChange={(e) => setFormData({ ...formData, compare_price: e.target.value })} className="block w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 text-gray-900" placeholder="0.00" />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Laat klanten zien hoeveel ze besparen</p>
                  </div>
                </div>
              </div>

              {/* Voorraad & Verzending */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-base font-medium text-gray-900 mb-4">Voorraad & Verzending</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                    <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" placeholder="Product SKU" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Voorraad</label>
                    <input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} onWheel={(e) => e.currentTarget.blur()} className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`} placeholder="0" />
                    {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="track_quantity" checked={formData.track_quantity} onChange={(e) => setFormData({ ...formData, track_quantity: e.target.checked })} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="track_quantity" className="ml-2 block text-sm text-gray-900">Voorraad bijhouden</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gewicht (kg)</label>
                    <input type="number" step="0.01" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" placeholder="0.00" />
                  </div>
                </div>
              </div>

              {/* Actie knoppen (beneden links zoals Shopify) */}
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Annuleren</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{product ? 'Opslaan' : 'Opslaan'}</button>
              </div>
            </div>
          </div>

          {/* Sidebar (rechts) */}
          <div className="hidden lg:block border-l border-gray-200 h-full overflow-y-auto pr-6">
            <div className="sticky top-0 space-y-4 py-6">
              {/* Status */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Status</h3>
                </div>
                <select value={formData.is_active ? 'actief' : 'concept'} onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'actief' })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900">
                  <option value="actief">Actief</option>
                  <option value="concept">Concept</option>
                </select>
              </div>

              {/* Publicatie */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Publicatie</h3>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-900"><input type="checkbox" className="h-4 w-4 text-blue-600" checked={publicationChannels.webshop} onChange={(e) => setPublicationChannels({ ...publicationChannels, webshop: e.target.checked })}/> Webshop</label>
                  <label className="flex items-center gap-2 text-sm text-gray-900"><input type="checkbox" className="h-4 w-4 text-blue-600" checked={publicationChannels.shop} onChange={(e) => setPublicationChannels({ ...publicationChannels, shop: e.target.checked })}/> Shop</label>
                  <label className="flex items-center gap-2 text-sm text-gray-900"><input type="checkbox" className="h-4 w-4 text-blue-600" checked={publicationChannels.pos} onChange={(e) => setPublicationChannels({ ...publicationChannels, pos: e.target.checked })}/> Point of Sale</label>
                </div>
              </div>

              {/* Productorganisatie */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Productorganisatie</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Type</label>
                    <input value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Verkoper</label>
                    <input value={vendor} onChange={(e) => setVendor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Collecties</label>
                    <input value={collections} onChange={(e) => setCollections(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Tags</label>
                    <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Komma-gescheiden" />
                  </div>
                </div>
              </div>

              {/* Thema-template */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Thema-template</h3>
                <select value={themeTemplate} onChange={(e) => setThemeTemplate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900">
                  <option value="">Standaard</option>
                  <option value="product-alt">Product (alternatief)</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}