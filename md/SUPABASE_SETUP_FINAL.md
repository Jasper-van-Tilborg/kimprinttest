# Supabase Setup - Finale Instructies

## ✅ Wat We Weten

Je hebt al:
- ✅ 2 admin accounts (jasper.vantilborg@student.fontys.nl en jasper.van.tilborg@ziggo.nl)
- ✅ 1 normale user account
- ✅ Users tabel met `role` kolom
- ✅ Bestaande RLS policies (waarschijnlijk)

## 🎯 Wat Je Moet Doen

### Stap 1: Check Bestaande Policies (Optioneel)

Voer dit uit om te zien wat er al bestaat:

```sql
SELECT 
  tablename, 
  policyname, 
  cmd
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;
```

**Deel de resultaten met mij** als je wilt dat ik het script verder aanpas.

### Stap 2: Voer Veilig Update Script Uit

1. **Ga naar Supabase Dashboard → SQL Editor**
2. **Klik op "+ New query"**
3. **Kopieer en plak het script uit `sql/safe-workshop2-update.sql`**
4. **Klik op "Run"**

Dit script:
- ✅ Voegt alleen toe wat nodig is
- ✅ Verwijdert NIETS wat al bestaat
- ✅ Gebruikt `IF NOT EXISTS` checks
- ✅ Maakt `is_admin()` functie aan als die nog niet bestaat
- ✅ Voegt alleen policies toe die nog niet bestaan

### Stap 3: Verifieer

Na het uitvoeren zou je moeten zien:
- Success berichten voor elke policy
- Een lijst van alle policies aan het einde

### Stap 4: Test Authenticatie

1. **Log uit** van je website (als je ingelogd bent)

2. **Probeer admin route:**
   - Ga naar: http://localhost:3000/admin
   - Je zou moeten worden doorgestuurd naar `/account`

3. **Log in met admin account:**
   - Email: `jasper.vantilborg@student.fontys.nl` of `jasper.van.tilborg@ziggo.nl`
   - Ga naar: http://localhost:3000/account
   - Log in
   - Je zou moeten worden doorgestuurd naar `/admin/dashboard`

4. **Test admin functionaliteit:**
   - Je zou nu toegang moeten hebben tot alle admin pagina's
   - Je email zou moeten verschijnen in de admin header
   - Je zou producten moeten kunnen bewerken/toevoegen/verwijderen

## 🔧 Email Confirmation Instellen (Optioneel)

Voor development kun je email confirmation uitzetten:

1. **Ga naar Authentication → Providers**
2. **Zoek "Email" provider**
3. **Zet "Confirm email" UIT** (alleen voor development!)

⚠️ **Voor productie:** Zet dit weer AAN!

## ✅ Checklist

Na het uitvoeren van het script:

- [ ] Script is succesvol uitgevoerd
- [ ] Policies zijn zichtbaar in de verificatie query
- [ ] Je kunt inloggen met admin account
- [ ] Je wordt doorgestuurd naar `/admin/dashboard` na login
- [ ] Je kunt niet bij `/admin` zonder in te loggen
- [ ] Logout werkt correct
- [ ] Je kunt producten bewerken/toevoegen/verwijderen als admin

## 🆘 Troubleshooting

### Probleem: "Policy already exists" error

**Oplossing:** Dit is normaal! Het script gebruikt `IF NOT EXISTS` checks, dus dit zou niet moeten voorkomen. Als het wel gebeurt, betekent het dat de policy al bestaat en dat is prima.

### Probleem: "Unauthorized" bij producten bewerken

**Oplossing:**
1. Check of je ingelogd bent met admin account
2. Verifieer dat `role = 'admin'` in users tabel:
   ```sql
   SELECT id, email, role FROM users WHERE email = 'jouw-email@voorbeeld.nl';
   ```
3. Check of policies correct zijn:
   ```sql
   SELECT policyname FROM pg_policies WHERE tablename = 'products';
   ```

### Probleem: Admin layout geeft error

**Oplossing:**
- Check of `requireAdmin()` correct werkt
- Check of je User ID in de users tabel staat
- Check of `role = 'admin'` is ingesteld

## 🎉 Klaar!

Als alles werkt, heb je nu:
- ✅ Veilige authenticatie
- ✅ Beschermde admin routes  
- ✅ Server-side auth checks
- ✅ RLS policies voor database beveiliging
- ✅ Bestaande data en setup behouden

