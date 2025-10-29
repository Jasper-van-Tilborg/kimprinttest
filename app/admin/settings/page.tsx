"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase, isAdmin } from "@/lib/supabase";
import AdminHeader from "@/app/components/AdminHeader";

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  
  // Account Settings
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  // Password Change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Website Settings
  const [websiteName, setWebsiteName] = useState("K-imprint");
  const [websiteDescription, setWebsiteDescription] = useState("Bedrukte kleding en accessoires");
  const [contactEmail, setContactEmail] = useState("info@k-imprint.nl");
  const [contactPhone, setContactPhone] = useState("+31 6 12345678");
  
  // UI State
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        const userIsAdmin = await isAdmin(user.id);
        if (!userIsAdmin) {
          router.push("/");
        }
      }
    }
    checkAdmin();
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      } else if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setEmail(data.email || "");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSaveAccountSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setErrorMessage("");
    setSaveMessage("");

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
        setErrorMessage("Fout bij het opslaan van accountgegevens");
        console.error("Error updating user:", error);
      } else {
        setSaveMessage("Accountgegevens succesvol opgeslagen!");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("Er is een fout opgetreden");
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSaveMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Nieuwe wachtwoorden komen niet overeen");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Wachtwoord moet minimaal 6 tekens bevatten");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMessage("Fout bij het wijzigen van wachtwoord");
        console.error("Error updating password:", error);
      } else {
        setSaveMessage("Wachtwoord succesvol gewijzigd!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("Er is een fout opgetreden");
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWebsiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSaveMessage("");

    // Voor nu slaan we dit lokaal op
    // Later kan dit naar een settings tabel in de database
    try {
      localStorage.setItem("website_settings", JSON.stringify({
        name: websiteName,
        description: websiteDescription,
        contactEmail,
        contactPhone,
      }));

      setSaveMessage("Website instellingen succesvol opgeslagen!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Er is een fout opgetreden");
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AdminHeader userEmail={user?.email} onSignOut={handleSignOut} />

      <main className="py-8">
        {/* Page Header */}
        <section className="pb-8">
          <div className="grid-12">
            <div className="col-12">
              <h1 className="text-4xl font-bold text-black mb-4">Instellingen</h1>
              <p className="text-gray-600">Beheer je account en website instellingen</p>
            </div>
          </div>
        </section>

        {/* Success/Error Messages */}
        {saveMessage && (
          <section className="pb-6">
            <div className="grid-12">
              <div className="col-12">
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg">
                  {saveMessage}
                </div>
              </div>
            </div>
          </section>
        )}

        {errorMessage && (
          <section className="pb-6">
            <div className="grid-12">
              <div className="col-12">
                <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
                  {errorMessage}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Account Settings */}
        <section className="pb-8">
          <div className="grid-12">
            <div className="col-12">
              <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-black mb-6">Account Gegevens</h2>
                <form onSubmit={handleSaveAccountSettings}>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voornaam
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                        placeholder="Voornaam"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Achternaam
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                        placeholder="Achternaam"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email kan niet worden gewijzigd</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium disabled:bg-gray-400"
                  >
                    {isSaving ? "Opslaan..." : "Opslaan"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Password Change */}
        <section className="pb-8">
          <div className="grid-12">
            <div className="col-12">
              <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-black mb-6">Wachtwoord Wijzigen</h2>
                <form onSubmit={handleChangePassword}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nieuw Wachtwoord
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                      placeholder="Minimaal 6 tekens"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bevestig Nieuw Wachtwoord
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                      placeholder="Herhaal wachtwoord"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving || !newPassword || !confirmPassword}
                    className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium disabled:bg-gray-400"
                  >
                    {isSaving ? "Wijzigen..." : "Wachtwoord Wijzigen"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Website Settings */}
        <section className="pb-16">
          <div className="grid-12">
            <div className="col-12">
              <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-black mb-6">Website Instellingen</h2>
                <form onSubmit={handleSaveWebsiteSettings}>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website Naam
                      </label>
                      <input
                        type="text"
                        value={websiteName}
                        onChange={(e) => setWebsiteName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website Beschrijving
                      </label>
                      <input
                        type="text"
                        value={websiteDescription}
                        onChange={(e) => setWebsiteDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Telefoon
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium disabled:bg-gray-400"
                  >
                    {isSaving ? "Opslaan..." : "Opslaan"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

