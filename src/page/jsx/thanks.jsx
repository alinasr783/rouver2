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
        <div className="order-success-message">
          <p>الاوردر اتسجل 🤍</p>
          <p>بعد نص ساعة بظبط خبراء التغليف اليابانيين 🐉⛩️</p>
          <p>عندنا بيبداءو يفحصو منتج حضرتك بكل عناية وحرص 🫶</p>
          <p>وبعد كدا بيتغلف ويتحط في أمن مكان في عربية الشحن 🚛</p>
          <p>جنب السواق ✨</p>
          <p>ويعدي بقي برحلة طويييييييييلللللة ويطلع الجبال 🏔️ والهضاب🪨 والتلال 🌋 والسهول🌊 والأعاصير 🌪️</p>
          <p>لحد ما يوصل لاحسن عميل عندنا ❤️</p>
          <p>سالم غانم 😮‍💨🥳</p>
          <p>لكن كل ده مش هيحصل غير لو رديت علي خدمة العملاء بكرا عشان تأكيد الاوردر 🫠</p>
          <p>ف لو سمحت خلي تلفونك قريب منك بليبيييييييييييز 🥺</p>
          <p>وعايزين نعرف رايك في المنتج يا عسل 😘</p>
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
            <h3>🫶 اهلا بيك معانا</h3>
            <p>سجل حساب دوقتي و استمتع بي  أفضل العروض والخصومات قبل اي حد ❤️</p>
            <button onClick={handleSignUp} className="signup-btn">
               🔥 سجل دلوقتي
            </button>
          </div>
        </div>
      )}
    </>
  );
}