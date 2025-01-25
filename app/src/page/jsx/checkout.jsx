import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "../../component/jsx/header.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Skeleton from "@mui/material/Skeleton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import "../css/checkout.css";

function CircularIndeterminate() {
  return (
    <Box sx={{ display: "flex", color: "#fff" }}>
      <CircularProgress sx={{ color: "white" }} size={25} />
    </Box>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [products, setProducts] = useState(state?.products || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
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
        setAddresses(data.address);
        setSelectedAddress(data.address[0]);
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

  // فتح الحوار
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // غلق الحوار
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // اختيار عنوان جديد
  const handleSelectAddress = (newAddress) => {
    setSelectedAddress(newAddress);
    setDialogOpen(false);
  };

  // إرسال الطلب إلى Supabase
  const handleMakeOrder = async () => {
    if (!selectedAddress || products.length === 0) {
      alert("Please select an address and ensure your cart is not empty.");
      return;
    }

    setBtnLoading(true);

    try {
      // حساب إجمالي السعر
      const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

      // إرسال الطلب إلى جدول "order"
      const { error } = await supabase.from("order").insert([
        {
          products: products,
          state: "under read",
          total_price: totalPrice + 10,
          full_name: selectedAddress.full_name,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          email: email,
        },
      ]);

      if (error) {
        console.error("Error creating order:", error);
        alert("An error occurred while creating your order. Please try again.");
        setBtnLoading(false);
        return;
      }

      // تحديث جدول المنتجات لزيادة عدد الطلبات
      for (let product of products) {
        const { data: productData, error: fetchError } = await supabase
          .from("product")
          .select("added_cart, orders")
          .eq("id", product.id)
          .single();

        if (fetchError) throw fetchError;

        const updatedAddedCartCount = (productData.added_cart || 0) + 1;
        const updatedOrdersCount = (productData.orders || 0) + 1;

        // تحديث عدد مرات الإضافة إلى السلة وعدد الطلبات
        const { error: updateError } = await supabase
          .from("product")
          .update({
            added_cart: updatedAddedCartCount,
            orders: updatedOrdersCount,
          })
          .eq("id", product.id);

        if (updateError) throw updateError;
      }

      // الانتقال إلى صفحة الشكر
      navigate("/thanks");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      <Header title={"Checkout"} back={"/cart"} />
      <div className="checkout-content">
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={200} />
        ) : (
          <>
            <div className="choose-address">
              <div className="choose-address-title">Shipping Address</div>
              <div className="addresses-list">
                {selectedAddress ? (
                  <div className="address-item">
                    <div className="address-info">
                      <i className="fas fa-map-marker-alt"></i>
                      <div className="address-text">
                        <h3>{selectedAddress.full_name}</h3>
                        <p>{selectedAddress.city}</p>
                        <p>{selectedAddress.address}</p>
                        <p>{selectedAddress.phone}</p>
                      </div>
                    </div>
                    <div className="change-button">
                      <button className="change-btn" onClick={handleOpenDialog}>
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>No address selected.</p>
                )}
              </div>
            </div>

            {/* Dialog لاختيار عنوان جديد */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
              <DialogTitle>Choose Shipping Address</DialogTitle>
              <DialogContent>
                <RadioGroup>
                  {addresses.map((address, index) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio />}
                      label={`${address.city}, ${address.address}`}
                      onClick={() => handleSelectAddress(address)}
                    />
                  ))}
                </RadioGroup>
                {/* زر "Add New Address" داخل الـ Dialog */}
                <div className="add-address" onClick={() => navigate("/new-address", { state: { back } })}>
                  <i className="fas fa-plus"></i>
                  <span>Add New Address</span>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

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
      <div className="checkout-content-button" onClick={handleMakeOrder}>
        {btnLoading ? <CircularIndeterminate /> : "Make Order"}
      </div>
    </>
  );
}