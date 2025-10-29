-- Voeg sales_count kolom toe aan products tabel als deze nog niet bestaat
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'sales_count'
    ) THEN
        ALTER TABLE products ADD COLUMN sales_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Update bestaande producten om sales_count op 0 te zetten als deze NULL is
UPDATE products 
SET sales_count = 0 
WHERE sales_count IS NULL;

-- Voeg ook de images kolom toe als deze nog niet bestaat (voor meerdere afbeeldingen)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'images'
    ) THEN
        ALTER TABLE products ADD COLUMN images TEXT[];
    END IF;
END $$;

-- Als er producten zijn met alleen image_url, kopieer deze naar de images array
UPDATE products 
SET images = ARRAY[image_url]
WHERE images IS NULL AND image_url IS NOT NULL;

