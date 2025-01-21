import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import '../css/test.css'; // ملف CSS منفصل

export default function Test() {
  const progressBars = useRef([]);
  const swiperRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false); // حالة لتتبع إذا كان الوقت متوقفًا

  const onAutoplayTimeLeft = (swiper, time, progress) => {
    const activeIndex = swiper.activeIndex;
    progressBars.current.forEach((bar, index) => {
      const progressFill = bar.querySelector('.progress-fill');
      if (index === activeIndex) {
        progressFill.style.setProperty("width", `${(1 - progress) * 100}%`);
      } else if (index < activeIndex) {
        progressFill.style.setProperty("width", "100%");
      } else {
        progressFill.style.setProperty("width", "0%");
      }
    });
  };

  const handlePause = (e) => {
    e.preventDefault(); // منع الحدث الافتراضي عند الضغط
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop(); // إيقاف السلايدر
      setIsPaused(true); // تعيين الحالة لتوقف السلايدر
    }
  };

  const handleResume = () => {
    if (swiperRef.current && isPaused) {
      swiperRef.current.autoplay.start(); // استئناف السلايدر
      setIsPaused(false); // تعيين الحالة لاستئناف السلايدر
    }
  };

  const handleNextSlide = () => {
    if (swiperRef.current) swiperRef.current.swiper.slideNext(); // الانتقال إلى الشريحة التالية
  };

  const handlePrevSlide = () => {
    if (swiperRef.current) swiperRef.current.swiper.slidePrev(); // الانتقال إلى الشريحة السابقة
  };

  const handleClick = (e) => {
    const { clientX, target } = e;
    const width = target.offsetWidth;
    const halfWidth = width / 2;

    // إذا كان الضغط على الجهة اليمنى
    if (clientX > halfWidth) {
      handleNextSlide(); // الانتقال إلى الشريحة التالية
    } else {
      handlePrevSlide(); // الانتقال إلى الشريحة السابقة
    }
  };

  return (
    <div className="instagram-story-container">
      {/* Progress Bars */}
      <div className="progress-indicators">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="progress-bar"
            ref={(el) => (progressBars.current[index] = el)}
          >
            <div className="progress-fill"></div> {/* شريط التقدم الأخضر */}
          </div>
        ))}
      </div>

      {/* Swiper */}
      <Swiper
        ref={swiperRef}
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 5000, // مدة عرض كل صورة
          disableOnInteraction: false,
        }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        modules={[Autoplay]}
        className="swiper-container"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <SwiperSlide key={index} className="story-slide">
            <div
              className="story-content"
              onClick={handleClick} // عند النقر على الصورة
            >
              <img
                src="https://i.ibb.co/vDZcMPF/photo-1574182245530-967d9b3831af.jpg"
                alt={`Slide ${index + 1}`}
                className="story-image"
              />
              {/* الديف الشفاف لتحديد المنطقة التي تلمسها لتوقف الوقت */}
              <div
                className="overlay"
                onTouchStart={(e) => handlePause(e)} // عند الضغط (للموبايل)
                onTouchMove={(e) => e.preventDefault()} // منع أي تفاعل أثناء تحريك الأصبع
                onTouchEnd={handleResume} // عند رفع اليد (للموبايل)
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}