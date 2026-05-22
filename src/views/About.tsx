import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LEADERS } from '../data/products';
import { Leader, ViewType } from '../types';
import { Award, Target, Landmark, Quote, ArrowRight, CornerDownRight } from 'lucide-react';

interface AboutProps {
  onViewChange: (view: ViewType) => void;
}

export const About: React.FC<AboutProps> = ({ onViewChange }) => {
  const [activeLeaderIdx, setActiveLeaderIdx] = useState(1); // Default to CEO Asad Khan

  const handleLeaderSelect = (idx: number) => {
    setActiveLeaderIdx(idx);
  };

  const selectedLeader = LEADERS[activeLeaderIdx];

  return (
    <div className="bg-[#FAF9F6] text-[#111111] min-h-screen">
      
      {/* 1. HERO SHACK WITH RADIAL OVERLAY */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden border-b border-neutral-200 bg-white">
        <div 
          className="absolute inset-x-0 -bottom-20 -top-20 bg-cover bg-center opacity-[0.03] pointer-events-none"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600')`,
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF9F6]/30 to-[#FAF9F6]" />
        
        {/* Typographical elements overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-fade-in">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] tracking-[0.35em] text-[#BF953F] font-bold uppercase mb-3 block"
          >
            THE HERITAGE PRELUDE
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-[#111111] mb-2"
          >
            Markhor Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif italic text-neutral-400 text-sm sm:text-base max-w-md mx-auto"
          >
            Suite for the Modern Journey — where style meets substance.
          </motion.p>
        </div>
      </section>

      {/* 2. THE CHRONICLE BLOCK */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#111111]/5 group shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800"
              alt="Handcrafted tailoring looms"
              className="w-full h-full object-cover transform scale-103 group-hover:scale-108 transition-transform duration-700 object-top"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold">
              THE CHRONICLE STORY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#111111]">
              Honoring Tailoring Grids Since Our Inception
            </h2>
            <div className="w-14 h-[1.5px] bg-[#C9A84C]" />

            <p className="text-sm text-neutral-500 leading-relaxed font-light">
              Founded on the pillars of bespoke craftsmanship and geometric rigor, Markhor Collections emerged out of a desire to create clothing that matches the ambition of the developer, the artist, and the modern voyager.
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed font-light">
              We sourcing only premium luxury yards - from biological linen to high-density dense combed terry. Every thread, button, and cuff silhouette is scrutinized to make sure you command standard respect when entering any room.
            </p>

            {/* Custom grids icons list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[#BF953F] border border-neutral-200 shadow-sm">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-[#111111] uppercase mb-1">Tailored Atelier</h4>
                  <p className="text-[11px] text-neutral-400">Hand-embroidered sealing and gold threadings.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 text-[#BF953F] border border-neutral-200 shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold tracking-widest text-[#111111] uppercase mb-1">Uncompromising Standards</h4>
                  <p className="text-[11px] text-neutral-400">Rigid quality checks across batch cycles.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE 3RD TEAM COVERFLOW WITH TRANSITIONAL PANEL */}
      <section className="py-24 bg-white border-t border-b border-[#111111]/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 font-sans">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold mb-2 block">
              OUR LEADERSHIP
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#111111] mb-2">
              The Team Behind the Brand
            </h2>
            <p className="text-xs sm:text-sm italic text-neutral-400 font-serif">
              Visionaries who built Markhor Collections from passion
            </p>
          </div>

          {/* COVERFLOW VIEWER */}
          <div className="flex flex-col items-center">
            
            <div className="relative w-full overflow-hidden py-12 flex justify-center h-[340px] sm:h-[400px]">
              <div className="relative flex items-center justify-center max-w-full w-[800px] h-full">
                
                {LEADERS.map((leader, idx) => {
                  const dist = idx - activeLeaderIdx;
                  const absDist = Math.abs(dist);
                  const isCenter = idx === activeLeaderIdx;

                  // Rotate styling indexes
                  let transformX = dist * 160; 
                  if (dist > 0) transformX += 30;
                  if (dist < 0) transformX -= 30;

                  // Limit showcase range
                  if (absDist > 2) return null;

                  return (
                    <motion.div
                      key={leader.name}
                      onClick={() => handleLeaderSelect(idx)}
                      animate={{
                        x: transformX,
                        scale: isCenter ? 1.05 : 0.8,
                        zIndex: 10 - absDist,
                        opacity: isCenter ? 1 : 0.45
                      }}
                      transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                      className={`absolute w-44 sm:w-56 aspect-[3/4] rounded-xl overflow-hidden shadow-xl border transition-all cursor-pointer ${
                        isCenter 
                          ? 'border-[#BF953F] shadow-[0_12px_30px_rgba(191,149,63,0.15)] ring-2 ring-[#BF953F]/10' 
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <img 
                        src={leader.image} 
                        alt={leader.name} 
                        className="w-full h-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-300"
                      />
                      
                      {/* Name tags on the overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/75 to-transparent p-4 flex flex-col pt-10">
                        <span className="text-[10px] text-[#FCF6BA] font-bold tracking-widest uppercase mb-0.5">{leader.role}</span>
                        <span className="font-serif text-sm tracking-wide text-white leading-tight">{leader.name}</span>
                      </div>
                    </motion.div>
                  );
                })}

              </div>
            </div>

            {/* Interactive leader bio details panel below */}
            <div className="w-full max-w-2xl mt-12 bg-[#FAF9F6] border border-neutral-200/60 rounded-xl p-8 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLeaderIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-[10px] tracking-[0.25em] text-[#BF953F] font-bold uppercase mb-1.5 block">
                    {selectedLeader.role} PROFILE
                  </span>
                  <h3 className="font-serif text-2xl font-light text-[#111111] mb-4">
                    {selectedLeader.name}
                  </h3>
                  <div className="w-full h-[1px] bg-neutral-200 mb-6" />
                  
                  <div className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light flex gap-3">
                    <CornerDownRight className="w-4 h-4 text-[#BF953F] flex-shrink-0 mt-1" />
                    {/* Render rich HTML using standard template tags */}
                    <p className="flex-1" dangerouslySetInnerHTML={{ __html: selectedLeader.bio }} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-2 mt-8">
              {LEADERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLeaderSelect(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeLeaderIdx === idx ? 'w-6 bg-[#BF953F]' : 'w-1.5 bg-neutral-200'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 4. SHIVER METALLIC ASAD KHAN SIGNATURE QUOTE SECTION */}
      <section className="relative py-28 flex items-center justify-center overflow-hidden bg-white border-b border-neutral-100">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.01] pointer-events-none"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600')`,
            backgroundAttachment: 'fixed'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Quote className="w-10 h-10 text-[#BF953F]/15 mx-auto mb-6" />
          
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl italic text-neutral-800 leading-relaxed max-w-3xl mx-auto mb-8 font-light">
            "Every collection reflects the belief that clothing should empower confidence and self-expression."
          </h2>

          <cite className="block uppercase tracking-[0.3em] font-sans text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] to-[#AA771C] drop-shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            — Asad Khan, CEO, Markhor Collections
          </cite>
        </div>
      </section>

    </div>
  );
};
