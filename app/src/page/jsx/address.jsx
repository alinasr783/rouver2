import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import AddressItem from "./AddressItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "../css/address.css";

export default function Address() {
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [addresses, setAddresses] = useState([
    {
      id: "home",
      title: "Home",
      address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    },
    {
      id: "office",
      title: "Office",
      address: "4517 Washington Ave. Manchester, Kentucky 39495",
    },
    {
      id: "parents-house",
      title: "Parent's House",
      address: "8502 Preston Rd. Inglewood, Maine 98380",
    },
    {
      id: "friends-house",
      title: "Friend's House",
      address: "2464 Royal Ln. Mesa, New Jersey 45463",
    },
  ]);
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentAddressId, setCurrentAddressId] = useState(null);

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
          {addresses.map(({ id, title, address }) => (
            <div
              key={id}
              onClick={(event) => handleOpenMenu(event, id)}
              className="address-item-profile"
            >
              <AddressItem
                id={id}
                title={title}
                address={address}
                checked={selectedAddress === id}
                onChange={() => handleAddressChange(id)}
                selec={location.pathname}
              />
            </div>
          ))}

          {/* القائمة */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleDeleteAddress}>Delete Address</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Cancel</MenuItem>
          </Menu>

          {/* إضافة عنوان جديد */}
          <div className="add-address">
            <i className="fas fa-plus"></i>
            <span>Add New Shipping Address</span>
          </div>
        </div>

        {/* زر تطبيق */}
        {location.pathname !== "/profile/address" && (
          <button className="apply-button">Apply</button>
        )}
      </div>
      <BottomHeader />
    </div>
  );
}