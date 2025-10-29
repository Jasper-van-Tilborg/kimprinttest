"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabase";
import AdminHeader from "../../components/AdminHeader";

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
};

type Order = {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  items_count: number;
};

type Product = {
  id: string;
  name: string;
  sales_count: number;
};

export default function AdminDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [weekSales, setWeekSales] = useState<number>(0);
  const [topProduct, setTopProduct] = useState<Product | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      
      try {
        setStatsLoading(true);

        // Haal het aantal producten op
        const { count: productsCount, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Haal het aantal orders op
        const { count: ordersCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        // Haal het aantal users op
        const { count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        if (productsError) console.error('Error fetching products count:', productsError);
        if (ordersError) console.error('Error fetching orders count:', ordersError);
        if (usersError) console.error('Error fetching users count:', usersError);

        setStats({
          totalProducts: productsCount || 0,
          totalOrders: ordersCount || 0,
          totalUsers: usersCount || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setStatsLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      
      try {
        setDataLoading(true);

        // Haal recente bestellingen op
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
        } else if (ordersData) {
          setRecentOrders(ordersData.map((order: any) => ({
            id: order.id,
            order_number: order.order_number || `#${order.id.slice(0, 8)}`,
            total_amount: order.total_amount || 0,
            status: order.status || 'pending',
            created_at: order.created_at,
            items_count: order.items_count || 1,
          })));
        }

        // Bereken verkopen deze week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { data: weekOrdersData, error: weekError } = await supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', oneWeekAgo.toISOString())
          .eq('status', 'paid');

        if (weekError) {
          console.error('Error fetching week sales:', weekError);
        } else if (weekOrdersData) {
          const total = weekOrdersData.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
          setWeekSales(total);
        }

        // Haal top product op (meest verkochte product)
        // Probeer eerst met sales_count, als dat faalt haal dan gewoon alle producten op
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, sales_count')
          .order('sales_count', { ascending: false })
          .limit(1);

        if (productsError) {
          // Als de kolom niet bestaat, probeer zonder sales_count
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('products')
            .select('id, name')
            .limit(1);

          if (!fallbackError && fallbackData && fallbackData.length > 0) {
            setTopProduct({
              id: fallbackData[0].id,
              name: fallbackData[0].name,
              sales_count: 0,
            });
          }
        } else if (productsData && productsData.length > 0) {
          setTopProduct({
            id: productsData[0].id,
            name: productsData[0].name,
            sales_count: productsData[0].sales_count || 0,
          });
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

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
      <AdminHeader userEmail={user.email} onSignOut={handleSignOut} />

      {/* Hero Section */}
      <section className="py-16">
        <div className="grid-12">
          <div className="col-12">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-black mb-4">Dashboard</h1>
              <p className="text-xl text-gray-700">Overzicht van je winkel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pb-8">
        <div className="grid-12">
          <div className="col-4">
            <div className="bg-white p-6 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Total Producten</p>
              {statsLoading ? (
                <p className="text-4xl font-bold text-gray-400">...</p>
              ) : (
                <p className="text-4xl font-bold text-black">{stats.totalProducts}</p>
              )}
            </div>
          </div>
          <div className="col-4">
            <div className="bg-white p-6 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Bestellingen</p>
              {statsLoading ? (
                <p className="text-4xl font-bold text-gray-400">...</p>
              ) : (
                <p className="text-4xl font-bold text-black">{stats.totalOrders}</p>
              )}
            </div>
          </div>
          <div className="col-4">
            <div className="bg-white p-6 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Gebruikers</p>
              {statsLoading ? (
                <p className="text-4xl font-bold text-gray-400">...</p>
              ) : (
                <p className="text-4xl font-bold text-black">{stats.totalUsers}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Snelle Acties */}
      <section className="py-8">
        <div className="grid-12">
          <div className="col-12 mb-6">
            <h2 className="font-bold text-black underline" style={{ fontSize: '26px' }}>Snelle Acties</h2>
          </div>

          <div className="col-3 mb-8">
            <Link href="/admin/products?action=new" className="block">
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-black transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nieuw</p>
                    <h3 className="text-xl font-bold text-black">Product</h3>
                  </div>
                  <div className="text-3xl">+</div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-3 mb-8">
            <Link href="/admin/orders?filter=today" className="block">
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-black transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Vandaag</p>
                    <h3 className="text-xl font-bold text-black">Bestellingen</h3>
                  </div>
                  <div className="text-3xl">→</div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-3 mb-8">
            <Link href="/admin/users?action=new" className="block">
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-black transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Nieuwe</p>
                    <h3 className="text-xl font-bold text-black">Gebruiker</h3>
                  </div>
                  <div className="text-3xl">+</div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-3 mb-8">
            <Link href="/admin/products" className="block">
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-black transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Beheer</p>
                    <h3 className="text-xl font-bold text-black">Categorieën</h3>
                  </div>
                  <div className="text-3xl">→</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recente Activiteit & Analytics */}
      <section className="py-8">
        <div className="grid-12">
          {/* Recente Bestellingen */}
          <div className="col-8 mb-8">
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h2 className="font-bold text-black mb-6" style={{ fontSize: '26px' }}>Recente Bestellingen</h2>
              {dataLoading ? (
                <div className="text-center py-8 text-gray-500">Laden...</div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nog geen bestellingen</div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order, index) => {
                    const isLast = index === recentOrders.length - 1;
                    const date = new Date(order.created_at);
                    const now = new Date();
                    const diffTime = Math.abs(now.getTime() - date.getTime());
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    
                    let timeText = '';
                    if (diffDays === 0) {
                      timeText = `Vandaag, ${date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
                    } else if (diffDays === 1) {
                      timeText = `Gisteren, ${date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
                    } else {
                      timeText = `${diffDays} dagen geleden`;
                    }

                    const getStatusStyle = (status: string) => {
                      switch (status.toLowerCase()) {
                        case 'paid':
                        case 'betaald':
                          return { bg: 'bg-green-100', text: 'text-green-800', label: 'Betaald' };
                        case 'pending':
                        case 'in behandeling':
                          return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In behandeling' };
                        case 'shipped':
                        case 'verzonden':
                          return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Verzonden' };
                        case 'delivered':
                        case 'afgeleverd':
                          return { bg: 'bg-green-100', text: 'text-green-800', label: 'Afgeleverd' };
                        default:
                          return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
                      }
                    };

                    const statusStyle = getStatusStyle(order.status);

                    return (
                      <div 
                        key={order.id} 
                        className={`flex items-center justify-between ${!isLast ? 'pb-4 border-b border-gray-100' : ''}`}
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-black">Bestelling {order.order_number}</p>
                          <p className="text-sm text-gray-600">
                            {order.items_count} item{order.items_count !== 1 ? 's' : ''} • €{order.total_amount.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block ${statusStyle.bg} ${statusStyle.text} px-3 py-1 rounded-full text-xs font-medium`}>
                            {statusStyle.label}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{timeText}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link 
                href="/admin/orders" 
                className="block text-center mt-6 text-gray-700 hover:text-black font-medium transition-colors"
              >
                Alle bestellingen bekijken →
              </Link>
            </div>
          </div>

          {/* Statistieken Overzicht */}
          <div className="col-4 mb-8">
            <div className="bg-white rounded-lg p-8 border border-gray-200 mb-6">
              <h3 className="font-bold text-black mb-4 text-lg">Verkopen Deze Week</h3>
              {dataLoading ? (
                <div className="text-center py-8 text-gray-500">Laden...</div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-4xl font-bold text-black mb-2">€{weekSales.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Afgelopen 7 dagen</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      Gedetailleerde analyse binnenkort beschikbaar
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="font-bold text-black mb-4 text-lg">Top Product</h3>
              {dataLoading ? (
                <div className="text-center py-4 text-gray-500">Laden...</div>
              ) : topProduct ? (
                <>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-black mb-1">{topProduct.name}</p>
                    <p className="text-sm text-gray-600">{topProduct.sales_count} keer verkocht</p>
                  </div>
                  <Link 
                    href="/admin/products" 
                    className="text-sm text-gray-700 hover:text-black font-medium transition-colors"
                  >
                    Alle producten →
                  </Link>
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">Nog geen verkopen</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

