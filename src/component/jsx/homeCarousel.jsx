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
  const [error, setError] = useState(null);

  const fetchSliders = async () => {
    try {
      const { data, error } = await supabase.from("slider").select("*");
      if (error) throw error;
      setSliders(data);
    } catch (err) {
      setError(err.message);
      console.error("Slider fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleSlideClick = (link) => {
    if (link) navigate(`/${link}`);
  };

  if (error) return <div className="carousel-error">Error loading slides</div>;

  return (
    <div className="home-carousel">
      <div className="home-carousel-content">
        {loading ? (
          <Skeleton 
            variant="rounded" 
            width="98%" 
            height={230} 
            sx={{ borderRadius: 2 }}
          />
        ) : (
          <Swiper
            effect="cube"
            grabCursor
            cubeEffect={{
              shadow: false,
              slideShadows: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            modules={[EffectCube, Pagination]}
            className="home-carousel-content-swiper"
          >
            {sliders.map((slider, index) => (
              <SwiperSlide 
                key={slider.id || index}
                onClick={() => handleSlideClick(slider.link)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={slider.image}
                  alt={`Slide: ${slider.title || index + 1}`}
                  className="home-carousel-img"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}