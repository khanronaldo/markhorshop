import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, DbVariant, Review, ColorVariant } from "../types";
import { PRODUCTS as STATIC_PRODUCTS } from "../data/products";
import { supabase, isUuid, generateUUID } from "../lib/supabase";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  adminToken: string | null;
  adminUser: any | null;
  loginAdmin: (email: string, password: string, isSignUp?: boolean) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => Promise<void>;
  addProduct: (product: Product, variants?: DbVariant[]) => Promise<{ success: boolean; message: string }>;
  updateProduct: (id: string, product: Product, variants?: DbVariant[]) => Promise<{ success: boolean; message: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; message: string }>;
  addReview: (productId: string, rating: number, reviewer: string, comment: string) => Promise<{ success: boolean; message: string }>;
  uploadFile: (file: File) => Promise<string | null>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem("markhor_admin_token"));
  const [adminUser, setAdminUser] = useState<any | null>(null);

  // 1. Core Fetch / Pull syncing from Supabase
  const refreshProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Direct join queries are natively fully supported by Supabase for custom schemas!
      // In case they didn't run the SQL Schema yet, we can catch it beautifully to fall back to static
      const { data: rawProducts, error: fetchErr } = await supabase
        .from('products')
        .select(`
          *,
          product_variants(*),
          reviews(*)
        `)
        .order('created_at', { ascending: false });

      if (fetchErr) {
        throw fetchErr;
      }

      if (rawProducts && rawProducts.length > 0) {
        const mappedProducts: Product[] = rawProducts.map((p: any) => {
          const variants: DbVariant[] = p.product_variants || [];
          
          // Build color selector list based on unique variant colors or default colors list
          const colorsSet = new Set<string>();
          const colorImagesList: ColorVariant[] = [];
          
          variants.forEach((v: any) => {
            if (v.color) {
              const colName = v.color.toLowerCase();
              colorsSet.add(colName);
              
              const exists = colorImagesList.some(c => c.colorName === colName);
              if (!exists && v.main_image) {
                colorImagesList.push({
                  colorName: colName,
                  hex: v.color_code || '#c4a96e',
                  imgUrl: v.main_image
                });
              }
            }
          });

          // Fallback static structure matches
          const finalColors = colorsSet.size > 0 ? Array.from(colorsSet) : (p.colors || ['black']);
          const finalImage = p.image || (variants[0]?.main_image) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800';

          return {
            id: p.id,
            name: p.title || p.name || 'Bespoke Garment',
            title: p.title || 'Bespoke Garment',
            category: p.category || 'men',
            subcategory: p.subcategory || 'essentials',
            price: Number(p.price) || 0,
            image: finalImage,
            sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL'],
            colors: finalColors,
            colorImagesList: colorImagesList.length > 0 ? colorImagesList : (p.colorImagesList || [
              { colorName: 'black', hex: '#050505', imgUrl: finalImage }
            ]),
            badge: p.badge || undefined,
            description: p.description || '',
            shipping: p.shipping || 'Free Luxury Shipping (2-3 Business Days)',
            specifications: typeof p.specifications === 'object' && p.specifications ? p.specifications : {
              'Composition': 'Premium Linen / Cotton Blend',
              'Origin': 'Made in Pakistan'
            },
            gallery: p.gallery || [],
            stock: p.stock !== undefined ? p.stock : 50,
            variants: variants,
            reviews: p.reviews || []
          };
        });

        setProducts(mappedProducts);
        localStorage.setItem("markhor_products_cache", JSON.stringify(mappedProducts));
      } else {
        // If query succeeded but table is empty, we keep static or empty
        setProducts([]);
      }
    } catch (err: any) {
      console.warn("Supabase database catalog not initialized, or connection blocked. Rendering static fallback content.", err);
      // Fallback to cache or defaults
      const cached = localStorage.getItem("markhor_products_cache");
      if (cached) {
        try {
          setProducts(JSON.parse(cached));
        } catch (e) {
          setProducts(STATIC_PRODUCTS);
        }
      } else {
        setProducts(STATIC_PRODUCTS);
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Auth Session Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminUser(session?.user ?? null);
      setAdminToken(session?.access_token ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminUser(session?.user ?? null);
      setAdminToken(session?.access_token ?? null);
      if (session?.access_token) {
        localStorage.setItem("markhor_admin_token", session.access_token);
      } else {
        localStorage.removeItem("markhor_admin_token");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 3. Setup Postgres Live Database Subscriptions (Realtime Syncing)
  useEffect(() => {
    refreshProducts();

    const productsSubscription = supabase
      .channel('public-db-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        refreshProducts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_variants' }, () => {
        refreshProducts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => {
        refreshProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsSubscription);
    };
  }, []);

  // 4. Admin Authentication
  const loginAdmin = async (email: string, password: string, isSignUp = false): Promise<{ success: boolean; message: string }> => {
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return { 
          success: true, 
          message: data.user?.identities?.length === 0 
            ? "⚠️ Account already registered. Please sign in." 
            : "✓ Verification email sent! Please check your inbox." 
        };
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return { success: true, message: "✓ Authenticated! Secure token registered." };
      }
    } catch (err: any) {
      console.error("Supabase Auth failure:", err);
      // Fallback for easy sandbox testing if credentials not created yet
      if (password === "markhor2026" || password === "admin123" || password === "nestandnifty07") {
        setAdminToken("fake-dev-jwt-admin-token");
        setAdminUser({ email: "owner@markhor.com", role: "admin" });
        return { success: true, message: "✓ Offline Admin Mode Approved (Developer Sandbox Hook)." };
      }
      return { success: false, message: err.message || "Failed authenticate credentials." };
    }
  };

  const logoutAdmin = async () => {
    await supabase.auth.signOut();
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem("markhor_admin_token");
  };

  // 5. Create product and insert variants bulk
  const addProduct = async (product: Product, variants?: DbVariant[]): Promise<{ success: boolean; message: string }> => {
    try {
      const { error: dbError } = await supabase
        .from('products')
        .insert([{
          id: product.id,
          title: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          subcategory: product.subcategory,
          image: product.image,
          badge: product.badge || null,
          sizes: product.sizes,
          stock: product.stock || 50,
          specifications: product.specifications || {},
          gallery: product.gallery || []
        }]);

      if (dbError) throw dbError;

      if (variants && variants.length > 0) {
        const { error: varError } = await supabase
          .from('product_variants')
          .insert(variants.map(v => ({
            product_id: product.id,
            color: v.color,
            color_code: v.color_code,
            size: v.size,
            stock: v.stock,
            price: v.price || null,
            main_image: v.main_image || null,
            gallery_images: v.gallery_images || []
          })));

        if (varError) throw varError;
      }

      await refreshProducts();
      return { success: true, message: "✓ Brand new garment added live directly to Supabase!" };
    } catch (err: any) {
      console.error("Database Save Error:", err);
      return { success: false, message: err.message || "Could not insert product." };
    }
  };

  // 6. Update product details & sync updated variants
  const updateProduct = async (id: string, product: Product, variants?: DbVariant[]): Promise<{ success: boolean; message: string }> => {
    try {
      const { error: dbError } = await supabase
        .from('products')
        .update({
          title: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          subcategory: product.subcategory,
          image: product.image,
          badge: product.badge || null,
          sizes: product.sizes,
          stock: product.stock || 50,
          specifications: product.specifications || {},
          gallery: product.gallery || []
        })
        .eq('id', id);

      if (dbError) throw dbError;

      // Reset and sync variants
      await supabase.from('product_variants').delete().eq('product_id', id);

      if (variants && variants.length > 0) {
        const { error: varError } = await supabase
          .from('product_variants')
          .insert(variants.map(v => ({
            product_id: id,
            color: v.color,
            color_code: v.color_code,
            size: v.size,
            stock: v.stock,
            price: v.price || null,
            main_image: v.main_image || null,
            gallery_images: v.gallery_images || []
          })));

        if (varError) throw varError;
      }

      await refreshProducts();
      return { success: true, message: "✓ Garment updated live on database servers." };
    } catch (err: any) {
      console.error("Database Update Error:", err);
      return { success: false, message: err.message || "Could not modify product details." };
    }
  };

  // 7. Delete Product cascades automatically in SQL
  const deleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error: dbError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
      await refreshProducts();
      return { success: true, message: "✓ Garment purged successfully." };
    } catch (err: any) {
      console.error("Database Delete Error:", err);
      return { success: false, message: err.message || "Could not purge item." };
    }
  };

  // 8. Reusable Review Hook
  const addReview = async (productId: string, rating: number, reviewer: string, comment: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { error: dbError } = await supabase
        .from('reviews')
        .insert([{
          product_id: productId,
          rating,
          reviewer_name: reviewer,
          comment
        }]);

      if (dbError) throw dbError;
      await refreshProducts();
      return { success: true, message: "✓ Thank you! Your luxury review has been attached to the registry." };
    } catch (err: any) {
      console.error("Database Review Error:", err);
      return { success: false, message: err.message || "Could not post review." };
    }
  };

  // 9. Reusable Storage uploader (Main + gallery images)
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const bucketName = 'product-images';
      const fileExt = file.name.split('.').pop();
      const randomStr = Math.random().toString(36).substring(2, 10);
      const fileName = `${randomStr}-${Date.now()}.${fileExt}`;

      // Upload image stream
      const { error: uploadErr } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, { cacheControl: '3600', upsert: true });

      if (uploadErr) {
        console.error("Storage upload error:", uploadErr);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err: any) {
      console.error("Uploader fail:", err);
      return null;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        adminToken,
        adminUser,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        uploadFile,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProducts must be used inside a ProductProvider");
  }
  return ctx;
};
