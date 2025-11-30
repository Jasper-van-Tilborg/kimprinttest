"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../../hooks/useAuth";
import { getAllCollections, deleteCollection, type Collection } from "../../actions/collections";
import { supabase } from "../../../lib/supabase";

export default function AdminCollections() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchCollections() {
      if (!user) return;

      try {
        setCollectionsLoading(true);
        const data = await getAllCollections();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setCollectionsLoading(false);
      }
    }

    fetchCollections();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCollection(id);
      setCollections(collections.filter((c) => c.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting collection:", error);
      alert("Fout bij verwijderen van collectie");
    }
  };

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || collectionsLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="py-16">
          <div className="grid-12">
            <div className="col-12 text-center">
              <p className="text-gray-500">Laden...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="grid-12">
          <div className="col-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">Collecties</h1>
                <p className="text-gray-600">Beheer je product collecties</p>
              </div>
              <Link
                href="/admin/collections/new"
                className="px-4 py-2 bg-black text-white border-2 border-black rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
              >
                + Nieuwe Collectie
              </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Zoek collecties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collections List */}
      <section className="py-8">
        <div className="grid-12">
          {filteredCollections.length === 0 ? (
            <div className="col-12">
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <p className="text-gray-500 text-lg mb-4">
                  {searchQuery ? "Geen collecties gevonden" : "Nog geen collecties"}
                </p>
                {!searchQuery && (
                  <Link
                    href="/admin/collections/new"
                    className="inline-block px-4 py-2 bg-black text-white border-2 border-black rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
                  >
                    + Eerste Collectie Aanmaken
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="col-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="bg-white rounded-lg border border-gray-200 hover:border-black transition-all hover:shadow-lg overflow-hidden"
                  >
                    {/* Hero Image */}
                    {collection.hero_image && (
                      <div className="relative w-full h-48 bg-gray-200">
                        <Image
                          src={collection.hero_image}
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-black mb-1">
                            {collection.name}
                          </h3>
                          {collection.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {collection.description}
                            </p>
                          )}
                        </div>
                        {collection.is_featured && (
                          <span className="ml-2 px-2 py-1 bg-black text-white text-xs font-medium rounded">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <span>Slug: {collection.slug}</span>
                        <span>•</span>
                        <span>Order: {collection.display_order}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/collections/edit/${collection.id}`}
                          className="flex-1 px-4 py-2 bg-white text-black border-2 border-gray-300 rounded-lg font-medium text-sm hover:border-black transition-colors text-center"
                        >
                          Bewerken
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(collection.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg font-medium text-sm hover:border-red-400 transition-colors"
                        >
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-black mb-4">Collectie Verwijderen</h3>
            <p className="text-gray-600 mb-6">
              Weet je zeker dat je deze collectie wilt verwijderen? Producten worden niet verwijderd, alleen de collectie koppeling.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-white text-black border-2 border-gray-300 rounded-lg font-medium text-sm hover:border-black transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white border-2 border-red-600 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

