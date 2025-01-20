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
              <img src="https://i.ibb.co/WGxhYzF/e17ab9681bec36303a67cd0e13a7b170.gif" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[1])}>
              <img src="https://i.ibb.co/7yfjRy7/68f26ba6aa479d9b5d520b6745c05786.gif" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[2])}>
              <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTlrOGlnM3B6a2JwNXB3aWszNHFpNTl4NTBmeTI2Y204b2xmZXlwZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3MC2ZFkYPmx8c/giphy.gif" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[3])}>
              <img src="https://i.ibb.co/WGxhYzF/e17ab9681bec36303a67cd0e13a7b170.gif" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[4])}>
              <img src="https://i.ibb.co/WGxhYzF/e17ab9681bec36303a67cd0e13a7b170.gif" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[5])}>
              <img src="https://i.ibb.co/WGxhYzF/e17ab9681bec36303a67cd0e13a7b170.gif" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[6])}>
              <img src="https://i.ibb.co/WGxhYzF/e17ab9681bec36303a67cd0e13a7b170.gif" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[7])}>
              <img src="https://i.ibb.co/WGxhYzF/e17ab9681bec36303a67cd0e13a7b170.gif" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[8])}>
              <img src="https://i.ibb.co/WGxhYzF/e17ab9681bec36303a67cd0e13a7b170.gif" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[9])}>
              <img src="https://i.ibb.co/WGxhYzF/e17ab9681bec36303a67cd0e13a7b170.gif" />
            </div>
            <div className="category-content-items-item" onClick={()=>handleClick(title[10])}>
              <img src="https://i.ibb.co/WGxhYzF/e17ab9681bec36303a67cd0e13a7b170.gif" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}