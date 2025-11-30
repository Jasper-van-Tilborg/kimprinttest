-- Voeg colors kolom toe aan products tabel als deze nog niet bestaat
-- Deze kolom slaat kleuren op met per-kleur afbeeldingen als JSONB
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'colors'
    ) THEN
        ALTER TABLE products ADD COLUMN colors JSONB;
    END IF;
END $$;

-- Optioneel: Voeg een index toe voor betere query performance
CREATE INDEX IF NOT EXISTS idx_products_colors ON products USING GIN (colors);











