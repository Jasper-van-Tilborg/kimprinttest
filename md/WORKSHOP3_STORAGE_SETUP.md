# Workshop 3: Supabase Storage Setup

## Stap 1: Check of Bucket Al Bestaat

1. **Ga naar Supabase Dashboard → Storage**
2. **Check of er al een bucket bestaat met de naam `product-images`**

Als deze al bestaat, skip naar Stap 2.

Als deze niet bestaat, maak hem aan:

### Bucket Aanmaken

1. **Klik op "Create a new bucket"**
2. **Configureer:**
   - **Name:** `product-images`
   - **Public bucket:** ✅ **Enable** (zodat iedereen images kan zien)
   - **File size limit:** `5MB`
   - **Allowed MIME types:** Laat leeg (we valideren in code)
3. **Klik "Create bucket"**

## Stap 2: Storage Policies Instellen

Je hebt waarschijnlijk al policies, maar laat me checken welke er nodig zijn:

### Policy 1: Public kan images zien

1. **Klik op je `product-images` bucket**
2. **Klik op "Policies" tab**
3. **Check of deze policy bestaat:**
   - **Policy name:** "Public can view product images" (of vergelijkbaar)
   - **Operation:** SELECT
   - **Target roles:** public

Als deze niet bestaat, maak hem aan:

```sql
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

### Policy 2: Authenticated users kunnen uploaden

Check of deze policy bestaat:
- **Policy name:** "Authenticated can upload product images" (of vergelijkbaar)
- **Operation:** INSERT
- **Target roles:** authenticated

Als deze niet bestaat:

```sql
CREATE POLICY "Authenticated can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

### Policy 3: Authenticated users kunnen verwijderen

Check of deze policy bestaat:
- **Policy name:** "Authenticated can delete product images" (of vergelijkbaar)
- **Operation:** DELETE
- **Target roles:** authenticated

Als deze niet bestaat:

```sql
CREATE POLICY "Authenticated can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

## Stap 3: Verifieer Setup

Voer dit uit in SQL Editor om te checken:

```sql
-- Check storage policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%product%'
ORDER BY policyname;
```

Je zou minimaal 3 policies moeten zien voor product-images.

## ✅ Klaar!

Als alles correct is ingesteld:
- ✅ Bucket `product-images` bestaat en is public
- ✅ 3 policies zijn ingesteld (SELECT, INSERT, DELETE)
- ✅ next.config.ts is geüpdatet (al gedaan)

Nu kunnen we de code optimaliseren! 🚀

