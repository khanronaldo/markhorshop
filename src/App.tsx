import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { Shop } from './views/Shop';
import { ProductDetail } from './views/ProductDetail';
import { About } from './views/About';
import { Contact } from './views/Contact';
import { Checkout } from './views/Checkout';
import { Admin } from './views/Admin';
import { CartProvider } from './context/CartContext';
import { ProductProvider, useProducts } from './context/ProductContext';
import { Product, ViewType } from './types';
import { PRODUCTS } from './data/products';

function AppContent() {
  const { products } = useProducts();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);

  // Adjust selectedProduct when products are loaded if they exist
  useEffect(() => {
    if (products.length > 0 && (!selectedProduct || !products.some(p => p.id === selectedProduct.id))) {
      setSelectedProduct(products[0]);
    }
  }, [products]);

  // Command Browser Tab titles dynamically
  useEffect(() => {
    const brandPrefix = 'Markhor Collections';
    const viewTitles: Record<ViewType, string> = {
      home: 'Premium Luxury Wear — Suite for the Modern Journey',
      shop: 'Atelier Floor — Premium Tailored Catalog',
      product: `${selectedProduct?.name || 'Garment Specs'} — Bespoke Atelier Details`,
      about: 'Our Heritage Story — Precision Tailoring Roots',
      contact: 'Connect Support — Direct Concierge Desk',
      checkout: 'Secure Settlement & Orders Influx',
      admin: 'Owner Atelier System — Live Catalogs Management',
    };
    
    document.title = `${brandPrefix} | ${viewTitles[currentView]}`;
  }, [currentView, selectedProduct]);

  // Smooth scroll back to top upon page navigation pivots
  const handleViewChange = (nextView: ViewType) => {
    setCurrentView(nextView);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <Home onViewChange={handleViewChange} onSelectProduct={setSelectedProduct} />;
      case 'shop':
        return <Shop onViewChange={handleViewChange} onSelectProduct={setSelectedProduct} />;
      case 'product':
        return (
          <ProductDetail 
            product={selectedProduct} 
            onViewChange={handleViewChange} 
            onSelectProduct={setSelectedProduct} 
          />
        );
      case 'about':
        return <About onViewChange={handleViewChange} />;
      case 'contact':
        return <Contact />;
      case 'checkout':
        return <Checkout onViewChange={handleViewChange} onSelectProduct={setSelectedProduct} />;
      case 'admin':
        return <Admin />;
      default:
        return <Home onViewChange={handleViewChange} onSelectProduct={setSelectedProduct} />;
    }
  };

  return (
    <div className="bg-[#FAF9F6] text-[#111111] min-h-screen flex flex-col font-sans selection:bg-[#C9A84C] selection:text-black antialiased overflow-x-hidden">
      
      {/* Navigation Core component */}
      <Header 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        onSelectProduct={setSelectedProduct} 
      />

      {/* Sliding transitional main body container */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Page footer element */}
      <Footer onViewChange={handleViewChange} />
      
    </div>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ProductProvider>
  );
}
