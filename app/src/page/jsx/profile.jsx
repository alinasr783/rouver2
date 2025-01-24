import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // إضافة onAuthStateChanged
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "../css/profile.css";

function CircularIndeterminate() {
  return (
    <Box sx={{ display: "flex", color: "#704f38" }}>
      <CircularProgress sx={{ color: "#704f38" }} size={20} />
    </Box>
  );
}

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null); // البريد الإلكتروني للمستخدم
  const [fullName, setFullName] = useState(""); // تخزين الاسم الكامل
  const navigate = useNavigate();

  // جلب البريد الإلكتروني للمستخدم عند تسجيل الدخول
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

  // جلب بيانات المستخدم من Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (email) {
        try {
          const { data, error } = await supabase
            .from("identity") // اسم الجدول
            .select("fullName") // تحديد الحقل المطلوب
            .eq("email", email)
            .single();

          if (error) throw error;

          setFullName(data.fullName); // تحديث الاسم
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [email]);

  // دالة تسجيل الخروج
  const handleLogout = () => {
    setLoading(true);
    const auth = getAuth(); // جلب كائن المصادقة من Firebase
    signOut(auth)
      .then(() => {
        setLoading(false);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
        alert("An error occurred while logging out. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0); // التمرير إلى أعلى نقطة في الصفحة
  }, []);

  return (
    <>
      <Header title={"My Profile"} />
      <div className="profile-content">
        <div className="profile-content-one">
          <div className="profile-content-one-img">
            <img
              src="https://i.ibb.co/b5DmQ0D/IMG-20241105-WA0030.jpg"
              alt={fullName || "Profile"}
              className="profile-img"
            />
          </div>
          <div className="profile-content-one-text">
            {fullName || "Loading..."}
          </div>
        </div>
        <ul className="menu">
          <li className="menu-item" onClick={() => navigate("/profile/edit")}>
            <div>
              <i className="fas fa-user"></i>
              Edit profile
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
          <li className="menu-item" onClick={() => navigate("/profile/address")}>
            <div>
              <i className="fas fa-credit-card"></i>
              Addresses Manager
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
          <li className="menu-item" onClick={() => navigate("/orders")}>
            <div>
              <i className="fas fa-box"></i>
              My Orders
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
          <li className="menu-item" onClick={() => navigate("/profile/settings")}>
            <div>
              <i className="fas fa-cog"></i>
              Settings
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
          <li className="menu-item" onClick={() => navigate("/profile/help")}>
            <div>
              <i className="fas fa-question-circle"></i>
              Help Center
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
          <li className="menu-item" onClick={() => navigate("/profile/privacy")}>
            <div>
              <i className="fas fa-lock"></i>
              Privacy Policy
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
          <li className="menu-item">
            <div>
              <i className="fas fa-user-friends"></i>
              Invites Friends
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
          <li className="menu-item" onClick={handleLogout}>
            <div className="flex">
              <i className="fas fa-sign-out-alt"></i>
              {loading ? <CircularIndeterminate /> : "Logout"}
            </div>
            <i className="fas fa-chevron-right"></i>
          </li>
        </ul>
      </div>
      <BottomHeader />
    </>
  );
}