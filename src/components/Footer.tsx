import React from 'react';
import { ViewType } from '../types';
import { Lock, MapPin, ArrowUpRight, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  onViewChange: (view: ViewType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onViewChange }) => {
  return (
    <footer className="bg-[#000000] py-16 px-4 sm:px-6 lg:px-8 selection:bg-[#FFD700]/20 selection:text-[#FFD700]">
      
      {/* Main Container - Deep Luxury Black Panel */}
      <div className="max-w-[1400px] mx-auto bg-[#030303] rounded-3xl border border-[#FFD700]/10 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.05)]">
        
        {/* Intense Neon Golden Glowing Orbs in Background */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FFD700]/10 blur-[130px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#FFC107]/10 blur-[130px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

        {/* Solid Grid System to lock spaces */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Column 1: Centered Logo & Identity */}
          <div className="lg:col-span-5 flex flex-col items-center text-center gap-6 lg:pr-8">
            <button 
              onClick={() => onViewChange('home')}
              className="w-max cursor-pointer block group"
            >
              <img 
                src="/logo.png" 
                alt="Markhor Collections" 
                className="h-32 sm:h-40 object-contain filter drop-shadow-[0_0_15px_rgba(255,215,0,0.2)] group-hover:drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] group-hover:scale-[1.01] transition-all duration-500" 
              />
            </button>
            
            <p className="font-serif text-sm text-white/50 max-w-sm italic tracking-wide leading-relaxed">
              "Redefining everyday luxury. Uncompromising quality for the modern journey."
            </p>

            {/* Location & Socials */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-center gap-5">
              {/* Gilgit Location Pill with Neon Touch */}
              <div className="flex items-center gap-3 bg-[#080808] border border-[#FFD700]/20 px-5 py-3 rounded-full w-max shadow-[0_0_15px_rgba(255,215,0,0.05)]">
                <MapPin className="w-4 h-4 text-[#FFD700] drop-shadow-[0_0_5px_rgba(255,215,0,0.6)]" />
                <span className="font-sans text-[10px] font-bold tracking-[0.2em] text-[#FFD700] uppercase">
                  Gilgit-Baltistan
                </span>
              </div>

              {/* Glowing Social Icons */}
              <div className="flex items-center justify-center gap-3">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-[#080808] border border-[#FFD700]/10 flex items-center justify-center text-white/40 hover:text-[#FFD700] hover:border-[#FFD700]/40 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all duration-300"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-[#080808] border border-[#FFD700]/10 flex items-center justify-center text-white/40 hover:text-[#FFD700] hover:border-[#FFD700]/40 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all duration-300"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            
            {/* Directory */}
            <div className="flex flex-col gap-6">
              <h4 className="font-sans text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-2">
                Directory
              </h4>
              <nav className="flex flex-col gap-4 text-[13px] font-sans font-medium tracking-widest uppercase">
                <button onClick={() => onViewChange('home')} className="group flex items-center gap-2 w-max text-white/60 hover:text-[#FFD700] hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-300">
                  Home <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </button>
                <button onClick={() => onViewChange('shop')} className="group flex items-center gap-2 w-max text-white/60 hover:text-[#FFD700] hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-300">
                  Collections <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </button>
                <button onClick={() => onViewChange('about')} className="group flex items-center gap-2 w-max text-white/60 hover:text-[#FFD700] hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-300">
                  Our Story <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </button>
              </nav>
            </div>

            {/* Assistance */}
            <div className="flex flex-col gap-6">
              <h4 className="font-sans text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-2">
                Assistance
              </h4>
              <nav className="flex flex-col gap-4 text-[13px] font-sans font-medium tracking-widest uppercase">
                <button onClick={() => onViewChange('contact')} className="group flex items-center gap-2 w-max text-white/60 hover:text-[#FFD700] hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-300">
                  Support <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </button>
                <button onClick={() => onViewChange('checkout')} className="group flex items-center gap-2 w-max text-white/60 hover:text-[#FFD700] hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-300">
                  Cart <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </button>
                <a href="#" className="group flex items-center gap-2 w-max text-white/60 hover:text-[#FFD700] hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-300">Returns <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" /></a>
                <a href="#" className="group flex items-center gap-2 w-max text-white/60 hover:text-[#FFD700] hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-300">Delivery <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" /></a>
                <a href="#" className="group flex items-center gap-2 w-max text-white/60 hover:text-[#FFD700] hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-300">Size Guide <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" /></a>
              </nav>
            </div>

          </div>

          {/* Column 3: Unique Cyber-Style Owner Desk */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:pl-4">
            <h4 className="font-sans text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-2">
              System Core
            </h4>
            
            {/* The Unique Glowing Glass Card */}
            <div className="relative group overflow-hidden rounded-2xl bg-[#060606] border border-[#FFD700]/10 p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-500 hover:border-[#FFD700]/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]">
              
              {/* Top Decorative Bars */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                  <span className="text-[9px] font-mono tracking-widest text-[#FFD700]/60 uppercase">SYS_LIVE</span>
                </div>
                <Lock className="w-3.5 h-3.5 text-white/20 group-hover:text-[#FFD700] transition-colors duration-500" />
              </div>

              <p className="text-white/40 text-[11px] font-sans tracking-wide leading-relaxed mb-6">
                Terminal gateway restricted to authorized executive administration.
              </p>

              {/* Interactive Futuristic Button */}
              <button 
                onClick={() => onViewChange('admin')} 
                className="w-full relative overflow-hidden h-12 rounded-xl border border-[#FFD700]/30 bg-transparent text-[#FFD700] hover:text-black font-bold text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 group/btn cursor-pointer transition-colors duration-300 z-10"
              >
                {/* Fill effect on hover */}
                <div className="absolute inset-0 w-0 bg-[#FFD700] group-hover/btn:w-full transition-all duration-300 ease-out z-[-1]" />
                <Lock className="w-3.5 h-3.5" /> 
                <span>Owner Terminal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Bottom Credentials */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          
          <h2 className="font-serif text-2xl sm:text-3xl text-white/10 tracking-[0.2em] uppercase select-none group-hover:text-white/20 transition-colors duration-500">
            Markhor
          </h2>
          
          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <p className="font-sans text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
              © {new Date().getFullYear()} Markhor Collections.
            </p>
            <p className="font-sans text-[9px] tracking-[0.3em] text-white/20 uppercase flex items-center gap-1.5">
              Designed with <span className="text-[#FFD700] drop-shadow-[0_0_5px_rgba(255,215,0,0.8)] animate-pulse">✦</span> in Pakistan
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
};