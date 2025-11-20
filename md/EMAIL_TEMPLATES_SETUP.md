# Aangepaste E-mail Templates Instellen in Supabase

Supabase biedt de mogelijkheid om de standaard e-mail templates aan te passen naar je eigen persoonlijke stijl. Hieronder vind je een stap-voor-stap handleiding.

## Stap 1: Ga naar Email Templates in Supabase Dashboard

1. **Log in op je Supabase Dashboard**

   - Ga naar: https://app.supabase.com
   - Selecteer je project

2. **Navigeer naar Email Templates**
   - Klik op **"Authentication"** in de linker sidebar
   - Klik op **"Email Templates"** (of "E-mail Templates")

## Stap 2: Pas de Confirmation Email aan

Je ziet verschillende e-mail templates:

- **Confirm signup** - De bevestigingsmail voor nieuwe accounts
- **Magic Link** - Voor passwordless login
- **Change Email Address** - Voor e-mail wijzigingen
- **Reset Password** - Voor wachtwoord reset

### Voor de "Confirm signup" template:

1. **Klik op "Confirm signup"**

2. **Je kunt de volgende variabelen gebruiken:**

   - `{{ .ConfirmationURL }}` - De bevestigingslink
   - `{{ .Email }}` - Het e-mailadres van de gebruiker
   - `{{ .SiteURL }}` - Je website URL
   - `{{ .RedirectTo }}` - De redirect URL na bevestiging

3. **Mooie professionele template voor K-imprint:**

**Onderwerp:**

```
Welkom bij K-imprint! Bevestig je account 🎨
```

**Body (HTML):**

```html
<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Welkom bij K-imprint</title>
    <!--[if mso]>
      <style type="text/css">
        body,
        table,
        td {
          font-family: Arial, sans-serif !important;
        }
      </style>
    <![endif]-->
  </head>
  <body
    style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;"
  >
    <!-- Wrapper -->
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #FAFAFA;"
    >
      <tr>
        <td align="center" style="padding: 40px 20px;">
          <!-- Main Container -->
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="600"
            style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
          >
            <!-- Header met Logo -->
            <tr>
              <td
                style="background: linear-gradient(135deg, #171717 0%, #2a2a2a 100%); padding: 40px 30px; text-align: center;"
              >
                <h1
                  style="margin: 0; color: #FFFFFF; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;"
                >
                  K-imprint
                </h1>
                <p
                  style="margin: 8px 0 0 0; color: #E5E5E5; font-size: 14px; font-weight: 400;"
                >
                  Jouw gepersonaliseerde kleding
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 50px 40px;">
                <!-- Welkomstbericht -->
                <h2
                  style="margin: 0 0 20px 0; color: #171717; font-size: 28px; font-weight: 600; line-height: 1.3;"
                >
                  Welkom bij K-imprint! 👋
                </h2>

                <p
                  style="margin: 0 0 20px 0; color: #4A4A4A; font-size: 16px; line-height: 1.6;"
                >
                  Bedankt voor je registratie! We zijn ontzettend blij dat je
                  deel uitmaakt van de K-imprint community.
                </p>

                <p
                  style="margin: 0 0 30px 0; color: #4A4A4A; font-size: 16px; line-height: 1.6;"
                >
                  Om je account te activeren en te beginnen met het
                  personaliseren van je favoriete producten, klik op de
                  onderstaande knop:
                </p>

                <!-- CTA Button -->
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                >
                  <tr>
                    <td align="center" style="padding: 0 0 30px 0;">
                      <a
                        href="{{ .ConfirmationURL }}"
                        style="display: inline-block; padding: 16px 40px; background-color: #8B4513; color: #FFFFFF; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3); transition: all 0.3s ease;"
                      >
                        Bevestig mijn account
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Alternatieve link -->
                <p
                  style="margin: 0 0 10px 0; color: #6B6B6B; font-size: 14px; line-height: 1.5;"
                >
                  Werkt de knop niet? Kopieer en plak deze link in je browser:
                </p>
                <p
                  style="margin: 0 0 30px 0; word-break: break-all; color: #8B4513; font-size: 13px; line-height: 1.6; padding: 12px; background-color: #FAFAFA; border-left: 3px solid #8B4513; border-radius: 4px;"
                >
                  {{ .ConfirmationURL }}
                </p>

                <!-- Info box -->
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                  style="background-color: #F5F5F5; border-radius: 6px; margin-bottom: 30px;"
                >
                  <tr>
                    <td style="padding: 20px;">
                      <p
                        style="margin: 0; color: #4A4A4A; font-size: 14px; line-height: 1.6;"
                      >
                        <strong style="color: #171717;">⏰ Let op:</strong> Deze
                        bevestigingslink is 24 uur geldig. Na bevestiging kun je
                        direct beginnen met het personaliseren van je producten!
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Afsluiting -->
                <p
                  style="margin: 0 0 10px 0; color: #4A4A4A; font-size: 16px; line-height: 1.6;"
                >
                  We kijken ernaar uit om je te helpen bij het creëren van
                  unieke, gepersonaliseerde producten.
                </p>

                <p
                  style="margin: 0; color: #4A4A4A; font-size: 16px; line-height: 1.6;"
                >
                  Met vriendelijke groet,<br />
                  <strong style="color: #171717;">Het K-imprint team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="background-color: #F9F9F9; padding: 30px 40px; text-align: center; border-top: 1px solid #E5E5E5;"
              >
                <p
                  style="margin: 0 0 10px 0; color: #6B6B6B; font-size: 14px; line-height: 1.5;"
                >
                  <strong style="color: #171717;">K-imprint</strong><br />
                  Jouw gepersonaliseerde kleding & producten
                </p>
                <p
                  style="margin: 15px 0 0 0; color: #9B9B9B; font-size: 12px; line-height: 1.5;"
                >
                  Als je deze e-mail niet hebt aangevraagd, kun je deze veilig
                  negeren.
                </p>
                <p
                  style="margin: 15px 0 0 0; color: #9B9B9B; font-size: 12px; line-height: 1.5;"
                >
                  © 2024 K-imprint. Alle rechten voorbehouden.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

**Body (Plain Text versie):**

```
═══════════════════════════════════════════════════════════
                    K-IMPRINT
            Jouw gepersonaliseerde kleding
═══════════════════════════════════════════════════════════

Welkom bij K-imprint! 👋

Bedankt voor je registratie! We zijn ontzettend blij dat je deel uitmaakt van de K-imprint community.

Om je account te activeren en te beginnen met het personaliseren van je favoriete producten, klik op de onderstaande link:

{{ .ConfirmationURL }}

⏰ Let op: Deze bevestigingslink is 24 uur geldig. Na bevestiging kun je direct beginnen met het personaliseren van je producten!

We kijken ernaar uit om je te helpen bij het creëren van unieke, gepersonaliseerde producten.

Met vriendelijke groet,
Het K-imprint team

═══════════════════════════════════════════════════════════

K-imprint - Jouw gepersonaliseerde kleding & producten

Als je deze e-mail niet hebt aangevraagd, kun je deze veilig negeren.

© 2024 K-imprint. Alle rechten voorbehouden.
```

## Stap 3: Test je Template

1. **Sla je template op** door op "Save" te klikken

2. **Test het door een nieuw account aan te maken:**
   - Ga naar je website
   - Maak een test account aan
   - Check je e-mail inbox
   - Je zou nu je aangepaste e-mail moeten ontvangen!

## Stap 4: Optioneel - Pas andere Templates aan

Je kunt ook de andere templates aanpassen:

- **Magic Link** - Voor passwordless login
- **Change Email Address** - Voor e-mail wijzigingen
- **Reset Password** - Voor wachtwoord reset

Gebruik dezelfde stijl en branding voor consistentie.

## Tips

1. **Gebruik je eigen branding**

   - Voeg je logo toe (als afbeelding URL)
   - Gebruik je bedrijfskleuren
   - Houd de stijl consistent met je website

2. **Test op verschillende e-mail clients**

   - Gmail, Outlook, Apple Mail, etc.
   - Zorg dat HTML goed wordt weergegeven

3. **Houd het simpel**

   - Te veel styling kan problemen veroorzaken
   - Test altijd eerst met een test account

4. **Gebruik variabelen**
   - Supabase variabelen zoals `{{ .ConfirmationURL }}` zijn verplicht
   - Zonder deze werkt de bevestiging niet

## Troubleshooting

### Probleem: E-mail wordt niet verzonden

- Check of "Confirm email" AAN staat in Authentication → Providers
- Check je Supabase project settings voor e-mail configuratie

### Probleem: Link werkt niet

- Zorg dat `{{ .ConfirmationURL }}` exact zo staat (hoofdletters!)
- Check of je redirect URL correct is ingesteld in Authentication → URL Configuration

### Probleem: HTML wordt niet goed weergegeven

- Test met een simpelere HTML structuur
- Sommige e-mail clients ondersteunen niet alle CSS

## Belangrijke Notities

⚠️ **Let op:**

- De variabelen zoals `{{ .ConfirmationURL }}` zijn hoofdlettergevoelig
- Zorg dat je altijd een werkende bevestigingslink hebt in je template
- Test altijd eerst met een test account voordat je live gaat
