-- Voeg sizes kolom toe aan products tabel als deze nog niet bestaat
-- Deze kolom slaat beschikbare maten op als TEXT array
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'sizes'
    ) THEN
        ALTER TABLE products ADD COLUMN sizes TEXT[];
    END IF;
END $$;

-- Optioneel: Voeg een index toe voor betere query performance
CREATE INDEX IF NOT EXISTS idx_products_sizes ON products USING GIN (sizes);









