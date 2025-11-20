"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabase";

type CustomProductDraft = {
  productType: "t-shirt" | "hoodie";
  color: {
    name: string;
    value: string;
    image: string;
  };
  size: string;
  uploadedImage: string | null;
  imagePosition: { x: number; y: number };
  imageSize: number;
  createdAt: string;
};

type UserProfile = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at?: string;
};

const productTypes: Record<"t-shirt" | "hoodie", string> = {
  "t-shirt": "T-shirt",
  "hoodie": "Hoodie",
};

const getInitials = (firstName?: string, lastName?: string, email?: string) => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName[0].toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
};

export default function AccountDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "concepten" | "profiel" | "bestellingen">("overview");
  const [savedDrafts, setSavedDrafts] = useState<CustomProductDraft[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadDrafts();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
      } else if (data) {
        setUserProfile(data);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loadDrafts = () => {
    const saved = localStorage.getItem("custom-product-drafts");
    if (saved) {
      try {
        setSavedDrafts(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading drafts:", e);
      }
    }
  };

  const handleDeleteDraft = (index: number) => {
    if (confirm("Weet je zeker dat je dit concept wilt verwijderen?")) {
      const updatedDrafts = savedDrafts.filter((_, i) => i !== index);
      setSavedDrafts(updatedDrafts);
      localStorage.setItem("custom-product-drafts", JSON.stringify(updatedDrafts));
    }
  };

  const handleLoadDraft = (draft: CustomProductDraft) => {
    router.push("/maak-je-eigen");
    setTimeout(() => {
      const event = new CustomEvent("loadDraft", { detail: draft });
      window.dispatchEvent(event);
    }, 100);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        alert("Fout bij het opslaan van je profiel.");
      } else {
        await loadUserProfile();
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Er is een fout opgetreden.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-xl text-gray-600">Laden...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { id: "overview", label: "Overzicht" },
    { id: "concepten", label: "Mijn concepten", badge: savedDrafts.length },
    { id: "bestellingen", label: "Bestellingen" },
    { id: "profiel", label: "Persoonlijke gegevens" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar activePage="account" />

      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-6 md:py-8">
        <div className="grid-12">
          <div className="col-12">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Mijn account
            </h1>
            <p className="text-gray-600">
              Welkom terug, {userProfile?.first_name || user.email?.split("@")[0] || "daar"}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-8 md:py-12">
        <div className="grid-12">
          {/* Sidebar Navigation */}
          <aside className="col-12 md:col-3 mb-8 md:mb-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 sticky top-[63px]">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                      activeTab === item.id
                        ? "bg-[#8B4513] text-white font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          activeTab === item.id
                            ? "bg-white/20 text-white"
                            : "bg-[#8B4513] text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Uitloggen
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="col-12 md:col-9">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Opgeslagen concepten</h3>
                    <p className="text-3xl font-bold text-[#8B4513]">{savedDrafts.length}</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Profiel status</h3>
                    <p className="text-lg font-bold text-gray-900">
                      {userProfile?.first_name && userProfile?.last_name ? "Volledig" : "Onvolledig"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Bestellingen</h3>
                    <p className="text-lg font-bold text-gray-900">0</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Snelle acties</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/maak-je-eigen"
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#8B4513] transition-colors group"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#8B4513] transition-colors">
                          Nieuw concept maken
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Maak een gepersonaliseerd product</p>
                      </div>
                      <span className="text-gray-400 group-hover:text-[#8B4513] transition-colors">→</span>
                    </Link>
                    <Link
                      href="/assortiment"
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#8B4513] transition-colors group"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#8B4513] transition-colors">
                          Bekijk assortiment
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Bekijk alle beschikbare producten</p>
                      </div>
                      <span className="text-gray-400 group-hover:text-[#8B4513] transition-colors">→</span>
                    </Link>
                  </div>
                </div>

                {/* Recent Concepten */}
                {savedDrafts.length > 0 ? (
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Recente concepten</h2>
                      <button
                        onClick={() => setActiveTab("concepten")}
                        className="text-sm text-[#8B4513] hover:underline font-medium"
                      >
                        Bekijk alle
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {savedDrafts.slice(0, 4).map((draft, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center relative group cursor-pointer overflow-hidden"
                          onClick={() => handleLoadDraft(draft)}
                        >
                          {draft.uploadedImage ? (
                            <img
                              src={draft.uploadedImage}
                              alt="Concept preview"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">Geen preview</span>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Bekijk
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Nog geen concepten</h3>
                    <p className="text-gray-600 mb-6">Begin met het maken van je eerste gepersonaliseerde design</p>
                    <Link
                      href="/maak-je-eigen"
                      className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Maak je eerste concept
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Concepten Tab */}
            {activeTab === "concepten" && (
              <div>
                {savedDrafts.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Je hebt nog geen concepten opgeslagen</h3>
                    <p className="text-gray-600 mb-6">
                      Start met het maken van je eerste gepersonaliseerde product. Sla je designs op en bewerk ze later opnieuw.
                    </p>
                    <Link
                      href="/maak-je-eigen"
                      className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Maak je eerste concept
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Mijn concepten</h2>
                      <p className="text-gray-600">{savedDrafts.length} {savedDrafts.length === 1 ? "concept" : "concepten"} opgeslagen</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedDrafts.map((draft, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div
                            className="relative aspect-square bg-gray-100 cursor-pointer group"
                            onClick={() => handleLoadDraft(draft)}
                          >
                            {draft.uploadedImage ? (
                              <img
                                src={draft.uploadedImage}
                                alt="Concept preview"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-400">Geen preview</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                              <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Bekijk & Bewerk
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-1">
                              {productTypes[draft.productType]} - {draft.color.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              Maat: {draft.size} | {new Date(draft.createdAt).toLocaleDateString("nl-NL")}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleLoadDraft(draft)}
                                className="flex-1 px-4 py-2 bg-[#8B4513] text-white rounded hover:bg-[#6B3410] transition-colors text-sm font-medium"
                              >
                                Laad
                              </button>
                              <button
                                onClick={() => handleDeleteDraft(index)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                              >
                                Verwijder
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Profiel Tab */}
            {activeTab === "profiel" && (
              <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-200">
                {!isEditingProfile ? (
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Persoonlijke gegevens</h2>
                        <p className="text-gray-600 text-sm">Beheer je accountinformatie</p>
                      </div>
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="px-4 py-2 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Bewerken
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div className="pb-6 border-b border-gray-200">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          E-mailadres
                        </label>
                        <p className="text-gray-900">{userProfile?.email || user.email}</p>
                      </div>
                      <div className="pb-6 border-b border-gray-200">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Voornaam
                        </label>
                        <p className="text-gray-900">{userProfile?.first_name || "Niet ingevuld"}</p>
                      </div>
                      <div className="pb-6 border-b border-gray-200">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Achternaam
                        </label>
                        <p className="text-gray-900">{userProfile?.last_name || "Niet ingevuld"}</p>
                      </div>
                      {userProfile?.created_at && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Lid sinds
                          </label>
                          <p className="text-gray-900">
                            {new Date(userProfile.created_at).toLocaleDateString("nl-NL", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Profiel bewerken</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          E-mailadres
                        </label>
                        <input
                          type="email"
                          value={userProfile?.email || user.email}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">E-mailadres kan niet worden gewijzigd</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Voornaam
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:border-black transition-colors"
                          placeholder="Voornaam"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Achternaam
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:border-black transition-colors"
                          placeholder="Achternaam"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                          className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                        >
                          {savingProfile ? "Opslaan..." : "Opslaan"}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingProfile(false);
                            setFirstName(userProfile?.first_name || "");
                            setLastName(userProfile?.last_name || "");
                          }}
                          className="px-6 py-3 border border-black text-black rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Annuleren
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Bestellingen Tab */}
            {activeTab === "bestellingen" && (
              <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Mijn bestellingen</h2>
                <p className="text-gray-600 mb-6">
                  Bestellingen worden hier getoond zodra je een bestelling hebt geplaatst.
                </p>
                <Link
                  href="/assortiment"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Bekijk assortiment
                </Link>
              </div>
            )}
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
