import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ViewType, DbVariant, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { 
  ChevronRight, Truck, ShieldCheck, Heart, ArrowLeft, Star, ShoppingBag, 
  HelpCircle, Eye, Check, Globe, Sparkles, AlertTriangle, MessageSquare, ChevronDown
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
  'tan': '#b58c5c',
  'mint': '#a7f3d0'
};

interface ProductDetailProps {
  product: Product;
  onViewChange: (view: ViewType) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onViewChange, 
  onSelectProduct 
}) => {
  const { addToCart } = useCart();
  const { products, addReview } = useProducts();

  // Selected Variant properties
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  
  // Custom Interaction States
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'fabric' | 'shipping' | 'ateliers'>('fabric');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showFullscreenGallery, setShowFullscreenGallery] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);

  // Review Form States
  const [ratingsAverage, setRatingsAverage] = useState(4.8);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);

  // Accordion active flags
  const [expandedSection, setExpandedSection] = useState<string | null>('specifications');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize base values whenever catalog focus swaps
  useEffect(() => {
    const defaultCol = product.colors && product.colors.length > 0 ? product.colors[0] : 'black';
    setSelectedColor(defaultCol);
    
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
    setSelectedSize(defaultSize);
    
    setQuantity(1);
    setActiveImage(product.image);
    setReviewSuccessMsg('');
    setReviewerName('');
    setReviewerComment('');
  }, [product]);

  // Expandable media gallery images
  const allGalleryImages = [
    product.image,
    ...(product.gallery || []),
    ...(product.colorImagesList?.map(c => c.imgUrl) || [])
  ].filter((img, index, self) => img && self.indexOf(img) === index);

  // Calculate rating averages directly
  const reviewList = product.reviews || [];
  const displayRating = reviewList.length > 0 
    ? Number((reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length).toFixed(1))
    : 4.8;

  // Locate active matched variant item in array
  const activeVariant = product.variants?.find(
    (v) => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size === selectedSize
  );

  // Calculate dynamic variant pricing adjustment or default
  const displayedPrice = activeVariant?.price ? Number(activeVariant.price) : product.price;

  // Dynamic stock reporting indicators
  const activeStock = activeVariant !== undefined ? activeVariant.stock : (product.stock || 50);

  const handleColorSelection = (col: string) => {
    setSelectedColor(col);
    
    // Auto swap active main picture is thumbnail exists
    if (product.colorImagesList) {
      const match = product.colorImagesList.find(c => c.colorName.toLowerCase() === col.toLowerCase());
      if (match && match.imgUrl) {
        setActiveImage(match.imgUrl);
      }
    } else {
      const matchedVar = product.variants?.find(v => v.color.toLowerCase() === col.toLowerCase());
      if (matchedVar && matchedVar.main_image) {
        setActiveImage(matchedVar.main_image);
      }
    }
  };

  // Hover Zoom Effect Engine coordinates calculator
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a wearable size.");
      return;
    }
    if (activeStock <= 0) {
      alert("This specific color-size variant is depleted. Choose another cut!");
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    
    setToastMessage(`SUCCESSFULLY ADDED ${quantity}x MASTER WEAVE STYLE TO BAG!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Safe related products filtering excluding core product
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const handleSelectRelated = (related: Product) => {
    onSelectProduct(related);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewerComment) {
      alert("Please write both your name and feedback.");
      return;
    }
    setLoadingReview(true);
    const res = await addReview(product.id, reviewerRating, reviewerName, reviewerComment);
    if (res.success) {
      setReviewSuccessMsg("✓ Thank you! Restoring review registries live on database.");
      setReviewerName('');
      setReviewerComment('');
    } else {
      alert("Registry write block: Offline static feedback triggered.");
      setReviewSuccessMsg("✓ Review catalog cached locally.");
    }
    setLoadingReview(false);
  };

 return (
    <div className="bg-[#F4E8D3] text-[#111111] min-h-screen py-6 sm:py-10 pb-24 text-left transition-colors duration-500">
      {/* Champagne Beige Background Applied Here */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP LEVEL NAVIGATION BREADCRUMBS */}
        
        {/* TOP LEVEL NAVIGATION BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs text-neutral-500 mb-6 sm:mb-10 h-10 tracking-[0.2em] uppercase border-b border-black/10 pb-3 font-sans">
          <button onClick={() => onViewChange('home')} className="hover:text-[#BF953F] cursor-pointer font-bold transition-colors">Atelier</button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <button onClick={() => onViewChange('shop')} className="hover:text-[#BF953F] cursor-pointer font-bold transition-colors">All Products</button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[#BF953F] font-bold tracking-normal truncate">{product.name}</span>
        </nav>

        {/* DETAILS COLUMN SPLITS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start self-stretch">
          
          {/* LEFT: INTERACTIVE MULTI-PHOTO GALLERY WITH HOVER ZOOM & SLIDER */}
          <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-6 self-stretch">
            
            {/* LARGE VIEWER WITH PRECISION HOVER MATRIX */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onClick={() => {
                const idx = allGalleryImages.indexOf(activeImage);
                setFullscreenImageIndex(idx >= 0 ? idx : 0);
                setShowFullscreenGallery(true);
              }}
              className="relative aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-sm group cursor-zoom-in"
            >
              <img 
                src={activeImage} 
                alt={product.name}
                style={isZoomed ? {
                  transform: 'scale(1.5)',
                  transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`
                } : undefined}
                className="w-full h-full object-cover transition-transform duration-300 object-top"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 bg-black/90 backdrop-blur-md text-[#FCF6BA] border border-[#C9A84C]/30 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                  {product.badge}
                </span>
              )}

              <div className="absolute bottom-5 right-5 bg-white/80 backdrop-blur-md w-10 h-10 border border-white/50 rounded-full flex items-center justify-center text-neutral-600 shadow-lg pointer-events-none transition-transform group-hover:scale-110">
                <Eye className="w-4.5 h-4.5 text-[#BF953F]" />
              </div>
            </div>

            {/* THUMBNAIL MATRIX SELECTOR */}
            {allGalleryImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {allGalleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-[3/4] rounded-xl overflow-hidden bg-white transition-all cursor-pointer ${
                      activeImage === img 
                        ? 'border-2 border-[#BF953F] scale-95 shadow-md opacity-100' 
                        : 'border border-transparent hover:border-black/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail swatch" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}

            {/* EXPANDABLE DETAILS ACCORDIONS GROUP */}
            <div className="mt-6 sm:mt-8 flex flex-col gap-3 font-sans">
              
              {/* Acc 1: Specifications */}
              <div className="rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-black/5 shadow-sm transition-all hover:bg-white/90">
                <button 
                  onClick={() => setExpandedSection(expandedSection === 'specifications' ? null : 'specifications')}
                  className="w-full py-5 px-6 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-[#111111] cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Globe className="w-4.5 h-4.5 text-[#BF953F]" /> Spec Index Sheets</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${expandedSection === 'specifications' ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {expandedSection === 'specifications' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-black/5"
                    >
                      <div className="flex flex-col text-xs font-light font-sans bg-white/40">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-12 px-6 py-4 border-b border-black/5 last:border-0 leading-relaxed items-center">
                            <span className="col-span-4 sm:col-span-5 text-neutral-500 uppercase tracking-widest font-semibold text-[10px]">{key}</span>
                            <span className="col-span-8 sm:col-span-7 text-[#111111] font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Acc 2: Care & Maintenance */}
              <div className="rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-black/5 shadow-sm transition-all hover:bg-white/90">
                <button 
                  onClick={() => setExpandedSection(expandedSection === 'care' ? null : 'care')}
                  className="w-full py-5 px-6 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-[#111111] cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Sparkles className="w-4.5 h-4.5 text-[#BF953F]" /> Care Instructions</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${expandedSection === 'care' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedSection === 'care' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-black/5"
                    >
                      <div className="p-6 text-xs text-neutral-600 leading-relaxed bg-white/40 font-sans flex flex-col gap-3">
                        <p className="flex gap-2"><span>•</span><span>Dry cleaning recommended for raw silk and cotton flax blends to retain natural fiber luster.</span></p>
                        <p className="flex gap-2"><span>•</span><span>Dry iron on inside face only; do not place hot elements directly onto gold hand embroidery thread lines.</span></p>
                        <p className="flex gap-2"><span>•</span><span>Keep folded in luxury breathable linen boxes to avoid humidity discoloration.</span></p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

          {/* RIGHT: DETAILED METADATA & PURCHASE CONSOLE */}
          <div className="lg:col-span-6 flex flex-col font-sans">
            
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 font-sans">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold">
                MARKHOR COLLECTIONS • CLASSIC {product.category}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 bg-black/5 px-2.5 py-1 rounded-md uppercase font-bold">
                ID: {product.id}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#111111] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Star ratings details */}
            <div className="flex items-center gap-2 mb-6 sm:mb-8 font-sans">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-700 font-mono">{displayRating} Rating Index</span>
              <span className="text-xs text-neutral-500">({reviewList.length} verified submissions)</span>
            </div>

            {/* DYNAMIC PRICE ACCORDING TO COLOR-SIZE SELECTION */}
            <div className="text-3xl sm:text-4xl font-sans font-bold text-[#BF953F] pb-6 sm:pb-8 border-b border-black/10 mb-6 sm:mb-8 flex items-baseline gap-3">
              <span>Rs. {displayedPrice.toLocaleString()}</span>
              {activeVariant?.id && (
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 bg-white/60 px-2 py-1 rounded-md uppercase font-bold border border-black/5">VARIANT INDEX PRICE</span>
              )}
            </div>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light mb-8 sm:mb-10">
              {product.description || 'This iconic limited release represents Markhor Collections elite craftsmanship philosophy. Every garment contour is handfinished by master artisans in Pakistan.'}
            </p>

            {/* COLOR MATRIX SELECTIONS */}
            <div className="mb-8 select-none">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-500 uppercase">
                 <strong className="text-black capitalize ml-1"></strong>
                </span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((col) => {
                  const isActive = selectedColor.toLowerCase() === col.toLowerCase();
                
                })}
              </div>
            </div>

            {/* SIZE SYSTEM WITH DEPLETED STOCK INDICATION */}
            <div className="mb-8 select-none">
              <div className="flex justify-between items-center mb-4 font-sans">
                <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-500 uppercase">
                  Atelier Wearable Size: <strong className="text-black ml-1">{selectedSize || 'Choose Cut'}</strong>
                </span>

                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[10px] font-bold tracking-wider text-[#BF953F] hover:text-[#111111] uppercase underline bg-transparent border-0 cursor-pointer transition-colors"
                >
                  Size Chart Index →
                </button>
              </div>

              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((s) => {
                  const matchingVar = product.variants?.find(
                    v => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size === s
                  );
                  const isDepleted = matchingVar !== undefined && matchingVar.stock <= 0;
                  const isSelected = selectedSize === s;

                  return (
                    <button
                      key={s}
                      disabled={isDepleted}
                      onClick={() => setSelectedSize(s)}
                      className={`h-12 sm:h-14 text-xs font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer min-w-[3.5rem] sm:min-w-[4rem] relative shadow-sm ${
                        isSelected
                          ? 'bg-[#111111] text-[#FCF6BA] border-transparent scale-105 shadow-md z-10'
                          : isDepleted 
                            ? 'border-transparent bg-black/5 text-neutral-400 cursor-not-allowed line-through'
                            : 'border-white/50 bg-white/70 hover:bg-white text-neutral-700 hover:shadow-md backdrop-blur-sm'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{s}</span>
                      {isDepleted && (
                        <span className="absolute -bottom-2 inset-x-0 mx-auto w-max text-[8px] font-bold bg-neutral-800 text-white rounded-md px-1.5 py-0.5 scale-85 uppercase shadow-sm">OUT</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUANTITY CONSOLE & AVAILABILITY OVERLAYS */}
            <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-6 sm:p-7 mb-8 shadow-sm flex flex-col gap-5 font-sans">
              <div className="flex flex-wrap gap-2 justify-between items-center text-xs">
                <span className="text-neutral-500 uppercase tracking-widest font-bold text-[10px]">Real-time Availability Status</span>
                {activeStock > 0 ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1.5 bg-emerald-50/80 px-3 py-1.5 rounded-full border border-emerald-100">
                    <Check className="w-3.5 h-3.5 bg-emerald-500 text-white rounded-full p-0.5" />
                    <span className="text-[10px] sm:text-xs">In Atelier Registry ({activeStock} items left)</span>
                  </span>
                ) : (
                  <span className="text-red-600 font-bold flex items-center gap-1.5 bg-red-50/80 px-3 py-1.5 rounded-full border border-red-100">
                    <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                    <span className="text-[10px] sm:text-xs">Variant Deallocated / Out of Stock</span>
                  </span>
                )}
              </div>

              {activeStock > 0 && (
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-t border-black/5 pt-5">
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <span className="text-[9px] tracking-[0.2em] font-bold text-neutral-500 uppercase pl-1">INVENTORY COUNT</span>
                    <div className="flex items-center border border-black/10 rounded-2xl overflow-hidden bg-white h-14 w-full sm:w-36 shadow-inner">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex-1 text-center font-semibold hover:bg-neutral-100 h-full cursor-pointer hover:text-black transition-colors text-lg"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-mono font-bold text-base text-[#111111]">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(activeStock, quantity + 1))}
                        className="flex-1 text-center font-semibold hover:bg-neutral-100 h-full cursor-pointer hover:text-black transition-colors text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Primary Bag Insert Action */}
                  <div className="flex-1 flex flex-col gap-2 w-full h-full justify-end">
                    <span className="hidden sm:block text-[9px] tracking-[0.2em] font-bold text-transparent select-none uppercase">ACTION</span>
                    <button
                      onClick={handleAddToCart}
                      className="w-full h-14 rounded-2xl bg-[#111111] text-[#FCF6BA] text-xs font-bold tracking-widest uppercase hover:bg-black active:scale-[0.98] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-4.5 h-4.5 text-[#C9A84C]" /> ADD TO BAG
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Micro Alerts Block */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  className="bg-[#111111] text-[#FCF6BA] border border-[#BF953F]/30 rounded-2xl p-4.5 text-xs sm:text-sm tracking-wider mb-8 text-center font-bold shadow-xl flex items-center justify-center gap-2.5 z-50"
                >
                  <Sparkles className="w-4.5 h-4.5 text-[#C9A84C]" /> {toastMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* TRANSACTION PRIVACY SHIELD DETAILS */}
            <div className="flex flex-col gap-4 text-xs sm:text-sm text-neutral-600 bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-sm mb-8">
              <div className="flex items-start sm:items-center gap-3">
                <Truck className="w-5 h-5 text-[#BF953F] flex-shrink-0" />
                <span className="leading-snug">Complimentary priority dispatch: <strong className="text-black font-semibold">{product.shipping || 'Free Standard (3 Days)'}</strong></span>
              </div>
              <div className="w-full h-px bg-black/5 rounded-full"></div>
              <div className="flex items-start sm:items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#BF953F] flex-shrink-0" />
                <span className="leading-snug">Encrypted secure financial transactions checkout portals.</span>
              </div>
            </div>

          </div>
        </div>

        {/* REVIEWS SYSTEM MODULE */}
        <section className="mt-20 sm:mt-28 border-t border-black/10 pt-12 sm:pt-16 font-sans">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold block mb-2">
            Verified Customer Registries
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#111111] mb-8 sm:mb-12">
            Reviews
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 text-left">
            
            {/* Left: Star stats and Form write portal */}
            <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
              <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-3 transition-all hover:bg-white/80">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block">Rating Density Index</span>
                <span className="text-6xl sm:text-7xl font-light text-[#111111] tracking-tighter">{displayRating}</span>
                <div className="flex text-amber-500 gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-current drop-shadow-sm" />
                  ))}
                </div>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">100% genuine verified owners share insights regarding fabric drape and colors retention.</p>
              </div>

              {/* Form Portal to add real reviews */}
              <form onSubmit={handleReviewSubmission} className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-6 sm:p-8 shadow-sm text-xs flex flex-col gap-5 transition-all hover:bg-white/80">
                <span className="text-[10px] font-bold tracking-widest text-[#111111] uppercase border-b border-black/5 pb-3 mb-1 block">Commit Customer Review</span>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase ml-1">Reviewer Name</span>
                  <input 
                    type="text" 
                    placeholder="e.g. Hammad Malik, Lahore" 
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="py-3.5 px-5 border border-white/50 rounded-xl outline-none bg-white/50 focus:bg-white focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 transition-all text-xs sm:text-sm shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase ml-1">Thread Score (1-5 Stars)</span>
                  <div className="flex gap-1.5 bg-white/50 w-max px-4 py-2.5 rounded-xl border border-white/50 shadow-inner">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        type="button" 
                        onClick={() => setReviewerRating(s)}
                        className="p-1 cursor-pointer hover:scale-125 transition-transform"
                      >
                        <Star className={`w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm transition-colors ${s <= reviewerRating ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase ml-1">Review Comments</span>
                  <textarea 
                    rows={4}
                    placeholder="Weaving density, gold print wash longevity, color reflections..."
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    className="py-3.5 px-5 border border-white/50 rounded-xl outline-none bg-white/50 focus:bg-white focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 resize-y text-xs sm:text-sm shadow-inner"
                  />
                </div>

                {reviewSuccessMsg && (
                  <div className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-100/80 backdrop-blur-sm rounded-xl p-3.5 text-center border border-emerald-200">
                    {reviewSuccessMsg}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loadingReview}
                  className="py-4 mt-2 bg-[#111111] text-[#FCF6BA] font-bold text-[10px] sm:text-xs tracking-widest uppercase rounded-xl cursor-pointer hover:bg-black hover:shadow-lg active:scale-[0.98] transition-all"
                >
                  {loadingReview ? 'WRITING REGISTRY...' : 'POST VERIFIED REVIEW ✓'}
                </button>
              </form>
            </div>

            {/* Right: Historic reviews logs */}
            <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
              {reviewList.length > 0 ? (
                <div className="flex flex-col gap-4 sm:gap-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {reviewList.map((rev, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-3xl p-6 sm:p-7 text-left text-xs sm:text-sm flex flex-col gap-3.5 shadow-sm relative transition-all hover:bg-white/80 hover:shadow-md">
                      <span className="absolute top-6 right-6 text-[10px] text-neutral-400 font-mono font-semibold bg-white/60 px-2 py-1 rounded-md">05/2026</span>
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#BF953F]/20 to-[#BF953F]/5 text-[#BF953F] font-bold text-xs flex items-center justify-center border border-[#BF953F]/30 select-none uppercase shadow-sm">
                          {rev.reviewer_name?.substring(0,2) || 'MC'}
                        </span>
                        <div className="flex flex-col text-left">
                          <strong className="text-neutral-800 tracking-wide font-bold capitalize text-sm">{rev.reviewer_name || 'Anonymous Client'}</strong>
                          <div className="flex text-amber-500 gap-0.5 mt-0.5">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-neutral-600 leading-relaxed font-light mt-1 pl-0 sm:pl-12 pr-4">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full border-2 border-black/5 border-dashed rounded-3xl p-10 sm:p-16 text-center text-neutral-500 font-light flex flex-col items-center justify-center gap-4 bg-white/30 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-2">
                    <MessageSquare className="w-7 h-7 text-neutral-400" />
                  </div>
                  <p className="text-sm sm:text-base max-w-xs">No historic testimonials registered yet. Be the first flagship client to share your thoughts!</p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* RELATED COMPLEMENTARY PAIRINGS GALLERY */}
        <section className="mt-24 sm:mt-32 border-t border-black/10 pt-16 select-none font-sans">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-5">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold block mb-2">
                COMPLEMENTARY STYLE CODES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#111111]">
                Recommended Pairings
              </h2>
            </div>
            <button 
              onClick={() => onViewChange('shop')}
              className="px-6 py-3.5 border border-black/10 hover:border-black hover:bg-[#111111] hover:text-[#FCF6BA] transition-all duration-300 text-[10px] font-bold tracking-widest uppercase rounded-xl cursor-pointer bg-white/50 backdrop-blur-sm"
            >
              Discover Collections
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
              <div 
                key={p.id}
                onClick={() => handleSelectRelated(p)}
                className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl cursor-pointer transition-all duration-500 flex flex-col text-center hover:-translate-y-1"
              >
                <div className="aspect-[3/4] overflow-hidden bg-black/5 relative">
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out object-top" />
                </div>
                <div className="p-5 sm:p-6 flex flex-col gap-1.5 items-center justify-center bg-gradient-to-b from-transparent to-white/50">
                  <span className="text-[9px] text-neutral-500 tracking-[0.2em] font-bold uppercase">{p.subcategory} line</span>
                  <h4 className="font-serif text-base sm:text-lg tracking-wide text-[#111111] font-normal group-hover:text-[#BF953F] transition-colors">{p.name}</h4>
                  <span className="text-xs sm:text-sm text-[#BF953F] font-bold mt-1 bg-white/60 px-3 py-1 rounded-md border border-black/5">Rs. {p.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── POPUP: SIZE GUIDE DRAWER ── */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-lg w-full bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl p-6 sm:p-8 shadow-2xl select-none font-sans text-left overflow-hidden"
            >
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full border border-black/10 bg-white/50 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer z-10"
              >
                ×
              </button>
              <h3 className="font-serif text-2xl font-light text-[#111111] border-b border-black/10 pb-4 mb-5">Atelier Measurement Matrix</h3>
              <p className="text-xs sm:text-sm text-neutral-500 mb-6 font-light leading-relaxed">Dimensions are standard inches. Select custom sizing variables according to your chest contour preferences for a bespoke fit.</p>
              
              <div className="overflow-x-auto rounded-xl border border-black/10">
                <table className="w-full text-xs sm:text-sm font-light text-left bg-white">
                  <thead>
                    <tr className="bg-neutral-50/80 border-b border-black/10 font-bold uppercase text-[9px] sm:text-[10px] tracking-wider text-[#BF953F]">
                      <th className="p-3 sm:p-4">Size Designation</th>
                      <th className="p-3 sm:p-4">Chest Width</th>
                      <th className="p-3 sm:p-4">Shoulder Width</th>
                      <th className="p-3 sm:p-4">Sleeve Contour</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-neutral-700">
                    <tr className="hover:bg-neutral-50 transition-colors"><td className="p-3 sm:p-4 font-bold text-black">Small (S)</td><td className="p-3 sm:p-4">38" - 40"</td><td className="p-3 sm:p-4">17.5"</td><td className="p-3 sm:p-4">24.5"</td></tr>
                    <tr className="hover:bg-neutral-50 transition-colors"><td className="p-3 sm:p-4 font-bold text-black">Medium (M)</td><td className="p-3 sm:p-4">41" - 43"</td><td className="p-3 sm:p-4">18.5"</td><td className="p-3 sm:p-4">25.0"</td></tr>
                    <tr className="hover:bg-neutral-50 transition-colors"><td className="p-3 sm:p-4 font-bold text-black">Large (L)</td><td className="p-3 sm:p-4">44" - 46"</td><td className="p-3 sm:p-4">19.5"</td><td className="p-3 sm:p-4">25.5"</td></tr>
                    <tr className="hover:bg-neutral-50 transition-colors"><td className="p-3 sm:p-4 font-bold text-black">XL</td><td className="p-3 sm:p-4">47" - 49"</td><td className="p-3 sm:p-4">20.5"</td><td className="p-3 sm:p-4">26.0"</td></tr>
                    <tr className="hover:bg-neutral-50 transition-colors"><td className="p-3 sm:p-4 font-bold text-black">XXL</td><td className="p-3 sm:p-4">50" - 52"</td><td className="p-3 sm:p-4">21.5"</td><td className="p-3 sm:p-4">26.5"</td></tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── POPUP: FULLSCREEN IMAGE SLIDER MODAL ── */}
      <AnimatePresence>
        {showFullscreenGallery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <button 
              onClick={() => setShowFullscreenGallery(false)}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 text-white flex items-center justify-center text-xl sm:text-2xl cursor-pointer border border-white/10 transition-all z-50"
            >
              ×
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setFullscreenImageIndex((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length); }}
              className="absolute left-4 sm:left-8 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 hover:bg-white/20 text-white text-2xl flex items-center justify-center cursor-pointer border border-white/10 backdrop-blur-md transition-all hover:scale-110 z-50"
            >
              ‹
            </button>

            <motion.img 
              key={fullscreenImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={allGalleryImages[fullscreenImageIndex]} 
              alt="Fullscreen presentation" 
              className="max-h-[80vh] sm:max-h-[85vh] max-w-[85vw] sm:max-w-[90vw] object-contain rounded-2xl shadow-2xl" 
            />

            <button
              onClick={(e) => { e.stopPropagation(); setFullscreenImageIndex((prev) => (prev + 1) % allGalleryImages.length); }}
              className="absolute right-4 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 hover:bg-white/20 text-white text-2xl flex items-center justify-center cursor-pointer border border-white/10 backdrop-blur-md transition-all hover:scale-110 z-50"
            >
              ›
            </button>

            <span className="absolute bottom-8 sm:bottom-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white/80 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest border border-white/10">
              Image {fullscreenImageIndex + 1} of {allGalleryImages.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};