-- Voeg sales_count kolom toe als deze nog niet bestaat
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

-- Voeg images kolom toe als deze nog niet bestaat (voor meerdere afbeeldingen)
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

-- Update bestaande producten
UPDATE products 
SET sales_count = 0 
WHERE sales_count IS NULL;

-- Kopieer image_url naar images array als images leeg is
UPDATE products 
SET images = ARRAY[image_url]
WHERE (images IS NULL OR array_length(images, 1) IS NULL) 
AND image_url IS NOT NULL;

