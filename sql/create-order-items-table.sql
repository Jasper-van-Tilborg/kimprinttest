-- Maak order_items tabel aan voor bestelde producten
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Verwijder oude policies als ze bestaan
DROP POLICY IF EXISTS "Admins kunnen order items zien" ON order_items;
DROP POLICY IF EXISTS "Admins kunnen order items toevoegen" ON order_items;
DROP POLICY IF EXISTS "Admins kunnen order items bewerken" ON order_items;
DROP POLICY IF EXISTS "Admins kunnen order items verwijderen" ON order_items;

-- Policy: Alleen admins kunnen order items zien
CREATE POLICY "Admins kunnen order items zien" ON order_items
  FOR SELECT 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen order items toevoegen
CREATE POLICY "Admins kunnen order items toevoegen" ON order_items
  FOR INSERT 
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen order items bewerken
CREATE POLICY "Admins kunnen order items bewerken" ON order_items
  FOR UPDATE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen order items verwijderen
CREATE POLICY "Admins kunnen order items verwijderen" ON order_items
  FOR DELETE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Voeg voorbeeld order items toe (pas order_id aan naar jouw werkelijke order IDs)
-- Je kunt dit handmatig doen in Supabase nadat je echte order IDs hebt

