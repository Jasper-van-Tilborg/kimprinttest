-- ============================================
-- CHECK EXISTING SETUP
-- Voer deze queries uit om te zien wat er al bestaat
-- ============================================

-- 1. Check welke RLS policies er al zijn voor products
SELECT 
  tablename, 
  policyname, 
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- 2. Check of is_admin() functie bestaat
SELECT 
  routine_name, 
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'is_admin';

-- 3. Check users tabel structuur
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check of er al users zijn en welke roles ze hebben
SELECT 
  id, 
  email, 
  role,
  created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;

-- 5. Check of RLS enabled is op products tabel
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'products' 
  AND schemaname = 'public';

-- 6. Check alle bestaande policies (overzicht)
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

