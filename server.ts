import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "src", "data", "products-db.json");

app.use(express.json({ limit: "10mb" }));

// Initial default products list matching src/data/products.ts
const DEFAULT_PRODUCTS = [
  {
    id: 'gold-crest-tee',
    name: 'Gold Crest Signature Tee',
    category: 'men',
    subcategory: 'essentials',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'white', 'blue'],
    badge: 'Flagship',
    description: 'Every collection starts with the absolute perfect base. Crafted from 100% long-staple Egyptian cotton, the Gold Crest Signature Tee features an elegantly hand-embroidered metallic gold Markhor seal on the chest. Designed to maintain its structured elegant form, it features dynamic shoulder contours suited for any modern dresser.',
    shipping: 'Free Luxury Shipping (2-3 Business Days)',
    specifications: {
      'Composition': '100% Egyptian Cotton (240 GSM)',
      'Accents': 'Hand-embroidered Gold Lurex thread',
      'Fit': 'Signature Tailored / Structured Contour',
      'Origin': 'Made in Pakistan',
      'Care': 'Machine wash cold inside out, iron low avoiding gold embroidery'
    },
    colorImagesList: [
      { colorName: 'black', hex: '#0a0a0a', imgUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800' },
      { colorName: 'white', hex: '#f9f9f9', imgUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800&sat=-100' },
      { colorName: 'blue', hex: '#1e3a8a', imgUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'carbon-cargo',
    name: 'Carbon Streetwear Cargo',
    category: 'men',
    subcategory: 'streetwear',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'dark blue', 'gray'],
    badge: 'Popular',
    description: 'Blending high-end luxury utility with contemporary utility accents, the Carbon Streetwear Cargo is tailored with heavy military-grade cotton twill. Features low-profile side pocket grids lined with custom geometric stitching and heavy golden brass snaps, providing both durable form and clean design contours.',
    shipping: 'Free Luxury Shipping (2-3 Business Days)',
    specifications: {
      'Composition': '98% Cotton Twill, 2% Elastane',
      'Hardware': 'Antique Solid Gold Brass snap closures',
      'Pockets': '6-pocket luxury utility grid',
      'Origin': 'Made in Pakistan',
      'Care': 'Machine dry medium, warm iron as needed'
    },
    colorImagesList: [
      { colorName: 'black', hex: '#111111', imgUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800' },
      { colorName: 'dark blue', hex: '#1a2d6e', imgUrl: 'https://images.unsplash.com/photo-1517423712312-0b61e01f11cd?auto=format&fit=crop&q=80&w=800' },
      { colorName: 'gray', hex: '#4b5563', imgUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'metallic-gold-hoodie',
    name: 'Metallic Gold Emblem Hoodie',
    category: 'men',
    subcategory: 'streetwear',
    price: 3400,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'dark blue'],
    badge: 'Limited Edition',
    description: 'An elite level oversized staple item. Features a heavy-weight custom-brushed french terry fleece designed to naturally drape the shoulder grids. Highlights include a gold-foil metallic Markhor emblem backplate that reflects ambient light, detailed with high-density gold stitching across the chest.',
    shipping: 'Free Luxury Shipping (2-3 Business Days)',
    specifications: {
      'Composition': '100% Heavy Brushed French Terry Cotton (450 GSM)',
      'Accents': 'Dynamic Gold-Foil print & high-density stitch',
      'Hood': 'Generous double-lined overlap hood (no drawstrings for minimal design)',
      'Origin': 'Made in Pakistan',
      'Care': 'Dry clean highly recommended, or hand wash cold inside out'
    },
    colorImagesList: [
      { colorName: 'black', hex: '#0a0a0a', imgUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800' },
      { colorName: 'dark blue', hex: '#0f172a', imgUrl: 'https://images.unsplash.com/photo-1513789181297-6f2ec112c0bc?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'club-collar-shirt',
    name: 'Flagship Club Collar Shirt',
    category: 'men',
    subcategory: 'essentials',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['white', 'blue', 'cream'],
    badge: 'New',
    description: 'A luxurious iteration of the timeless dress shirt, the Flagship Club Collar Shirt is cut from double-twill premium Italian linen mix. Elegant rounded club collar provides vintage elegance paired with modern sleek fits. Adorned with mother-of-pearl buttons and discreet gold stitch detailing on the lower placket.',
    shipping: 'Free Luxury Shipping (2-3 Business Days)',
    specifications: {
      'Composition': '70% Cotton Twill, 30% Fine Italian Linen',
      'Buttons': 'Genuine white Mother of Pearl',
      'Collar Style': 'Elegantly rounded Club Collar',
      'Origin': 'Made in Pakistan'
    },
    colorImagesList: [
      { colorName: 'white', hex: '#ffffff', imgUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800' },
      { colorName: 'blue', hex: '#60a5fa', imgUrl: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800' },
      { colorName: 'cream', hex: '#fffbeb', imgUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'gold-crest-cap',
    name: 'Premium Metallic Crest Cap',
    category: 'men',
    subcategory: 'accessories',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
    sizes: ['S', 'M'],
    colors: ['black', 'white'],
    description: 'The ultimate luxury cap. Engineered with premium velvet-textured panels and finished with an adjustable strap equipped with a gold brass logo buckle. The centerpiece is a highly pronounced, three-dimensional metallic-embroidered Markhor crest on the center crown.',
    shipping: 'Free Luxury Shipping (2-3 Business Days)',
    specifications: {
      'Composition': 'Velvet-Cotton brushed blend panels',
      'Hardware': 'Solid antique gold finish adjustable brass clasp',
      'Design': 'Structured crown with embroidered gold crest',
      'Origin': 'Made in Pakistan'
    },
    colorImagesList: [
      { colorName: 'black', hex: '#050505', imgUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800' },
      { colorName: 'white', hex: '#fbfbfb', imgUrl: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'classic-blazer',
    name: 'Classic Linen Summer Blazer',
    category: 'men',
    subcategory: 'essentials',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    sizes: ['M', 'L', 'XL'],
    colors: ['cream', 'black'],
    badge: 'Hot',
    description: 'Cut in a highly relaxed, unconstructed drape profile suitable for high-end warm weather elegance. Crafted with pure breathable Irish flax linen, the Summer Blazer features double patch utility pockets and a sleek notch lapel detailed with a subtle gold hand-stitched barchetta contour.',
    shipping: 'Free Luxury Shipping (2-3 Business Days)',
    specifications: {
      'Composition': '100% Breathable Irish Flax Linen',
      'Lining': 'Satin-lined shoulders and sleeves for seamless slipping',
      'Buttons': 'Engraved gold-rimmed horn buttons',
      'Origin': 'Made in Pakistan'
    },
    colorImagesList: [
      { colorName: 'cream', hex: '#faf5e8', imgUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800' },
      { colorName: 'black', hex: '#111111', imgUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800' }
    ]
  },
  {
    id: 'regal-kurta-royal',
    name: 'Regal Gold-Thread Linen Kurta',
    category: 'men',
    subcategory: 'essentials',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=800',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['royal white', 'golden wheat', 'slate dark'],
    badge: 'Ethnic Luxury',
    description: 'Designed in the spirit of the royal courts, this premium Linen Kurta is tailored to perfection. Features gold-threaded embroidery on the ban collar and front placket, combined with a luxurious slub texture that breathes perfectly in the South Asian weather.',
    shipping: 'Free Luxury Shipping (2-3 Business Days)',
    specifications: {
      'Composition': '80% Fine Linen, 20% Wash-and-Wear cotton mix',
      'Collar style': 'Embroidered Ban Collar',
      'Embroidery': 'Artisanal Gold Zari work',
      'Origin': 'Made in Pakistan'
    }
  },
  {
    id: 'shah-e-lawn-suit',
    name: 'Shah-e-Lawn Embroidered 3pc',
    category: 'women',
    subcategory: 'essentials',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    sizes: ['S', 'M', 'L'],
    colors: ['crimson blush', 'emerald gold'],
    badge: 'Lawn Couture',
    description: 'An iconic Pakistani Lawn collection representing timeless heritage. Features heavy floral and barocco embroideries on the neckline and sleeves, accompanied by a beautifully printed standard silk dupatta and matching cambric trousers.',
    shipping: 'Free Luxury Shipping (2-3 Business Days)',
    specifications: {
      'Shirt fabric': 'Premium lawn with dense sub-thread count',
      'Dupatta': '100% Digital printed Pure Silk Dupatta',
      'Trouser': 'Dyed Premium Cambric Cotton',
      'Origin': 'Made in Pakistan'
    }
  }
];

// Ensure database file exits
function loadProducts() {
  try {
    const parentDir = path.dirname(DB_FILE);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_PRODUCTS, null, 2), "utf-8");
      return DEFAULT_PRODUCTS;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading products database:", err);
    return DEFAULT_PRODUCTS;
  }
}

function saveProducts(products: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving products database:", err);
  }
}

// 1. GET /api/products
app.get("/api/products", (req, res) => {
  const products = loadProducts();
  res.json(products);
});

// 2. POST /api/admin/login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  // Standard owner password is 'admin123' or 'markhor2026' or 'nestandnifty07'
  if (password === "markhor2026" || password === "admin123" || password === "nestandnifty07") {
    res.json({ success: true, token: "markhor-admin-jwt-token-2026" });
  } else {
    res.status(401).json({ success: false, message: "⚠️ Incorrect owner password. Please try again." });
  }
});

// Helper for admin authentication
const requireAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "markhor-admin-jwt-token-2026") {
    next();
  } else {
    res.status(403).json({ success: false, message: "⚠️ Forbidden - Unauthenticated access attempt." });
  }
};

// 3. POST /api/products (Add product)
app.post("/api/products", requireAdmin, (req, res) => {
  const newProduct = req.body;
  if (!newProduct.id || !newProduct.name || !newProduct.price) {
    return res.status(400).json({ success: false, message: "⚠️ Missing primary parameters (ID, Name, or Price)." });
  }
  
  const products = loadProducts();
  // Check duplicate
  if (products.some((p: any) => p.id === newProduct.id)) {
    return res.status(400).json({ success: false, message: "⚠️ A product with this catalog ID already exists." });
  }

  products.push(newProduct);
  saveProducts(products);
  res.json({ success: true, product: newProduct });
});

// 4. PUT /api/products/:id (Change product)
app.put("/api/products/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  
  const products = loadProducts();
  const index = products.findIndex((p: any) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "⚠️ Product not found in catalog database." });
  }

  products[index] = { ...products[index], ...updatedData };
  saveProducts(products);
  res.json({ success: true, product: products[index] });
});

// 5. DELETE /api/products/:id (Remove product)
app.delete("/api/products/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  let products = loadProducts();
  const initLen = products.length;
  products = products.filter((p: any) => p.id !== id);
  
  if (products.length === initLen) {
    return res.status(404).json({ success: false, message: "⚠️ Product not found in catalog." });
  }

  saveProducts(products);
  res.json({ success: true, message: "✓ Product successfully purged from catalog database." });
});


// Configure Vite / Static files serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server executing live on http://localhost:${PORT}`);
  });
}

startServer();
