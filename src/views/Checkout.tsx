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

  // Multi-step phase state: 'cart' | 'shipping' | 'payment' | 'completed'
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
      <div className="bg-[#FAF9F6] text-[#111111] min-h-screen py-24 flex items-center justify-center px-4 animate-fade-in">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-neutral-100 rounded-2xl p-12 max-w-lg text-center shadow-xl"
        >
          <div className="w-16 h-16 rounded-full bg-[#BF953F]/10 border border-[#BF953F]/30 flex items-center justify-center text-[#BF953F] mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <h2 className="font-serif text-3xl font-light tracking-tight text-[#111111] mb-2">Order Commenced</h2>
          <span className="text-[10px] tracking-[0.2em] font-sans font-bold text-[#BF953F] uppercase block mb-6">WHATSAPP THREAD LAUNCHED</span>
          
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light mb-8 font-serif italic max-w-sm mx-auto">
            Your billing specifications have been securely archived. We have initialized your direct whatsapp concierge thread to verify transit speeds and sizes.
          </p>

          <button
            onClick={handleFinishCompletion}
            className="px-8 py-3.5 rounded bg-[#111111] text-[#FCF6BA] text-xs font-bold tracking-widest uppercase hover:bg-black transition-all cursor-pointer shadow-md"
          >
            RETURN TO SHOWROOM
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] text-[#111111] min-h-screen">
      
      {/* HIGH-END VIGNETTE HERO BANNER (Full Image & Better Height) */}
      <div 
        className="relative min-h-[350px] sm:min-h-[480px] flex items-center justify-center border-b border-[#E5DCD3] overflow-hidden text-center bg-[#0d0d0d]"
        style={{ 
          backgroundImage: `url('/5logo.jpeg')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Soft dark vignette luxury depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/85" />
        {/* Bottom fade matched exactly to checkout background #FAF9F6 */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAF9F6] to-transparent" />
        
        {/* Content Wrapper */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          <span className="text-[10px] tracking-[0.45em] uppercase text-[#FAD5A5] font-bold mb-3 block drop-shadow-sm">
            MARKHOR CONCIERGE
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-white mb-4 uppercase drop-shadow-md">
            Secure Checkout
          </h1>
          <div className="w-16 h-[1.5px] bg-[#FAD5A5] mx-auto mb-4" />
          <p className="font-sans text-neutral-300 text-sm sm:text-base max-w-md mx-auto font-light tracking-wide leading-relaxed drop-shadow-sm">
            Review your luxury selections and finalize your secure dispatch.
          </p>
        </div>
      </div>

      {/* Main Checkout Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Core Steps indicators */}
          <div className="flex items-center gap-2 mb-10 h-10 border-b border-black/5 pb-4">
            <button 
              onClick={() => {
                if (step === 'details') setStep('cart');
                else onViewChange('shop');
              }} 
              className="flex items-center gap-1.5 text-[10px] sm:text-xs text-neutral-400 hover:text-[#111111] uppercase tracking-widest cursor-pointer transition-colors font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> BACK
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#111111]/10" />
            <span className={`text-[10px] sm:text-xs tracking-widest uppercase font-bold ${step === 'cart' ? 'text-[#BF953F]' : 'text-neutral-400'}`}>
              01. Shopping Bag
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#111111]/10" />
            <span className={`text-[10px] sm:text-xs tracking-widest uppercase font-bold ${step === 'details' ? 'text-[#BF953F]' : 'text-neutral-400'}`}>
              02. Secure Dispatch Checkout
            </span>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Bag screen */
            <div className="text-center py-24 bg-white rounded-2xl border border-neutral-100 max-w-lg mx-auto p-8 shadow-sm">
              <ShoppingCart className="w-12 h-12 text-neutral-300 mx-auto mb-6" />
              <h3 className="font-serif text-xl tracking-wide mb-2 text-[#111111]">Your shopping bag is empty</h3>
              <p className="text-xs text-neutral-400 font-light mb-8 max-w-xs mx-auto">
                Ready to commence your luxury dressing? Discover from our signature and streetwear releases.
              </p>
              <button
                onClick={() => onViewChange('shop')}
                className="px-8 py-3.5 rounded bg-[#111111] text-[#FCF6BA] text-xs font-bold tracking-widest uppercase hover:bg-black transition-all cursor-pointer"
              >
                SHOP NEW RELEASES
              </button>
            </div>
          ) : (
            /* Dynamic splits transaction floor grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* LEFT: STEP RENDERER */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                {step === 'cart' ? (
                  /* STEP 1: SHOPPING BAG ITEMS LIST */
                  <div className="bg-white border border-[#111111]/5 rounded-xl p-6 sm:p-8 shadow-sm">
                    <h3 className="font-serif text-xl tracking-tight text-[#111111] mb-6 border-b border-neutral-100 pb-4">
                      Your Shopping Bag ({cartItems.length})
                    </h3>

                    <div className="flex flex-col gap-6 font-sans">
                      {cartItems.map((item, idx) => (
                        <div 
                          key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 last:border-0 last:pb-0"
                        >
                          <div className="flex gap-4 items-center">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="w-16 h-20 object-cover object-top rounded border border-neutral-200/50 shadow-sm flex-shrink-0"
                            />
                            <div className="text-left">
                              <h4 className="font-serif text-sm text-[#111111] font-normal hover:text-[#BF953F] cursor-pointer" onClick={() => { onSelectProduct(item.product); onViewChange('product'); }}>
                                {item.product.name}
                              </h4>
                              <div className="flex gap-2 text-[10px] text-[#BF953F] font-bold mt-1">
                                <span className="uppercase">SIZE: {item.selectedSize}</span>
                                <span>·</span>
                                <span className="uppercase">COLOUR: {item.selectedColor}</span>
                              </div>
                            </div>
                          </div>

                          {/* Increment/Decrement controllers */}
                          <div className="flex items-center justify-between sm:justify-end gap-6">
                            <div className="flex items-center border border-neutral-200 rounded overflow-hidden bg-[#FAF9F6] h-10 w-28">
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                                className="flex-1 text-center font-bold hover:bg-neutral-100 cursor-pointer h-full"
                              >
                                -
                              </button>
                              <span className="flex-1 text-center font-mono text-xs text-[#BF953F] font-bold">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                className="flex-1 text-center font-bold hover:bg-neutral-100 cursor-pointer h-full"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right flex items-center gap-4">
                              <span className="text-sm font-sans text-[#111111] tracking-wide font-bold min-w-24">
                                Rs. {(item.product.price * item.quantity).toLocaleString()}
                              </span>
                              <button 
                                onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                                className="w-8 h-8 rounded-full border border-neutral-200 hover:border-red-500/50 hover:bg-red-500/5 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => setStep('details')}
                        className="px-8 py-3.5 rounded bg-[#111111] text-[#FCF6BA] text-xs font-bold tracking-widest uppercase hover:bg-black transition-all cursor-pointer flex items-center gap-2"
                      >
                        SECURE TO CHECKOUT <ChevronRight className="w-4 h-4 text-[#C9A84C]" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* STEP 2: ADDRESS SCHEDULING FORM + PAYMENT PILES */
                  <div className="flex flex-col gap-6">
                    
                    {/* Address pile */}
                    <div className="bg-white border border-[#111111]/5 rounded-xl p-8 shadow-sm font-sans">
                      <span className="text-[10px] tracking-[0.25em] text-[#BF953F] font-bold uppercase mb-2 block">CONCIERGE SHIELD</span>
                      <h3 className="font-serif text-xl font-light tracking-wide text-[#111111] mb-6 border-b border-neutral-100 pb-4">
                        Delivery dispatch detail
                      </h3>

                      <div className="flex flex-col gap-6">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                              Full Name <span className="text-[#BF953F] font-bold">*</span>
                            </label>
                            <input 
                              type="text" 
                              placeholder="Your structural name"
                              value={custName}
                              onChange={(e) => setCustName(e.target.value)}
                              className="w-full text-xs text-[#111111] bg-[#FAF9F6]/50 border border-neutral-200 rounded-md py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] transition-all"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                              Phone Number <span className="text-[#BF953F] font-bold">*</span>
                            </label>
                            <input 
                              type="tel" 
                              placeholder="+92 3XX XXXXXXX"
                              value={custPhone}
                              onChange={(e) => setCustPhone(e.target.value)}
                              className="w-full text-xs text-[#111111] bg-[#FAF9F6]/50 border border-neutral-200 rounded-md py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                              Email address
                            </label>
                            <input 
                              type="email" 
                              placeholder="john@example.com (optional)"
                              value={custEmail}
                              onChange={(e) => setCustEmail(e.target.value)}
                              className="w-full text-xs text-[#111111] bg-[#FAF9F6]/50 border border-neutral-200 rounded-md py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] transition-all"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                              City
                            </label>
                            <input 
                              type="text" 
                              placeholder="Your metropolis..."
                              value={custCity}
                              onChange={(e) => setCustCity(e.target.value)}
                              className="w-full text-xs text-[#111111] bg-[#FAF9F6]/50 border border-neutral-200 rounded-md py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] transition-all"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">
                            Complete Courier Address <span className="text-[#BF953F] font-bold">*</span>
                          </label>
                          <input 
                            type="text" 
                            placeholder="We delivering standard to street grids, office panels, or home corridors..."
                            value={custAddress}
                            onChange={(e) => setCustAddress(e.target.value)}
                            className="w-full text-xs text-[#111111] bg-[#FAF9F6]/50 border border-neutral-200 rounded-md py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] transition-all"
                          />
                        </div>

                      </div>
                    </div>

                    {/* Payment selection module */}
                    <div className="bg-white border border-[#111111]/5 rounded-xl p-8 shadow-sm font-sans">
                      <span className="text-[10px] tracking-[0.25em] text-[#BF953F] font-bold uppercase mb-2 block">SECURED TRANSIT</span>
                      <h3 className="font-serif text-xl font-light tracking-wide text-[#111111] mb-6 border-b border-neutral-100 pb-4">
                        Select Payment method
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => selectPaymentOption('Easypaisa', 'Account: 0355-5107132')}
                          className={`p-5 rounded-lg border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                            paymentMethod === 'Easypaisa'
                              ? 'border-[#BF953F] bg-[#BF953F]/5 shadow-sm'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold tracking-widest text-[#111111]">EASYPAISA</span>
                            <CreditCard className="w-4 h-4 text-[#BF953F]" />
                          </div>
                          <span className="text-[10px] text-neutral-400 font-light">Interactive mobile transits via Easypaisa</span>
                        </button>

                        <button
                          onClick={() => selectPaymentOption('JazzCash', 'Account: 0355-5107132')}
                          className={`p-5 rounded-lg border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                            paymentMethod === 'JazzCash'
                              ? 'border-[#BF953F] bg-[#BF953F]/5 shadow-sm'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold tracking-widest text-[#111111]">JAZZCASH</span>
                            <CreditCard className="w-4 h-4 text-[#BF953F]" />
                          </div>
                          <span className="text-[10px] text-neutral-400 font-light">Direct phone check out via JazzCash</span>
                        </button>

                        <button
                          onClick={() => selectPaymentOption('Bank Account 1 (HBL)', 'Account No: XXXXXXXXXX')}
                          className={`p-5 rounded-lg border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                            paymentMethod === 'Bank Account 1 (HBL)'
                              ? 'border-[#BF953F] bg-[#BF953F]/5 shadow-sm'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold tracking-widest text-[#111111]">HBL BANK TRANSFER</span>
                            <Landmark className="w-4 h-4 text-[#BF953F]" />
                          </div>
                          <span className="text-[10px] text-neutral-400 font-light">Direct HBL digital banking transfer</span>
                        </button>

                        <button
                          onClick={() => selectPaymentOption('Bank Account 2 (Meezan)', 'Account No: XXXXXXXXXX')}
                          className={`p-5 rounded-lg border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                            paymentMethod === 'Bank Account 2 (Meezan)'
                              ? 'border-[#BF953F] bg-[#BF953F]/5 shadow-sm'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold tracking-widest text-[#111111]">MEEZAN BANK</span>
                            <Landmark className="w-4 h-4 text-[#BF953F]" />
                          </div>
                          <span className="text-[10px] text-neutral-400 font-light">Sleek Islamic banking transaction</span>
                        </button>
                      </div>

                      {paymentMethod && (
                        <div className="bg-[#BF953F]/10 border border-[#BF953F]/25 rounded-md p-4 mt-6 text-xs text-[#111111] tracking-wide flex items-center gap-3 font-medium">
                          <CheckCircle2 className="w-5 h-5 text-[#BF953F] flex-shrink-0" />
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
              <div className="lg:col-span-4 bg-white border border-[#111111]/5 rounded-xl p-6 shadow-md relative sticky top-24 font-sans">
                <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-400 uppercase block mb-2">RECEIPT SUMMARY</span>
                <h3 className="font-serif text-lg text-[#111111] mb-6 border-b border-neutral-100 pb-4">
                  Total Bill
                </h3>

                <div className="flex flex-col gap-4 text-xs font-normal tracking-wide mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Transit Courier Post</span>
                    <span className="font-bold text-green-600">FREE COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Subtotal bill</span>
                    <span className="font-bold text-[#111111]">Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pb-4 border-b border-neutral-100">
                    <span className="text-neutral-400">Metropolitan taxes</span>
                    <span className="font-bold text-neutral-400">Rs. 0</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold text-[#111111]">
                    <span>Grand Total</span>
                    <span className="font-sans font-bold text-xl text-[#BF953F]">Rs. {cartSubtotal.toLocaleString()}</span>
                  </div>
                </div>

                {step === 'details' && (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleConfirmOrder}
                      className="w-full py-4 rounded bg-[#25D366] text-white text-xs font-bold tracking-widest uppercase transition-transform hover:scale-103 active:scale-95 cursor-pointer shadow-[0_4px_15px_rgba(37,211,102,0.25)] flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> CONFIRM &amp; TEXT INVOICE
                    </button>
                    {toastMsg && (
                      <div className="text-[10px] text-center text-red-500 font-bold tracking-wider pt-2">
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