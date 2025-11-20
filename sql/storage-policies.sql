-- ============================================
-- SUPABASE STORAGE POLICIES VOOR PRODUCT IMAGES
-- Voer dit uit in Supabase SQL Editor
-- ============================================

-- Verwijder bestaande policies eerst (als ze bestaan)
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete product images" ON storage.objects;

-- Policy 1: Iedereen kan product images zien (voor public website)
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Policy 2: Authenticated users kunnen product images uploaden
CREATE POLICY "Authenticated can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Policy 3: Authenticated users kunnen product images verwijderen
CREATE POLICY "Authenticated can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- Verifieer dat policies zijn aangemaakt
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%product%'
ORDER BY policyname;

-- Je zou nu 3 policies moeten zien:
-- 1. Public can view product images (SELECT)
-- 2. Authenticated can upload product images (INSERT)
-- 3. Authenticated can delete product images (DELETE)

