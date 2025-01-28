import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "../../component/jsx/header.jsx";
import "@fortawesome/fontawesome-free/css/all.css";
import "../css/thanks.css";

export default function Thanks() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setShowPopup(true); // إظهار الـ popup إذا لم يكن هناك مستخدم
      }
    });

    return () => unsubscribe();
  }, []);

  // التوجيه إلى صفحة الطلبات
  const handleViewOrder = () => {
    navigate("/orders");
  };

  // التوجيه إلى صفحة التسجيل
  const handleSignUp = () => {
    setShowPopup(false); // إغلاق النافذة
    navigate("/signup");
  };

  return (
    <>
      <Header title={"Thanks"} />
      <div className="thanks-content">
        <div className="icon-container">
          <div className="check-icon">
            <i className="fas fa-check-circle"></i>
          </div>
        </div>

        <div className="order-success-message">
          <h2>Ordered Successfully!</h2>
        </div>

        <div className="view-order-button">
          <button onClick={handleViewOrder} className="view-order-btn">
            View Order
          </button>
        </div>
      </div>

      {/* نافذة منبثقة إذا لم يكن المستخدم مسجل حسابًا */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Sign Up Now!</h3>
            <p>Create an account to <strong>track your orders</strong> and get <strong>exclusive offers</strong></p>
            <button onClick={handleSignUp} className="signup-btn">
              Sign Up Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}