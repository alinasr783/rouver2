import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import ProductCard from "../../component/jsx/productCard.jsx";
import Skeleton from "@mui/material/Skeleton";
import "../css/wishlist.css";

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]); // بيانات المنتجات في الـ wishlist
  const [email, setEmail] = useState(null); // البريد الإلكتروني
  const [loading, setLoading] = useState(true); // حالة التحميل

  // جلب البريد الإلكتروني عند تسجيل الدخول
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        setEmail(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // جلب بيانات المنتجات في الـ wishlist
  useEffect(() => {
    const fetchWishlistData = async (productIds) => {
      try {
        const { data: productsData, error: productsError } = await supabase
          .from("product")
          .select("*")
          .in("id", productIds);

        if (productsError) {
          console.error("Error fetching products:", productsError);
          setWishlist([]);
        } else {
          setWishlist(productsData);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      // جلب المنتجات من Supabase إذا كان هناك بريد إلكتروني
      (async () => {
        try {
          const { data, error } = await supabase
            .from("wishlist")
            .select("products")
            .eq("email", email)
            .single();

          if (error) {
            console.error("Error fetching wishlist:", error);
            setWishlist([]);
          } else if (data?.products?.length > 0) {
            fetchWishlistData(data.products);
          } else {
            setWishlist([]);
          }
        } catch (err) {
          console.error("Unexpected error:", err);
          setWishlist([]);
        }
      })();
    } else {
      // جلب المنتجات من localStorage إذا لم يكن هناك بريد إلكتروني
      const storedWishlist = JSON.parse(localStorage.getItem("wishlist"));
      if (storedWishlist && storedWishlist.length > 0) {
        fetchWishlistData(storedWishlist);
      } else {
        setWishlist([]);
        setLoading(false);
      }
    }
  }, [email]);

  // إزالة المنتج من الـ wishlist فورًا في الواجهة
  const handleRemove = async (productId) => {
    // تحديث الواجهة مباشرة (إخفاء المنتج من الـ state)
    const updatedWishlist = wishlist.filter((product) => product.id !== productId);
    setWishlist(updatedWishlist);

    if (email) {
      // التحديث في Supabase إذا كان هناك بريد إلكتروني
      try {
        const { data, error } = await supabase
          .from("wishlist")
          .select("products")
          .eq("email", email)
          .single();

        if (error) {
          console.error("Error fetching wishlist for update:", error);
          return;
        }

        const updatedProducts = data.products.filter((id) => id !== productId);

        const { error: updateError } = await supabase
          .from("wishlist")
          .update({ products: updatedProducts })
          .eq("email", email);

        if (updateError) {
          console.error("Error updating wishlist:", updateError);
        }
      } catch (err) {
        console.error("Unexpected error while updating wishlist:", err);
      }
    } else {
      // التحديث في localStorage إذا لم يكن هناك بريد إلكتروني
      const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const updatedStoredWishlist = storedWishlist.filter((id) => id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updatedStoredWishlist));
    }
  };

  return (
    <>
      <Header title="My Wishlist" />
      <div className="wishlist-content">
        {loading ? (
          <div className="wishlist-loading">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} variant="rounded" width="100%" height={150} />
            ))}
          </div>
        ) : wishlist.length > 0 ? (
          <div className="wishlist-card">
            {wishlist.map((product) => (
              <div className="wishlist-item" key={product.id}>
                <ProductCard
                  product={product}
                  slide={true}
                  onRemove={handleRemove} // تمرير دالة الإزالة للمنتج
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-wishlist">
            <p>Your wishlist is empty!</p>
          </div>
        )}
      </div>
      <BottomHeader />
    </>
  );
}