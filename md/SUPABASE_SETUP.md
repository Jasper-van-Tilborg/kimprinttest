# Supabase Setup Instructies - Workshop 2

## Stap 1: RLS Policies Uitvoeren

1. **Ga naar je Supabase Dashboard**

   - Open https://supabase.com
   - Log in en selecteer je project

2. **Open SQL Editor**

   - Klik op "SQL Editor" in de linker sidebar
   - Klik op "+ New query"

3. **Kopieer en plak het volgende SQL script:**

```sql
-- Workshop 2: Row Level Security Policies
-- Deze policies volgen de tutorial en zorgen voor veilige database toegang

-- PRODUCTS TABLE POLICIES

-- Drop existing policies first
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Public can view published products" ON products;
DROP POLICY IF EXISTS "Authenticated can view all products" ON products;
DROP POLICY IF EXISTS "Authenticated can create products" ON products;
DROP POLICY IF EXISTS "Authenticated can update products" ON products;
DROP POLICY IF EXISTS "Authenticated can delete products" ON products;

-- Enable Row Level Security (should already be enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- PUBLIC ACCESS: Anyone can view products (for public website)
CREATE POLICY "Public can view products" ON products
  FOR SELECT
  USING (true);

-- AUTHENTICATED ACCESS: Logged-in users can see all products
CREATE POLICY "Authenticated can view all products" ON products
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ADMIN ACCESS: Only admins can create, update, delete
-- Check if user is admin via users table
CREATE POLICY "Admins can create products" ON products
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
```

4. **Klik op "Run" (of druk Ctrl/Cmd + Enter)**

5. **Verifieer dat het werkt:**
   - Je zou moeten zien: "Success. No rows returned"
   - Of: "Success" met aantal rows

## Stap 2: Email Confirmation Instellen (Optioneel voor Development)

**Voor Development (lokaal testen):**

1. **Ga naar Authentication → Providers**

   - Klik op "Authentication" in de linker sidebar
   - Klik op "Providers"
   - Zoek "Email" provider

2. **Disable Email Confirmation (alleen voor development!)**
   - Zet "Confirm email" UIT
   - Dit maakt testen makkelijker - je hoeft geen emails te checken

⚠️ **WAARSCHUWING:** Zet dit weer AAN voor productie!

**Voor Productie:**

- Zet "Confirm email" AAN
- Gebruikers moeten hun email bevestigen voordat ze kunnen inloggen

## Stap 3: Auth URL Configuration (Voor Productie)

Als je je site deployed hebt naar Vercel:

1. **Ga naar Authentication → URL Configuration**

   - Klik op "Authentication" in de linker sidebar
   - Klik op "URL Configuration"

2. **Voeg je Vercel URL toe:**
   - **Site URL:** `https://jouw-project.vercel.app`
   - **Redirect URLs:** Voeg toe: `https://jouw-project.vercel.app/**`
   - Klik "Save"

**Voor lokaal development:**

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**`

## Stap 4: Test Account Aanmaken

1. **Ga naar je website:** http://localhost:3000/account

2. **Klik op "Registreren"**

3. **Vul het formulier in:**

   - Email: jouw-email@voorbeeld.nl
   - Wachtwoord: minimaal 6 karakters
   - Voornaam en Achternaam

4. **Klik "Account aanmaken"**

5. **Als email confirmation UIT staat:**

   - Je wordt direct doorgestuurd naar login
   - Log in met je credentials

6. **Als email confirmation AAN staat:**
   - Check je email voor bevestigingslink
   - Klik op de link
   - Log dan in

## Stap 5: Admin Account Maken

Na het aanmaken van je account moet je deze admin maken:

1. **Ga naar Supabase Dashboard → Authentication → Users**

   - Klik op "Authentication" in de linker sidebar
   - Klik op "Users"
   - Zoek je net aangemaakte gebruiker
   - Kopieer de User ID (UUID)

2. **Ga naar SQL Editor**

   - Klik op "+ New query"

3. **Voer dit SQL uit (vervang USER_ID met jouw User ID):**

```sql
-- Maak gebruiker admin
UPDATE users
SET role = 'admin'
WHERE id = 'USER_ID_HIER';
```

4. **Verifieer:**
   - Run: `SELECT id, email, role FROM users WHERE id = 'USER_ID_HIER';`
   - Je zou moeten zien: `role = 'admin'`

## Stap 6: Testen

1. **Log uit** (als je ingelogd bent)

2. **Probeer admin route te bezoeken:**

   - Ga naar: http://localhost:3000/admin
   - Je zou moeten worden doorgestuurd naar `/account`

3. **Log in met je admin account:**

   - Ga naar: http://localhost:3000/account
   - Log in met je credentials
   - Je zou moeten worden doorgestuurd naar `/admin/dashboard`

4. **Test admin functionaliteit:**
   - Je zou nu toegang moeten hebben tot alle admin pagina's
   - Je email zou moeten verschijnen in de admin header

## Troubleshooting

### Probleem: "Unauthorized" error bij producten bewerken

**Oplossing:**

- Check of je User ID correct is in de users tabel
- Check of `role = 'admin'` in de users tabel
- Verifieer dat RLS policies correct zijn uitgevoerd

### Probleem: Kan niet inloggen na registratie

**Oplossing:**

- Check of email confirmation AAN staat
- Als AAN: check je email voor bevestigingslink
- Als UIT: probeer opnieuw in te loggen

### Probleem: Policies werken niet

**Oplossing:**

- Run in SQL Editor: `SELECT * FROM pg_policies WHERE tablename = 'products';`
- Je zou 5 policies moeten zien
- Als policies ontbreken, run het SQL script opnieuw

### Probleem: Admin layout geeft error

**Oplossing:**

- Check of `requireAdmin()` correct werkt
- Check of je User ID in de users tabel staat
- Check of role = 'admin' is ingesteld

## Verificatie Checklist

Voordat je verder gaat, check dit:

- [ ] RLS policies zijn uitgevoerd (5 policies voor products)
- [ ] Email confirmation is ingesteld (UIT voor dev, AAN voor productie)
- [ ] Je hebt een test account aangemaakt
- [ ] Je test account is admin gemaakt in de database
- [ ] Je kunt inloggen op /account
- [ ] Je wordt doorgestuurd naar /admin/dashboard na login (als admin)
- [ ] Je kunt niet bij /admin zonder in te loggen
- [ ] Logout werkt correct

## Klaar! 🎉

Als alles werkt, heb je nu:

- ✅ Veilige authenticatie
- ✅ Beschermde admin routes
- ✅ Server-side auth checks
- ✅ RLS policies voor database beveiliging
