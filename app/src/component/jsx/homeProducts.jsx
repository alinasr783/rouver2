import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { Swiper, SwiperSlide } from "swiper/react";
import Skeleton from "@mui/material/Skeleton";
import { chunk } from "lodash"; // تأكد من أنك قد قمت بتثبيت lodash عبر npm
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import "swiper/css/effect-cards";
import "swiper/css";
import { EffectCube, Pagination, EffectCards } from "swiper/modules";
import ProductCard from "./productCard.jsx";
import "../css/homeProducts.css";

export default function HomeProducts() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState([]);
  const [top_rating, setTop_rating] = useState([]);
  const [best_price, setBest_price] = useState([]);

  const getProduct = async () => {
    const { data, error } = await supabase.from("product").select("*");
    if (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    } else {
      setProduct(data);
      setLoading(false);
      console.log(data);
    }
  };
  

  
  useEffect(() => {
    getProduct();
  }, []);
  useEffect(() => {
    if (product.length > 0) {
      const newProducts = [];
      const topRatedProducts = [];
      const bestPriceProducts = [];

      product.forEach((item) => {
        item.tags.forEach((el) => {
          if (el === "new") newProducts.push(item);
          if (el === "top_rating") topRatedProducts.push(item);
          if (el === "best_price") bestPriceProducts.push(item);
        });
      });

      setNewProduct(newProducts);
      setTop_rating(topRatedProducts);
      setBest_price(bestPriceProducts);
    }
  }, [product]);
  return (
    <>
      <div className="home-products">
        {loading ? (
          <Skeleton variant="rounded" width="98%" height={230} />
        ) : (
          <>
            <div className="home-products-title">Products</div>
            <div className="home-products-content">
              <ProductCard product={product[0]} slide={true} />
              <ProductCard product={product[1]} slide={true} />
              <ProductCard product={product[2]} slide={true} />
              <ProductCard product={product[3]} slide={true} />
            </div>
            {best_price.length > 0 && (
              <>
                <div className="home-products-title">Best Price</div>
                <div className="home-products-content">
                  <Swiper
                    effect="cube"
                    grabCursor
                    cubeEffect={{
                      shadow: false,
                      slideShadows: false,
                      shadowOffset: 20,
                      shadowScale: 0.94,
                    }}
                    modules={[EffectCube]}
                    className="home-products-cube"
                  >
                    {chunk(best_price, 4).map((group, index) => (
                      <SwiperSlide key={index}>
                        <div className="flex">
                          {group[0] && <ProductCard product={group[0]} />}
                          {group[1] && <ProductCard product={group[1]} />}
                        </div>
                        <div className="flex">
                          {group[2] && <ProductCard product={group[2]} />}
                          {group[3] && <ProductCard product={group[3]} />}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </>
            )}
            {top_rating.length > 0 && (
            <>
              <div className="home-products-title">Top Rating</div>

              <div className="home-products-content">
                {top_rating.map((el)=>(
                  <ProductCard product={el} slide={true} />
                ))}
              </div>
            </>
            )}
            {newProduct.length > 0 && (
            <div className="home-products-title">Look at here</div>
            )}
            <div className="home-products-content">
              <Swiper
                slidesPerView={2}
                spaceBetween={30}
                centeredSlides={true}
                className="home-products-swiper"
              >
                {newProduct.map((el)=>(
                <SwiperSlide>
                  <ProductCard product={el} />
                </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {/*<div className="home-products-content cards">
    <Swiper
      effect={'cards'}
      grabCursor={true}
      modules={[EffectCards]}
      className="home-products-cards"
    >
      <SwiperSlide className="home-products-card">
        <ProductCard product={product[0]} slide={false}/>
      </SwiperSlide>
      <SwiperSlide>
        <ProductCard product={product[0]} slide={false}/>
      </SwiperSlide>
    </Swiper>
  </div>*/}
          </>
        )}
      </div>
    </>
  );
}
