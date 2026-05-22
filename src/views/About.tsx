import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LEADERS } from '../data/products';
import { ViewType } from '../types';
import { CornerDownRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface AboutProps {
  onViewChange: (view: ViewType) => void;
}

export const About: React.FC<AboutProps> = ({ onViewChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalItems = LEADERS.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleLeaderSelect = (idx: number) => {
    setActiveIndex(idx);
  };

  // Continuous Autoplay Loop - Runs non-stop every 2 seconds without pausing on hover
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 2000); 

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [nextSlide]);

  const selectedLeader = LEADERS[activeIndex];

  return (
    <div className="w-full min-h-screen font-sans antialiased overflow-x-hidden selection:bg-[#BF953F]/30">
      
      {/* CSS for Premium Luxury Shimmer & Neon Gold Glow Beam */}
      <style>
        {`
          @keyframes textShine {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          .animate-shimmer-hero {
            background-image: linear-gradient(90deg, #BF953F 30%, #FFFFFF 50%, #BF953F 70%);
            background-size: 200% auto;
            animation: textShine 4s linear infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          /* Super Stylish High-End Gold Shimmer with Dynamic Internal Illumination */
          .animate-stylish-gold-glow {
            background-image: linear-gradient(
              to right, 
              #9A7432 0%, 
              #CBA358 25%, 
              #FFF3CD 50%, 
              #CBA358 75%, 
              #9A7432 100%
            );
            background-size: 200% auto;
            animation: textShine 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
            filter: drop-shadow(0 0 12px rgba(203, 163, 88, 0.65)) drop-shadow(0 0 2px rgba(255, 243, 205, 0.4));
          }
        `}
      </style>

      {/* SECTION 1: HERO CONTAINER */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center bg-[#111111]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none filter contrast-125 brightness-75"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1600')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/30" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-4 drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)] animate-shimmer-hero inline-block"
          >
            Markhor Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-serif italic text-neutral-300 text-sm sm:text-lg max-w-md mx-auto drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
          >
            Suite for the Modern Journey — where style meets substance.
          </motion.p>
        </div>
      </section>

      {/* SECTION 2: THE TEAM (Non-stop Automatic Rotation) */}
      <section className="relative py-24 bg-[#FAF6EE] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="mb-12">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#B58A3D] font-bold mb-3 block">
              OUR LEADERSHIP
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1C1A17] mb-3">
              The Team Behind the Brand
            </h2>
            <p className="text-xs sm:text-sm italic text-neutral-500 font-serif">
              Visionaries who built Markhor Collections from passion
            </p>
          </div>

          <div className="flex flex-col items-center relative my-4">
            
            {/* Manual Controls */}
            <button onClick={prevSlide} className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-[#E3DDD3] flex items-center justify-center text-[#B58A3D] hover:bg-[#BF953F] hover:text-white transition-all duration-300 shadow-sm cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextSlide} className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white border border-[#E3DDD3] flex items-center justify-center text-[#B58A3D] hover:bg-[#BF953F] hover:text-white transition-all duration-300 shadow-sm cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="relative w-full overflow-hidden py-6 flex justify-center h-[380px] sm:h-[440px]">
              <div className="relative flex items-center justify-center max-w-full w-[950px] h-full">
                
                {LEADERS.map((leader, idx) => {
                  const dist = idx - activeIndex;
                  const absDist = Math.abs(dist);
                  const isCenter = idx === activeIndex;

                  let transformX = dist * 240; 
                  if (dist > 0) transformX += 50;
                  if (dist < 0) transformX -= 50;

                  if (absDist > 2) return null;

                  return (
                    <motion.div
                      key={leader.name}
                      onClick={() => handleLeaderSelect(idx)}
                      animate={{
                        x: transformX,
                        scale: isCenter ? 1.06 : 0.85,
                        zIndex: 10 - absDist,
                        opacity: isCenter ? 1 : 0.55
                      }}
                      transition={{ type: 'spring', damping: 18, stiffness: 180 }}
                      className={`absolute w-52 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border transition-all cursor-pointer ${
                        isCenter 
                          ? 'border-[#BF953F] shadow-[0_20px_45px_rgba(181,138,61,0.25)] ring-4 ring-[#BF953F]/10' 
                          : 'border-[#E3DDD3]'
                      }`}
                    >
                      <img 
                        src={leader.image} 
                        alt={leader.name} 
                        className="w-full h-full object-cover object-top filter contrast-[1.03] saturate-[1.08]"
                      />
                      
                      <div className="absolute inset-x-0 bottom-0 bg-white border-t border-neutral-100 p-4 text-left flex flex-col justify-end">
                        <span className="text-[9px] text-[#BF953F] font-bold tracking-widest uppercase mb-0.5">
                          {leader.role}
                        </span>
                        <span className="font-serif text-sm sm:text-base font-bold text-neutral-900 tracking-wide leading-tight">
                          {leader.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}

              </div>
            </div>

            {/* FLOATING WHITE BIO CARD (Highly Visible Text Layer) */}
            <div className="w-full max-w-2xl mt-10 bg-white border border-neutral-200/70 rounded-2xl p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] text-left relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-wide uppercase mb-1">
                    {selectedLeader.name}
                  </h3>
                  
                  <span className="text-xs font-bold tracking-wider text-[#BF953F] block mb-5">
                    {selectedLeader.role} — Markhor Collections
                  </span>
                  
                  <div className="w-full h-[1px] bg-neutral-200/80 mb-6" />
                  
                  <div className="text-sm sm:text-base text-neutral-800 leading-relaxed flex gap-4 font-normal">
                    <CornerDownRight className="w-4 h-4 text-[#BF953F] flex-shrink-0 mt-1.5 stroke-[3px]" />
                    <p className="flex-1" dangerouslySetInnerHTML={{ __html: selectedLeader.bio }} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-2 mt-10">
              {LEADERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLeaderSelect(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer border-0 ${
                    activeIndex === idx ? 'w-8 bg-[#BF953F]' : 'w-2 bg-[#E3DDD3]'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: STARK JET BLACK QUOTE BLOCK WITH EXTRA STYLISH SHIMMER & GLOW BEAM */}
      <section className="relative py-32 bg-[#000000] border-t border-neutral-900 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          <blockquote className="font-serif text-2xl sm:text-4xl lg:text-5xl italic text-white leading-snug tracking-wide max-w-3xl mx-auto mb-10 font-normal">
            "Every collection reflects the belief that clothing should empower confidence and self-expression."
          </blockquote>

          {/* New Luxury Dynamic Gold Shimmer Effect */}
          <cite className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.35em] not-italic animate-stylish-gold-glow">
            — Asad Khan, CEO, Markhor Collections
          </cite>
          
        </div>
      </section>

    </div>
  );
};