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
    <div className="bg-[#FAF9F6] text-[#111111] min-h-screen">
      
      {/* Hero Header Banner */}
      <div className="relative py-16 bg-white border-b border-neutral-100 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1400')` }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 animate-fade-in">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold mb-2 block">
            GET IN TOUCH
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#111111] mb-2 animate-fade-in">
            Contact us
          </h1>
          <p className="font-serif italic text-neutral-400 text-xs sm:text-sm max-w-md mx-auto">
            Contact us about anything related to our company or services.
          </p>
        </div>
      </div>

      {/* Main Form + Info Split Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* L: DETAILED MESSAGE CONSOLE FORM */}
          <div className="lg:col-span-12 xl:col-span-7 bg-white border border-[#111111]/5 rounded-xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.015)] font-sans">
            <span className="text-[10px] tracking-[0.2em] font-bold text-[#BF953F] uppercase block mb-2">
              REACH OUR CONCIERGE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-[#111111] mb-3">
              Send us a Message
            </h2>
            <p className="text-xs text-neutral-400 font-light mb-8 pb-4 border-b border-neutral-100">
              Please enter your parameters below. Our priority support systems will route immediately.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                    Your Name <span className="text-[#BF953F] font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs text-[#111111] bg-[#FAF9F6]/50 border border-neutral-200 rounded-md py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+92 3XX XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs text-[#111111] bg-[#FAF9F6]/50 border border-neutral-200 rounded-md py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                    Email Address <span className="text-[#BF953F] font-bold">*</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs text-[#111111] bg-[#FAF9F6]/50 border border-neutral-200 rounded-md py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                    Subject Line <span className="text-[#BF953F] font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Describe your request..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs text-[#111111] bg-[#FAF9F6]/50 border border-neutral-200 rounded-md py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                  Detailed Message <span className="text-[#BF953F] font-bold">*</span>
                </label>
                <textarea 
                  rows={5}
                  placeholder="Write down your detailed inquiry here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs text-[#111111] bg-[#FAF9F6]/50 border border-neutral-200 rounded-md py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] resize-y"
                />
              </div>

              <span className="text-[10px] text-neutral-400 tracking-wide block">
                * We typically respond within 1-2 business days.
              </span>

              {toastMsg && (
                <div className="bg-[#111111] text-white rounded-lg p-3 text-xs tracking-wider text-center font-bold">
                  {toastMsg}
                </div>
              )}

              {/* Dual triggers actions panel */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="flex-1 py-3.5 rounded bg-[#111111] text-[#FCF6BA] text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4 text-[#C9A84C]" /> SEND VIA INBOX EMAIL
                </button>

                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex-1 py-3.5 rounded bg-[#25D366] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#128C7E] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(37,211,102,0.2)] font-bold"
                >
                  <MessageSquare className="w-4 h-4" /> TEXT ON WHATSAPP
                </button>
              </div>

            </form>
          </div>

          {/* R: FLAGSHIP DETAIL SHOWROOM MODULE */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-10">
            
            {/* Showroom preview image */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl border border-neutral-200/50">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800" 
                alt="Markhor Flagship Studio interior" 
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* List coordinates */}
            <div className="flex flex-col gap-6 font-sans">
              
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[#BF953F] flex-shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase mb-1">ATELIER LOGISTICS Location</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    Islamabad Highway Closeout Grids, Islamabad, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[#BF953F] flex-shrink-0 shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase mb-1">WhatsApp Direct</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    <a href="https://wa.me/923555107132" target="_blank" rel="noopener noreferrer" className="text-[#111111] hover:text-[#BF953F] font-bold transition-colors underline decoration-[#BF953F]/40">
                      +92 355 510 7132
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[#BF953F] flex-shrink-0 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase mb-1">Direct Support</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    <a href="mailto:nestandnifty07@gmail.com" className="text-[#111111] hover:text-[#BF953F] font-bold transition-colors underline decoration-[#BF953F]/40">
                      nestandnifty07@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[#BF953F] flex-shrink-0 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase mb-1">Showroom Timings</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-light">
                    Mon–Sat: 9:00 AM – 10:00 PM <br />
                    Sunday Reserved for Concierge Bespoke Appoints.
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
