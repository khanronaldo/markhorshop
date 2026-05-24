import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const ADMIN_EMAIL = 'nestandnifty07@gmail.com';
  const ADMIN_WHATSAPP = '923555107132';

  const validateForm = () => {
    if (!name || !email || !subject || !message) {
      setToastMsg('⚠️ Please fill in all required fields marked with *');
      return false;
    }
    if (!email.includes('@')) {
      setToastMsg('⚠️ Please enter a valid email structure');
      return false;
    }
    return true;
  };

  const handleSendEmail = () => {
    if (!validateForm()) return;

    const emailSubject = encodeURIComponent(`[Markhor Inquiry] ${subject}`);
    const emailBody = encodeURIComponent(
      `Name: ${name}\n` +
      `Phone: ${phone || 'Not provided'}\n` +
      `Email: ${email}\n\n` +
      `Message:\n${message}`
    );

    const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoLink;

    setToastMsg('✓ Launching your default mail client...');
  };

  const handleSendWhatsApp = () => {
    if (!validateForm()) return;

    const waMessage = 
      `*New Contact Message — Markhor Collections*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone || 'Not provided'}\n` +
      `*Email:* ${email}\n` +
      `*Subject:* ${subject}\n\n` +
      `*Message:*\n${message}`;

    const waLink = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(waMessage)}`;
    window.open(waLink, '_blank');

    setToastMsg('✓ Forwarding to WhatsApp...');
  };

  return (
    <div 
      // Changed base background to Champagne Beige (#F5E6D3) and adjusted selection colors
      className="bg-[#F5E6D3] text-[#332C2A] min-h-screen pb-12 sm:pb-20 relative selection:bg-[#C48F56]/30 selection:text-[#332C2A]"
      style={{
        backgroundSize: '44px 44px',
        backgroundImage: `
          linear-gradient(to right, rgba(51, 44, 42, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(51, 44, 42, 0.04) 1px, transparent 1px)
        `
      }}
    >
      
      {/* HIGH-END VIGNETTE HERO BANNER */}
      <div 
        // Mobile optimization: reduced py-28 to py-16 on mobile
        className="relative py-16 sm:py-24 md:py-28 bg-cover bg-center border-b border-[#E1D0BB] overflow-hidden text-center"
        style={{ 
          backgroundImage: `url('/5logo.jpeg')` 
        }}
      >
        {/* Soft dark vignette luxury depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />
        {/* Adjusted bottom gradient to match Champagne Beige */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F5E6D3] to-transparent opacity-80" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-[10px] tracking-[0.45em] uppercase text-[#FAD5A5] font-bold mb-3 block drop-shadow-sm">
            MARKHOR CONCIERGE
          </span>
          {/* Mobile optimization: text-4xl on small screens, scaling up for larger screens */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 uppercase drop-shadow-md">
            Contact us
          </h1>
          <div className="w-12 sm:w-16 h-[1.5px] bg-[#FAD5A5] mx-auto mb-4" />
          <p className="font-sans text-neutral-300 text-xs sm:text-sm md:text-base max-w-md mx-auto font-light tracking-wide leading-relaxed drop-shadow-sm">
            Contact us about anything related to our company or services.
          </p>
        </div>
      </div>

      {/* MAIN LAYOUT SPLIT GRID */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Mobile optimization: adjusted gaps between columns for small screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 xl:gap-16 items-start">
          
          {/* LEFT COLUMN: EDITORIAL FORM MODULE */}
          <div className="lg:col-span-7 bg-transparent text-left order-2 lg:order-1">
            <span className="text-[10px] tracking-[0.25em] font-bold text-[#C48F56] uppercase block mb-2">
              GET IN TOUCH
            </span>
            {/* Mobile optimization: Reduced heading size */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#332C2A] mb-3 uppercase">
              Send us a Message
            </h2>
            <p className="text-xs sm:text-sm text-[#5C504C]/80 font-light tracking-wide mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-[#E1D0BB]">
              Contact us about anything related to our company or services.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 sm:gap-6 font-sans">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#332C2A] uppercase">
                    NAME <span className="text-[#C48F56] font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs text-[#332C2A] bg-white/70 border border-[#E1D0BB] rounded-lg py-3.5 sm:py-4 px-4 outline-none focus:border-[#C48F56] focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#332C2A] uppercase">
                    PHONE NUMBER
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+1 555-555-5556"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs text-[#332C2A] bg-white/70 border border-[#E1D0BB] rounded-lg py-3.5 sm:py-4 px-4 outline-none focus:border-[#C48F56] focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#332C2A] uppercase">
                    EMAIL <span className="text-[#C48F56] font-bold">*</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs text-[#332C2A] bg-white/70 border border-[#E1D0BB] rounded-lg py-3.5 sm:py-4 px-4 outline-none focus:border-[#C48F56] focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#332C2A] uppercase">
                    SUBJECT <span className="text-[#C48F56] font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Describe your request"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs text-[#332C2A] bg-white/70 border border-[#E1D0BB] rounded-lg py-3.5 sm:py-4 px-4 outline-none focus:border-[#C48F56] focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.2em] text-[#332C2A] uppercase">
                  MESSAGE <span className="text-[#C48F56] font-bold">*</span>
                </label>
                <textarea 
                  rows={4}
                  placeholder="Write down your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs text-[#332C2A] bg-white/70 border border-[#E1D0BB] rounded-lg py-3.5 sm:py-4 px-4 outline-none focus:border-[#C48F56] focus:bg-white resize-y shadow-sm"
                />
              </div>

              <span className="text-[11px] text-[#5C504C]/70 tracking-wide block font-light">
                We typically respond within 1-2 business days.
              </span>

              {toastMsg && (
                <div className="bg-[#332C2A] text-[#F5E6D3] rounded-xl p-3.5 text-xs tracking-wider text-center font-mono font-bold shadow-md">
                  {toastMsg}
                </div>
              )}

              {/* DUAL ACTION BUTTON PANEL */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="w-full sm:w-1/2 py-3.5 sm:py-4 bg-[#000000] text-white text-[10px] sm:text-[11px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center gap-2 rounded-lg shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> SEND VIA EMAIL
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="w-full sm:w-1/2 py-3.5 sm:py-4 bg-[#25D366] text-white text-[10px] sm:text-[11px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase hover:bg-[#20ba59] transition-all cursor-pointer flex items-center justify-center gap-2 rounded-lg shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> WHATSAPP
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT COLUMN: SHOWROOM DETAILS PANEL */}
          <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 xl:pl-6 text-left order-1 lg:order-2 mb-4 lg:mb-0">
            
            {/* Elegant Studio Image Container */}
            <div className="aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden border border-[#E1D0BB] shadow-lg group">
              <img 
                src="/2.jpeg" 
                alt="Markhor Luxury Studio Interior" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Premium Gold Coordinates Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 sm:gap-6 font-sans">
              
              {/* Location */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#B89047] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#332C2A] uppercase mb-0.5">LOCATION</h4>
                  <p className="text-xs text-[#5C504C] font-light leading-relaxed">
                    Gilgit Baltistan, Pakistan
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#B89047] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#332C2A] uppercase mb-0.5">WHATSAPP</h4>
                  <p className="text-xs font-bold text-[#332C2A] tracking-wide">
                    +92 355 510 7132
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#B89047] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#332C2A] uppercase mb-0.5">EMAIL</h4>
                  <p className="text-xs font-bold text-[#332C2A] tracking-wide truncate sm:break-all">
                    nestandnifty07@gmail.com
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#B89047] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#332C2A] uppercase mb-0.5">BUSINESS HOURS</h4>
                  <p className="text-xs text-[#5C504C] font-light leading-relaxed">
                    Mon–Sat: 9 AM – 10 PM
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};