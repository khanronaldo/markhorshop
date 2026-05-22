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

  // ==========================================
  // 1. AUTH STATES
  // ==========================================
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginMsg, setLoginMsg] = useState('');

  // ==========================================
  // 2. LOADING & FEEDBACK STATES
  // ==========================================
  const [actionLoading, setActionLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // ==========================================
  // 3. VIEW CONTROLLERS
  // ==========================================
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'editor' | 'overview'>('overview');
  const [previewMode, setPreviewMode] = useState<'card' | 'details' | 'none'>('card');

  // ==========================================
  // 4. FORM DATA STATE
  // ==========================================
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
    shipping: 'Free Shipping (2-3 Business Days)',
    specifications: {
      'Composition': '100% Premium Cotton',
      'Fit': 'Regular Fit',
      'Origin': 'Made in Pakistan'
    },
    gallery: []
  });

  // ==========================================
  // 5. PRODUCT VARIANTS STATE
  // ==========================================
  const [variantsList, setVariantsList] = useState<DbVariant[]>([]);
  const [tempVariant, setTempVariant] = useState<Partial<DbVariant>>({
    color: 'black',
    color_code: '#000000',
    size: 'M',
    stock: 50,
    price: undefined,
    main_image: '',
    gallery_images: []
  });

  // ==========================================
  // 6. EVENT HANDLERS
  // ==========================================

  // Edit button click handler
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormData({ ...product });
    setVariantsList(product.variants || []);
    setShowAddForm(true);
    setActiveWorkspaceTab('editor');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Reset form fields
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
      shipping: 'Free Shipping (2-3 Business Days)',
      specifications: {
        'Composition': '100% Premium Cotton',
        'Fit': 'Regular Fit',
        'Origin': 'Made in Pakistan'
      },
      gallery: []
    });
    setVariantsList([]);
    setEditingId(null);
  };

  // Login Form Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginMsg('');
    
    if (!email || !password) {
      setLoginError('Error: Email and password are required.');
      return;
    }

    const response = await loginAdmin(email, password, isSignUp);
    if (!response.success) {
      setLoginError(`Login Failed: ${response.message}`);
    } else {
      setLoginMsg(`Success: ${response.message}`);
      if (!isSignUp) {
        setEmail('');
        setPassword('');
      }
    }
  };

  // Main Product Image Uploader
  const handleMainUploader = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setFeedbackMsg('Uploading primary product image...');
      const cloudUrl = await uploadFile(e.target.files[0]);
      
      if (cloudUrl) {
        setFormData(prev => ({ ...prev, image: cloudUrl }));
        setFeedbackMsg('Image uploaded successfully!');
      } else {
        setFeedbackMsg('Upload failed. Please check your connection.');
      }
      setIsUploading(false);
    }
  };

  // Gallery Images Uploader
  const handleGalleryUploader = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setFeedbackMsg('Uploading images to gallery...');
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const cloudUrl = await uploadFile(e.target.files[i]);
        if (cloudUrl) uploadedUrls.push(cloudUrl);
      }
      
      const currentGallery = formData.gallery || [];
      setFormData(prev => ({ ...prev, gallery: [...currentGallery, ...uploadedUrls] }));
      setFeedbackMsg('Gallery images uploaded successfully!');
      setIsUploading(false);
    }
  };

  // Variant Image Uploader
  const handleVariantUploader = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const cloudUrl = await uploadFile(e.target.files[0]);
      if (cloudUrl) {
        setTempVariant(prev => ({ ...prev, main_image: cloudUrl }));
      }
      setIsUploading(false);
    }
  };

  // Add Variant to list
  const appendVariantToWorkbench = () => {
    if (!tempVariant.color) {
      alert("Validation Error: Color name is required.");
      return;
    }
    
    const colorVal = tempVariant.color.trim();
    const colorCode = tempVariant.color_code || '#C4A96E';
    const sizeVal = tempVariant.size || 'M';
    const mainImg = tempVariant.main_image || formData.image || '';

    const pristineVariant: DbVariant = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      product_id: formData.id || 'DRAFT-ID',
      color: colorVal,
      color_code: colorCode,
      size: sizeVal,
      stock: Number(tempVariant.stock) || 30,
      price: tempVariant.price ? Number(tempVariant.price) : null,
      main_image: mainImg,
      gallery_images: tempVariant.gallery_images || []
    };

    setVariantsList(prev => [...prev, pristineVariant]);

    const existingColors = formData.colors || [];
    if (!existingColors.includes(colorVal.toLowerCase())) {
      setFormData(prev => ({ ...prev, colors: [...existingColors, colorVal.toLowerCase()] }));
    }

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

  // Save/Update Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalProductId = editingId ? formData.id : (formData.id || generateUUID());

    if (!finalProductId || !formData.name || !formData.price || !formData.image) {
      setFeedbackMsg('Error: Product Name, Price, and Image are required.');
      return;
    }

    setActionLoading(true);
    setFeedbackMsg('');

    const distinctColors = Array.from(new Set(variantsList.map(v => v.color.toLowerCase())));
    const finalColors = distinctColors.length > 0 ? distinctColors : (formData.colors || ['black']);
    const finalVariants = variantsList.map(v => ({ ...v, product_id: finalProductId }));

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
      description: formData.description || 'Premium product from Markhor Collections.',
      shipping: formData.shipping || 'Free Shipping (2-3 Business Days)',
      specifications: formData.specifications || {
        'Composition': '100% Premium Cotton',
        'Origin': 'Made in Pakistan'
      },
      gallery: formData.gallery || []
    };

    if (editingId) {
      const response = await updateProduct(editingId, productPayload, finalVariants);
      if (response.success) {
        setFeedbackMsg('✓ Success: Product updated successfully.');
        resetForm();
        setShowAddForm(false);
        setActiveWorkspaceTab('overview');
      } else {
        setFeedbackMsg(`Error: Update failed: ${response.message}`);
      }
    } else {
      const response = await addProduct(productPayload, finalVariants);
      if (response.success) {
        setFeedbackMsg('✓ Success: Product added successfully.');
        resetForm();
        setShowAddForm(false);
        setActiveWorkspaceTab('overview');
      } else {
        setFeedbackMsg(`Error: Failed to add product: ${response.message}`);
      }
    }
    setActionLoading(false);
  };

  // Delete Product
  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      setActionLoading(true);
      const response = await deleteProduct(id);
      if (response.success) {
        setFeedbackMsg('✓ Success: Product deleted successfully.');
      } else {
        setFeedbackMsg(`Error: Deletion failed: ${response.message}`);
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

  // Calculations for dashboard counters
  const totalStockCount = products.reduce((acc, p) => acc + (p.stock || 50), 0) + variantsList.reduce((acc, v) => acc + v.stock, 0);
  const outOfStockItems = products.filter(p => (p.stock || 0) <= 0 && (!p.variants || p.variants.length === 0));
  const lowStockAlerts = products.filter(p => {
    if (p.variants && p.variants.length > 0) {
      return p.variants.some(v => v.stock < 5);
    }
    return (p.stock || 50) < 10;
  });

  // ==========================================
  // 7. LOGIN INTERFACE (UI)
  // ==========================================
  if (!adminToken) {
    return (
      <div className="bg-[#0B0B0A] text-[#F5F5F3] min-h-screen flex items-center justify-center px-6 py-24 selection:bg-[#BF953F] selection:text-black">
        <div className="bg-[#121211] border border-neutral-800/60 rounded-3xl p-10 max-w-md w-full shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#BF953F] to-transparent opacity-80" />
          
          <div className="text-center mb-10 mt-2">
            <span className="text-[10px] tracking-[0.4em] font-sans font-bold text-[#BF953F] uppercase block mb-3">
              MARKHOR COLLECTIONS • ADMIN PANEL
            </span>
            <h2 className="font-serif text-3xl font-extralight text-white tracking-tight">
              Admin Login
            </h2>
            <p className="text-[11px] text-neutral-400 font-sans tracking-wide max-w-[300px] mx-auto mt-3 leading-relaxed">
              Log in to manage your products, orders, and website stock inventory.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6 font-sans text-left">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-400 pl-1">
                Username / Email Address
              </label>
              <input 
                type="email" 
                placeholder="admin@markhorcollections.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs text-white bg-[#1A1A19] border border-neutral-800 rounded-xl py-3.5 px-4 outline-none focus:border-[#BF953F] focus:ring-1 focus:ring-[#BF953F]/10 transition-all font-mono tracking-wide"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-400 pl-1">
                Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs text-white bg-[#1A1A19] border border-neutral-800 rounded-xl py-3.5 px-4 outline-none focus:border-[#BF953F] focus:ring-1 focus:ring-[#BF953F]/10 transition-all font-mono tracking-wide"
              />
            </div>

            {loginError && (
              <div className="text-[11px] text-red-400 bg-red-950/20 rounded-xl p-3.5 text-center border border-red-900/30 font-mono tracking-tight">
                ✕ {loginError}
              </div>
            )}

            {loginMsg && (
              <div className="text-[11px] text-[#FCF6BA] bg-amber-950/20 rounded-xl p-3.5 text-center border border-[#BF953F]/20 font-mono tracking-tight">
                ✓ {loginMsg}
              </div>
            )}

            <button
              type="submit"
              className="py-4 mt-2 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] text-black text-[10px] font-black tracking-[0.25em] uppercase hover:brightness-110 transition-all cursor-pointer shadow-lg active:scale-[0.99]"
            >
              {isSignUp ? 'REGISTER ACCOUNT' : 'LOGIN'}
            </button>

            <div className="text-center mt-2 border-t border-neutral-900 pt-5">
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-neutral-400 hover:text-[#BF953F] transition-colors cursor-pointer bg-transparent border-0 font-light tracking-wide"
              >
                {isSignUp ? "Already have an account? Login" : "Need a new account? Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // 8. MAIN ADMIN DASHBOARD INTERFACE
  // ==========================================
  return (
    <div className="bg-[#FAF9F6] text-[#111111] min-h-screen selection:bg-[#BF953F] selection:text-white antialiased">
      
      {/* NAVBAR */}
      <header className="bg-white border-b border-neutral-200/80 py-12 px-6 sm:px-8 lg:px-12 backdrop-blur-md sticky top-0 z-40 bg-white/95">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="text-left">
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#BF953F] font-black mb-2 block">
              MARKHOR COLLECTIONS CONTROL INTERFACE
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-extralight tracking-tight text-neutral-900">
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-serif italic mt-2 flex items-center gap-1.5">
              Logged in as: <strong className="text-neutral-700 font-medium not-italic font-sans bg-neutral-100 px-2 py-0.5 rounded-md">{adminUser?.email || 'Administrator'}</strong>
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={() => { 
                setShowAddForm(!showAddForm); 
                resetForm(); 
                setActiveWorkspaceTab(showAddForm ? 'overview' : 'editor');
              }}
              className="px-6 py-3.5 rounded-xl bg-neutral-950 text-[#FCF6BA] text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl active:scale-95 flex-1 sm:flex-none"
            >
              {showAddForm ? <X className="w-4 h-4 text-red-400" /> : <Plus className="w-4 h-4 text-[#C9A84C]" />}
              {showAddForm ? 'CLOSE FORM' : 'ADD NEW PRODUCT'}
            </button>

            <button
              onClick={logoutAdmin}
              className="px-6 py-3.5 rounded-xl bg-white text-neutral-500 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-neutral-50 hover:text-red-600 border border-neutral-250 transition-all cursor-pointer flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <LogOut className="w-4 h-4" /> LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* TABS CONTROLLER */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex gap-8">
          <button
            onClick={() => setActiveWorkspaceTab('overview')}
            className={`py-5 text-xs font-bold tracking-[0.25em] uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2.5 relative font-sans ${
              activeWorkspaceTab === 'overview' ? 'border-[#BF953F] text-[#BF953F]' : 'border-transparent text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Activity className="w-4 h-4" /> Product Inventory
          </button>
          <button
            onClick={() => { setShowAddForm(true); setActiveWorkspaceTab('editor'); }}
            className={`py-5 text-xs font-bold tracking-[0.25em] uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2.5 relative font-sans ${
              activeWorkspaceTab === 'editor' ? 'border-[#BF953F] text-[#BF953F]' : 'border-transparent text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-4 h-4" /> Add / Edit Product
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        
        {/* FEEDBACK STATUS BAR */}
        {feedbackMsg && (
          <div className="bg-neutral-900 text-[#FCF6BA] border border-[#BF953F]/30 rounded-2xl p-4 text-xs tracking-wide mb-10 text-center font-medium shadow-2xl animate-fade-in flex items-center justify-center gap-3">
            <Sparkles className="w-4 h-4 text-[#C9A84C] animate-spin" /> {feedbackMsg}
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeWorkspaceTab === 'overview' && (
          <div className="flex flex-col gap-12">
            
            {/* METRICS CARDS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm flex flex-col gap-1 text-left hover:border-neutral-300 transition-colors">
                <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Total Products</span>
                <span className="text-3xl font-light font-serif text-neutral-900">{products.length} Items</span>
                <div className="text-[10px] text-neutral-400 mt-3 flex items-center gap-1.5 font-sans">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span>Live & Synced</span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm flex flex-col gap-1 text-left hover:border-neutral-300 transition-colors">
                <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Total Stock Volume</span>
                <span className="text-3xl font-light font-serif text-neutral-900">{totalStockCount} Units</span>
                <p className="text-[10px] text-neutral-400 mt-3 font-sans">Total items available across all sizing/variants.</p>
              </div>

              <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm flex flex-col gap-1 text-left bg-amber-50/20 border-amber-200/50">
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">Low Stock Alerts</span>
                <span className="text-3xl font-bold font-mono text-[#BF953F]">{lowStockAlerts.length} Alerts</span>
                <p className="text-[10px] text-neutral-400 mt-3 font-sans">Variants running dangerously low on stock.</p>
              </div>

              <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm flex flex-col gap-1 text-left bg-neutral-50">
                <span className="text-[9px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Out of Stock</span>
                <span className="text-3xl font-light font-serif text-red-500">{outOfStockItems.length} Products</span>
                <p className="text-[10px] text-neutral-400 mt-3 font-sans">Products that have completely sold out.</p>
              </div>
            </section>

            {/* LOW STOCK ALERT BANNER */}
            {lowStockAlerts.length > 0 && (
              <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 text-left backdrop-blur-md">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-amber-900 uppercase tracking-[0.15em]">Inventory Warning</h4>
                  <p className="text-xs text-amber-700/90 font-light leading-relaxed">
                    Some item variations have dropped below the safety limit. Update stock soon to avoid checkout issues.
                  </p>
                </div>
                <button 
                  onClick={() => { setShowAddForm(true); setActiveWorkspaceTab('editor'); }}
                  className="sm:ml-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[9px] tracking-widest uppercase rounded-xl cursor-pointer shadow-md transition-colors whitespace-nowrap"
                >
                  MANAGE STOCK
                </button>
              </div>
            )}

            {/* PRODUCT DATAGRID TABLE */}
            <section className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-sm">
              <div className="flex justify-between items-center pb-6 mb-8 border-b border-neutral-100 text-left">
                <div>
                  <h3 className="font-serif text-2xl font-light text-neutral-900">Product List</h3>
                  <p className="text-[11px] text-neutral-400 mt-1">Quickly edit product details, view live variations, or delete existing items.</p>
                </div>
              </div>

              <div className="overflow-x-auto w-full CustomScrollbar">
                <table className="w-full border-collapse text-left text-xs font-light">
                  <thead>
                    <tr className="border-b border-neutral-200 text-[#BF953F] font-bold tracking-[0.25em] text-[9px] uppercase">
                      <th className="pb-4 pl-2">Product Details</th>
                      <th className="pb-4">Product ID</th>
                      <th className="pb-4">Price</th>
                      <th className="pb-4">Category</th>
                      <th className="pb-4">Variants & Colors</th>
                      <th className="pb-4 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {products.map((p) => {
                      const variantsCount = p.variants?.length || 0;
                      return (
                        <tr key={p.id} className="hover:bg-neutral-50/50 transition-all group">
                          <td className="py-4 pl-2 flex items-center gap-4">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-12 h-16 object-cover object-top rounded-lg border border-neutral-200 bg-neutral-100 shadow-sm transition-transform group-hover:scale-[1.03]"
                            />
                            <div className="flex flex-col gap-1 text-left max-w-[220px]">
                              <span className="font-serif text-sm font-semibold text-neutral-900 leading-tight truncate">{p.name}</span>
                              <span className="text-[9px] text-[#BF953F] font-bold uppercase tracking-wider">{p.subcategory}</span>
                            </div>
                          </td>
                          <td className="py-4 font-mono text-[10px] text-neutral-400 select-all tracking-tight">{p.id}</td>
                          <td className="py-4 font-sans font-bold text-neutral-900 text-sm">Rs. {p.price.toLocaleString()}</td>
                          <td className="py-4 text-[10px] uppercase font-bold text-neutral-400 tracking-[0.15em] font-sans">{p.category}</td>
                          <td className="py-4">
                            {variantsCount > 0 ? (
                              <div className="flex items-center flex-wrap gap-1.5">
                                {Array.from(new Set(p.variants?.map(v => v.color))).map(col => {
                                  const matchingV = p.variants?.find(v => v.color === col);
                                  return (
                                    <span 
                                      key={col} 
                                      title={col.toUpperCase()}
                                      className="w-4 h-4 rounded-full border border-neutral-950/10 inline-block shadow-inner hover:scale-110 transition-transform"
                                      style={{ backgroundColor: matchingV?.color_code || '#CCCCCC' }}
                                    />
                                  );
                                })}
                                <span className="text-[10px] text-neutral-400 font-mono pl-1">({p.variants?.length} skus)</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-neutral-400 italic font-sans font-light">Standard Product (No Variants)</span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex gap-2 justify-end pr-2">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-[#BF953F] hover:bg-[#BF953F]/5 flex items-center justify-center text-neutral-700 hover:text-[#BF953F] transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(p.id)}
                                className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-red-500 hover:bg-red-50 flex items-center justify-center text-neutral-400 hover:text-red-600 transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
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


        {/* ── SECTION 2: STUDIO DESK DESIGN PRODUCTION PIPELINE ── */}
        {activeWorkspaceTab === 'editor' && showAddForm && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* COMPREHENSIVE BLUEPRINT CREATION CONTAINER */}
            <section className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xl relative text-left">
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] rounded-t-2xl" />
              
              <div className="border-b border-neutral-100 pb-6 mb-8">
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                  {editingId ? 'Modify Couture Profile' : 'Add New Product'}
                </h3>
                <p className="text-[11px] text-neutral-400 mt-1.5 font-sans leading-relaxed">
                  Map essential parameters, dimensions, metadata schemas, and upload media blueprints safely to decentralized cluster frames.
                </p>
              </div>

              <form onSubmit={handleSaveProduct} className="flex flex-col gap-6">
                
                {/* DYNAMIC SKU IDENTITY & NOMENCLATURE ROW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="hidden">
                    <label className="text-[9px] font-black tracking-[0.2em] text-[#BF953F] uppercase block mb-2">SYSTEM UNIQUE IDENTIFIER *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. signature-raw-silk-shirting" 
                      disabled={!!editingId}
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="w-full text-xs text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] disabled:opacity-40 font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label className="text-[9px] font-black tracking-[0.2em] text-[#BF953F] uppercase block mb-1">Product Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Signature Luxury Raw Silk Kurta" 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] font-sans tracking-wide transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* CATEGORIAL SPECIFICATION DECKS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black tracking-[0.2em] text-[#BF953F] uppercase block mb-1">Select Category</label>
                    <div className="relative">
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full text-xs text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 px-4 outline-none focus:bg-white focus:border-[#BF953F] appearance-none font-sans tracking-wide transition-all cursor-pointer shadow-inner"
                      >
                        <option value="men">↳ Men's Wear</option>
                        <option value="women">↳ Women's Wear</option>
                        <option value="kids">↳ Kids' Wear</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">SUBCATEGORY DRAWER</label>
                  <div className="relative">
                    <select 
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value as any })}
                      className="w-full text-sm text-neutral-800 bg-[#FAF9F6] border border-neutral-200 rounded-lg py-3.5 px-4 appearance-none outline-none transition-all duration-300 focus:bg-white focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 cursor-pointer"
                    >
                      <option value="essentials">↳ Essentials / Basics</option>
                      <option value="streetwear">↳ Streetwear (Hoodies/Cargos)</option>
                      <option value="accessories">↳ Accessories (Caps/Belts)</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRICE & BADGE ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">Product Price (Rs.) *</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 group-focus-within:text-[#BF953F] transition-colors">Rs.</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 5500" 
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full text-sm font-medium text-neutral-800 bg-[#FAF9F6] border border-neutral-200 rounded-lg py-3.5 pl-12 pr-4 outline-none transition-all duration-300 focus:bg-white focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">Product Badge / Tag</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Flagship, Limited Edition" 
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full text-sm text-neutral-800 bg-[#FAF9F6] border border-neutral-200 rounded-lg py-3.5 px-4 outline-none transition-all duration-300 focus:bg-white focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20"
                  />
                </div>
              </div>

              {/* FILE UPLOADER SYSTEM FOR MAIN PRODUCT PICTURE */}
              <div className="border border-neutral-200 bg-neutral-50/50 rounded-xl p-5 my-2 hover:border-neutral-300 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-left">
                    <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-800 uppercase block mb-1"> Main Product Image *</span>
                    <span className="text-[11px] text-neutral-500">Upload main photo (3:4 ratio recommended).</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="px-5 py-3 rounded-lg border-2 border-dashed border-[#BF953F]/50 bg-[#BF953F]/5 hover:bg-[#BF953F]/10 hover:border-[#BF953F] text-[10px] font-bold tracking-widest text-[#BF953F] transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                      <Upload className="w-4 h-4" />
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

                <div className="mt-4 flex gap-3 items-center">
                  <input 
                    type="url" 
                    placeholder="Or paste cloud resource URL endpoint..." 
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 w-full text-xs text-neutral-700 bg-white border border-neutral-200 rounded-lg py-3 px-4 outline-none transition-all focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 font-mono"
                  />
                  {formData.image && (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                      <img src={formData.image} alt="Preview" className="w-12 h-12 object-cover object-top rounded-lg border border-neutral-200 shadow-sm" />
                    </div>
                  )}
                </div>
              </div>

              {/* SIZES MATRIX SELECTORS */}
              <div className="flex flex-col gap-3 mt-2">
                <label className="text-[10px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">Select Available Sizes</label>
                <div className="flex flex-wrap gap-3 font-sans">
                  {['S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((size) => {
                    const isSelected = (formData.sizes || []).includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSizeSelection(size)}
                        className={`px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest transition-all duration-300 cursor-pointer shadow-sm ${
                          isSelected 
                            ? 'bg-neutral-900 text-[#FCF6BA] border-transparent shadow-neutral-900/20 translate-y-px' 
                            : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-400 hover:text-neutral-800 hover:-translate-y-0.5'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GARMENT DETAILS & DESCRIPTIONS */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">Product Description</label>
                <textarea 
                  rows={4}
                  placeholder="Describe weaving patterns, hand embroideries, raw threads count, or wash instructions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-sm text-neutral-800 bg-[#FAF9F6] border border-neutral-200 rounded-lg py-4 px-4 outline-none transition-all duration-300 focus:bg-white focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 resize-y leading-relaxed"
                />
              </div>

              {/* DYNAMIC MULTI-GALLERY PHOTO SUBMISSION */}
              <div className="border-t border-neutral-200 pt-6 mt-2">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-left">
                    <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-800 uppercase block mb-1">Product Gallery Images</span>
                    <span className="text-[11px] text-neutral-500">Upload extra photos for slider preview</span>
                  </div>

                  <label className="px-4 py-2.5 rounded-lg border border-neutral-300 text-[10px] font-bold tracking-widest text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-400 cursor-pointer flex items-center gap-2 shadow-sm transition-all">
                    <Upload className="w-3.5 h-3.5 text-[#BF953F]" />
                    <span>Upload Images</span>
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
                  <div className="flex flex-wrap gap-3 border border-neutral-200 rounded-xl p-4 bg-neutral-50/50">
                    {formData.gallery.map((url, i) => (
                      <div key={i} className="relative w-16 h-20 rounded-lg overflow-hidden group border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-all">
                        <img src={url} className="w-full h-full object-cover object-top" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, gallery: (prev.gallery || []).filter((_, idx) => idx !== i) }))}
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200 border-0 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ATELIER SPECIFICATION TABLE SETS */}
              <div className="border-t border-neutral-200 pt-6 mt-2 text-left">
                <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#BF953F] uppercase mb-4">Product Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">↳ Material / Fabric</span>
                    <input 
                      type="text" 
                      placeholder="e.g. 100% Linen Flax Mix" 
                      value={formData.specifications?.['Composition'] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, 'Composition': e.target.value }
                      })}
                      className="text-sm text-neutral-800 bg-[#FAF9F6] border border-neutral-200 py-3 px-3 rounded-lg outline-none transition-all focus:bg-white focus:border-[#BF953F] focus:ring-1 focus:ring-[#BF953F]/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">↳ Fit Type</span>
                    <input 
                      type="text" 
                      placeholder="e.g. Barchetta Pocket" 
                      value={formData.specifications?.['Fit'] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, 'Fit': e.target.value }
                      })}
                      className="text-sm text-neutral-800 bg-[#FAF9F6] border border-neutral-200 py-3 px-3 rounded-lg outline-none transition-all focus:bg-white focus:border-[#BF953F] focus:ring-1 focus:ring-[#BF953F]/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">↳ Made In</span>
                    <input 
                      type="text" 
                      placeholder="e.g. Made in Italy" 
                      value={formData.specifications?.['Origin'] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specifications: { ...formData.specifications, 'Origin': e.target.value }
                      })}
                      className="text-sm text-neutral-800 bg-[#FAF9F6] border border-neutral-200 py-3 px-3 rounded-lg outline-none transition-all focus:bg-white focus:border-[#BF953F] focus:ring-1 focus:ring-[#BF953F]/30"
                    />
                  </div>
                </div>
              </div>

            </form>
          </section>

          {/* RIGHT COLUMN: ADVANCED COLOR-SIZE VARIANT WORKBENCH & PREVIEWS */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* ADVANCED MULTI-VARIANT SYSTEM WORKBENCH */}
            <section className="bg-white border border-neutral-200 p-7 rounded-2xl shadow-xl shadow-neutral-200/50 relative text-left overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#BF953F] to-[#FCF6BA]" />
              
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#BF953F] uppercase block mb-1.5 mt-2">Product Variants</span>
              <h3 className="font-serif text-xl text-neutral-900 mb-5">Manage Inventory & Stock</h3>
              
              {/* Variant list state workbench */}
              {variantsList.length > 0 ? (
                <div className="flex flex-col divide-y divide-neutral-100 max-h-[240px] overflow-y-auto mb-6 border border-neutral-200 rounded-xl p-3 bg-[#FAF9F6] shadow-inner custom-scrollbar">
                  {variantsList.map((v, i) => (
                    <div key={i} className="py-3 flex items-center justify-between gap-3 text-sm hover:bg-white transition-colors px-2 rounded-lg">
                      <div className="flex items-center gap-3">
                        {v.main_image ? (
                          <img src={v.main_image} className="w-9 h-12 object-cover rounded-md border border-neutral-200 shadow-sm" />
                        ) : (
                          <span className="w-9 h-12 bg-neutral-200 rounded-md text-[10px] text-neutral-500 flex items-center justify-center font-mono">N/G</span>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold flex items-center gap-2 text-neutral-800">
                            <span className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: v.color_code }} />
                            <span className="capitalize">{v.color}</span>
                          </span>
                          <span className="text-[11px] text-neutral-500">Size: <strong className="text-neutral-800">{v.size}</strong> • <strong className="text-neutral-800">{v.stock} pcs</strong></span>
                        </div>
                      </div>

                      <div className="flex gap-4 items-center">
                        {v.price && (
                          <span className="text-[11px] font-mono font-bold text-[#BF953F] bg-[#BF953F]/10 px-2 py-1 rounded">Rs. {v.price}</span>
                        )}
                        <button 
                          type="button" 
                          onClick={() => removeVariantFromWorkbench(i)}
                          className="bg-neutral-100 p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer border-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-neutral-200 bg-neutral-50 text-neutral-500 rounded-xl mb-6 text-sm">
                  No custom variations registered yet.<br/> <span className="text-xs text-neutral-400 mt-1 block">Below is standard inventory assembler.</span>
                </div>
              )}

              {/* Sub-form creator box */}
              <div className="bg-neutral-900 border border-black rounded-xl p-5 flex flex-col gap-4 text-sm relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#BF953F]/10 rounded-full blur-2xl pointer-events-none"></div>
                <span className="text-[10px] font-bold text-[#BF953F] uppercase tracking-widest border-b border-neutral-800 pb-2 mb-1 block">Variations Assembler</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">Color String</span>
                    <input 
                      type="text" 
                      placeholder="e.g. Navy Blue" 
                      value={tempVariant.color}
                      onChange={(e) => setTempVariant(prev => ({ ...prev, color: e.target.value }))}
                      className="py-2.5 px-3 border border-neutral-700 rounded-lg bg-neutral-800 text-white outline-none focus:border-[#BF953F] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">Hex Swatch</span>
                    <div className="flex gap-2 items-center h-full bg-neutral-800 border border-neutral-700 rounded-lg p-1.5 focus-within:border-[#BF953F] transition-colors">
                      <input 
                        type="color" 
                        value={tempVariant.color_code}
                        onChange={(e) => setTempVariant(prev => ({ ...prev, color_code: e.target.value }))}
                        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                      />
                      <span className="font-mono text-[11px] text-neutral-300 uppercase tracking-widest">{tempVariant.color_code}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-1">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">Size</span>
                    <select 
                      value={tempVariant.size}
                      onChange={(e) => setTempVariant(prev => ({ ...prev, size: e.target.value }))}
                      className="py-2.5 px-2 border border-neutral-700 rounded-lg bg-neutral-800 text-white outline-none text-xs"
                    >
                      {['S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">Units</span>
                    <input 
                      type="number" 
                      value={tempVariant.stock}
                      onChange={(e) => setTempVariant(prev => ({ ...prev, stock: Number(e.target.value) }))}
                      className="py-2.5 px-2 border border-neutral-700 rounded-lg bg-neutral-800 text-white outline-none text-xs text-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">Price Add</span>
                    <input 
                      type="number" 
                      placeholder="Equal"
                      value={tempVariant.price || ''}
                      onChange={(e) => setTempVariant(prev => ({ ...prev, price: e.target.value ? Number(e.target.value) : undefined }))}
                      className="py-2.5 px-2 border border-neutral-700 rounded-lg bg-neutral-800 text-white outline-none text-xs text-center"
                    />
                  </div>
                </div>

                {/* Photo attachment for variations with storage uploader hook */}
                <div className="border-t border-neutral-800 pt-4 mt-2 flex justify-between items-center gap-3">
                  <div className="text-left">
                    <span className="text-[11px] font-bold text-neutral-200 block">Products Variations</span>
                    <span className="text-[10px] text-neutral-500">Attach distinct color asset.</span>
                  </div>
                  <label className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-lg text-[10px] font-bold tracking-widest text-neutral-300 cursor-pointer transition-colors shadow-sm whitespace-nowrap">
                    <span>UPLOAD</span>
                    <input type="file" accept="image/*" onChange={handleVariantUploader} className="hidden" />
                  </label>
                </div>

                {tempVariant.main_image && (
                  <div className="flex gap-4 items-center bg-neutral-800 border border-neutral-700 p-2.5 rounded-lg">
                    <img src={tempVariant.main_image} className="w-12 h-14 object-cover rounded shadow-sm" />
                    <span className="text-[10px] font-mono text-neutral-400 truncate flex-1">{tempVariant.main_image}</span>
                  </div>
                )}

                <button 
                  type="button" 
                  onClick={appendVariantToWorkbench}
                  className="w-full py-3.5 mt-3 bg-gradient-to-r from-[#BF953F] to-[#AA771C] font-bold tracking-[0.2em] text-white text-[11px] uppercase rounded-lg hover:shadow-lg hover:shadow-[#BF953F]/20 transform hover:-translate-y-0.5 transition-all cursor-pointer border-0"
                >
                  ADD VARIATION TO REGISTER
                </button>
              </div>
            </section>

            {/* REAL-TIME SIMULATOR PREVIEW PANEL */}
            <section className="bg-neutral-50 border border-neutral-200 p-7 rounded-2xl shadow-xl shadow-neutral-200/50 relative text-left">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#BF953F] uppercase block mb-1">LIVE ATELIER PREVIEW SANDBOX</span>
                  <h3 className="font-serif text-xl text-neutral-900">Real-time Layout Modeling</h3>
                </div>
                <div className="flex gap-2 bg-white border border-neutral-200 p-1.5 rounded-xl shadow-sm">
                  <button 
                    onClick={() => setPreviewMode('card')} 
                    className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer ${previewMode === 'card' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
                  >
                    CARD
                  </button>
                  <button 
                    onClick={() => setPreviewMode('details')} 
                    className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer ${previewMode === 'details' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
                  >
                    DETAILS
                  </button>
                </div>
              </div>

              {previewMode === 'card' ? (
                <div className="flex justify-center">
                  <div className="w-[300px] bg-white border border-neutral-100 rounded-2xl p-4 shadow-xl shadow-neutral-200/40 flex flex-col gap-4 group">
                    <div className="aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden relative">
                      {formData.image ? (
                        <img src={formData.image} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs font-mono border-2 border-dashed border-neutral-200 rounded-xl">NO MAIN IMAGE</div>
                      )}
                      {formData.badge && (
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-neutral-900 text-[9px] font-extrabold tracking-widest px-2.5 py-1 uppercase rounded shadow-sm">{formData.badge}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-center px-2 pb-2">
                      <span className="text-[9px] tracking-[0.2em] text-[#BF953F] font-bold uppercase">{formData.category} / {formData.subcategory}</span>
                      <h4 className="font-serif text-[15px] font-medium text-neutral-900 leading-snug line-clamp-1">{formData.name || 'New Atelier Garment'}</h4>
                      <span className="text-[13px] font-bold text-neutral-500 mt-1">Rs. {(formData.price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-neutral-100 shadow-xl shadow-neutral-200/40 rounded-2xl p-6 text-left self-stretch flex flex-col gap-5">
                  <div className="grid grid-cols-5 gap-6">
                    <div className="col-span-2 aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden shadow-inner">
                      {formData.image ? <img src={formData.image} className="w-full h-full object-cover object-top" /> : <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">IMG</div>}
                    </div>
                    <div className="col-span-3 flex flex-col justify-center gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-[#BF953F] tracking-[0.2em] font-bold uppercase">{formData.category} / {formData.subcategory}</span>
                        <h3 className="font-serif text-2xl font-medium text-neutral-900 leading-tight">{formData.name || 'Untitled Garment'}</h3>
                      </div>
                      <span className="text-lg font-bold text-neutral-600">Rs. {(formData.price || 0).toLocaleString()}</span>
                      
                      <div className="flex flex-col gap-2 mt-3">
                        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Wearable Sizes</span>
                        <div className="flex gap-2">
                          {(formData.sizes || []).map(s => (
                            <span key={s} className="min-w-[32px] h-8 px-2 border border-neutral-200 rounded-md text-[10px] font-bold flex items-center justify-center text-neutral-700 bg-neutral-50 shadow-sm">{s}</span>
                          ))}
                          {(!formData.sizes || formData.sizes.length === 0) && <span className="text-xs text-neutral-400 italic">No sizes selected</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-5 flex flex-col gap-3 mt-1">
                    <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Fabric Spec Sheet</span>
                    <div className="text-xs flex flex-col divide-y divide-neutral-100 bg-[#FAF9F6] p-4 rounded-xl border border-neutral-200/60">
                      <div className="py-2.5 flex justify-between items-center"><span className="text-neutral-500">Composition</span><span className="font-semibold text-neutral-800">{formData.specifications?.['Composition'] || 'N/A'}</span></div>
                      <div className="py-2.5 flex justify-between items-center"><span className="text-neutral-500">Collar / Fit</span><span className="font-semibold text-neutral-800">{formData.specifications?.['Fit'] || 'N/A'}</span></div>
                      <div className="py-2.5 flex justify-between items-center"><span className="text-neutral-500">Origin</span><span className="font-semibold text-neutral-800">{formData.specifications?.['Origin'] || 'N/A'}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* SAVE OPERATIONS GROUP CONTAINER */}
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-4.5 bg-white border-2 border-neutral-900 font-bold tracking-[0.2em] text-neutral-900 text-[11px] uppercase rounded-xl hover:bg-neutral-900 hover:text-white transition-all duration-300 cursor-pointer text-center"
              >
                CLEAR FORM
              </button>

              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={actionLoading || isUploading}
                className="flex-[2] py-4.5 bg-gradient-to-r from-[#BF953F] to-[#AA771C] font-bold tracking-[0.2em] text-white text-[11px] uppercase rounded-xl hover:shadow-lg hover:shadow-[#BF953F]/40 transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-center disabled:opacity-50 disabled:transform-none disabled:shadow-none border-0"
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