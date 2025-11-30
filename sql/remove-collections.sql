-- Verwijder collections tabel en alle gerelateerde data
-- Dit script verwijdert alle collections uit de database

-- Check of collections tabel bestaat en verwijder alle data
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'collections'
    ) THEN
        -- Verwijder eerst alle data
        DELETE FROM collections;
        
        -- Verwijder RLS policies
        DROP POLICY IF EXISTS "Iedereen kan collections lezen" ON collections;
        DROP POLICY IF EXISTS "Alleen admins kunnen collections toevoegen" ON collections;
        DROP POLICY IF EXISTS "Alleen admins kunnen collections bewerken" ON collections;
        DROP POLICY IF EXISTS "Alleen admins kunnen collections verwijderen" ON collections;
        
        -- Verwijder indexes
        DROP INDEX IF EXISTS idx_collections_name;
        DROP INDEX IF EXISTS idx_collections_slug;
        DROP INDEX IF EXISTS idx_collections_id;
        
        -- Verwijder de tabel
        DROP TABLE collections CASCADE;
        
        RAISE NOTICE 'Collections tabel is verwijderd';
    ELSE
        RAISE NOTICE 'Collections tabel bestaat niet';
    END IF;
END $$;

-- Als collections opgeslagen zijn in products tabel met een collection kolom
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'products' 
        AND column_name = 'collection'
    ) THEN
        ALTER TABLE products DROP COLUMN collection;
        RAISE NOTICE 'Collection kolom verwijderd uit products tabel';
    END IF;
END $$;

-- Als collections opgeslagen zijn in categories tabel
-- (Uncomment de volgende regel als je collection-gerelateerde categorieën wilt verwijderen)
-- DELETE FROM categories WHERE name ILIKE '%collection%' OR name ILIKE '%herten%';

