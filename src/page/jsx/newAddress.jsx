import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "../../component/jsx/header.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import "../css/newAddress.css";

export default function NewAddress() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [email, setEmail] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [products, setProducts] = useState(state?.products || []); // Ensure correct state name

  // Get user email from Firebase
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

  const handleSubmit = async () => {
    const newAddress = {
      city: city,
      address: address,
      full_name: fullName,
      phone: phone,
    };

    // طباعة القيم للتحقق
    console.log("Full Name:", fullName);
    console.log("Phone:", phone);
    console.log("City:", city);
    console.log("Address:", address);

    // تحقق من الحقول المطلوبة فقط بدون email
    if (fullName && phone && address && city) {
      try {
        const { data, error } = await supabase
          .from("identity")
          .select("address")
          .eq("email", email)
          .limit(1);

        if (error) {
          console.error("Error fetching address:", error);
          return;
        }

        const newAddress = {
          city: city,
          address: address,
          full_name: fullName,
          phone: phone,
        };

        let updatedAddresses = data?.address || [];
        updatedAddresses.push(newAddress);

        const { error: updateError } = await supabase
          .from("identity")
          .update({ address: updatedAddresses })
          .eq("email", email);

        if (updateError) {
          console.error("Error updating address:", updateError);
        } else {
          // حفظ العنوان في localStorage أيضًا
          const savedAddresses =
            JSON.parse(localStorage.getItem("address")) || [];
          savedAddresses.push(newAddress);
          localStorage.setItem("address", JSON.stringify(savedAddresses));
          navigate(state?.back ? state.back : "/profile/address", {
            state: { products },
          });
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    } else {
    }
  };

  return (
    <>
      <Header title={"Add New Address"} back={"/profile/address"} />
      <div className="new-address-content">
        <div className="new-address-content-inputs">
          <div className="new-address-content-inputs-input-full-name">
            <div className="new-address-content-inputs-input-title">
              Full Name
            </div>
            <input
              type="text"
              placeholder="Enter your full name"
              onChange={(e) => {
                setFullName(e.target.value);
              }}
            />
          </div>
          <div className="new-address-content-inputs-input-phone">
            <div className="new-address-content-inputs-input-title">
              Phone Number
            </div>
            <input
              type="number"
              placeholder="Enter your phone number"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </div>
          <div className="new-address-content-inputs-input-phone">
            <div className="new-address-content-inputs-input-title">City</div>
            <input
              type="text"
              placeholder="Enter your City"
              onChange={(e) => {
                setCity(e.target.value);
              }}
            />
          </div>
          <div className="new-address-content-inputs-input-phone">
            <div className="new-address-content-inputs-input-title">
              Address
            </div>
            <input
              type="text"
              placeholder="Enter your Address"
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="new-address-content-button" onClick={handleSubmit}>
          Done
        </div>
      </div>
    </>
  );
}
