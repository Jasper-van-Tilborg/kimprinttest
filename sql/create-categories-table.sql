-- Maak categories tabel aan als deze nog niet bestaat
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Verwijder oude policies als ze bestaan
DROP POLICY IF EXISTS "Iedereen kan categorieën lezen" ON categories;
DROP POLICY IF EXISTS "Alleen admins kunnen categorieën toevoegen" ON categories;
DROP POLICY IF EXISTS "Alleen admins kunnen categorieën bewerken" ON categories;
DROP POLICY IF EXISTS "Alleen admins kunnen categorieën verwijderen" ON categories;

-- Policy: Iedereen kan categorieën lezen
CREATE POLICY "Iedereen kan categorieën lezen" ON categories
  FOR SELECT 
  USING (true);

-- Policy: Alleen admins kunnen categorieën toevoegen
CREATE POLICY "Alleen admins kunnen categorieën toevoegen" ON categories
  FOR INSERT 
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen categorieën bewerken
CREATE POLICY "Alleen admins kunnen categorieën bewerken" ON categories
  FOR UPDATE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen categorieën verwijderen
CREATE POLICY "Alleen admins kunnen categorieën verwijderen" ON categories
  FOR DELETE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Verwijder oude categorieën als ze bestaan
DELETE FROM categories WHERE name IN ('Fotoboeken', 'Canvas', 'Posters', 'Kalenders', 'Kaarten', 'Overig');

-- Voeg de juiste categorieën toe
INSERT INTO categories (name, description) VALUES
  ('T-shirts', 'Bedrukte t-shirts in verschillende kleuren en maten'),
  ('Hoodies', 'Comfortable hoodies met custom prints'),
  ('Tassen', 'Draagbare tassen met eigen ontwerp'),
  ('Rompers', 'Schattige rompers voor de kleintjes')
ON CONFLICT (name) DO NOTHING;

