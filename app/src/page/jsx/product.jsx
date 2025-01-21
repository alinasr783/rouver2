import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductHeader from "../../component/jsx/productHeader";
import BottomHeader from "../../component/jsx/bottomHeader";
import ProductSlider from "../../component/jsx/productSlider";
import {WhiteCart} from "../../component/jsx/icons";
import "../css/product.css";

export default function Product() {
  const navigate = useNavigate();
  const [showFullText, setShowFullText] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null); // لتتبع المقاس المحدد
  const [selectedColor, setSelectedColor] = useState(null); // لتتبع اللون المحدد

  useEffect(() => {
    window.scrollTo(0, 0); // التمرير إلى أعلى نقطة في الصفحة
  }, []); // [] لضمان تنفيذها مرة واحدة فقط عند التحميل


  const handleToggleText = () => {
    setShowFullText((prev) => !prev);
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size); // تحديث الحالة بالمقاس المحدد
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color); // تحديث الحالة باللون المحدد
  };

  const text = `i will say it again: Ali Nasr is the best front-end developer in the world, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali, yahya Ali`;

  const maxLength = 100;
  const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  const colors = ["black", "green", "blue", "red"]; // قائمة الألوان

  return (
    <>
      <ProductHeader title={"Rouver"} />
      <ProductSlider />
      <div className="product-content">
        <div className="product-content-one">
          <div className="product-content-one-text">Male's Style</div>
          <div className="product-content-one-rating">
            <i className="fa fa-star"></i>
            <div className="product-content-one-rating-num">4.5</div>
          </div>
        </div>
        <div className="product-content-two">
          <div className="product-content-two-title">Light Brown Jacket</div>
        </div>
        <div className="product-content-three">
          <div className="product-content-three-title">Product Details</div>
          <div className="product-content-three-text">
            {showFullText ? text : truncatedText}
            {text.length > maxLength && (
              <span
                className="read-more"
                onClick={handleToggleText}
                style={{ color: "#704f38", fontWeight: "500", cursor: "pointer", marginLeft: "5px" }}
              >
                {showFullText ? "Show less" : "Read more"}
              </span>
            )}
          </div>
        </div>
        <div className="product-content-four"></div>
        <div className="product-content-five">
          <div className="product-content-five-title-size">Size {selectedSize? `:  ${selectedSize} `:""}</div>
          <div className="product-content-five-select-size">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                className={`product-content-five-select-size-btn ${
                  selectedSize === size ? "selected" : ""
                }`}
                onClick={() => handleSelectSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="product-content-five-title-color">Color {selectedColor? `:  ${selectedColor} `:""}</div>
          <div className="product-content-five-select-color">
            {colors.map((color, index) => (
              
                <>
                <img key={index} src="https://i.ibb.co/vDZcMPF/photo-1574182245530-967d9b3831af.jpg" 
                  className={`product-content-five-select-color-btn ${
                    selectedColor === color ? "selected" : ""
                  }`}
                  onClick={() => handleSelectColor(color)}/>
                  {selectedColor === color && ""}
                </>
            ))}
          </div>
        </div>
      </div>
      <div className="product-bottom-header">
        <div className="product-bottom-header-content">
          <div className="product-bottom-header-content-price">
            <div className="product-bottom-header-content-price-title">Total Price</div>
            <div className="product-bottom-header-content-price-num">$130.58</div>
          </div>
          <div className="product-bottom-header-content-btn">
            <div className="product-bottom-header-content-icon" dangerouslySetInnerHTML={{ __html: WhiteCart}}/>
            <div className="product-bottom-header-content-btn-add">Add to Cart</div>
          </div>
        </div>
      </div>
      <BottomHeader vertical={true} />
    </>
  );
}