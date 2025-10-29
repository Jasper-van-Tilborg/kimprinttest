"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../hooks/useAuth";
import { supabase } from "../../../../lib/supabase";
import AdminHeader from "../../../components/AdminHeader";

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  items_count: number;
  notes: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
};

export default function OrderDetail() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchOrder() {
      if (!user || !orderId) return;

      try {
        setOrderLoading(true);

        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) {
          console.error("Error fetching order:", error);
        } else if (data) {
          setOrder(data);
          setNewStatus(data.status);

          // Haal order items op
          const { data: itemsData, error: itemsError } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", orderId)
            .order("created_at", { ascending: true });

          if (itemsError) {
            console.error("Error fetching order items:", itemsError);
          } else if (itemsData) {
            setOrderItems(itemsData);
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setOrderLoading(false);
      }
    }

    fetchOrder();
  }, [user, orderId]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleUpdateStatus = async () => {
    if (!order || newStatus === order.status) return;

    try {
      setUpdating(true);

      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) {
        console.error("Error updating order:", error);
        alert("Fout bij het bijwerken van de status");
      } else {
        setOrder({ ...order, status: newStatus });
        alert("Status succesvol bijgewerkt!");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Er is een fout opgetreden");
    } finally {
      setUpdating(false);
    }
  };

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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || orderLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-xl">Laden...</div>
      </div>
    );
  }

  if (!user || !order) {
    return null;
  }

  const statusStyle = getStatusStyle(order.status);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <AdminHeader userEmail={user.email} onSignOut={handleSignOut} />

      {/* Header Section */}
      <section className="py-16">
        <div className="grid-12">
          <div className="col-12">
            <div className="flex items-center gap-4 mb-8">
              <Link
                href="/admin/orders"
                className="text-gray-600 hover:text-black transition-colors"
              >
                ← Terug naar bestellingen
              </Link>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-bold text-black mb-4">
                  Bestelling {order.order_number}
                </h1>
                <p className="text-xl text-gray-700">{formatDate(order.created_at)}</p>
              </div>
              <span
                className={`${statusStyle.bg} ${statusStyle.text} px-6 py-3 rounded-lg text-sm font-bold`}
              >
                {statusStyle.label}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Order Details */}
      <section className="pb-16">
        <div className="grid-12">
          {/* Main Info */}
          <div className="col-8">
            {/* Bestelde Producten */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
              <h2 className="font-bold text-black mb-6 text-2xl">Bestelde Producten</h2>
              {orderItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Geen producten gevonden</p>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      {/* Product Afbeelding */}
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Geen foto
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-black text-lg">{item.product_name}</h3>
                        <p className="text-sm text-gray-600">
                          €{item.price.toFixed(2)} per stuk
                        </p>
                      </div>

                      {/* Aantal */}
                      <div className="text-center px-4">
                        <p className="text-sm text-gray-600 mb-1">Aantal</p>
                        <p className="text-2xl font-bold text-black">{item.quantity}x</p>
                      </div>

                      {/* Totaal */}
                      <div className="text-right min-w-[100px]">
                        <p className="text-sm text-gray-600 mb-1">Totaal</p>
                        <p className="text-2xl font-bold text-black">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
              <h2 className="font-bold text-black mb-6 text-2xl">Klantgegevens</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Naam</p>
                  <p className="text-lg font-semibold text-black">
                    {order.customer_name || "Niet opgegeven"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg text-black">{order.customer_email}</p>
                </div>
                {order.customer_phone && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Telefoon</p>
                    <p className="text-lg text-black">{order.customer_phone}</p>
                  </div>
                )}
                {order.shipping_address && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Verzendadres</p>
                    <p className="text-lg text-black whitespace-pre-line">
                      {order.shipping_address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              <h2 className="font-bold text-black mb-6 text-2xl">Bestelinformatie</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <p className="text-gray-700">Aantal items</p>
                  <p className="text-xl font-bold text-black">{order.items_count || 0}</p>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <p className="text-gray-700">Subtotaal</p>
                  <p className="text-xl font-bold text-black">
                    €{order.total_amount.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <p className="text-xl font-bold text-black">Totaal</p>
                  <p className="text-3xl font-bold text-black">
                    €{order.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {order.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Opmerkingen</p>
                  <p className="text-black">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
              <h3 className="font-bold text-black mb-4 text-lg">Status Wijzigen</h3>
              <div className="space-y-4">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white transition-colors text-black"
                >
                  <option value="pending">In behandeling</option>
                  <option value="paid">Betaald</option>
                  <option value="shipped">Verzonden</option>
                  <option value="delivered">Afgeleverd</option>
                  <option value="cancelled">Geannuleerd</option>
                </select>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating || newStatus === order.status}
                  className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Bijwerken..." : "Status Bijwerken"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              <h3 className="font-bold text-black mb-4 text-lg">Bestelling Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Bestelling ID</p>
                  <p className="font-mono text-xs text-black break-all">{order.id}</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-gray-600 mb-1">Aangemaakt</p>
                  <p className="text-black">{formatDate(order.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

