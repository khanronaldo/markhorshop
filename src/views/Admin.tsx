import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { Product, DbVariant } from '../types';
import { generateUUID } from '../lib/supabase';
import { 
  Plus, Trash2, Edit3, LogOut, Sparkles, DollarSign, Tag, Info, ListFilter, Check, X, ShieldAlert,
  Upload, Eye, ShoppingCart, HelpCircle, Layers, Activity, AlertTriangle, ChevronRight, Truck, Info as InfoIcon
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { 
    products, 
    adminToken, 
    adminUser,
    loginAdmin, 
    logoutAdmin, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    uploadFile
  } = useProducts();

  // Authentication Credentials States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginMsg, setLoginMsg] = useState('');

  // Dashboard Workspace Operations States
  const [actionLoading, setActionLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Editing and Adding Forms States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'editor' | 'overview'>('overview');
  const [previewMode, setPreviewMode] = useState<'card' | 'details' | 'none'>('card');

  // Form primary descriptors
  const [formData, setFormData] = useState<Partial<Product>>({
    id: '',
    name: '',
    category: 'men',
    subcategory: 'essentials',
    price: 3000,
    image: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['black', 'white'],
    badge: 'New',
    description: '',
    shipping: 'Free Luxury Shipping (2-3 Business Days)',
    specifications: {
      'Composition': '100% Combed Slub Cotton',
      'Fit': 'Signature Tailored / Structured Contour',
      'Origin': 'Made in Pakistan'
    },
    gallery: []
  });

  // Unique Temporary Variants Array (Workbench)
  const [variantsList, setVariantsList] = useState<DbVariant[]>([]);

  // Variant Add Sub-form states
  const [tempVariant, setTempVariant] = useState<Partial<DbVariant>>({
    color: 'black',
    color_code: '#000000',
    size: 'M',
    stock: 50,
    price: undefined,
    main_image: '',
    gallery_images: []
  });

  // Sync state variables on editing item triggering
  const handleEditClick = (p: Product) => {
    setEditingId(p.id);
    setFormData({ ...p });
    setVariantsList(p.variants || []);
    setShowAddForm(true);
    setActiveWorkspaceTab('editor');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Reset form to catalog standards
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      category: 'men',
      subcategory: 'essentials',
      price: 3000,
      image: '',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [],
      badge: '',
      description: '',
      shipping: 'Free Luxury Shipping (2-3 Business Days)',
      specifications: {
        'Composition': '100% Egyptian Cotton twill',
        'Fit': 'Signature Modern Tailored',
        'Origin': 'Made in Pakistan'
      },
      gallery: []
    });
    setVariantsList([]);
    setEditingId(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginMsg('');
    if (!email || !password) {
      setLoginError('⚠️ Please supply both administration email & access passcode.');
      return;
    }

    const res = await loginAdmin(email, password, isSignUp);
    if (!res.success) {
      setLoginError(res.message);
    } else {
      setLoginMsg(res.message);
      if (!isSignUp) {
        setEmail('');
        setPassword('');
      }
    }
  };

  // Master file uploader triggering Supabase storage public buckets
  const handleMainUploader = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setFeedbackMsg('Uploading primary photography asset to secure cloud storage...');
      const url = await uploadFile(e.target.files[0]);
      if (url) {
        setFormData(prev => ({ ...prev, image: url }));
        setFeedbackMsg('✓ Primary photo successfully committed to storage.');
      } else {
        setFeedbackMsg('❌ Storage upload failed. Please ensure your bucket is public and connected.');
      }
      setIsUploading(false);
    }
  };

  const handleGalleryUploader = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setFeedbackMsg('Uploading batch photography files to secure cloud assets...');
      const uploadedUrls: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const url = await uploadFile(e.target.files[i]);
        if (url) uploadedUrls.push(url);
      }
      const currentGallery = formData.gallery || [];
      setFormData(prev => ({ ...prev, gallery: [...currentGallery, ...uploadedUrls] }));
      setFeedbackMsg('✓ Gallery photographs uploaded successfully.');
      setIsUploading(false);
    }
  };

  // Sub-uploader for custom color variant images
  const handleVariantUploader = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const url = await uploadFile(e.target.files[0]);
      if (url) {
        setTempVariant(prev => ({ ...prev, main_image: url }));
      }
      setIsUploading(false);
    }
  };

  // Variant assembly append triggers
  const appendVariantToWorkbench = () => {
    if (!tempVariant.color) {
      alert("Please give a distinct color label.");
      return;
    }
    const colorVal = tempVariant.color.trim();
    const colorCode = tempVariant.color_code || '#c4a96e';
    const sizeVal = tempVariant.size || 'M';
    const mainImg = tempVariant.main_image || formData.image || '';

    const cleanVar: DbVariant = {
      id: Math.random().toString(36).substring(2, 9),
      product_id: formData.id || 'draft-product-id',
      color: colorVal,
      color_code: colorCode,
      size: sizeVal,
      stock: Number(tempVariant.stock) || 30,
      price: tempVariant.price ? Number(tempVariant.price) : null,
      main_image: mainImg,
      gallery_images: tempVariant.gallery_images || []
    };

    setVariantsList(prev => [...prev, cleanVar]);

    // Update global colors array in form if needed
    const existingColors = formData.colors || [];
    if (!existingColors.includes(colorVal.toLowerCase())) {
      setFormData(prev => ({ ...prev, colors: [...existingColors, colorVal.toLowerCase()] }));
    }

    // Reset subform
    setTempVariant({
      color: colorVal,
      color_code: colorCode,
      size: 'M',
      stock: 50,
      price: undefined,
      main_image: '',
      gallery_images: []
    });
  };

  const removeVariantFromWorkbench = (index: number) => {
    setVariantsList(prev => prev.filter((_, i) => i !== index));
  };

  // Master product save trigger
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalProductId = editingId ? formData.id : (formData.id || generateUUID());

    if (!finalProductId || !formData.name || !formData.price || !formData.image) {
      setFeedbackMsg('⚠️ Please fill in all required primary fields (Name, Price, and Image).');
      return;
    }

    setActionLoading(true);
    setFeedbackMsg('');

    // Ensure colors matches color variants built
    const distinctColors = Array.from(new Set(variantsList.map(v => v.color.toLowerCase())));
    const finalColors = distinctColors.length > 0 ? distinctColors : (formData.colors || ['black']);

    const finalVariants = variantsList.map(v => ({
      ...v,
      product_id: finalProductId
    }));

    const productPayload: Product = {
      id: finalProductId.trim(),
      name: formData.name.trim(),
      category: formData.category as 'men' | 'women' | 'kids',
      subcategory: formData.subcategory as 'essentials' | 'streetwear' | 'accessories',
      price: Number(formData.price),
      image: formData.image,
      sizes: formData.sizes && formData.sizes.length > 0 ? formData.sizes : ['S', 'M', 'L', 'XL'],
      colors: finalColors,
      badge: formData.badge || undefined,
      description: formData.description || 'Premium attire piece from Markhor Collections flagship workshop.',
      shipping: formData.shipping || 'Free Luxury Shipping (2-3 Business Days)',
      specifications: formData.specifications || {
        'Composition': '100% Cotton',
        'Origin': 'Made in Pakistan'
      },
      gallery: formData.gallery || []
    };

    if (editingId) {
      const res = await updateProduct(editingId, productPayload, finalVariants);
      if (res.success) {
        setFeedbackMsg('✓ Product updated on interactive servers successfully!');
        resetForm();
        setShowAddForm(false);
        setActiveWorkspaceTab('overview');
      } else {
        setFeedbackMsg(`❌ Save failed: ${res.message}`);
      }
    } else {
      const res = await addProduct(productPayload, finalVariants);
      if (res.success) {
        setFeedbackMsg('✓ New product successfully registered and live on catalogs!');
        resetForm();
        setShowAddForm(false);
        setActiveWorkspaceTab('overview');
      } else {
        setFeedbackMsg(`❌ Save failed: ${res.message}`);
      }
    }
    setActionLoading(false);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('⚠️ Are you sure you want to completely purge this luxury garment from active catalogs?')) {
      setActionLoading(true);
      const res = await deleteProduct(id);
      if (res.success) {
        setFeedbackMsg('✓ Product successfully wiped out from database.');
      } else {
        setFeedbackMsg(`❌ Deletion failed: ${res.message}`);
      }
      setActionLoading(false);
    }
  };

  const toggleSizeSelection = (size: string) => {
    const currents = formData.sizes || [];
    if (currents.includes(size)) {
      setFormData({ ...formData, sizes: currents.filter(s => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...currents, size] });
    }
  };

  // Safe dashboard statistics
  const totalStockCount = products.reduce((acc, p) => acc + (p.stock || 50), 0) + variantsList.reduce((acc, v) => acc + v.stock, 0);
  const outOfStockItems = products.filter(p => (p.stock || 0) <= 0 && (!p.variants || p.variants.length === 0));
  const lowStockAlerts = products.filter(p => {
    if (p.variants && p.variants.length > 0) {
      return p.variants.some(v => v.stock < 5);
    }
    return (p.stock || 50) < 10;
  });

  // SECURE AUTH CONTROLLERS GATES
  if (!adminToken) {
    return (
      <div className="bg-[#FAF9F6] text-[#111111] min-h-[90vh] flex items-center justify-center px-4 py-20">
        <div className="bg-white border border-[#111111]/5 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
          {/* Accent Gold Stripe */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C]" />
          
          <div className="text-center mb-8 mt-4">
            <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-[#BF953F] uppercase block mb-2">
              MARKHOR ATELIER CONTROL PANEL
            </span>
            <h2 className="font-serif text-3xl font-light text-[#111111] tracking-tight">
              Owner Desk Login
            </h2>
            <p className="text-[11px] text-neutral-400 font-serif italic max-w-[280px] mx-auto mt-2">
              Secure authentication via Supabase Auth services to write catalog overrides.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 font-sans text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                Administration Email
              </label>
              <input 
                type="email" 
                placeholder="owner@markhordesks.pk" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 rounded-md py-3 px-4 outline-none focus:bg-white focus:border-[#BF953F] focus:ring-1 focus:ring-[#BF953F]/10 transition-all font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                Owner Access Passcode
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 rounded-md py-3 px-4 outline-none focus:bg-white focus:border-[#BF953F] focus:ring-1 focus:ring-[#BF953F]/10 transition-all font-mono"
              />
            </div>

            {loginError && (
              <div className="text-[11px] text-red-600 bg-red-50 rounded-lg p-3 text-center border border-red-200/45">
                {loginError}
              </div>
            )}

            {loginMsg && (
              <div className="text-[11px] text-emerald-600 bg-emerald-50 rounded-lg p-3 text-center border border-emerald-200/45">
                {loginMsg}
              </div>
            )}

            <button
              type="submit"
              className="py-3 mt-2 rounded bg-[#111111] text-[#FCF6BA] text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all cursor-pointer shadow-md"
            >
              {isSignUp ? 'REGISTER DIRECT OWNER ACCOUNT' : 'AUTHENTICATE SYSTEM'}
            </button>

            <div className="text-center mt-3 border-t border-neutral-100 pt-4">
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-[#BF953F] underline font-medium hover:text-black cursor-pointer bg-transparent border-0"
              >
                {isSignUp ? "Already have credentials? Sign In" : "Need to register custom credentials? Sign Up"}
              </button>
            </div>

            {/* Informative credentials card */}
            <div className="bg-[#FAF9F6] border border-neutral-200/50 rounded-lg p-3.5 mt-2 text-[10px] text-neutral-500 leading-relaxed font-light flex gap-2">
              <ShieldAlert className="w-5 h-5 text-[#BF953F] flex-shrink-0" />
              <div>
                <strong>Sandbox Credentials:</strong> The database permits direct auth code testing using passcodes: <code className="bg-neutral-200 px-1 py-0.5 rounded text-black font-semibold">markhor2026</code>, <code className="bg-neutral-200 px-1 py-0.5 rounded text-black font-semibold">admin123</code>.
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ACTIVE LOGGED WORKSPACE BOARD
  return (
    <div className="bg-[#FAF9F6] text-[#111111] min-h-screen">
      
      {/* HEADER CONTROLS BANNER */}
      <header className="bg-white border-b border-neutral-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-left">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#BF953F] font-bold mb-1.5 block">
              SECURE SUPABASE CONSOLE DESK
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#111111]">
              Owner Atelier Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-serif italic mt-1">
              Active Session: <strong className="text-neutral-600 font-bold">{adminUser?.email || 'System Owner'}</strong>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { 
                setShowAddForm(!showAddForm); 
                resetForm(); 
                setActiveWorkspaceTab(showAddForm ? 'overview' : 'editor');
              }}
              className="px-5 py-3 rounded bg-[#111111] text-[#FCF6BA] text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              {showAddForm ? <X className="w-4 h-4 text-red-500" /> : <Plus className="w-4 h-4 text-[#C9A84C]" />}
              {showAddForm ? 'CANCEL WORKBENCH' : 'ADD NEW GARMENT'}
            </button>

            <button
              onClick={logoutAdmin}
              className="px-5 py-3 rounded bg-[#FAF9F6] text-neutral-400 text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-100 hover:text-[#111111] border border-neutral-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> LOCK SESSION
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD TAB NAVIGATION BAR */}
      <div className="bg-white border-b border-neutral-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
          <button
            onClick={() => setActiveWorkspaceTab('overview')}
            className={`py-4 text-xs font-bold tracking-widest uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeWorkspaceTab === 'overview' ? 'border-[#BF953F] text-[#BF953F]' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            <Activity className="w-4 h-4" /> INVENTORY STRATUM
          </button>
          <button
            onClick={() => { setShowAddForm(true); setActiveWorkspaceTab('editor'); }}
            className={`py-4 text-xs font-bold tracking-widest uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeWorkspaceTab === 'editor' ? 'border-[#BF953F] text-[#BF953F]' : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            <Layers className="w-4 h-4" /> GARMENT INTEGRATION STUDIO
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dynamic global feedback */}
        {feedbackMsg && (
          <div className="bg-[#111111] text-[#FCF6BA] border border-[#BF953F]/30 rounded-xl p-4 text-xs tracking-wider mb-8 text-center font-bold shadow-lg animate-fade-in flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A84C]" /> {feedbackMsg}
          </div>
        )}

        {/* ── OVERVIEW TAB CONTENTS ── */}
        {activeWorkspaceTab === 'overview' && (
          <div className="flex flex-col gap-10">
            
            {/* INVENTORY METRICS GROUP */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm flex flex-col gap-1 text-left">
                <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">STORE DENSITY CODES</span>
                <span className="text-3xl font-light font-serif text-[#111111]">{products.length} Designs</span>
                <div className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#BF953F] rounded-full animate-pulse" />
                  <span>Real-time channel linked</span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm flex flex-col gap-1 text-left">
                <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">AGGREGATE GARMENT UNITS</span>
                <span className="text-3xl font-light font-serif text-[#111111]">{totalStockCount} PCS</span>
                <p className="text-[10px] text-neutral-400 mt-2">Sum of main inventories + mapped custom variants.</p>
              </div>

              <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm flex flex-col gap-1 text-left">
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">LOW STOCK SKWS</span>
                <span className="text-3xl font-bold font-mono text-[#BF953F]">{lowStockAlerts.length} Alerts</span>
                <p className="text-[10px] text-neutral-400 mt-2">Active warnings on specific color-size variants.</p>
              </div>

              <div className="bg-white border border-neutral-200 p-6 rounded-xl shadow-sm flex flex-col gap-1 text-left bg-gradient-to-br from-neutral-50 to-white">
                <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">DEPLETED DESIGNS</span>
                <span className="text-3xl font-light font-serif text-red-600">{outOfStockItems.length} Empty</span>
                <p className="text-[10px] text-neutral-400 mt-2">Purged or items with zero active units.</p>
              </div>
            </section>

            {/* ALERT BOXES FOR DEVIATING NUMERICALS */}
            {lowStockAlerts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-xs text-amber-900 uppercase tracking-widest">Atelier Low Stock Warnings</h4>
                  <p className="text-xs text-amber-700 font-light mt-0.5">
                    Certain sizes and color structures has dropped below safety limits. Mapped clients might face out-of-stock checkouts.
                  </p>
                </div>
                <button 
                  onClick={() => { setShowAddForm(true); setActiveWorkspaceTab('editor'); }}
                  className="sm:ml-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[9px] tracking-widest uppercase rounded cursor-pointer"
                >
                  ALIGN STOCK
                </button>
              </div>
            )}

            {/* LIVE DATA GRID DIRECT OVERVIEWS */}
            <section className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 shadow-sm">
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-neutral-100 text-left">
                <div>
                  <h3 className="font-serif text-xl font-light text-[#111111]">Active Inventory Management</h3>
                  <p className="text-[11px] text-neutral-400">Trigger manual deletions, upload color variants, or click edit to align descriptions.</p>
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse text-left text-xs font-light">
                  <thead>
                    <tr className="border-b border-neutral-200 text-[#BF953F] font-bold tracking-widest text-[9px] uppercase">
                      <th className="pb-3 pl-2">Garment Description</th>
                      <th className="pb-3">Catalog ID</th>
                      <th className="pb-3">Strap Price</th>
                      <th className="pb-3">Category Map</th>
                      <th className="pb-3">Color Variants</th>
                      <th className="pb-3 text-right pr-2">Operations Panel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-sans">
                    {products.map((p) => {
                      const variantsCount = p.variants?.length || 0;
                      return (
                        <tr key={p.id} className="hover:bg-[#FAF9F6]/60 transition-all font-sans">
                          <td className="py-4 pl- pl-2 flex items-center gap-3">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-10 h-13 object-cover object-top rounded border border-neutral-200 bg-neutral-150"
                            />
                            <div className="flex flex-col gap-0.5 text-left max-w-[200px]">
                              <span className="font-serif text-xs font-bold text-[#111111] leading-tight truncate">{p.name}</span>
                              <span className="text-[9px] text-[#BF953F] font-semibold">{p.subcategory} line</span>
                            </div>
                          </td>
                          <td className="py-2 font-mono text-[10px] text-neutral-400 leading-none">{p.id}</td>
                          <td className="py-2 font-sans font-bold text-[#111111]">Rs. {p.price.toLocaleString()}</td>
                          <td className="py-2 text-[9px] uppercase font-bold text-neutral-400 tracking-wider font-sans">{p.category}</td>
                          <td className="py-2">
                            {variantsCount > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {Array.from(new Set(p.variants?.map(v => v.color))).map(col => {
                                  const matchingV = p.variants?.find(v => v.color === col);
                                  return (
                                    <span 
                                      key={col} 
                                      title={col}
                                      className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                                      style={{ backgroundColor: matchingV?.color_code || '#cccccc' }}
                                    />
                                  );
                                })}
                                <span className="text-[10px] text-neutral-400 font-mono pl-1">({p.variants?.length} skus)</span>
                              </div>
                            ) : (
                              <span className="text-[9px] text-neutral-400 italic font-sans">Standard Item</span>
                            )}
                          </td>
                          <td className="py-2 text-right">
                            <div className="flex gap-2 justify-end pr-2">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="w-8 h-8 rounded border border-neutral-200 hover:border-[#BF953F] hover:bg-[#BF953F]/10 flex items-center justify-center text-[#111111] hover:text-[#BF953F] transition-all cursor-pointer"
                                title="Edit product & variants"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(p.id)}
                                className="w-8 h-8 rounded border border-neutral-200 hover:border-red-500 hover:bg-red-500/5 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-all cursor-pointer"
                                title="Purge product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        )}

        {/* ── EDITOR WORKBENCH TAB CONTENTS ── */}
        {activeWorkspaceTab === 'editor' && showAddForm && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: PRIMARY PROPERTIES FORM */}
            <section className="lg:col-span-7 bg-white border border-[#111111]/10 rounded-xl p-6 sm:p-8 shadow-lg relative text-left">
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] rounded-t-xl" />
              
              <div className="border-b border-neutral-100 pb-5 mb-6">
                <h3 className="font-serif text-2xl font-light text-[#111111]">
                  {editingId ? 'Modify Premium Garment' : 'Build Custom Atelier Garment'}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Fill core specifications below. Upload directly to Supabase Storage systems.
                </p>
              </div>

              <form onSubmit={handleSaveProduct} className="flex flex-col gap-5">
                
                {/* ID & NAME ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="hidden">
                    <label className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase">PRODUCT SKU ID *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. signature-raw-silk-shirting" 
                      disabled={!!editingId}
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="w-full text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 rounded-md py-3 px-4 outline-none focus:bg-white focus:border-[#BF953F] disabled:opacity-40"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase">GARMENT NAME *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Signature Raw Silk Kurta" 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 rounded-md py-3 px-4 outline-none focus:bg-white focus:border-[#BF953F]"
                    />
                  </div>
                </div>

                {/* CATEGORY & CATEGORY CLASSIFICATIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase">CATEGORY DECK</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 rounded-md py-3 px-4 outline-none focus:bg-white focus:border-[#BF953F]"
                    >
                      <option value="men">Men's Apparel Collection</option>
                      <option value="women">Women's Ethnic Collection</option>
                      <option value="kids">Kids' Miniature Collection</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase">SUBCATEGORY DRAWER</label>
                    <select 
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value as any })}
                      className="w-full text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 rounded-md py-3 px-4 outline-none focus:bg-white focus:border-[#BF953F]"
                    >
                      <option value="essentials">Premium Essentials Cuts</option>
                      <option value="streetwear">Modern Streetwear Hoodies/Cargos</option>
                      <option value="accessories">Premium Headwear Caps/Belts</option>
                    </select>
                  </div>
                </div>

                {/* PRICE & BADGE ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase"> strap price (Rs.) *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-400">Rs.</span>
                      <input 
                        type="number" 
                        placeholder="e.g. 5500" 
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 rounded-md py-3 pl-10 pr-4 outline-none focus:bg-white focus:border-[#BF953F]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase">MARKETING BADGE LABEL</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Flagship, Silk Limited, New Entry" 
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 rounded-md py-3 px-4 outline-none focus:bg-white focus:border-[#BF953F]"
                    />
                  </div>
                </div>

                {/* FILE UPLOADER SYSTEM FOR MAIN PRODUCT PICTURE */}
                <div className="border-t border-b border-neutral-100 py-4 my-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left">
                      <span className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase block mb-0.5">Primary Photography Asset *</span>
                      <span className="text-[10px] text-neutral-400">Upload a crisp high-contrast portrait aspect [3:4] directly.</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label className="px-4.5 py-2.5 rounded border border-neutral-205 bg-neutral-50 hover:bg-neutral-100 text-[10px] font-bold tracking-wider text-neutral-600 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-[#BF953F]" />
                        <span>SELECT IMAGE FILE</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleMainUploader}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2.5 items-center">
                    <input 
                      type="url" 
                      placeholder="Cloud resource URL endpoint..." 
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 w-full text-[10px] text-[#111111] bg-[#FAF9F6] border border-neutral-205 rounded-md py-2 px-3 outline-none focus:bg-white focus:border-[#BF953F] font-mono"
                    />
                    {formData.image && (
                      <img src={formData.image} alt="Preview thumbnail" className="w-10 h-10 object-cover object-top rounded border border-neutral-200" />
                    )}
                  </div>
                </div>

                {/* SIZES MATRIX SELECTORS */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase">AVAILABLE SIZE CHANNELS</label>
                  <div className="flex flex-wrap gap-2 pt-1 font-sans">
                    {['S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((size) => {
                      const isSelected = (formData.sizes || []).includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSizeSelection(size)}
                          className={`px-4.5 py-2.5 border rounded-lg text-[10px] font-bold tracking-widest transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#111111] text-[#FCF6BA] border-[#111111] scale-95' 
                              : 'bg-white text-neutral-400 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* GARMENT DETAILS & DESCRIPTIONS */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase">Description & Handcraft parameters</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe weaving patterns, hand embroideries, raw threads count, or wash instructions..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 rounded-md py-3 px-4 outline-none focus:bg-white focus:border-[#BF953F] resize-y"
                  />
                </div>

                {/* DYNAMIC MULTI-GALLERY PHOTO SUBMISSION */}
                <div className="border-t border-neutral-100 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-left">
                      <span className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase block mb-0.5">Gallery Photography Array</span>
                      <span className="text-[10px] text-neutral-400">Include complementary thumbnails for swiping previews.</span>
                    </div>

                    <label className="px-3 py-2 border rounded text-[9px] font-bold tracking-wider text-neutral-600 bg-neutral-50 hover:bg-neutral-100 cursor-pointer flex items-center gap-1 shadow-sm">
                      <Upload className="w-3 h-3 text-[#BF953F]" />
                      <span>BATCH UPLOAD</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleGalleryUploader} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {formData.gallery && formData.gallery.length > 0 && (
                    <div className="flex flex-wrap gap-2 border border-neutral-200 rounded-lg p-3 bg-neutral-50/50">
                      {formData.gallery.map((url, i) => (
                        <div key={i} className="relative w-14 h-18 rounded overflow-hidden group border border-neutral-200 bg-white shadow-xs">
                          <img src={url} className="w-full h-full object-cover object-top" />
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, gallery: (prev.gallery || []).filter((_, idx) => idx !== i) }))}
                            className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white rounded-bl flex items-center justify-center text-[10px] opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ATELIER SPECIFICATION TABLE SETS */}
                <div className="border-t border-neutral-100 pt-5 text-left">
                  <h4 className="text-[10px] font-bold tracking-[0.15em] text-[#BF953F] uppercase mb-4">SPECIFICATIONS OVERRIDES INDEX</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-neutral-400 capitalize">Composition</span>
                      <input 
                        type="text" 
                        placeholder="e.g. 100% Linen Flax Mix" 
                        value={formData.specifications?.['Composition'] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, 'Composition': e.target.value }
                        })}
                        className="text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 py-2.5 px-3 rounded-md outline-none focus:bg-white focus:border-[#BF953F]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-neutral-400 capitalize">Collar / Stitch contours</span>
                      <input 
                        type="text" 
                        placeholder="e.g. Round club collar / Barchetta" 
                        value={formData.specifications?.['Fit'] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, 'Fit': e.target.value }
                        })}
                        className="text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 py-2.5 px-3 rounded-md outline-none focus:bg-white focus:border-[#BF953F]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-neutral-400 capitalize">Product Origin</span>
                      <input 
                        type="text" 
                        placeholder="e.g. Made in Pakistan" 
                        value={formData.specifications?.['Origin'] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          specifications: { ...formData.specifications, 'Origin': e.target.value }
                        })}
                        className="text-xs text-[#111111] bg-[#FAF9F6] border border-neutral-200 py-2.5 px-3 rounded-md outline-none focus:bg-white focus:border-[#BF953F]"
                      />
                    </div>
                  </div>
                </div>

              </form>
            </section>

            {/* RIGHT COLUMN: ADVANCED COLOR-SIZE VARIANT WORKBENCH & PREVIEWS */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              
              {/* ADVANCED MULTI-VARIANT SYSTEM WORKBENCH */}
              <section className="bg-white border border-neutral-200 p-6 rounded-xl shadow-lg relative text-left">
                <div className="absolute top-0 inset-x-0 h-1 bg-[#BF953F] rounded-t-xl" />
                
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#BF953F] uppercase block mb-1">ADVANCED PRODUCT VARIANT SYSTEM</span>
                <h3 className="font-serif text-lg text-neutral-800 font-light mb-4">Color & Size Inventory Blocks</h3>
                
                {/* Variant list state workbench */}
                {variantsList.length > 0 ? (
                  <div className="flex flex-col divide-y divide-neutral-100 max-h-[220px] overflow-y-auto mb-5 border border-neutral-100 rounded-lg p-2.5 bg-neutral-50/50">
                    {variantsList.map((v, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          {v.main_image ? (
                            <img src={v.main_image} className="w-7 h-9 object-cover rounded border" />
                          ) : (
                            <span className="w-7 h-9 bg-neutral-200 rounded text-[9px] text-neutral-400 flex items-center justify-center">N/G</span>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block" style={{ backgroundColor: v.color_code }} />
                              <span className="capitalize">{v.color}</span>
                            </span>
                            <span className="text-[10px] text-neutral-400">Size: <strong className="text-black">{v.size}</strong> • Units: <strong className="text-black">{v.stock} pcs</strong></span>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-center">
                          {v.price && (
                            <span className="text-[10px] font-mono font-bold text-[#BF953F]">Rs. {v.price}</span>
                          )}
                          <button 
                            type="button" 
                            onClick={() => removeVariantFromWorkbench(i)}
                            className="bg-transparent border-0 text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-neutral-200 text-neutral-400 rounded-lg mb-5 text-xs font-light">
                    No custom variations registered yet. Below is standard inventory.
                  </div>
                )}

                {/* Sub-form creator box */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4.5 flex flex-col gap-3 text-xs">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-250 pb-1.5 mb-1 block">Variations Assembler</span>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-neutral-550 font-bold">Color String</span>
                      <input 
                        type="text" 
                        placeholder="e.g. Navy, Tan, Mint" 
                        value={tempVariant.color}
                        onChange={(e) => setTempVariant(prev => ({ ...prev, color: e.target.value }))}
                        className="py-2 px-3 border border-neutral-200 rounded bg-white outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-neutral-550 font-bold">Hex Color Swatch</span>
                      <div className="flex gap-1.5 items-center h-full">
                        <input 
                          type="color" 
                          value={tempVariant.color_code}
                          onChange={(e) => setTempVariant(prev => ({ ...prev, color_code: e.target.value }))}
                          className="w-10 h-7 rounded border cursor-pointer border-neutral-200"
                        />
                        <span className="font-mono text-[9px] text-neutral-400">{tempVariant.color_code}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 py-1">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-neutral-550 font-bold">Strap Size</span>
                      <select 
                        value={tempVariant.size}
                        onChange={(e) => setTempVariant(prev => ({ ...prev, size: e.target.value }))}
                        className="py-2 px-1.5 border border-neutral-200 rounded bg-white outline-none text-[11px]"
                      >
                        {['S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-neutral-550 font-bold">Stack Weight</span>
                      <input 
                        type="number" 
                        value={tempVariant.stock}
                        onChange={(e) => setTempVariant(prev => ({ ...prev, stock: Number(e.target.value) }))}
                        className="py-2 px-2 border border-neutral-200 rounded bg-white outline-none text-[11px]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-neutral-550 font-bold">Adjust Price</span>
                      <input 
                        type="number" 
                        placeholder="Equal"
                        value={tempVariant.price || ''}
                        onChange={(e) => setTempVariant(prev => ({ ...prev, price: e.target.value ? Number(e.target.value) : undefined }))}
                        className="py-2 px-2 border border-neutral-200 rounded bg-white outline-none text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Photo attachment for variations with storage uploader hook */}
                  <div className="border-t border-neutral-200 pt-3 mt-1 flex justify-between items-center gap-2">
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-neutral-500 block">Variation Photography</span>
                      <span className="text-[9px] text-neutral-400">Attach distinct photography assets.</span>
                    </div>
                    <label className="px-3 py-1.5 bg-white border rounded text-[9px] font-bold text-neutral-600 cursor-pointer shadow-xs whitespace-nowrap">
                      <span>CHOOSE PHOTO</span>
                      <input type="file" accept="image/*" onChange={handleVariantUploader} className="hidden" />
                    </label>
                  </div>

                  {tempVariant.main_image && (
                    <div className="flex gap-3 items-center bg-white border border-neutral-250 p-2 rounded">
                      <img src={tempVariant.main_image} className="w-10 h-12 object-cover rounded" />
                      <span className="text-[9px] font-mono text-neutral-400 truncate">{tempVariant.main_image}</span>
                    </div>
                  )}

                  <button 
                    type="button" 
                    onClick={appendVariantToWorkbench}
                    className="w-full py-2.5 mt-2 bg-neutral-900 font-bold tracking-widest text-[#FCF6BA] text-[10px] uppercase rounded-lg hover:bg-black transition-all cursor-pointer shadow-sm"
                  >
                    ADD VARIATION TO REGISTER
                  </button>
                </div>
              </section>

              {/* REAL-TIME SIMULATOR PREVIEW PANEL */}
              <section className="bg-[#FAF9F6] border border-neutral-200 p-6 rounded-xl shadow-lg relative text-left">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#BF953F] uppercase block">LIVE ATELIER PREVIEW SANDBOX</span>
                    <h3 className="font-serif text-lg text-neutral-700 font-light">Real-time Layout Modeling</h3>
                  </div>
                  <div className="flex gap-1.5 bg-neutral-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setPreviewMode('card')} 
                      className={`px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase rounded cursor-pointer ${previewMode === 'card' ? 'bg-[#111111] text-white' : 'text-neutral-500 hover:text-black'}`}
                    >
                      CARD
                    </button>
                    <button 
                      onClick={() => setPreviewMode('details')} 
                      className={`px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase rounded cursor-pointer ${previewMode === 'details' ? 'bg-[#111111] text-white' : 'text-neutral-500 hover:text-black'}`}
                    >
                      DETAILS
                    </button>
                  </div>
                </div>

                {previewMode === 'card' ? (
                  <div className="flex justify-center">
                    <div className="w-[280px] bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                      <div className="aspect-[3/4] bg-neutral-100 rounded overflow-hidden relative">
                        {formData.image ? (
                          <img src={formData.image} className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-350 text-[10px] font-mono">NO MAIN IMAGE</div>
                        )}
                        {formData.badge && (
                          <span className="absolute top-2.5 left-2.5 bg-[#111111] text-[#FCF6BA] text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase border border-[#BF953F]/30 rounded">{formData.badge}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[8px] tracking-widest text-neutral-400 font-bold uppercase">{formData.category} / {formData.subcategory}</span>
                        <h4 className="font-serif text-[13px] font-medium text-[#111111] leading-tight line-clamp-1">{formData.name || 'New Atelier Garment'}</h4>
                        <span className="text-[12px] font-bold text-[#BF953F]">Rs. {(formData.price || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border rounded-xl p-5 text-left text-xs self-stretch flex flex-col gap-4">
                    <div className="grid grid-cols-5 gap-3">
                      <div className="col-span-2 aspect-[3/4] bg-neutral-100 rounded overflow-hidden">
                        {formData.image && <img src={formData.image} className="w-full h-full object-cover object-top" />}
                      </div>
                      <div className="col-span-3 flex flex-col gap-2">
                        <span className="text-[9px] text-[#BF953F] tracking-widest font-bold uppercase">{formData.category} / {formData.subcategory}</span>
                        <h3 className="font-serif text-base font-medium text-neutral-800 leading-tight">{formData.name || 'Untitled Garment'}</h3>
                        <span className="text-sm font-bold text-[#BF953F]">Rs. {(formData.price || 0).toLocaleString()}</span>
                        
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-[9px] font-bold text-neutral-400">WEARABLE SIZES</span>
                          <div className="flex gap-1">
                            {(formData.sizes || []).map(s => (
                              <span key={s} className="w-6 h-6 border rounded text-[8px] font-bold flex items-center justify-center text-neutral-600 bg-neutral-50">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-3 flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-neutral-400">FABRIC SPEC SHEET</span>
                      <div className="text-[10px] flex flex-col divide-y divide-neutral-50 bg-neutral-50 p-2 rounded">
                        <div className="py-1 flex justify-between"><span className="text-neutral-400">Composition</span><span className="font-semibold">{formData.specifications?.['Composition'] || 'N/A'}</span></div>
                        <div className="py-1 flex justify-between"><span className="text-neutral-400">Collar / Fit</span><span className="font-semibold">{formData.specifications?.['Fit'] || 'N/A'}</span></div>
                        <div className="py-1 flex justify-between"><span className="text-neutral-400">Origin</span><span className="font-semibold">{formData.specifications?.['Origin'] || 'N/A'}</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* SAVE OPERATIONS GROUP CONTAINER */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-4 bg-white border border-neutral-300 font-bold tracking-widest text-[#111111] text-[10px] uppercase rounded-xl hover:bg-neutral-50 transition-all cursor-pointer text-center"
                >
                  CLEAR FORM
                </button>

                <button
                  type="button"
                  onClick={handleSaveProduct}
                  disabled={actionLoading || isUploading}
                  className="flex-[2] py-4 bg-[#BF953F] font-bold tracking-widest text-[#111111] text-[10px] uppercase rounded-xl hover:bg-[#AA771C] hover:text-white transition-all cursor-pointer text-center disabled:opacity-40 shadow-md"
                >
                  {actionLoading ? 'COMMITTING UPLOAD...' : editingId ? 'COMMIT OVERRIDES ✓' : 'LAUNCH GARMENT LIVE ✓'}
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};
