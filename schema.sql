-- ======================================================
-- LUXURY PAKISTANI FASHION E-COMMERCE DATABASE SCHEMA
-- ======================================================

-- 1. Enable UUID Extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('men', 'women', 'kids')),
    subcategory TEXT NOT NULL CHECK (subcategory IN ('essentials', 'streetwear', 'accessories')),
    image TEXT NOT NULL,
    badge TEXT,
    sizes TEXT[] NOT NULL DEFAULT '{}',
    stock INTEGER NOT NULL DEFAULT 50,
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    gallery TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create product_variants Table
-- Each product can have multiple color-size segments with individual stock & price overrides
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    color TEXT NOT NULL,
    color_code TEXT NOT NULL, -- Hex code representation for color circles
    size TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    price NUMERIC, -- NULL means inherits parent product price
    main_image TEXT, -- Color specific cover image
    gallery_images TEXT[] NOT NULL DEFAULT '{}'
);

-- 4. Create reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    reviewer_name TEXT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- ======================================================
-- SAMPLE SEED CONTENT (REPRESENTING APPARELS WITH VARIANTS)
-- ======================================================

INSERT INTO categories (id, name, description) VALUES
('men', 'Men Collection', 'Premium shirts, slubs, and luxury kurtas'),
('women', 'Women Collection', 'Exclusive ethnic lawn suite ensembles'),
('kids', 'Kids Collection', 'Miniature traditional traditional styles')
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO products (id, title, description, price, category, subcategory, image, badge, sizes, stock, specifications, gallery, created_at) VALUES
(
    'gold-crest-tee',
    'Gold Crest Signature Tee',
    'Every collection starts with the absolute perfect base. Crafted from 100% long-staple Egyptian cotton, the Gold Crest Signature Tee features an elegantly hand-embroidered metallic gold Markhor seal on the chest. Designed to maintain its structured elegant form, it features dynamic shoulder contours suited for any modern dresser.',
    1800,
    'men',
    'essentials',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    'Flagship',
    ARRAY['S', 'M', 'L', 'XL'],
    120,
    '{"Composition": "100% Egyptian Cotton (240 GSM)", "Accents": "Hand-embroidered Gold Lurex thread", "Fit": "Signature Tailored / Structured Contour", "Origin": "Made in Pakistan", "Care": "Machine wash cold inside out, iron low avoiding gold embroidery"}'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800&sat=-100',
        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800'
    ],
    NOW()
),
(
    'carbon-cargo',
    'Carbon Streetwear Cargo',
    'Blending high-end luxury utility with contemporary utility accents, the Carbon Streetwear Cargo is tailored with heavy military-grade cotton twill. Features low-profile side pocket grids lined with custom geometric stitching and heavy golden brass snaps, providing both durable form and clean design contours.',
    3200,
    'men',
    'streetwear',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
    'Popular',
    ARRAY['S', 'M', 'L', 'XL'],
    80,
    '{"Composition": "98% Cotton Twill, 2% Elastane", "Hardware": "Antique Solid Gold Brass snap closures", "Pockets": "6-pocket luxury utility grid", "Origin": "Made in Pakistan", "Care": "Machine dry medium, warm iron as needed"}'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1517423712312-0b61e01f11cd?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'
    ],
    NOW()
),
(
    'metallic-gold-hoodie',
    'Metallic Gold Emblem Hoodie',
    'An elite level oversized staple item. Features a heavy-weight custom-brushed french terry fleece designed to naturally drape the shoulder grids. Highlights include a gold-foil metallic Markhor emblem backplate that reflects ambient light, detailed with high-density gold stitching across the chest.',
    3400,
    'men',
    'streetwear',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    'Limited Edition',
    ARRAY['S', 'M', 'L', 'XL'],
    95,
    '{"Composition": "100% Heavy Brushed French Terry Cotton (450 GSM)", "Accents": "Dynamic Gold-Foil print & high-density stitch", "Hood": "Generous double-lined overlap hood (no drawstrings for minimal design)", "Origin": "Made in Pakistan", "Care": "Dry clean highly recommended, or hand wash cold inside out"}'::jsonb,
    ARRAY[
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1513789181297-6f2ec112c0bc?auto=format&fit=crop&q=80&w=800'
    ],
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    image = EXCLUDED.image,
    description = EXCLUDED.description;

-- Seed Product Variants (Individual stock/size maps per color)
INSERT INTO product_variants (product_id, color, color_code, size, stock, price, main_image, gallery_images) VALUES
-- Gold Crest Tee Variants
('gold-crest-tee', 'black', '#0a0a0a', 'S', 15, 1800, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800']),
('gold-crest-tee', 'black', '#0a0a0a', 'M', 20, 1800, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800']),
('gold-crest-tee', 'black', '#0a0a0a', 'L', 25, 1800, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800']),
('gold-crest-tee', 'white', '#f9f9f9', 'S', 12, 1800, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800&sat=-100', ARRAY['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800&sat=-100']),
('gold-crest-tee', 'white', '#f9f9f9', 'M', 18, 1800, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800&sat=-100', ARRAY['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800&sat=-100']),
('gold-crest-tee', 'blue', '#1e3a8a', 'M', 30, 1900, 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800', ARRAY['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800'])
ON CONFLICT DO NOTHING;

-- Seed Reviews
INSERT INTO reviews (product_id, rating, reviewer_name, comment, created_at) VALUES
('gold-crest-tee', 5, 'Kamran Shah', 'Outstanding quality thread counts. The gold embroidery elevates the entire appearance.', NOW()),
('gold-crest-tee', 4, 'Sarah Malik', 'Extremely comfortable slub, perfect for casual summer wear.', NOW()),
('carbon-cargo', 5, 'Ibrahim Khan', 'Incredibly solid twill. Heavy zippers and snaps look totally luxurious.', NOW())
ON CONFLICT DO NOTHING;

-- Enable Realtime for products, variants and reviews
ALTER publication supabase_realtime ADD TABLE products;
ALTER publication supabase_realtime ADD TABLE product_variants;
ALTER publication supabase_realtime ADD TABLE reviews;
