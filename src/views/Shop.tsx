import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ViewType, ColorVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { 
  SlidersHorizontal, ArrowUpDown, ShoppingCart, HelpCircle, 
  Heart, Eye, X, ShieldAlert, Truck 
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
  };

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = wishlist.includes(productId) 
      ? wishlist.filter(id => id !== productId) 
      : [...wishlist, productId];
    setWishlist(updated);
    localStorage.setItem("markhor_wishlist", JSON.stringify(updated));
  };

  return (
    <div className="bg-[#FAF6F0] text-[#332C2A] min-h-screen pb-20 selection:bg-[#FAD5A5]/40 selection:text-[#332C2A]">
      
      {/* HIGH-END EDITORIAL BANNER HEADER (Exactly as requested) */}
      <div 
        className="relative py-28 bg-cover bg-center border-b border-[#E5DCD3] overflow-hidden"
        style={{ 
          backgroundImage: `url('/3.jpeg')` 
        }}
      >
        {/* Soft dark vignette overlay for high contrast and luxury depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAF6F0] to-transparent" />
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-center items-start text-left">
          <span className="text-[10px] text-[#FAD5A5] tracking-[0.45em] font-bold uppercase mb-3 block drop-shadow-sm">
            MARKHOR ATELIER
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-md uppercase leading-none">
            Markhor Collections
          </h1>
          <div className="w-20 h-[2px] bg-[#FAD5A5] mb-4" />
          <p className="font-sans text-neutral-200 text-base sm:text-lg max-w-xl font-light tracking-wide leading-relaxed drop-shadow-sm">
            Suite for the Modern Journey — where style meets substance.
          </p>
        </div>
      </div>

      {/* PORTAL GRID LAYOUT */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* SIDEBAR FILTERS */}
          <aside className="lg:col-span-3 bg-[#FFFFFF] border border-[#E5DCD3] rounded-2xl p-6 lg:sticky lg:top-24 shadow-[0_8px_30px_rgba(51,44,42,0.04)] text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DCD3] mb-6">
              <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase flex items-center gap-2 text-[#332C2A]">
                <SlidersHorizontal className="w-4 h-4 text-[#C48F56]" /> FILTERS
              </h3>
              <button 
                onClick={clearAllFilters}
                className="text-[10px] font-bold tracking-[0.2em] text-[#C48F56] hover:text-[#332C2A] uppercase transition-colors cursor-pointer bg-transparent border-0"
              >
                RESET
              </button>
            </div>

            {/* Sizes */}
            <div className="mb-6 pb-6 border-b border-[#E5DCD3]">
              <span className="text-[9px] tracking-[0.2em] font-bold uppercase text-[#5C504C]/60 block mb-4">
                SIZE & VOLUME
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
                          ? 'bg-gradient-to-r from-[#FAD5A5] to-[#fdfaf2] text-[#332C2A] border-transparent shadow-sm scale-98' 
                          : 'border-[#E5DCD3] hover:border-[#FAD5A5] text-[#5C504C] bg-[#FAF6F0]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Grid */}
            <div className="mb-6 pb-6 border-b border-[#E5DCD3]">
              <span className="text-[9px] tracking-[0.2em] font-bold uppercase text-[#5C504C]/60 block mb-4">
                COLOR PALETTE
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
                          ? 'bg-[#FAD5A5] text-[#332C2A] border-transparent font-extrabold shadow-sm' 
                          : 'border-[#E5DCD3] hover:border-[#FAD5A5] text-[#5C504C] bg-[#FAF6F0]'
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

            {/* Range Slider */}
            <div className="mb-2">
              <div className="flex justify-between text-[9px] tracking-[0.2em] font-bold text-[#5C504C]/60 uppercase mb-3">
                <span>MAX LIMIT</span>
                <span className="text-[#C48F56] font-mono">Rs. {maxPrice.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min={1000} 
                max={maxPriceLimit} 
                step={100} 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#C48F56] cursor-pointer bg-[#332C2A]/10 h-1 rounded-full outline-none"
              />
              <div className="flex justify-between text-[9px] font-mono text-[#5C504C]/40 mt-2">
                <span>Rs. 1,000</span>
                <span>Rs. {maxPriceLimit.toLocaleString()}</span>
              </div>
            </div>
          </aside>

          {/* MAIN COLUMN OVERVIEW */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Top Navigation Bar Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FFFFFF] border border-[#E5DCD3] p-4 rounded-xl shadow-[0_4px_20px_rgba(51,44,42,0.02)]">
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'men', 'women', 'kids'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer border-0 ${
                      activeCategory === cat
                        ? 'bg-gradient-to-r from-[#FAD5A5] to-[#fdfaf2] text-[#332C2A] font-extrabold shadow-sm'
                        : 'text-[#5C504C]/60 hover:text-[#332C2A] hover:bg-[#FAF6F0] bg-transparent'
                    }`}
                  >
                    {cat === 'all' ? 'All Departments' : `${cat}'s Segment`}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <ArrowUpDown className="w-4 h-4 text-[#C48F56]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF6F0] text-[#332C2A]/80 text-[11px] font-bold tracking-widest border border-[#E5DCD3] rounded-lg py-2.5 px-4 outline-none cursor-pointer focus:border-[#FAD5A5] transition-all"
                >
                  <option value="featured">Default Ordering Matrix</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Alphanumeric: A-Z</option>
                </select>
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-600 text-left">{error}</div>}

            {/* CARDS CONTAINER */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="bg-[#FFFFFF] border border-[#E5DCD3] rounded-xl p-4 flex flex-col gap-4 animate-pulse">
                      <div className="aspect-[3/4] bg-[#FAF6F0] rounded-lg w-full" />
                      <div className="h-3 bg-[#FAF6F0] rounded w-1/3" />
                      <div className="h-5 bg-[#FAF6F0] rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
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
                <div className="border border-[#E5DCD3] bg-[#FFFFFF] text-center py-24 rounded-2xl flex flex-col items-center justify-center gap-4">
                  <HelpCircle className="w-12 h-12 text-[#C48F56]/40" />
                  <h3 className="font-serif text-xl text-[#332C2A]">No Matches Located</h3>
                  <button 
                    onClick={clearAllFilters}
                    className="px-6 py-3 border border-[#FAD5A5] text-[10px] text-[#C48F56] hover:text-[#332C2A] hover:bg-[#FAD5A5] uppercase font-bold tracking-widest rounded-xl transition-all mt-2"
                  >
                    RESET SYSTEM FILTERS
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-[#332C2A]/30 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-[#FFFFFF] border border-[#FAD5A5] rounded-2xl p-6 sm:p-8 shadow-xl overflow-y-auto max-h-[90vh] grid grid-cols-1 md:grid-cols-12 gap-8 text-left"
            >
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#E5DCD3] bg-[#FAF6F0] text-[#332C2A]/70 flex items-center justify-center hover:text-[#C48F56] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="md:col-span-5">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#E5DCD3]">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover object-top" />
                </div>
              </div>

              <div className="md:col-span-7 flex flex-col justify-center">
                <span className="text-[9px] font-bold tracking-[0.3em] text-[#C48F56] uppercase block mb-2">
                  {quickViewProduct.subcategory || 'Premium'} Collection Line
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#332C2A] font-light mb-2">
                  {quickViewProduct.name}
                </h3>
                <span className="text-xl font-mono font-bold text-[#C48F56] pb-4 border-b border-[#E5DCD3] block">
                  Rs. {quickViewProduct.price.toLocaleString()}
                </span>
                
                <p className="text-xs text-[#5C504C] leading-relaxed font-light py-5">
                  {quickViewProduct.description}
                </p>
                
                <div className="flex flex-col gap-3.5 mb-6 text-xs text-[#5C504C]/70">
                  <div className="flex items-center gap-2"><Truck className="w-4.5 h-4.5 text-[#C48F56]" /> <span>Complimentary Secure Courier Delivery</span></div>
                  <div className="flex items-center gap-2"><ShieldAlert className="w-4.5 h-4.5 text-[#C48F56]" /> <span>Verified Authentic Markhor Luxury Asset</span></div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => {
                      onSelectProduct(quickViewProduct);
                      onViewChange('product');
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3.5 bg-gradient-to-r from-[#FAD5A5] to-[#F5E6D3] text-[#332C2A] font-bold tracking-widest text-[10px] uppercase rounded-xl transition-all text-center"
                  >
                    VIEW PRODUCT SPECIFICS
                  </button>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, quickViewProduct.sizes[0] || 'M', quickViewProduct.colors[0] || 'cream');
                      setQuickViewProduct(null);
                    }}
                    className="py-3.5 px-6 border border-[#E5DCD3] bg-[#FAF6F0] text-[#C48F56] hover:bg-[#FAD5A5] hover:text-[#332C2A] rounded-xl flex items-center justify-center transition-all duration-300"
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

  const handleColorSwatch = (variant: ColorVariant, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveColor(variant.colorName);
    setActiveImage(variant.imgUrl);
  };

  const isFavorited = wishlist.includes(product.id);

  return (
    <div 
      onClick={handleSelect}
      className="bg-[#FFFFFF] border border-[#E5DCD3] rounded-xl overflow-hidden shadow-sm hover:border-[#FAD5A5] hover:shadow-[0_10px_30px_rgba(51,44,42,0.05)] transition-all duration-500 cursor-pointer flex flex-col h-full group relative text-left"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF6F0]">
        <img 
          src={activeImage} 
          alt={product.name} 
          className={`w-full h-full object-cover transform scale-100 group-hover:scale-102 transition-all duration-700 object-top absolute inset-0 ${secondImage ? 'group-hover:opacity-0' : ''}`}
        />

        {secondImage && (
          <img 
            src={secondImage} 
            alt={`${product.name} alternate`} 
            className="w-full h-full object-cover transform scale-101 group-hover:scale-102 transition-all duration-700 object-top absolute inset-0 opacity-0 group-hover:opacity-100"
          />
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => onToggleWishlist(product.id, e)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FFFFFF]/80 backdrop-blur-md border border-[#E5DCD3] flex items-center justify-center hover:bg-[#FAD5A5] hover:text-[#332C2A] transition-all duration-300"
        >
          <Heart className={`w-4 h-4 transition-all ${isFavorited ? 'fill-red-500 text-red-500 scale-110' : 'text-[#5C504C]/60'}`} />
        </button>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-4 left-4 bg-[#FFFFFF] border border-[#FAD5A5] text-[#332C2A] text-[9px] font-mono font-bold tracking-[0.2em] py-1.5 px-3 uppercase rounded z-10 shadow-sm">
            {product.badge}
          </span>
        )}

        <div className="absolute inset-0 bg-[#332C2A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-5">
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            className="w-full py-3 text-center bg-[#FFFFFF] text-[#332C2A] border border-[#E5DCD3] hover:bg-gradient-to-r hover:from-[#FAD5A5] hover:to-[#fdfaf2] text-[9px] font-bold tracking-widest uppercase rounded shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <Eye className="w-3.5 h-3.5 inline-block mr-1.5 text-[#C48F56]" /> QUICK INSPECT
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 text-left relative">
        
        {/* Dynamic Swatches Mapping */}
        {product.colorImagesList && product.colorImagesList.length > 0 && (
          <div className="flex gap-1.5 mb-3.5 items-center">
            {product.colorImagesList.map((colVariant) => {
              const isActive = activeColor.toLowerCase() === colVariant.colorName.toLowerCase();
              return (
                <button
                  key={colVariant.colorName}
                  onClick={(e) => handleColorSwatch(colVariant, e)}
                  title={colVariant.colorName}
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 cursor-pointer flex-shrink-0 flex items-center justify-center ${
                    isActive ? 'border-[#C48F56] scale-110 ring-2 ring-[#FAD5A5]/60' : 'border-[#E5DCD3]'
                  }`}
                  style={{ backgroundColor: colVariant.hex }}
                >
                  {isActive && <span className="w-1 h-1 bg-[#332C2A] rounded-full" />}
                </button>
              );
            })}
          </div>
        )}

        <span className="text-[9px] text-[#5C504C]/60 font-bold tracking-[0.2em] uppercase mb-1.5 block">
          {product.category} / {product.subcategory || 'Atelier'}
        </span>
        <h3 className="font-serif text-base font-normal tracking-wide text-[#332C2A] group-hover:text-[#C48F56] transition-colors mb-2 leading-snug">
          {product.name}
        </h3>
        <div className="text-sm font-mono font-bold text-[#C48F56] mb-5">
          Rs. {product.price.toLocaleString()}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, product.sizes[0] || 'M', activeColor);
          }}
          className="w-full mt-auto py-3 rounded-xl bg-[#FAF6F0] border border-[#E5DCD3] text-[9px] font-bold tracking-[0.25em] text-[#332C2A] hover:bg-[#FAD5A5] hover:border-transparent transition-all duration-300 uppercase cursor-pointer flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-[#C48F56]" /> ADD TO SECURE BAG
        </button>

      </div>
    </div>
  );
};