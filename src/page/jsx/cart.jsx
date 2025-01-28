import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import "../css/cart.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import Skeleton from "@mui/material/Skeleton";

export default function Cart() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [total, setTotal] = useState(0);
  const deliveryFee = 10;

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
    if (email) {
      (async () => {
        try {
          const { data, error } = await supabase
            .from("cart")
            .select("products")
            .eq("email", email)
            .single();

          if (error || !data?.products?.length) {
            setProducts([]);
          } else {
            setProducts(data.products);
          }
        } catch {
          setProducts([]);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setProducts(cart);
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    const subTotal = products.reduce(
      (acc, item) => acc + item.price * item.count,
      0,
    );
    setTotal(subTotal);
  }, [products]);

  const add = async (id) => {
    const updatedProducts = products.map((item) =>
      item.id === id ? { ...item, count: item.count + 1 } : item,
    );
    setProducts(updatedProducts);

    if (email) {
      await supabase
        .from("cart")
        .update({ products: updatedProducts })
        .eq("email", email);
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedProducts));
    }
  };

  const remove = async (id) => {
    const updatedProducts = products.map((item) =>
      item.id === id && item.count > 1
        ? { ...item, count: item.count - 1 }
        : item,
    );
    setProducts(updatedProducts);

    if (email) {
      await supabase
        .from("cart")
        .update({ products: updatedProducts })
        .eq("email", email);
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedProducts));
    }
  };

  const deleteItem = async (id) => {
    const updatedProducts = products.filter((item) => item.id !== id);
    setProducts(updatedProducts);

    if (email) {
      await supabase
        .from("cart")
        .update({ products: updatedProducts })
        .eq("email", email);
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedProducts));
    }
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout", { state: { products } });
  };

  return (
    <>
      <Header title={"My Cart"} />
      <div className="cart-content">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : products.length === 0 ? (
          <div className="empty-cart">Your cart is empty</div>
        ) : (
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
        )}
      </div>
      {products.length > 0 && (
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
            <button
              className="checkout-button"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
      <BottomHeader vertical={products.length > 0} />
    </>
  );
}