import React from "react";
import PropTypes from "prop-types";

const AddressItem = ({ id, title, address, checked, onChange, selec }) => {
  return (
    <div className="address-item">
      <div className="address-info">
        <i className="fas fa-map-marker-alt"></i>
        <div className="address-text">
          <h4>{title}</h4>
          <p>{address}</p>
        </div>
      </div>
      {selec === "/profile/address" ? "" : (
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
  address: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default React.memo(AddressItem);