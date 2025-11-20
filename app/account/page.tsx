"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../../hooks/useAuth";
import { isAdmin } from "../../lib/supabase";
import { login, signup } from "../../app/actions/auth";

export default function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for error/message in URL params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const messageParam = searchParams.get("message");
    if (errorParam) {
      setError(
        errorParam === "invalid_credentials"
          ? "Ongeldig e-mailadres of wachtwoord. Probeer het opnieuw."
          : "Er is een fout opgetreden. Probeer het opnieuw."
      );
    }
    if (messageParam) {
      setMessage(
        messageParam === "check_email"
          ? "Check je e-mail voor een bevestigingslink."
          : messageParam
      );
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    async function checkUserRole() {
      if (user) {
        const userIsAdmin = await isAdmin(user.id);
        if (userIsAdmin) {
          router.push("/admin/dashboard");
        } else {
          router.push("/account/dashboard");
        }
      }
    }
    checkUserRole();
  }, [user, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const result = await login(formData);
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        if (result.requiresEmailConfirmation) {
          setMessage("Je moet eerst je e-mailadres bevestigen voordat je kunt inloggen.");
        }
      }
      // Redirect happens in server action if successful
    } catch (err: any) {
      // Check if it's a redirect error (NEXT_REDIRECT)
      if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.message?.includes('NEXT_REDIRECT')) {
        // Let the redirect happen
        throw err;
      }
      setError(err.message || "Er is een fout opgetreden bij het inloggen.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== passwordConfirm) {
      setError("Wachtwoorden komen niet overeen");
      return;
    }

    if (password.length < 6) {
      setError("Wachtwoord moet minimaal 6 karakters lang zijn");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      
      const result = await signup(formData);
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.success) {
        if (result.requiresEmailConfirmation) {
          setMessage("Account aangemaakt! Check je e-mail voor een bevestigingslink om je account te activeren.");
        } else {
          setMessage("Account aangemaakt! Je kunt nu inloggen.");
        }
        setLoading(false);
        // Reset form
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
        setFirstName("");
        setLastName("");
        // Optioneel: redirect naar account pagina met success message
        setTimeout(() => {
          router.push("/account?message=check_email");
        }, 2000);
      } else {
        // Fallback: als er geen result is maar ook geen error
        setError("Er is een onbekende fout opgetreden. Probeer het opnieuw.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      // Check if it's a redirect error (NEXT_REDIRECT)
      if (err?.digest?.startsWith('NEXT_REDIRECT') || err?.message?.includes('NEXT_REDIRECT')) {
        // Let the redirect happen
        setLoading(false);
        throw err;
      }
      setError(err.message || "Er is een fout opgetreden bij het aanmaken van het account.");
      setLoading(false);
    }
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
            <div className="max-w-md mx-auto">
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

                  {message && (
                    <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                      {message}
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

                  {message && (
                    <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                      {message}
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

