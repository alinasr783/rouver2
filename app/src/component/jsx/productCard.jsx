import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartColored } from "./icons";
import "../css/productCard.css";
import "swiper/css";
export default function ProductCard({ product, slide }){
  const navigate = useNavigate();
  return(
    <>
      <div className="product-card" onClick={()=>{navigate(`/product/${product.id}`)}}>
        <div className="product-card-content">
          <div className="product-card-content-image">
            {slide ?   <Swiper className="product-card-content-sliders">
              <SwiperSlide className="product-card-content-slider">
                <img src={`${product.img}`} className="product-card-content-slider-img"/>
              </SwiperSlide>
              <SwiperSlide className="product-card-content-slider">
                <img src={`${product.img}`}/>
              </SwiperSlide>
              <SwiperSlide className="product-card-content-slider">
                <img src={`${product.img}`}/>
              </SwiperSlide>
              <SwiperSlide className="product-card-content-slider">
                <img src={`${product.img}`}/>
              </SwiperSlide>
            </Swiper>
            :
              <img src={`${product.img}`}/>
            }
          </div>
          <div className="product-card-content-top">
            <div className="product-card-content-title">{product.title}</div>
            <div className="product-card-content-rating">
              <i className="fa fa-star"></i>
              <div className="product-card-content-rating-number">{product.rating}</div>
            </div>
          </div>
          <div className="product-card-content-bottom">
            <div className="product-card-content-price">${product.price}</div>
          </div>
          <div className="product-card-content-heart">
            <div className="product-card-content-heart-icon" dangerouslySetInnerHTML={{ __html: HeartColored}}/>
          </div>
        </div>
      </div>
    </>
  )
}