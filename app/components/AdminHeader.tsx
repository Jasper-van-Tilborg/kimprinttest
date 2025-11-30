import Link from "next/link";
import Image from "next/image";
import LogoutButton from "../admin/LogoutButton";

interface AdminHeaderProps {
  userEmail?: string;
  onSignOut?: () => void;
}

export default function AdminHeader({ userEmail, onSignOut }: AdminHeaderProps) {
  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/products", label: "Producten" },
    { href: "/admin/collections", label: "Collecties" },
    { href: "/admin/orders", label: "Bestellingen" },
    { href: "/admin/users", label: "Gebruikers" },
    { href: "/admin/settings", label: "Instellingen" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="grid-12 py-6 border-b border-gray-100">
        <div className="col-12 flex justify-between items-center">
          {/* Logo en Titel */}
          <Link href="/admin/dashboard" className="flex items-center gap-4 group transition-all">
            <div className="relative">
              <Image
                src="/images/logo/K-imprint logo.avif"
                alt="K-imprint Logo"
                width={70}
                height={70}
                className="object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black group-hover:text-gray-700 transition-colors">
                K-imprint <span className="text-gray-500 font-normal">Admin</span>
              </h1>
              {userEmail && (
                <p className="text-sm text-gray-500 mt-1">{userEmail}</p>
              )}
            </div>
          </Link>

          {/* Actie Knoppen */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="bg-[#FAFAFA] text-black px-8 py-3 rounded-lg hover:bg-black hover:text-white transition-all font-medium border border-gray-300 hover:border-black"
            >
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Website
              </span>
            </Link>
            {onSignOut ? (
              <button
                onClick={onSignOut}
                className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md"
              >
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Uitloggen
                </span>
              </button>
            ) : (
              <LogoutButton />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white">
        <div className="grid-12 py-4">
          <div className="col-12">
            <nav className="flex justify-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-black transition-all px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

