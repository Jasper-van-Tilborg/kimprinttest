import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <Navbar />

      {/* 404 Content */}
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="grid-12">
          <div className="col-12 text-center">
            {/* 404 Number */}
            <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
            
            {/* Error Message */}
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Pagina niet gevonden</h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Oeps! De pagina die je zoekt bestaat niet of is verplaatst. 
              Ga terug naar de homepagina of bekijk ons assortiment.
            </p>
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Link 
                href="/"
                className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg"
              >
                Terug naar home
              </Link>
              <Link 
                href="/assortiment"
                className="bg-transparent text-black px-8 py-4 rounded-lg border border-black hover:bg-gray-50 transition-colors font-medium text-lg"
              >
                Bekijk assortiment
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

