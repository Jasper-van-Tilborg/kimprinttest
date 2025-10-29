-- Simpelere aanpak zonder recursie problemen
-- We gebruiken alleen de "view own profile" policy voor users check

-- Voor ORDERS: alleen count is nodig, geen circulaire referentie
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;

CREATE POLICY "Service role can view all orders" ON orders
  FOR ALL
  USING (auth.role() = 'service_role');

-- Voor PRODUCTS: Iedereen kan zien, admins kunnen alles
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

CREATE POLICY "Anyone can view products" ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage products" ON products
  FOR ALL
  USING (auth.role() = 'service_role');

-- Verify
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('products', 'orders', 'users')
ORDER BY tablename, policyname;

