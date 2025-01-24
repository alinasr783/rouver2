import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartColored, WishlistActive } from "./icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Skeleton from "@mui/material/Skeleton";
import "../css/productCard.css";
import "swiper/css";

export default function ProductCard({ product, slide }) {
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
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const checkWishlist = useCallback(async () => {
    if (!email) return;

    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("products")
        .eq("email", email)
        .single();

      if (error) throw error;

      // تحقق إذا كان المنتج موجودًا
      setLove(data.products.includes(product.id));
    } catch (error) {
      console.error("Error checking wishlist:", error.message);
    } finally {
      setLoading(false);
    }
  }, [email, product.id]);

  const updateWishlist = useCallback(async () => {
    if (!email) return;

    try {
      // جلب المنتجات الحالية في قائمة الأمنيات
      const { data, error } = await supabase
        .from("wishlist")
        .select("products")
        .eq("email", email)
        .single();

      if (error) throw error;

      // تحديث المنتجات في قائمة الأمنيات بناءً على حالة "love"
      const updatedProducts = love
        ? data.products.filter((id) => id !== product.id)
        : [...data.products, product.id];

      const { error: updateError } = await supabase
        .from("wishlist")
        .update({ products: updatedProducts })
        .eq("email", email);

      if (updateError) throw updateError;

      console.log("Wishlist updated successfully");

      // **زيادة عدد مرات الإضافة إلى قائمة الأمنيات (added_wishlist)**
      if (!love) { // فقط عندما يتم إضافة المنتج وليس إزالته
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
  }, [email, love, product.id]);

  useEffect(() => {
    checkWishlist();
  }, [checkWishlist]);
  const handleHeart = async (e) => {
    e.stopPropagation(); // منع التنقل للصفحة عند الضغط على القلب

    // تحديث الحالة المحلية على الفور
    const newLove = !love;
    setLove(newLove);

    // تحديث الـ Supabase بعد التغيير
    await updateWishlist();
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={200} />
      ) : (
        <div className="product-card-content">
          <div className="product-card-content-image">
            {slide ? (
              <Swiper className="product-card-content-sliders">
                {product.images.map((el, ind) => (
                  <SwiperSlide className="product-card-content-slider" key={ind}>
                    <img src={el} alt={`Product ${ind}`} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <img src={product.images[0]} alt="Product" />
            )}
          </div>
          <div className="product-card-content-top">
            <div className="product-card-content-title">{product.title}</div>
            <div className="product-card-content-rating">
              <i className="fa fa-star"></i>
              <div className="product-card-content-rating-number">
                {product.rating}
              </div>
            </div>
          </div>
          <div className="product-card-content-bottom">
            <div className="product-card-content-price">${product.price}</div>
          </div>
          <div
            className="product-card-content-heart"
            onClick={handleHeart}
          >
            <div
              className="product-card-content-heart-icon"
              dangerouslySetInnerHTML={{
                __html: love ? WishlistActive : HeartColored,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}