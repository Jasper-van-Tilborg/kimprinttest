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
      <Navbar activePage="fotoboek" />

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="grid-12">
          <div className="col-12">
            <h1 className="text-5xl font-bold text-black mb-8">Ons Fotoboek</h1>
            <div className="max-w-4xl">
              <p className="text-xl text-gray-700 leading-relaxed mb-4">
                Op onze webpagina vind je een inspirerende collectie van gepersonaliseerde producten. Bekijk onze unieke shirts met eigen designs, trendy stickerlabels en stijlvolle bekers met naam.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Elk item is ontworpen om jouw creativiteit te weerspiegelen en is perfect voor speciale gelegenheden of als cadeau. Laat je inspireren door de voorbeelden en ontdek hoe wij jouw ideeën tot leven kunnen brengen!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Alternating Layout */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {categories.map((category, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <div 
                key={category.title}
                className={`mb-20 last:mb-0 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center group`}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2">
                  <div className="bg-gray-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                    <div className="aspect-[4/3] flex items-center justify-center">
                      <span className="text-gray-400 text-lg font-medium">{category.title}</span>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-8' : 'md:pr-8'}`}>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-black">
                      {category.subtitle}
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {category.description}
                    </p>
                    <Link 
                      href={category.href}
                      className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg hover:bg-[#8B4513] transition-all duration-300 font-medium text-lg group/btn mt-4"
                    >
                      Bekijk Galerij
                      <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}

