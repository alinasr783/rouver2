import React, { useState } from "react";
import PropTypes from "prop-types";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const AddressItem = ({ id, title, city, address, phone, checked, onChange, selec, onAddressSelect, addresses , full_name}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // فتح القائمة عند الضغط على زر Change
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // إغلاق القائمة
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div className="address-item">
      <div className="address-info">
        <i className="fas fa-map-marker-alt"></i>
        <div className="address-text">
          <h3>{title}</h3>
          <p>{address}</p>
          <p>{phone}, {full_name}</p>
        </div>
      </div>
      {selec === "/profile/address" ? (
        "" // لا يتم عرض أي شيء إذا كانت الصفحة /profile/address
      ) : selec === "/checkout" ? (
        <div className="change-button">
          <button className="change-btn" onClick={handleOpenMenu}>
            Change
          </button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            {addresses.map((addr, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  onAddressSelect(addr); // تعيين العنوان الجديد
                  handleCloseMenu(); // إغلاق القائمة
                }}
              >
                {addr.city} - {addr.address}
              </MenuItem>
            ))}
          </Menu>
        </div>
      ) : (
        <div className="radio-button">
          <input
            type="radio"
            id={id}
            name="address"
            checked={checked}
            onChange={onChange}
          />
          <label htmlFor={id}>
            <span className="radio-button-center"></span>
          </label>
        </div>
      )}
    </div>
  );
};

AddressItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  selec: PropTypes.string.isRequired,
  onAddressSelect: PropTypes.func.isRequired, // دالة اختيار عنوان جديد
  addresses: PropTypes.array.isRequired, // قائمة العناوين
};

export default React.memo(AddressItem);