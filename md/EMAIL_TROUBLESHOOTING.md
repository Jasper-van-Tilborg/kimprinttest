# E-mail Problemen Troubleshooting

Als je geen bevestigingsmail ontvangt na het aanmaken van een account, volg deze stappen:

## Stap 1: Check Supabase E-mail Configuratie

1. **Ga naar Supabase Dashboard**
   - https://app.supabase.com
   - Selecteer je project

2. **Check Email Confirmation Settings**
   - Ga naar **Authentication → Providers**
   - Klik op **"Email"** provider
   - Zorg dat **"Confirm email"** AAN staat (voor productie)
   - Voor development kun je dit UIT zetten om te testen zonder e-mail

3. **Check URL Configuration**
   - Ga naar **Authentication → URL Configuration**
   - **Site URL** moet zijn: `http://localhost:3000` (voor lokaal) of je productie URL
   - **Redirect URLs** moet bevatten: `http://localhost:3000/**` (voor lokaal) of je productie URL met `/**`

## Stap 2: Check E-mail in Supabase

1. **Ga naar Authentication → Users**
   - Zoek je net aangemaakte gebruiker
   - Check of de gebruiker is aangemaakt
   - Check de "Email" kolom - is deze correct?

2. **Check E-mail Logs (als beschikbaar)**
   - Sommige Supabase plannen hebben e-mail logs
   - Check of de e-mail daadwerkelijk is verzonden

## Stap 3: Check Spam/Junk Folder

- E-mails van Supabase kunnen in je spam/junk folder terechtkomen
- Check ook je "All Mail" folder in Gmail
- Voeg `noreply@mail.app.supabase.com` toe aan je contacten om spam te voorkomen

## Stap 4: Check Console Logs

1. **Open je browser console** (F12)
2. **Maak een nieuw account aan**
3. **Check de console voor errors**
   - Je zou moeten zien: "User created successfully: [email]"
   - Als je errors ziet, noteer deze

## Stap 5: Test met Email Confirmation UIT (Development)

Voor lokaal testen kun je tijdelijk email confirmation uitzetten:

1. **Ga naar Authentication → Providers → Email**
2. **Zet "Confirm email" UIT**
3. **Test account aanmaken**
4. **Je zou nu direct moeten kunnen inloggen**

⚠️ **BELANGRIJK:** Zet dit weer AAN voor productie!

## Stap 6: Check Environment Variables

Zorg dat je `.env.local` file de juiste variabelen heeft:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Voor productie:
```env
NEXT_PUBLIC_SITE_URL=https://jouw-domein.nl
```

## Stap 7: Check Supabase Project Settings

1. **Ga naar Project Settings → API**
2. **Check of je project URL correct is**
3. **Check of je API keys correct zijn**

## Stap 8: Test met een Andere E-mail Provider

Sommige e-mail providers (zoals bepaalde bedrijfsmail) blokkeren e-mails van Supabase. Test met:
- Gmail
- Outlook
- Yahoo

## Stap 9: Check Supabase Plan Limits

- Gratis Supabase plannen hebben limieten op e-mails
- Check of je niet over je limiet zit
- Upgrade naar een betaald plan als nodig

## Stap 10: Custom SMTP Setup (Optioneel)

Als je je eigen SMTP server wilt gebruiken:

1. **Ga naar Project Settings → Auth → SMTP Settings**
2. **Configureer je SMTP server**
3. **Test de configuratie**

## Veelvoorkomende Problemen

### Probleem: "User already registered"
**Oplossing:** 
- De gebruiker bestaat al
- Probeer in te loggen in plaats van een nieuw account aan te maken
- Of verwijder de gebruiker uit Supabase Authentication → Users

### Probleem: E-mail komt aan maar link werkt niet
**Oplossing:**
- Check of je redirect URL correct is ingesteld in Supabase
- Check of `/auth/callback` route bestaat en werkt
- Check console voor errors bij het klikken op de link

### Probleem: E-mail komt niet aan na 5 minuten
**Oplossing:**
- Check spam folder
- Check Supabase e-mail logs (als beschikbaar)
- Test met een andere e-mail provider
- Check of je Supabase plan e-mail ondersteunt

## Debug Checklist

- [ ] Email confirmation staat AAN in Supabase
- [ ] URL Configuration is correct ingesteld
- [ ] Spam/junk folder is gecheckt
- [ ] Console logs tonen geen errors
- [ ] Environment variables zijn correct
- [ ] Test met andere e-mail provider
- [ ] Supabase plan ondersteunt e-mails
- [ ] E-mail template heeft `{{ .ConfirmationURL }}` variabele

## Contact Supabase Support

Als niets werkt:
1. Check Supabase status: https://status.supabase.com
2. Open een support ticket in Supabase Dashboard
3. Geef details over:
   - Je Supabase project URL
   - Het e-mailadres dat je gebruikt
   - Screenshots van je configuratie
   - Console errors (als aanwezig)



