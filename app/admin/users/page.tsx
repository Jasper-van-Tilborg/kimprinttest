"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase, isAdmin, User } from "@/lib/supabase";
import AdminHeader from "@/app/components/AdminHeader";

export default function UsersPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "user">("user");

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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user.id);
    setEditFirstName(user.first_name || "");
    setEditLastName(user.last_name || "");
    setEditRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFirstName("");
    setEditLastName("");
    setEditRole("user");
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: editFirstName,
          last_name: editLastName,
          role: editRole,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingUser);

      if (error) {
        console.error("Error updating user:", error);
        alert("Fout bij het bijwerken van de gebruiker");
      } else {
        await fetchUsers();
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      alert("Je kunt je eigen account niet verwijderen!");
      return;
    }

    if (!confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?")) return;

    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (error) {
        console.error("Error deleting user:", error);
        alert("Fout bij het verwijderen van de gebruiker");
      } else {
        setUsers(users.filter((u) => u.id !== userId));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Filter users based on search and role
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === "all" || u.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  // Calculate stats
  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const regularUsers = users.filter((u) => u.role === "user").length;

  if (loading || usersLoading) {
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
              <h1 className="text-4xl font-bold text-black mb-4">Gebruikers Beheer</h1>
              <p className="text-gray-600">Beheer alle gebruikers en hun rechten</p>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="pb-8">
          <div className="grid-12">
            <div className="col-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Totaal</p>
                <p className="text-3xl font-bold text-black">{totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Alle gebruikers</p>
              </div>
            </div>
            <div className="col-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Administrators</p>
                <p className="text-3xl font-bold text-black">{adminUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Admin rechten</p>
              </div>
            </div>
            <div className="col-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Reguliere Gebruikers</p>
                <p className="text-3xl font-bold text-black">{regularUsers}</p>
                <p className="text-xs text-gray-500 mt-1">Standaard rechten</p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="pb-8">
          <div className="grid-12">
            <div className="col-12">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Zoek op naam of email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                    />
                  </div>

                  {/* Role Filter */}
                  <div className="w-64">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black bg-white"
                    >
                      <option value="all">Alle rollen</option>
                      <option value="admin">Administrators</option>
                      <option value="user">Reguliere gebruikers</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Users Table */}
        <section className="pb-16">
          <div className="grid-12">
            <div className="col-12">
              {filteredUsers.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg mb-6">
                      {searchQuery || selectedRole !== "all"
                        ? "Geen gebruikers gevonden met deze filters"
                        : "Nog geen gebruikers toegevoegd"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-[#FAFAFA] border-b border-gray-200 font-bold text-sm text-black">
                    <div className="col-span-3">Naam</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Rol</div>
                    <div className="col-span-2">Aangemaakt</div>
                    <div className="col-span-2 text-right">Acties</div>
                  </div>

                  {/* Table Body */}
                  {filteredUsers.map((u, index) => (
                    <div
                      key={u.id}
                      className={`grid grid-cols-12 gap-4 px-8 py-6 ${
                        index !== filteredUsers.length - 1 ? "border-b border-gray-100" : ""
                      } ${editingUser === u.id ? "bg-blue-50" : "hover:bg-[#FAFAFA]"} transition-colors items-center`}
                    >
                      {editingUser === u.id ? (
                        <>
                          {/* Edit Mode - Naam */}
                          <div className="col-span-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editFirstName}
                                onChange={(e) => setEditFirstName(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black text-sm"
                                placeholder="Voornaam"
                              />
                              <input
                                type="text"
                                value={editLastName}
                                onChange={(e) => setEditLastName(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black text-sm"
                                placeholder="Achternaam"
                              />
                            </div>
                          </div>

                          {/* Edit Mode - Email (readonly) */}
                          <div className="col-span-3">
                            <p className="text-gray-600">{u.email}</p>
                          </div>

                          {/* Edit Mode - Role */}
                          <div className="col-span-2">
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value as "admin" | "user")}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black bg-white text-sm"
                            >
                              <option value="user">Gebruiker</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </div>

                          {/* Edit Mode - Created At */}
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">
                              {u.created_at ? new Date(u.created_at).toLocaleDateString("nl-NL") : "-"}
                            </p>
                          </div>

                          {/* Edit Mode - Actions */}
                          <div className="col-span-2 text-right flex gap-2 justify-end">
                            <button
                              onClick={handleSaveEdit}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
                            >
                              Opslaan
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
                            >
                              Annuleren
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* View Mode - Naam */}
                          <div className="col-span-3">
                            <p className="font-bold text-black">
                              {u.first_name || u.last_name
                                ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
                                : "Geen naam"}
                            </p>
                          </div>

                          {/* View Mode - Email */}
                          <div className="col-span-3">
                            <p className="text-gray-600">{u.email}</p>
                          </div>

                          {/* View Mode - Role */}
                          <div className="col-span-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                u.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {u.role === "admin" ? "Administrator" : "Gebruiker"}
                            </span>
                          </div>

                          {/* View Mode - Created At */}
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">
                              {u.created_at ? new Date(u.created_at).toLocaleDateString("nl-NL") : "-"}
                            </p>
                          </div>

                          {/* View Mode - Actions */}
                          <div className="col-span-2 text-right flex gap-2 justify-end">
                            <button
                              onClick={() => handleEditUser(u)}
                              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all text-sm font-medium"
                            >
                              Bewerken
                            </button>
                            {u.id !== user?.id && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-all text-sm font-medium"
                              >
                                Verwijderen
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}




