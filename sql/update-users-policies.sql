-- Verwijder oude policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Policy: Gebruikers kunnen hun eigen profiel zien
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy: Admins kunnen alle gebruikers zien
-- We gebruiken een EXISTS subquery om infinite recursion te voorkomen
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Policy: Admins kunnen alle gebruikers bijwerken
CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Policy: Admins kunnen gebruikers verwijderen (behalve zichzelf)
CREATE POLICY "Admins can delete users" ON users
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
    AND id != auth.uid()
  );

