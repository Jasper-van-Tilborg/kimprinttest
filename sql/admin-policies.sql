-- RLS Policies voor products (admin kan alles zien/doen)
DROP POLICY IF EXISTS "Admins can manage products" ON products;

CREATE POLICY "Admins can view all products" ON products
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    OR true  -- Iedereen kan producten zien
  );

CREATE POLICY "Admins can insert products" ON products
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

-- RLS Policies voor orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage orders" ON orders
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Verify policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('products', 'orders')
ORDER BY tablename, policyname;

