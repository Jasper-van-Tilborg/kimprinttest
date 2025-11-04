-- ============================================
-- AUTO CREATE USER PROFILE ON SIGNUP
-- Deze trigger maakt automatisch een record in de users tabel
-- wanneer iemand zich registreert via Supabase Auth
-- ============================================

-- Maak de trigger functie aan
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Maak een nieuw record in de users tabel
  INSERT INTO public.users (id, email, first_name, last_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'user', -- Default role is 'user'
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verwijder oude trigger als die bestaat
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Maak de trigger aan
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- POLICY VOOR USER INSERTS
-- ============================================

-- Voeg een policy toe zodat de trigger users kan aanmaken
DROP POLICY IF EXISTS "Service role can insert users" ON users;

CREATE POLICY "Service role can insert users" ON users
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- KLAAR!
-- ============================================
-- Nu wordt er automatisch een users record aangemaakt
-- wanneer iemand zich registreert!




