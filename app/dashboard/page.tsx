'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, Product, Category, Order, User } from '../../lib/database';
import ProductForm from '../components/ProductForm';

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [productsView, setProductsView] = useState<'all' | 'temporary-offers'>('all');
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(false);
  const [showTemporaryOffersModal, setShowTemporaryOffersModal] = useState(false);
  const [customers, setCustomers] = useState<User[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<{
    revenueOverTime: Array<{ month: string; revenue: number }>;
    ordersOverTime: Array<{ month: string; orders: number }>;
    topProducts: Array<{ product: { name: string; price: number }; sales: number }>;
    customerGrowth: Array<{ month: string; customers: number }>;
    orderStatusDistribution: Array<{ status: string; count: number; percentage: number }>;
    monthlyRevenue: { thisMonth: number; lastMonth: number; growth: number };
  } | null>(null);
  const [settings, setSettings] = useState({
    shopName: 'K-imprint',
    shopEmail: 'info@k-imprint.nl',
    shopPhone: '+31 6 12345678',
    shopAddress: 'Hoofdstraat 123, 1234 AB Amsterdam',
    currency: 'EUR',
    timezone: 'Europe/Amsterdam',
    language: 'nl',
    taxRate: 21,
    shippingCost: 5.95,
    freeShippingThreshold: 50,
    orderConfirmationEmail: true,
    customerRegistrationEmail: true,
    lowStockNotification: true,
    lowStockThreshold: 10,
    maintenanceMode: false,
    allowGuestCheckout: true,
    requireEmailVerification: false
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const user = localStorage.getItem('username');

    if (loggedIn === 'true' && userRole === 'admin' && user) {
      setIsLoggedIn(true);
      setUsername(user);
      loadDashboardData();
    } else {
      router.push('/login');
    }
  }, [router]);

  // Auto-open products submenu when products tab is active
  useEffect(() => {
    if (activeTab === 'products') {
      setProductsSubmenuOpen(true);
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, productsData, categoriesData, ordersData, customersData] = await Promise.all([
        db.getDashboardStats(),
        db.getProducts(),
        db.getCategories(),
        db.getOrders(),
        db.getCustomers()
      ]);
      setStats(dashboardStats);
      setProducts(productsData);
      setCategories(categoriesData);
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setCustomers(customersData);
      
      // Load analytics data separately to avoid blocking
      try {
        const analyticsDataResult = await db.getAnalyticsData();
        setAnalyticsData(analyticsDataResult);
      } catch (analyticsError) {
        console.error('Error loading analytics data:', analyticsError);
        // Set empty analytics data to prevent infinite loading
        setAnalyticsData({
          revenueOverTime: [],
          ordersOverTime: [],
          topProducts: [],
          customerGrowth: [],
          orderStatusDistribution: [],
          monthlyRevenue: { thisMonth: 0, lastMonth: 0, growth: 0 }
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const productsData = await db.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
      try {
        const success = await db.deleteProduct(productId);
        if (success) {
          await loadProducts();
          await loadDashboardData(); // Refresh stats
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Er is een fout opgetreden bij het verwijderen van het product');
      }
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      console.log('Saving product with data:', productData);
      
      if (editingProduct) {
        // Update existing product
        console.log('Updating existing product:', editingProduct.id);
        const updatedProduct = await db.updateProduct(editingProduct.id, productData);
        console.log('Product updated:', updatedProduct);
      } else {
        // Create new product
        console.log('Creating new product');
        const newProduct = await db.createProduct(productData);
        console.log('Product created:', newProduct);
      }
      
      console.log('Refreshing products list...');
      await loadProducts();
      await loadDashboardData(); // Refresh stats
      setShowAddProduct(false);
      setEditingProduct(null);
      console.log('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Er is een fout opgetreden bij het opslaan van het product: ' + (error instanceof Error ? error.message : 'Onbekende fout'));
    }
  };

  const handleCategoryAdded = async (newCategory: Category) => {
    // Refresh categories list
    const updatedCategories = await db.getCategories();
    setCategories(updatedCategories);
  };

  const handleToggleTemporaryOffer = async (productId: string, isTemporaryOffer: boolean) => {
    try {
      const success = await db.updateProduct(productId, { is_temporary_offer: isTemporaryOffer });
      if (success) {
        await loadProducts();
        await loadDashboardData(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Er is een fout opgetreden bij het bijwerken van het product');
    }
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status === '') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  const handleViewCustomer = async (customer: User) => {
    setSelectedCustomer(customer);
    try {
      const orders = await db.getCustomerOrders(customer.id);
      setCustomerOrders(orders);
      setShowCustomerDetails(true);
    } catch (error) {
      console.error('Error loading customer orders:', error);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm('Weet je zeker dat je deze klant wilt verwijderen?')) {
      try {
        const success = await db.deleteCustomer(customerId);
        if (success) {
          setCustomers(customers.filter(c => c.id !== customerId));
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Er is een fout opgetreden bij het verwijderen van de klant');
      }
    }
  };

  const getFilteredProducts = () => {
    let filteredProducts = products;
    
    // Filter by view type
    if (productsView === 'temporary-offers') {
      filteredProducts = products.filter(product => product.is_temporary_offer);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category_id === selectedCategory);
    }
    
    return filteredProducts;
  };

  const getProductsByCategory = () => {
    const filteredProducts = getFilteredProducts();
    const groupedProducts: { [key: string]: Product[] } = {};
    
    filteredProducts.forEach(product => {
      const categoryId = product.category_id || 'uncategorized';
      const categoryName = categories.find(cat => cat.id === categoryId)?.name || 'Ongecategoriseerd';
      
      if (!groupedProducts[categoryName]) {
        groupedProducts[categoryName] = [];
      }
      groupedProducts[categoryName].push(product);
    });
    
    return groupedProducts;
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  const handleSettingsChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSettingsLoading(true);
    try {
      // Simulate API call - in real app you'd save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  if (!isLoggedIn || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 border-blue-600"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', name: 'Overzicht', icon: '📊' },
    { id: 'orders', name: 'Bestellingen', icon: '📦' },
    { id: 'products', name: 'Producten', icon: '🛍️' },
    { id: 'customers', name: 'Klanten', icon: '👥' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'settings', name: 'Instellingen', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">K-imprint</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              {item.id === 'products' ? (
                <div>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setProductsSubmenuOpen(!productsSubmenuOpen);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform ${productsSubmenuOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Submenu */}
                  {productsSubmenuOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab('products');
                          setProductsView('all');
                        }}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          activeTab === 'products' && productsView === 'all'
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-3 text-sm">📦</span>
                        Alle Producten
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('products');
                          setProductsView('temporary-offers');
                        }}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          activeTab === 'products' && productsView === 'temporary-offers'
                            ? 'bg-orange-100 text-orange-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-3 text-sm">🎯</span>
                        Tijdelijke Offers
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600 font-medium text-sm">{username.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{username}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Uitloggen
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                {sidebarItems.find(item => item.id === activeTab)?.name}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => window.open('/', '_blank')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                ← Website
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                🔄 Vernieuwen
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome message */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welkom terug, {username}!</h2>
                <p className="text-gray-600">Hier is een overzicht van je webshop vandaag.</p>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Totaal Orders</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Omzet</p>
                      <p className="text-2xl font-semibold text-gray-900">€{stats.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Producten</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Categorieën</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recente Bestellingen</h3>
                </div>
                <div className="p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Geen bestellingen</h3>
                  <p className="mt-1 text-sm text-gray-500">Er zijn nog geen bestellingen geplaatst.</p>
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Eerste bestelling bekijken
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Bestellingen</h2>
                  <p className="text-gray-600">Beheer alle bestellingen</p>
                </div>
                <div className="flex space-x-3">
                  <select 
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  >
                    <option value="">Alle statussen</option>
                    <option value="pending">In behandeling</option>
                    <option value="processing">Verwerkt</option>
                    <option value="shipped">Verzonden</option>
                    <option value="delivered">Bezorgd</option>
                    <option value="cancelled">Geannuleerd</option>
                  </select>
                  <div className="text-sm text-gray-500 flex items-center">
                    {filteredOrders.length} bestelling{filteredOrders.length !== 1 ? 'en' : ''}
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Betaling</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Totaal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="text-gray-500">
                              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              <p className="text-lg font-medium">
                                {orders.length === 0 ? 'Geen bestellingen gevonden' : 'Geen bestellingen met deze status'}
                              </p>
                              <p className="text-sm">
                                {orders.length === 0 ? 'Er zijn nog geen bestellingen geplaatst' : 'Probeer een andere status filter'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">#{order.order_number}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{order.first_name} {order.last_name}</div>
                              <div className="text-sm text-gray-500">{order.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status === 'pending' ? 'In behandeling' :
                                 order.status === 'processing' ? 'Verwerkt' :
                                 order.status === 'shipped' ? 'Verzonden' :
                                 order.status === 'delivered' ? 'Bezorgd' :
                                 order.status === 'cancelled' ? 'Geannuleerd' :
                                 order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.payment_status === 'paid' ? 'Betaald' :
                                 order.payment_status === 'pending' ? 'In behandeling' :
                                 order.payment_status === 'failed' ? 'Mislukt' :
                                 order.payment_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              €{order.total_amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString('nl-NL')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  Bekijk
                                </button>
                                <button className="text-green-600 hover:text-green-900">
                                  Bewerk
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  Verwijder
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {filteredOrders.length > 0 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Vorige
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Volgende
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Toont <span className="font-medium">1</span> tot <span className="font-medium">{filteredOrders.length}</span> van <span className="font-medium">{filteredOrders.length}</span> resultaten
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          Vorige
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          1
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          Volgende
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Producten</h2>
                  <p className="text-gray-600">
                    {productsView === 'all' 
                      ? 'Beheer je productcatalogus per categorie' 
                      : 'Beheer producten die als tijdelijke aanbiedingen worden getoond'
                    }
                  </p>
                </div>
                <div className="flex space-x-3">
                  {productsView === 'all' && (
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    >
                      <option value="all">Alle categorieën</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                      <option value="uncategorized">Ongecategoriseerd</option>
                    </select>
                  )}
                  {productsView === 'temporary-offers' && (
                    <button
                      onClick={() => setShowTemporaryOffersModal(true)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Beheer Offers
                    </button>
                  )}
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Nieuw Product
                  </button>
                </div>
              </div>

              {/* Products by Category */}
              {(() => {
                const groupedProducts = getProductsByCategory();
                const categoryNames = Object.keys(groupedProducts);
                
                if (categoryNames.length === 0) {
                  return (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                      <div className="text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-lg font-medium">Geen producten gevonden</p>
                        <p className="text-sm">Voeg je eerste product toe om te beginnen</p>
                      </div>
                    </div>
                  );
                }

                return categoryNames.map((categoryName) => (
                  <div key={categoryName} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">{categoryName}</h3>
                      <p className="text-sm text-gray-500">{groupedProducts[categoryName].length} product{groupedProducts[categoryName].length !== 1 ? 'en' : ''}</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prijs</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voorraad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {groupedProducts[categoryName].map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {product.images && product.images.length > 0 ? (
                                    <img
                                      src={product.images[0].url}
                                      alt={product.images[0].alt_text || product.name}
                                      className="h-10 w-10 rounded-lg object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                  ) : null}
                                  <div className={`h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center ${product.images && product.images.length > 0 ? 'hidden' : ''}`}>
                                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.sku || 'Geen SKU'}</div>
                                </div>
                              </div>
                            </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                €{product.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.track_quantity ? product.quantity : '∞'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  product.is_active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {product.is_active ? 'Actief' : 'Inactief'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => setEditingProduct(product)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Bewerken
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Verwijderen
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ));
              })()}
              
              {/* Info Box for Temporary Offers */}
              {productsView === 'temporary-offers' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-orange-800">
                        Over tijdelijke offers
                      </h3>
                      <div className="mt-2 text-sm text-orange-700">
                        <p>
                          Producten gemarkeerd als &quot;tijdelijke aanbieding&quot; worden getoond in de carrousel op de hoofdpagina. 
                          Ze behouden hun originele categorie en kunnen tegelijkertijd in beide secties worden beheerd.
                        </p>
                        <p className="mt-1">
                          <strong>Huidige status:</strong> {products.filter(p => p.is_temporary_offer).length} producten gemarkeerd als tijdelijke aanbieding
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Klanten</h2>
                  <p className="text-gray-600">Beheer je klantenbestand</p>
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  {customers.length} klant{customers.length !== 1 ? 'en' : ''}
                </div>
              </div>

              {/* Customers Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Klant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lid sinds</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laatste bestelling</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Totaal besteed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <div className="text-gray-500">
                              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                              <p className="text-lg font-medium">Geen klanten gevonden</p>
                              <p className="text-sm">Er zijn nog geen klanten geregistreerd</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer) => {
                          const customerOrderHistory = orders.filter(order => order.user_id === customer.id);
                          const totalSpent = customerOrderHistory.reduce((sum, order) => sum + order.total_amount, 0);
                          const lastOrder = customerOrderHistory.length > 0 ? customerOrderHistory[0] : null;
                          
                          return (
                            <tr key={customer.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-sm font-medium text-gray-700">
                                        {customer.first_name?.[0] || customer.email[0].toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {customer.first_name && customer.last_name 
                                        ? `${customer.first_name} ${customer.last_name}`
                                        : 'Naam niet bekend'
                                      }
                                    </div>
                                    <div className="text-sm text-gray-500">ID: {customer.id.slice(0, 8)}...</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{customer.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(customer.created_at).toLocaleDateString('nl-NL')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {lastOrder ? (
                                  <div>
                                    <div>#{lastOrder.order_number}</div>
                                    <div className="text-xs text-gray-400">
                                      {new Date(lastOrder.created_at).toLocaleDateString('nl-NL')}
                                    </div>
                                  </div>
                                ) : (
                                  'Geen bestellingen'
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                €{totalSpent.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewCustomer(customer)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Bekijk
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCustomer(customer.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Verwijder
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
                  <p className="text-gray-600">Inzicht in je webshop prestaties</p>
                </div>
                <div className="text-sm text-gray-500">
                  Laatste update: {new Date().toLocaleDateString('nl-NL')}
                </div>
              </div>

              {!analyticsData ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Analytics data laden...</p>
                    <button 
                      onClick={() => {
                        setAnalyticsData({
                          revenueOverTime: [],
                          ordersOverTime: [],
                          topProducts: [],
                          customerGrowth: [],
                          orderStatusDistribution: [],
                          monthlyRevenue: { thisMonth: 0, lastMonth: 0, growth: 0 }
                        });
                      }}
                      className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Overslaan en lege data tonen
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">Omzet deze maand</p>
                          <p className="text-2xl font-semibold text-gray-900">
                            €{analyticsData.monthlyRevenue.thisMonth.toFixed(2)}
                          </p>
                          <p className={`text-sm ${analyticsData.monthlyRevenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {analyticsData.monthlyRevenue.growth >= 0 ? '↗' : '↘'} {Math.abs(analyticsData.monthlyRevenue.growth)}% vs vorige maand
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">Totaal bestellingen</p>
                          <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                          <p className="text-sm text-gray-500">Alle tijd</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">Totaal klanten</p>
                          <p className="text-2xl font-semibold text-gray-900">{customers.length}</p>
                          <p className="text-sm text-gray-500">Geregistreerd</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500">Actieve producten</p>
                          <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                          <p className="text-sm text-gray-500">In catalogus</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Omzet over tijd</h3>
                      <div className="h-64 flex items-end space-x-2">
                        {analyticsData.revenueOverTime.map((item, index: number) => {
                          const maxRevenue = Math.max(...analyticsData.revenueOverTime.map((r) => r.revenue))
                          const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-blue-500 rounded-t"
                                style={{ height: `${height}%`, minHeight: '4px' }}
                              ></div>
                              <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                                {item.month}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                €{item.revenue.toFixed(0)}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Orders Chart */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Bestellingen over tijd</h3>
                      <div className="h-64 flex items-end space-x-2">
                        {analyticsData.ordersOverTime.map((item, index: number) => {
                          const maxOrders = Math.max(...analyticsData.ordersOverTime.map((o) => o.orders))
                          const height = maxOrders > 0 ? (item.orders / maxOrders) * 100 : 0
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-green-500 rounded-t"
                                style={{ height: `${height}%`, minHeight: '4px' }}
                              ></div>
                              <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                                {item.month}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {item.orders}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Top verkopende producten</h3>
                      <div className="space-y-3">
                        {analyticsData.topProducts.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">Geen verkoopdata beschikbaar</p>
                        ) : (
                          analyticsData.topProducts.map((item, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                                  <p className="text-xs text-gray-500">€{item.product.price.toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">{item.sales}</p>
                                <p className="text-xs text-gray-500">verkocht</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Order Status Distribution */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Bestelling status verdeling</h3>
                      <div className="space-y-3">
                        {analyticsData.orderStatusDistribution.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">Geen bestellingen</p>
                        ) : (
                          analyticsData.orderStatusDistribution.map((item, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 ${
                                  item.status === 'In behandeling' ? 'bg-yellow-400' :
                                  item.status === 'Verwerkt' ? 'bg-blue-400' :
                                  item.status === 'Verzonden' ? 'bg-purple-400' :
                                  item.status === 'Bezorgd' ? 'bg-green-400' :
                                  item.status === 'Geannuleerd' ? 'bg-red-400' :
                                  'bg-gray-400'
                                }`}></div>
                                <span className="text-sm text-gray-900">{item.status}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">{item.count}</p>
                                <p className="text-xs text-gray-500">{item.percentage}%</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Instellingen</h2>
                  <p className="text-gray-600">Beheer je webshop configuratie</p>
                </div>
                <div className="flex space-x-3">
                  {settingsSaved && (
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Instellingen opgeslagen
                    </div>
                  )}
                  <button
                    onClick={handleSaveSettings}
                    disabled={settingsLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {settingsLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Opslaan...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Opslaan
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Settings Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shop Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Winkel Informatie
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Winkelnaam</label>
                      <input
                        type="text"
                        value={settings.shopName}
                        onChange={(e) => handleSettingsChange('shopName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres</label>
                      <input
                        type="email"
                        value={settings.shopEmail}
                        onChange={(e) => handleSettingsChange('shopEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer</label>
                      <input
                        type="tel"
                        value={settings.shopPhone}
                        onChange={(e) => handleSettingsChange('shopPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                      <textarea
                        value={settings.shopAddress}
                        onChange={(e) => handleSettingsChange('shopAddress', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Regional Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Regio & Taal
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valuta</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleSettingsChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tijdzone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        <option value="Europe/Amsterdam">Europa/Amsterdam</option>
                        <option value="Europe/London">Europa/Londen</option>
                        <option value="America/New_York">Amerika/New York</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Taal</label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingsChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      >
                        <option value="nl">Nederlands</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tax & Shipping */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Belasting & Verzending
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">BTW Percentage</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={settings.taxRate}
                          onChange={(e) => handleSettingsChange('taxRate', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 pr-8"
                        />
                        <span className="absolute right-3 top-2 text-gray-500">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Verzendkosten</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">€</span>
                        <input
                          type="number"
                          step="0.01"
                          value={settings.shippingCost}
                          onChange={(e) => handleSettingsChange('shippingCost', parseFloat(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gratis verzending vanaf</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">€</span>
                        <input
                          type="number"
                          step="0.01"
                          value={settings.freeShippingThreshold}
                          onChange={(e) => handleSettingsChange('freeShippingThreshold', parseFloat(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    E-mail Instellingen
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Bestelling bevestiging e-mail</label>
                        <p className="text-xs text-gray-500">Stuur automatisch e-mail bij nieuwe bestelling</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.orderConfirmationEmail}
                          onChange={(e) => handleSettingsChange('orderConfirmationEmail', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Klant registratie e-mail</label>
                        <p className="text-xs text-gray-500">Stuur welkomst e-mail bij nieuwe registratie</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.customerRegistrationEmail}
                          onChange={(e) => handleSettingsChange('customerRegistrationEmail', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Lage voorraad notificatie</label>
                        <p className="text-xs text-gray-500">Stuur e-mail bij lage voorraad</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.lowStockNotification}
                          onChange={(e) => handleSettingsChange('lowStockNotification', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lage voorraad drempel</label>
                      <input
                        type="number"
                        value={settings.lowStockThreshold}
                        onChange={(e) => handleSettingsChange('lowStockThreshold', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Store Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Winkel Instellingen
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Onderhoudsmodus</label>
                        <p className="text-xs text-gray-500">Tijdelijk de winkel sluiten voor onderhoud</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) => handleSettingsChange('maintenanceMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Gast checkout toestaan</label>
                        <p className="text-xs text-gray-500">Klanten kunnen bestellen zonder account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.allowGuestCheckout}
                          onChange={(e) => handleSettingsChange('allowGuestCheckout', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">E-mail verificatie vereist</label>
                        <p className="text-xs text-gray-500">Klanten moeten e-mail verifiëren bij registratie</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.requireEmailVerification}
                          onChange={(e) => handleSettingsChange('requireEmailVerification', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-400">
                <h3 className="text-lg font-medium text-red-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Gevaarlijke Zone
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-red-900">Database Reset</h4>
                      <p className="text-sm text-red-700">Verwijder alle data en start opnieuw (kan niet ongedaan worden gemaakt)</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                      Reset Database
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-red-900">Alle Producten Verwijderen</h4>
                      <p className="text-sm text-red-700">Verwijder alle producten uit de catalogus</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                      Verwijder Producten
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
            </main>
          </div>

          {/* Product Form Modal */}
          {(showAddProduct || editingProduct) && (
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSave={handleSaveProduct}
              onCancel={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
              }}
              onCategoryAdded={handleCategoryAdded}
            />
          )}

          {/* Customer Details Modal */}
          {showCustomerDetails && selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {selectedCustomer.first_name && selectedCustomer.last_name 
                          ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
                          : 'Klant Details'
                        }
                      </h2>
                      <p className="text-gray-600">{selectedCustomer.email}</p>
                    </div>
                    <button
                      onClick={() => setShowCustomerDetails(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Klant Informatie</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Naam:</span>
                          <span className="ml-2 text-sm text-gray-900">
                            {selectedCustomer.first_name && selectedCustomer.last_name 
                              ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
                              : 'Niet opgegeven'
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Email:</span>
                          <span className="ml-2 text-sm text-gray-900">{selectedCustomer.email}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Lid sinds:</span>
                          <span className="ml-2 text-sm text-gray-900">
                            {new Date(selectedCustomer.created_at).toLocaleDateString('nl-NL')}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Klant ID:</span>
                          <span className="ml-2 text-sm text-gray-900 font-mono">{selectedCustomer.id}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Bestellingen Overzicht</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Totaal bestellingen:</span>
                          <span className="ml-2 text-sm text-gray-900">{customerOrders.length}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Totaal besteed:</span>
                          <span className="ml-2 text-sm text-gray-900">
                            €{customerOrders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Laatste bestelling:</span>
                          <span className="ml-2 text-sm text-gray-900">
                            {customerOrders.length > 0 
                              ? new Date(customerOrders[0].created_at).toLocaleDateString('nl-NL')
                              : 'Geen bestellingen'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Orders History */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Bestellingen Geschiedenis</h3>
                    {customerOrders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p>Geen bestellingen gevonden</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Betaling</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Totaal</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {customerOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  #{order.order_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.status === 'pending' ? 'In behandeling' :
                                     order.status === 'processing' ? 'Verwerkt' :
                                     order.status === 'shipped' ? 'Verzonden' :
                                     order.status === 'delivered' ? 'Bezorgd' :
                                     order.status === 'cancelled' ? 'Geannuleerd' :
                                     order.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                    order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.payment_status === 'paid' ? 'Betaald' :
                                     order.payment_status === 'pending' ? 'In behandeling' :
                                     order.payment_status === 'failed' ? 'Mislukt' :
                                     order.payment_status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  €{order.total_amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(order.created_at).toLocaleDateString('nl-NL')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Temporary Offers Management Modal */}
          {showTemporaryOffersModal && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                        <span className="text-orange-500 mr-2">🎯</span>
                        Beheer Tijdelijke Offers
                      </h2>
                      <p className="text-gray-600">Selecteer welke producten als tijdelijke aanbiedingen worden getoond</p>
                    </div>
                    <button
                      onClick={() => setShowTemporaryOffersModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div key={product.id} className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                        product.is_temporary_offer 
                          ? 'border-orange-300 bg-orange-50/80 backdrop-blur-sm' 
                          : 'border-gray-200 bg-white/80 backdrop-blur-sm hover:border-orange-200'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-500">€{product.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-400">{product.sku || 'Geen SKU'}</p>
                          </div>
                          <div className="flex-shrink-0 ml-3">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0].url}
                                alt={product.images[0].alt_text || product.name}
                                className="h-12 w-12 rounded-lg object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center ${product.images && product.images.length > 0 ? 'hidden' : ''}`}>
                              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.is_temporary_offer 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {product.is_temporary_offer ? 'Tijdelijke Offer' : 'Normaal Product'}
                          </span>
                          <button
                            onClick={() => handleToggleTemporaryOffer(product.id, !product.is_temporary_offer)}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${
                              product.is_temporary_offer
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            }`}
                          >
                            {product.is_temporary_offer ? 'Verwijder uit Offers' : 'Voeg toe aan Offers'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setShowTemporaryOffersModal(false)}
                      className="px-6 py-2 text-sm font-medium text-gray-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors border border-orange-200"
                    >
                      Sluiten
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
