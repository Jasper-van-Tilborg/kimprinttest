-- Workshop 2: Row Level Security Policies
-- Deze policies volgen de tutorial en zorgen voor veilige database toegang

-- PRODUCTS TABLE POLICIES

-- Drop existing policies first
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Public can view published products" ON products;
DROP POLICY IF EXISTS "Authenticated can view all products" ON products;
DROP POLICY IF EXISTS "Authenticated can create products" ON products;
DROP POLICY IF EXISTS "Authenticated can update products" ON products;
DROP POLICY IF EXISTS "Authenticated can delete products" ON products;

-- Enable Row Level Security (should already be enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- PUBLIC ACCESS: Anyone can view products (for public website)
-- Note: In de tutorial wordt is_hidden gebruikt, maar wij hebben geen is_hidden kolom
-- We maken het open voor iedereen om producten te zien
CREATE POLICY "Public can view products" ON products
  FOR SELECT
  USING (true);

-- AUTHENTICATED ACCESS: Logged-in users can see all products
CREATE POLICY "Authenticated can view all products" ON products
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ADMIN ACCESS: Only admins can create, update, delete
-- Check if user is admin via users table
CREATE POLICY "Admins can create products" ON products
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ORDERS TABLE POLICIES (keep existing but ensure they're correct)

-- Users can view their own orders (if user_id column exists)
-- Admins can view all orders
-- Only admins can create/update/delete orders

-- Verify policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('products', 'orders')
ORDER BY tablename, policyname;

