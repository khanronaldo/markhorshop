import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Product, ViewType } from '../types';
import { ShoppingBag, Search, Mail, Menu, X, Lock } from 'lucide-react';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onSelectProduct: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onSelectProduct }) => {
  const { cartCount } = useCart();
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dynamic glassmorphism on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 1) {
      setSearchResults(products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.subcategory.toLowerCase().includes(query.toLowerCase())));
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectResult = (product: Product) => {
    onSelectProduct(product);
    onViewChange('product');
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  return (
    <>
      {/* CSS for Infinite Shimmer & Glows */}
      <style>{`
        @keyframes luxuryShimmer {
          0% { transform: translateX(-200%) skewX(-20deg); opacity: 0; }
          20% { opacity: 1; }
          40% { transform: translateX(200%) skewX(-20deg); opacity: 0; }
          100% { transform: translateX(200%) skewX(-20deg); opacity: 0; }
        }
        .shimmer-btn { position: relative; overflow: hidden; }
        .shimmer-btn::after {
          content: ''; position: absolute; top: 0; left: 0; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 241, 206, 0.6), transparent);
          transform: translateX(-200%) skewX(-20deg);
          animation: luxuryShimmer 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* Custom scrollbar for search dropdown */
        .gold-scrollbar::-webkit-scrollbar { width: 4px; }
        .gold-scrollbar::-webkit-scrollbar-track { background: #000; }
        .gold-scrollbar::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 4px; }
      `}</style>

      {/* Top Floating Promo Bar */}
      <div className="bg-[#050505] text-[10px] sm:text-xs text-[#E5C06B] text-center tracking-[0.25em] font-light py-2 uppercase border-b border-[#D4AF37]/15 z-50 relative flex justify-center items-center gap-4">
        <span className="hidden sm:inline opacity-70">SUITE FOR THE MODERN JOURNEY</span>
        <span className="hidden sm:inline text-[#D4AF37]/30">|</span>
        <span className="font-medium animate-pulse">FREE EXPRESS SHIPPING NATIONWIDE</span>
      </div>

      {/* Main Editorial Header */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-700 ease-in-out ${
        scrolled ? 'bg-[#020202]/90 backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.9)] py-3 border-b border-[#D4AF37]/20' : 'bg-[#020202] py-5 border-b border-white/5'
      }`}>
        <div className="max-w-[95%] xl:max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LEFT: Navigation Links (Bigger, Bolder, Cleaner) */}
          <nav className="hidden lg:flex items-center gap-8 flex-1">
            {(['home', 'shop', 'about', 'contact'] as const).map((tab) => {
              const isActive = currentView === tab || (tab === 'shop' && currentView === 'product');
              return (
                <button
                  key={tab}
                  onClick={() => onViewChange(tab)}
                  className="group relative py-2 cursor-pointer flex flex-col items-center"
                >
                  <span className={`text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-500 ${
                    isActive ? 'text-[#FFF1CE] drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'text-white/60 hover:text-[#FFF1CE]'
                  }`}>
                    {tab}
                  </span>
                  
                  {/* Creative Minimalist Underline Dot to Line effect */}
                  <span className={`absolute -bottom-1 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent transition-all duration-500 ease-out ${
                    isActive ? 'w-full opacity-100' : 'w-1 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`} />
                </button>
              );
            })}
          </nav>

          {/* CENTER: The Crown Jewel Logo */}
          <div className="flex-1 flex justify-start lg:justify-center relative">
            {/* Height is locked so the header won't expand, but the image inside uses scale to grow visually */}
            <button 
              onClick={() => onViewChange('home')}
              className="flex items-center justify-center cursor-pointer group select-none relative h-10 w-28 sm:h-12 sm:w-36 z-10"
            >
              <img 
                src="/logo.png" 
                alt="Markhor Collections Logo" 
                className="w-full h-full object-contain scale-[1.8] sm:scale-[2.4] transition-all duration-700 group-hover:scale-[1.9] sm:group-hover:scale-[2.5] group-hover:drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]" 
              />
            </button>
          </div>

          {/* RIGHT: Action & User Hub */}
          <div className="flex-1 flex items-center justify-end gap-5 sm:gap-7">
            
            {/* Minimal Search Line */}
            <div className="hidden sm:flex relative group items-center">
              <Search className="w-4 h-4 text-white/50 group-hover:text-[#D4AF37] transition-colors absolute left-0" />
              <input
                type="text"
                placeholder="DISCOVER..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                className="w-24 text-[10px] uppercase tracking-[0.2em] font-medium text-white bg-transparent border-b border-transparent pb-1 pl-6 outline-none focus:border-[#D4AF37] transition-all duration-700 placeholder-white/30 focus:w-48"
              />
              {/* Floating Live Search Dropdown */}
              {isSearchFocused && (searchQuery.trim().length > 1 || searchResults.length > 0) && (
                <div 
                  className="absolute top-full right-0 mt-8 w-80 bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-50 max-h-[350px] overflow-y-auto gold-scrollbar"
                  onMouseLeave={() => setIsSearchFocused(false)}
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectResult(p)}
                        className="w-full flex items-center gap-4 p-4 border-b border-white/5 hover:bg-[#151515] text-left transition-all cursor-pointer group/item"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 group-hover/item:border-[#D4AF37]/50 transition-colors">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs uppercase tracking-widest font-medium text-white/90 group-hover/item:text-[#FFF1CE] mb-1">{p.name}</div>
                          <div className="text-[11px] text-[#D4AF37] font-semibold tracking-wider">RS. {p.price.toLocaleString()}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center text-[10px] uppercase text-white/40 tracking-[0.2em]">
                      No collections found
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Creative Cart Icon (Badge overlaps icon beautifully) */}
            <button
              onClick={() => onViewChange('checkout')}
              className="relative text-white/70 hover:text-[#FFF1CE] transition-all duration-300 z-10 cursor-pointer group"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.2]" />
              <span className={`absolute -bottom-2 -right-2 bg-gradient-to-tr from-[#B38728] via-[#D4AF37] to-[#FFF1CE] text-black text-[10px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.7)] transform group-hover:scale-110 ${
                cartCount > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}>
                {cartCount}
              </span>
            </button>

            {/* VIP Owner Desk Button (Sleek Circle + Shimmer) */}
            <button
              onClick={() => onViewChange('admin')}
              className={`hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex-items-center justify-center transition-all duration-500 cursor-pointer group shimmer-btn ${
                currentView === 'admin' 
                  ? 'border-[#FFF1CE] bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.6)] scale-105' 
                  : 'border-[#D4AF37]/40 bg-transparent text-[#D4AF37] hover:border-[#FFF1CE] hover:bg-[#D4AF37]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]'
              }`}
              title="VIP Owner Desk"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 m-auto transition-transform duration-500 group-hover:scale-110" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white/70 hover:text-[#FFF1CE] transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.2]" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.2]" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer - Deep Luxury Dark */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] bg-[#020202]/98 backdrop-blur-3xl z-30 flex flex-col items-center border-t border-[#D4AF37]/20 animate-fade-in">
          <nav className="w-full flex flex-col px-8 py-6 gap-2">
            {(['home', 'shop', 'about', 'contact', 'admin'] as const).map((tab) => {
              const isActive = currentView === tab || (tab === 'shop' && currentView === 'product');
              return (
                <button
                  key={tab}
                  onClick={() => {
                    onViewChange(tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className="group relative w-full text-left py-5 border-b border-white/5 transition-all cursor-pointer flex justify-between items-center"
                >
                  <span className={`text-sm font-semibold tracking-[0.3em] uppercase transition-all duration-500 ${
                    isActive ? 'text-[#FFF1CE]' : 'text-white/40 group-hover:text-[#D4AF37]'
                  }`}>
                    {tab === 'admin' ? 'OWNER DESK' : tab}
                  </span>
                  
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFF1CE] shadow-[0_0_10px_rgba(212,175,55,0.8)] animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};