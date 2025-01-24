import React from "react";
import PropTypes from "prop-types";

const AddressItem = ({ id, title, city, address, phone, checked, onChange, selec }) => {
  return (
    <div className="address-item">
      <div className="address-info">
        <i className="fas fa-map-marker-alt"></i>
        <div className="address-text">
          <h3>{title}</h3>
          <p>{address}</p>
          <p>{phone}</p>
        </div>
      </div>
      {selec === "/profile/address" ? (
        "" // لا يتم عرض أي شيء إذا كانت الصفحة /profile/address
      ) : selec === "/checkout" ? (
        <div className="change-button">
          <button className="change-btn">
            Change
          </button>
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
  selec: PropTypes.string.isRequired, // تم التأكد من أن selec مطلوب
};

export default React.memo(AddressItem);