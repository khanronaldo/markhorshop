import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { LEADERS as ORIGINAL_LEADERS } from '../data/products'; 
import { ViewType } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 👇 YAHAN SE PICS CONTROL HOGI 👇
// Jitne team members hain, line wise unki pics yahan daal do.
const PAGE_IMAGES = [
  "/shoukatkhan.jpeg", // 1st Bande ki pic
  "/Asadkhan.jpeg", // 2nd Bande ki pic
  "/md1.jpeg",
  "/md2.jpeg",
  // Agar teesra banda hai toh uski pic yahan add karo, maslan:
  // "/teesri-pic.jpg"
];

// Yeh code sirf aapki nayi pics ko purane data (names/bios) ke sath jor dega.
// Koi extra banda add nahi karega, koi repeat nahi karega.
const LEADERS = ORIGINAL_LEADERS.map((leader, index) => ({
  ...leader,
  image: PAGE_IMAGES[index] ? PAGE_IMAGES[index] : leader.image
}));
// 👆 YAHAN TAK 👆

interface AboutProps {
  onViewChange: (view: ViewType) => void;
}

export const About: React.FC<AboutProps> = ({ onViewChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(1200); 
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalItems = LEADERS.length;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleLeaderSelect = (idx: number) => {
    setActiveIndex(idx);
  };

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 3000); 

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [nextSlide]);

  return (
    <div className="w-full min-h-screen font-sans antialiased overflow-x-hidden selection:bg-[#BF953F]/30 bg-[#F7E7CE]">
      
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
          .animate-stylish-gold-glow {
            background-image: linear-gradient(
              to right, #9A7432 0%, #CBA358 25%, #FFF3CD 50%, #CBA358 75%, #9A7432 100%
            );
            background-size: 200% auto;
            animation: textShine 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
            filter: drop-shadow(0 0 12px rgba(203, 163, 88, 0.65)) drop-shadow(0 0 2px rgba(255, 243, 205, 0.4));
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* SECTION 1: HERO CONTAINER */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center bg-[#111111]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none filter contrast-125 brightness-75"
          style={{ backgroundImage: `url('/mainimage.jpeg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/30" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-4 drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)] animate-shimmer-hero inline-block"
          >
            Markhor Collections
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="font-serif italic text-neutral-300 text-sm sm:text-lg max-w-md mx-auto drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
          >
            Suite for the Modern Journey — where style meets substance.
          </motion.p>
        </div>
      </section>

      {/* SECTION 2: THE TEAM */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="mb-12 sm:mb-16">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#B58A3D] font-bold mb-3 block">
              OUR LEADERSHIP
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1C1A17] mb-3">
              The Team Behind the Brand
            </h2>
          </div>

          <div className="flex flex-col items-center relative my-4">
            
            <button onClick={prevSlide} className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white border border-[#E3DDD3] flex items-center justify-center text-[#B58A3D] hover:bg-[#BF953F] hover:text-white transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.08)] cursor-pointer">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white border border-[#E3DDD3] flex items-center justify-center text-[#B58A3D] hover:bg-[#BF953F] hover:text-white transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.08)] cursor-pointer">
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="relative w-full overflow-hidden py-8 flex justify-center h-[580px] sm:h-[650px]">
              <div className="relative flex items-center justify-center max-w-full w-[1400px] h-full">
                
                {LEADERS.map((leader, idx) => {
                  const dist = idx - activeIndex;
                  const absDist = Math.abs(dist);
                  const isCenter = idx === activeIndex;

                  const isMobile = screenWidth < 640;
                  const spacing = isMobile ? 320 : 480; 
                  const transformX = dist * spacing; 

                  if (absDist > 2) return null; 

                  return (
                    <motion.div
                      key={leader.name}
                      onClick={() => handleLeaderSelect(idx)}
                      animate={{
                        x: transformX,
                        scale: isCenter ? 1 : 0.85,
                        zIndex: 10 - absDist,
                        opacity: isCenter ? 1 : 0.4
                      }}
                      transition={{ type: 'spring', damping: 25, stiffness: 140 }}
                      className={`absolute w-[290px] sm:w-[380px] h-[520px] sm:h-[580px] rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-white transition-all cursor-pointer ${
                        isCenter 
                          ? 'border-2 border-[#BF953F] shadow-[0_25px_60px_rgba(181,138,61,0.25)] ring-4 ring-[#BF953F]/10' 
                          : 'border border-[#E3DDD3]'
                      }`}
                    >
                      <div className="h-[55%] w-full shrink-0 relative flex items-center justify-center bg-[#F5F5F5] overflow-hidden">
                        <img 
                          src={leader.image} 
                          alt={leader.name} 
                          className="w-full h-full object-cover object-center filter contrast-[1.05]"
                        />
                        {!isCenter && <div className="absolute inset-0 bg-black/20 transition-opacity duration-300" />}
                      </div>
                      
                      <div 
                        className={`flex-1 p-5 sm:p-7 flex flex-col items-center text-center bg-white relative z-10 transition-opacity duration-300 ${
                          isCenter ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        <span className="text-[10px] sm:text-[11px] text-[#BF953F] font-bold tracking-[0.2em] uppercase mb-1.5 block">
                          {leader.role}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1A17] mb-3">
                          {leader.name}
                        </h3>
                        
                        <div className="w-12 h-[2px] bg-[#BF953F]/50 mb-4" />
                        
                        <div 
                          className="text-[13px] sm:text-sm text-neutral-600 leading-relaxed overflow-y-auto hide-scrollbar"
                          dangerouslySetInnerHTML={{ __html: leader.bio }} 
                        />
                      </div>
                    </motion.div>
                  );
                })}

              </div>
            </div>

            <div className="flex justify-center gap-2.5 mt-6">
              {LEADERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLeaderSelect(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer border-0 ${
                    activeIndex === idx ? 'w-10 bg-[#BF953F]' : 'w-2.5 bg-[#E3DDD3] hover:bg-[#D1C9B9]'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: STARK JET BLACK QUOTE BLOCK */}
      <section className="relative py-24 sm:py-32 bg-[#000000] border-t border-neutral-900 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="font-serif text-2xl sm:text-4xl lg:text-5xl italic text-white leading-snug tracking-wide max-w-3xl mx-auto mb-10 font-normal">
            "Every collection reflects the belief that clothing should empower confidence and self-expression."
          </blockquote>
          <cite className="font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.35em] not-italic animate-stylish-gold-glow">
            — Asad Khan, CEO, Markhor Collections
          </cite>
        </div>
      </section>

    </div>
  );
};