-- Verwijder de problematische policy
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Nu houden we alleen deze twee policies over:
-- 1. "Users can view their own profile" - werkt perfect
-- 2. "Service role can view all users" - voor server-side operaties

-- Verify
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';

-- Check of de query nu werkt (test met jouw user ID)
-- Vervang 'YOUR_USER_ID' met je echte user ID
SELECT role FROM users WHERE id = auth.uid();

