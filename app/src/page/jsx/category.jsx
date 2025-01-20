import React,{useState} from "react";
import { useParams } from "react-router-dom";
import Header from "../../component/jsx/header.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import 'swiper/css/effect-cards';
import "swiper/css";
import { EffectCube, Pagination,  EffectCards } from "swiper/modules";
import ProductCard from "../../component/jsx/productCard.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
export default function Category(){
  const [product, setProduct] = useState([{title:"Rouver",price:10,rating:4.5,img:"https://i.ibb.co/VHtV3gP/rouver-high-resolution-logo.png"}]);
  const { name } = useParams();
  return(
    <>
      <Header title={name}/>
      <div className="home-products">
        <div className="home-products-content">
        <ProductCard product={product[0]} slide={true}/>
        <ProductCard product={product[0]} slide={true}/>
        <ProductCard product={product[0]} slide={true}/>
        <ProductCard product={product[0]} slide={true}/>
        </div>
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
          <SwiperSlide>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
          </SwiperSlide>
        </Swiper>
        </div>
        <div className="home-products-content">
        <ProductCard product={product[0]} slide={true}/>
        <ProductCard product={product[0]} slide={true}/>
        <ProductCard product={product[0]} slide={true}/>
        <ProductCard product={product[0]} slide={true}/>
        </div>
        <div className="home-products-content">
        <Swiper slidesPerView={2}
          spaceBetween={30}
          centeredSlides={true}
          className="home-products-swiper"
        >
          <SwiperSlide>
            <ProductCard product={product[0]}/>
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard product={product[0]}/>
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard product={product[0]}/>
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard product={product[0]}/>
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard product={product[0]}/>
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard product={product[0]}/>
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard product={product[0]}/>
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard product={product[0]}/>
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard product={product[0]}/>
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard product={product[0]}/>
          </SwiperSlide>
        </Swiper>
        </div>
        <div className="home-products-content">
        <ProductCard product={product[0]} slide={true}/>
        <ProductCard product={product[0]} slide={true}/>
        <ProductCard product={product[0]} slide={true}/>
        <ProductCard product={product[0]} slide={true}/>
        </div>
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
          <SwiperSlide>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
            <div className="flex">
              <ProductCard product={product[0]}/>
              <ProductCard product={product[0]}/>
            </div>
          </SwiperSlide>
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
      </div>
      <BottomHeader />
    </>
  )
}