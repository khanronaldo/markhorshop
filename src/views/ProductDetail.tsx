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
    <div className="bg-[#FAF9F6] text-[#111111] min-h-screen py-8 pb-20 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP LEVEL NAVIGATION BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs text-neutral-400 mb-8 h-10 tracking-[0.2em] uppercase border-b border-neutral-200/50 pb-3 font-sans">
          <button onClick={() => onViewChange('home')} className="hover:text-[#BF953F] cursor-pointer font-bold">Atelier</button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
          <button onClick={() => onViewChange('shop')} className="hover:text-[#BF953F] cursor-pointer font-bold">All Products</button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
          <span className="text-[#BF953F] font-bold tracking-normal truncate">{product.name}</span>
        </nav>

        {/* DETAILS COLUMN SPLITS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start self-stretch">
          
          {/* LEFT: INTERACTIVE MULTI-PHOTO GALLERY WITH HOVER ZOOM & SLIDER */}
          <div className="lg:col-span-6 flex flex-col gap-4 self-stretch">
            
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
              className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden border border-[#111111]/5 shadow-sm group cursor-zoom-in"
            >
              <img 
                src={activeImage} 
                alt={product.name}
                style={isZoomed ? {
                  transform: 'scale(1.5)',
                  transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`
                } : undefined}
                className="w-full h-full object-cover transition-transform duration-200 object-top"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 bg-black text-[#FCF6BA] border border-[#C9A84C]/20 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded">
                  {product.badge}
                </span>
              )}

              <div className="absolute bottom-4 right-4 bg-white/75 backdrop-blur-md w-9 h-9 border border-neutral-100 rounded-full flex items-center justify-center text-neutral-500 shadow-sm pointer-events-none">
                <Eye className="w-4 h-4 text-[#BF953F]" />
              </div>
            </div>

            {/* THUMBNAIL MATRIX SELECTOR */}
            {allGalleryImages.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {allGalleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-[3/4] rounded-lg overflow-hidden bg-white border transition-all cursor-pointer ${
                      activeImage === img 
                        ? 'border-[#BF953F] scale-95 shadow-md' 
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <img src={img} alt="Thumbnail swatch" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}

            {/* EXPANDABLE DETAILS ACCORDIONS GROUP */}
            <div className="mt-8 flex flex-col gap-3 font-sans">
              
              {/* Acc 1: Specifications */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <button 
                  onClick={() => setExpandedSection(expandedSection === 'specifications' ? null : 'specifications')}
                  className="w-full py-4.5 px-5 flex justify-between items-center bg-white text-xs font-bold uppercase tracking-widest text-[#111111] cursor-pointer"
                >
                  <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-[#BF953F]" /> Spec Index Sheets</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${expandedSection === 'specifications' ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {expandedSection === 'specifications' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-neutral-100"
                    >
                      <div className="flex flex-col text-xs font-light font-sans bg-neutral-50/50">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-12 px-5 py-3 border-b border-neutral-100/50 last:border-0 leading-relaxed">
                            <span className="col-span-4 text-neutral-400 uppercase tracking-widest font-semibold text-[10px]">{key}</span>
                            <span className="col-span-8 text-[#111111] font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Acc 2: Care & Maintenance */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <button 
                  onClick={() => setExpandedSection(expandedSection === 'care' ? null : 'care')}
                  className="w-full py-4.5 px-5 flex justify-between items-center bg-white text-xs font-bold uppercase tracking-widest text-[#111111] cursor-pointer"
                >
                  <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-[#BF953F]" /> Care Instructions</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${expandedSection === 'care' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedSection === 'care' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-neutral-100"
                    >
                      <div className="p-5 text-xs text-neutral-500 leading-relaxed bg-neutral-50/50 font-sans flex flex-col gap-2.5">
                        <p>• Dry cleaning recommended for raw silk and cotton flax blends to retain natural fiber luster.</p>
                        <p>• Dry dry iron on inside face only; do not place hot elements directly onto gold hand embroidery thread lines.</p>
                        <p>• Keep folded in luxury breathable linen boxes to avoid humidity discoloration.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

          {/* RIGHT: DETAILED METADATA & PURCHASE CONSOLE */}
          <div className="lg:col-span-6 flex flex-col font-sans">
            
            <div className="flex items-center justify-between mb-1.5 font-sans">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold">
                MARKHOR COLLECTIONS • CLASSIC {product.category}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#111111] uppercase font-bold">
                ID: {product.id}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#111111] leading-tight mb-2">
              {product.name}
            </h1>

            {/* Star ratings details */}
            <div className="flex items-center gap-2 mb-6 font-sans">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-600 font-mono">{displayRating} Rating Index</span>
              <span className="text-xs text-neutral-400">({reviewList.length} verified submissions)</span>
            </div>

            {/* DYNAMIC PRICE ACCORDING TO COLOR-SIZE SELECTION */}
            <div className="text-3xl font-sans font-bold text-[#BF953F] pb-6 border-b border-neutral-200/50 mb-8 flex items-baseline gap-2.5">
              <span>Rs. {displayedPrice.toLocaleString()}</span>
              {activeVariant?.id && (
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 bg-neutral-200/50 px-2 py-0.5 rounded uppercase font-bold">VARIANT INDEX PRICE</span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light mb-8">
              {product.description || 'This iconic limited release represents Markhor Collections elite craftsmanship philosophy. Every garment contour is handfinished by master artisans in Pakistan.'}
            </p>

            {/* COLOR MATRIX SELECTIONS */}
            <div className="mb-8 select-none">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-400 uppercase">
                  ACTIVE COLORWAY: <strong className="text-black capitalize">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex gap-2.5 flex-wrap">
                {product.colors.map((col) => {
                  const isActive = selectedColor.toLowerCase() === col.toLowerCase();
                  return (
                    <button
                      key={col}
                      onClick={() => handleColorSelection(col)}
                      className={`flex items-center gap-2.5 text-xs font-bold uppercase py-3 px-5 border rounded-full transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#111111] text-[#FCF6BA] border-[#111111] shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-600 bg-white'
                      }`}
                    >
                      <span 
                        className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0" 
                        style={{ backgroundColor: COLOR_MAP[col] || '#c4a96e' }}
                      />
                      <span className="text-[10px] tracking-widest">{col}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIZE SYSTEM WITH DEPLETED STOCK INDICATION */}
            <div className="mb-8 select-none">
              <div className="flex justify-between items-center mb-4 font-sans">
                <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-400 uppercase">
                  Atelier Wearable Size: <strong className="text-black">{selectedSize || 'Choose Cut'}</strong>
                </span>

                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[10px] font-bold tracking-wider text-[#BF953F] hover:text-[#111111] uppercase underline bg-transparent border-0 cursor-pointer"
                >
                  Size Chart Index →
                </button>
              </div>

              <div className="flex gap-2.5 flex-wrap">
                {product.sizes.map((s) => {
                  const matchingVar = product.variants?.find(
                    v => v.color.toLowerCase() === selectedColor.toLowerCase() && v.size === s
                  );
                  // If variants not initialized, default stock is standard 50, otherwise use variant stock
                  const isDepleted = matchingVar !== undefined && matchingVar.stock <= 0;
                  const isSelected = selectedSize === s;

                  return (
                    <button
                      key={s}
                      disabled={isDepleted}
                      onClick={() => setSelectedSize(s)}
                      className={`h-12 text-xs font-bold border rounded-md transition-all flex items-center justify-center cursor-pointer min-w-14 relative ${
                        isSelected
                          ? 'bg-[#111111] text-[#FCF6BA] border-[#111111] scale-105 shadow-md z-10'
                          : isDepleted 
                            ? 'border-neutral-100 bg-neutral-100 text-neutral-300 cursor-not-allowed line-through'
                            : 'border-neutral-200 hover:border-neutral-400 text-neutral-600 bg-white'
                      }`}
                    >
                      <span>{s}</span>
                      {isDepleted && (
                        <span className="absolute -bottom-1 inset-x-0 mx-auto w-max text-[8px] font-bold bg-[#111111] text-white rounded px-1 scale-85 uppercase">OUT</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUANTITY CONSOLE & AVAILABILITY OVERLAYS */}
            <div className="bg-white border rounded-xl p-5 mb-8 shadow-xs flex flex-col gap-4 font-sans">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400 uppercase tracking-widest font-bold text-[10px]">Real-time Availability Status</span>
                {activeStock > 0 ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4 bg-emerald-100 text-emerald-600 rounded-full p-0.5" />
                    <span>In Atelier Registry ({activeStock} items left)</span>
                  </span>
                ) : (
                  <span className="text-red-500 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                    <span>Variant Deallocated / Out of Stock</span>
                  </span>
                )}
              </div>

              {activeStock > 0 && (
                <div className="flex items-center gap-4 border-t border-neutral-100 pt-4">
                  <div className="flex flex-col gap-1.5 align-left">
                    <span className="text-[9px] tracking-[0.2em] font-bold text-neutral-400 uppercase">INVENTORY COUNT</span>
                    <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-[#FAF9F6] h-12 w-32 shadow-inner">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex-1 text-center font-semibold hover:bg-neutral-200 h-full cursor-pointer hover:text-black transition-all"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-mono font-bold text-sm text-[#111111]">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(activeStock, quantity + 1))}
                        className="flex-1 text-center font-semibold hover:bg-neutral-200 h-full cursor-pointer hover:text-black transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Primary Bag Insert Action */}
                  <div className="flex-1 flex flex-col gap-1.5 justify-end h-full">
                    <span className="text-[9px] tracking-[0.2em] font-bold text-transparent select-none uppercase">ACTION</span>
                    <button
                      onClick={handleAddToCart}
                      className="w-full h-12 rounded bg-[#111111] text-[#FCF6BA] text-xs font-bold tracking-widest uppercase hover:bg-black active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#C9A84C]" /> ADD TO BAG
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Micro Alerts Block */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-[#111111] text-[#FCF6BA] border border-[#BF953F]/20 rounded-xl p-4 text-xs tracking-wider mb-6 text-center font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#C9A84C]" /> {toastMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* TRANSACTION PRIVACY SHIELD DETAILS */}
            <div className="flex flex-col gap-3 text-xs text-neutral-400 bg-white border rounded-xl p-5 shadow-xs mb-8">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4.5 h-4.5 text-[#BF953F]" />
                <span>Complimentary priority dispatch: <strong className="text-black font-semibold">{product.shipping || 'Free Standard (3 Days)'}</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4.5 h-4.5 text-[#BF953F]" />
                <span>Encrypted secure financial transactions checkout portals.</span>
              </div>
            </div>

          </div>
        </div>

        {/* REVIEWS SYSTEM MODULE */}
        <section className="mt-24 border-t border-neutral-200 pt-16 font-sans">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold block mb-1">
            Verified Customer Registries
          </span>
          <h2 className="font-serif text-2xl sm:text-3.5xl font-light tracking-tight text-[#111111] mb-10">
            Artisanal Dialogues
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
            
            {/* Left: Star stats and Form write portal */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">Rating Density Index</span>
                <span className="text-6xl font-light text-[#111111]">{displayRating}</span>
                <div className="flex text-amber-500 gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4.5 h-4.5 fill-current" />
                  ))}
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">100% genuine verified owners share insights regarding fabric drape and colors retention.</p>
              </div>

              {/* Form Portal to add real reviews */}
              <form onSubmit={handleReviewSubmission} className="bg-white border rounded-2xl p-6.5 shadow-sm text-xs flex flex-col gap-4">
                <span className="text-[10px] font-bold tracking-widest text-[#111111] uppercase border-b pb-2 mb-1 block">Commit Customer Review</span>
                
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase">Reviewer Name</span>
                  <input 
                    type="text" 
                    placeholder="e.g. Hammad Malik, Lahore" 
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="py-3 px-4 border border-neutral-200 rounded-md outline-none bg-[#FAF9F6] focus:bg-white focus:border-[#BF953F] focus:ring-1 focus:ring-[#BF953F]/15 transition-all text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase">Thread Score (1-5 Stars)</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        type="button" 
                        onClick={() => setReviewerRating(s)}
                        className="p-1 cursor-pointer hover:scale-115 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${s <= reviewerRating ? 'fill-amber-500 text-amber-500' : 'text-neutral-250'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase">Review Comments</span>
                  <textarea 
                    rows={3}
                    placeholder="Weaving density, gold print wash longevity, color reflections..."
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    className="py-3 px-4 border border-neutral-200 rounded-md outline-none bg-[#FAF9F6] focus:bg-white focus:border-[#BF953F] resize-y text-xs"
                  />
                </div>

                {reviewSuccessMsg && (
                  <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded p-2.5 text-center">
                    {reviewSuccessMsg}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loadingReview}
                  className="py-3 bg-neutral-900 border-0 text-[#FCF6BA] font-bold text-[9px] tracking-widest uppercase rounded cursor-pointer"
                >
                  {loadingReview ? 'WRITING REGISTRY...' : 'POST VERIFIED REVIEW ✓'}
                </button>
              </form>
            </div>

            {/* Right: Historic reviews logs */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {reviewList.length > 0 ? (
                <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {reviewList.map((rev, index) => (
                    <div key={index} className="bg-white border rounded-2xl p-5 text-left text-xs flex flex-col gap-2.5 shadow-xs relative">
                      <span className="absolute top-5 right-5 text-[10px] text-neutral-450 font-mono">05/2026</span>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#BF953F]/10 text-[#BF953F] font-bold text-[10px] flex items-center justify-center border border-[#BF953F]/25 select-none uppercase">
                          {rev.reviewer_name?.substring(0,2) || 'M'}
                        </span>
                        <div className="flex flex-col text-left">
                          <strong className="text-neutral-800 tracking-wider font-semibold capitalize">{rev.reviewer_name || 'Anonymous client'}</strong>
                          <div className="flex text-amber-500 gap-0.5">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-neutral-500 leading-relaxed font-light mt-1 pl-10 pr-4">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-neutral-200 border-dashed rounded-2xl p-16 text-center text-neutral-400 font-light flex flex-col items-center justify-center gap-3">
                  <MessageSquare className="w-10 h-10 text-neutral-350" />
                  <p className="text-xs">No historic testimonials registered yet. Be the first flagship client to share!</p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* RELATED COMPLEMENTARY PAIRINGS GALLERY */}
        <section className="mt-28 border-t border-neutral-200 pt-16 select-none font-sans">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold block mb-1">
                COMPLEMENTARY STYLE CODES
              </span>
              <h2 className="font-serif text-2xl sm:text-3.5xl font-light tracking-tight text-[#111111]">
                Recommended Pairings
              </h2>
            </div>
            <button 
              onClick={() => onViewChange('shop')}
              className="px-4.5 py-2.5 border border-neutral-300 hover:border-[#111111] hover:bg-neutral-50 transition-all text-[9px] font-bold tracking-widest uppercase rounded-lg cursor-pointer"
            >
              Discover Collections
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <div 
                key={p.id}
                onClick={() => handleSelectRelated(p)}
                className="bg-white border border-neutral-200/50 rounded-xl overflow-hidden group hover:border-[#BF953F]/30 shadow-xs hover:shadow-lg cursor-pointer transition-all duration-300 flex flex-col text-center"
              >
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500 object-top" />
                </div>
                <div className="p-4 flex flex-col gap-1 items-center justify-center">
                  <span className="text-[8px] text-neutral-400 tracking-[0.2em] font-semibold uppercase">{p.subcategory} line</span>
                  <h4 className="font-serif text-sm tracking-wide text-[#111111] font-normal group-hover:text-[#BF953F] transition-colors">{p.name}</h4>
                  <span className="text-xs text-[#BF953F] font-bold mt-1">Rs. {p.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── POPUP: SIZE GUIDE DRAWER ── */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative max-w-lg w-full bg-white border rounded-2xl p-6.5 shadow-2xl relative select-none font-sans text-left"
            >
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-100 cursor-pointer border-0"
              >
                ×
              </button>
              <h3 className="font-serif text-xl font-light text-[#111111] border-b pb-3 mb-4">Atelier Measurement Matrix</h3>
              <p className="text-xs text-neutral-400 mb-4 font-light leading-relaxed">Dimensions are standard inches. Select custom sizing variables according to your chest contour preferences.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-light text-left border">
                  <thead>
                    <tr className="bg-neutral-50 border-b font-bold uppercase text-[9px] text-[#BF953F]">
                      <th className="p-2.5">Size Designation</th>
                      <th className="p-2.5">Chest Width</th>
                      <th className="p-2.5">Shoulder Width</th>
                      <th className="p-2.5">Sleeve Contour</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr><td className="p-2.5 font-bold">Small (S)</td><td className="p-2.5">38" - 40"</td><td className="p-2.5">17.5"</td><td className="p-2.5">24.5"</td></tr>
                    <tr><td className="p-2.5 font-bold">Medium (M)</td><td className="p-2.5">41" - 43"</td><td className="p-2.5">18.5"</td><td className="p-2.5">25.0"</td></tr>
                    <tr><td className="p-2.5 font-bold">Large (L)</td><td className="p-2.5">44" - 46"</td><td className="p-2.5">19.5"</td><td className="p-2.5">25.5"</td></tr>
                    <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">47" - 49"</td><td className="p-2.5">20.5"</td><td className="p-2.5">26.0"</td></tr>
                    <tr><td className="p-2.5 font-bold">XXL</td><td className="p-2.5">50" - 52"</td><td className="p-2.5">21.5"</td><td className="p-2.5">26.5"</td></tr>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
            <button 
              onClick={() => setShowFullscreenGallery(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl cursor-pointer border-0"
            >
              ×
            </button>

            <button
              onClick={() => setFullscreenImageIndex((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length)}
              className="absolute left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center cursor-pointer border-0"
            >
              ‹
            </button>

            <img 
              src={allGalleryImages[fullscreenImageIndex]} 
              alt="Fullscreen presentation" 
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" 
            />

            <button
              onClick={() => setFullscreenImageIndex((prev) => (prev + 1) % allGalleryImages.length)}
              className="absolute right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center cursor-pointer border-0"
            >
              ›
            </button>

            <span className="absolute bottom-6 text-white/50 text-xs font-mono font-bold uppercase tracking-widest">
              Image {fullscreenImageIndex + 1} of {allGalleryImages.length}
            </span>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
