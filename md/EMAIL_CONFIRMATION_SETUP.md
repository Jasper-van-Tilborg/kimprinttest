# Email Confirmation Verplicht Maken - Beveiligingsinstelling

⚠️ **BELANGRIJK:** Email confirmation moet AAN staan om te voorkomen dat mensen accounts kunnen aanmaken met valse e-mailadressen.

## Stap 1: Zet Email Confirmation AAN in Supabase

1. **Ga naar Supabase Dashboard**
   - https://app.supabase.com
   - Selecteer je project

2. **Ga naar Authentication → Providers**
   - Klik op "Authentication" in de linker sidebar
   - Klik op "Providers"
   - Zoek "Email" provider en klik erop

3. **Zet "Confirm email" AAN**
   - Zorg dat de toggle **AAN** staat (groen/actief)
   - Dit zorgt ervoor dat gebruikers hun e-mail moeten bevestigen voordat ze kunnen inloggen

4. **Klik op "Save"**

## Stap 2: Check URL Configuration

1. **Ga naar Authentication → URL Configuration**
   - Klik op "Authentication" in de linker sidebar
   - Klik op "URL Configuration"

2. **Zorg dat deze instellingen correct zijn:**

   **Voor lokaal development:**
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** `http://localhost:3000/**`

   **Voor productie:**
   - **Site URL:** `https://jouw-domein.nl` (of je Vercel URL)
   - **Redirect URLs:** `https://jouw-domein.nl/**`

3. **Klik op "Save"**

## Stap 3: Test Email Confirmation

1. **Maak een nieuw test account aan**
   - Ga naar je website
   - Registreer met een echt e-mailadres

2. **Check je e-mail inbox**
   - Je zou binnen 1-2 minuten een bevestigingsmail moeten ontvangen
   - Check ook je spam/junk folder

3. **Klik op de bevestigingslink**
   - Je wordt doorgestuurd naar `/auth/callback`
   - Daarna word je automatisch ingelogd

4. **Probeer in te loggen zonder bevestiging**
   - Maak een nieuw account aan
   - Probeer direct in te loggen (zonder e-mail te bevestigen)
   - Je zou een foutmelding moeten krijgen: "Je e-mailadres is nog niet bevestigd"

## Stap 4: Verifieer dat het werkt

### Test 1: Account aanmaken zonder e-mail bevestiging
- ✅ Account wordt aangemaakt
- ✅ Gebruiker krijgt melding om e-mail te checken
- ✅ Gebruiker kan NIET inloggen zonder bevestiging

### Test 2: E-mail bevestigen
- ✅ Gebruiker ontvangt bevestigingsmail
- ✅ Klikken op link bevestigt account
- ✅ Gebruiker wordt automatisch ingelogd

### Test 3: Inloggen na bevestiging
- ✅ Gebruiker kan succesvol inloggen
- ✅ Gebruiker wordt doorgestuurd naar dashboard

## Veiligheid

Met email confirmation AAN:
- ✅ Gebruikers kunnen geen accounts aanmaken met valse e-mailadressen
- ✅ Elke gebruiker moet zijn e-mailadres bevestigen
- ✅ Minder spam accounts
- ✅ Betere data kwaliteit

Zonder email confirmation:
- ❌ Iedereen kan accounts aanmaken met valse e-mails
- ❌ Geen verificatie van e-mailadressen
- ❌ Mogelijkheid voor spam/misbruik
- ❌ Beveiligingsrisico

## Troubleshooting

### Probleem: E-mail komt niet aan
- Check spam/junk folder
- Check Supabase e-mail logs (als beschikbaar)
- Test met een andere e-mail provider (Gmail, Outlook)
- Check of je Supabase plan e-mails ondersteunt
- Zie `md/EMAIL_TROUBLESHOOTING.md` voor meer details

### Probleem: Link werkt niet
- Check of redirect URL correct is ingesteld
- Check of `/auth/callback` route bestaat
- Check console voor errors

### Probleem: Kan nog steeds inloggen zonder bevestiging
- Verifieer dat "Confirm email" echt AAN staat in Supabase
- Check of je de juiste Supabase project gebruikt
- Clear browser cache en cookies
- Test met een incognito/private window

## Belangrijke Notities

⚠️ **Voor Development:**
- Je kunt tijdelijk email confirmation UIT zetten voor sneller testen
- **ZET HET ALTIJD WEER AAN VOOR PRODUCTIE!**

⚠️ **Voor Productie:**
- Email confirmation MOET altijd AAN staan
- Dit is een kritieke beveiligingsinstelling
- Zonder dit kunnen mensen valse accounts aanmaken

## Code Aanpassingen

De code is aangepast om:
- ✅ Te controleren of email bevestigd is bij login
- ✅ Duidelijke foutmeldingen te geven als email niet bevestigd is
- ✅ Gebruikers te informeren dat ze hun email moeten bevestigen
- ✅ Te waarschuwen als email confirmation uit staat (in console)

De applicatie werkt nu veilig met email confirmation!



















