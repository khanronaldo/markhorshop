import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ViewType, ColorVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { 
  SlidersHorizontal, ArrowUpDown, ShoppingCart, HelpCircle, 
  Heart, Eye, X, ShieldAlert, Truck, Filter 
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
  'navy': '#000080',
  'peach': '#FAD5A5'
};

interface ShopProps {
  onViewChange: (view: ViewType) => void;
  onSelectProduct: (product: Product) => void;
}

export const Shop: React.FC<ShopProps> = ({ onViewChange, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();

  const [activeCategory, setActiveCategory] = useState<'all' | 'men' | 'women' | 'kids'>('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(12000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("markhor_wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products && products.length > 0) {
      const highestPrice = Math.max(...products.map(p => p.price));
      setMaxPriceLimit(highestPrice > 0 ? highestPrice : 12000);
      setMaxPrice(highestPrice > 0 ? highestPrice : 12000);
    }
  }, [products]);

  useEffect(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes.some((size) => selectedSizes.includes(size)));
    }
    if (selectedColors.length > 0) {
      result = result.filter((p) => p.colors.some((color) => selectedColors.includes(color.toLowerCase())));
    }
    result = result.filter((p) => p.price <= maxPrice);

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredProducts(result);
  }, [products, activeCategory, selectedSizes, selectedColors, maxPrice, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]);
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(maxPriceLimit);
    setSortBy('featured');
    setIsMobileFilterOpen(false);
  };

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = wishlist.includes(productId) 
      ? wishlist.filter(id => id !== productId) 
      : [...wishlist, productId];
    setWishlist(updated);
    localStorage.setItem("markhor_wishlist", JSON.stringify(updated));
  };

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileFilterOpen]);

  return (
    <div className="bg-[#F7E7CE] text-[#1C1A17] min-h-screen pb-20 selection:bg-[#BF953F]/30 selection:text-[#1C1A17]">
      
      {/* HIGH-END EDITORIAL BANNER HEADER */}
      <div 
        className="relative py-20 sm:py-28 bg-cover bg-center border-b border-[#E3DDD3] overflow-hidden"
        style={{ backgroundImage: `url('/3.jpeg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F7E7CE] to-transparent" />
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-center items-start text-left">
          <span className="text-[10px] text-[#BF953F] tracking-[0.45em] font-bold uppercase mb-3 block drop-shadow-sm">
            MARKHOR ATELIER
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-md uppercase leading-none">
            Markhor Collections
          </h1>
          <div className="w-16 sm:w-20 h-[2px] bg-[#BF953F] mb-4" />
          <p className="font-sans text-neutral-200 text-sm sm:text-lg max-w-xl font-light tracking-wide leading-relaxed drop-shadow-sm">
            Suite for the Modern Journey — where style meets substance.
          </p>
        </div>
      </div>

      {/* PORTAL GRID LAYOUT */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-14">
        
        {/* MOBILE NAVIGATION & FILTER TRIGGER */}
        <div className="lg:hidden flex flex-col gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {(['all', 'men', 'women', 'kids'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 border ${
                  activeCategory === cat
                    ? 'bg-[#1C1A17] text-[#BF953F] border-[#1C1A17] shadow-md'
                    : 'bg-[#FFFFFF] text-[#59534E] border-[#E3DDD3] hover:border-[#BF953F]'
                }`}
              >
                {cat === 'all' ? 'All' : `${cat}'s`}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-[#FFFFFF] border border-[#E3DDD3] rounded-full py-2.5 sm:py-3 px-4 sm:px-6 text-[9px] sm:text-[10px] font-bold tracking-widest text-[#1C1A17] hover:bg-[#BF953F] hover:text-white transition-all shadow-sm group"
            >
              <Filter className="w-3.5 h-3.5 text-[#B58A3D] group-hover:text-white" />
              REFINE
            </button>
            
            <div className="relative flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none bg-[#FFFFFF] text-[#1C1A17] text-[9px] sm:text-[10px] font-bold tracking-widest border border-[#E3DDD3] rounded-full py-2.5 sm:py-3 px-4 sm:px-6 outline-none cursor-pointer focus:border-[#BF953F] transition-all shadow-sm"
              >
                <option value="featured">FEATURED</option>
                <option value="price-asc">LOW-HIGH</option>
                <option value="price-desc">HIGH-LOW</option>
                <option value="name">A-Z</option>
              </select>
              <ArrowUpDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B58A3D] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          
          {/* MOBILE BACKDROP */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
            )}
          </AnimatePresence>

          {/* SIDEBAR FILTERS */}
          <aside className={`
            bg-[#FFFFFF] text-left transition-transform duration-300 ease-in-out z-50
            ${isMobileFilterOpen 
              ? 'fixed inset-x-0 bottom-0 rounded-t-[2.5rem] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] max-h-[85vh] overflow-y-auto transform translate-y-0' 
              : 'hidden lg:block lg:sticky lg:top-24 border border-[#E3DDD3] rounded-2xl p-6 shadow-[0_8px_30px_rgba(28,26,23,0.04)] lg:col-span-3'}
          `}>
            {isMobileFilterOpen && (
              <div className="flex flex-col items-center mb-6 lg:hidden">
                <div className="w-12 h-1.5 bg-[#E3DDD3] rounded-full mb-4" />
                <div className="w-full flex items-center justify-between">
                  <h3 className="text-xs font-bold tracking-[0.25em] uppercase text-[#1C1A17]">Refine Selection</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-[#F5F5F5] rounded-full text-[#1C1A17] hover:bg-[#BF953F] hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="hidden lg:flex items-center justify-between pb-4 border-b border-[#E3DDD3] mb-6">
              <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase flex items-center gap-2 text-[#1C1A17]">
                <SlidersHorizontal className="w-4 h-4 text-[#B58A3D]" /> FILTERS
              </h3>
              <button 
                onClick={clearAllFilters}
                className="text-[10px] font-bold tracking-[0.2em] text-[#B58A3D] hover:text-[#1C1A17] uppercase transition-colors cursor-pointer bg-transparent border-0"
              >
                CLEAR ALL
              </button>
            </div>

            <div className="mb-6 pb-6 border-b border-[#E3DDD3]">
              <span className="text-[9px] tracking-[0.2em] font-bold uppercase text-[#59534E] block mb-4">
                DIMENSIONS & FIT
              </span>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', '50ml', '100ml', '41', '42', '43'].map((size) => {
                  const isChecked = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-2 px-3 text-[10px] font-mono font-bold border rounded-lg transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-[#1C1A17] text-[#BF953F] border-[#1C1A17] shadow-sm' 
                          : 'border-[#E3DDD3] hover:border-[#BF953F] text-[#59534E] bg-[#F5F5F5]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-[#E3DDD3]">
              <span className="text-[9px] tracking-[0.2em] font-bold uppercase text-[#59534E] block mb-4">
                CURATED SHADES
              </span>
              <div className="flex flex-wrap gap-2">
                {['black', 'white', 'blue', 'dark blue', 'gray', 'cream', 'maroon', 'olive', 'beige', 'navy', 'peach'].map((col) => {
                  const isChecked = selectedColors.includes(col);
                  return (
                    <button
                      key={col}
                      onClick={() => toggleColor(col)}
                      className={`flex items-center gap-2 text-[9px] font-bold uppercase px-3 py-2 border rounded-xl transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-[#F5F5F5] text-[#1C1A17] border-[#BF953F] font-extrabold shadow-sm ring-1 ring-[#BF953F]' 
                          : 'border-[#E3DDD3] hover:border-[#BF953F] text-[#59534E] bg-[#FFFFFF]'
                      }`}
                    >
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-black/10 flex-shrink-0" 
                        style={{ backgroundColor: COLOR_MAP[col] || '#c4a96e' }}
                      />
                      <span className="capitalize">{col}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-[9px] tracking-[0.2em] font-bold text-[#59534E] uppercase mb-3">
                <span>PRICE THRESHOLD</span>
                <span className="text-[#B58A3D] font-mono">Rs. {maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min={1000} 
                max={maxPriceLimit} 
                step={100} 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1C1A17] cursor-pointer bg-[#E3DDD3] h-1.5 rounded-full outline-none"
              />
              <div className="flex justify-between text-[9px] font-mono text-[#59534E]/70 mt-3">
                <span>Rs. 1,000</span>
                <span>Rs. {maxPriceLimit.toLocaleString()}</span>
              </div>
            </div>

            {isMobileFilterOpen && (
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full mt-6 py-4 bg-[#1C1A17] text-[#BF953F] text-[10px] font-bold tracking-[0.25em] uppercase rounded-xl hover:bg-black transition-colors"
              >
                Apply Adjustments ({filteredProducts.length})
              </button>
            )}
          </aside>

          {/* MAIN COLUMN */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            <div className="hidden lg:flex flex-row justify-between items-center gap-4 bg-[#FFFFFF] border border-[#E3DDD3] p-4 rounded-xl shadow-[0_4px_20px_rgba(28,26,23,0.02)]">
              <div className="flex gap-1.5">
                {(['all', 'men', 'women', 'kids'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer border-0 ${
                      activeCategory === cat
                        ? 'bg-[#1C1A17] text-[#BF953F] shadow-sm'
                        : 'text-[#59534E] hover:text-[#1C1A17] hover:bg-[#F5F5F5] bg-transparent'
                    }`}
                  >
                    {cat === 'all' ? 'The Atelier' : `${cat}'s Segment`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <ArrowUpDown className="w-4 h-4 text-[#B58A3D]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#F5F5F5] text-[#1C1A17] text-[10px] font-bold tracking-widest border border-[#E3DDD3] rounded-lg py-2.5 px-4 outline-none cursor-pointer focus:border-[#BF953F] transition-all"
                >
                  <option value="featured">DEFAULT CURATION</option>
                  <option value="price-asc">PRICE: LOW TO HIGH</option>
                  <option value="price-desc">PRICE: HIGH TO LOW</option>
                  <option value="name">ALPHABETIC: A-Z</option>
                </select>
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-600 text-left">{error}</div>}

            {/* CARDS CONTAINER */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-3 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-8">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} className="bg-[#FFFFFF] border border-[#E3DDD3] rounded-md sm:rounded-xl p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 animate-pulse">
                      <div className="aspect-[3/4] bg-[#F5F5F5] rounded-md sm:rounded-lg w-full" />
                      <div className="h-2 sm:h-3 bg-[#F5F5F5] rounded w-1/3" />
                      <div className="h-3 sm:h-5 bg-[#F5F5F5] rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-3 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-8"
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
                <div className="border border-[#E3DDD3] bg-[#FFFFFF] text-center py-24 rounded-2xl flex flex-col items-center justify-center gap-4">
                  <HelpCircle className="w-12 h-12 text-[#B58A3D]/40" />
                  <h3 className="font-serif text-xl text-[#1C1A17]">No Selections Found</h3>
                  <button 
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-[#1C1A17] text-[#BF953F] hover:bg-black text-[10px] uppercase font-bold tracking-widest rounded-xl transition-all mt-2 cursor-pointer"
                  >
                    RESET ALL FILTERS
                  </button>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* QUICK VIEW OVERLAY MODAL */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-[#1C1A17]/60 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-[#FFFFFF] border border-[#E3DDD3] rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] grid grid-cols-1 md:grid-cols-12 gap-8 text-left"
            >
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#E3DDD3] bg-[#F5F5F5] text-[#1C1A17]/70 flex items-center justify-center hover:bg-[#1C1A17] hover:text-[#BF953F] transition-all cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="md:col-span-5">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#F5F5F5] border border-[#E3DDD3]">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover object-top" />
                </div>
              </div>

              <div className="md:col-span-7 flex flex-col justify-center">
                <span className="text-[9px] font-bold tracking-[0.3em] text-[#B58A3D] uppercase block mb-2">
                  {quickViewProduct.subcategory || 'Premium'} Collection Line
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1A17] font-light mb-2">
                  {quickViewProduct.name}
                </h3>
                <span className="text-xl font-mono font-bold text-[#BF953F] pb-4 border-b border-[#E3DDD3] block">
                  Rs. {quickViewProduct.price.toLocaleString()}
                </span>
                
                <p className="text-xs text-[#59534E] leading-relaxed font-light py-5">
                  {quickViewProduct.description}
                </p>
                
                <div className="flex flex-col gap-3.5 mb-6 text-xs text-[#59534E]">
                  <div className="flex items-center gap-2"><Truck className="w-4.5 h-4.5 text-[#B58A3D]" /> <span>Complimentary Secure Courier Delivery</span></div>
                  <div className="flex items-center gap-2"><ShieldAlert className="w-4.5 h-4.5 text-[#B58A3D]" /> <span>Verified Authentic Markhor Luxury Asset</span></div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => {
                      onSelectProduct(quickViewProduct);
                      onViewChange('product');
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3.5 bg-[#1C1A17] text-[#BF953F] hover:bg-black font-bold tracking-widest text-[10px] uppercase rounded-xl transition-all text-center cursor-pointer"
                  >
                    VIEW SPECIFICS
                  </button>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, quickViewProduct.sizes[0] || 'M', quickViewProduct.colors[0] || 'cream');
                      setQuickViewProduct(null);
                    }}
                    className="py-3.5 px-6 border border-[#E3DDD3] bg-[#F5F5F5] text-[#B58A3D] hover:bg-[#BF953F] hover:text-white hover:border-[#BF953F] rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer"
                  >
                    <ShoppingCart className="w-4.5 h-4.5" />
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

/* ── PRODUCT CARD ── */
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
  product, wishlist, onSelect, onViewChange, onQuickView, onToggleWishlist, addToCart 
}) => {
  const defaultCol = product.colors && product.colors.length > 0 ? product.colors[0] : 'cream';
  const [activeImage, setActiveImage] = useState(product.image);
  const [activeColor, setActiveColor] = useState(defaultCol);
  const [secondImage, setSecondImage] = useState<string | null>(null);

  useEffect(() => {
    setActiveImage(product.image);
    const primaryCol = product.colors && product.colors.length > 0 ? product.colors[0] : 'cream';
    setActiveColor(primaryCol);

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

  const isFavorited = wishlist.includes(product.id);

  return (
    <div 
      onClick={handleSelect}
      className="bg-[#FFFFFF] border border-[#E3DDD3] rounded-md sm:rounded-xl overflow-hidden shadow-sm hover:border-[#BF953F] hover:shadow-[0_10px_30px_rgba(28,26,23,0.08)] transition-all duration-500 cursor-pointer flex flex-col h-full group relative text-left"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F5]">
        <img 
          src={activeImage} 
          alt={product.name} 
          className={`w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-700 object-top absolute inset-0 ${secondImage ? 'group-hover:opacity-0' : ''}`}
        />

        {secondImage && (
          <img 
            src={secondImage} 
            alt={`${product.name} alternate`} 
            className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-700 object-top absolute inset-0 opacity-0 group-hover:opacity-100"
          />
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => onToggleWishlist(product.id, e)}
          className="absolute top-1.5 right-1.5 sm:top-4 sm:right-4 z-10 w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-[#FFFFFF]/80 backdrop-blur-md border border-[#E3DDD3] flex items-center justify-center hover:bg-[#BF953F] hover:text-white transition-all duration-300 shadow-sm"
        >
          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 transition-all ${isFavorited ? 'fill-red-500 text-red-500 scale-110' : 'text-[#59534E]'}`} />
        </button>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-1.5 left-1.5 sm:top-4 sm:left-4 bg-[#1C1A17] text-[#BF953F] text-[6px] sm:text-[8px] font-mono font-bold tracking-[0.2em] py-0.5 px-1.5 sm:py-1.5 sm:px-3 uppercase rounded z-10 shadow-sm">
            {product.badge}
          </span>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A17]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex flex-col items-center justify-end p-5">
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="w-full py-3 text-center bg-[#FFFFFF] text-[#1C1A17] border border-transparent hover:bg-[#BF953F] hover:text-white text-[9px] font-bold tracking-widest uppercase rounded shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <Eye className="w-3.5 h-3.5 inline-block mr-1.5" /> QUICK INSPECT
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-2 sm:p-5 flex flex-col flex-1 text-left relative mt-1 sm:mt-0">
        
        <span className="text-[6px] sm:text-[9px] text-[#59534E] font-bold tracking-[0.2em] uppercase mb-0.5 sm:mb-1.5 block line-clamp-1">
          {product.category} / {product.subcategory || 'Atelier'}
        </span>
        <h3 className="font-serif text-[10px] sm:text-base font-normal tracking-wide text-[#1C1A17] group-hover:text-[#B58A3D] transition-colors mb-1 sm:mb-2 leading-tight sm:leading-snug line-clamp-1">
          {product.name}
        </h3>
        <div className="text-[8px] sm:text-sm font-mono font-bold text-[#BF953F] mb-2 sm:mb-5">
          Rs. {product.price.toLocaleString()}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, product.sizes[0] || 'M', activeColor);
          }}
          className="w-full mt-auto py-1.5 sm:py-3.5 rounded-md sm:rounded-xl bg-[#F5F5F5] border border-[#E3DDD3] text-[7px] sm:text-[9px] font-bold tracking-[0.1em] sm:tracking-[0.25em] text-[#1C1A17] hover:bg-[#1C1A17] hover:text-[#BF953F] hover:border-transparent transition-all duration-300 uppercase cursor-pointer flex items-center justify-center gap-1 sm:gap-2 group/btn"
        >
          <ShoppingCart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#B58A3D] group-hover/btn:text-[#BF953F]" /> 
          <span className="hidden sm:inline">ADD TO SECURE BAG</span>
          <span className="sm:hidden">ADD</span>
        </button>

      </div>
    </div>
  );
};