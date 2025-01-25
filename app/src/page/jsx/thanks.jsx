import { useNavigate } from "react-router-dom";
import Header from "../../component/jsx/header.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import "@fortawesome/fontawesome-free/css/all.css";
import "../css/thanks.css"; // تأكد أن ملف CSS مضاف هنا

export default function Thanks() {
  const navigate = useNavigate();

  // دالة للتوجيه إلى صفحة الطلبات
  const handleViewOrder = () => {
    navigate("/orders");
  };

  return (
    <>
      <Header title={"Thanks"} />
      <div className="thanks-content">
        <div className="icon-container">
          <div className="check-icon">
            <i className="fas fa-check-circle"></i> {/* استخدام أيقونة FontAwesome */}
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
    </>
  );
}