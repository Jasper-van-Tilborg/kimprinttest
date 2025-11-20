-- ============================================
-- WORKSHOP 2: Veilige Update voor Bestaande Setup
-- Dit script voegt alleen toe wat nodig is, zonder bestaande data te verwijderen
-- ============================================

-- Stap 1: Check of is_admin() functie bestaat, zo niet maak hem aan
-- Deze functie voorkomt infinite recursion in policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name = 'is_admin'
  ) THEN
    CREATE OR REPLACE FUNCTION is_admin()
    RETURNS BOOLEAN AS $function$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'admin'
      );
    END;
    $function$ LANGUAGE plpgsql SECURITY DEFINER;
    
    RAISE NOTICE 'is_admin() functie aangemaakt';
  ELSE
    RAISE NOTICE 'is_admin() functie bestaat al';
  END IF;
END $$;

-- Stap 2: Check en voeg policies toe voor products (alleen als ze nog niet bestaan)
-- We gebruiken IF NOT EXISTS pattern om conflicten te voorkomen

-- Policy: Iedereen kan producten zien (voor public website)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Anyone can view products'
  ) THEN
    CREATE POLICY "Anyone can view products" ON products
      FOR SELECT 
      USING (true);
    RAISE NOTICE 'Policy "Anyone can view products" toegevoegd';
  ELSE
    RAISE NOTICE 'Policy "Anyone can view products" bestaat al';
  END IF;
END $$;

-- Policy: Authenticated users kunnen alle producten zien
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Authenticated can view all products'
  ) THEN
    CREATE POLICY "Authenticated can view all products" ON products
      FOR SELECT 
      USING (auth.uid() IS NOT NULL);
    RAISE NOTICE 'Policy "Authenticated can view all products" toegevoegd';
  ELSE
    RAISE NOTICE 'Policy "Authenticated can view all products" bestaat al';
  END IF;
END $$;

-- Policy: Alleen admins kunnen producten toevoegen
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Admins can insert products'
  ) THEN
    CREATE POLICY "Admins can insert products" ON products
      FOR INSERT 
      WITH CHECK (is_admin());
    RAISE NOTICE 'Policy "Admins can insert products" toegevoegd';
  ELSE
    RAISE NOTICE 'Policy "Admins can insert products" bestaat al';
  END IF;
END $$;

-- Policy: Alleen admins kunnen producten bewerken
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Admins can update products'
  ) THEN
    CREATE POLICY "Admins can update products" ON products
      FOR UPDATE 
      USING (is_admin())
      WITH CHECK (is_admin());
    RAISE NOTICE 'Policy "Admins can update products" toegevoegd';
  ELSE
    RAISE NOTICE 'Policy "Admins can update products" bestaat al';
  END IF;
END $$;

-- Policy: Alleen admins kunnen producten verwijderen
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Admins can delete products'
  ) THEN
    CREATE POLICY "Admins can delete products" ON products
      FOR DELETE 
      USING (is_admin());
    RAISE NOTICE 'Policy "Admins can delete products" toegevoegd';
  ELSE
    RAISE NOTICE 'Policy "Admins can delete products" bestaat al';
  END IF;
END $$;

-- Stap 3: Zorg dat RLS enabled is op products tabel
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Stap 4: Verifieer dat alles werkt
SELECT 
  tablename, 
  policyname, 
  cmd
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- Je zou nu minimaal deze policies moeten zien:
-- - Anyone can view products (of vergelijkbare naam)
-- - Authenticated can view all products (optioneel)
-- - Admins can insert products
-- - Admins can update products  
-- - Admins can delete products

