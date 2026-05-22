import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ViewType } from '../types';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { 
  Truck, Navigation, ShieldCheck, ChevronDown, CornerDownRight, 
  Shirt, Layers, Diamond, Star
} from 'lucide-react';

interface HomeProps {
  onViewChange: (view: ViewType) => void;
  onSelectProduct: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onViewChange, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { products } = useProducts();

  // --- AUTO-FADE TESTIMONIALS STATE ---
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    { quote: "THE QUALITY OF THE FABRIC IS AMAZING. THE FIT IS PERFECT AND IT FEELS TRULY PREMIUM.", name: "HARIS KHAN", role: "Verified Buyer" },
    { quote: "BEST CLOTHING STORE ONLINE. THE STITCHING AND MATERIAL WEIGHT IS UNBELIEVABLY RICH.", name: "SAMEER AHMED", role: "Regular Customer" },
    { quote: "IMMACULATE ATTENTION TO DETAIL. THE PACKAGING AND DELIVERY WAS SPOT ON.", name: "DANIYAL SHAH", role: "Verified Buyer" },
    { quote: "FINALLY, A BRAND THAT DELIVERS EXACTLY WHAT THEY SHOW IN PREMIUM QUALITY. HIGHLY RECOMMENDED.", name: "ZAIN MALIK", role: "Loyal Customer" },
    { quote: "FROM FABRIC TO THE FINAL FIT, EVERYTHING IS ABSOLUTELY MAGNIFICENT. WILL SHOP AGAIN!", name: "BILAL SHEIKH", role: "Premium Member" }
  ];

  // --- FAQS STATE ---
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqList = [
    { q: "What types of premium clothing do you offer?", a: "We specialize in premium men's apparel including signature embroidered T-shirts, high-grade twill cargo trousers, french terry hoodies, and luxury smart-casual shirts built for maximum comfort and style." },
    { q: "How can I choose my perfect size?", a: "We have a detailed size chart available on every product page. If you are confused between sizes, our customer support team can assist you instantly via WhatsApp." },
    { q: "What is your exchange and return policy?", a: "We offer a hassle-free 7-day exchange policy. The item must be unworn, unwashed, and in its original premium packaging with tags intact." },
    { q: "How long does the delivery take?", a: "We provide swift dispatch across Pakistan. All orders are delivered to your doorstep within 2 to 3 business days with complete tracking updates." }
  ];

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(testimonialTimer);
  }, [testimonials.length]);

  const handleProductClick = (p: Product) => {
    onSelectProduct(p);
    onViewChange('product');
  };

  // REUSABLE ANIMATION CONFIG FOR 2-SECOND SLOW REVEAL ON SCROLL
  const slowFadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 2, ease: [0.25, 0.8, 0.25, 1] } }
  };

  return (
    <div className="text-[#000000] overflow-hidden selection:bg-[#D4AF37] selection:text-[#000000] bg-[#FAF9F6]">
      
      {/* EXTRACTED HTML/CSS STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap');
        
        .font-luxury-serif { font-family: 'Playfair Display', serif; }
        .font-luxury-sans { font-family: 'Montserrat', sans-serif; }

        .liquid-gold-text {
          background: linear-gradient(to right, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 10px rgba(201, 168, 76, 0.3)) drop-shadow(0 0 25px rgba(184, 151, 90, 0.5));
          animation: liquidGold 5s linear infinite;
        }

        @keyframes liquidGold {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .shining-gold-btn {
          background-color: #D4AF37;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
          transition: all 0.4s ease-in-out;
        }
        .shining-gold-btn:hover {
          background-color: #BF953F;
          box-shadow: 0 0 25px rgba(212, 175, 55, 0.6);
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] sm:h-screen w-full flex items-center justify-center overflow-hidden bg-[#000000]">
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat opacity-[0.35]" 
          style={{ backgroundImage: `url('/mainimage.jpeg')`, backgroundPosition: 'center 75%' }} 
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 40%, rgba(201,168,76,0.15) 100%)' }} />
        
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={slowFadeUp} 
          className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center"
        >
          <span className="text-[11px] tracking-[0.35em] uppercase text-[#D4AF37] font-bold mb-6 block font-luxury-sans">
            PREMIUM FASHION STORE
          </span>
          <h1 className="font-luxury-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight uppercase">
            <span className="liquid-gold-text block leading-normal">WELCOME TO MARKHOR COLLECTIONS</span>
          </h1>
          <p className="font-luxury-serif text-lg sm:text-xl italic text-white/75 mt-4 max-w-2xl tracking-wider">
            Premium Quality Apparel & Everyday Essentials
          </p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }} 
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 w-full sm:w-auto"
          >
            <button onClick={() => onViewChange('shop')} className="w-full sm:w-auto px-10 py-4 shining-gold-btn text-[#000000] font-luxury-sans font-bold text-xs tracking-[0.25em] uppercase cursor-pointer rounded-none">
              SHOP COLLECTION
            </button>
            <button onClick={() => onViewChange('about')} className="w-full sm:w-auto px-10 py-4 border border-white/30 text-white font-luxury-sans font-medium text-xs tracking-[0.25em] uppercase hover:bg-white/10 transition-all cursor-pointer rounded-none">
              OUR BRAND STORY
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. STORE BRAND PHILOSOPHY */}
      <section className="py-24 bg-[#F7E7CE] relative overflow-hidden">
        <div className="absolute -top-[100px] -right-[100px] w-[500px] h-[500px] rounded-full border border-[#C9A84C]/20" />
        
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }} 
          variants={slowFadeUp}
          className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10"
        >
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#000000] font-bold block font-luxury-sans">THE FABRIC STANDARD</span>
            <h2 className="font-luxury-serif text-4xl sm:text-5xl text-[#000000] font-bold leading-tight">Premium Materials,<br /><span className="italic font-light">Flawless Fit</span></h2>
            
            <blockquote className="font-luxury-serif text-2xl italic text-[#000000] border-l-4 border-[#D4AF37] pl-6 my-8 leading-relaxed">
              "We don't just sell clothes; we upgrade your everyday style wardrobe."
            </blockquote>
            
            <p className="font-luxury-sans text-[15px] leading-loose text-[#000000]/80 font-medium max-w-md">
              At Markhor Collections, we focus on sourcing high-grade fabrics, durable stitching, and modern designs. Every piece in our store is carefully engineered to ensure maximum comfort and long-lasting premium wear.
            </p>
          </div>
          
          {/* Philosophy Section Image Box with Gold Frame Layout */}
          <div className="relative aspect-square">
            <img 
              src="/5logo.jpeg" 
              alt="Markhor Collections Philosophy" 
              className="w-full h-full object-cover shadow-2xl rounded-lg relative z-10"
            />
            <div className="absolute -top-3 -left-3 -right-3 -bottom-3 border-2 border-[#D4AF37] rounded-lg z-0" />
          </div>
        </motion.div>
      </section>

      {/* 3. STORE CATEGORIES */}
      <section className="py-24 bg-[#FAF9F6]">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }} 
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <motion.span variants={slowFadeUp} className="text-[10px] tracking-[0.4em] uppercase text-[#000000] font-bold mb-3 block font-luxury-sans">STORE CATEGORIES</motion.span>
          <motion.h2 variants={slowFadeUp} className="font-luxury-serif text-3xl sm:text-4xl text-[#000000] font-bold mb-16 tracking-wide uppercase">Explore Our Outfits</motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shirt, title: "Premium Essentials", desc: "Everyday luxury staples including high-quality basic tees, polos, and classic shirts designed for all-day comfort." },
              { icon: Layers, title: "Modern Streetwear", desc: "Trend-forward drops featuring perfect oversized silhouettes, heavy cotton hoodies, and signature aesthetics." },
              { icon: Diamond, title: "Tailored Trousers & Tights", desc: "Premium bottom-wear ranging from structural cargo pants to highly tailored casual trousers for the perfect fit." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 2, delay: index * 0.3, ease: [0.25, 0.8, 0.25, 1] } }
                }}
                className="bg-[#F7E7CE] px-10 py-14 rounded-xl border border-[#C9A84C]/20 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col items-center relative"
              >
                <item.icon className="w-12 h-12 text-[#000000] mb-6 stroke-[1.2]" />
                <h3 className="font-luxury-serif text-[1.4rem] text-[#000000] mb-4 font-bold tracking-wide">{item.title}</h3>
                <p className="font-luxury-sans text-[#000000]/85 text-[15px] leading-loose font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="py-24 px-6 bg-white">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={slowFadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-14 border-b border-[#000000]/10 pb-8">
            <div>
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#000000] font-bold mb-3 block font-luxury-sans">FEATURED RELEASES</span>
              <h2 className="font-luxury-serif text-3xl sm:text-4xl text-[#000000] font-bold tracking-wide">Trending In Store</h2>
            </div>
            <button onClick={() => onViewChange('shop')} className="px-6 py-3 border-2 border-[#000000] text-[#000000] text-[10px] font-luxury-sans font-bold tracking-[0.2em] uppercase hover:bg-[#000000] hover:text-white transition-all cursor-pointer rounded-none">
              VIEW ALL PRODUCTS
            </button>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {products.slice(0, 3).map((p, index) => (
              <motion.div 
                key={p.id} 
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 2, delay: index * 0.3, ease: [0.25, 0.8, 0.25, 1] } }
                }}
                className="group cursor-pointer flex flex-col" 
                onClick={() => handleProductClick(p)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#FAF9F6] mb-5 relative border border-[#000000]/10 rounded-lg">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-[#000000]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-[#000000] font-luxury-sans text-[10px] font-bold tracking-[0.2em] py-3 px-6 shadow-xl rounded-sm">VIEW DETAILS</span>
                  </div>
                </div>
                <h3 className="font-luxury-serif text-lg mb-1.5 text-[#000000] tracking-wide font-bold">{p.name}</h3>
                <p className="font-luxury-sans text-[#000000]/80 font-semibold text-sm mb-4">RS. {p.price.toLocaleString()}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Black'); }} 
                  className="w-full py-3.5 border border-[#000000]/20 hover:border-[#000000] font-luxury-sans text-[10px] font-bold tracking-[0.2em] uppercase bg-transparent text-[#000000] hover:bg-[#000000] hover:text-white transition-all mt-auto rounded-none"
                >
                  ADD TO CART
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 5. CUSTOMER SHOPPING BENEFITS */}
      <section className="py-24 bg-[#000000] relative overflow-hidden px-6">
        <div className="absolute -top-[150px] -right-[150px] w-[400px] h-[400px] border border-[#C9A84C]/10 rounded-full" />
        
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto relative z-10 text-center"
        >
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] font-bold mb-3 block font-luxury-sans">SHOP WITH CONFIDENCE</span>
          <h2 className="font-luxury-serif text-3xl sm:text-4xl text-white font-bold tracking-wide mb-16 uppercase">Our Premium Store Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Free Delivery Nationwide", desc: "Enjoy completely free express shipping across Pakistan on every order you place." },
              { icon: Navigation, title: "Instant Tracked Dispatch", desc: "Track your clothing order in real-time right from our warehouse straight to your doorstep." },
              { icon: ShieldCheck, title: "7-Day Easy Exchanges", desc: "Facing sizing issues? Exchange your apparel smoothly with our friendly support system." }
            ].map((ben, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 2, delay: i * 0.3, ease: [0.25, 0.8, 0.25, 1] } }
                }}
                className="bg-white/5 border border-white/10 p-10 rounded-xl flex flex-col items-center hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md group"
              >
                <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#BF953F] to-[#AA771C] text-white flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(201,168,76,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <ben.icon className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-luxury-serif text-[1.2rem] text-white mb-3 tracking-wide font-bold">{ben.title}</h3>
                <p className="font-luxury-sans text-white/60 text-[14px] leading-loose font-medium max-w-xs">{ben.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 6. WHAT OUR CUSTOMERS SAY */}
      <section className="py-24 bg-[#F7E7CE] overflow-hidden">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }} 
          variants={slowFadeUp}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#000000] font-bold mb-3 block font-luxury-sans">CUSTOMER REVIEWS</span>
          <h2 className="font-luxury-serif text-3xl sm:text-4xl text-[#000000] font-bold tracking-wide mb-14 uppercase">Feedback From Our Buyers</h2>
          
          <div className="bg-white rounded-xl p-10 sm:p-16 relative shadow-[0_10px_30px_rgba(0,0,0,0.05)] min-h-[340px] flex flex-col justify-center max-w-[700px] mx-auto">
             <span className="absolute -top-6 left-6 text-[8rem] text-[#D4AF37] opacity-15 leading-none select-none font-luxury-serif">“</span>
             
             <div className="relative overflow-hidden flex-1 flex flex-col justify-center z-10">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={activeTestimonial}
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -15 }}
                   transition={{ duration: 0.5, ease: "easeOut" }}
                   className="w-full"
                 >
                   <p className="font-luxury-serif text-[1.4rem] font-light italic text-[#000000] leading-relaxed mb-8">
                     "{testimonials[activeTestimonial].quote}"
                   </p>
                   <div className="flex flex-col items-center">
                      <h4 className="font-luxury-sans font-bold tracking-[0.18em] text-[12px] text-[#000000] uppercase">{testimonials[activeTestimonial].name}</h4>
                      <p className="font-luxury-sans text-[10px] text-[#000000]/60 uppercase tracking-wider mt-1">{testimonials[activeTestimonial].role}</p>
                   </div>
                 </motion.div>
               </AnimatePresence>
             </div>

             <div className="flex gap-1.5 mt-6 justify-center">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />)}
             </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveTestimonial(idx)} 
                className={`h-2 transition-all duration-300 cursor-pointer rounded-full ${activeTestimonial === idx ? 'w-8 bg-[#D4AF37] scale-110' : 'w-2 bg-[#000000]/20'}`} 
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* 7. FAQ'S SECTION */}
      <section className="py-24 bg-white px-6">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }} 
          variants={slowFadeUp}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16"
        >
          <div className="lg:col-span-5">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#000000] font-bold mb-3 block font-luxury-sans">STORE HELP DESK</span>
            <h2 className="font-luxury-serif text-4xl text-[#000000] font-bold leading-tight mb-6">Got Any<br />Questions?</h2>
            <div className="w-12 h-[2px] bg-[#000000] mb-6" />
            <p className="font-luxury-sans text-[#000000]/70 font-medium text-[14px] leading-loose max-w-xs mb-8">Can't find what you are looking for? Contact our customer support team directly for fast assistance with your order.</p>
            <button onClick={() => onViewChange('contact')} className="bg-[#000000] text-white px-8 py-4 font-luxury-sans text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2.5 hover:bg-[#D4AF37] transition-colors cursor-pointer rounded-none">
              CONTACT SUPPORT
            </button>
          </div>
          
          <div className="lg:col-span-7 flex flex-col gap-4">
            {faqList.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className={`border rounded-md overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#D4AF37] shadow-[0_0_15px_rgba(201,168,76,0.15)] bg-[#F7E7CE]' : 'border-gray-200 bg-transparent'}`}>
                  <button onClick={() => setOpenFaq(isOpen ? null : index)} className="w-full text-left py-5 px-6 flex justify-between items-center group cursor-pointer">
                    <span className={`font-luxury-sans font-bold text-[14px] tracking-wider uppercase ${isOpen ? 'text-[#000000]' : 'text-[#000000]/90'}`}>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#D4AF37] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <div className="px-6 pb-5 text-[14px] text-[#000000]/80 leading-loose font-medium font-luxury-sans pt-1 flex gap-3">
                          <CornerDownRight className="w-4 h-4 text-[#000000]/50 flex-shrink-0 mt-1.5" />
                          <p>{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* 8. BOTTOM CTA STRIP */}
      <section className="py-24 bg-[#000000] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.08]" style={{ backgroundImage: `url('/2.jpeg')` }} />
        
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.5 }} 
          variants={slowFadeUp}
          className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center"
        >
           <span className="text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] font-bold mb-3 block font-luxury-sans">UPGRADE YOUR STYLE</span>
           <h2 className="font-luxury-serif text-3xl sm:text-5xl text-white font-bold mb-6 tracking-wide uppercase">Shop Premium Wardrobe</h2>
           <p className="font-luxury-serif italic text-white/70 font-medium text-lg sm:text-xl max-w-lg mb-10 leading-relaxed">Discover a highly curated selection of outfits made for ultimate comfort and statement modern fits.</p>
           <button onClick={() => onViewChange('shop')} className="px-10 py-4.5 shining-gold-btn text-[#000000] font-luxury-sans font-bold text-xs tracking-[0.25em] uppercase cursor-pointer rounded-none">
              BROWSE ALL CLOTHES
           </button>
        </motion.div>
      </section>

    </div>
  );
};