import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { Product, ViewType } from '../types';
import { ShoppingCart, Trash2, ArrowLeft, Send, CheckCircle2, ChevronRight, Landmark, CreditCard, MessageSquare } from 'lucide-react';

interface CheckoutProps {
  onViewChange: (view: ViewType) => void;
  onSelectProduct: (product: Product) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onViewChange, onSelectProduct }) => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    clearCart 
  } = useCart();

  // Multi-step phase state: 'cart' | 'details' | 'completed'
  const [step, setStep] = useState<'cart' | 'details' | 'completed'>('cart');

  // Customer billing details state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custCity, setCustCity] = useState('');
  const [custAddress, setCustAddress] = useState('');

  // Selected payment parameters
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetail, setPaymentDetail] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const ADMIN_WHATSAPP = '923555107132';

  const selectPaymentOption = (method: string, detail: string) => {
    setPaymentMethod(method);
    setPaymentDetail(detail);
  };

  const handleConfirmOrder = async () => {
    if (!custName || !custPhone || !custAddress || !paymentMethod) {
      setToastMsg('⚠️ Please fill in all required fields and choose a payment method.');
      return;
    }

    // Build invoice payload body
    let itemsInvoice = '';
    cartItems.forEach((item, idx) => {
      itemsInvoice += `${idx + 1}. ${item.product.name} [Size: ${item.selectedSize}, Color: ${item.selectedColor}] x${item.quantity} = Rs. ${(item.product.price * item.quantity).toLocaleString()}\n`;
    });

    const netInvoice = 
      `🛍️ *NEW LUXURY ORDER — Markhor Collections*\n\n` +
      `👤 *CUSTOMER:* ${custName}\n` +
      `📞 *PHONE:* ${custPhone}\n` +
      `📧 *EMAIL:* ${custEmail || 'Not provided'}\n` +
      `📍 *ADDRESS:* ${custAddress}, ${custCity}\n\n` +
      `🛒 *ITEMS SUMMARY:*\n${itemsInvoice}\n` +
      `💰 *SUBTOTAL:* Rs. ${cartSubtotal.toLocaleString()}\n` +
      `💳 *PAYMENT METHOD:* ${paymentMethod} (${paymentDetail})\n\n` +
      `*STATUS:* PENDING DIRECT VERIFICATION CONCIERGE`;

    try {
      // Netlify silent form submission pipeline simulation
      const formEl = document.createElement('form');
      formEl.setAttribute('name', 'orders');
      formEl.setAttribute('method', 'POST');
      formEl.setAttribute('data-netlify', 'true');
      
      const appendHiddenInput = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        formEl.appendChild(input);
      };

      appendHiddenInput('form-name', 'orders');
      appendHiddenInput('customer_name', custName);
      appendHiddenInput('customer_phone', custPhone);
      appendHiddenInput('customer_email', custEmail);
      appendHiddenInput('customer_city', custCity);
      appendHiddenInput('customer_address', custAddress);
      appendHiddenInput('order_summary', itemsInvoice);
      appendHiddenInput('payment_method', paymentMethod);
      appendHiddenInput('total_bill', `Rs. ${cartSubtotal}`);

      document.body.appendChild(formEl);
      
      const formData = new FormData(formEl);
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      document.body.removeChild(formEl);
    } catch (e) {
      console.error('Silent post failed, fallback to whatsapp direct', e);
    }

    // Direct redirection to WhatsApp
    const waLink = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(netInvoice)}`;
    window.open(waLink, '_blank');

    setStep('completed');
  };

  const handleFinishCompletion = () => {
    clearCart();
    onViewChange('home');
  };

  if (step === 'completed') {
    return (
      <div className="bg-[#F7E7CE] text-[#1C1A17] min-h-screen py-16 sm:py-24 flex items-center justify-center px-4 sm:px-6 selection:bg-[#BF953F]/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#FFFFFF] border border-[#E3DDD3] rounded-2xl sm:rounded-3xl p-8 sm:p-12 max-w-lg text-center shadow-lg relative overflow-hidden w-full"
        >
          <div className="absolute top-0 inset-x-0 h-[3px] bg-[#BF953F]" />
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F7E7CE] border border-[#BF953F]/30 flex items-center justify-center text-[#B58A3D] mx-auto mb-6 sm:mb-8">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-[#1C1A17] mb-2 sm:mb-3">Order Commenced</h2>
          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-sans font-bold text-[#B58A3D] uppercase block mb-5 sm:mb-6">WHATSAPP THREAD LAUNCHED</span>
          
          <p className="text-[11px] sm:text-sm text-[#59534E] leading-relaxed font-light mb-8 font-serif italic max-w-sm mx-auto">
            Your billing specifications have been securely archived. We have initialized your direct whatsapp concierge thread to verify transit speeds and sizes.
          </p>

          <button
            onClick={handleFinishCompletion}
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-[#1C1A17] text-[#BF953F] text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all cursor-pointer shadow-md active:scale-95"
          >
            RETURN TO SHOWROOM
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7E7CE] text-[#1C1A17] min-h-screen selection:bg-[#BF953F]/30 antialiased">
      
      {/* HIGH-END VIGNETTE HERO BANNER */}
      <div 
        className="relative min-h-[300px] sm:min-h-[480px] flex items-center justify-center overflow-hidden text-center bg-[#0d0d0d]"
        style={{ 
          backgroundImage: `url('/5logo.jpeg')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Soft dark vignette luxury depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/85" />
        {/* Bottom fade matched exactly to checkout background #F7E7CE */}
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-[#F7E7CE] to-transparent" />
        
        {/* Content Wrapper */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 sm:py-12 mt-10">
          <span className="text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-[#BF953F] font-bold mb-3 sm:mb-4 block drop-shadow-sm">
            MARKHOR CONCIERGE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-3 sm:mb-4 uppercase drop-shadow-md">
            Secure Checkout
          </h1>
          <div className="w-12 sm:w-16 h-[1.5px] bg-[#BF953F] mx-auto mb-3 sm:mb-4" />
          <p className="font-sans text-[#E3DDD3] text-[11px] sm:text-sm max-w-sm sm:max-w-md mx-auto font-light tracking-wide leading-relaxed drop-shadow-sm px-4">
            Review your luxury selections and finalize your secure dispatch.
          </p>
        </div>
      </div>

      {/* Main Checkout Content */}
      <div className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Core Steps indicators */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 h-auto sm:h-10 border-b border-[#E3DDD3] pb-4 overflow-x-auto whitespace-nowrap CustomScrollbar">
            <button 
              onClick={() => {
                if (step === 'details') setStep('cart');
                else onViewChange('shop');
              }} 
              className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] text-[#59534E] hover:text-[#1C1A17] uppercase tracking-[0.2em] cursor-pointer transition-colors font-bold shrink-0"
            >
              <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> BACK
            </button>
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E3DDD3] shrink-0" />
            <span className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold shrink-0 ${step === 'cart' ? 'text-[#B58A3D]' : 'text-[#59534E]'}`}>
              01. Shopping Bag
            </span>
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E3DDD3] shrink-0" />
            <span className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold shrink-0 ${step === 'details' ? 'text-[#B58A3D]' : 'text-[#59534E]'}`}>
              02. Secure Dispatch Checkout
            </span>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Bag screen */
            <div className="text-center py-16 sm:py-24 bg-[#FFFFFF] rounded-2xl border border-[#E3DDD3] max-w-lg mx-auto p-6 sm:p-10 shadow-sm">
              <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-[#E3DDD3] mx-auto mb-5 sm:mb-6" />
              <h3 className="font-serif text-lg sm:text-xl tracking-wide mb-2 sm:mb-3 text-[#1C1A17]">Your shopping bag is empty</h3>
              <p className="text-[11px] sm:text-xs text-[#59534E] font-light mb-6 sm:mb-8 max-w-xs mx-auto">
                Ready to commence your luxury dressing? Discover from our signature and streetwear releases.
              </p>
              <button
                onClick={() => onViewChange('shop')}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-[#1C1A17] text-[#BF953F] text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all cursor-pointer shadow-md active:scale-95"
              >
                SHOP NEW RELEASES
              </button>
            </div>
          ) : (
            /* Dynamic splits transaction floor grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
              
              {/* LEFT: STEP RENDERER */}
              <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
                {step === 'cart' ? (
                  /* STEP 1: SHOPPING BAG ITEMS LIST */
                  <div className="bg-[#FFFFFF] border border-[#E3DDD3] rounded-2xl p-5 sm:p-8 shadow-sm">
                    <h3 className="font-serif text-xl sm:text-2xl tracking-tight text-[#1C1A17] mb-5 sm:mb-6 border-b border-[#E3DDD3] pb-4 sm:pb-5">
                      Your Shopping Bag ({cartItems.length})
                    </h3>

                    <div className="flex flex-col gap-5 sm:gap-6 font-sans">
                      {cartItems.map((item, idx) => (
                        <div 
                          key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-[#E3DDD3] last:border-0 last:pb-0"
                        >
                          <div className="flex gap-4 items-center">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="w-16 h-20 sm:w-20 sm:h-24 object-cover object-top rounded-xl border border-[#E3DDD3] bg-[#F5F5F5] shadow-sm flex-shrink-0"
                            />
                            <div className="text-left">
                              <h4 className="font-serif text-sm sm:text-base text-[#1C1A17] font-semibold hover:text-[#B58A3D] cursor-pointer transition-colors" onClick={() => { onSelectProduct(item.product); onViewChange('product'); }}>
                                {item.product.name}
                              </h4>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-[#B58A3D] font-bold mt-1.5 sm:mt-2">
                                <span className="uppercase bg-[#F7E7CE]/50 px-2 py-0.5 rounded border border-[#E3DDD3]">SIZE: {item.selectedSize}</span>
                                <span className="uppercase bg-[#F7E7CE]/50 px-2 py-0.5 rounded border border-[#E3DDD3]">COLOUR: {item.selectedColor}</span>
                              </div>
                            </div>
                          </div>

                          {/* Increment/Decrement controllers */}
                          <div className="flex flex-row items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                            <div className="flex items-center border border-[#E3DDD3] rounded-lg overflow-hidden bg-[#F5F5F5] h-9 sm:h-10 w-24 sm:w-28">
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                                className="flex-1 text-center font-bold hover:bg-[#E3DDD3] text-[#59534E] cursor-pointer h-full transition-colors"
                              >
                                -
                              </button>
                              <span className="flex-1 text-center font-mono text-[11px] sm:text-xs text-[#1C1A17] font-bold bg-[#FFFFFF] h-full flex items-center justify-center border-x border-[#E3DDD3]">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                className="flex-1 text-center font-bold hover:bg-[#E3DDD3] text-[#59534E] cursor-pointer h-full transition-colors"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right flex items-center gap-3 sm:gap-4">
                              <span className="text-[11px] sm:text-sm font-sans text-[#1C1A17] tracking-wide font-bold min-w-20 sm:min-w-24 text-right">
                                Rs. {(item.product.price * item.quantity).toLocaleString()}
                              </span>
                              <button 
                                onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#E3DDD3] hover:border-red-500 hover:bg-red-50 flex items-center justify-center text-[#59534E] hover:text-red-500 transition-all cursor-pointer bg-[#FFFFFF]"
                              >
                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 sm:mt-8 flex justify-end">
                      <button
                        onClick={() => setStep('details')}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#1C1A17] text-[#BF953F] text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-md"
                      >
                        SECURE TO CHECKOUT <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#BF953F]" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* STEP 2: ADDRESS SCHEDULING FORM + PAYMENT PILES */
                  <div className="flex flex-col gap-6 sm:gap-8">
                    
                    {/* Address pile */}
                    <div className="bg-[#FFFFFF] border border-[#E3DDD3] rounded-2xl p-5 sm:p-8 shadow-sm font-sans">
                      <span className="text-[8px] sm:text-[9px] tracking-[0.25em] text-[#B58A3D] font-bold uppercase mb-1.5 sm:mb-2 block">CONCIERGE SHIELD</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-light tracking-wide text-[#1C1A17] mb-5 sm:mb-6 border-b border-[#E3DDD3] pb-4 sm:pb-5">
                        Delivery dispatch detail
                      </h3>

                      <div className="flex flex-col gap-4 sm:gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="flex flex-col gap-1.5 sm:gap-2">
                            <label className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#59534E] uppercase">
                              Full Name <span className="text-[#B58A3D] font-bold">*</span>
                            </label>
                            <input 
                              type="text" 
                              placeholder="Your structural name"
                              value={custName}
                              onChange={(e) => setCustName(e.target.value)}
                              className="w-full text-[11px] sm:text-xs text-[#1C1A17] bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 sm:py-3.5 px-3 sm:px-4 outline-none focus:bg-[#FFFFFF] focus:border-[#B58A3D] transition-all"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 sm:gap-2">
                            <label className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#59534E] uppercase">
                              Phone Number <span className="text-[#B58A3D] font-bold">*</span>
                            </label>
                            <input 
                              type="tel" 
                              placeholder="+92 3XX XXXXXXX"
                              value={custPhone}
                              onChange={(e) => setCustPhone(e.target.value)}
                              className="w-full text-[11px] sm:text-xs text-[#1C1A17] bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 sm:py-3.5 px-3 sm:px-4 outline-none focus:bg-[#FFFFFF] focus:border-[#B58A3D] transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="flex flex-col gap-1.5 sm:gap-2">
                            <label className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#59534E] uppercase">
                              Email address
                            </label>
                            <input 
                              type="email" 
                              placeholder="john@example.com (optional)"
                              value={custEmail}
                              onChange={(e) => setCustEmail(e.target.value)}
                              className="w-full text-[11px] sm:text-xs text-[#1C1A17] bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 sm:py-3.5 px-3 sm:px-4 outline-none focus:bg-[#FFFFFF] focus:border-[#B58A3D] transition-all"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 sm:gap-2">
                            <label className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#59534E] uppercase">
                              City
                            </label>
                            <input 
                              type="text" 
                              placeholder="Your metropolis..."
                              value={custCity}
                              onChange={(e) => setCustCity(e.target.value)}
                              className="w-full text-[11px] sm:text-xs text-[#1C1A17] bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 sm:py-3.5 px-3 sm:px-4 outline-none focus:bg-[#FFFFFF] focus:border-[#B58A3D] transition-all"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 sm:gap-2">
                          <label className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#59534E] uppercase">
                            Complete Courier Address <span className="text-[#B58A3D] font-bold">*</span>
                          </label>
                          <input 
                            type="text" 
                            placeholder="We delivering standard to street grids, office panels, or home corridors..."
                            value={custAddress}
                            onChange={(e) => setCustAddress(e.target.value)}
                            className="w-full text-[11px] sm:text-xs text-[#1C1A17] bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 sm:py-3.5 px-3 sm:px-4 outline-none focus:bg-[#FFFFFF] focus:border-[#B58A3D] transition-all"
                          />
                        </div>

                      </div>
                    </div>

                    {/* Payment selection module */}
                    <div className="bg-[#FFFFFF] border border-[#E3DDD3] rounded-2xl p-5 sm:p-8 shadow-sm font-sans">
                      <span className="text-[8px] sm:text-[9px] tracking-[0.25em] text-[#B58A3D] font-bold uppercase mb-1.5 sm:mb-2 block">SECURED TRANSIT</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-light tracking-wide text-[#1C1A17] mb-5 sm:mb-6 border-b border-[#E3DDD3] pb-4 sm:pb-5">
                        Select Payment method
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <button
                          onClick={() => selectPaymentOption('Easypaisa', 'Account: 0355-5107132')}
                          className={`p-4 sm:p-5 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                            paymentMethod === 'Easypaisa'
                              ? 'border-[#B58A3D] bg-[#F7E7CE]/50 shadow-sm'
                              : 'border-[#E3DDD3] bg-[#FFFFFF] hover:border-[#B58A3D]/50'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#1C1A17]">EASYPAISA</span>
                            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B58A3D]" />
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-[#59534E] font-light">Interactive mobile transits via Easypaisa</span>
                        </button>

                        <button
                          onClick={() => selectPaymentOption('JazzCash', 'Account: 0355-5107132')}
                          className={`p-4 sm:p-5 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                            paymentMethod === 'JazzCash'
                              ? 'border-[#B58A3D] bg-[#F7E7CE]/50 shadow-sm'
                              : 'border-[#E3DDD3] bg-[#FFFFFF] hover:border-[#B58A3D]/50'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#1C1A17]">JAZZCASH</span>
                            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B58A3D]" />
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-[#59534E] font-light">Direct phone check out via JazzCash</span>
                        </button>

                        <button
                          onClick={() => selectPaymentOption('Bank Account 1 (HBL)', 'Account No: XXXXXXXXXX')}
                          className={`p-4 sm:p-5 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                            paymentMethod === 'Bank Account 1 (HBL)'
                              ? 'border-[#B58A3D] bg-[#F7E7CE]/50 shadow-sm'
                              : 'border-[#E3DDD3] bg-[#FFFFFF] hover:border-[#B58A3D]/50'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#1C1A17]">HBL BANK TRANSFER</span>
                            <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B58A3D]" />
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-[#59534E] font-light">Direct HBL digital banking transfer</span>
                        </button>

                        <button
                          onClick={() => selectPaymentOption('Bank Account 2 (Meezan)', 'Account No: XXXXXXXXXX')}
                          className={`p-4 sm:p-5 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                            paymentMethod === 'Bank Account 2 (Meezan)'
                              ? 'border-[#B58A3D] bg-[#F7E7CE]/50 shadow-sm'
                              : 'border-[#E3DDD3] bg-[#FFFFFF] hover:border-[#B58A3D]/50'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#1C1A17]">MEEZAN BANK</span>
                            <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B58A3D]" />
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-[#59534E] font-light">Sleek Islamic banking transaction</span>
                        </button>
                      </div>

                      {paymentMethod && (
                        <div className="bg-[#F7E7CE]/80 border border-[#B58A3D]/30 rounded-xl p-3.5 sm:p-4 mt-5 sm:mt-6 text-[10px] sm:text-[11px] text-[#1C1A17] tracking-wide flex items-center gap-2.5 sm:gap-3 font-medium">
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#B58A3D] flex-shrink-0" />
                          <div>
                            <strong>{paymentMethod} Selected:</strong> {paymentDetail}. Transit details will be compiled upon verification on WhatsApp.
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: RECEPT BILL SUMMARY */}
              <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E3DDD3] rounded-2xl p-5 sm:p-8 shadow-sm relative lg:sticky lg:top-28 font-sans w-full">
                <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-bold text-[#59534E] uppercase block mb-1.5 sm:mb-2">RECEIPT SUMMARY</span>
                <h3 className="font-serif text-lg sm:text-xl text-[#1C1A17] mb-5 sm:mb-6 border-b border-[#E3DDD3] pb-3 sm:pb-4">
                  Total Bill
                </h3>

                <div className="flex flex-col gap-3.5 sm:gap-4 text-[11px] sm:text-xs font-normal tracking-wide mb-5 sm:mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#59534E]">Transit Courier Post</span>
                    <span className="font-bold text-green-600">FREE COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#59534E]">Subtotal bill</span>
                    <span className="font-bold text-[#1C1A17]">Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pb-3.5 sm:pb-4 border-b border-[#E3DDD3]">
                    <span className="text-[#59534E]">Metropolitan taxes</span>
                    <span className="font-bold text-[#59534E]">Rs. 0</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base font-semibold text-[#1C1A17] pt-1">
                    <span>Grand Total</span>
                    <span className="font-sans font-bold text-lg sm:text-xl text-[#B58A3D]">Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                </div>

                {step === 'details' && (
                  <div className="flex flex-col gap-3 sm:gap-4 mt-2">
                    <button
                      onClick={handleConfirmOrder}
                      className="w-full py-3.5 sm:py-4 rounded-xl bg-[#25D366] text-white text-[10px] sm:text-[11px] font-bold tracking-[0.15em] sm:tracking-widest uppercase transition-all hover:bg-[#20bd5a] active:scale-95 cursor-pointer shadow-[0_4px_15px_rgba(37,211,102,0.25)] flex items-center justify-center gap-2 border-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> CONFIRM &amp; TEXT INVOICE
                    </button>
                    {toastMsg && (
                      <div className="text-[9px] sm:text-[10px] text-center text-red-600 bg-red-50 border border-red-200 rounded-lg py-2.5 px-2 font-bold tracking-wider mt-1">
                        {toastMsg}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};