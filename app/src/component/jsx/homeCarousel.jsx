import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import "../css/homeCarousel.css";
import { EffectCube, Pagination, Mousewheel } from "swiper/modules";

export default function HomeCarousel() {
  return (
    <div className="home-carousel">
      <div className="home-carousel-content">
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
          <SwiperSlide>
            <img
              src="https://i.ibb.co/vDZcMPF/photo-1574182245530-967d9b3831af.jpg"
              alt="Slide 1"
              className="home-carousel-img"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Swiper
              direction={'vertical'}
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
              modules={[EffectCube ,Mousewheel, Pagination]}
              className="home-carousel-content-swiper"
            >
              <SwiperSlide>
                <img
                  src="https://i.ibb.co/vDZcMPF/photo-1574182245530-967d9b3831af.jpg"
                  alt="Slide 3"
                  className="home-carousel-img"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://i.ibb.co/vDZcMPF/photo-1574182245530-967d9b3831af.jpg"
                  alt="Slide 3"
                  className="home-carousel-img"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://i.ibb.co/vDZcMPF/photo-1574182245530-967d9b3831af.jpg"
                  alt="Slide 3"
                  className="home-carousel-img"
                />
              </SwiperSlide>
            </Swiper>
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://i.ibb.co/vDZcMPF/photo-1574182245530-967d9b3831af.jpg"
              alt="Slide 3"
              className="home-carousel-img"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}