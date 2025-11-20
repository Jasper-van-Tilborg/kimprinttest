-- ============================================
-- VERIFY SETUP - Check of alles correct is ingesteld
-- ============================================

-- 1. Check of is_admin() functie bestaat
SELECT 
  routine_name, 
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'is_admin';

-- 2. Check alle policies voor products
SELECT 
  tablename, 
  policyname, 
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- 3. Check of RLS enabled is
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'products' 
  AND schemaname = 'public';

-- 4. Check admin users
SELECT 
  id, 
  email, 
  role,
  created_at
FROM users
WHERE role = 'admin'
ORDER BY created_at DESC;

