-- ============================================
-- COLLECTIES SYSTEEM
-- Dit script maakt een collecties systeem aan met een duidelijk onderscheid tussen categorieën en collecties
-- ============================================

-- 1. Maak collections tabel aan
CREATE TABLE IF NOT EXISTS collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE, -- Voor URL's, bijv. "herten-collectie"
  description TEXT,
  hero_image TEXT, -- Hero afbeelding voor de collectie pagina
  is_featured BOOLEAN DEFAULT false, -- Of deze collectie op de homepage moet worden getoond
  display_order INTEGER DEFAULT 0, -- Voor sortering
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Maak product_collections junction tabel aan (many-to-many relatie)
CREATE TABLE IF NOT EXISTS product_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  -- Zorg dat een product niet twee keer in dezelfde collectie kan zitten
  UNIQUE(product_id, collection_id)
);

-- 3. Voeg indexes toe voor betere performance
CREATE INDEX IF NOT EXISTS idx_product_collections_product_id ON product_collections(product_id);
CREATE INDEX IF NOT EXISTS idx_product_collections_collection_id ON product_collections(collection_id);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_is_featured ON collections(is_featured);

-- 4. Enable Row Level Security
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies voor collections
-- Verwijder oude policies als ze bestaan
DROP POLICY IF EXISTS "Iedereen kan collecties lezen" ON collections;
DROP POLICY IF EXISTS "Alleen admins kunnen collecties toevoegen" ON collections;
DROP POLICY IF EXISTS "Alleen admins kunnen collecties bewerken" ON collections;
DROP POLICY IF EXISTS "Alleen admins kunnen collecties verwijderen" ON collections;

-- Policy: Iedereen kan collecties lezen
CREATE POLICY "Iedereen kan collecties lezen" ON collections
  FOR SELECT 
  USING (true);

-- Policy: Alleen admins kunnen collecties toevoegen
CREATE POLICY "Alleen admins kunnen collecties toevoegen" ON collections
  FOR INSERT 
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen collecties bewerken
CREATE POLICY "Alleen admins kunnen collecties bewerken" ON collections
  FOR UPDATE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen collecties verwijderen
CREATE POLICY "Alleen admins kunnen collecties verwijderen" ON collections
  FOR DELETE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 6. RLS Policies voor product_collections
-- Verwijder oude policies als ze bestaan
DROP POLICY IF EXISTS "Iedereen kan product-collectie relaties lezen" ON product_collections;
DROP POLICY IF EXISTS "Alleen admins kunnen product-collectie relaties toevoegen" ON product_collections;
DROP POLICY IF EXISTS "Alleen admins kunnen product-collectie relaties bewerken" ON product_collections;
DROP POLICY IF EXISTS "Alleen admins kunnen product-collectie relaties verwijderen" ON product_collections;

-- Policy: Iedereen kan product-collectie relaties lezen
CREATE POLICY "Iedereen kan product-collectie relaties lezen" ON product_collections
  FOR SELECT 
  USING (true);

-- Policy: Alleen admins kunnen product-collectie relaties toevoegen
CREATE POLICY "Alleen admins kunnen product-collectie relaties toevoegen" ON product_collections
  FOR INSERT 
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen product-collectie relaties bewerken
CREATE POLICY "Alleen admins kunnen product-collectie relaties bewerken" ON product_collections
  FOR UPDATE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Policy: Alleen admins kunnen product-collectie relaties verwijderen
CREATE POLICY "Alleen admins kunnen product-collectie relaties verwijderen" ON product_collections
  FOR DELETE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- 7. Voeg een functie toe om slug te genereren (optioneel, kan ook in applicatie)
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(input_text, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger om updated_at automatisch bij te werken
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Voeg trigger toe voor collections
DROP TRIGGER IF EXISTS update_collections_updated_at ON collections;
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Voeg voorbeeld collectie toe (Herten Collectie)
INSERT INTO collections (name, slug, description, hero_image, is_featured, display_order)
VALUES (
  'Herten Collectie',
  'herten-collectie',
  'Unieke collectie met herten thema',
  '/images/hertencollectiehero.jpg',
  true,
  1
)
ON CONFLICT (slug) DO NOTHING;

-- 10. Helper query om te zien welke producten in welke collecties zitten
-- SELECT 
--   p.name AS product_name,
--   p.category,
--   c.name AS collection_name,
--   c.slug AS collection_slug
-- FROM products p
-- JOIN product_collections pc ON p.id = pc.product_id
-- JOIN collections c ON pc.collection_id = c.id
-- ORDER BY c.name, p.name;


