import { supabase } from './supabase'

// Types
export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  password_hash?: string
  role: 'admin' | 'customer'
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  url: string
  alt_text?: string
  sort_order: number
  is_primary: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_price?: number
  cost_price?: number
  sku?: string
  barcode?: string
  track_quantity: boolean
  quantity: number
  weight?: number
  requires_shipping: boolean
  taxable: boolean
  is_active: boolean
  is_digital: boolean
  is_temporary_offer: boolean
  category_id?: string
  images: ProductImage[]
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id?: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  subtotal: number
  tax_amount: number
  shipping_amount: number
  total_amount: number
  currency: string
  notes?: string
  created_at: string
  updated_at: string
}

// Database functions
export const db = {
  // Users
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) return null
    return data
  },

  async authenticateUser(email: string, password: string): Promise<User | null> {
    // Voor nu een simpele check - in productie zou je bcrypt gebruiken
    const user = await this.getUserByEmail(email);
    if (user && user.password_hash === password) {
      return user;
    }
    return null;
  },

  async createUser(userData: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) return null
    return data
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (error) return []
    return data || []
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    
    if (error) return null
    return data
  },

  // Products
  async getProducts(categoryId?: string): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }
    
    const { data, error } = await query
    
    if (error) return []
    return data || []
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    
    if (error) return null
    return data
  },

  async createProduct(productData: Partial<Product>): Promise<Product | null> {
    console.log('Creating product in database:', productData);
    
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()
    
    if (error) {
      console.error('Database error creating product:', error);
      throw error;
    }
    
    console.log('Product created successfully:', data);
    return data
  },

  async createCategory(categoryData: Partial<Category>): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()
    
    if (error) return null
    return data
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) return null
    return data
  },

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    return !error
  },

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) return []
    return data || []
  },

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  },

  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    
    if (error) return null
    return data
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
    
    return !error
  },

  // Customers
  async getCustomers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'customer')
      .order('created_at', { ascending: false })
    
    if (error) return []
    return data || []
  },

  async getCustomerById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .eq('role', 'customer')
      .single()
    
    if (error) return null
    return data
  },

  async updateCustomer(id: string, customerData: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update({ ...customerData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('role', 'customer')
      .select()
      .single()
    
    if (error) return null
    return data
  },

  async deleteCustomer(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .eq('role', 'customer')
    
    return !error
  },

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', customerId)
      .order('created_at', { ascending: false })
    
    if (error) return []
    return data || []
  },

  // Analytics
  async getAnalyticsData() {
    try {
      const [ordersResult, productsResult, customersResult] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*'),
        supabase.from('users').select('*').eq('role', 'customer')
      ])

      const orders = ordersResult.data || []
      const products = productsResult.data || []
      const customers = customersResult.data || []

      // Revenue over time (last 12 months)
      const revenueOverTime = this.calculateRevenueOverTime(orders)
      
      // Orders over time (last 12 months)
      const ordersOverTime = this.calculateOrdersOverTime(orders)
      
      // Top selling products
      const topProducts = this.calculateTopProducts(orders, products)
      
      // Customer growth
      const customerGrowth = this.calculateCustomerGrowth(customers)
      
      // Order status distribution
      const orderStatusDistribution = this.calculateOrderStatusDistribution(orders)
      
      // Monthly revenue comparison
      const monthlyRevenue = this.calculateMonthlyRevenue(orders)

      return {
        revenueOverTime,
        ordersOverTime,
        topProducts,
        customerGrowth,
        orderStatusDistribution,
        monthlyRevenue
      }
    } catch (error) {
      console.error('Error in getAnalyticsData:', error)
      // Return empty data structure on error
      return {
        revenueOverTime: [],
        ordersOverTime: [],
        topProducts: [],
        customerGrowth: [],
        orderStatusDistribution: [],
        monthlyRevenue: { thisMonth: 0, lastMonth: 0, growth: 0 }
      }
    }
  },

  calculateRevenueOverTime(orders: Order[]) {
    try {
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        return {
          month: date.toLocaleDateString('nl-NL', { month: 'short', year: '2-digit' }),
          revenue: 0
        }
      }).reverse()

      orders.forEach(order => {
        try {
          const orderDate = new Date(order.created_at)
          const monthIndex = 11 - (new Date().getMonth() - orderDate.getMonth() + (new Date().getFullYear() - orderDate.getFullYear()) * 12)
          if (monthIndex >= 0 && monthIndex < 12) {
            last12Months[monthIndex].revenue += order.total_amount || 0
          }
        } catch (error) {
          console.error('Error processing order for revenue calculation:', error)
        }
      })

      return last12Months
    } catch (error) {
      console.error('Error in calculateRevenueOverTime:', error)
      return []
    }
  },

  calculateOrdersOverTime(orders: Order[]) {
    try {
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        return {
          month: date.toLocaleDateString('nl-NL', { month: 'short', year: '2-digit' }),
          orders: 0
        }
      }).reverse()

      orders.forEach(order => {
        try {
          const orderDate = new Date(order.created_at)
          const monthIndex = 11 - (new Date().getMonth() - orderDate.getMonth() + (new Date().getFullYear() - orderDate.getFullYear()) * 12)
          if (monthIndex >= 0 && monthIndex < 12) {
            last12Months[monthIndex].orders += 1
          }
        } catch (error) {
          console.error('Error processing order for orders calculation:', error)
        }
      })

      return last12Months
    } catch (error) {
      console.error('Error in calculateOrdersOverTime:', error)
      return []
    }
  },

  calculateTopProducts(orders: Order[], products: Product[]) {
    try {
      // This is a simplified version - in a real app you'd have order_items table
      const productSales: { [key: string]: { product: Product, sales: number } } = {}
      
      products.forEach(product => {
        productSales[product.id] = { product, sales: 0 }
      })

      // Simulate product sales based on orders (in reality you'd use order_items)
      orders.forEach(order => {
        try {
          // Randomly assign some products to orders for demo
          const randomProducts = products.slice(0, Math.floor(Math.random() * 3) + 1)
          randomProducts.forEach(product => {
            if (productSales[product.id]) {
              productSales[product.id].sales += Math.floor(Math.random() * 5) + 1
            }
          })
        } catch (error) {
          console.error('Error processing order for top products calculation:', error)
        }
      })

      return Object.values(productSales)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)
    } catch (error) {
      console.error('Error in calculateTopProducts:', error)
      return []
    }
  },

  calculateCustomerGrowth(customers: User[]) {
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return {
        month: date.toLocaleDateString('nl-NL', { month: 'short', year: '2-digit' }),
        customers: 0
      }
    }).reverse()

    customers.forEach(customer => {
      const customerDate = new Date(customer.created_at)
      const monthIndex = 11 - (new Date().getMonth() - customerDate.getMonth() + (new Date().getFullYear() - customerDate.getFullYear()) * 12)
      if (monthIndex >= 0 && monthIndex < 12) {
        last12Months[monthIndex].customers += 1
      }
    })

    return last12Months
  },

  calculateOrderStatusDistribution(orders: Order[]) {
    const statusCounts: { [key: string]: number } = {}
    
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
    })

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status === 'pending' ? 'In behandeling' :
              status === 'processing' ? 'Verwerkt' :
              status === 'shipped' ? 'Verzonden' :
              status === 'delivered' ? 'Bezorgd' :
              status === 'cancelled' ? 'Geannuleerd' : status,
      count,
      percentage: Math.round((count / orders.length) * 100) || 0
    }))
  },

  calculateMonthlyRevenue(orders: Order[]) {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const thisMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })
    
    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at)
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear
    })

    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total_amount, 0)
    
    const growth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

    return {
      thisMonth: thisMonthRevenue,
      lastMonth: lastMonthRevenue,
      growth: Math.round(growth * 100) / 100
    }
  },

  // Special offers/products with discounts
  async getSpecialOffers(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_temporary_offer', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6)
    
    if (error) return []
    return data || []
  },

  // Get products for homepage carousel
  async getHomepageProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6)
    
    if (error) return []
    return data || []
  },

  // Dashboard stats
  async getDashboardStats() {
    const [ordersResult, productsResult, categoriesResult, customersResult] = await Promise.all([
      supabase.from('orders').select('id, total_amount'),
      supabase.from('products').select('id').eq('is_active', true),
      supabase.from('categories').select('id').eq('is_active', true),
      supabase.from('users').select('id').eq('role', 'customer')
    ])

    const totalOrders = ordersResult.data?.length || 0
    const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0
    const totalProducts = productsResult.data?.length || 0
    const totalCategories = categoriesResult.data?.length || 0
    const totalCustomers = customersResult.data?.length || 0

    return {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCategories,
      totalCustomers
    }
  }
}
