-- ============================================
-- FIX ALL RLS POLICIES
-- Dit script verwijdert alle oude policies en maakt nieuwe aan
-- zonder infinite recursion problemen
-- ============================================

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Verwijder alle oude user policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Maak een functie aan om te checken of een user admin is
-- Dit voorkomt infinite recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy: Gebruikers kunnen hun eigen profiel zien
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT 
  USING (auth.uid() = id OR is_admin());

-- Policy: Admins kunnen alle gebruikers bijwerken
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE 
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policy: Admins kunnen gebruikers verwijderen (behalve zichzelf)
CREATE POLICY "Admins can delete users" ON users
  FOR DELETE 
  USING (is_admin() AND id != auth.uid());

-- ============================================
-- ORDERS TABLE POLICIES
-- ============================================

-- Verwijder oude order policies
DROP POLICY IF EXISTS "Admins kunnen alle bestellingen zien" ON orders;
DROP POLICY IF EXISTS "Admins kunnen bestellingen toevoegen" ON orders;
DROP POLICY IF EXISTS "Admins kunnen bestellingen bewerken" ON orders;
DROP POLICY IF EXISTS "Admins kunnen bestellingen verwijderen" ON orders;
DROP POLICY IF EXISTS "Admins can view orders" ON orders;
DROP POLICY IF EXISTS "Admins can insert orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;

-- Policy: Admins kunnen alle bestellingen zien
CREATE POLICY "Admins can view orders" ON orders
  FOR SELECT 
  USING (is_admin());

-- Policy: Admins kunnen bestellingen toevoegen
CREATE POLICY "Admins can insert orders" ON orders
  FOR INSERT 
  WITH CHECK (is_admin());

-- Policy: Admins kunnen bestellingen bewerken
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE 
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policy: Admins kunnen bestellingen verwijderen
CREATE POLICY "Admins can delete orders" ON orders
  FOR DELETE 
  USING (is_admin());

-- ============================================
-- ORDER_ITEMS TABLE POLICIES
-- ============================================

-- Verwijder oude order_items policies
DROP POLICY IF EXISTS "Admins kunnen alle order items zien" ON order_items;
DROP POLICY IF EXISTS "Admins kunnen order items toevoegen" ON order_items;
DROP POLICY IF EXISTS "Admins kunnen order items bewerken" ON order_items;
DROP POLICY IF EXISTS "Admins kunnen order items verwijderen" ON order_items;
DROP POLICY IF EXISTS "Admins can view order items" ON order_items;
DROP POLICY IF EXISTS "Admins can insert order items" ON order_items;
DROP POLICY IF EXISTS "Admins can update order items" ON order_items;
DROP POLICY IF EXISTS "Admins can delete order items" ON order_items;

-- Policy: Admins kunnen alle order items zien
CREATE POLICY "Admins can view order items" ON order_items
  FOR SELECT 
  USING (is_admin());

-- Policy: Admins kunnen order items toevoegen
CREATE POLICY "Admins can insert order items" ON order_items
  FOR INSERT 
  WITH CHECK (is_admin());

-- Policy: Admins kunnen order items bewerken
CREATE POLICY "Admins can update order items" ON order_items
  FOR UPDATE 
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policy: Admins kunnen order items verwijderen
CREATE POLICY "Admins can delete order items" ON order_items
  FOR DELETE 
  USING (is_admin());

-- ============================================
-- PRODUCTS TABLE POLICIES
-- ============================================

-- Verwijder oude product policies
DROP POLICY IF EXISTS "Iedereen kan producten zien" ON products;
DROP POLICY IF EXISTS "Alleen admins kunnen producten toevoegen" ON products;
DROP POLICY IF EXISTS "Alleen admins kunnen producten bewerken" ON products;
DROP POLICY IF EXISTS "Alleen admins kunnen producten verwijderen" ON products;
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Policy: Iedereen kan producten zien
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT 
  USING (true);

-- Policy: Alleen admins kunnen producten toevoegen
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT 
  WITH CHECK (is_admin());

-- Policy: Alleen admins kunnen producten bewerken
CREATE POLICY "Admins can update products" ON products
  FOR UPDATE 
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policy: Alleen admins kunnen producten verwijderen
CREATE POLICY "Admins can delete products" ON products
  FOR DELETE 
  USING (is_admin());

-- ============================================
-- CATEGORIES TABLE POLICIES
-- ============================================

-- Verwijder oude category policies
DROP POLICY IF EXISTS "Iedereen kan categorieën lezen" ON categories;
DROP POLICY IF EXISTS "Alleen admins kunnen categorieën toevoegen" ON categories;
DROP POLICY IF EXISTS "Alleen admins kunnen categorieën bewerken" ON categories;
DROP POLICY IF EXISTS "Alleen admins kunnen categorieën verwijderen" ON categories;
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

-- Policy: Iedereen kan categorieën zien
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT 
  USING (true);

-- Policy: Alleen admins kunnen categorieën toevoegen
CREATE POLICY "Admins can insert categories" ON categories
  FOR INSERT 
  WITH CHECK (is_admin());

-- Policy: Alleen admins kunnen categorieën bewerken
CREATE POLICY "Admins can update categories" ON categories
  FOR UPDATE 
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policy: Alleen admins kunnen categorieën verwijderen
CREATE POLICY "Admins can delete categories" ON categories
  FOR DELETE 
  USING (is_admin());

-- ============================================
-- KLAAR!
-- ============================================

