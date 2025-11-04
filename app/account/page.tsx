"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FadeInScroll from "../components/FadeInScroll";
import { useAuth } from "../../hooks/useAuth";
import { isAdmin } from "../../lib/supabase";

export default function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    async function checkUserRole() {
      if (user) {
        const userIsAdmin = await isAdmin(user.id);
        if (userIsAdmin) {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      }
    }
    checkUserRole();
  }, [user, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data?.user) {
      // Check if user is admin
      const userIsAdmin = await isAdmin(data.user.id);
      
      if (userIsAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
    });
    
    if (error) {
      setError(error.message);
    } else {
      setError("Account aangemaakt! Check je email voor verificatie.");
    }
    
    setLoading(false);
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Account Content */}
      <main className="flex-1 py-16">
        <div className="grid-12">
          <div className="col-12">
            <FadeInScroll className="max-w-md mx-auto">
              {/* Toggle Buttons */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors border ${
                    isLogin
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-black border-black hover:bg-gray-50"
                  }`}
                >
                  Inloggen
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors border ${
                    !isLogin
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-black border-black hover:bg-gray-50"
                  }`}
                >
                  Registreren
                </button>
              </div>

              {/* Login Form */}
              {isLogin ? (
                <div className="bg-white p-8 rounded-lg">
                  <h2 className="text-3xl font-bold text-black mb-6">Welkom terug</h2>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label htmlFor="login-email" className="block text-sm font-semibold text-black mb-2">
                        E-mailadres
                      </label>
                      <input
                        type="email"
                        id="login-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:border-black transition-colors text-black placeholder:text-gray-500"
                        placeholder="jouw@email.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="login-password" className="block text-sm font-semibold text-black mb-2">
                        Wachtwoord
                      </label>
                      <input
                        type="password"
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:border-black transition-colors text-black placeholder:text-gray-500"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0"
                        />
                        <span className="ml-2 text-sm text-gray-700">Onthoud mij</span>
                      </label>
                      <Link href="/wachtwoord-vergeten" className="text-sm text-[#8B4513] hover:underline">
                        Wachtwoord vergeten?
                      </Link>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? "Bezig..." : "Inloggen"}
                    </button>
                  </form>
                </div>
              ) : (
                /* Register Form */
                <div className="bg-white p-8 rounded-lg">
                  <h2 className="text-3xl font-bold text-black mb-6">Maak een account</h2>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="register-firstname" className="block text-sm font-semibold text-black mb-2">
                          Voornaam
                        </label>
                        <input
                          type="text"
                          id="register-firstname"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:border-black transition-colors text-black placeholder:text-gray-500"
                          placeholder="Voornaam"
                        />
                      </div>
                      <div>
                        <label htmlFor="register-lastname" className="block text-sm font-semibold text-black mb-2">
                          Achternaam
                        </label>
                        <input
                          type="text"
                          id="register-lastname"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:border-black transition-colors text-black placeholder:text-gray-500"
                          placeholder="Achternaam"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="register-email" className="block text-sm font-semibold text-black mb-2">
                        E-mailadres
                      </label>
                      <input
                        type="email"
                        id="register-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:border-black transition-colors text-black placeholder:text-gray-500"
                        placeholder="jouw@email.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="register-password" className="block text-sm font-semibold text-black mb-2">
                        Wachtwoord
                      </label>
                      <input
                        type="password"
                        id="register-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:border-black transition-colors text-black placeholder:text-gray-500"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="register-password-confirm" className="block text-sm font-semibold text-black mb-2">
                        Bevestig wachtwoord
                      </label>
                      <input
                        type="password"
                        id="register-password-confirm"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:border-black transition-colors text-black placeholder:text-gray-500"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        className="w-4 h-4 mt-1 border-gray-300 rounded focus:ring-0 focus:ring-offset-0"
                      />
                      <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                        Ik ga akkoord met de{" "}
                        <Link href="/algemene-voorwaarden" className="text-[#8B4513] hover:underline">
                          algemene voorwaarden
                        </Link>{" "}
                        en het{" "}
                        <Link href="/privacy" className="text-[#8B4513] hover:underline">
                          privacybeleid
                        </Link>
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? "Bezig..." : "Account aanmaken"}
                    </button>
                  </form>
                </div>
              )}
            </FadeInScroll>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

