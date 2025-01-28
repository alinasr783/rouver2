import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { supabase } from "../../lib/supabase.js";
import Skeleton from '@mui/material/Skeleton';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import "../css/homeCarousel.css";
import { EffectCube, Pagination } from "swiper/modules";

export default function HomeCarousel() {
  const navigate = useNavigate();
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSliders = async () => {
    const { data, error } = await supabase.from("slider").select("*");

    if (error) {
      console.error("Error fetching sliders:", error);
    } else {
      setSliders(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSliders();
  }, []);

  return (
    <div className="home-carousel">
      <div className="home-carousel-content">
        {loading ? (
          <Skeleton variant="rounded" width="98%" height={230} />
        ) : (
          <Swiper
            effect="cube"
            grabCursor
            cubeEffect={{
              shadow: false,
              slideShadows: false,
              shadowOffset: 20,
              shadowScale: 0.94,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[EffectCube, Pagination]}
            className="home-carousel-content-swiper"
          >
            {sliders.map((slider, index) => (
              <SwiperSlide key={index} onClick={()=>{navigate(`/${slider.link}`)}}>
                <img
                  src={slider.image} // استخدم الحقل الذي يحتوي على رابط الصورة
                  alt={`Slide ${index + 1}`}
                  className="home-carousel-img"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}