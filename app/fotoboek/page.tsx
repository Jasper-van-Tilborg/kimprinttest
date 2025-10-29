"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = [
  {
    title: "T-shirts",
    subtitle: "Onze t-shirts",
    description: "Van op maat gemaakte designs tot onze klanten die stralen in onze designs! Je vind ze allemaal in ons fotoboek.",
    href: "/fotoboek/t-shirts"
  },
  {
    title: "Hoodies",
    subtitle: "Onze hoodies",
    description: "Onze hoodies gemaakt van zacht katoen. Je vind alle designs in ons fotoboek!",
    href: "/fotoboek/hoodies"
  },
  {
    title: "Polo's",
    subtitle: "Onze polo's",
    description: "Op maat gemaakte designs voor onze polo's! Ben je benieuwd? Neem snel een kijkje!",
    href: "/fotoboek/polos"
  },
  {
    title: "Promotie materiaal",
    subtitle: "Promotie materiaal",
    description: "Ben jij op zoek naar een speciale manier om jouw bedrijf te promoten? Neem een kijkje met wat wij allemaal aanbieden.",
    href: "/fotoboek/promotie-materiaal"
  },
  {
    title: "Relatiegeschenken",
    subtitle: "Relatiegeschenken",
    description: "Op zoek naar een uniek relatiegeschenk voor je bedrijf? Neem een kijkje!",
    href: "/fotoboek/relatiegeschenken"
  },
  {
    title: "Carnaval",
    subtitle: "Carnaval",
    description: "Carnaval! Het feestje van het jaar. Hiervoor pakken we uit. Check onze vorige collecties hier.",
    href: "/fotoboek/carnaval"
  },
  {
    title: "Zakken & opbergmateriaal",
    subtitle: "Zakken & opbergmateriaal",
    description: "Op zoek naar een leuk cadeau of opbergmateriaal voor je huis? Dit kunnen wij voor je regelen.",
    href: "/fotoboek/zakken-opberg"
  },
  {
    title: "Bekers & Glazen",
    subtitle: "Bekers & Glazen",
    description: "Een leuk gepersonaliseerd cadeau? Bekers zijn de oplossing.",
    href: "/fotoboek/bekers-glazen"
  },
  {
    title: "Feestdagen",
    subtitle: "Feestdagen",
    description: "Neem een kijkje voor wat wij je kunnen bieden voor de verschillende feestdagen",
    href: "/fotoboek/feestdagen"
  },
  {
    title: "Baby & kinderen",
    subtitle: "Baby & kinderen",
    description: "Ook de kleintjes kunnen bij ons terecht! Neem een kijkje.",
    href: "/fotoboek/baby-kinderen"
  },
  {
    title: "Overige",
    subtitle: "Overige",
    description: "We kunnen meer dan je denkt! Neem een kijkje in onze overige categorie.",
    href: "/fotoboek/overige"
  },
  {
    title: "Op maat gemaakt",
    subtitle: "Op maat gemaakt",
    description: "Wij bij k-imprint maken ook op maat gemaakte kleding! Neem vooral een kijkje.",
    href: "/fotoboek/op-maat"
  }
];

export default function Fotoboek() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <Navbar activePage="fotoboek" />

      {/* Hero Section */}
      <section className="py-16">
        <div className="grid-12">
          <div className="col-12 text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Fotoboek</h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Op onze webpagina vind je een inspirerende collectie van gepersonaliseerde producten. Bekijk onze unieke shirts met eigen designs, trendy stickerlabels en stijlvolle bekers met naam.
            </p>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mt-4">
              Elk item is ontworpen om jouw creativiteit te weerspiegelen en is perfect voor speciale gelegenheden of als cadeau. Laat je inspireren door de voorbeelden en ontdek hoe wij jouw ideeën tot leven kunnen brengen!
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-16">
        <div className="grid-12">
          {categories.map((category, index) => (
            <div 
              key={category.title} 
              className={`col-6 mb-8 ${index % 2 === 0 ? '' : ''}`}
            >
              <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
                {/* Image Placeholder */}
                <div className="bg-gray-200 flex items-center justify-center" style={{ height: '400px' }}>
                  <span className="text-gray-500 text-lg">{category.title}</span>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{category.subtitle}</h2>
                  <p className="text-gray-700 text-base leading-relaxed mb-6 flex-1">
                    {category.description}
                  </p>
                  <Link 
                    href={category.href}
                    className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-center"
                  >
                    Klik hier!
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

