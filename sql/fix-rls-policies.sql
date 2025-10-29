-- Drop de oude policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Nieuwe policies die het probleem oplossen
-- Iedereen kan hun eigen user data zien (inclusief role)
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT 
  USING (auth.uid() = id);

-- Service role kan alles zien (voor admin checks)
CREATE POLICY "Service role can view all users" ON users
  FOR SELECT 
  USING (auth.role() = 'service_role');

-- Admins kunnen alle users zien
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Verify de policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'users';

