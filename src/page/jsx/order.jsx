import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Header from "../../component/jsx/header.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Skeleton from "@mui/material/Skeleton";
import "../css/order.css";

const steps = [
  "استني مكالمة خدمة العملاء ✨",
  "يتم تجهيز الاوردر 🌝",
  "جايلك في السكة 🥺",
  "وصل بسلامة 🥳",
];

export default function Order() {
  const { id } = useParams();
  const location = useLocation();
  const { order } = location.state || {}; // التأكد من أن هناك قيمة لـ order
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!order) {
      navigate("/orders"); // إذا لم تكن هناك بيانات order، ارجع إلى صفحة الطلبات.
    }
  }, [order, navigate]);

  return (
    <>
      <Header title={"Order Tracker"} back={"/orders"} />

      <div className="orders-content">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          order && (
            <>
              <div className="order-content-items">
                <div className="cart-content-items-content">
                  {order.products.map((product, index) => (
                    <div className="cart-content-items-content-item" key={index}>
                      <img
                        alt="Product image"
                        height="80"
                        src={product.img} // تأكد من أن المنتج يحتوي على خاصية img
                        width="80"
                      />
                      <div className="cart-item-details">
                        <h4>{product.title}</h4> {/* تأكد من أن المنتج يحتوي على خاصية title */}
                        <p>Size : {product.size} , Color : {product.color}</p>
                        <p>Price : {product.price} EGP</p> {/* استخدام السعر الإجمالي للطلب */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-details">
                <div className="order-details-content">
                  <div className="order-details-content-title">Order Details</div>
                  <div className="order-details-content-total">
                    Total Price : {order.total_price} EGP
                  </div>
                  <div className="order-details-content-status">
                    Status : {order.state}
                  </div>
                </div>
              </div>

              <>
                <div className="order-steper">
                  <div className="order-steper-content">
                    <div className="order-steper-content-title">حالة التوصيل  🚀</div>
                    <div className="order-steper-content-steps">
                      <Box sx={{ width: "80%" }}>
                        <Stepper
                          activeStep={steps.indexOf(order?.state || steps[1])} // الخطوة النشطة
                          orientation="vertical"
                        >
                          {steps.map((label, index) => (
                            <Step key={index} completed={index < order.step}> {/* الخطوات المكتملة */}
                              <StepLabel>
                                <div className="step-text">{label}</div>
                              </StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                      </Box>
                    </div>
                  </div>
                </div>
              </>
            </>
          )
        )}
      </div>
      <BottomHeader />
    </>
  );
}