import React, { useState } from 'react';
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

  // Search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 1) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
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
      {/* Top Banner */}
      <div className="bg-[#111111] text-[10px] sm:text-xs text-[#FCF6BA] text-center tracking-[0.16em] font-medium py-2.5 uppercase border-b border-[#C9A84C]/20 z-50 relative">
        <span>SUITE FOR THE MODERN JOURNEY</span>
        <span className="mx-3 text-[#C9A84C]">|</span>
        <span>FREE EXPRESS SHIPPING NATIONWIDE</span>
      </div>

      {/* Main Sticky Glass Navigation Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-[#111111]/5 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Typographic Gold Logo */}
          <button 
            onClick={() => onViewChange('home')}
            className="flex items-center gap-3 cursor-pointer group text-left"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#BF953F] via-[#C9A84C] to-[#FCF6BA] flex items-center justify-center font-bold text-[#111111] border border-black/5 shadow-[0_4px_12px_rgba(201,168,76,0.3)] group-hover:rotate-15 group-hover:scale-105 transition-transform duration-300">
              <span className="font-serif text-lg leading-none">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-black tracking-widest text-[#111111] leading-tight">MARKHOR</span>
              <span className="text-[9px] text-[#BF953F] font-semibold tracking-[0.22em] leading-none">COLLECTIONS</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {(['home', 'shop', 'about', 'contact', 'admin'] as const).map((tab) => {
              const isActive = currentView === tab || (tab === 'shop' && currentView === 'product');
              return (
                <button
                  key={tab}
                  onClick={() => onViewChange(tab)}
                  className={`text-xs font-semibold tracking-[0.15em] hover:bg-neutral-50 px-3 py-2 rounded transition-all duration-300 relative uppercase cursor-pointer flex items-center gap-1.5 ${
                    isActive ? 'text-[#BF953F] font-bold' : 'text-[#111111]/60'
                  }`}
                >
                  {tab === 'admin' ? (
                    <>
                      <Lock className="w-3 h-3 text-[#BF953F]" />
                      <span>Owner Desk</span>
                    </>
                  ) : (
                    <span>{tab}</span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C9A84C] shadow-[0_2px_6px_rgba(201,168,76,0.4)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search Bar Input component */}
          <div className="hidden sm:block relative flex-1 max-w-xs xl:max-w-sm">
            <div className="relative">
              <input
                type="text"
                placeholder="Search premium collections..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full text-xs text-[#111111] bg-white border border-[#111111]/10 rounded-full py-2.5 pl-10 pr-4 outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/35 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40 pointer-events-none" />
            </div>

            {/* Live Dropdown Matching */}
            {isSearchFocused && (searchQuery.trim().length > 1 || searchResults.length > 0) && (
              <div 
                className="absolute top-full left-0 right-0 mt-2.5 bg-white border border-black/5 rounded-xl overflow-hidden shadow-2xl z-50 max-h-80 overflow-y-auto"
                onMouseLeave={() => setIsSearchFocused(false)}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectResult(p)}
                      className="w-full flex items-center gap-3.5 px-4 py-3 border-b border-black/5 hover:bg-neutral-50 text-left text-[#111111] transition-all cursor-pointer"
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-md border border-neutral-100" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold tracking-wide truncate">{p.name}</div>
                        <div className="text-[11px] text-[#BF953F] font-sans font-medium mt-0.5">Rs. {p.price.toLocaleString()}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[#111111]/40 italic">
                    No results match "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Hub - Cart & Trigger Contact Us */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Shopping Cart Icon Trigger */}
            <button
              onClick={() => onViewChange('checkout')}
              className="relative w-11 h-11 rounded-full text-[#111111]/90 hover:text-[#C9A84C] hover:bg-neutral-100 flex items-center justify-center transition-all duration-300 z-10 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className={`absolute top-1.5 right-1.5 bg-[#111111] text-[#FCF6BA] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-300 shadow-[0_2px_6px_rgba(0,0,0,0.25)] ${
                cartCount > 0 ? 'scale-100' : 'scale-0'
              }`}>
                {cartCount}
              </span>
            </button>

            {/* Direct Contact triggers link */}
            <button
              onClick={() => onViewChange('contact')}
              className="bg-[#111111] text-[#FCF6BA] text-[10px] sm:text-xs font-bold tracking-widest py-3 px-5 sm:px-6 rounded-md hover:bg-black active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span className="hidden sm:inline">CONTACT US</span>
            </button>

            {/* Mobile Drawer menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-11 h-11 text-[#111111] hover:bg-neutral-100 flex items-center justify-center rounded-full z-10 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[112px] bg-white/95 backdrop-blur-xl z-30 flex flex-col items-center border-b border-black/5 animate-fade-in">
          <nav className="w-full flex flex-col p-6 gap-2">
            {(['home', 'shop', 'about', 'contact', 'checkout', 'admin'] as const).map((tab) => {
              const isActive = currentView === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    onViewChange(tab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left text-xs font-bold tracking-[0.2em] uppercase py-4 px-4 border-b border-neutral-100 transition-all text-[#111111]/70 hover:text-[#111111] ${
                    isActive ? 'text-[#BF953F] font-black border-l-2 border-l-[#C9A84C]' : ''
                  }`}
                >
                  {tab === 'admin' ? 'Owner Desk' : tab}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};
