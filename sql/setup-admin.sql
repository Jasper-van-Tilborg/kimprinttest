-- Stap 1: Check of de user bestaat in auth.users
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'jasper.van.tilborg@ziggo.nl';

-- Als dit een resultaat geeft, voer dan stap 2 uit:

-- Stap 2: Voeg de user toe aan de users tabel
INSERT INTO users (id, email, first_name, last_name, role, created_at, updated_at)
SELECT 
  id,
  email,
  'Jasper' as first_name,
  'van Tilborg' as last_name,
  'admin' as role,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users
WHERE email = 'jasper.van.tilborg@ziggo.nl';

-- Stap 3: Verify dat het gelukt is
SELECT * FROM users WHERE email = 'jasper.van.tilborg@ziggo.nl';

