-- Update database schema to add images column to products table
-- and remove the separate product_images table

-- Add images column to products table
ALTER TABLE products ADD COLUMN images JSONB DEFAULT '[]'::jsonb;

-- Drop the product_images table (if it exists)
DROP TABLE IF EXISTS product_images;

-- Update existing products to have empty images array if they don't have one
UPDATE products SET images = '[]'::jsonb WHERE images IS NULL;
