-- Maak orders tabel aan als deze nog niet bestaat
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Voeg kolommen toe als ze nog niet bestaan
DO $$ 
BEGIN
    -- order_number
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number') THEN
        ALTER TABLE orders ADD COLUMN order_number TEXT UNIQUE;
    END IF;
    
    -- customer_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
        ALTER TABLE orders ADD COLUMN customer_name TEXT;
    END IF;
    
    -- customer_email
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_email') THEN
        ALTER TABLE orders ADD COLUMN customer_email TEXT;
    END IF;
    
    -- customer_phone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_phone') THEN
        ALTER TABLE orders ADD COLUMN customer_phone TEXT;
    END IF;
    
    -- shipping_address
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_address') THEN
        ALTER TABLE orders ADD COLUMN shipping_address TEXT;
    END IF;
    
    -- total_amount
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'total_amount') THEN
        ALTER TABLE orders ADD COLUMN total_amount DECIMAL(10, 2) DEFAULT 0;
    END IF;
    
    -- status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'status') THEN
        ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
    
    -- items_count
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'items_count') THEN
        ALTER TABLE orders ADD COLUMN items_count INTEGER DEFAULT 0;
    END IF;
    
    -- notes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'notes') THEN
        ALTER TABLE orders ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Verwijder oude check constraint als die bestaat
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'orders' AND constraint_name = 'orders_status_check'
    ) THEN
        ALTER TABLE orders DROP CONSTRAINT orders_status_check;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Verwijder oude policies als ze bestaan
DROP POLICY IF EXISTS "Admins kunnen alle bestellingen zien" ON orders;
DROP POLICY IF EXISTS "Admins kunnen bestellingen toevoegen" ON orders;
DROP POLICY IF EXISTS "Admins kunnen bestellingen bewerken" ON orders;
DROP POLICY IF EXISTS "Admins kunnen bestellingen verwijderen" ON orders;

-- Policy: Alleen admins kunnen bestellingen zien
CREATE POLICY "Admins kunnen alle bestellingen zien" ON orders
  FOR SELECT 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen bestellingen toevoegen
CREATE POLICY "Admins kunnen bestellingen toevoegen" ON orders
  FOR INSERT 
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen bestellingen bewerken
CREATE POLICY "Admins kunnen bestellingen bewerken" ON orders
  FOR UPDATE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen bestellingen verwijderen
CREATE POLICY "Admins kunnen bestellingen verwijderen" ON orders
  FOR DELETE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Voeg wat voorbeeld bestellingen toe (optioneel, voor testen)
INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, total_amount, status, items_count, notes) VALUES
  ('ORD-2025-001', 'Jan Jansen', 'jan@example.com', '06-12345678', 'Hoofdstraat 1
1234 AB Amsterdam
Nederland', 45.00, 'paid', 2, 'Graag voor 17:00 bezorgen'),
  ('ORD-2025-002', 'Sarah de Vries', 'sarah@example.com', '06-98765432', 'Kerkstraat 25
5678 CD Rotterdam
Nederland', 89.50, 'shipped', 3, NULL),
  ('ORD-2025-003', 'Peter Bakker', 'peter@example.com', NULL, 'Marktplein 10
9012 EF Utrecht
Nederland', 32.00, 'pending', 1, NULL),
  ('ORD-2025-004', 'Emma Visser', 'emma@example.com', '06-55667788', 'Stationsweg 5
3456 GH Den Haag
Nederland', 125.00, 'delivered', 5, 'Tevreden klant')
ON CONFLICT (order_number) DO NOTHING;

