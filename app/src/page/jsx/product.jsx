import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductHeader from "../../component/jsx/productHeader";
import BottomHeader from "../../component/jsx/bottomHeader";
import ProductSlider from "../../component/jsx/productSlider";
import { WhiteCart } from "../../component/jsx/icons";
import { supabase } from "../../lib/supabase.js";
import "../css/product.css";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("product")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found!</div>;
  }

  const handleToggleText = () => {
    setShowFullText((prev) => !prev);
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
  };

  const maxLength = 100;
  const truncatedText =
    product.des?.length > maxLength
      ? product.des.substring(0, maxLength) + "..."
      : product.des;

  const colors = product.colors || ["black", "green", "blue", "red"];

  return (
    <>
      <ProductHeader title={"Rouver"} />
      <ProductSlider images={product.images || []} />
      <div className="product-content">
        <div className="product-content-one">
          <div className="product-content-one-text">{product.category}</div>
          <div className="product-content-one-rating">
            <i className="fa fa-star"></i>
            <div className="product-content-one-rating-num">
              {product.rating || "No rating"}
            </div>
          </div>
        </div>
        <div className="product-content-two">
          <div className="product-content-two-title">{product.title}</div>
        </div>
        <div className="product-content-three">
          <div className="product-content-three-title">Product Details</div>
          <div className="product-content-three-text">
            {showFullText ? product.des : truncatedText}
            {product.des?.length > maxLength && (
              <span
                className="read-more"
                onClick={handleToggleText}
                style={{
                  color: "#704f38",
                  fontWeight: "500",
                  cursor: "pointer",
                  marginLeft: "5px",
                }}
              >
                {showFullText ? "Show less" : "Read more"}
              </span>
            )}
          </div>
        </div>
        <div className="product-content-five">
          <div className="product-content-five-title-size">
            Size {selectedSize ? `: ${selectedSize}` : ""}
          </div>
          <div className="product-content-five-select-size">
            {product.sizes?.map((size) => (
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
          <div className="product-content-five-title-color">
            Color {selectedColor ? `: ${selectedColor}` : ""}
          </div>
          <div className="product-content-five-select-color">
            {colors.map((color, index) => (
              <img
                key={index}
                src={product.color_images?.[color] || "default_image_url"}
                alt={color}
                className={`product-content-five-select-color-btn ${
                  selectedColor === color ? "selected" : ""
                }`}
                onClick={() => handleSelectColor(color)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="product-bottom-header">
        <div className="product-bottom-header-content">
          <div className="product-bottom-header-content-price">
            <div className="product-bottom-header-content-price-title">
              Total Price
            </div>
            <div className="product-bottom-header-content-price-num">
              ${product.price || "0.00"}
            </div>
          </div>
          <div className="product-bottom-header-content-btn">
            <div
              className="product-bottom-header-content-icon"
              dangerouslySetInnerHTML={{ __html: WhiteCart }}
            />
            <div className="product-bottom-header-content-btn-add">
              Add to Cart
            </div>
          </div>
        </div>
      </div>
      <BottomHeader vertical={true} />
    </>
  );
}