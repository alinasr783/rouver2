import Skeleton from "@mui/material/Skeleton";
import React, { useState, useEffect,useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCard from "../../component/jsx/productCard.jsx";
import ProductHeader from "../../component/jsx/productHeader";
import BottomHeader from "../../component/jsx/bottomHeader";
import ProductSlider from "../../component/jsx/productSlider";
import { WhiteCart } from "../../component/jsx/icons";
import { supabase } from "../../lib/supabase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify"; // استيراد toast لعرض الرسائل
import "react-toastify/dist/ReactToastify.css"; // استيراد ستايل الرسائل
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
  const [reProduct, setReProduct] = useState(null);
  const [rePrice, setRePrice] = useState(0);
  const navigate = useNavigate();
  const [selectedSize1, setSelectedSize1] = useState(null);
  const [selectedColor1, setSelectedColor1] = useState(null);
  const [selectedSize2, setSelectedSize2] = useState(null);
  const [selectedColor2, setSelectedColor2] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAndUpdateProduct = async () => {
      try {
        // جلب بيانات المنتج من Supabase
        const { data: productData, error: fetchError } = await supabase
          .from("product")
          .select("*")
          .eq("id", id);

        if (fetchError) throw fetchError;

        // التحقق من وجود بيانات
        if (!productData || productData.length === 0) {
          throw new Error("Product not found");
        }

        // إذا كان هناك أكثر من صف، نستخدم الأول
        const product = productData[0];
        setProduct(product);

        // زيادة عدد المشاهدين
        const updatedViewerCount = (product.viewer || 0) + 1;

        const { error: updateError } = await supabase
          .from("product")
          .update({ viewer: updatedViewerCount })
          .eq("id", id);

        if (updateError) throw updateError;

        // استرجاع products
        const products = product.products;
        if (products && products.length > 0) {
          const relatedProductId = products[0].id;
          const relatedProductPrice = products[0].price;

          // استرجاع reproduct
          const { data: reproductData, error: reproductError } = await supabase
            .from("product")
            .select("*")
            .eq("id", relatedProductId);

          if (reproductError) throw reproductError;

          // التحقق من وجود reproductData
          if (!reproductData || reproductData.length === 0) {
            throw new Error("Related product not found");
          }

          const reproduct = reproductData[0];
          setReProduct(reproduct);
          setRePrice(relatedProductPrice);
        }
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
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const checkProductInCart = async () => {
      if (selectedSize && selectedColor) {
        try {
          if (email) {
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
                product.id === id,
            );

            setIsProductInCart(isInCart);
          } else {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const isInCart = cart.some(
              (product) =>
                product.size === selectedSize &&
                product.color === selectedColor &&
                product.id === id,
            );

            setIsProductInCart(isInCart);
          }
        } catch (error) {
          console.error("Error checking cart:", error.message);
        }
      }
    };

    checkProductInCart();
  }, [selectedSize, selectedColor, email, id]);

  const handleAddToCart = async () => {
    if (selectedColor && selectedSize) {
      // البحث عن الصورة المناسبة للون المحدد
      const selectedColorImage = product.colors.find(
        (color) => color.color === selectedColor,
      )?.url;

      // إنشاء كائن تفاصيل المنتج مع الصورة المحددة
      const productDetails = {
        id: product.id,
        img: selectedColorImage || product.images[0], // استخدام صورة اللون المحدد أو الصورة الأولى كبديل
        title: product.title,
        size: selectedSize,
        color: selectedColor,
        price: product.price,
        count: 1,
      };

      try {
        if (email) {
          // للمستخدمين المسجلين
          const { data: cartData, error: cartError } = await supabase
            .from("cart")
            .select("products")
            .eq("email", email)
            .single();

          if (cartError) throw cartError;

          let currentProducts = cartData?.products || [];

          const isInCart = currentProducts.some(
            (item) =>
              item.id === productDetails.id &&
              item.size === productDetails.size &&
              item.color === productDetails.color,
          );

          if (isInCart) {
            console.log("The product is already in the cart");
            setIsProductInCart(true);
            return;
          }

          currentProducts.push(productDetails);

          const { error: updateError } = await supabase
            .from("cart")
            .update({ products: currentProducts })
            .eq("email", email);

          if (updateError) throw updateError;

          console.log("Product added to cart successfully");
          setIsProductInCart(true);
        } else {
          // للمستخدمين الضيوف
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          const isInCart = cart.some(
            (item) =>
              item.id === productDetails.id &&
              item.size === productDetails.size &&
              item.color === productDetails.color,
          );

          if (isInCart) {
            console.log("The product is already in the cart");
            setIsProductInCart(true);
            return;
          }

          cart.push(productDetails);
          localStorage.setItem("cart", JSON.stringify(cart));

          console.log("Product added to cart successfully");
          setIsProductInCart(true);
        }

        // تحديث عدد مرات إضافة المنتج إلى السلة
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
        console.error("Error adding product to cart:", error.message);
      }
    }
  };

  const handleOrderNow = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color before ordering", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    // البحث عن الصورة المناسبة للون المحدد
    const selectedColorImage = product.colors.find(
      (color) => color.color === selectedColor,
    )?.url;

    // إنشاء كائن المنتج للطلب مع الصورة المحددة
    const orderProduct = {
      id: product.id,
      img: selectedColorImage || product.images[0], // استخدام صورة اللون المحدد أو الصورة الأولى كبديل
      title: product.title,
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      count: 1,
    };

    navigate("/checkout", { state: { products: [orderProduct] } });
  };

  const handle2OrderNow = () => {
    setShowPopup(true);
  };
  const handle2SelectSize = (size, productIndex) => {
    if (productIndex === 1) {
      setSelectedSize1(size);
    } else {
      setSelectedSize2(size);
    }
  };

  const handle2SelectColor = (color, productIndex) => {
    if (productIndex === 1) {
      setSelectedColor1(color);
    } else {
      setSelectedColor2(color);
    }
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
  };

  const handleProceedToCheckout = () => {
    if (!selectedSize1 || !selectedColor1 || !selectedSize2 || !selectedColor2) {
      toast.error("Please select both size and color for both products before ordering", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    const selectedColorImage1 = product.colors.find(
      (color) => color.color === selectedColor1,
    )?.url;

    const selectedColorImage2 = reProduct.colors.find(
      (color) => color.color === selectedColor2,
    )?.url;

    const orderProduct1 = {
      id: product.id,
      img: selectedColorImage1 || product.images[0],
      title: product.title,
      size: selectedSize1,
      color: selectedColor1,
      price: product.price,
      count: 1,
    };

    const orderProduct2 = {
      id: reProduct.id,
      img: selectedColorImage2 || reProduct.images[0],
      title: reProduct.title,
      size: selectedSize2,
      color: selectedColor2,
      price: reProduct.price,
      count: 1,
    };

    navigate("/checkout", { state: { products: [orderProduct1, orderProduct2] } });
  };



  const Popup = ({ onClose, onProceed }) => {
    const handleSelectSize = (size, productIndex) => {
      if (productIndex === 1) {
        setSelectedSize1(size);
      } else if (productIndex === 2) {
        setSelectedSize2(size);
      }
    };

    const handleSelectColor = (color, productIndex) => {
      if (productIndex === 1) {
        setSelectedColor1(color);
      } else if (productIndex === 2) {
        setSelectedColor2(color);
      }
    };

    return (
      <div className="popup-overlay-b">
        <div className="popup-content-b">
          <div className="popup-header-b">
            <h2>Select Size & Color</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="popup-body-b">
            {[product, reProduct].map((item, index) => (
              <div key={index} className="product-selection">
                <h3>{item.title}</h3>
                <div className="size-selection">
                  <h4 className="product-content-five-title-size">
                    Size ==> {index === 0 ? selectedSize1 : selectedSize2}
                  </h4>
                  <div className="product-content-five-select-size">
                    {item.sizes?.map((size) => (
                      <button
                        key={size}
                        className={`product-content-five-select-size-btn ${index === 0 ? selectedSize1 === size : selectedSize2 === size ? "selected" : ""}`}
                        onClick={() => handleSelectSize(size, index + 1)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="color-selection">
                  <h4 className="product-content-five-title-color">
                    Color ==> {index === 0 ? selectedColor1 : selectedColor2}
                  </h4>
                  <div className="product-content-five-select-color">
                    {item.colors.map((color, i) => (
                      <div
                        key={i}
                        className={`product-content-five-select-color-btn ${index === 0 ? selectedColor1 === color.color : selectedColor2 === color.color ? "selected" : ""}`}
                        onClick={() => handleSelectColor(color.color, index + 1)}
                      >
                        <img className="color-box-img" src={color.url} alt="Color" />
                      </div>
                    ))}
                  </div>
                </div>
                {index === 0 && <hr className="product-selection-divider" />}
              </div>
            ))}
          </div>
          <div className="popup-footer">
            <button className="proceed-btn" onClick={onProceed}>Proceed to checkout</button>
          </div>
        </div>
      </div>
    );
  };











  


  

  if (loading) {
    return (
      <div className="loading-skeleton">
        <Skeleton variant="text" width="100%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={300} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="50%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={60} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="no-product-message">
        <p>Product not found! Please try again later.</p>
      </div>
    );
  }

  const handleToggleText = () => {
    setShowFullText((prev) => !prev);
  };

  const maxLength = 100;
  const truncatedText =
    product.des?.length > maxLength
      ? product.des.substring(0, maxLength) + "..."
      : product.des;

  const colors = product.colors || [];

  return (
    <>
      <ProductHeader title={"Rouver"} product={product} />
      <ProductSlider images={product.images || []} />
      <ToastContainer /> {/* إضافة ToastContainer هنا */}
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
                } ${!selectedSize ? "required-field" : ""}`}
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
                } ${!selectedColor ? "required-field" : ""}`}
                onClick={() => handleSelectColor(color.color)}
              >
                <img className="color-box-img" src={color.url} alt="Color" />
              </div>
            ))}
          </div>
        </div>
        <div className="product-content-six">
          <div className="product-content-six-content">
            <button
              className="product-content-six-content-btn"
              onClick={handleOrderNow}
            >
              Order Now
            </button>
          </div>
        </div>
        {reProduct &&(

        <div className="product-content-seven">
          <div className="product-content-seven-content">
            <div className="product-content-seven-content-title">
              أشتري دول مع بعض
            </div>
            <div className="product-content-seven-content-cards">
              <div className="product-content-seven-content-card">
              <ProductCard key={product.id} product={product} slide={true} />
              <i className="fa fa-plus"></i>
              <ProductCard key={reProduct.id} product={reProduct} slide={true} />
            </div>
            </div>
            <div className="product-content-seven-btn">
              <div className="product-content-seven-content">
                <button
                  className="product-content-seven-content-btn-2"
                  onClick={handle2OrderNow}
                >
                  Order Now by {rePrice} EGP
                </button>
              </div>
            </div>
          </div>
          {showPopup && (
            <Popup
              onClose={() => setShowPopup(false)}
              onProceed={handleProceedToCheckout}
            />
          )}
        </div>
        )}
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
                  <button className="product-bottom-header-content-btn-add">
                    Go to Cart
                  </button>
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
                <button
                  className="product-bottom-header-content-btn"
                  onClick={handleAddToCart}
                >
                  <div
                    className="product-bottom-header-content-icon"
                    dangerouslySetInnerHTML={{ __html: WhiteCart }}
                  />
                  <button className="product-bottom-header-content-btn-add">
                    Add to Cart
                  </button>
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <BottomHeader vertical={selectedColor && selectedSize} />
      <ToastContainer />
    </>
  );
}
