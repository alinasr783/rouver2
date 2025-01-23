import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import "../css/cart.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";

export default function Cart() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState(null);
  const [total, setTotal] = useState(0);
  const deliveryFee = 10; // ثابت

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
    if (email) {
      (async () => {
        try {
          const { data, error } = await supabase
            .from("cart")
            .select("products")
            .eq("email", email)
            .single();

          if (error) {
            console.error("Error fetching cart:", error);
            setProducts([]); // إذا حدث خطأ، قم بتعيين مصفوفة فارغة
          } else {
            const productsArray = Array.isArray(data?.products) ? data.products : [];
            setProducts(productsArray); // تعيين المنتجات إذا كانت مصفوفة
          }
        } catch (err) {
          console.error("Unexpected error:", err);
          setProducts([]); // في حال وجود خطأ غير متوقع
        }
      })();
    }
  }, [email]);


  
  useEffect(() => {
    const subTotal = products.reduce((acc, item) => acc + item.price * item.count, 0);
    setTotal(subTotal);
  }, [products]);

  
  // زيادة الكمية
  const add = async (id) => {
    const updatedProducts = products.map((item) =>
      item.id === id ? { ...item, count: item.count + 1 } : item
    );
    setProducts(updatedProducts);

    // تحديث في Supabase
    try {
      const { error } = await supabase
        .from("cart")
        .update({ products: updatedProducts })
        .eq("email", email);

      if (error) {
        console.error("Error updating product count:", error.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  // تقليل الكمية
  const remove = async (id) => {
    const updatedProducts = products.map((item) =>
      item.id === id && item.count > 1
        ? { ...item, count: item.count - 1 }
        : item
    );
    setProducts(updatedProducts);

    // تحديث في Supabase
    try {
      const { error } = await supabase
        .from("cart")
        .update({ products: updatedProducts })
        .eq("email", email);

      if (error) {
        console.error("Error updating product count:", error.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  // حذف منتج
  const deleteItem = async (id) => {
    const updatedProducts = products.filter((item) => item.id !== id);
    setProducts(updatedProducts);

    // تحديث في Supabase
    try {
      const { error } = await supabase
        .from("cart")
        .update({ products: updatedProducts })
        .eq("email", email);

      if (error) {
        console.error("Error deleting product:", error.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  // الانتقال إلى صفحة الدفع
  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <>
      <Header title={"My Cart"} />
      <div className="cart-content">
        <div className="cart-content-items">
          <div className="cart-content-items-content">
            {products.map((el, index) => (
              <div className="cart-content-items-content-item" key={index}>
                <img
                  alt="Product image"
                  height="80"
                  src={`${el.img}`}
                  width="80"
                />
                <div className="cart-item-details">
                  <h3>{el.title}</h3>
                  <p>Size: {el.size}</p>
                  <p className="price">{el.price} EGP</p>
                </div>
                <div className="cart-item-quantity">
                  {el.count === 1 ? (
                    <button
                      onClick={() => deleteItem(el.id)}
                      className="delete-btn"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  ) : (
                    <button onClick={() => remove(el.id)}>
                      <i className="fas fa-minus"></i>
                    </button>
                  )}
                  <span>{el.count}</span>
                  <button onClick={() => add(el.id)}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cart-bottom">
        <div className="checkout-container">
          <div className="summary">
            <div>
              <span>Sub-Total</span>
              <span>{total.toFixed(2)} EGP</span>
            </div>
            <div>
              <span>Delivery Fee</span>
              <span>{deliveryFee.toFixed(2)} EGP</span>
            </div>
            <div>
              <span>Total Cost</span>
              <span>{(total + deliveryFee).toFixed(2)} EGP</span>
            </div>
          </div>
          <button className="checkout-button" onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>

      <BottomHeader vertical={true} />
    </>
  );
}