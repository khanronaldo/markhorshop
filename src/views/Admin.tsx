import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import { generateUUID } from '../lib/supabase';
import {
  Plus, Trash2, Edit3, LogOut, Sparkles, Activity, Layers, X, Upload
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
  const [previewMode, setPreviewMode] = useState<'card' | 'details'>('card');

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
    gallery: []
  });

  // ==========================================
  // 5. EVENT HANDLERS
  // ==========================================

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormData({ ...product });
    setShowAddForm(true);
    setActiveWorkspaceTab('editor');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

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
      gallery: []
    });
    setEditingId(null);
  };

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
      if (!isSignUp) { setEmail(''); setPassword(''); }
    }
  };

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

  const toggleSizeSelection = (size: string) => {
    const current = formData.sizes || [];
    if (current.includes(size)) {
      setFormData(prev => ({ ...prev, sizes: current.filter(s => s !== size) }));
    } else {
      setFormData(prev => ({ ...prev, sizes: [...current, size] }));
    }
  };

  const handleSaveProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalProductId = editingId ? formData.id : (formData.id || generateUUID());
    if (!finalProductId || !formData.name || !formData.price || !formData.image) {
      setFeedbackMsg('Error: Product Name, Price, and Image are required.');
      return;
    }
    setActionLoading(true);
    setFeedbackMsg('');
    const productPayload: Product = {
      id: finalProductId.trim(),
      name: formData.name.trim(),
      category: formData.category as 'men' | 'women' | 'kids',
      subcategory: formData.subcategory as 'essentials' | 'streetwear' | 'accessories',
      price: Number(formData.price),
      image: formData.image,
      sizes: formData.sizes && formData.sizes.length > 0 ? formData.sizes : ['S', 'M', 'L', 'XL'],
      colors: formData.colors || ['black'],
      badge: formData.badge || undefined,
      description: formData.description || 'Premium product from Markhor Collections.',
      shipping: formData.shipping || 'Free Shipping (2-3 Business Days)',
      gallery: formData.gallery || []
    };
    if (editingId) {
      const response = await updateProduct(editingId, productPayload, []);
      if (response.success) {
        setFeedbackMsg('✓ Success: Product updated successfully.');
        resetForm(); setShowAddForm(false); setActiveWorkspaceTab('overview');
      } else {
        setFeedbackMsg(`Error: Update failed: ${response.message}`);
      }
    } else {
      const response = await addProduct(productPayload, []);
      if (response.success) {
        setFeedbackMsg('✓ Success: Product added successfully.');
        resetForm(); setShowAddForm(false); setActiveWorkspaceTab('overview');
      } else {
        setFeedbackMsg(`Error: Failed to add product: ${response.message}`);
      }
    }
    setActionLoading(false);
  };

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

  const totalStockCount = products.reduce((acc, p) => acc + (p.stock || 50), 0);
  const outOfStockItems = products.filter(p => (p.stock || 0) <= 0);

  // ==========================================
  // 6. LOGIN UI
  // ==========================================
  if (!adminToken) {
    return (
      <div className="bg-[#F7E7CE] text-[#1C1A17] min-h-screen flex items-center justify-center px-4 py-12 sm:py-24 selection:bg-[#BF953F]/30">
        <div className="bg-white border border-[#E3DDD3] rounded-2xl sm:rounded-3xl p-6 sm:p-10 w-full max-w-sm sm:max-w-md shadow-[0_20px_60px_-15px_rgba(28,26,23,0.1)] relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[3px] bg-[#BF953F]" />
          <div className="text-center mb-8 mt-2">
            <span className="text-[9px] tracking-[0.4em] font-bold text-[#B58A3D] uppercase block mb-3">MARKHOR COLLECTIONS</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extralight text-[#1C1A17] tracking-tight">Admin Login</h2>
            <p className="text-[10px] sm:text-[11px] text-[#59534E] font-sans tracking-wide max-w-[280px] mx-auto mt-2 leading-relaxed">
              Log in to manage your products, orders, and website stock inventory.
            </p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5 font-sans text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#59534E] pl-1">Email Address</label>
              <input
                type="email"
                placeholder="admin@markhorcollections.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs text-[#1C1A17] bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 px-4 outline-none focus:border-[#BF953F] focus:bg-white transition-all font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#59534E] pl-1">Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs text-[#1C1A17] bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 px-4 outline-none focus:border-[#BF953F] focus:bg-white transition-all font-mono"
              />
            </div>
            {loginError && (
              <div className="text-[10px] text-red-600 bg-red-50 rounded-xl p-3 text-center border border-red-200 font-mono">✕ {loginError}</div>
            )}
            {loginMsg && (
              <div className="text-[10px] text-[#B58A3D] bg-[#F7E7CE]/50 rounded-xl p-3 text-center border border-[#E3DDD3] font-mono">✓ {loginMsg}</div>
            )}
            <button
              type="submit"
              className="py-3.5 mt-1 rounded-xl bg-[#1C1A17] text-[#BF953F] text-[9px] font-black tracking-[0.25em] uppercase hover:bg-black transition-all cursor-pointer shadow-lg active:scale-[0.99]"
            >
              {isSignUp ? 'REGISTER ACCOUNT' : 'LOGIN'}
            </button>
            <div className="text-center border-t border-[#E3DDD3] pt-4">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[10px] sm:text-xs text-[#59534E] hover:text-[#B58A3D] transition-colors cursor-pointer bg-transparent border-0 font-light"
              >
                {isSignUp ? 'Already have an account? Login' : 'Need a new account? Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // 7. MAIN DASHBOARD
  // ==========================================
  return (
    <div className="bg-[#F7E7CE] text-[#1C1A17] min-h-screen selection:bg-[#BF953F]/30 antialiased">

      {/* HEADER */}
      <header className="bg-white border-b border-[#E3DDD3] py-5 sm:py-8 lg:py-10 px-4 sm:px-8 lg:px-12 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-3 sm:gap-6">
          {/* Left: branding */}
          <div className="text-left min-w-0">
            <span className="text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-[#B58A3D] font-black block mb-0.5 sm:mb-1.5 truncate">
              MARKHOR COLLECTIONS
            </span>
            <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-light tracking-tight text-[#1C1A17] leading-none">
              Admin Dashboard
            </h1>
            <p className="text-[9px] sm:text-[10px] text-[#59534E] font-serif italic mt-1 hidden sm:flex items-center gap-1.5">
              Logged in as:
              <strong className="text-[#1C1A17] font-medium not-italic font-sans bg-[#F5F5F5] px-2 py-0.5 rounded-md border border-[#E3DDD3] truncate max-w-[180px]">
                {adminUser?.email || 'Administrator'}
              </strong>
            </p>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                resetForm();
                setActiveWorkspaceTab(showAddForm ? 'overview' : 'editor');
              }}
              className="h-9 sm:h-10 px-3 sm:px-5 rounded-xl bg-[#1C1A17] text-[#BF953F] text-[8px] sm:text-[9px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase hover:bg-black transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shadow-sm active:scale-95"
            >
              {showAddForm
                ? <><X className="w-3.5 h-3.5" /><span className="hidden xs:inline">CLOSE</span></>
                : <><Plus className="w-3.5 h-3.5" /><span>ADD PRODUCT</span></>
              }
            </button>
            <button
              onClick={logoutAdmin}
              className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-white text-[#1C1A17] text-[8px] sm:text-[9px] font-bold tracking-[0.15em] uppercase hover:bg-[#F5F5F5] hover:text-red-600 border border-[#E3DDD3] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LOGOUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-white border-b border-[#E3DDD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex gap-6 sm:gap-8">
          <button
            onClick={() => setActiveWorkspaceTab('overview')}
            className={`py-3.5 sm:py-4 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 font-sans whitespace-nowrap ${
              activeWorkspaceTab === 'overview'
                ? 'border-[#B58A3D] text-[#B58A3D]'
                : 'border-transparent text-[#59534E] hover:text-[#1C1A17]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Product Inventory
          </button>
          <button
            onClick={() => { setShowAddForm(true); setActiveWorkspaceTab('editor'); }}
            className={`py-3.5 sm:py-4 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 font-sans whitespace-nowrap ${
              activeWorkspaceTab === 'editor'
                ? 'border-[#B58A3D] text-[#B58A3D]'
                : 'border-transparent text-[#59534E] hover:text-[#1C1A17]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Add / Edit Product
          </button>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 lg:py-12">

        {/* FEEDBACK BAR */}
        {feedbackMsg && (
          <div className="bg-[#1C1A17] text-[#BF953F] border border-[#BF953F]/30 rounded-xl p-3 sm:p-4 text-[10px] sm:text-xs tracking-wide mb-6 sm:mb-8 text-center font-bold shadow-sm flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin shrink-0" /> {feedbackMsg}
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeWorkspaceTab === 'overview' && (
          <div className="flex flex-col gap-6 sm:gap-10">

            {/* METRIC CARDS */}
            <section className="grid grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
              <div className="bg-white border border-[#E3DDD3] p-3 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm flex flex-col gap-0.5 sm:gap-1 text-left hover:border-[#B58A3D] transition-colors">
                <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#59534E] uppercase leading-tight">Total Products</span>
                <span className="text-lg sm:text-2xl lg:text-3xl font-light font-serif text-[#1C1A17] mt-0.5">{products.length}</span>
                <span className="text-[7px] sm:text-[9px] text-[#59534E] hidden sm:flex items-center gap-1 mt-1 font-sans">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0" /> Live & Synced
                </span>
              </div>

              <div className="bg-white border border-[#E3DDD3] p-3 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm flex flex-col gap-0.5 sm:gap-1 text-left hover:border-[#B58A3D] transition-colors">
                <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#59534E] uppercase leading-tight">Total Stock</span>
                <span className="text-lg sm:text-2xl lg:text-3xl font-light font-serif text-[#1C1A17] mt-0.5">{totalStockCount}</span>
                <span className="text-[7px] sm:text-[9px] text-[#59534E] mt-1 font-sans hidden sm:block">Units across all sizes</span>
              </div>

              <div className="bg-white border border-[#E3DDD3] p-3 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-sm flex flex-col gap-0.5 sm:gap-1 text-left hover:border-[#B58A3D] transition-colors">
                <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#59534E] uppercase leading-tight">Out of Stock</span>
                <span className="text-lg sm:text-2xl lg:text-3xl font-light font-serif text-red-600 mt-0.5">{outOfStockItems.length}</span>
                <span className="text-[7px] sm:text-[9px] text-[#59534E] mt-1 font-sans hidden sm:block">Sold out products</span>
              </div>
            </section>

            {/* PRODUCT TABLE */}
            <section className="bg-white border border-[#E3DDD3] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-10 shadow-sm">
              <div className="pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-[#E3DDD3] text-left">
                <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-light text-[#1C1A17]">Product List</h3>
                <p className="text-[9px] sm:text-[10px] text-[#59534E] mt-1">Edit or delete existing products.</p>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse text-left min-w-[520px]">
                  <thead>
                    <tr className="border-b border-[#E3DDD3] text-[#B58A3D] font-bold tracking-[0.2em] text-[7px] sm:text-[8px] lg:text-[9px] uppercase">
                      <th className="pb-3 pl-1">Product</th>
                      <th className="pb-3 hidden md:table-cell">Product ID</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3 hidden sm:table-cell">Category</th>
                      <th className="pb-3 text-right pr-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3DDD3]/50">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F5F5F5] transition-all group">
                        <td className="py-3 sm:py-4 pl-1">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-9 h-12 sm:w-11 sm:h-14 lg:w-12 lg:h-16 object-cover object-top rounded-lg border border-[#E3DDD3] bg-[#F5F5F5] shadow-sm transition-transform group-hover:scale-[1.03] shrink-0"
                            />
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="font-serif text-[11px] sm:text-xs lg:text-sm font-semibold text-[#1C1A17] leading-tight truncate max-w-[120px] sm:max-w-[180px] lg:max-w-[240px]">{p.name}</span>
                              <span className="text-[7px] sm:text-[8px] text-[#B58A3D] font-bold uppercase tracking-wider">{p.subcategory}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 font-mono text-[8px] sm:text-[9px] text-[#59534E] hidden md:table-cell select-all">{p.id}</td>
                        <td className="py-3 sm:py-4 font-sans font-bold text-[#1C1A17] text-[11px] sm:text-xs lg:text-sm whitespace-nowrap">Rs. {p.price.toLocaleString()}</td>
                        <td className="py-3 sm:py-4 text-[8px] sm:text-[9px] uppercase font-bold text-[#59534E] tracking-[0.1em] hidden sm:table-cell">{p.category}</td>
                        <td className="py-3 sm:py-4 text-right pr-1">
                          <div className="flex gap-1.5 sm:gap-2 justify-end">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#E3DDD3] hover:border-[#B58A3D] hover:bg-[#F5F5F5] flex items-center justify-center text-[#59534E] hover:text-[#B58A3D] transition-all cursor-pointer shadow-sm active:scale-95"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(p.id)}
                              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#E3DDD3] hover:border-red-500 hover:bg-red-50 flex items-center justify-center text-[#59534E] hover:text-red-600 transition-all cursor-pointer shadow-sm active:scale-95"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        )}

        {/* ── EDITOR TAB ── */}
        {activeWorkspaceTab === 'editor' && showAddForm && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">

            {/* LEFT: FORM */}
            <section className="lg:col-span-7 bg-white border border-[#E3DDD3] rounded-xl sm:rounded-2xl p-4 sm:p-7 lg:p-10 shadow-sm relative text-left">
              <div className="absolute top-0 inset-x-0 h-[3px] bg-[#BF953F] rounded-t-xl sm:rounded-t-2xl" />

              <div className="border-b border-[#E3DDD3] pb-4 sm:pb-5 mb-5 sm:mb-7">
                <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl font-light text-[#1C1A17] tracking-tight">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-[9px] sm:text-[10px] text-[#59534E] mt-1 font-sans leading-relaxed">
                  Fill in the product details below and upload images.
                </p>
              </div>

              <form onSubmit={handleSaveProduct} className="flex flex-col gap-4 sm:gap-5 lg:gap-6">

                {/* PRODUCT NAME */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] sm:text-[9px] font-black tracking-[0.2em] text-[#B58A3D] uppercase">Product Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Signature Luxury Raw Silk Kurta"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs sm:text-sm text-[#1C1A17] bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-[#BF953F] font-sans transition-all shadow-sm"
                  />
                </div>

                {/* CATEGORY & SUBCATEGORY */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full text-xs sm:text-sm text-neutral-900 bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 px-3 outline-none focus:bg-white focus:border-[#BF953F] appearance-none cursor-pointer transition-all"
                    >
                      <option value="men">Men's Wear</option>
                      <option value="women">Women's Wear</option>
                      <option value="kids">Kids' Wear</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">Subcategory</label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value as any })}
                      className="w-full text-xs sm:text-sm text-neutral-800 bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 px-3 outline-none focus:bg-white focus:border-[#BF953F] appearance-none cursor-pointer transition-all"
                    >
                      <option value="essentials">Essentials</option>
                      <option value="streetwear">Streetwear</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                {/* PRICE & BADGE */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">Price (Rs.) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">Rs.</span>
                      <input
                        type="number"
                        placeholder="5500"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="w-full text-xs sm:text-sm font-medium text-neutral-800 bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 pl-10 pr-3 outline-none focus:bg-white focus:border-[#BF953F] transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">Badge / Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. New, Sale, Hot"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full text-xs sm:text-sm text-neutral-800 bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 px-3 outline-none focus:bg-white focus:border-[#BF953F] transition-all"
                    />
                  </div>
                </div>

                {/* MAIN IMAGE */}
                <div className="border border-[#E3DDD3] bg-[#F5F5F5]/50 rounded-xl p-3 sm:p-4">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#1C1A17] uppercase block mb-0.5">Main Product Image *</span>
                      <span className="text-[8px] sm:text-[9px] text-[#59534E]">Upload photo (3:4 ratio recommended)</span>
                    </div>
                    <label className="shrink-0 px-3 py-2 rounded-lg border-2 border-dashed border-[#BF953F]/50 bg-[#BF953F]/5 hover:bg-[#BF953F]/10 hover:border-[#BF953F] text-[8px] sm:text-[9px] font-bold tracking-widest text-[#BF953F] transition-all cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>UPLOAD</span>
                      <input type="file" accept="image/*" onChange={handleMainUploader} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      placeholder="Or paste image URL..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 text-[10px] sm:text-xs text-neutral-700 bg-white border border-[#E3DDD3] rounded-lg py-2.5 px-3 outline-none focus:border-[#BF953F] font-mono transition-all min-w-0"
                    />
                    {formData.image && (
                      <img src={formData.image} alt="Preview" className="w-10 h-10 sm:w-12 sm:h-12 object-cover object-top rounded-lg border border-[#E3DDD3] shadow-sm shrink-0" />
                    )}
                  </div>
                </div>

                {/* SIZES */}
                <div className="flex flex-col gap-2">
                  <label className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map((size) => {
                      const isSelected = (formData.sizes || []).includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSizeSelection(size)}
                          className={`px-3 sm:px-4 py-2 rounded-lg text-[9px] sm:text-[10px] font-bold tracking-widest transition-all duration-200 cursor-pointer shadow-sm ${
                            isSelected
                              ? 'bg-[#1C1A17] text-[#FCF6BA] border-transparent'
                              : 'bg-white text-neutral-500 border border-[#E3DDD3] hover:border-neutral-400 hover:text-neutral-800'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-[#BF953F] uppercase">Product Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the product — fabric, fit, wash care..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-xs sm:text-sm text-neutral-800 bg-[#F5F5F5] border border-[#E3DDD3] rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-[#BF953F] resize-y leading-relaxed transition-all"
                  />
                </div>

                {/* GALLERY */}
                <div className="border-t border-[#E3DDD3] pt-4 sm:pt-5">
                  <div className="flex justify-between items-center gap-3 mb-3">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-[#1C1A17] uppercase block mb-0.5">Product Gallery</span>
                      <span className="text-[8px] sm:text-[9px] text-[#59534E]">Extra photos for image slider</span>
                    </div>
                    <label className="shrink-0 px-3 py-2 rounded-lg border border-[#E3DDD3] text-[8px] sm:text-[9px] font-bold tracking-widest text-neutral-700 bg-white hover:bg-[#F5F5F5] cursor-pointer flex items-center gap-1.5 shadow-sm transition-all">
                      <Upload className="w-3 h-3 text-[#BF953F]" />
                      <span>ADD PHOTOS</span>
                      <input type="file" multiple accept="image/*" onChange={handleGalleryUploader} className="hidden" />
                    </label>
                  </div>
                  {formData.gallery && formData.gallery.length > 0 && (
                    <div className="flex flex-wrap gap-2 border border-[#E3DDD3] rounded-xl p-3 bg-[#F5F5F5]/50">
                      {formData.gallery.map((url, i) => (
                        <div key={i} className="relative w-12 h-14 sm:w-14 sm:h-18 rounded-lg overflow-hidden group border border-[#E3DDD3] bg-white shadow-sm">
                          <img src={url} className="w-full h-full object-cover object-top" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, gallery: (prev.gallery || []).filter((_, idx) => idx !== i) }))}
                              className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center border-0 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </form>
            </section>

            {/* RIGHT: PREVIEW + SAVE */}
            <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">

              {/* LIVE PREVIEW */}
              <section className="bg-neutral-50 border border-neutral-200 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm text-left">
                <div className="flex justify-between items-center mb-4 sm:mb-5">
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-[#BF953F] uppercase block mb-0.5">LIVE PREVIEW</span>
                    <h3 className="font-serif text-base sm:text-lg text-neutral-900">Real-time Preview</h3>
                  </div>
                  <div className="flex gap-1.5 bg-white border border-neutral-200 p-1 rounded-lg shadow-sm">
                    <button
                      onClick={() => setPreviewMode('card')}
                      className={`px-2.5 sm:px-3 py-1.5 text-[8px] sm:text-[9px] font-bold tracking-widest uppercase rounded-md transition-all cursor-pointer ${previewMode === 'card' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      CARD
                    </button>
                    <button
                      onClick={() => setPreviewMode('details')}
                      className={`px-2.5 sm:px-3 py-1.5 text-[8px] sm:text-[9px] font-bold tracking-widest uppercase rounded-md transition-all cursor-pointer ${previewMode === 'details' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                    >
                      DETAILS
                    </button>
                  </div>
                </div>

                {previewMode === 'card' ? (
                  <div className="flex justify-center">
                    <div className="w-full max-w-[220px] sm:max-w-[260px] bg-white border border-neutral-100 rounded-xl sm:rounded-2xl p-3 shadow-lg flex flex-col gap-3 group">
                      <div className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden relative">
                        {formData.image
                          ? <img src={formData.image} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                          : <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[9px] font-mono border-2 border-dashed border-neutral-200 rounded-lg">NO IMAGE</div>
                        }
                        {formData.badge && (
                          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-neutral-900 text-[7px] sm:text-[8px] font-extrabold tracking-widest px-2 py-1 uppercase rounded shadow-sm">{formData.badge}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 text-center px-1 pb-1">
                        <span className="text-[7px] sm:text-[8px] tracking-[0.2em] text-[#BF953F] font-bold uppercase truncate">{formData.category} / {formData.subcategory}</span>
                        <h4 className="font-serif text-[13px] sm:text-sm font-medium text-neutral-900 leading-snug line-clamp-1">{formData.name || 'Product Name'}</h4>
                        <span className="text-[11px] sm:text-xs font-bold text-neutral-500">Rs. {(formData.price || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-neutral-100 rounded-xl p-4 flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="w-24 sm:w-28 aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                        {formData.image
                          ? <img src={formData.image} className="w-full h-full object-cover object-top" />
                          : <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[9px]">IMG</div>
                        }
                      </div>
                      <div className="flex flex-col justify-center gap-1.5 min-w-0">
                        <span className="text-[7px] sm:text-[8px] text-[#BF953F] tracking-[0.2em] font-bold uppercase">{formData.category} / {formData.subcategory}</span>
                        <h3 className="font-serif text-sm sm:text-base font-medium text-neutral-900 leading-tight">{formData.name || 'Untitled'}</h3>
                        <span className="text-sm font-bold text-neutral-600">Rs. {(formData.price || 0).toLocaleString()}</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(formData.sizes || []).map(s => (
                            <span key={s} className="px-1.5 py-0.5 border border-neutral-200 rounded text-[7px] sm:text-[8px] font-bold text-neutral-700 bg-neutral-50">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* SAVE BUTTONS */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3.5 sm:py-4 bg-white border-2 border-[#1C1A17] font-bold tracking-[0.15em] text-[#1C1A17] text-[9px] sm:text-[10px] uppercase rounded-xl hover:bg-[#1C1A17] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  CLEAR
                </button>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  disabled={actionLoading || isUploading}
                  className="flex-[2] py-3.5 sm:py-4 bg-gradient-to-r from-[#BF953F] to-[#AA771C] font-bold tracking-[0.15em] text-white text-[9px] sm:text-[10px] uppercase rounded-xl hover:shadow-lg hover:shadow-[#BF953F]/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed border-0 flex items-center justify-center"
                >
                  {actionLoading ? 'SAVING...' : editingId ? 'UPDATE PRODUCT ✓' : 'PUBLISH PRODUCT ✓'}
                </button>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};