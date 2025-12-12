"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";
import LogoutButton from "../admin/LogoutButton";

interface AdminHeaderProps {
  userEmail?: string;
  onSignOut?: () => void;
}

// Mobile Logout Button Component
function MobileLogoutButton({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      onLogout(); // Close menu first
      await logout();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md text-sm flex items-center justify-center gap-2 w-full"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      Uitloggen
    </button>
  );
}

export default function AdminHeader({ userEmail, onSignOut }: AdminHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/products", label: "Producten" },
    { href: "/admin/orders", label: "Bestellingen" },
    { href: "/admin/users", label: "Gebruikers" },
    { href: "/admin/settings", label: "Instellingen" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="grid-12 py-4 md:py-6 border-b border-gray-100">
        <div className="col-12 flex justify-between items-center gap-4">
          {/* Logo en Titel */}
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-2 md:gap-4 group transition-all flex-shrink-0"
            onClick={closeMenu}
          >
            <div className="relative">
              <Image
                src="/images/logo/K-imprint logo.avif"
                alt="K-imprint Logo"
                width={70}
                height={70}
                className="object-contain transition-transform group-hover:scale-105 w-12 h-12 md:w-[70px] md:h-[70px]"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-3xl font-bold text-black group-hover:text-gray-700 transition-colors whitespace-nowrap">
                K-imprint <span className="text-gray-500 font-normal">Admin</span>
              </h1>
              {userEmail && (
                <p className="text-xs md:text-sm text-gray-500 mt-1 truncate hidden md:block">{userEmail}</p>
              )}
            </div>
          </Link>

          {/* Desktop Actie Knoppen */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/"
              className="bg-[#FAFAFA] text-black px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-black hover:text-white transition-all font-medium border border-gray-300 hover:border-black text-sm"
            >
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span className="hidden lg:inline">Website</span>
              </span>
            </Link>
            {onSignOut ? (
              <button
                onClick={onSignOut}
                className="bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md text-sm"
              >
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span className="hidden lg:inline">Uitloggen</span>
                </span>
              </button>
            ) : (
              <LogoutButton />
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors relative z-10"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-[2px] w-6 bg-black transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-black transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-black transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Desktop Navigation Bar */}
      <div className="hidden md:block bg-white">
        <div className="grid-12 py-4">
          <div className="col-12">
            <nav className="flex justify-center gap-4 lg:gap-8 flex-wrap">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-all px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPath === item.href
                      ? "text-black bg-gray-100"
                      : "text-gray-700 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid-12 py-4">
          <div className="col-12 flex flex-col gap-2">
            {/* Mobile Actie Knoppen */}
            <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-gray-200">
              <Link
                href="/"
                onClick={closeMenu}
                className="bg-[#FAFAFA] text-black px-4 py-3 rounded-lg hover:bg-black hover:text-white transition-all font-medium border border-gray-300 hover:border-black text-sm flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Naar Website
              </Link>
              {onSignOut ? (
                <button
                  onClick={() => {
                    closeMenu();
                    onSignOut();
                  }}
                  className="bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md text-sm flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Uitloggen
                </button>
              ) : (
                <MobileLogoutButton onLogout={closeMenu} />
              )}
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`transition-all px-4 py-3 rounded-lg text-sm font-medium ${
                    currentPath === item.href
                      ? "text-black bg-gray-100"
                      : "text-gray-700 hover:text-black hover:bg-gray-50"
                  }`}
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

