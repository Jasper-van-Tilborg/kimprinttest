'use client';

import { useState, useEffect } from 'react';
import StickyHeader from './components/StickyHeader';
import CategoryCarousel from './components/CategoryCarousel';
import { db, Category, Product } from '../lib/database';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [specialOffers, setSpecialOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, offersData] = await Promise.all([
          db.getCategories(),
          db.getSpecialOffers()
        ]);
        setCategories(categoriesData);
        setSpecialOffers(offersData);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Placeholder data als er geen data is
  const placeholderCategories = [
    { 
      id: '1', 
      name: 'T-Shirts', 
      slug: 't-shirts',
      description: 'Comfortabele katoenen t-shirts',
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: '2', 
      name: 'Hoodies', 
      slug: 'hoodies',
      description: 'Warme en comfortabele hoodies',
      image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a4?w=400&h=400&fit=crop&crop=center',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: '3', 
      name: 'Tote Bags', 
      slug: 'tote-bags',
      description: 'Eco-vriendelijke tote bags',
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&crop=center',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const displayCategories = categories.length > 0 ? categories : placeholderCategories;
  const displayOffers = specialOffers.length > 0 ? specialOffers : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1ED' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#2D1B0E' }}></div>
          <p className="text-lg" style={{ color: '#4A3E2E' }}>Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1ED' }}>
      {/* Sticky Header */}
      <StickyHeader />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Achtergrond afbeelding */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('https://k-imprint.nl/cdn/shop/files/Afbeelding_van_WhatsApp_op_2024-09-30_om_10.58.38_1ac42d83.jpg?height=4096&v=1746776021')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        {/* Overlay voor betere leesbaarheid */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-10 text-left max-w-5xl mx-auto px-12">
          <div className="max-w-2xl"> 
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white drop-shadow-2xl">
              Ontworpen voor wie zich wil onderscheiden
            </h1>
            <p className="text-xl md:text-2xl mb-12 font-light text-gray-100 drop-shadow-lg leading-relaxed">
              Premium basics. Duurzaam bedrukt in Nederland.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-12 py-5 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:opacity-90 rounded-full bg-white text-gray-900 shadow-2xl hover:shadow-white/20">
                Shop de collectie →
              </button>
              <button className="px-12 py-5 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:opacity-90 rounded-full border-2 border-white text-white hover:bg-white hover:text-gray-900 shadow-xl">
                Bekijk lookbook
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Collecties & Tijdelijke Offers */}
      <section className="py-20" style={{ backgroundColor: '#F5F1ED' }}>
        <div className="w-full">
          <div className="text-center mb-16 px-8 sm:px-12 lg:px-16">
            <h2 className="text-3xl md:text-4xl font-normal mb-6" style={{ color: '#2D1B0E' }}>
              Tijdelijke Halloween Offers
            </h2>
            <p className="text-xl font-normal max-w-2xl mx-auto" style={{ color: '#4A3E2E' }}>
              Beperkte tijd - speciale Halloween collectie met kortingen tot 30%
            </p>
          </div>
          <CategoryCarousel products={displayOffers} />
        </div>

        {/* Categorieën Grid */}
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 mt-20">
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-normal mb-4" style={{ color: '#2D1B0E' }}>
              Onze Categorieën
            </h3>
            <p className="text-lg font-normal max-w-2xl mx-auto" style={{ color: '#4A3E2E' }}>
              Ontdek onze uitgebreide selectie van gepersonaliseerde producten
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCategories.slice(0, 3).map((category) => (
              <div key={category.id} className="group">
                <div className="relative h-80 overflow-hidden mb-6 rounded-2xl" style={{ backgroundColor: '#E8DDD4' }}>
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${category.image_url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center'})` }}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ backgroundColor: 'rgba(45, 27, 14, 0.6)' }}>
                    <button className="px-8 py-4 text-base font-normal transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 rounded-full" style={{ backgroundColor: '#F5F1ED', color: '#2D1B0E' }}>
                      Shop {category.name} →
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-normal mb-2" style={{ color: '#2D1B0E' }}>{category.name}</h3>
                <p className="text-lg font-normal mb-1" style={{ color: '#4A3E2E' }}>
                  {category.description || 'Ontdek onze collectie'}
                </p>
                <p className="text-sm font-light" style={{ color: '#8B6F47' }}>
                  {category.description ? 'Bekijk alle producten' : 'Gepersonaliseerde producten'}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-12 py-5 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:opacity-90 rounded-full" style={{ backgroundColor: '#2D1B0E', color: '#F5F1ED' }}>
              Bekijk alle categorieën →
            </button>
          </div>
        </div>
      </section>

      {/* Nieuwsbrief & Community */}
      <section className="py-40" style={{ backgroundColor: '#E8DDD4' }}>
        <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 text-center">
          <h2 className="text-2xl md:text-3xl font-normal mb-12" style={{ color: '#2D1B0E' }}>
            Word onderdeel van onze community
          </h2>
          <p className="text-xl font-normal mb-20 max-w-4xl mx-auto" style={{ color: '#4A3E2E' }}>
            Ontvang exclusieve previews en limited releases.
          </p>
          
          <div className="max-w-xl mx-auto">
            <div className="flex">
              <input 
                type="email" 
                placeholder="E-mail adres" 
                className="flex-1 px-10 py-6 text-lg font-normal transition-colors focus:outline-none focus:border-opacity-100 rounded-l-2xl"
                style={{ border: '3px solid #A68B6B', color: '#2D1B0E' }}
              />
              <button className="px-16 py-6 text-lg font-normal transition-colors hover:opacity-90 rounded-r-2xl" style={{ backgroundColor: '#2D1B0E', color: '#F5F1ED' }}>
                Aanmelden →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20" style={{ backgroundColor: '#2D1B0E' }}>
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="grid md:grid-cols-4 gap-16">
            {/* Snelle links */}
            <div>
              <h3 className="text-sm font-light tracking-wider uppercase mb-6" style={{ color: '#F5F1ED' }}>Snelle links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm font-light transition-colors hover:opacity-80" style={{ color: '#C4A896' }}>Collecties</a></li>
                <li><a href="#" className="text-sm font-light transition-colors hover:opacity-80" style={{ color: '#C4A896' }}>Offertes</a></li>
                <li><a href="#" className="text-sm font-light transition-colors hover:opacity-80" style={{ color: '#C4A896' }}>Contact</a></li>
                <li><a href="#" className="text-sm font-light transition-colors hover:opacity-80" style={{ color: '#C4A896' }}>Retourneren</a></li>
                <li><a href="#" className="text-sm font-light transition-colors hover:opacity-80" style={{ color: '#C4A896' }}>Privacybeleid</a></li>
              </ul>
            </div>

            {/* Betaalopties */}
            <div>
              <h3 className="text-sm font-light tracking-wider uppercase mb-6" style={{ color: '#F5F1ED' }}>Betaalopties</h3>
              <div className="space-y-3">
                <div className="text-sm font-light" style={{ color: '#C4A896' }}>Apple Pay</div>
                <div className="text-sm font-light" style={{ color: '#C4A896' }}>Google Pay</div>
                <div className="text-sm font-light" style={{ color: '#C4A896' }}>Maestro</div>
              </div>
            </div>

            {/* Sociale media */}
            <div>
              <h3 className="text-sm font-light tracking-wider uppercase mb-6" style={{ color: '#F5F1ED' }}>Volg ons</h3>
              <div className="space-y-3">
                <a href="#" className="text-sm font-light transition-colors block hover:opacity-80" style={{ color: '#C4A896' }}>Instagram</a>
                <a href="#" className="text-sm font-light transition-colors block hover:opacity-80" style={{ color: '#C4A896' }}>TikTok</a>
              </div>
            </div>

            {/* Contact info */}
            <div>
              <h3 className="text-sm font-light tracking-wider uppercase mb-6" style={{ color: '#F5F1ED' }}>Contact</h3>
              <div className="space-y-3 text-sm font-light" style={{ color: '#C4A896' }}>
                <div>info@k-imprint.nl</div>
                <div>+31 (0) 123 456 789</div>
                <div>Nederland</div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 text-center" style={{ borderTop: '1px solid #8B6F47' }}>
            <p className="text-sm font-light" style={{ color: '#C4A896' }}>
              © 2025 K-IMPRINT. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
