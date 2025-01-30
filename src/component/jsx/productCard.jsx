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
  const [love, setLove] = useState(false);
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // جلب إيميل المستخدم من Firebase
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

  // التحقق من حالة المنتج في الـ wishlist
  const checkWishlist = useCallback(() => {
    if (email) {
      // التحقق من Supabase إذا كان المستخدم مسجلًا
      (async () => {
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
        } finally {
          setLoading(false);
        }
      })();
    } else {
      // التحقق من localStorage إذا لم يكن هناك مستخدم
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setLove(localWishlist.includes(product.id));
      setLoading(false);
    }
  }, [email, product.id]);

  useEffect(() => {
    checkWishlist();
  }, [checkWishlist]);

  // تحديث الـ wishlist
  const handleHeart = (e) => {
    e.stopPropagation(); // منع التنقل عند الضغط على القلب

    // تغيير الحالة مباشرة
    setLove((prevLove) => !prevLove);

    if (email) {
      // تحديث في Supabase
      updateWishlistInDatabase();
    } else {
      // تحديث في localStorage
      updateWishlistInLocalStorage();
    }
  };

  const updateWishlistInDatabase = useCallback(async () => {
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
    } catch (error) {
      console.error("Error updating wishlist:", error.message);
    }
  }, [email, love, product.id]);

  const updateWishlistInLocalStorage = () => {
    let localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (love) {
      // إزالة المنتج
      localWishlist = localWishlist.filter((id) => id !== product.id);
    } else {
      // إضافة المنتج
      localWishlist.push(product.id);
    }

    localStorage.setItem("wishlist", JSON.stringify(localWishlist));
    console.log("Wishlist updated in localStorage:", localWishlist);
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={200} />
      ) : (
        <div className="product-card-content">
          <div className="product-card-content-image">
            {slide ? (
              <Swiper className="product-card-content-sliders">
                {product.images.map((el, ind) => (
                  <SwiperSlide
                    className="product-card-content-slider"
                    key={ind}
                  >
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
            <div className="product-card-content-price">
              {product.discount ? (
                <>
                  <del className="product-card-content-old-price">
                    {product.discount} EGP
                  </del>
                  <span className="product-card-content-new-price">
                    {product.price} EGP
                  </span>
                </>
              ) : (
                <span>{product.price} EGP</span>
              )}
            </div>
          </div>
          <div className="product-card-content-heart" onClick={handleHeart}>
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
