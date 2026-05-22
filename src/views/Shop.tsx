import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ViewType, ColorVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { 
  SlidersHorizontal, ArrowUpDown, RefreshCw, ShoppingCart, HelpCircle, 
  Heart, Eye, X, Star, ShieldAlert, Truck, ChevronRight 
} from 'lucide-react';

const COLOR_MAP: Record<string, string> = {
  'black': '#111111',
  'white': '#ffffff',
  'blue': '#3b6cc5',
  'dark blue': '#1a2d6e',
  'gray': '#888888',
  'cream': '#fdfaf2',
  'maroon': '#800000',
  'olive': '#808000',
  'beige': '#f5f5dc',
  'navy': '#000080'
};

interface ShopProps {
  onViewChange: (view: ViewType) => void;
  onSelectProduct: (product: Product) => void;
}

export const Shop: React.FC<ShopProps> = ({ onViewChange, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { products, loading, error, refreshProducts } = useProducts();

  // Active Category tabs
  const [activeCategory, setActiveCategory] = useState<'all' | 'men' | 'women' | 'kids'>('all');

  // Sidebar Filter parameters
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(12000);

  // Sorting
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Filtered lists
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Wishlist local registry for active user session engagement
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("markhor_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Quick View overlay modal states
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync price slider max bounds from loaded Supabase catalog
  useEffect(() => {
    if (products && products.length > 0) {
      const highestPrice = Math.max(...products.map(p => p.price));
      setMaxPriceLimit(highestPrice > 0 ? highestPrice : 12000);
      setMaxPrice(highestPrice > 0 ? highestPrice : 12000);
    }
  }, [products]);

  // Filtering computational side-effects
  useEffect(() => {
    let result = [...products];

    // Filter categories
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter sizes
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((size) => selectedSizes.includes(size))
      );
    }

    // Filter colors
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((color) => selectedColors.includes(color.toLowerCase()))
      );
    }

    // Filter pricing limites
    result = result.filter((p) => p.price <= maxPrice);

    // Apply strict analytical sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [products, activeCategory, selectedSizes, selectedColors, maxPrice, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(maxPriceLimit);
    setSortBy('featured');
  };

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = [];
    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId);
    } else {
      updated = [...wishlist, productId];
    }
    setWishlist(updated);
    localStorage.setItem("markhor_wishlist", JSON.stringify(updated));
  };

  return (
    <div className="bg-[#FAF9F6] text-[#111111] min-h-screen pb-20">
      
      {/* LUXURY BANNER HEADER */}
      <div className="relative py-20 bg-white border-b border-[#111111]/5 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200')` }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-[10px] sm:text-xs text-[#BF953F] tracking-[0.35em] font-bold uppercase mb-3.5 block">
            MARKHOR ATELIER SPECIFICATION COLLECTION
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-[#111111] mb-3">
            The Luxury Floor
          </h1>
          <p className="font-serif italic text-neutral-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            High-density thread weaves curated directly from elite looms. Realtime live catalog updating.
          </p>
        </div>
      </div>

      {/* WORKSPACE PORTAL CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: COLLAPSIBLE FILTERS SIDEBAR */}
          <aside className="lg:col-span-3 bg-white border border-[#111111]/5 rounded-xl p-6 lg:sticky lg:top-24 shadow-sm text-left">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6 font-sans">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 text-[#111111]">
                <SlidersHorizontal className="w-4 h-4 text-[#BF953F]" /> FILTERS
              </h3>
              <button 
                onClick={clearAllFilters}
                className="text-[10px] font-bold tracking-widest text-[#BF953F] hover:text-[#111111] uppercase transition-colors cursor-pointer bg-transparent border-0"
              >
                RESET
              </button>
            </div>

            {/* Sizing selection channels */}
            <div className="mb-6 pb-6 border-b border-neutral-100">
              <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-neutral-400 block mb-4">
                GARMENT CUT INCHES
              </span>
              <div className="grid grid-cols-4 gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                  const isChecked = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-2 px-1 text-xs font-bold border rounded-md transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-[#111111] text-[#FCF6BA] border-[#111111] shadow-xs scale-95' 
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-600 bg-neutral-50/50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color circles swatches list */}
            <div className="mb-6 pb-6 border-b border-neutral-100">
              <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-neutral-400 block mb-4">
                COLOR SWATCH WHEEL
              </span>
              <div className="flex flex-wrap gap-2">
                {['black', 'white', 'blue', 'dark blue', 'gray', 'cream', 'maroon', 'olive', 'beige', 'navy'].map((col) => {
                  const isChecked = selectedColors.includes(col);
                  return (
                    <button
                      key={col}
                      onClick={() => toggleColor(col)}
                      className={`flex items-center gap-2 text-[10px] font-bold uppercase px-3.5 py-2 border rounded-full transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-[#111111] text-[#FCF6BA] border-[#111111] scale-95 shadow-sm' 
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-600 bg-white'
                      }`}
                    >
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-black/15 flex-shrink-0" 
                        style={{ backgroundColor: COLOR_MAP[col] || '#c4a96e' }}
                      />
                      <span className="capitalize">{col}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max billing limit with pricing input slider */}
            <div className="mb-2">
              <div className="flex justify-between text-[10px] tracking-[0.2em] font-bold text-neutral-400 uppercase mb-3">
                <span>MAX BILL LIMIT</span>
                <span className="text-[#BF953F] font-sans font-bold">Rs. {maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min={1000} 
                max={maxPriceLimit} 
                step={100} 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#BF953F] cursor-pointer bg-neutral-200 h-1.5 rounded-full outline-none"
              />
              <div className="flex justify-between text-[9px] font-mono text-neutral-400 mt-2">
                <span>Rs. 1,000</span>
                <span>Rs. {maxPriceLimit.toLocaleString()}</span>
              </div>
            </div>

          </aside>

          {/* RIGHT: INTERACTIVE DYNAMIC MULTI-VIEW CATALOG LISTINGS */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Filter tags navigation bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#111111]/5 p-4 rounded-xl shadow-xs">
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'men', 'women', 'kids'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4.5 py-2 rounded text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer border-0 ${
                      activeCategory === cat
                        ? 'bg-[#111111] text-[#FCF6BA] shadow-xs'
                        : 'text-neutral-500 hover:text-[#111111] hover:bg-neutral-50 bg-transparent'
                    }`}
                  >
                    {cat === 'all' ? 'All Collections' : `${cat}'s`}
                  </button>
                ))}
              </div>

              {/* Sorting triggers */}
              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <ArrowUpDown className="w-4 h-4 text-[#BF953F]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF9F6] text-[11px] font-bold tracking-widest text-[#111111] border border-neutral-200 rounded-md py-2.5 px-3.5 outline-none cursor-pointer focus:border-[#BF953F] transition-all"
                >
                  <option value="featured">Featured Order</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Alphanumerical: A-Z</option>
                </select>
              </div>
            </div>

            {/* Error handling board */}
            {error && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-xs text-amber-800 text-left">
                {error}
              </div>
            )}

            {/* SHIMMER LOADING FLOORS IN SKELETON CARD MODE */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} className="bg-white border rounded-lg p-4 flex flex-col gap-4 animate-pulse">
                      <div className="aspect-[3/4] bg-neutral-200 rounded-lg w-full" />
                      <div className="h-4 bg-neutral-200 rounded w-1/3" />
                      <div className="h-6 bg-neutral-200 rounded w-3/4" />
                      <div className="h-4 bg-neutral-200 rounded w-1/4" />
                    </div>
                  ))}
                </motion.div>
              ) : filteredProducts.length > 0 ? (
                /* LUXURY GRID STAGGER LOADS */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filteredProducts.map((p) => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      wishlist={wishlist}
                      onSelect={onSelectProduct} 
                      onViewChange={onViewChange}
                      onQuickView={setQuickViewProduct}
                      onToggleWishlist={toggleWishlist}
                      addToCart={addToCart}
                    />
                  ))}
                </motion.div>
              ) : (
                /* Elegantly styled empty states */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="border border-[#111111]/5 bg-white text-center py-24 rounded-xl flex flex-col items-center justify-center gap-4 shadow-xs"
                >
                  <HelpCircle className="w-12 h-12 text-[#BF953F]/60" />
                  <h3 className="font-serif text-xl tracking-wide text-[#111111]">No Matches Found</h3>
                  <p className="text-xs text-neutral-400 max-w-sm font-light leading-relaxed">
                    Try adjusting your size parameters, color circles, or increase your billing limit. Newly created admin objects should match your parameters.
                  </p>
                  <button 
                    onClick={clearAllFilters}
                    className="px-6 py-3 border border-neutral-300 hover:border-black font-bold tracking-widest text-[10px] uppercase rounded-md transition-all mt-2 cursor-pointer bg-white"
                  >
                    RESET DISK FILTERING
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </main>
        </div>
      </div>

      {/* ── SUB-OVERLAY DETAILED DIALOG: QUICK VIEW MODAL ── */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Content card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-[#FAF9F6] border rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] grid grid-cols-1 md:grid-cols-12 gap-8 text-left"
            >
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-black/5 bg-white flex items-center justify-center hover:bg-neutral-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4 text-neutral-700" />
              </button>

              {/* Left Column media */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 border relative shadow-inner">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover object-top" />
                </div>
              </div>

              {/* Right Column copywriter details */}
              <div className="md:col-span-7 flex flex-col text-left">
                <span className="text-[9px] font-bold tracking-[0.25em] text-[#BF953F] uppercase block mb-1">{quickViewProduct.subcategory} Atelier Line</span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#111111] font-light leading-tight mb-2">{quickViewProduct.name}</h3>
                <span className="text-xl font-bold font-sans text-[#BF953F] pb-4 border-b">Rs. {quickViewProduct.price.toLocaleString()}</span>
                
                <p className="text-xs text-neutral-500 leading-relaxed font-light py-4">{quickViewProduct.description}</p>
                
                <div className="flex flex-col gap-3.5 mb-6 text-xs text-neutral-400">
                  <div className="flex items-center gap-2"><Truck className="w-4.5 h-4.5 text-[#BF953F]" /> <span>{quickViewProduct.shipping}</span></div>
                  <div className="flex items-center gap-2"><ShieldAlert className="w-4.5 h-4.5 text-[#BF953F]" /> <span>Verified luxury checkouts</span></div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => {
                      onSelectProduct(quickViewProduct);
                      onViewChange('product');
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3.5 bg-neutral-900 hover:bg-black font-bold tracking-widest text-[#FCF6BA] text-[10px] uppercase rounded-lg transition-all text-center cursor-pointer shadow-md"
                  >
                    DISCOVER TOTAL DETAILS
                  </button>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, quickViewProduct.sizes[0] || 'M', quickViewProduct.colors[0] || 'black');
                      setQuickViewProduct(null);
                    }}
                    className="py-3.5 px-6 border hover:bg-neutral-50 rounded-lg flex items-center justify-center cursor-pointer"
                  >
                    <ShoppingCart className="w-4.5 h-4.5 text-neutral-700" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

/* ── COMPONENT: PRODUCT CARD ── */
interface CardProps {
  product: Product;
  wishlist: string[];
  onSelect: (p: Product) => void;
  onViewChange: (view: ViewType) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
  addToCart: (product: Product, size: string, color: string) => void;
}

const ProductCard: React.FC<CardProps> = ({ 
  product, 
  wishlist,
  onSelect, 
  onViewChange, 
  onQuickView, 
  onToggleWishlist, 
  addToCart 
}) => {
  const defaultCol = product.colors && product.colors.length > 0 ? product.colors[0] : 'black';
  const [activeImage, setActiveImage] = useState(product.image);
  const [activeColor, setActiveColor] = useState(defaultCol);
  const [secondImage, setSecondImage] = useState<string | null>(null);

  // Sync state parameters when catalog elements update
  useEffect(() => {
    setActiveImage(product.image);
    const primaryCol = product.colors && product.colors.length > 0 ? product.colors[0] : 'black';
    setActiveColor(primaryCol);

    // Setup second hover image if available in product.gallery
    if (product.gallery && product.gallery.length > 1) {
      setSecondImage(product.gallery[1]);
    } else if (product.colorImagesList && product.colorImagesList.length > 1) {
      setSecondImage(product.colorImagesList[1].imgUrl);
    } else {
      setSecondImage(null);
    }
  }, [product]);

  const handleSelect = () => {
    onSelect(product);
    onViewChange('product');
  };

  const handleColorSwatch = (variant: ColorVariant, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveColor(variant.colorName);
    setActiveImage(variant.imgUrl);
  };

  const isFavorited = wishlist.includes(product.id);

  return (
    <div 
      onClick={handleSelect}
      className="bg-white border border-[#111111]/5 rounded-xl overflow-hidden shadow-xs hover:border-[#BF953F]/45 hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full group relative text-left"
    >
      {/* MEDIA CONTAINER WINDOW */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        
        {/* Dynamic transition fades between primary and secondary image on hover */}
        <img 
          src={activeImage} 
          alt={product.name} 
          className={`w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-700 object-top absolute inset-0 ${
            secondImage ? 'group-hover:opacity-0' : ''
          }`}
        />

        {secondImage && (
          <img 
            src={secondImage} 
            alt={`${product.name} alternate`} 
            className="w-full h-full object-cover transform scale-102 group-hover:scale-105 transition-all duration-700 object-top absolute inset-0 opacity-0 group-hover:opacity-100"
          />
        )}

        {/* Wishlist floating toggle */}
        <button 
          onClick={(e) => onToggleWishlist(product.id, e)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-neutral-200/50 flex items-center justify-center hover:bg-neutral-900 group/wh"
        >
          <Heart className={`w-4 h-4 transition-all ${
            isFavorited ? 'fill-red-500 text-red-500 scale-110' : 'text-neutral-500 group-hover/wh:text-[#C9A84C]'
          }`} />
        </button>

        {product.badge && (
          <span className="absolute top-4 left-4 bg-[#111111] text-[#FCF6BA] text-[9px] font-bold tracking-[0.2em] py-1.5 px-3 border border-[#C9A84C]/25 uppercase rounded z-10 shadow-md">
            {product.badge}
          </span>
        )}

        {/* Hover quick overlays action menu */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 items-center justify-end p-5">
          <div className="flex gap-2.5 w-full">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 py-3 text-center bg-white/95 text-neutral-800 text-[9px] font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all rounded shadow-sm"
              title="Quick inspect"
            >
              <Eye className="w-3.5 h-3.5 inline-block mr-1 text-[#BF953F]" /> QUICK VIEW
            </button>
          </div>
        </div>
      </div>

      {/* INFORMATION FOOTER */}
      <div className="p-5 flex flex-col flex-1 text-left">
        
        {/* Dynamic color swatches circular row */}
        {product.colorImagesList && product.colorImagesList.length > 0 && (
          <div className="flex gap-2 mb-3 items-center">
            {product.colorImagesList.map((colVariant) => {
              const isActive = activeColor.toLowerCase() === colVariant.colorName.toLowerCase();
              return (
                <button
                  key={colVariant.colorName}
                  onClick={(e) => handleColorSwatch(colVariant, e)}
                  title={colVariant.colorName}
                  className={`w-4 h-4 rounded-full border transition-all duration-300 cursor-pointer flex-shrink-0 flex items-center justify-center ${
                    isActive 
                      ? 'border-[#111111] scale-110 ring-2 ring-black/5' 
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                  style={{ backgroundColor: colVariant.hex }}
                >
                  {isActive && <span className="w-1.5 h-1.5 bg-[#FAF9F6] rounded-full" />}
                </button>
              );
            })}
          </div>
        )}

        <span className="text-[9px] text-neutral-400 font-bold tracking-[0.15em] uppercase mb-1">
          {product.category}'s / {product.subcategory} apparel
        </span>
        <h3 className="font-serif text-base font-normal tracking-wide text-[#111111] group-hover:text-[#BF953F] transition-colors mb-1.5 leading-tight">
          {product.name}
        </h3>
        <div className="text-sm text-[#BF953F] font-bold tracking-wide mb-4">
          Rs. {product.price.toLocaleString()}
        </div>

        {/* Quick add triggers cart loading */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, product.sizes[0] || 'M', activeColor);
          }}
          className="w-full mt-auto py-3.5 rounded bg-[#FAF9F6] border border-black/5 text-[9px] font-bold tracking-[0.2em] text-[#111111] hover:bg-[#111111] hover:text-[#FCF6BA] hover:border-[#111111] transition-all duration-300 uppercase cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-[#BF953F]" /> ADD TO BAG
        </button>

      </div>
    </div>
  );
};
