import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Product, ViewType } from '../types';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';

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
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsScrollingDown(true);
        setIsSearchFocused(false);
      } else if (currentScrollY < lastScrollY) {
        setIsScrollingDown(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isMobileMenuOpen) setIsScrollingDown(false);
  }, [isMobileMenuOpen]);

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
        .gold-scrollbar::-webkit-scrollbar { width: 4px; }
        .gold-scrollbar::-webkit-scrollbar-track { background: #000; }
        .gold-scrollbar::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 4px; }
        @keyframes slideFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-menu-item { animation: slideFadeIn 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards; opacity: 0; }
      `}</style>

      <div 
        className={`sticky top-0 z-50 w-full transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${
          isScrollingDown && !isMobileMenuOpen ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        {/* Promo Bar */}
        <div className={`bg-[#050505] text-[9px] sm:text-[10px] md:text-xs text-[#E5C06B] text-center tracking-[0.2em] sm:tracking-[0.25em] font-light uppercase z-50 flex justify-center items-center overflow-hidden transition-all duration-500 ease-in-out ${
          scrolled ? 'h-0 opacity-0 border-transparent' : 'h-[36px] opacity-100 border-b border-[#D4AF37]/15'
        }`}>
          <span className="hidden md:inline opacity-70">SUITE FOR THE MODERN JOURNEY</span>
          <span className="hidden md:inline text-[#D4AF37]/30">|</span>
          <span className="font-medium animate-pulse whitespace-nowrap">FREE EXPRESS SHIPPING NATIONWIDE</span>
        </div>

        {/* Main Header */}
        <header className={`w-full transition-colors duration-500 ease-in-out border-b ${
          scrolled 
            ? 'bg-[#050505]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.8)] border-[#D4AF37]/20' 
            : 'bg-[#050505] border-white/5'
        }`}>
          <div className={`max-w-[95%] xl:max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 ease-in-out ${
            scrolled ? 'h-[70px]' : 'h-[85px]'
          }`}>
            
            {/* Mobile: Left hamburger */}
            <div className="flex lg:hidden flex-1 justify-start">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/80 hover:text-[#FFF1CE] transition-colors p-2 -ml-2 cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
              </button>
            </div>

            {/* Desktop: Left nav */}
            <nav className="hidden lg:flex items-center gap-8 flex-1">
              {(['home', 'shop', 'about', 'contact'] as const).map((tab) => {
                const isActive = currentView === tab || (tab === 'shop' && currentView === 'product');
                return (
                  <button
                    key={tab}
                    onClick={() => onViewChange(tab)}
                    className="group relative h-full flex flex-col justify-center cursor-pointer"
                  >
                    <span className={`text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 ${
                      isActive ? 'text-[#FFF1CE] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]' : 'text-white/60 hover:text-[#FFF1CE]'
                    }`}>
                      {tab}
                    </span>
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent transition-all duration-300 ease-out ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`} />
                  </button>
                );
              })}
            </nav>

            {/* Center Logo */}
            <div className="flex-none lg:flex-1 flex justify-center items-center relative h-12 sm:h-14">
              <button 
                onClick={() => { onViewChange('home'); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-center cursor-pointer group select-none relative h-full w-32 sm:w-40 z-10"
              >
                <img 
                  src="/logo.png" 
                  alt="Markhor Collections Logo" 
                  className="w-full h-full object-contain scale-[1.8] sm:scale-[2.0] transition-transform duration-700 group-hover:scale-[1.9] sm:group-hover:scale-[2.1] group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.35)] origin-center" 
                />
              </button>
            </div>

            {/* Right: actions */}
            <div className="flex-1 flex items-center justify-end gap-3 sm:gap-6">
              
              {/* Desktop Search */}
              <div className="hidden sm:flex relative group items-center">
                <Search className="w-4 h-4 text-white/50 group-hover:text-[#D4AF37] transition-colors absolute left-0" />
                <input
                  type="text"
                  placeholder="DISCOVER..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-24 text-[10px] uppercase tracking-[0.2em] font-medium text-white bg-transparent border-b border-transparent pb-1 pl-6 outline-none focus:border-[#D4AF37] transition-all duration-500 placeholder-white/30 focus:w-44"
                />
                {isSearchFocused && (searchQuery.trim().length > 1 || searchResults.length > 0) && (
                  <div 
                    className="absolute top-[40px] right-0 w-80 bg-[#0A0A0A]/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-50 max-h-[350px] overflow-y-auto gold-scrollbar"
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
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
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
              
              {/* Cart */}
              <button
                onClick={() => { onViewChange('checkout'); setIsMobileMenuOpen(false); }}
                className="relative text-white/80 hover:text-[#FFF1CE] transition-all duration-300 p-2 cursor-pointer group flex items-center justify-center"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-[21px] h-[21px] sm:w-6 sm:h-6 stroke-[1.3]" />
                <span className={`absolute top-1 right-0 bg-gradient-to-tr from-[#B38728] via-[#D4AF37] to-[#FFF1CE] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(212,175,55,0.6)] transform transition-all duration-300 ${
                  cartCount > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}>
                  {cartCount}
                </span>
              </button>

            </div>
          </div>
        </header>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 bg-[#050505]/98 backdrop-blur-2xl z-40 flex flex-col border-t border-[#D4AF37]/15 overflow-y-auto pt-6"
             style={{ top: scrolled ? '70px' : '85px' }}
        >
          {/* Mobile Search */}
          <div className="px-6 pb-4 w-full animate-menu-item" style={{ animationDelay: '50ms' }}>
            <div className="relative w-full border-b border-white/10 focus-within:border-[#D4AF37] transition-colors pb-1">
              <Search className="w-4 h-4 text-white/40 absolute left-1 bottom-2" />
              <input
                type="text"
                placeholder="Search Markhor Collections..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full text-xs uppercase tracking-[0.15em] font-medium text-white bg-transparent pb-1 pl-7 outline-none placeholder-white/20"
              />
            </div>
          </div>

          {/* Nav links — home, shop, about, contact only */}
          <nav className="w-full flex flex-col px-6 pb-8 flex-1">
            {(['home', 'shop', 'about', 'contact'] as const).map((tab, index) => {
              const isActive = currentView === tab || (tab === 'shop' && currentView === 'product');
              return (
                <button
                  key={tab}
                  onClick={() => {
                    onViewChange(tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className="group relative w-full text-left py-6 border-b border-white/5 transition-all cursor-pointer flex justify-between items-center animate-menu-item"
                  style={{ animationDelay: `${(index + 2) * 40}ms` }}
                >
                  <span className={`text-[11px] font-medium tracking-[0.25em] uppercase transition-all duration-300 ${
                    isActive ? 'text-[#FFF1CE] pl-1 font-semibold' : 'text-white/50'
                  }`}>
                    {tab}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
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