import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import AddressItem from "./AddressItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "../css/address.css";

export default function Address() {
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [addresses, setAddresses] = useState([]);
  const [email, setEmail] = useState(null);
  const location = useLocation();
  const back = "/profile/address";
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentAddressId, setCurrentAddressId] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (email) {
        try {
          const { data, error } = await supabase
            .from("identity")
            .select("address")
            .eq("email", email);

          if (!error) {
            const fetchedAddresses = data?.[0]?.address || [];
            setAddresses(fetchedAddresses);
          }
        } catch (err) {
          console.error("Unexpected error:", err);
        }
      }
    };

    fetchAddresses();
  }, [email]);

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

  const handleOpenMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setCurrentAddressId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentAddressId(null);
  };

  const handleDeleteAddress = async () => {
    if (!currentAddressId) return;

    try {
      // تحديث العناوين بعد إزالة العنوان المحدد
      const updatedAddresses = addresses.filter((address) => address.id !== currentAddressId);

      // إرسال العناوين المعدلة إلى Supabase
      const { error } = await supabase
        .from("identity")
        .update({ address: updatedAddresses })
        .eq("email", email);

      if (!error) {
        // تحديث الحالة بعد الحذف
        setAddresses(updatedAddresses);
        console.log("Address deleted successfully.");
      } else {
        console.error("Error updating addresses in Supabase:", error);
      }
    } catch (err) {
      console.error("Error deleting address:", err);
    } finally {
      handleCloseMenu();
    }
  };

  const handleAddressChange = (id) => {
    setSelectedAddress(id);
  };

  return (
    <div className="address">
      <Header title="Shipping Address" back="/profile" />
      <div className="address-content">
        <div className="container">
          {addresses.length > 0 ? (
            addresses.map(({ id, city, address, phone, full_name }) => (
              <div
                key={id}
                onClick={(event) => handleOpenMenu(event, id)}
                className="address-item-profile"
              >
                <AddressItem
                  id={id}
                  title={city}
                  city={city}
                  address={address}
                  phone={phone}
                  full_name={full_name}
                  checked={selectedAddress === id}
                  onChange={() => handleAddressChange(id)}
                  selec={location.pathname}
                />
              </div>
            ))
          ) : (
            <p>No addresses available.</p>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleDeleteAddress}>Delete Address</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Cancel</MenuItem>
          </Menu>

          <div className="add-address" onClick={() => navigate("/new-address", { state: { back } })}>
            <i className="fas fa-plus"></i>
            <span>Add New Shipping Address</span>
          </div>
        </div>

        {location.pathname !== "/profile/address" && (
          <button className="apply-button">Apply</button>
        )}
      </div>
      <BottomHeader />
    </div>
  );
}