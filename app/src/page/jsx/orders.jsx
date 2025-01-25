import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import "../css/orders.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import Skeleton from "@mui/material/Skeleton";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);

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
            .from("order")
            .select("*")
            .eq("email", email);

          if (error) {
            setOrders([]);
          } else {
            setOrders(data);
          }
        } catch {
          setOrders([]);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [email]);

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to cancel order", error);
    } else {
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      ));
    }
  };

  return (
    <>
      <Header title={"My Orders"} />
      <div className="orders-content">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : orders.length === 0 ? (
          <div className="empty-orders">No orders found</div>
        ) : (

      <div className="cart-content-items">
        <div className="cart-content-items-content">
          {orders.map((el, index) => (
            <div className="cart-content-items-content-item" key={index}>
              <img
                alt="Product image"
                height="80"
                src={`${el.products[0].img}`}
                width="80"
              />
              <div className="cart-item-details">
                <h4>{el.products[0].title}</h4>
                <p>state : {el.state}</p>
                <strong>total price : {el.total_price} EGP</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
        )}
      </div>
      <BottomHeader />
    </>
  );
}