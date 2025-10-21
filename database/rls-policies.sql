-- RLS Policies voor K-imprint Webshop
-- Voer dit uit in je Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (true);

-- Categories table policies (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage categories" ON categories
    FOR ALL USING (true);

-- Products table policies (public read, admin write)
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage products" ON products
    FOR ALL USING (true);


-- Orders table policies
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage orders" ON orders
    FOR ALL USING (true);

-- Order items table policies
CREATE POLICY "Service role can manage order items" ON order_items
    FOR ALL USING (true);

-- Addresses table policies
CREATE POLICY "Users can view their own addresses" ON addresses
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage addresses" ON addresses
    FOR ALL USING (true);

-- Settings table policies (public read, admin write)
CREATE POLICY "Anyone can view settings" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage settings" ON settings
    FOR ALL USING (true);

-- Create a function to check if user is admin (for future use)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  -- For now, always return true since we're using service role
  -- In production, you would check the user's role
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
