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
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // جلب بيانات المنتجات في الـ wishlist
  useEffect(() => {
    if (email) {
      (async () => {
        try {
          // جلب المنتجات من Supabase
          const { data, error } = await supabase
            .from("wishlist")
            .select("products")
            .eq("email", email)
            .single();

          if (error) {
            console.error("Error fetching wishlist:", error);
            setWishlist([]);
          } else if (data?.products?.length > 0) {
            const { data: productsData, error: productsError } = await supabase
              .from("product")
              .select("*")
              .in("id", data.products);

            if (productsError) {
              console.error("Error fetching products:", productsError);
              setWishlist([]);
            } else {
              setWishlist(productsData);
            }
          } else {
            setWishlist([]);
          }
        } catch (err) {
          console.error("Unexpected error:", err);
          setWishlist([]);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [email]);

  // إزالة المنتج من الـ wishlist فورًا في الواجهة
  const handleRemove = async (productId) => {
    // تحديث الواجهة مباشرة (إخفاء المنتج)
    const updatedWishlist = wishlist.filter((product) => product.id !== productId);
    setWishlist(updatedWishlist);

    // التحديث في Supabase بعد التحديث في الواجهة
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
              <ProductCard
                key={product.id}
                product={product}
                slide={true}
                onRemove={handleRemove} // تمرير دالة الإزالة للمنتج
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>Your wishlist is empty!</p>
          </div>
        )}
      </div>
      <BottomHeader />
    </>
  );
}