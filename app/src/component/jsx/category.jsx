import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../css/category.css";
export default function Category(){
  const navigate = useNavigate();
  const [title , setTitle] = useState(["Sweets","T-shirts","Hoodies","Shoes","Bags","Accessories", "Watches"])
  const handleClick = (name) => {
    navigate(`/category/${name}`);
  }
  return(
    <>
      <div className="category">
        <div className="category-content">
          <div className="category-content-title">Category</div>
          <div className="category-content-items">
            <div className="category-content-items-item" onClick={()=>handleClick(title[0])}>
              <img src="https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[1])}>
              <img src="https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[2])}>
              <img src="https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[3])}>
              <img src="https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[4])}>
              <img src="https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[5])}>
              <img src="https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[6])}>
              <img src="https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[7])}>
              <img src="https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[8])}>
              <img src="https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[9])}>
              <img src="https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[10])}>
              <img src="https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}