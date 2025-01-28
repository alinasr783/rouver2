import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Header from "../../component/jsx/header.jsx";
import ProductCard from "../../component/jsx/productCard.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import { supabase } from "../../lib/supabase.js";

export default function Category() {
  const { id } = useParams(); // جلب category_id من الرابط
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // تمرير الصفحة لأعلاها عند تحميل المكون

    // جلب بيانات الفئة والمنتجات
    const fetchCategoryData = async () => {
      if (!id) {
        console.error("Category ID is missing");
        return;
      }

      try {
        // جلب اسم الفئة
        const { data: categoryData, error: categoryError } = await supabase
          .from("category")
          .select("name")
          .eq("id", id)
          .single();

        if (categoryError) throw categoryError;

        setCategoryName(categoryData.name);

        // جلب المنتجات المرتبطة بـ category_id
        const { data: productsData, error: productsError } = await supabase
          .from("product")
          .select("*")
          .eq("category", id);

        if (productsError) throw productsError;

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false); // إنهاء التحميل
      }
    };

    fetchCategoryData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header title="Loading..." />
        <div className="home-products">
          <div className="home-products-content">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="43%"
                height={170}
                style={{ margin: "10px" }}
              />
            ))}
          </div>
        </div>
        <BottomHeader />
      </>
    );
  }

  return (
    <>
      <Header title={categoryName || `Category ${id}`} />
      <div className="home-products">
        {products.length > 0 ? (
          <div className="home-products-content">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
      <div>
        No products found in this category.
      </div>
        )}
      </div>
      <BottomHeader />
    </>
  );
}