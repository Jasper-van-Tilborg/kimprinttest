"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabase";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
  items_count: number;
};

export default function AdminOrders() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;

      try {
        setOrdersLoading(true);

        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
        } else if (data) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "betaald":
        return { bg: "bg-green-100", text: "text-green-800", label: "Betaald" };
      case "pending":
      case "in behandeling":
        return { bg: "bg-yellow-100", text: "text-yellow-800", label: "In behandeling" };
      case "shipped":
      case "verzonden":
        return { bg: "bg-blue-100", text: "text-blue-800", label: "Verzonden" };
      case "delivered":
      case "afgeleverd":
        return { bg: "bg-green-100", text: "text-green-800", label: "Afgeleverd" };
      case "cancelled":
      case "geannuleerd":
        return { bg: "bg-red-100", text: "text-red-800", label: "Geannuleerd" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", label: status };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statuses = Array.from(new Set(orders.map((o) => o.status)));

  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "betaald")
    .reduce((sum, o) => sum + o.total_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-xl">Laden...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header Section */}
      <section className="py-16">
        <div className="grid-12">
          <div className="col-12">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-5xl font-bold text-black mb-4">Bestellingen</h1>
                <p className="text-xl text-gray-700">
                  {orders.length} bestelling{orders.length !== 1 ? "en" : ""} in totaal
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="pb-8">
        <div className="grid-12">
          <div className="col-3">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Totaal Bestellingen</p>
              <p className="text-3xl font-bold text-black">{orders.length}</p>
            </div>
          </div>
          <div className="col-3">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Betaald</p>
              <p className="text-3xl font-bold text-green-600">
                {orders.filter((o) => o.status === "paid" || o.status === "betaald").length}
              </p>
            </div>
          </div>
          <div className="col-3">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">In Behandeling</p>
              <p className="text-3xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === "pending" || o.status === "in behandeling").length}
              </p>
            </div>
          </div>
          <div className="col-3">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Totale Omzet</p>
              <p className="text-3xl font-bold text-black">€{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="pb-8">
        <div className="grid-12">
          <div className="col-12">
            <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
              <h2 className="font-bold text-black mb-6 text-xl">Filteren & Zoeken</h2>
              <div className="flex gap-4">
                {/* Zoeken */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zoeken
                  </label>
                  <input
                    type="text"
                    placeholder="Zoek op bestelnummer, naam of email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                  />
                </div>

                {/* Status Filter */}
                <div className="w-64">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white transition-colors text-black"
                  >
                    <option value="all">Alle Statussen</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {getStatusStyle(status).label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(searchQuery || selectedStatus !== "all") && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{filteredOrders.length}</span> van de{" "}
                    <span className="font-semibold">{orders.length}</span> bestellingen weergegeven
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="pb-16">
        <div className="grid-12">
          <div className="col-12">
            {ordersLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="text-center py-16 text-gray-500">Bestellingen laden...</div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg mb-6">
                    {searchQuery || selectedStatus !== "all"
                      ? "Geen bestellingen gevonden met deze filters"
                      : "Nog geen bestellingen"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-[#FAFAFA] border-b border-gray-200 font-bold text-sm text-black">
                  <div className="col-span-2">Bestelnummer</div>
                  <div className="col-span-2">Klant</div>
                  <div className="col-span-2">Email</div>
                  <div className="col-span-2">Datum</div>
                  <div className="col-span-1 text-right">Items</div>
                  <div className="col-span-1 text-right">Bedrag</div>
                  <div className="col-span-2">Status</div>
                </div>

                {/* Table Body */}
                {filteredOrders.map((order, index) => {
                  const statusStyle = getStatusStyle(order.status);

                  return (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className={`grid grid-cols-12 gap-4 px-8 py-6 ${
                        index !== filteredOrders.length - 1 ? "border-b border-gray-100" : ""
                      } hover:bg-[#FAFAFA] transition-colors items-center cursor-pointer`}
                    >
                      {/* Bestelnummer */}
                      <div className="col-span-2">
                        <p className="font-bold text-black">{order.order_number}</p>
                      </div>

                      {/* Klant */}
                      <div className="col-span-2">
                        <p className="text-black font-medium">{order.customer_name || "Onbekend"}</p>
                      </div>

                      {/* Email */}
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 truncate">{order.customer_email}</p>
                      </div>

                      {/* Datum */}
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                      </div>

                      {/* Items */}
                      <div className="col-span-1 text-right">
                        <p className="text-black font-medium">{order.items_count || 0}</p>
                      </div>

                      {/* Bedrag */}
                      <div className="col-span-1 text-right">
                        <p className="font-bold text-black text-lg">€{order.total_amount.toFixed(2)}</p>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <span
                          className={`inline-block ${statusStyle.bg} ${statusStyle.text} px-4 py-2 rounded-full text-xs font-medium`}
                        >
                          {statusStyle.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


