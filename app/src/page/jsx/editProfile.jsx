import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../css/editProfile.css";

export default function EditProfile() {
  const [email, setEmail] = useState(null); // البريد الإلكتروني للمستخدم
  const [fullName, setFullName] = useState(""); // الاسم الكامل
  const [phone, setPhone] = useState(""); // رقم الهاتف
  const navigate = useNavigate();

  // جلب البريد الإلكتروني للمستخدم عند تسجيل الدخول
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

  // تحريك الشاشة للأعلى عند تحميل الصفحة
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // دالة حفظ البيانات في Supabase
  const handleSaveChanges = async () => {
    if (!email) {
      console.error("No email found, user not logged in.");
      return;
    }

    try {
      const { error } = await supabase
        .from("identity")
        .update({ fullName, phone }) // تحديث الاسم ورقم الهاتف
        .eq("email", email); // الشرط: البريد الإلكتروني

      if (error) throw error;

      console.log("Profile updated successfully!");
      navigate("/profile")
    } catch (error) {
      console.error("Error updating profile:", error.message);
      navigate("/profile")
    }
  };

  return (
    <>
      <Header title={"Complete Profile"} back={"/profile"} />
      <div className="edit-profile-content">
        <div className="edit-profile-content-one">
          <div className="edit-profile-content-one-img">
            <img
              src="https://i.ibb.co/b5DmQ0D/IMG-20241105-WA0030.jpg"
              alt="Ali Nasr"
              className="edit-profile-img"
            />
          </div>
          <div className="edit-profile-content-one-text">{fullName}</div>
        </div>
        <div className="edit-profile-content-two">
          <div className="signup-content-inputs">
            {/* إدخال الاسم الكامل */}
            <div className="signup-content-inputs-input-email">
              <div className="signup-content-inputs-input-title">Full Name</div>
              <input
                type="text"
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)} // تحديث القيمة
              />
              <div className="signup-content-inputs-input-error"></div>
            </div>

            {/* إدخال رقم الهاتف */}
            <div className="signup-content-inputs-input-password">
              <div className="signup-content-inputs-input-title">Phone Number</div>
              <input
                type="number"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} // تحديث القيمة
              />
              <div className="signup-content-inputs-input-error"></div>
            </div>
          </div>

          {/* زر الحفظ */}
          <div className="signup-content-button" onClick={handleSaveChanges}>
            Save Changes
          </div>
        </div>
      </div>
      <BottomHeader />
    </>
  );
}