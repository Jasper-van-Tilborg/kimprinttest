-- Add temporary offers functionality to products table
ALTER TABLE products ADD COLUMN is_temporary_offer BOOLEAN DEFAULT FALSE;

-- Add index for better performance when filtering temporary offers
CREATE INDEX idx_products_temporary_offer ON products(is_temporary_offer) WHERE is_temporary_offer = TRUE;

-- Update some existing products to be temporary offers (optional)
-- UPDATE products SET is_temporary_offer = TRUE WHERE name ILIKE '%halloween%' OR name ILIKE '%korting%';


