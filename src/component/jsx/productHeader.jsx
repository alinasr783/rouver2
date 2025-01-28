import React, { useState, useEffect, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { HeartColored, WishlistActive } from "./icons";
import "../css/productHeader.css";

export default function ProductHeader({ title, product }) {
  const [love, setLove] = useState(false); // لمعرفة إذا كان المنتج في الـ wishlist
  const [email, setEmail] = useState(null); // حفظ البريد الإلكتروني للمستخدم
  const [loading, setLoading] = useState(true); // حالة التحميل
  const navigate = useNavigate();

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

  const checkWishlist = useCallback(async () => {
    if (email) {
      try {
        const { data, error } = await supabase
          .from("wishlist")
          .select("products")
          .eq("email", email)
          .single();

        if (error) throw error;

        setLove(data.products.includes(product.id));
      } catch (error) {
        console.error("Error checking wishlist:", error.message);
      }
    } else {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setLove(localWishlist.includes(product.id));
    }
    setLoading(false);
  }, [email, product.id]);

  const updateWishlist = useCallback(async () => {
    if (email) {
      try {
        const { data, error } = await supabase
          .from("wishlist")
          .select("products")
          .eq("email", email)
          .single();

        if (error) throw error;

        const updatedProducts = love
          ? data.products.filter((id) => id !== product.id) // إزالة المنتج
          : [...data.products, product.id]; // إضافة المنتج

        const { error: updateError } = await supabase
          .from("wishlist")
          .update({ products: updatedProducts })
          .eq("email", email);

        if (updateError) throw updateError;

        console.log("Wishlist updated successfully");

        if (!love) {
          const { data: productData, error: fetchError } = await supabase
            .from("product")
            .select("added_wishlist")
            .eq("id", product.id)
            .single();

          if (fetchError) throw fetchError;

          const updatedWishlistCount = (productData.added_wishlist || 0) + 1;

          const { error: updateWishlistCountError } = await supabase
            .from("product")
            .update({ added_wishlist: updatedWishlistCount })
            .eq("id", product.id);

          if (updateWishlistCountError) throw updateWishlistCountError;

          console.log("Product added_wishlist count updated successfully");
        }
      } catch (error) {
        console.error("Error updating wishlist or added_wishlist count:", error.message);
      }
    } else {
      // تحديث الـ wishlist في localStorage
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const updatedWishlist = love
        ? localWishlist.filter((id) => id !== product.id) // إزالة المنتج
        : [...localWishlist, product.id]; // إضافة المنتج

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    }
  }, [email, love, product.id]);

  useEffect(() => {
    checkWishlist();
  }, [checkWishlist]);

  const handleHeart = async (e) => {
    e.stopPropagation(); // منع تفعيل الحدث الرئيسي

    const newLove = !love;
    setLove(newLove);

    await updateWishlist();
  };

  return (
    <div className="product-header">
      <div className="product-header-content">
        <div className="product-header-content-back" onClick={() => navigate("/")}>
          <i className="fa fa-arrow-left"></i>
        </div>
        <div className="product-header-content-title">{title}</div>
        <div className="product-header-content-heart" onClick={handleHeart}>
          <div
            className="product-header-content-heart-icon"
            dangerouslySetInnerHTML={{
              __html: love ? WishlistActive : HeartColored,
            }}
          />
        </div>
      </div>
    </div>
  );
}