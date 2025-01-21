import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartColored } from './icons';
import "../css/productHeader.css";
export default function ProductHeader({ title }){
  const navigate = useNavigate();
  return(
    <>
      <div className="product-header">
        <div className="product-header-content">
          <div className="product-header-content-back" onClick={()=>navigate("/")}>
            <i className="fa fa-arrow-left"></i>
          </div>
          <div className="product-header-content-title">{title}</div>
          <div className='product-header-content-heart'>
            <div className="product-header-content-heart-icon" dangerouslySetInnerHTML={{ __html: HeartColored}}/>
          </div>
        </div>
      </div>
    </>
  )
}