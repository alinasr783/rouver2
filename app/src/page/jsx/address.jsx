import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js"; // استيراد supabase
import { getAuth, onAuthStateChanged } from "firebase/auth"; // استيراد Firebase
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import AddressItem from "./AddressItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "../css/address.css";

export default function Address() {
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [addresses, setAddresses] = useState([]); // بيانات العناوين ستأتي من Supabase
  const [email, setEmail] = useState(null); // لحفظ البريد الإلكتروني للمستخدم
  const location = useLocation();
  const back = "/profile/address"
  const navigate = useNavigate(); // لاستخدام التنقل

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentAddressId, setCurrentAddressId] = useState(null);

  // جلب العناوين من Supabase بعد التأكد من البريد الإلكتروني
  useEffect(() => {
    const fetchAddresses = async () => {
      if (email) {
        try {
          // استرجاع البيانات من Supabase باستخدام البريد الإلكتروني للمستخدم
          const { data, error } = await supabase
            .from("identity") // تحديد الجدول الذي يحتوي على العناوين
            .select("address")
            .eq("email", email); // استخدام البريد الإلكتروني الفعلي للمستخدم

          if (error) {
            console.error("Error fetching addresses:", error);
          } else {
            // إذا تم جلب البيانات بنجاح، نقوم بتحديث الحالة
            const fetchedAddresses = data?.[0]?.address || []; // استرجاع العناوين من الحقل
            setAddresses(fetchedAddresses);
          }
        } catch (err) {
          console.error("Unexpected error:", err);
        }
      }
    };

    fetchAddresses();
  }, [email]); // إعادة التنفيذ عند تغيير البريد الإلكتروني

  // الحصول على البريد الإلكتروني من Firebase
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email); // تعيين البريد الإلكتروني
      } else {
        setEmail(null);
        navigate("/login"); // إذا لم يكن هناك مستخدم، التوجيه إلى صفحة تسجيل الدخول
      }
    });

    return () => unsubscribe(); // إلغاء الاشتراك عند إزالة المكون
  }, [navigate]);

  // فتح القائمة
  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setCurrentAddressId(id);
  };

  // إغلاق القائمة
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentAddressId(null);
  };

  // حذف العنوان
  const handleDeleteAddress = () => {
    setAddresses((prev) => prev.filter((address) => address.id !== currentAddressId));
    handleCloseMenu();
  };

  // تغيير العنوان المحدد
  const handleAddressChange = (id) => {
    setSelectedAddress(id);
  };

  return (
    <div className="address">
      <Header title="Shipping Address" back="/profile" />
      <div className="address-content">
        <div className="container">
          {addresses.length > 0 ? (
            addresses.map(({ id, city, address, phone }) => (
              <div
                key={id}
                onClick={(event) => handleOpenMenu(event, id)}
                className="address-item-profile"
              >
                <AddressItem
                  id={id}
                  title={city}   // افتراض أن العنوان هو نفس "id"
                  city={city}
                  address={address}
                  phone={phone}
                  checked={selectedAddress === id}
                  onChange={() => handleAddressChange(id)}
                  selec={location.pathname}
                />
              </div>
            ))
          ) : (
            <p>No addresses available.</p> // إذا لم تكن هناك عناوين
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleDeleteAddress}>Delete Address</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Cancel</MenuItem>
          </Menu>

          <div className="add-address"  onClick={()=>navigate("/new-address", { state: { back }})}>
            <i className="fas fa-plus"></i>
            <span>Add New Shipping Address</span>
          </div>
        </div>

        {location.pathname !== "/profile/address" && (
          <button className="apply-button" >Apply</button>
        )}
      </div>
      <BottomHeader />
    </div>
  );
}