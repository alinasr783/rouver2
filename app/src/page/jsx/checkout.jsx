import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "../../component/jsx/header.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import AddressItem from "./AddressItem";
import Skeleton from "@mui/material/Skeleton";
import "../css/checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation(); // استلام البيانات المرسلة من صفحة العربة
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [addresses, setAddresses] = useState([]); // استخدام Array لعرض كل العناوين
  const [selectedAddress, setSelectedAddress] = useState(null); // العنوان المختار
  const [products, setProducts] = useState(state?.products || []); // المنتجات المستلمة
  const back = "/checkout";

  // جلب العناوين من Supabase
  const getAddress = async () => {
    try {
      const { data, error } = await supabase
        .from("identity")
        .select("address")
        .eq("email", email)
        .single();

      if (error) {
        console.error("Error fetching addresses:", error);
        return;
      }

      if (data?.address?.length > 0) {
        setAddresses(data.address); // تخزين العناوين
        setSelectedAddress(data.address[0]); // افتراض العنوان الأول هو المختار
        setLoading(false);
      } else {
        navigate("/new-address", { state: { back, products } });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // متابعة حالة المستخدم
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

  // جلب العناوين بمجرد توفر البريد الإلكتروني
  useEffect(() => {
    if (email) {
      getAddress();
    }
  }, [email]);

  useEffect(() => {
    if (state?.selectedAddress) {
      setSelectedAddress(state.selectedAddress);
    }
  }, [state]);

  // عند اختيار عنوان جديد
  const handleAddressChange = (index) => {
    setSelectedAddress(addresses[index]);
  };

  return (
    <>
      <Header title={"Checkout"} back={"cart"} />
      <div className="checkout-content">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          <>
            <div className="choose-address">
              <div className="choose-address-title">Shipping Address</div>
              <div className="addresses-list">
                {selectedAddress ? (
                  <AddressItem
                    id={`selected-address`}
                    title={selectedAddress.full_name}
                    city={selectedAddress.city}
                    address={selectedAddress.address}
                    phone={selectedAddress.phone}
                    checked={true}
                    selec={location.pathname}
                  />
                ) : (
                  <p>No address selected.</p>
                )}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="empty-cart">Your cart is empty</div>
            ) : (
              <div className="checkout-content-items">
                <div className="checkout-content-items-content">
                  {products.map((el, index) => (
                    <div
                      className="checkout-content-items-content-item"
                      key={index}
                    >
                      <img
                        alt="Product image"
                        height="80"
                        src={`${el.img}`}
                        width="80"
                      />
                      <div className="checkout-item-details">
                        <h3>{el.title}</h3>
                        <p>Size: {el.size}</p>
                        <p className="price">{el.price} EGP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <BottomHeader />
    </>
  );
}