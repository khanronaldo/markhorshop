import { Product, Leader } from '../types';

export const PRODUCTS: Product[] = [
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
  }
];

export const LEADERS: Leader[] = [
  {
    name: 'SHOUKAT KHAN',
    role: 'Chairman',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    bio: 'Our Chairman is the main leader of our clothing brand. He helps guide the company and makes important decisions about our future. With a strong passion and good leadership skills, because of his hard work and clear vision, our brand continues to grow and improve.'
  },
  {
    name: 'ASAD KHAN',
    role: 'CEO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600',
    bio: 'Markhor Collections was created with a vision to redefine modern fashion. With a passion for design and a deep understanding of style, Asad khan set out to build a brand that blends quality, creativity, and authenticity. Every collection reflects the belief that clothing should empower confidence and self-expression.'
  },
  {
    name: 'REFAQAT KHAN',
    role: 'Managing Director',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
    bio: 'As the Managing Director of Markhor Collections, Refaqat Khan leads the brand with a clear vision for innovation, quality, and growth. With strong leadership and a deep understanding of the fashion industry, he oversees strategic planning, brand development, and operational excellence. Under his direction, the company continues to expand while staying true to its core values of style, integrity, and customer satisfaction.'
  },
  {
    name: 'SADAT KHAN',
    role: 'Managing Director II',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    bio: 'As the Second Managing Director of Markhor Collections, Sadat Khan plays a key role in driving operational excellence and strategic growth. Working closely with the Managing Director, he oversees day-to-day management, team coordination, and market expansion initiatives, ensuring the brand continues to deliver quality, innovation, and customer satisfaction.'
  }
];
