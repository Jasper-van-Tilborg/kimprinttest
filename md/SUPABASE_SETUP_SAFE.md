# Supabase Setup - Veilige Aanpak (Bestaande Data Behouden)

## Stap 1: Check Wat Er Al Bestaat

Voer eerst deze queries uit in Supabase SQL Editor om te zien wat er al is:

**Kopieer en plak dit in SQL Editor:**

```sql
-- Check welke RLS policies er al zijn voor products
SELECT 
  tablename, 
  policyname, 
  cmd
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- Check of is_admin() functie bestaat
SELECT 
  routine_name, 
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'is_admin';

-- Check users tabel structuur
SELECT 
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check of er al users zijn en welke roles ze hebben
SELECT 
  id, 
  email, 
  role,
  created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;
```

**Deel de resultaten met mij**, dan kan ik een veilige update maken die:
- ✅ Bestaande policies niet kapot maakt
- ✅ Alleen toevoegt wat nodig is
- ✅ Bestaande data behoudt

---

## Stap 2: Veilige Update (Na Review)

Nadat ik de resultaten heb gezien, maak ik een aangepast SQL script dat:
- Alleen nieuwe policies toevoegt als ze nog niet bestaan
- Bestaande policies niet overschrijft
- Gebruik maakt van bestaande `is_admin()` functie als die al bestaat

---

## Alternatief: Screenshots

Als je liever screenshots deelt:

1. **Authentication → Users** - Laat zien welke users er zijn
2. **SQL Editor → Run query** - Run de check queries hierboven
3. **Table Editor → products** - Laat structuur zien (niet de data zelf)
4. **Authentication → Policies** - Laat zien welke policies er zijn

---

## Wat Ik Moet Weten

Om een veilige update te maken, heb ik nodig:

1. **Welke policies bestaan er al voor products?**
   - Run: `SELECT policyname FROM pg_policies WHERE tablename = 'products';`

2. **Bestaat de `is_admin()` functie al?**
   - Run: `SELECT routine_name FROM information_schema.routines WHERE routine_name = 'is_admin';`

3. **Heeft de users tabel een `role` kolom?**
   - Run: `SELECT column_name FROM information_schema.columns WHERE table_name = 'users';`

4. **Zijn er al admin users?**
   - Run: `SELECT id, email, role FROM users WHERE role = 'admin';`

---

## Veilige Aanpak

In plaats van alles te droppen en opnieuw te maken, kunnen we:

1. **Check eerst** wat er bestaat
2. **Voeg alleen toe** wat ontbreekt
3. **Update alleen** wat nodig is
4. **Behoud alles** wat al werkt

Deel de resultaten van de check queries, dan maak ik een veilig update script! 🛡️

