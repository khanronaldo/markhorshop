import React from 'react';
import { ViewType } from '../types';

interface FooterProps {
  onViewChange: (view: ViewType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onViewChange }) => {
  return (
    <footer className="bg-white text-neutral-600 border-t border-[#111111]/5 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-[#111111]/5">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <button 
            onClick={() => onViewChange('home')}
            className="flex items-center gap-3 cursor-pointer group text-left align-middle"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#BF953F] via-[#C9A84C] to-[#FCF6BA] flex items-center justify-center font-bold text-[#111111] border border-black/5 shadow-[0_4px_12px_rgba(201,168,76,0.2)] group-hover:rotate-12 transition-transform duration-300">
              <span className="font-serif text-base leading-none">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base font-black tracking-widest text-[#111111] leading-tight">MARKHOR</span>
              <span className="text-[8px] text-[#BF953F] font-semibold tracking-[0.22em] leading-none">COLLECTIONS</span>
            </div>
          </button>
          
          <p className="text-xs sm:text-xs leading-relaxed text-neutral-500 max-w-xs font-light">
            Markhor Collections creates clothing that blends raw contemporary style with uncompromising luxury quality. Suite for the Modern Journey.
          </p>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-sans text-[10px] font-bold tracking-[0.25em] text-[#111111] uppercase mb-6">
            CUSTOMER CARE
          </h4>
          <ul className="flex flex-col gap-3.5 text-xs">
            <li><a href="#" className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300">Help Center</a></li>
            <li><a href="#" className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300">Delivery Information</a></li>
            <li><a href="#" className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300">Shipping Terms</a></li>
            <li><button onClick={() => onViewChange('contact')} className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300 cursor-pointer text-left">Contact Support</button></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-sans text-[10px] font-bold tracking-[0.25em] text-[#111111] uppercase mb-6">
            QUICK LINKS
          </h4>
          <ul className="flex flex-col gap-3.5 text-xs">
            <li><button onClick={() => onViewChange('home')} className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300 cursor-pointer text-left">Home</button></li>
            <li><button onClick={() => onViewChange('shop')} className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300 cursor-pointer text-left">Shop Collections</button></li>
            <li><button onClick={() => onViewChange('about')} className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300 cursor-pointer text-left">Our Story</button></li>
            <li><button onClick={() => onViewChange('contact')} className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300 cursor-pointer text-left">Contact Us</button></li>
            <li><button onClick={() => onViewChange('admin')} className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300 cursor-pointer text-left text-[#BF953F] font-semibold flex items-center gap-1">🔒 Secure Owner Desk</button></li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="font-sans text-[10px] font-bold tracking-[0.25em] text-[#111111] uppercase mb-6">
            INFORMATION
          </h4>
          <ul className="flex flex-col gap-3.5 text-xs">
            <li><a href="#" className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300">Terms &amp; Conditions</a></li>
            <li><a href="#" className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300">Detailed Size Guide</a></li>
            <li><button onClick={() => onViewChange('checkout')} className="hover:text-[#BF953F] hover:pl-1.5 transition-all duration-300 cursor-pointer text-left">Your Shopping Cart</button></li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom Credentials */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-neutral-400 text-center">
        <span>© {new Date().getFullYear()} MARKHOR COLLECTIONS. ALL RIGHTS RESERVED.</span>
        <span className="flex items-center gap-1">
          DESIGNED WITH UNCOMPROMISING CARE FOR <span className="text-[#BF953F] font-semibold">THE MODERN JOURNEY</span> · EST. 2026
        </span>
      </div>
    </footer>
  );
};
