import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThreeShowcase } from '../components/ThreeShowcase';
import { Product, ViewType } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { Truck, Navigation, Shield, Star, ChevronDown, ArrowRight, ShieldCheck, CornerDownRight } from 'lucide-react';

interface HomeProps {
  onViewChange: (view: ViewType) => void;
  onSelectProduct: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onViewChange, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { products } = useProducts();

  // Testimonial Carousel state
  const testimonials = [
    {
      quote: "Dress is both stylish and super comfy! Unmatched premium fabrics.",
      name: "Asad Khan",
      role: "Founder / Client",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "The structured cuts and double-twill linen collars completely changed my styling catalog.",
      name: "Zubair Ahmed",
      role: "Luxe Collector",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "Delivery was swift, packing was immaculate. Standard of care is absolutely premium.",
      name: "Hassan Malik",
      role: "Gentleman Client",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150"
    }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // FAQ Accordion state
  const faqList = [
    {
      q: "What products does your clothing store offer?",
      a: "We offer a carefully designed collection of men's luxury apparel including signature gold-embroidered T-shirts, premium twill cargo trousers, french terry hoodies, tailored club collar linen shirts, and custom-embossed accessories. All items are crafted in limited batches to ensure perfect standards."
    },
    {
      q: "How can I contact customer support?",
      a: "Our customer service concierge is available 24/7. You can reach out directly via our Contact form, initiate a conversational WhatsApp thread with our managers, or email us at nestandnifty07@gmail.com for formal inquires."
    },
    {
      q: "What is your return policy?",
      a: "Products must be in their original condition, unworn, and include the receipt or proof of purchase. Refunds are processed within 5-7 business days of receiving the returned item at our Islamabad warehousing facility."
    },
    {
      q: "How long does delivery take?",
      a: "All orders receive complimentary express dispatch. Ground transportation and luxury shipping takes 2-3 business days across Pakistan, complete with real-time text tracking notifications."
    },
    {
      q: "Do you offer size exchanges?",
      a: "Yes. We offer complimentary size exchanges within 7 days of delivery receipt, provided the tags remain attached and garments are returned in pristine, unworn condition."
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(2); // Default open policy page

  const handleProductClick = (p: Product) => {
    onSelectProduct(p);
    onViewChange('product');
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeInUpItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 100 } }
  };

  return (
    <div className="bg-[#FAF9F6] text-[#111111] overflow-hidden">
      
      {/* 1. CINEMATIC LIGHT HERO SECTION */}
      <section className="relative min-h-[90vh] w-full flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-white to-[#FAF9F6]">
        
        {/* Parallax Flagship Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.28] pointer-events-none"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600')`,
            backgroundAttachment: 'fixed'
          }}
        />

        {/* Soft elegant gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF9F6]/50 to-[#FAF9F6]" />

        {/* Core Layout Split */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-12">
          
          {/* Hero Explanatory Typography Panel */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-sans text-[10px] sm:text-xs font-bold tracking-[0.35em] text-[#BF953F] mb-4 uppercase"
            >
              INTRODUCING THE ESSENTIALS
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-serif text-4xl sm:text-6xl xl:text-7xl font-light tracking-tight leading-[1.1] mb-6 text-[#111111]"
            >
              Suite for the <br />
              <span className="font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#a8893a] to-[#AA771C] drop-shadow-[0_2px_8px_rgba(201,168,76,0.15)]">
                Modern Journey
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="font-sans text-sm sm:text-base text-neutral-500 leading-relaxed font-light max-w-lg mb-10"
            >
              Premium clothing engineering that fuses clean structural tailoring with resilient contemporary streetwear. Made with respect for people and the planet.
            </motion.p>

            {/* Interaction Call-To-Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <button 
                onClick={() => onViewChange('shop')}
                className="w-full sm:w-auto px-8 py-4 rounded bg-[#111111] text-[#FCF6BA] text-xs font-bold tracking-widest uppercase transition-all duration-300 transform hover:scale-103 hover:bg-black shadow-[0_8px_24px_rgba(0,0,0,0.15)] cursor-pointer flex items-center justify-center gap-2"
              >
                DISCOVER THE COLLECTION <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
              </button>
              
              <button 
                onClick={() => onViewChange('about')}
                className="w-full sm:w-auto px-8 py-4 rounded border border-neutral-200 bg-white text-xs text-[#111111] hover:bg-neutral-50 tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center font-semibold"
              >
                OUR HERITAGE
              </button>
            </motion.div>
          </div>

          {/* Interactive Floating 3D Gold Ribbon Geometry Canvas */}
          <div className="lg:col-span-5 h-[350px] sm:h-[450px] w-full flex items-center justify-center relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1.0 }}
              className="w-full h-full"
            >
              <ThreeShowcase />
            </motion.div>
          </div>

        </div>

        {/* Scroll helper indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#111111]/30 text-[10px] tracking-[0.2em] uppercase">
          <span className="animate-pulse">SCROLL</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#BF953F] to-transparent animate-bounce" />
        </div>
      </section>

      {/* 2. THE BRAND PHILOSOPHY STATEMENT */}
      <section className="py-24 bg-white relative border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold mb-3">OUR HERITAGE</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight leading-tight mb-6 text-[#111111]">
              Crafted with <br />
              <span className="font-normal italic text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] to-[#a8893a]">Purpose &amp; Soul</span>
            </h2>
            <div className="w-14 h-[1px] bg-[#C9A84C] mb-8" />
            
            <blockquote className="font-serif text-lg sm:text-xl italic text-neutral-800 border-l-2 border-[#C9A84C] pl-6 py-1 mb-8">
              "Style that respects people and the planet."
            </blockquote>

            <p className="text-sm leading-relaxed text-neutral-500 font-light mb-4">
              Markhor Collection creates clothing that blends style, quality, and responsibility. We believe in making clothes that look good, feel good, and are made with respect for people and the planet.
            </p>
            <p className="text-sm leading-relaxed text-neutral-500 font-light">
              Our designs are inspired by strength and elegance, offering timeless pieces for everyone while staying committed to ethical practices and sustainability.
            </p>
          </div>

          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden border border-black/5 shadow-2xl">
            <div className="absolute inset-0 bg-neutral-900/10 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800"
              alt="Artisan sewing workshop"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>

        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold mb-2 block">
              CURATED SELECTIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#111111]">
              Featured Flagship Pieces
            </h2>
          </div>
          <button 
            onClick={() => onViewChange('shop')}
            className="group flex items-center gap-2 text-xs font-bold tracking-widest text-[#BF953F] hover:text-[#111111] uppercase transition-colors duration-300 cursor-pointer"
          >
            VIEW ENTIRE FLOOR <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Product Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.slice(0, 3).map((p) => (
            <motion.div 
              key={p.id}
              variants={fadeInUpItem}
              className="bg-white border border-[#111111]/5 rounded-xl overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-[#BF953F]/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col h-full"
            >
              {/* Product Media */}
              <div 
                className="relative aspect-[3/4] overflow-hidden bg-[#FAF9F6] cursor-pointer"
                onClick={() => handleProductClick(p)}
              >
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                
                {p.badge && (
                  <span className="absolute top-4 left-4 bg-[#111111] text-[#FCF6BA] text-[9px] font-bold tracking-[0.2em] py-1 px-3 border border-[#C9A84C]/20 uppercase rounded shadow-sm">
                    {p.badge}
                  </span>
                )}
                
                {/* Overlay Button */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(p);
                    }}
                    className="px-6 py-3.5 rounded bg-white text-[#111111] text-[10px] font-bold tracking-widest uppercase hover:bg-black hover:text-[#FCF6BA] transition-all duration-300 shadow-md"
                  >
                    QUICK VIEW
                  </button>
                </div>
              </div>

              {/* Specs & Pricing */}
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[10px] text-neutral-400 font-semibold tracking-widest uppercase mb-1">
                  MEN'S PREMIUM COLLECTION
                </span>
                <h3 
                  onClick={() => handleProductClick(p)}
                  className="font-serif text-lg font-normal tracking-wide text-[#111111] hover:text-[#BF953F] cursor-pointer transition-colors mb-2"
                >
                  {p.name}
                </h3>
                <div className="text-sm font-sans font-bold text-[#BF953F] mt-1 mb-4">
                  Rs. {p.price.toLocaleString()}
                </div>
                
                <button
                  onClick={() => addToCart(p, p.sizes[0], p.colors[0])}
                  className="w-full mt-auto py-3 rounded bg-[#FAF9F6] border border-black/5 text-[10px] font-bold tracking-widest text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-300 uppercase cursor-pointer"
                >
                  ADD TO CART
                </button>
              </div>

            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. PREMIUM BENEFITS */}
      <section className="py-24 bg-white border-t border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#BF953F] font-bold mb-2 block">WHY CHOOSE US</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#111111] mb-2">Customer Benefits</h2>
            <p className="text-xs sm:text-sm italic text-neutral-500 font-serif">Enjoy these added advantages with every premium purchase</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF9F6] border border-black/5 rounded-xl p-8 text-center hover:border-[#BF953F]/30 hover:bg-white transition-all duration-300 group shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#111111] text-[#FCF6BA] flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <h3 className="font-serif text-lg font-medium tracking-wide text-[#111111] mb-2">Fast Delivery</h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">Get your clothing delivered quickly across major metropolitan sites.</p>
            </div>

            <div className="bg-[#FAF9F6] border border-black/5 rounded-xl p-8 text-center hover:border-[#BF953F]/30 hover:bg-white transition-all duration-300 group shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#111111] text-[#FCF6BA] flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-105 transition-transform">
                <Navigation className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <h3 className="font-serif text-lg font-medium tracking-wide text-[#111111] mb-2">Order Tracking</h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">Track your shipment details in real-time, from dispatch to threshold check.</p>
            </div>

            <div className="bg-[#FAF9F6] border border-black/5 rounded-xl p-8 text-center hover:border-[#BF953F]/30 hover:bg-white transition-all duration-300 group shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#111111] text-[#FCF6BA] flex items-center justify-center mx-auto mb-6 shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <h3 className="font-serif text-lg font-medium tracking-wide text-[#111111] mb-2">24/7 Support</h3>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">Our dedicated managers are online Day &amp; Night to guide adjustments and orders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GESTURE-TAP CAROUSEL TESTIMONIALS */}
      <section className="py-24 bg-[#FAF9F6] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold mb-3 block">TESTIMONIALS</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight mb-16 text-[#111111]">What Our Customers Say</h2>

          <div className="relative min-h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                className="w-full"
              >
                <p className="font-serif text-xl sm:text-2xl font-light italic leading-relaxed text-[#111111] max-w-2xl mx-auto mb-8 relative">
                  <span className="absolute -top-6 -left-4 text-6xl text-[#C9A84C]/25 font-serif leading-none">“</span>
                  {testimonials[activeTestimonial].quote}
                  <span className="absolute -bottom-12 -right-4 text-6xl text-[#C9A84C]/25 font-serif leading-none">”</span>
                </p>

                <div className="flex items-center justify-center gap-3">
                  <img 
                    src={testimonials[activeTestimonial].avatar} 
                    alt={testimonials[activeTestimonial].name} 
                    className="w-10 h-10 object-cover rounded-full border border-[#BF953F]/40 shadow-sm"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold tracking-widest text-[#BF953F] uppercase">{testimonials[activeTestimonial].name}</div>
                    <div className="text-[10px] text-neutral-400 tracking-wide mt-0.5">{testimonials[activeTestimonial].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-12">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeTestimonial === idx ? 'w-6 bg-[#BF953F]' : 'w-1.5 bg-neutral-200'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ HEIGHT-TRANSITIONAL ACCORDION CONTAINER */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-black/5">
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold mb-2 block">HELP CENTER</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#111111]">Frequently asked questions</h2>
          <div className="w-12 h-[1px] bg-[#C9A84C] mx-auto mt-4" />
        </div>

        <div className="flex flex-col gap-4">
          {faqList.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-[#BF953F]/40 shadow-[0_4px_24px_rgba(0,0,0,0.03)]' : 'border-black/5'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left font-sans text-xs sm:text-sm font-bold tracking-widest text-[#111111] uppercase py-5 px-6 flex items-center justify-between gap-4 select-none cursor-pointer"
                >
                  <span className="leading-tight">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#BF953F] flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-neutral-500 leading-relaxed font-light border-t border-neutral-100 pt-4 flex gap-2">
                        <CornerDownRight className="w-4 h-4 text-[#BF953F] flex-shrink-0 mt-0.5" />
                        <p>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. END BANNER CTA STRIP */}
      <section className="py-24 bg-[#111111] text-center relative overflow-hidden">
        {/* Subtle glow assets */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800')` }} />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#FCF6BA] font-semibold mb-3 block">READY TO COMMENCE?</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-white mb-4">Explore the Full Collection</h2>
          <p className="font-serif italic text-white/50 mb-10 text-sm sm:text-base">Discover premium clothing that combines structured tailoring with everyday wearability.</p>
          <button 
            onClick={() => onViewChange('shop')}
            className="px-10 py-4.5 rounded bg-gradient-to-r from-[#BF953F] via-[#C9A84C] to-[#FCF6BA] text-[#111111] text-xs font-bold tracking-widest uppercase transition-transform duration-300 hover:scale-103 active:scale-95 cursor-pointer shadow-[0_8px_30px_rgba(201,168,76,0.25)]"
          >
            DISCOVER THE BOUTIQUE FLOOR
          </button>
        </div>
      </section>

    </div>
  );
};
