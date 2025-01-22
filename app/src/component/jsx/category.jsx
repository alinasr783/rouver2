import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import Skeleton from '@mui/material/Skeleton';
import "../css/category.css";
export default function Category(){
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleClick = (name) => {
    navigate(`/category/${name}`);
  }

  const getCategories = async () => {
    const { data, error } = await supabase.from("category").select("*");

    if (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    } else {
      setCategories(data);
      setLoading(false);
    }
  }
  useEffect(()=>{
    getCategories();
  },[])
  return(
    <>
      <div className="category">
        <div className="category-content">
          <div className="category-content-title">Category</div>
          {loading ? (
            <Skeleton variant="rounded" width="100%" height={90} />
          ):(
      <div className="category-content-items">
        {categories.map((category, index)=>(
          <div className="category-content-items-item" onClick={()=>handleClick(category.id)}>
            <img src={`${category.image}`} />
          </div>
        ))}
      </div>
          )}
        </div>
      </div>
    </>
  )
}