import Skeleton from "@mui/material/Skeleton";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductHeader from "../../component/jsx/productHeader";
import BottomHeader from "../../component/jsx/bottomHeader";
import ProductSlider from "../../component/jsx/productSlider";
import { WhiteCart } from "../../component/jsx/icons";
import { supabase } from "../../lib/supabase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../css/product.css";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [email, setEmail] = useState(null);
  const [isProductInCart, setIsProductInCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAndUpdateProduct = async () => {
      try {
        // جلب بيانات المنتج من Supabase
        const { data: productData, error: fetchError } = await supabase
          .from("product")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        setProduct(productData);

        // زيادة عدد المشاهدين
        const updatedViewerCount = (productData.viewer || 0) + 1;

        const { error: updateError } = await supabase
          .from("product")
          .update({ viewer: updatedViewerCount })
          .eq("id", id);

        if (updateError) throw updateError;
      } catch (error) {
        console.error("Error fetching or updating product:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateProduct();
  }, [id]);

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

  useEffect(() => {
    const checkProductInCart = async () => {
      if (selectedSize && selectedColor && email) {
        try {
          const { data: cartData, error: cartError } = await supabase
            .from("cart")
            .select("products")
            .eq("email", email)
            .single();

          if (cartError) throw cartError;

          const isInCart = cartData?.products?.some(
            (product) =>
              product.size === selectedSize &&
              product.color === selectedColor &&
              product.id === id
          );

          setIsProductInCart(isInCart);
        } catch (error) {
          console.error("Error checking cart:", error.message);
        }
      }
    };

    checkProductInCart();
  }, [selectedSize, selectedColor, email, id]);


  const handleAddToCart = async () => {
    if (selectedColor && selectedSize && email) {
      const productDetails = {
        id: product.id,
        img: product.images[0],
        title: product.title,
        size: selectedSize,
        color: selectedColor,
        price: product.price,
        count: 1,
      };

      try {
        // جلب السلة من Supabase
        const { data: cartData, error: cartError } = await supabase
          .from("cart")
          .select("products")
          .eq("email", email)
          .single();

        if (cartError) throw cartError;

        let currentProducts = cartData?.products || [];

        // التحقق إذا كان المنتج موجودًا بالفعل في السلة
        const isInCart = currentProducts.some(
          (item) =>
            item.id === productDetails.id &&
            item.size === productDetails.size &&
            item.color === productDetails.color
        );

        if (isInCart) {
          console.log("The product is already in the cart");
          setIsProductInCart(true);
          return;
        }

        // إضافة المنتج إلى السلة
        currentProducts.push(productDetails);

        const { error: updateError } = await supabase
          .from("cart")
          .update({ products: currentProducts })
          .eq("email", email);

        if (updateError) throw updateError;

        console.log("Product added to cart successfully");
        setIsProductInCart(true);

        // زيادة عدد مرات الإضافة إلى السلة (added_cart)
        const { data: productData, error: fetchError } = await supabase
          .from("product")
          .select("added_cart")
          .eq("id", product.id)
          .single();

        if (fetchError) throw fetchError;

        const updatedAddedCartCount = (productData.added_cart || 0) + 1;

        const { error: updateCartCountError } = await supabase
          .from("product")
          .update({ added_cart: updatedAddedCartCount })
          .eq("id", product.id);

        if (updateCartCountError) throw updateCartCountError;

        console.log("Product added_cart count updated successfully");
      } catch (error) {
        console.error("Error updating cart or added_cart count:", error.message);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Skeleton variant="text" width="100%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={300} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="50%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={60} />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found!</div>;
  }

  const handleToggleText = () => {
    setShowFullText((prev) => !prev);
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
  };

  const maxLength = 100;
  const truncatedText =
    product.des?.length > maxLength
      ? product.des.substring(0, maxLength) + "..."
      : product.des;

  const colors = product.colors || [];

  return (
    <>
      <ProductHeader title={"Rouver"} />
      <ProductSlider images={product.images || []} />
      <div className="product-content">
        <div className="product-content-one">
          <div className="product-content-one-text">{product.category}</div>
          <div className="product-content-one-rating">
            <i className="fa fa-star"></i>
            <div className="product-content-one-rating-num">
              {product.rating || "No rating"}
            </div>
          </div>
        </div>
        <div className="product-content-two">
          <div className="product-content-two-title">{product.title}</div>
        </div>
        <div className="product-content-three">
          <div className="product-content-three-title">Product Details</div>
          <div className="product-content-three-text">
            {showFullText ? product.des : truncatedText}
            {product.des?.length > maxLength && (
              <span
                className="read-more"
                onClick={handleToggleText}
                style={{
                  color: "#704f38",
                  fontWeight: "500",
                  cursor: "pointer",
                  marginLeft: "5px",
                }}
              >
                {showFullText ? "Show less" : "Read more"}
              </span>
            )}
          </div>
        </div>
        <div className="product-content-five">
          <div className="product-content-five-title-size">
            Size {selectedSize ? `: ${selectedSize}` : ""}
          </div>
          <div className="product-content-five-select-size">
            {product.sizes?.map((size) => (
              <button
                key={size}
                className={`product-content-five-select-size-btn ${
                  selectedSize === size ? "selected" : ""
                }`}
                onClick={() => handleSelectSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="product-content-five-title-color">
            Color {selectedColor ? `: ${selectedColor}` : ""}
          </div>
          <div className="product-content-five-select-color">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`color-box ${
                  selectedColor === color.color ? "selected" : ""
                }`}
                onClick={() => handleSelectColor(color.color)}
              >
                <img className="color-box-img" src={color.url} alt="Color" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedColor && selectedSize && (

        <div className="product-bottom-header">
          <div className="product-bottom-header-content">
            {isProductInCart ? (
              <>
                <div className="product-bottom-header-content-price-title already-in-cart">
                  Already in Cart
                </div>
                <div
                  className="product-bottom-header-content-btn"
                  onClick={() => navigate("/cart")}
                >
                  <div
                    className="product-bottom-header-content-icon"
                    dangerouslySetInnerHTML={{ __html: WhiteCart }}
                  />
                  <div className="product-bottom-header-content-btn-add">
                    Go to Cart
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="product-bottom-header-content-price">
                  <div className="product-bottom-header-content-price-title">
                    Total Price
                  </div>
                  <div className="product-bottom-header-content-price-num">
                    ${product.price || "0.00"}
                  </div>
                </div>
                <div
                  className="product-bottom-header-content-btn"
                  onClick={()=>{handleAddToCart()}}
                >
                  <div
                    className="product-bottom-header-content-icon"
                    dangerouslySetInnerHTML={{ __html: WhiteCart }}
                  />
                  <div className="product-bottom-header-content-btn-add">
                    Add to Cart
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <BottomHeader vertical={selectedColor&&selectedSize} />
    </>
  );
}