# Performance Verbeteringen

## Wat ik heb aangepast (automatisch):

### ✅ 1. Next.js Config Optimalisaties
- **SWC Minification** ingeschakeld (sneller dan Terser)
- **Image optimization** met AVIF/WebP formaten
- **CSS optimization** ingeschakeld
- **Cache headers** voor statische assets (1 jaar cache)

### ✅ 2. Image Optimalisaties
- **Lazy loading** toegevoegd aan product images (niet boven de fold)
- **Quality** ingesteld op 85% (goede balans)
- **Sizes** attributen toegevoegd voor responsive images
- **Priority** alleen voor hero image (above the fold)
- **Blur placeholder** toegevoegd aan hero image

### ✅ 3. Font Loading
- **Font display: swap** toegevoegd (voorkomt FOIT)
- **Preload** ingeschakeld
- **Fallback fonts** toegevoegd

## Wat jij moet aanpassen (handmatig):

### 🔧 1. Images Converteren naar WebP/AVIF (67 KiB besparing)
**Actie vereist:**
- Converteer alle images naar WebP formaat
- Gebruik tools zoals:
  - Online: https://squoosh.app/
  - CLI: `cwebp` of `sharp`
  - Photoshop: Export As > WebP

**Images die geconverteerd moeten worden:**
- `/images/hero/heroimage.jpg` → `heroimage.webp`
- `/images/hertencollectie.png` → `hertencollectie.webp`
- `/images/hertencollectiewide.jpg` → `hertencollectiewide.webp`
- Alle product images in Supabase Storage

**Voordeel:** 30-50% kleinere bestanden, snellere laadtijden

### 🔧 2. Reduce Unused JavaScript (366 KiB besparing)
**Mogelijke oorzaken:**
- Grote client-side libraries die niet gebruikt worden
- Supabase client die te veel code importeert
- React hooks die niet nodig zijn

**Actie vereist:**
1. Check welke packages groot zijn:
   ```bash
   npm run build
   # Kijk naar de bundle sizes
   ```

2. Overweeg:
   - Dynamic imports voor zware componenten
   - Code splitting voor routes
   - Tree shaking controleren

3. Check of je alle Supabase functies nodig hebt:
   - Import alleen wat je gebruikt
   - Overweeg server-side data fetching waar mogelijk

### 🔧 3. Legacy JavaScript (8 KiB + 18 KiB besparing)
**Actie vereist:**
- Check je `package.json` voor oude packages
- Update naar nieuwste versies
- Verwijder polyfills die niet meer nodig zijn (Next.js 13+ heeft moderne JS support)

### 🔧 4. Back/Forward Cache Issues (4 failure reasons)
**Mogelijke oorzaken:**
- `beforeunload` event listeners
- `unload` event listeners  
- Cache headers die niet correct zijn
- Service workers die cache blokkeren

**Actie vereist:**
1. Check voor `beforeunload`/`unload` listeners in je code
2. Zorg dat cache headers correct zijn (al gedaan in next.config.js)
3. Test met Chrome DevTools > Application > Back/forward cache

### 🔧 5. Long Main-Thread Tasks (3 tasks)
**Mogelijke oorzaken:**
- Zware JavaScript operaties tijdens render
- Grote data processing in useEffect
- Synchronous operaties

**Actie vereist:**
1. Gebruik `useMemo` en `useCallback` voor zware berekeningen
2. Defer non-critical JavaScript met `next/dynamic`
3. Gebruik Web Workers voor zware processing

### 🔧 6. Render Blocking Requests (70ms besparing)
**Actie vereist:**
- Check welke CSS/JS files render blocking zijn
- Overweeg critical CSS inline
- Defer non-critical CSS
- Preload belangrijke resources

## Quick Wins (direct te implementeren):

1. **Images converteren** - Grootste impact, relatief eenvoudig
2. **Dynamic imports** - Voor zware componenten zoals Footer/Product cards
3. **Remove unused dependencies** - Check `package.json`

## Monitoring:

Na implementatie, test opnieuw met Lighthouse en check:
- Performance score (doel: 90+)
- LCP (Largest Contentful Paint) - doel: < 2.5s
- FID (First Input Delay) - doel: < 100ms
- CLS (Cumulative Layout Shift) - doel: < 0.1







