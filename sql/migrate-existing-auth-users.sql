-- ============================================
-- MIGRATE EXISTING AUTH USERS TO USERS TABLE
-- Dit script migreert bestaande auth.users naar de publieke users tabel
-- ============================================

-- Voeg alle bestaande auth users toe aan de users tabel
-- Als ze al bestaan, skip dan (ON CONFLICT DO NOTHING)
INSERT INTO public.users (id, email, first_name, last_name, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', ''),
  COALESCE(au.raw_user_meta_data->>'last_name', ''),
  'user', -- Default role
  au.created_at,
  NOW()
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- ============================================
-- KLAAR!
-- ============================================
-- Alle bestaande auth users zijn nu gemigreerd naar de users tabel




